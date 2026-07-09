// `agentstate-lite sync --migrate` — the ONE-TIME move of a board that is committed as a plain
// folder on a project's default branch onto its own dedicated `board` branch (U5,
// plans/sync-verb-implementation §U5, as amended by decisions/board-branch-sync rider 1 and the
// 2026-07-09 PR-shaped-removal adjudication).
//
// ⚠ TEMPORARY (Brian, 2026-07-09): this flag exists for the FOUNDERS' one-time migration of this
// project's own board and is SCHEDULED FOR REMOVAL in a follow-up PR once that migration executes
// (the removal PR deletes the flag, this module, and its tests together). It is deliberately kept
// off every taught surface — it appears in `sync --help` only, never in the skill channels or the
// compact command reference. Wake condition for re-adding: a real external team asking to move a
// committed board folder to branch-sharing — the reviewed implementation lives in git history.
//
// BINDING SHAPE (the decision's riders + the adjudication):
//   • FILES, NOT HISTORY (rider 1): the `board` branch is created as a fresh ROOT commit carrying
//     the folder's CURRENT committed files at the branch root — `git commit-tree` over
//     `HEAD:.agentstate-lite`'s tree object, with NO parents. The folder's pre-migration history
//     (and anything ever scrubbed out of it) never enters the shared branch. The plan's older
//     `git subtree split` step (which preserved history) is SUPERSEDED by this rider.
//   • PUSH -u (panel round 2): `git push -u origin board` — the tracking config is load-bearing;
//     see `pushBoardUpstream` in git.ts.
//   • PR-SHAPED REMOVAL (Brian, 2026-07-09): the folder-removal + .gitignore commit lands on a NEW
//     local branch (`board-migration`), built with PLUMBING ONLY (`ls-tree` → `mktree` →
//     `commit-tree`) — the working tree, the index, and the current branch are never touched, and
//     NOTHING on the current branch is pushed. The human pushes that branch and opens the PR; the
//     receipt says so, and states honestly what the both-worlds window means until it merges.
//   • NEVER any `git clean` (adjudication H): the `git clean -fdx` line in the rollout note below
//     is COPY the founders forward to teammates — nothing here ever executes it.
//
// WHY THIS CLONE IS NOT PROVISIONED BY --migrate (a deliberate deviation from the plan's original
// "self-provision this clone" step, forced by the PR-shaped adjudication): until the migration PR
// merges, the CURRENT branch still TRACKS `.agentstate-lite/` — and a board checkout materialized
// alongside those tracked paths would be silently OVERLAID by the user's own next
// `git checkout <branch>` (git treats ignored files as expendable and overwrites them), after
// which a sync would commit the frozen main-side copies back onto the board. Instead both founders
// share ONE identical, safe journey: merge the PR → `git pull` (the folder vanishes) → `sync`
// (the folder returns as the live board, announced loudly per rider 2 of the decision).
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  fetchOriginTolerated,
  pushBoardUpstream,
  repoTopLevel,
  runGit,
} from "../git.js";
import { CliError, classifyGitError, type GitFailure } from "../errors.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

/** The local branch the folder-removal commit is prepared on — the human pushes it and opens the PR. */
export const MIGRATION_BRANCH = "board-migration";

/** The .gitignore line the removal commit adds (the folder is ignored on the default branch). */
export const GITIGNORE_ENTRY = `${BUNDLE_DIR}/`;

// ── pinned strings (test-pinned; NO forbidden vocabulary — worktree/linked/subtree never appear) ─

export const MIGRATE_PREVIEW = "preview — nothing has been changed; re-run with --yes to execute";

export const MIGRATE_ALREADY = "already migrated — a board branch already exists on origin";

export const MIGRATE_DONE =
  "the board branch is live on origin — push the migration branch and open its PR to finish";

/**
 * The both-worlds honesty line (test-pinned, per the 2026-07-09 adjudication): between the board
 * push and the PR merge the project runs in two worlds at once, and the receipt must say exactly
 * what that means — most importantly that the folder still committed on the default branch is a
 * DEAD COPY nobody should write to.
 */
