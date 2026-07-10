// `agentstate-lite sync --establish` — turn a LOCAL bundle into the shared board (greenfield combo
// 1, plans/sync-greenfield-establish). `init` creates a local bundle; THIS is the one explicit act
// that PUBLISHES it — never automatic, never inferred from a bare `sync` (a solo-local agent runs
// bare `sync` reflexively; auto-establishing would silently make a private bundle world-readable).
//
// PRECONDITION LADDER (D5) — every check below runs BEFORE any mutation, in this order: inside a
// git repo → an `origin` remote is configured → `fetchOrigin` SUCCEEDS (mandatory — establishing
// offline would let a stale view of origin create a board that collides with one a teammate
// already pushed) → ALREADY ESTABLISHED? (a local `board` branch or `origin/board` already exists
// → note it and let the caller fall through to the ordinary sync flow, never a refusal) → no
// `board/…` namespace branches (they make `refs/heads/board` uncreatable) → the conventional folder
// is a PLAIN, non-empty directory carrying `index.md`, with no nested `.git` of its own, not
// committed at HEAD (a committed folder is the separate `sync --migrate` case), and not bound
// elsewhere by a committed `.agentstate.json` (out of the git-sync tier by design).
//
// MECHANISM (D3) — empty-root + swap, NOT migrate's `commit-tree HEAD:folder` (a greenfield folder
// is uncommitted; there is no tree object at HEAD to lift):
//   1. create the `board` branch from EMPTY (`createEmptyRootBoardBranch` — object/ref writes only).
//   2. rename the existing bundle folder ASIDE (`.agentstate-lite.establishing-<pid>`) — NEVER
//      delete. A crash HERE (after step 1, before step 4 moves the content back) leaves the local
//      `board` branch from step 1 ALREADY extant — never "no board" — so review's crash-window B is
//      NOT "nothing to sync": a plain sync self-heals via one of TWO pre-existing, safe refusals,
//      never a silent empty publish. Crash before this rename completes: the conventional path is
//      still non-empty and not yet a worktree, so `provisionBoardWorktree`'s OWN "foreign non-empty
//      directory" self-heal refuses (move-it-aside guidance) — the SAME refusal that already exists
//      for any stray directory sitting at the conventional path. Crash after this rename (before
//      step 4 moves content back): the conventional path gets provisioned EMPTY (the step-1 branch
//      has no tree entries yet), and a plain sync's bundle-evidence guard (git.ts's `no_upstream`
//      check in sync.ts — the SAME one that stops publishing an unrelated local `board` branch)
//      refuses an empty board with no root `index.md` rather than publishing it. Either halt is
//      non-destructive: the pre-establish content is NEVER deleted, only ever renamed aside, and is
//      recoverable by hand (moving the aside folder's contents back — which itself may re-trigger
//      the foreign-directory refusal above, itself still safe, still non-destructive).
//   3. `provisionBoardWorktree` — the folder's conventional path is now empty, so this is a clean
//      `worktree add` of the fresh `board` branch (the existing self-heal `hasLocal` arm; no new
//      provisioning logic).
//   4. move the aside folder's CONTENTS into the freshly provisioned worktree; remove the (now
//      empty) aside folder.
//   5. `stageAndCommit` — the ONE commit grammar, per-doc attribution (git.ts). A crash between
//      steps 4 and 5 self-heals for free: the next plain sync's own STEP 2 commits the untracked
//      content sitting in an already-provisioned worktree.
//   6. append the working-tree `.gitignore` entry (decision 3 — idempotent, uncommitted, NEVER
//      committed to the code branch).
//   7. push WITH TRACKING — combo 2's own publish mechanism (`pushBoardUpstream`), so a crash after
//      step 5 but before the push leaves exactly combo 2's "present locally / absent on origin"
//      state, which a plain sync completes on its own (this module's caller, `sync.ts`, runs the
//      SAME combo-2 branch for a bare `sync` against a hand-built or crash-recovered local board).
//
// Establish also seeds the per-clone cursor/cache/marker + records self actors (mirrors sync's own
// step 5) so the first home/session-start render after establishing doesn't mistake the just-seeded
// docs for a teammate's incoming activity.
import { existsSync, readdirSync, renameSync, rmdirSync, statSync } from "node:fs";
import path from "node:path";

