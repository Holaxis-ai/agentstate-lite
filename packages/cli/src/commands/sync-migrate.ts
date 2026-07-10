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
// "self-provision this clone" step, forced by the PR-shaped adjudication; mechanism corrected per
// the launch review): until the migration PR merges, the CURRENT branch still TRACKS
// `.agentstate-lite/` — the paths are NOT ignored yet (the .gitignore entry rides the unmerged
// removal commit). A board checkout materialized at that path would make every tracked file under
// it read as locally modified or deleted (PHANTOM MODIFICATIONS against the frozen committed
// copies); the user's own next `git checkout`/`git restore` would then rewrite those frozen
// copies over the board checkout's files, and the NEXT sync would commit-and-push that stale
// content back over teammates' board updates. Instead both founders share ONE identical, safe
// journey: merge the PR → `git pull` (the folder vanishes) → `sync` (the folder returns as the
// live board, announced loudly per rider 2 of the decision).
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  GITIGNORE_ENTRY,
  boardNamespaceConflicts,
  fetchOrigin,
  pushBoardUpstream,
  repoTopLevel,
  runGit,
  withIgnoreEntry,
} from "../git.js";
import { CliError, classifyGitError, type GitFailure } from "../errors.js";
import { render, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";

/** The local branch the folder-removal commit is prepared on — the human pushes it and opens the PR. */
export const MIGRATION_BRANCH = "board-migration";

// Re-export the shared gitignore transform for existing migrate consumers.
export { GITIGNORE_ENTRY, withIgnoreEntry } from "../git.js";

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
    `lives on the '${BOARD_BRANCH}' branch (live on ${BOARD_REMOTE}), while '${branch}' still ` +
    `carries the old committed folder. That folder is now a FROZEN SNAPSHOT that receives no ` +
    `further updates: treat it as read-only, don't write docs into it, and never merge ` +
    `'${BOARD_BRANCH}' into '${branch}'. Sync starts working on each clone once the PR merges ` +
    `and that clone runs 'git pull'`
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
    verified:
      `this preview already checked the machine-checkable preconditions: ${BOARD_REMOTE} is ` +
      `reachable, '${branch}' is not behind ${BOARD_REMOTE}/${branch} on board changes, and no ` +
      `'${BOARD_BRANCH}/…' branches exist (they would block creating the '${BOARD_BRANCH}' branch)`,
    rollout_note: rolloutNote(inv, branch),
    run: `${inv} sync --migrate --yes`,
  };
}