export function bothWorldsLine(branch: string): string {
  return (
    `until the migration PR merges, this project is in a BOTH-WORLDS state: the shared board ` +
    `lives on the '${BOARD_BRANCH}' branch (live on ${BOARD_REMOTE} — sync is armed against it), ` +
    `while '${branch}' still carries the old committed folder. That folder is now a FROZEN ` +
    `SNAPSHOT that receives no further updates: treat it as read-only, don't write docs into it, ` +
    `and never merge '${BOARD_BRANCH}' into '${branch}'`
  );
}

/**
 * The rollout-note copy (plan §U5 COMMS): the one-time heads-up the founders forward to teammates
 * BEFORE the migration PR merges. Emitted in the preview (the pre-migration moment the plan says
 * the reassurance ships at) AND repeated in the receipt. The `git clean -fdx` line is COPY ONLY —
 * nothing in this module (or anywhere on the migration path) ever executes a `git clean`.
 */
export function rolloutNote(inv: string, branch: string): string[] {
  return [
    `after your next 'git pull', ${BUNDLE_DIR}/ disappears from '${branch}' — nothing is lost: ` +
      `the next '${inv} sync' re-creates it from the shared board branch`,
    `from then on '${inv} sync' — not 'git pull' — updates the board`,
    `you may notice a '${BOARD_BRANCH}' branch on the remote — never merge it into '${branch}'`,
    `'git clean -fdx' on '${branch}' removes the board checkout (recoverable — the next sync ` +
      `re-creates it from ${BOARD_REMOTE}; unpushed board commits are why you sync first)`,
    `re-run '${inv} hook install' so session start stays board-aware`,
  ];
}

/** The preview record — a genuinely useful dry run: what branch, what commits, what leaves where. */
export function previewRecord(inv: string, branch: string): Record<string, unknown> {
  return {
    migrate: MIGRATE_PREVIEW,
    create:
      `a new '${BOARD_BRANCH}' branch whose ONE root commit carries the current committed files ` +
      `of ${BUNDLE_DIR}/ — files only: the folder's history stays on '${branch}'`,
    push: `the new '${BOARD_BRANCH}' branch to ${BOARD_REMOTE}, with tracking (git push -u ${BOARD_REMOTE} ${BOARD_BRANCH})`,
    commit:
      `ONE commit on a new local '${MIGRATION_BRANCH}' branch removing ${BUNDLE_DIR}/ from ` +
      `'${branch}' and adding it to .gitignore — NOT pushed: you push that branch and open the ` +
      `PR yourself; nothing on '${branch}' is pushed or changed`,
    after_merge:
      `once the PR merges, on every clone: 'git pull' makes ${BUNDLE_DIR}/ vanish from ` +
      `'${branch}', and the next '${inv} sync' re-creates it from the ${BOARD_BRANCH} branch — ` +
      `nothing is lost`,
    both_worlds: bothWorldsLine(branch),
    before_you_run:
      `every founder should sync — at minimum commit — their board changes first: board work ` +
      `sitting uncommitted or unpushed on another machine cannot be detected from here, and it ` +
      `will NOT be on the new branch`,
    rollout_note: rolloutNote(inv, branch),
    run: `${inv} sync --migrate --yes`,
  };
}

// ── plumbing helpers ──────────────────────────────────────────────────────────