import { resolveProjectBinding } from "../bundle.js";
import { CliError, classifyGitError, type GitFailure } from "../errors.js";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  GITIGNORE_ENTRY,
  boardNamespaceConflicts,
  createEmptyRootBoardBranch,
  ensureBoardGitignoreWorkingTree,
  fetchOrigin,
  provisionBoardWorktree,
  pushBoardUpstream,
  repoTopLevel,
  runGit,
  stageAndCommit,
  unpushedCount,
} from "../git.js";
import { recordSelfActors, refreshMarker, writeCache, writeCursor } from "../cursor.js";
import { render, type OutputMode } from "../output.js";
import { hookInstallHintOnce, resolveBundleKey, singleActor, type SyncCliDeps } from "./sync.js";

/** The one-time success announcement (test-pinned). */
export const ESTABLISH_DONE =
  "the shared board is live — .agentstate-lite/ now syncs over the 'board' branch";

/** The idempotent re-run note (test-pinned) — establish already happened; nothing new to do here. */
export const ESTABLISH_ALREADY = "already established";

/** The receipt's `next_steps` — the whole onboarding chain a teammate needs (test-pinned order). */
export function establishNextSteps(inv: string): string[] {
  return [
    `teammates just run '${inv} sync' — it provisions automatically`,
    `'${inv} hook install' keeps session start board-aware`,
  ];
}

/** A {@link GitFailure} for classification from a tolerated-but-failed invocation. */
function failureOf(args: string[], r: { status: number; stdout: string; stderr: string }): GitFailure {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}

/** Run a git op that MUST succeed; a nonzero exit throws the classified CliError. */
function mustGit(dir: string, args: string[], input?: string): string {
  const r = runGit(dir, args, input !== undefined ? { input } : {});
  if (r.status !== 0) throw classifyGitError(failureOf(args, r));
  return r.stdout;
}

/** True when the conventional bundle folder is committed at HEAD — the separate `--migrate` case. */
function folderCommittedAtHead(top: string): boolean {
  return runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0;
}

/**
 * The precondition ladder's folder-shape checks (D5's tail): the conventional path must be a
 * PLAIN, non-empty directory carrying `index.md`, with no nested `.git` of its own. Throws the
 * specific refusal for whichever shape is wrong; returns the resolved absolute path when it's fine
 * to rename aside.
 */
function assertPlainBundleFolder(top: string, inv: string): string {
  const boardPath = path.join(top, BUNDLE_DIR);
  const runInitHelp = `${inv} init --dir ${BUNDLE_DIR}`;
  if (!existsSync(boardPath)) {
    throw new CliError(
      "RUNTIME",
      `no '${BUNDLE_DIR}/' folder here to establish — run '${inv} init --dir ${BUNDLE_DIR}' first, ` +
        `then re-run establish`,
      { help: runInitHelp },
    );
  }
  if (!statSync(boardPath).isDirectory()) {
    throw new CliError(
      "RUNTIME",
      `'${boardPath}' exists but is not a directory — establish needs a plain bundle folder there`,
    );
  }
  if (existsSync(path.join(boardPath, ".git"))) {
    throw new CliError(
      "RUNTIME",
      `'${boardPath}' already contains its own '.git' — establish only operates on a PLAIN bundle ` +
        `folder (not git checkout machinery); move it aside if this is unrelated, then re-run`,
    );
  }
  const entries = readdirSync(boardPath);
  if (entries.length === 0) {
    throw new CliError(
      "RUNTIME",
      `'${boardPath}' is empty — run '${inv} init --dir ${BUNDLE_DIR}' first, then re-run establish`,
      { help: runInitHelp },
    );
  }
  if (!existsSync(path.join(boardPath, "index.md"))) {
    throw new CliError(
      "RUNTIME",
      `'${boardPath}' doesn't look like an OKF bundle (no index.md) — run '${inv} init --dir ` +
        `${BUNDLE_DIR}' first, then re-run establish`,
      { help: runInitHelp },
    );
  }
  if (folderCommittedAtHead(top)) {
    throw new CliError(
      "RUNTIME",
      `'${BUNDLE_DIR}/' is already committed on this branch — that is the '${inv} sync --migrate' ` +
        `case (a different one-time move for a committed-folder project), not establish`,
      { help: `${inv} sync --migrate` },
    );
  }
  return boardPath;
}