/** The receipt/recovery next-steps chain (one source — the crash-recovery path re-emits it). */
export function nextSteps(inv: string, branch: string): string[] {
  return [
    `push the migration branch: git push -u ${BOARD_REMOTE} ${MIGRATION_BRANCH}`,
    `open a PR from '${MIGRATION_BRANCH}' into '${branch}' and merge it`,
    `after the merge lands: 'git pull', then '${inv} sync' — ${BUNDLE_DIR}/ vanishes from ` +
      `'${branch}' and comes back as the live shared board`,
  ];
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

/**
 * U5 fix round (review HIGH 1) — the behind-origin freshness guard's probe: the commits on
 * `origin/<branch>` that this clone does NOT have and that TOUCH the board folder. Migrating past
 * such a commit is the reviewer-driven disaster: the teammate's `board:` commit is orphaned on
 * the frozen folder FOREVER (the root commit is cut from stale HEAD, the removal PR merges
 * cleanly, and sync refuses everywhere). Returns null when `origin/<branch>` doesn't resolve
 * (a never-pushed branch — nothing to be behind of); commits that DON'T touch the folder are
 * deliberately not blocking (the board tree is identical either way, and the removal PR merge
 * resolves the rest).
 */
function behindBoardCommits(top: string, branch: string): string[] | null {
  const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
  if (runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status !== 0) return null;
  return mustGit(top, ["rev-list", `HEAD..${remoteRef}`, "--", BUNDLE_DIR])
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/** Throw the behind-origin refusal (review HIGH 1) when {@link behindBoardCommits} found any. */
function assertNotBehindOnBoard(top: string, inv: string, branch: string): void {
  const behind = behindBoardCommits(top, branch);
  if (behind !== null && behind.length > 0) {
    throw new CliError(
      "RUNTIME",
      `migration refused: '${branch}' is behind ${BOARD_REMOTE}/${branch} with board changes — ` +
        `migrating from this stale state would strand a teammate's board commits on the frozen ` +
        `folder forever`,
      {
        details: { behind_board_commits: behind.length, commits: behind.slice(0, 20) },
        help: `git pull, then re-run ${inv} sync --migrate --yes`,
      },
    );
  }
}

// Re-export the shared namespace guard for existing migrate consumers.
export { boardNamespaceConflicts } from "../git.js";

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
 *  1. inside a git repo, with an `origin` remote that is REACHABLE (fix round, review HIGH 1: a
 *     dead fetch refuses — migration cannot complete offline anyway, the mandatory push would
 *     fail, and a stale view of origin is exactly what makes the freshness guard blind);
 *  2. NOT already migrated (a board branch on origin → `already migrated`, exit 0 — idempotent,
 *     with THREE state-aware follow-ups: an existing `board-migration` branch → "push it and open
 *     the PR"; the CRASH WINDOW — board pushed, folder still committed, local `board` branch
 *     present but no removal commit — → re-create just the removal commit (with `--yes`; offered
 *     without); otherwise a truthful pull-then-sync note probed against origin's actual state);
 *  3. on a real branch (not detached, not `board` itself) that COMMITS `.agentstate-lite/`;
 *  4. NOT behind `origin/<branch>` on commits touching the board folder (review HIGH 1 — the
 *     stranded-teammate-commit disaster), and no `board/…` branches locally or on the remote
 *     (review adjudication 5 — they make `refs/heads/board` uncreatable);
 *  5. no uncommitted changes under `.agentstate-lite/` (the refusal names them — they would be
 *     silently stranded in the frozen snapshot otherwise);
 *  6. no pre-existing `board-migration` branch, and any pre-existing LOCAL `board` branch must be
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

  const fetchOk = fetchOrigin(top);

  // IDEMPOTENCE FIRST: a board branch on origin means the migration already happened (here, on a
  // teammate's clone, or in an interrupted run that got at least as far as the push) — exit 0.
  // Checked even off a failed fetch (the last-known origin/board still proves it), and branched
  // THREE WAYS on local state (fix round, review HIGH 2 — the old single note was FALSE in the
  // crash window).
  if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0) {
    await alreadyMigrated(top, inv, mode, opts.yes, fetchOk, stdout);
    return;
  }

  if (runGit(top, ["remote", "get-url", BOARD_REMOTE]).status !== 0) {
    throw new CliError(
      "RUNTIME",
      `this repository has no '${BOARD_REMOTE}' remote — migration publishes the board branch to ` +
        `${BOARD_REMOTE}; add the remote, then re-run`,
    );
  }

  // Review HIGH 1, second half: a dead fetch REFUSES. Migration cannot complete offline anyway
  // (the mandatory `push -u` would fail after mutating local refs), and proceeding on a stale
  // view of origin is exactly the hole that lets a teammate's board commit go unseen.
  if (!fetchOk) {
    throw new CliError(
      "TRANSIENT",
      `migration refused: could not reach '${BOARD_REMOTE}' — migration verifies freshness ` +
        `against the remote and must push the board branch, neither of which can happen ` +
        `offline; get online, then re-run`,
      { details: { retryable: true } },
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

  // Review HIGH 1: the behind-origin freshness guard — the fetch above succeeded, so this view
  // of origin/<branch> is LIVE. Runs before the local-state refusals: a stale clone must hear
  // "git pull" before anything else.
  assertNotBehindOnBoard(top, inv, branch);

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

  // Review adjudication 5: `board/…` branches (local or remote) make `refs/heads/board`
  // uncreatable — a ref directory/file conflict git reports only at push time, empirically
  // confirmed against this repo's own origin. Refuse EARLY, naming the offenders.
  const namespaceConflicts = boardNamespaceConflicts(top);
  if (namespaceConflicts.length > 0) {
    throw new CliError(
      "RUNTIME",
      `migration refused: branches named '${BOARD_BRANCH}/…' exist — git cannot create a ` +
        `'${BOARD_BRANCH}' branch alongside them: ${namespaceConflicts.join(", ")}`,
      {
        details: { conflicting_branches: namespaceConflicts },
        help: `delete or rename these branches, then re-run ${inv} sync --migrate --yes`,
      },
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
    next_steps: nextSteps(inv, branch),
    both_worlds: bothWorldsLine(branch),
    tell_your_teammates: rolloutNote(inv, branch),
  };
  stdout(render(receipt, mode));
}

// ── the already-migrated path (fix round, review HIGH 2: three-way on local state) ─

/**
 * A board branch exists on origin — the migration already happened SOMEWHERE. Exit 0 always
 * (idempotence is spec), but the follow-up must match this clone's ACTUAL state:
 *
 *  (a) a local `board-migration` branch exists → the removal commit is prepared; guide to
 *      pushing it and opening the PR (also fixes the lost-receipt case on the happy path);
 *  (b) the CRASH WINDOW — folder still committed at HEAD, a local `board` branch exists (this
 *      clone is where the interrupted run happened), but no `board-migration` branch — → the
 *      removal commit is genuinely missing: RE-CREATE it (with `--yes`; without, say exactly
 *      what a `--yes` re-run will do — the already-migrated path must never mutate under a
 *      bare preview). Guarded by the same freshness rules as the main path (live fetch +
 *      not-behind) — recreating from a stale HEAD would re-open review HIGH 1;
 *  (c) folder still committed but NO local `board` branch (a teammate's clone that simply
 *      hasn't pulled the removal yet) → a truthful note, probed against origin's actual state:
 *      whether the folder-removal has already landed on `origin/<branch>` or the PR is still
 *      open. Never a removal-commit re-creation here — that would race the real PR;
 *  (d) folder no longer committed → fully migrated locally; the bare receipt.
 */
async function alreadyMigrated(
  top: string,
  inv: string,
  mode: ReturnType<typeof resolveMode>,
  yes: boolean,
  fetchOk: boolean,
  stdout: (s: string) => void,
): Promise<void> {
  const rec: Record<string, unknown> = { migrate: MIGRATE_ALREADY };
  const folderTracked = folderTreeAtHead(top) !== null;
  const branchR = runGit(top, ["rev-parse", "--abbrev-ref", "HEAD"]);
  const branch = branchR.status === 0 ? branchR.stdout.trim() : "HEAD";

  if (localBranchExists(top, MIGRATION_BRANCH)) {
    // (a) prepared but not landed: the PR is the only thing left.
    rec.note =
      `the folder-removal commit is already prepared on '${MIGRATION_BRANCH}' — push it and ` +
      `open its PR`;
    rec.next_steps = nextSteps(inv, branch === "HEAD" ? "the default branch" : branch);
  } else if (folderTracked && localBranchExists(top, BOARD_BRANCH) && branch !== "HEAD") {
    // (b) the crash window: the board branch made it to origin, but this run died before the
    // removal commit existed anywhere. Re-create just that commit — under the same freshness
    // discipline as a fresh run (a stale HEAD would re-open the stranded-commit disaster).
    if (!yes) {
      rec.note =
        `an interrupted migration left the board branch pushed but no folder-removal commit — ` +
        `re-run '${inv} sync --migrate --yes' to re-create it on '${MIGRATION_BRANCH}' ` +
        `(nothing has been changed by this run)`;
    } else if (!fetchOk) {
      throw new CliError(
        "TRANSIENT",
        `migration refused: could not reach '${BOARD_REMOTE}' — finishing the interrupted ` +
          `migration re-creates the folder-removal commit, which must be cut from a fresh view ` +
          `of ${BOARD_REMOTE}; get online, then re-run`,
        { details: { retryable: true } },
      );
    } else {
      assertNotBehindOnBoard(top, inv, branch);
      const removalSha = createRemovalCommit(top, inv, branch);
      mustGit(top, ["branch", MIGRATION_BRANCH, removalSha]);
      rec.recovered =
        `an interrupted migration left the board branch pushed but no folder-removal commit — ` +
        `it has been re-created on '${MIGRATION_BRANCH}'`;
      rec.removal_branch = MIGRATION_BRANCH;
      rec.removal_commit = removalSha;
      rec.next_steps = nextSteps(inv, branch);
      rec.both_worlds = bothWorldsLine(branch);
    }
  } else if (folderTracked) {
    // (c) a clone that hasn't pulled the removal yet (typically the OTHER founder's). Probe
    // origin's actual state so the note never asserts a PR that may or may not exist.
    const remoteRef = `refs/remotes/${BOARD_REMOTE}/${branch}`;
    const remoteBranchKnown =
      branch !== "HEAD" && runGit(top, ["rev-parse", "--verify", "--quiet", remoteRef]).status === 0;
    const landedUpstream =
      remoteBranchKnown && runGit(top, ["cat-file", "-e", `${remoteRef}:${BUNDLE_DIR}`]).status !== 0;
    rec.note = landedUpstream
      ? `this clone still carries the committed ${BUNDLE_DIR}/ folder and the folder-removal has ` +
        `already landed on '${branch}' — run 'git pull' (the folder vanishes), then '${inv} sync' ` +
        `(it returns as the live board)`
      : `this clone still carries the committed ${BUNDLE_DIR}/ folder — once the folder-removal ` +
        `lands on the default branch: 'git pull' (the folder vanishes), then '${inv} sync' ` +
        `(it returns as the live board)`;
  }
  // (d) folder no longer committed: fully migrated here — the bare receipt says it all.

  stdout(render(rec, mode));
}