/** True when `refs/heads/<name>` resolves. */
function localBranchExists(top: string, name: string): boolean {
  return runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${name}`]).status === 0;
}

/** A {@link GitFailure} for classification from a tolerated-but-failed invocation. */
function failureOf(args: string[], r: { status: number; stdout: string; stderr: string }): GitFailure {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}

/** Run a migration git op that MUST succeed; a nonzero exit throws the classified CliError. */
function mustGit(top: string, args: string[], input?: string): string {
  const r = runGit(top, args, input !== undefined ? { input } : {});
  if (r.status !== 0) throw classifyGitError(failureOf(args, r));
  return r.stdout;
}

/**
 * The tree object of the committed `.agentstate-lite/` folder at HEAD, or null when the current
 * branch carries no such folder (or carries a non-directory of that name).
 */
function folderTreeAtHead(top: string): string | null {
  const r = runGit(top, ["rev-parse", "--verify", "--quiet", `HEAD:${BUNDLE_DIR}`]);
  if (r.status !== 0) return null;
  const sha = r.stdout.trim();
  const t = runGit(top, ["cat-file", "-t", sha]);
  if (t.status !== 0 || t.stdout.trim() !== "tree") return null;
  return sha;
}

interface TreeEntry {
  mode: string;
  type: string;
  sha: string;
  name: string;
}

/** Parse `ls-tree -z` output (NUL-terminated `<mode> <type> <sha>\t<name>` records). */
function parseLsTreeZ(out: string): TreeEntry[] {
  return out
    .split("\0")
    .filter((l) => l.length > 0)
    .map((l) => {
      const tab = l.indexOf("\t");
      const [mode = "", type = "", sha = ""] = l.slice(0, tab).split(" ");
      return { mode, type, sha, name: l.slice(tab + 1) };
    });
}

/**
 * Git's tree-entry sort key: entries are ordered by name bytes, with a directory comparing as if
 * suffixed by `/` — required because inserting a new `.gitignore` entry must keep the listing in
 * the canonical order `mktree` records.
 */
function treeSortKey(e: TreeEntry): string {
  return e.type === "tree" ? `${e.name}/` : e.name;
}

/**
 * Return `content` with the {@link GITIGNORE_ENTRY} line present — unchanged when any existing
 * line already ignores the folder (with or without leading/trailing slash), appended otherwise.
 */
export function withIgnoreEntry(content: string): string {
  const covered = content.split("\n").some((l) => {
    const t = l.trim();
    return t === BUNDLE_DIR || t === `${BUNDLE_DIR}/` || t === `/${BUNDLE_DIR}` || t === `/${BUNDLE_DIR}/`;
  });
  if (covered) return content;
  let out = content;
  if (out.length > 0 && !out.endsWith("\n")) out += "\n";
  if (out.length > 0) out += "\n";
  out += `# the shared board — managed on the '${BOARD_BRANCH}' branch by aslite sync\n${GITIGNORE_ENTRY}\n`;
  return out;
}

/** The board branch's one attributed root-commit message (attribution = the git author running it). */
function boardCommitMessage(branch: string): string {
  return (
    `board: bundle migrated from '${branch}' (files only)\n\n` +
    `One-time migration: the bundle's current files, moved onto the dedicated ` +
    `'${BOARD_BRANCH}' branch.\nThe folder's history stays on '${branch}'.\n`
  );
}

/** The removal commit's message (rides the human-opened migration PR). */
function removalCommitMessage(inv: string, branch: string): string {
  return (
    `board: move ${BUNDLE_DIR}/ to the '${BOARD_BRANCH}' branch\n\n` +
    `The board now lives on its own '${BOARD_BRANCH}' branch (pushed to ${BOARD_REMOTE}) and is ` +
    `ignored on '${branch}'.\nOnce this lands: 'git pull' (the folder vanishes), then ` +
    `'${inv} sync' (it returns as the live shared board).\n`
  );
}

/**
 * Create the board branch's ROOT commit (rider 1 — files, not history): `git commit-tree` over
 * the folder's tree at HEAD with NO parents, then point `refs/heads/board` at it. Object-store
 * and ref writes only; the working tree and index are untouched.
 */
function createBoardRootCommit(top: string, treeSha: string, branch: string): string {
  const sha = mustGit(top, ["commit-tree", treeSha], boardCommitMessage(branch)).trim();
  mustGit(top, ["branch", BOARD_BRANCH, sha]);
  return sha;
}

/**
 * Build the folder-removal commit with PLUMBING ONLY — HEAD's top-level tree minus the
 * `.agentstate-lite` entry, with `.gitignore` gaining the entry — parented on HEAD. The working
 * tree, the index, and the current branch are never touched (the PR-shaped adjudication), which
 * also means any STAGED user code stays exactly as staged.
 */