/**
 * The `.agentstate.json`-bound out-of-tree refusal (test list edge): a committed project binding
 * that points this project's bundle SOMEWHERE OTHER than the conventional folder means the bundle
 * is deliberately out of the git-sync tier — establish must not silently start sharing it anyway.
 */
async function assertNotBoundElsewhere(top: string, boardPath: string): Promise<void> {
  const binding = await resolveProjectBinding(top);
  if (!binding) return;
  const boundIsConventional = !binding.isRemote && path.resolve(binding.target) === boardPath;
  if (boundIsConventional) return;
  throw new CliError(
    "RUNTIME",
    `a project binding (${binding.file}) points this project's bundle at ` +
      `${binding.isRemote ? `a remote (${binding.target})` : binding.target} — establish only ` +
      `manages the conventional '${BUNDLE_DIR}/' folder shared over the '${BOARD_BRANCH}' branch; ` +
      `this bundle is out of the git-sync tier by design`,
    { help: `fix or remove ${binding.file} if you want to share this bundle over the board branch` },
  );
}

/** True when a board is reachable ANY way already (local branch or `origin/board`) — the "already established" gate. */
function boardAlreadyReachable(top: string): boolean {
  const hasLocal = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
  const hasRemote = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  return hasLocal || hasRemote;
}

/**
 * `sync --establish`'s outcome, consumed by `sync.ts`'s dispatch: `already: true` means NOTHING was
 * mutated — the caller falls through to the ordinary sync flow (folding {@link ESTABLISH_ALREADY}
 * into whatever receipt it ultimately renders); `already: false` means this function already printed
 * its OWN complete receipt and the caller should return immediately.
 */
export type EstablishOutcome = { already: true } | { already: false };

/**
 * Run `sync --establish`. `dir` is the CALLER's already-retargeted directory (mirrors bare sync's
 * own `retargetBoardInterior` — this function does not re-derive it, avoiding a second resolution
 * rule). Throws a structured `CliError` for every precondition refusal; returns {@link
 * EstablishOutcome} otherwise.
 */
export async function establishBoard(
  dir: string,
  inv: string,
  mode: OutputMode,
  stdout: (s: string) => void,
  deps: Partial<SyncCliDeps>,
): Promise<EstablishOutcome> {
  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError(
      "RUNTIME",
      "not inside a git repository — establish needs a git repo with an 'origin' remote to publish " +
        "the board to",
      { help: "git init, then git remote add origin <url>" },
    );
  }
  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError(
      "RUNTIME",
      `this repository has no '${BOARD_REMOTE}' remote — establish publishes the board branch to ` +
        `${BOARD_REMOTE}; add the remote, then re-run`,
    );
  }
  if (!fetchOrigin(top)) {
    throw new CliError(
      "TRANSIENT",
      `establish refused: could not reach '${BOARD_REMOTE}' — establishing verifies no board already ` +
        `exists there and must push the new board branch, neither of which can happen offline; get ` +
        `online, then re-run`,
      { details: { retryable: true } },
    );
  }

  // ALREADY ESTABLISHED (any of combos 2/3/4): note it, mutate NOTHING, let the caller proceed as
  // an ordinary sync — never a second, bespoke flow for a state the regular sync path already
  // handles correctly.
  if (boardAlreadyReachable(top)) {
    return { already: true };
  }

  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError(
      "RUNTIME",
      `establish refused: branches named '${BOARD_BRANCH}/…' exist — git cannot create a ` +
        `'${BOARD_BRANCH}' branch alongside them: ${namespaceConflicts.join(", ")}`,
      {
        details: { conflicting_branches: namespaceConflicts },
        help: `delete or rename these branches, then re-run ${inv} sync --establish`,
      },
    );
  }

  const boardPath = assertPlainBundleFolder(top, inv);
  await assertNotBoundElsewhere(top, boardPath);

  // ── mutate: empty-root branch → rename aside → provision → move contents in → commit → gitignore ──

  createEmptyRootBoardBranch(top);

  const asideDir = `${boardPath}.establishing-${process.pid}`;
  renameSync(boardPath, asideDir);

  const outcome = provisionBoardWorktree(top);
  if (outcome.kind !== "provisioned") {
    // Unreachable in practice (no board existed anywhere a moment ago, and the conventional path
    // is now empty) — never silently swallow a surprise; the pre-establish content is preserved.
    throw new CliError(
      "RUNTIME",
      `establish's own board provisioning did not behave as expected (${outcome.kind}) — the ` +
        `pre-establish folder is preserved at ${asideDir}, untouched`,
      { details: { outcome: outcome.kind } },
    );
  }
  const provisionedPath = outcome.boardPath;

  for (const name of readdirSync(asideDir)) {
    renameSync(path.join(asideDir, name), path.join(provisionedPath, name));
  }
  rmdirSync(asideDir);

  const key = resolveBundleKey(provisionedPath);
  await refreshMarker(key);

  const commitResult = stageAndCommit(provisionedPath);
  if (commitResult.committed && commitResult.docs.length > 0) {
    await recordSelfActors(key, commitResult.docs.map((d) => d.actor));
  }

  const gi = ensureBoardGitignoreWorkingTree(top);
  const gitignoreNote = gi.changed
    ? `${gi.path} — appended '${GITIGNORE_ENTRY}' (uncommitted; commit it so teammates' clones stay clean)`
    : `${gi.path} — already ignores '${BUNDLE_DIR}/'`;

  const boardCommit = commitResult.sha ?? mustGit(provisionedPath, ["rev-parse", "HEAD"]).trim();

  try {
    pushBoardUpstream(provisionedPath);
  } catch (err) {
    // THE ESTABLISH RACE (matrix note): a teammate established (and pushed) between OUR fetch,
    // above, and this push — `origin/board` now names an UNRELATED history, so the unconditional
    // push is rejected (never force-pushed). Nothing here is lost: the empty-root branch, the
    // moved bundle, its commit, and the gitignore entry all already landed LOCALLY — exactly
    // combo 2's "present locally / absent-as-WE-knew-it on origin" shape. The fix is the same
    // one combo 2 always uses: a plain `sync` (no flag) converges the two unrelated histories
    // (teammate's kept, ours exported) via the SAME rebase mechanic every other conflict uses.
    throw new CliError(
      "RUNTIME",
      `establish's push was rejected — it looks like a teammate published the board first, in the ` +
        `narrow window between this run's own fetch and its push. Nothing is lost: the bundle is ` +
        `committed locally at ${boardCommit} — run \`${inv} sync\` (without --establish) to converge ` +
        `it onto the now-published board`,
      { details: { board_commit: boardCommit, cause: err instanceof Error ? err.message : String(err) } },
    );
  }
  await writeCursor(key, { tier: "git", token: boardCommit });
  await writeCache(key, {
    updatedAt: new Date().toISOString(),
    delta: [],
    unpushedCount: unpushedCount(provisionedPath) ?? 0,
    uncommittedCount: 0,
  });

  const receipt: Record<string, unknown> = {
    established: ESTABLISH_DONE,
    board_commit: boardCommit,
    committed: commitResult.docs.length,
  };
  const actor = singleActor(commitResult.docs);
  if (actor) receipt.actor = actor;
  receipt.pushed = `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`;
  receipt.gitignore = gitignoreNote;
  receipt.next_steps = establishNextSteps(inv);
  const hint = await hookInstallHintOnce(key, inv, deps.hookInstalled);
  if (hint) receipt.hint = hint;

  stdout(render(receipt, mode));
  return { already: false };
}