function createRemovalCommit(top: string, inv: string, branch: string): string {
  const headTree = mustGit(top, ["rev-parse", "HEAD^{tree}"]).trim();
  const entries = parseLsTreeZ(mustGit(top, ["ls-tree", "-z", headTree])).filter(
    (e) => e.name !== BUNDLE_DIR,
  );

  const existing = entries.find((e) => e.name === ".gitignore");
  const base = existing ? mustGit(top, ["cat-file", "blob", existing.sha]) : "";
  const updated = withIgnoreEntry(base);
  if (updated !== base) {
    const blob = mustGit(top, ["hash-object", "-w", "--stdin"], updated).trim();
    if (existing) {
      existing.sha = blob;
    } else {
      entries.push({ mode: "100644", type: "blob", sha: blob, name: ".gitignore" });
    }
  }

  entries.sort((a, b) => (treeSortKey(a) < treeSortKey(b) ? -1 : treeSortKey(a) > treeSortKey(b) ? 1 : 0));
  const mktreeInput = entries.map((e) => `${e.mode} ${e.type} ${e.sha}\t${e.name}\0`).join("");
  const newTree = mustGit(top, ["mktree", "-z"], mktreeInput).trim();
  return mustGit(top, ["commit-tree", newTree, "-p", "HEAD"], removalCommitMessage(inv, branch)).trim();
}

// ── the command ───────────────────────────────────────────────────────────────

/**
 * `sync --migrate [--yes]`. Preconditions are verified for BOTH the preview and the execution —
 * the preview is a dry run of the whole act, refusals included:
 *
 *  1. inside a git repo, with an `origin` remote;
 *  2. NOT already migrated (a board branch on origin → `already migrated`, exit 0 — idempotent);
 *  3. on a real branch (not detached, not `board` itself) that COMMITS `.agentstate-lite/`;
 *  4. no uncommitted changes under `.agentstate-lite/` (the refusal names them — they would be
 *     silently stranded in the frozen snapshot otherwise);
 *  5. no pre-existing `board-migration` branch, and any pre-existing LOCAL `board` branch must be
 *     the reusable remnant of an interrupted run (single root commit over the same tree) — a
 *     stray `board` branch used for something else refuses with guidance.
 *
 * The one precondition that CANNOT be checked from here — every founder has synced (at minimum
 * committed) their board changes — is stated as documented comms in the preview.
 */
export async function migrateBoard(
  dir: string,
  opts: { yes: boolean; json?: boolean },
  stdout: (s: string) => void,
): Promise<void> {
  const inv = cliInvocation();
  const mode = resolveMode({ json: opts.json });

  const top = repoTopLevel(dir);
  if (!top) {
    throw new CliError(
      "RUNTIME",
      `not inside a git repository — there is no committed ${BUNDLE_DIR}/ folder to migrate`,
    );
  }

  // Refresh origin/board knowledge when online (tolerated offline — the local refs decide).
  fetchOriginTolerated(top);

  // IDEMPOTENCE FIRST: a board branch on origin means the migration already happened (here, on a
  // teammate's clone, or in an interrupted run that got as far as the push) — exit 0.
  if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0) {
    const rec: Record<string, unknown> = { migrate: MIGRATE_ALREADY };
    if (folderTreeAtHead(top) !== null) {
      rec.note =
        `this clone still carries the committed ${BUNDLE_DIR}/ folder — the folder-removal ` +
        `commit is either waiting in the migration PR or already on the default branch: pull it, ` +
        `then run '${inv} sync' (the folder vanishes, then returns as the live board)`;
    }
    stdout(render(rec, mode));
    return;
  }

  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError(
      "RUNTIME",
      `this repository has no '${BOARD_REMOTE}' remote — migration publishes the board branch to ` +
        `${BOARD_REMOTE}; add the remote, then re-run`,
    );
  }

  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";
  if (branch === "HEAD") {
    throw new CliError(
      "RUNTIME",
      `the repository is on a detached HEAD — check out the branch that carries the committed ` +
        `${BUNDLE_DIR}/ folder, then re-run`,
    );
  }
  if (branch === BOARD_BRANCH) {
    throw new CliError(
      "RUNTIME",
      `the current branch is '${BOARD_BRANCH}' — run the migration from the branch that carries ` +
        `the committed folder ('${BOARD_BRANCH}' is the branch the migration creates)`,
    );
  }

  const treeSha = folderTreeAtHead(top);
  if (treeSha === null) {
    throw new CliError(
      "RUNTIME",
      `no committed ${BUNDLE_DIR}/ folder on the current branch — nothing to migrate`,
      {
        help:
          `${inv} init starts a fresh board; if a teammate already migrated this project, ` +
          `run ${inv} sync`,
      },
    );
  }

  // REFUSE on uncommitted board changes (spec-mandated, naming them): the board branch carries
  // HEAD's tree, so anything uncommitted would be silently stranded in the frozen snapshot.
  const status = runGit(top, ["status", "--porcelain", "--", BUNDLE_DIR]);
  const dirty = (status.status === 0 ? status.stdout : "")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)
    .map((l) => ({ status: l.slice(0, 2).trim(), path: l.slice(3) }));
  if (dirty.length > 0) {
    const shown = dirty.slice(0, 20);
    throw new CliError(
      "RUNTIME",
      `migration refused: ${BUNDLE_DIR}/ has uncommitted changes — commit (or discard) them ` +
        `first so the board branch carries the board's real current state`,
      {
        details: { uncommitted: { shown: shown.length, total: dirty.length, rows: shown } },
        help: `commit the board changes, then re-run ${inv} sync --migrate --yes`,
      },
    );
  }

  if (localBranchExists(top, MIGRATION_BRANCH)) {
    throw new CliError(
      "RUNTIME",
      `a '${MIGRATION_BRANCH}' branch already exists — if it is left over from an interrupted ` +
        `migration, push it and open its PR (or delete it: git branch -D ${MIGRATION_BRANCH}), ` +
        `then re-run`,
    );
  }

  // A pre-existing LOCAL board branch is reusable ONLY as the remnant of an interrupted run
  // (created here, crashed before the push): a single root commit over exactly this tree.
  let reuseBoardSha: string | null = null;
  if (localBranchExists(top, BOARD_BRANCH)) {
    const sha = mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}`]).trim();
    const tree = mustGit(top, ["rev-parse", `refs/heads/${BOARD_BRANCH}^{tree}`]).trim();
    const count = mustGit(top, ["rev-list", "--count", `refs/heads/${BOARD_BRANCH}`]).trim();
    if (tree === treeSha && count === "1") {
      reuseBoardSha = sha;
    } else {
      throw new CliError(
        "RUNTIME",
        `a local '${BOARD_BRANCH}' branch already exists and does not match the committed ` +
          `folder — if it is left over from an interrupted migration, delete it ` +
          `(git branch -D ${BOARD_BRANCH}); if it is used for something else, rename it — then re-run`,
      );
    }
  }

  if (!opts.yes) {
    stdout(render(previewRecord(inv, branch), mode));
    return;
  }

  // EXECUTE. Ordering is the recovery story: the board branch is created and pushed FIRST (a
  // failure before or during the push leaves the current branch bit-for-bit untouched, and a
  // re-run reuses the local root commit); the removal commit is prepared only after origin has
  // the board.
  const boardSha = reuseBoardSha ?? createBoardRootCommit(top, treeSha, branch);
  pushBoardUpstream(top);
  const removalSha = createRemovalCommit(top, inv, branch);
  mustGit(top, ["branch", MIGRATION_BRANCH, removalSha]);

  const receipt: Record<string, unknown> = {
    migrated: MIGRATE_DONE,
    board_commit: boardSha,
    pushed: `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`,
    removal_branch: MIGRATION_BRANCH,
    removal_commit: removalSha,
    next_steps: [
      `push the migration branch: git push -u ${BOARD_REMOTE} ${MIGRATION_BRANCH}`,
      `open a PR from '${MIGRATION_BRANCH}' into '${branch}' and merge it`,
      `after the merge lands: 'git pull', then '${inv} sync' — ${BUNDLE_DIR}/ vanishes from ` +
        `'${branch}' and comes back as the live shared board`,
    ],
    both_worlds: bothWorldsLine(branch),
    tell_your_teammates: rolloutNote(inv, branch),
  };
  stdout(render(receipt, mode));
}
