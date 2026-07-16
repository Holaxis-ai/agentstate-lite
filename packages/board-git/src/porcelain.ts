/**
 * `porcelain.ts` — the board's git PORCELAIN layer (U1, plans/sync-verb-implementation §U1;
 * relocated from the CLI's `git.ts` by board-git A1).
 *
 * ONE spawn wrapper ({@link runGit}) enforces the plan's "global porcelain invariants" on every
 * invocation; the exported ops (provision, stage-and-commit, fetch-rebase, push, ff-pull,
 * unpushed-count, stale-rebase detect/abort) are the ONLY vocabulary the CLI's sync command
 * (U3a) and SessionStart pull (U4) speak (the ref-to-ref doc diff family rides them from
 * `diff.ts`). `@agentstate-lite/core` never learns git exists — this package CONSUMES core (its
 * one frontmatter parser, its one path/reserved-file vocabulary) and is consumed by the CLI.
 *
 * Invariants (every call):
 *   - `git -C <dir>` with GIT_DIR / GIT_WORK_TREE / GIT_INDEX_FILE SCRUBBED from the environment
 *     (inherited values override `-C` — reproduced by the review panel).
 *   - GIT_TERMINAL_PROMPT=0 and GIT_SSH_COMMAND='ssh -o BatchMode=yes -o ConnectTimeout=10' — the
 *     no-hang class is killed at the wrapper, not per call site.
 *   - GIT_EDITOR/GIT_SEQUENCE_EDITOR=true on rebase ops (nothing interactive can open).
 *   - A per-op timeout (network ops get a longer budget); a fired timeout classifies TRANSIENT.
 *   - EXPLICIT refs everywhere — `origin/board`, NEVER `@{u}` (the migration machine's
 *     subtree-split branch has no tracking config, empirically).
 *   - Worktree internals via `git rev-parse --git-path` (`.git` is a FILE in a linked worktree).
 *   - Rename detection OFF (`--no-renames`): a doc's identity IS its path; add+delete is the true
 *     story. Explicit (not merely `-M` omitted) so a host `diff.renames=true` config cannot leak in.
 *   - Path quoting OFF (`-c core.quotepath=off`): non-ASCII paths come back as raw UTF-8, never
 *     C-quoted — parsed paths must round-trip back into git as pathspecs (see `runGit`'s header).
 *   - No raw git on stdout: every failure routes through `classifyGitError` (errors.ts)
 *     into the typed `BoardGitError` taxonomy; the CLI command boundary maps it to exit codes.
 *
 * CONFLICT BOUNDARY: {@link fetchRebase} DETECTS a same-doc conflict — collects the conflicted ids
 * via `diff --name-only --diff-filter=U` — and `git rebase --abort`s cleanly (ZERO data movement;
 * U3a's interim shape, kept for any consumer that must never move data). The CONVERGING mechanic
 * (U3b) is {@link fetchRebaseResolving}: keep the upstream version, export the local version, and
 * COMPLETE the rebase — the full-sync path's op since U3b.
 */
import { spawnSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdtempSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  readlinkSync,
  realpathSync,
  rmSync,
  rmdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { conceptIdFromPath, isReservedFile, parseMarkdown } from "@agentstate-lite/core";
import { BoardGitError, classifyGitError, isBoardGitError, type GitFailure } from "./errors.js";

/** The dedicated branch that carries ONLY the bundle (its root IS the bundle root). */
export const BOARD_BRANCH = "board";
/** The one remote the board syncs against. */
export const BOARD_REMOTE = "origin";
/** The EXPLICIT remote-tracking ref every pull/rebase/count uses — never `@{u}`. */
export const BOARD_REF = `${BOARD_REMOTE}/${BOARD_BRANCH}`;
/** The conventional folder the board worktree is checked out at (relative to the repo top level). */
export const BUNDLE_DIR = ".agentstate-lite";

/**
 * Worktree-portability config forced on every worktree-CREATING/-REPAIRING invocation (field
 * finding 2026-07-08): git >= 2.48's `worktree.useRelativePaths` writes BOTH the linked worktree's
 * `.git` file and the main repo's `worktrees/<name>/gitdir` registration as paths RELATIVE to each
 * other, instead of the pre-2.48 default of absolute paths on both sides. Since the board worktree
 * always lives INSIDE the repo it belongs to (`<repoTop>/.agentstate-lite`), a relative pointer is
 * mount-portable by construction — a sandbox/devcontainer/CI checkout remounted at a different
 * absolute path stays self-consistent. NO version probing: an unknown `-c` config key is silently
 * ignored by git older than 2.48, so this is safe to pass unconditionally on every version.
 */
const RELATIVE_WORKTREE_CONFIG = ["-c", "worktree.useRelativePaths=true"];

// ── the ONE spawn wrapper ─────────────────────────────────────────────────────

/** Env keys whose INHERITED values override `-C` — scrubbed on every invocation (invariant). */
const SCRUBBED_GIT_VARS = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"] as const;

/** Default per-op timeout for local plumbing/porcelain. */
const LOCAL_TIMEOUT_MS = 30_000;
/** Budget for ops that touch the network (fetch/push/probe) — bounded, but tolerant of a slow remote. */
export const NETWORK_TIMEOUT_MS = 60_000;

export interface GitRunResult {
  status: number;
  stdout: string;
  stderr: string;
}

export interface RunOptions {
  /** Per-op timeout; defaults to {@link LOCAL_TIMEOUT_MS}. */
  timeoutMs?: number;
  /** Piped to the child's stdin (the `commit -F -` message channel — no shell interpolation). */
  input?: string;
  /** True for rebase ops: forces GIT_EDITOR/GIT_SEQUENCE_EDITOR=true so nothing interactive opens. */
  rebase?: boolean;
  /**
   * ssh ConnectTimeout override, in seconds (default 10). U4's SessionStart pull passes 5 — the
   * plan's "connect ≤ 5s" budget — so a black-holed ssh host is abandoned inside the pull budget
   * rather than eating it whole. The spawnSync `timeoutMs` kill is the HARD enforcement either
   * way (https remotes never consult ssh); this only makes the ssh case fail faster and cleaner.
   */
  connectTimeoutSeconds?: number;
  /** Explicit temporary index used by snapshot plumbing; ambient GIT_INDEX_FILE stays scrubbed. */
  indexFile?: string;
  /** Explicit repository directory for a work tree rooted somewhere other than `dir`. */
  gitDir?: string;
  /** Explicit work-tree root paired with {@link gitDir}. */
  workTree?: string;
}

/** The hermetic environment for one invocation: ambient env, scrubbed, with the invariants forced. */
function gitEnv(rebase: boolean, connectTimeoutSeconds = 10, indexFile?: string): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const v of SCRUBBED_GIT_VARS) delete env[v];
  if (indexFile) env.GIT_INDEX_FILE = indexFile;
  // Locale-pin git prose so classifyGitError's fallback matchers survive non-English hosts.
  env.LC_ALL = "C";
  env.GIT_TERMINAL_PROMPT = "0";
  env.GIT_SSH_COMMAND = `ssh -o BatchMode=yes -o ConnectTimeout=${connectTimeoutSeconds}`;
  if (rebase) {
    env.GIT_EDITOR = "true";
    env.GIT_SEQUENCE_EDITOR = "true";
  }
  return env;
}

/**
 * Run `git -C <dir> <args…>` under the porcelain invariants, TOLERATING a nonzero exit (the caller
 * inspects `status`). A spawn-level failure (no git binary, fired timeout) can never be a
 * legitimate outcome, so it THROWS the classified `BoardGitError` (GIT_MISSING / TRANSIENT) directly.
 *
 * `-c core.quotepath=off` is a WRAPPER INVARIANT (U3b review fix 1): with git's default
 * `core.quotepath=true`, any non-ASCII path (e.g. `tasks/café.md`) comes back C-QUOTED in
 * diff/status output (`"tasks/caf\303\251.md"`, surrounding quotes included) — and every
 * downstream parse that feeds the parsed string back into git as a path/pathspec (`show :3:<p>`,
 * `checkout -- <p>`, `rm -- <p>`, `show <rev>:<p>`) then MISSES the real file. Off = raw UTF-8
 * bytes out, exactly what the filesystem and pathspecs expect — killing the class for EVERY
 * path-parsing consumer (name-status in stageAndCommit/changesSince, sync.ts's origin diff) at
 * the one chokepoint, like LC_ALL=C does for prose. A truly hostile name (a TAB inside a
 * filename would still break `--name-status`'s tab-split) is additionally handled by `-z` NUL
 * framing where the stakes are a stuck loop (see `fetchRebaseResolving`'s conflict list).
 */
export function runGit(dir: string, args: string[], opts: RunOptions = {}): GitRunResult {
  const r = runGitBytes(dir, args, opts);
  return { status: r.status, stdout: r.stdout.toString("utf8"), stderr: r.stderr };
}

/** {@link runGitBytes}'s result: stdout as the EXACT BYTES; stderr decoded (it is git prose). */
export interface GitRunBytesResult {
  status: number;
  stdout: Buffer;
  stderr: string;
}

/**
 * The ONE spawn site (U3b round-2 review, REQUIRED 1): every git invocation — text or binary —
 * flows through here, so the wrapper invariants (scrubbed env, locale pin, quotepath off, no-hang
 * timeouts, non-interactive editors) hold for both. `stdout` is returned as a Buffer of the EXACT
 * bytes git produced; {@link runGit} is the utf8-decoding projection every text parser rides.
 * Call THIS directly when the payload is a raw blob that must round-trip byte-identically (the
 * `:3:` conflict export, `show-incoming --out`'s byte channel) — routing a blob through a UTF-8
 * string silently rewrites invalid sequences to U+FFFD.
 */
export function runGitBytes(dir: string, args: string[], opts: RunOptions = {}): GitRunBytesResult {
  // TIME-BOX FLOOR (PR#24 review, MEDIUM — empirically verified): Node's spawnSync treats
  // `timeout: 0` as NO timeout at all (a zero waits for the child indefinitely), and a
  // synchronous spawn cannot be preempted by any timer — so a caller whose sliced budget
  // decayed to 0 between its own guard and this spawn would HANG the exact path the budget
  // exists to bound. A non-positive timeout therefore classifies as an IMMEDIATE fired timeout
  // (TRANSIENT) without ever spawning: one chokepoint closing the class for every caller,
  // present and future, however their guard-to-spawn gaps decay.
  if (opts.timeoutMs !== undefined && opts.timeoutMs <= 0) {
    throw classifyGitError({ args, status: null, stdout: "", stderr: "", timedOut: true });
  }
  const repositoryArgs = [
    ...(opts.gitDir ? [`--git-dir=${opts.gitDir}`] : []),
    ...(opts.workTree ? [`--work-tree=${opts.workTree}`] : []),
  ];
  const r = spawnSync("git", ["-C", dir, "-c", "core.quotepath=off", ...repositoryArgs, ...args], {
    env: gitEnv(opts.rebase ?? false, opts.connectTimeoutSeconds, opts.indexFile),
    timeout: opts.timeoutMs ?? LOCAL_TIMEOUT_MS,
    input: opts.input,
    maxBuffer: 32 * 1024 * 1024,
  });
  const stdout = r.stdout ?? Buffer.alloc(0);
  const stderr = (r.stderr ?? Buffer.alloc(0)).toString("utf8");
  if (r.error) {
    const code = (r.error as NodeJS.ErrnoException).code;
    throw classifyGitError({
      args,
      status: r.status ?? null,
      stdout: stdout.toString("utf8"),
      stderr,
      timedOut: code === "ETIMEDOUT",
      spawnErrorCode: code ?? "SPAWN",
    });
  }
  // A killed child (e.g. timeout without an error object on some platforms) has status null.
  if (r.status === null) {
    throw classifyGitError({ args, status: null, stdout: stdout.toString("utf8"), stderr, timedOut: true });
  }
  return { status: r.status, stdout, stderr };
}

/** A {@link GitFailure} from a tolerated-but-failed invocation, for classification. */
function failureOf(args: string[], r: GitRunResult): GitFailure {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}

/** Run a git op that MUST succeed; a nonzero exit throws the classified `BoardGitError`. */
export function mustGit(dir: string, args: string[], opts: RunOptions = {}): string {
  const r = runGit(dir, args, opts);
  if (r.status !== 0) throw classifyGitError(failureOf(args, r));
  return r.stdout;
}

// ── repo/worktree discovery ───────────────────────────────────────────────────

/** The enclosing repository's top-level working directory, or null when `dir` is not in a repo. */
export function repoTopLevel(dir: string): string | null {
  if (!existsSync(dir)) return null;
  const r = runGit(dir, ["rev-parse", "--show-toplevel"]);
  if (r.status !== 0) return null;
  const top = r.stdout.trim();
  return top.length > 0 ? top : null;
}

/** Resolve a worktree-internal git path (e.g. `rebase-merge`, `index.lock`) to an absolute path. */
function worktreeGitPath(boardPath: string, relative: string): string {
  const raw = mustGit(boardPath, ["rev-parse", "--git-path", relative]).trim();
  return path.resolve(boardPath, raw);
}

/** realpath when the path exists; the path unchanged otherwise (for stable comparisons). */
function realOrSame(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/** The repo/worktree's git common-dir, realpathed for ownership comparisons. */
function gitCommonDir(dir: string): string | null {
  const r = runGit(dir, ["rev-parse", "--git-common-dir"]);
  if (r.status !== 0) return null;
  const raw = r.stdout.trim();
  if (raw.length === 0) return null;
  return realOrSame(path.isAbsolute(raw) ? raw : path.resolve(dir, raw));
}

/** True when both paths are worktrees of the same git repository/common-dir. */
function sameGitCommonDir(a: string, b: string): boolean {
  const aCommon = gitCommonDir(a);
  const bCommon = gitCommonDir(b);
  return aCommon !== null && bCommon !== null && aCommon === bCommon;
}

/**
 * True when `boardPath`'s OWN git plumbing resolves back to itself — the structural signature of
 * a healthy linked worktree, independent of what's currently checked out there. Deliberately
 * WEAKER than {@link isProvisioned}: a worktree wedged mid-rebase has a DETACHED HEAD (rebase
 * checks out commits directly), so it is never "on the `board` branch" until healed — but its
 * pointer files can still be perfectly healthy (or freshly repaired). This is the repair
 * self-heal's OWN success signal (worktree-portability): `git worktree repair`'s job is only to
 * fix the POINTERS, not to un-wedge a rebase, so checking for `isProvisioned`'s stronger
 * "on-branch" condition would misreport a genuinely successful repair as a failure whenever the
 * worktree was ALSO wedged (the heal-ordering edge — the caller re-runs the entry heal for that).
 * Exported for channel detection's rule 1 (`channel.ts`), which keys on this same weak signature.
 */
export function worktreeRootResolves(boardPath: string): boolean {
  const boardTop = repoTopLevel(boardPath);
  return boardTop !== null && realOrSame(boardTop) === realOrSame(boardPath);
}

/**
 * Stronger than {@link worktreeRootResolves}: the path must be a worktree root AND belong to the
 * same git common-dir as the project that wants to adopt it. This rejects a foreign repo's board
 * worktree parked at this project's conventional path. Exported for channel detection's rule 1.
 */
export function worktreeRootResolvesForOwner(boardPath: string, ownerTop: string): boolean {
  return worktreeRootResolves(boardPath) && sameGitCommonDir(boardPath, ownerTop);
}

/**
 * True when a wedged rebase in `boardPath` was invoked FROM the `board` branch — read from git's
 * OWN `rebase-merge/head-name` (or `rebase-apply/head-name`, the non-interactive backend) file,
 * which git writes with the ORIGINAL ref (e.g. `refs/heads/board`) specifically so
 * `--continue`/`--abort` know where to return to, even though HEAD itself is detached for the
 * rebase's duration (empirically verified live). This is a STRUCTURAL signal from git's own
 * bookkeeping, never inferred or guessed — the discriminator {@link repairedWorktreeIsBoard} needs
 * to accept a wedged-mid-rebase worktree (detached HEAD, never literally "on branch board") WITHOUT
 * also accepting an unrelated worktree that merely happens to be mid-rebase on some OTHER branch.
 */
function rebaseWasFromBoardBranch(boardPath: string): boolean {
  for (const state of ["rebase-merge", "rebase-apply"]) {
    const headNamePath = path.join(worktreeGitPath(boardPath, state), "head-name");
    if (!existsSync(headNamePath)) continue;
    try {
      if (readFileSync(headNamePath, "utf8").trim() === `refs/heads/${BOARD_BRANCH}`) return true;
    } catch {
      /* an unreadable head-name proves nothing either way — keep checking the other backend */
    }
  }
  return false;
}

/**
 * The repair self-heal's ACTUAL success signal (worktree-portability): {@link worktreeRootResolves}
 * alone is NOT enough — `git worktree repair` is safe to run (and exits 0) on a worktree whose
 * pointers were never even stale, so a genuinely healthy but WRONG-branch worktree (someone's own
 * unrelated `git worktree add .agentstate-lite some-other-branch`), or one merely left on a plain
 * detached HEAD for an unrelated reason (no rebase in progress at all), would otherwise be
 * misreported as a successful "repaired" board checkout — and every downstream sync step
 * (`stageAndCommit`, `fetchRebaseResolving`, `push`) would then operate against content that was
 * NEVER the shared board (cold-review finding, confirmed live via two probes: a sidecar branch
 * checked out in the worktree, and a plain non-rebase detached HEAD). This is genuinely on
 * `board` when EITHER the branch is attached and literally `board`, OR HEAD is detached BECAUSE
 * of a wedged rebase that was itself started FROM `board` ({@link rebaseWasFromBoardBranch}) — any
 * other detached state (or any other named branch) is NOT accepted, and falls through to refusal.
 */
function repairedWorktreeIsBoard(boardPath: string, ownerTop: string): boolean {
  if (!worktreeRootResolvesForOwner(boardPath, ownerTop)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  if (branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH) return true;
  return detectStaleRebase(boardPath) && rebaseWasFromBoardBranch(boardPath);
}

/**
 * True when the conventional board worktree is genuinely provisioned for the repo containing
 * `dir`: `<toplevel>/.agentstate-lite` exists, is ITSELF a worktree root (not a plain directory
 * falling through to the parent repo), and has the `board` branch checked out.
 */
export function isProvisioned(dir: string): boolean {
  const top = repoTopLevel(dir);
  if (!top) return false;
  const boardPath = path.join(top, BUNDLE_DIR);
  if (!existsSync(boardPath) || !worktreeRootResolvesForOwner(boardPath, top)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}

// ── provisioning (self-heal) ──────────────────────────────────────────────────

export type ProvisionOutcome =
  /**
   * The worktree was created (fresh or self-healed clone). `source` names WHERE it materialized
   * FROM — `remote` (the classic clone/join path: checked out from `refs/remotes/origin/board`) or
   * `local` (the `hasLocal` arm: an ALREADY-EXISTING local `board` branch, such as a legacy or
   * manually prepared checkout) — so an announcement never claims "materialized from
   * origin/board" for a branch that never touched origin.
   */
  | { kind: "provisioned"; boardPath: string; source: "local" | "remote" }
  /**
   * A pre-existing worktree carrying STALE pointers (the sandbox/mount-move field finding —
   * `.git` file / `worktrees/<name>/gitdir` still name the OLD absolute path) was structurally
   * repaired via `git worktree repair`. Distinct from `already`: a repair IS a git mutation
   * (rewrites the pointer files) and must be ANNOUNCEABLE, never folded into the silent-no-op
   * "already" case (decisions/board-branch-sync rider 2).
   */
  | { kind: "repaired"; boardPath: string }
  /** Already provisioned (or the board branch is already checked out) — idempotent success. */
  | { kind: "already"; boardPath: string }
  /** `dir` is not inside a git repository at all — the caller emits `sync: nothing to sync`. */
  | { kind: "no_repo" }
  /** No local or fetched board ref exists; `remoteState` records whether origin was checked. */
  | { kind: "no_board"; remoteState: "absent" | "unknown" }
  /** An unprovisioned local `board` branch exists, but this caller refuses to adopt it by name. */
  | { kind: "local_board"; boardPath: string; remoteExists: boolean };

/**
 * True when `<dir>/.git` exists as a FILE (never a directory) — the structural signature of git's
 * own checkout machinery: a linked worktree OR a submodule (both point their `.git` at a real
 * gitdir elsewhere via this same file shape; a full repository's `.git` is a directory). This is
 * the ONLY gate that makes {@link repairWorktree} reachable: the U3a #1 never-touch guarantee
 * requires that a repair attempt can NEVER fire against a plain foreign directory, only against
 * something that already looks like git's own machinery — {@link repairedWorktreeIsBoard} is what
 * then tells a genuine `board` worktree apart from a submodule or an unrelated worktree that merely
 * shares this same signature. Exported for channel detection's rule 1.
 */
export function hasWorktreeSignature(dir: string): boolean {
  const gitPath = path.join(dir, ".git");
  if (!existsSync(gitPath)) return false;
  try {
    return statSync(gitPath).isFile();
  } catch {
    return false;
  }
}

/**
 * Attempt `git worktree repair` on a worktree with a stale/mismatched `.git` file (empirically
 * verified live against the field finding: after the enclosing repo is moved/remounted, this
 * rewrites BOTH the linked worktree's `.git` file and the main repo's `worktrees/<name>/gitdir`
 * registration to agree again — and, with {@link RELATIVE_WORKTREE_CONFIG}, to RELATIVE paths, so
 * a capable git converts an inherited absolute setup while repairing it). Run from the repo TOP
 * (not the board path itself — the board path's own git plumbing is exactly what's broken).
 * Structural signal only (porcelain lesson): the caller re-checks `isProvisioned` itself, never
 * trusts this function's exit code alone as proof of a healthy result, and never inspects stderr
 * prose (`repair:` diagnostic lines are expected chatter on the SUCCESS path here, not failure).
 */
function repairWorktree(top: string, boardPath: string): boolean {
  const r = runGit(top, [...RELATIVE_WORKTREE_CONFIG, "worktree", "repair", boardPath]);
  return r.status === 0;
}

/** Single-quote shell escaping for remediation commands printed in error help. */
function shellQuote(s: string): string {
  return `'${s.replaceAll("'", "'\\''")}'`;
}

function moveAsideHelp(boardPath: string, note: string): string {
  return `mv ${shellQuote(boardPath)} ${shellQuote(`${boardPath}.bak`)}  # ${note}`;
}

/**
 * The PRE-SHARE-WINDOW refusal (U5 fix round, review MEDIUM 3): the board branch already exists
 * on the remote, but THIS clone's checked-out branch still TRACKS the folder (the old committed
 * copy — the folder-removal PR hasn't merged, or this clone hasn't pulled it). A bare "move it
 * aside" is DANGEROUS in exactly this state (it hand-builds the overlay hazard — reviewer-proven);
 * the only safe advice is pull-first. ONE factory so `provisionBoardWorktree` and channel
 * detection (`channel.ts`) stay verbatim-identical, mechanically.
 *
 * `originConfigured: false` is the truth-fix arm (board-git PR C, carried from B's review): the
 * only board-branch evidence is a PREVIOUSLY FETCHED `origin/board` ref while no `origin` remote
 * is configured any more — the default wording would falsely claim the branch "exists on origin",
 * and its bare `git pull` help cannot work with no remote to pull from.
 */
export function preShareWindowError(boardPath: string, originConfigured = true): BoardGitError {
  if (!originConfigured) {
    return new BoardGitError(
      "RUNTIME",
      `a previously fetched '${BOARD_REF}' ref shows this project's board was shared, but no ` +
        `'${BOARD_REMOTE}' remote is configured here any more — '${BUNDLE_DIR}' is still the old ` +
        `folder committed on this branch, and sync cannot pull the shared board without the remote`,
      {
        details: { path: boardPath, state: "pre-share-window", origin_configured: false },
        help: `git remote add ${BOARD_REMOTE} <url>  # restore the remote, 'git pull' once the cleanup PR merges, then re-run sync`,
      },
    );
  }
  return new BoardGitError(
    "RUNTIME",
    `the '${BOARD_BRANCH}' branch exists on ${BOARD_REMOTE}, but '${BUNDLE_DIR}' here is ` +
      `still the old folder committed on this branch — the folder-removal (cleanup) PR ` +
      `hasn't merged yet, or this clone hasn't pulled it: once it lands, run 'git pull', ` +
      `then run sync again`,
    {
      details: { path: boardPath, state: "pre-share-window" },
      help: "git pull  # after the cleanup PR merges, then re-run sync",
    },
  );
}

/**
 * SELF-HEALING board-worktree provisioning (all branches empirically grounded, §U1):
 * `git fetch --prune origin` runs BEFORE `board` is referenced (best-effort: offline provisioning still
 * works from a previously fetched `origin/board`); worktree absent but a board ref exists → a
 * fresh `git worktree add`; a pre-existing NON-EMPTY `.agentstate-lite/` that is NOT the board
 * worktree is REFUSED with guidance (never a blind add — a pre-existing EMPTY directory is the one
 * resolvable case, removed so the add can proceed); "already checked out" from git = idempotent
 * success. The `--no-track` add faithfully reproduces the migration machine's no-tracking-config
 * state — which is exactly why every other op uses EXPLICIT `origin/board` refs.
 *
 * WORKTREE PORTABILITY (2026-07-08 field finding): a fresh `add` writes RELATIVE pointers
 * ({@link RELATIVE_WORKTREE_CONFIG}, git >= 2.48; silently ignored on older git — no version
 * probing). And a pre-existing NON-EMPTY directory that carries a worktree signature (a `.git`
 * FILE — {@link hasWorktreeSignature}) is NOT automatically foreign: it may be a genuine board
 * worktree whose pointers went stale because the enclosing repo was mounted at a different path
 * (a sandbox/devcontainer/CI checkout). Before refusing, attempt {@link repairWorktree} and
 * re-check {@link repairedWorktreeIsBoard} — only when that STILL fails does the refusal fire,
 * worded to name what was actually observed (never telling someone to move aside a worktree that
 * repair simply could not fix, or one that genuinely IS the board checkout, as if either were a
 * directory that was never git's business to begin with).
 */
export interface NetworkBudgetOptions {
  /** Budget for the op's `git fetch` (default {@link NETWORK_TIMEOUT_MS}) — U4's pull slices this. */
  fetchTimeoutMs?: number;
  /** ssh ConnectTimeout override, in seconds — see {@link RunOptions.connectTimeoutSeconds}. */
  connectTimeoutSeconds?: number;
  /** False prevents a branch named `board` from being adopted without explicit user consent. */
  allowLocalBranch?: boolean;
}

export function provisionBoardWorktree(dir: string, budget: NetworkBudgetOptions = {}): ProvisionOutcome {
  const top = repoTopLevel(dir);
  if (!top) return { kind: "no_repo" };
  const boardPath = path.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };

  // Probe the board ref explicitly: a clone's configured fetch refspec may exclude it.
  const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
  const deadline = Date.now() + (budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS);
  const networkOptions = (): RunOptions => ({
    timeoutMs: Math.max(0, deadline - Date.now()),
    connectTimeoutSeconds: budget.connectTimeoutSeconds,
  });
  const runNetwork = (args: string[]): GitRunResult | null => {
    try {
      return runGit(top, args, networkOptions());
    } catch (err) {
      if (isBoardGitError(err) && err.code === "TRANSIENT") return null;
      throw err;
    }
  };
  let remoteState: "absent" | "unknown" = "absent";
  let remoteBoardKnownAbsent = false;
  if (hasOrigin) {
    const probe = runNetwork([
      "ls-remote",
      "--exit-code",
      BOARD_REMOTE,
      `refs/heads/${BOARD_BRANCH}`,
    ]);
    if (probe?.status === 0) {
      // Exact `board` cannot coexist remotely with `board/*`; any local children are stale.
      const children = runGit(top, [
        "for-each-ref",
        "--format=%(refname)",
        `refs/remotes/${BOARD_REF}/`,
      ]);
      let namespaceReady = children.status === 0;
      for (const child of children.stdout.split("\n").filter(Boolean)) {
        if (runGit(top, ["update-ref", "-d", child]).status !== 0) namespaceReady = false;
      }
      if (namespaceReady) {
        const fetch = runNetwork([
          "fetch",
          "--prune",
          "--no-tags",
          BOARD_REMOTE,
          `+refs/heads/${BOARD_BRANCH}:refs/remotes/${BOARD_REF}`,
        ]);
        remoteState = fetch?.status === 0 ? "absent" : "unknown";
      } else {
        remoteState = "unknown";
      }
    } else if (probe?.status === 2) {
      remoteBoardKnownAbsent = true;
      runGit(top, ["update-ref", "-d", `refs/remotes/${BOARD_REF}`]);
    } else {
      remoteState = "unknown";
    }
  }

  const localBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]);
  const remoteBoard = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  const hasLocal = localBoard.status === 0;
  const hasRemote = remoteBoard.status === 0 && !remoteBoardKnownAbsent;
  const localMatchesRemote =
    hasLocal &&
    hasRemote &&
    localBoard.stdout.trim().length > 0 &&
    localBoard.stdout.trim() === remoteBoard.stdout.trim();
  if (!hasLocal && !hasRemote) {
    return {
      kind: "no_board",
      remoteState,
    };
  }

  if (existsSync(boardPath)) {
    if (readdirSync(boardPath).length > 0) {
      // The PRE-SHARE WINDOW (see {@link preShareWindowError} for the full hazard story): the
      // generic "move it aside" advice below must never fire while the checked-out branch still
      // TRACKS the folder and the board branch exists on the remote.
      if (
        hasRemote &&
        !hasWorktreeSignature(boardPath) &&
        runGit(top, ["cat-file", "-e", `HEAD:${BUNDLE_DIR}`]).status === 0
      ) {
        throw preShareWindowError(boardPath, hasOrigin);
      }
      // Non-empty and (per isProvisioned above) not currently a genuine `board` checkout: it may
      // STILL be the real board worktree, just wedged with stale pointers — try the structural
      // self-heal FIRST, reachable ONLY because the worktree signature is present (never for a
      // plain foreign directory — the U3a #1 never-touch guarantee).
      const hadSignature = hasWorktreeSignature(boardPath);
      let reason: "foreign" | "foreign_checkout" | "unrepairable" | "wrong_branch" = "foreign";
      if (hadSignature) {
        if (worktreeRootResolves(boardPath) && !sameGitCommonDir(boardPath, top)) {
          reason = "foreign_checkout";
        } else {
          repairWorktree(top, boardPath);
        }
        // repairedWorktreeIsBoard, NOT a bare worktreeRootResolves/isProvisioned: repair's job is
        // fixing POINTERS, not un-wedging a rebase (a worktree ALSO wedged mid-rebase stays on a
        // DETACHED HEAD until healed — the heal-ordering edge, the caller re-runs the entry heal
        // once it sees `repaired`) — but a bare pointer-resolves check is NOT sufficient proof this
        // is genuinely the board checkout at all (cold-review finding: `git worktree repair` is a
        // safe no-op on an ALREADY-healthy worktree regardless of which branch it's on, so a
        // sidecar worktree someone genuinely uses for something else, or one merely left on a
        // plain detached HEAD, would otherwise be silently misreported as "repaired").
        if (repairedWorktreeIsBoard(boardPath, top)) return { kind: "repaired", boardPath };
        if (reason !== "foreign_checkout") {
          if (worktreeRootResolves(boardPath) && !sameGitCommonDir(boardPath, top)) {
            reason = "foreign_checkout";
          } else {
            reason = worktreeRootResolves(boardPath) ? "wrong_branch" : "unrepairable";
          }
        }
      }
      // REFUSE, worded to the case actually observed — never telling someone to move aside a
      // worktree that repair simply could not fix, or one that IS the board checkout, as if it
      // were foreign junk. Every remedy stays NON-DESTRUCTIVE (`mv`, never `rm`) — none of these
      // reasons make the directory's CONTENT worthless, only unsafe for sync to adopt automatically.
      const messages: Record<typeof reason, { message: string; help: string }> = {
        foreign: {
          message: `a non-empty '${BUNDLE_DIR}' directory already exists at ${boardPath} but is not the shared board checkout — move it aside, then re-run sync`,
          help: moveAsideHelp(boardPath, "then re-run sync; reconcile any local-only docs afterwards"),
        },
        foreign_checkout: {
          message: `'${BUNDLE_DIR}' at ${boardPath} is git checkout machinery, but it belongs to a different git repository than ${top} — move it aside, then re-run sync to provision this repo's board from origin/board`,
          help: moveAsideHelp(boardPath, "then re-run sync; the existing checkout is untouched, just relocated"),
        },
        unrepairable: {
          message: `'${BUNDLE_DIR}' at ${boardPath} looks like the board checkout with stale pointers that 'git worktree repair' could not fix (its git-internal registration is likely gone) — move it aside, then re-run sync to re-provision fresh from origin/board`,
          help: moveAsideHelp(boardPath, "then re-run sync; recover any local-only, unpushed docs from the backup afterwards"),
        },
        wrong_branch: {
          message: `'${BUNDLE_DIR}' at ${boardPath} is git checkout machinery (a linked worktree or nested repo), but it is not checked out to the '${BOARD_BRANCH}' branch (nor mid-rebase from it) — it is likely used for something else — move it aside, then re-run sync to re-provision the board fresh from origin/board`,
          help: moveAsideHelp(boardPath, "then re-run sync; the existing checkout is untouched, just relocated"),
        },
      };
      throw new BoardGitError("RUNTIME", messages[reason].message, {
        details: { path: boardPath },
        help: messages[reason].help,
      });
    }
    if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote) {
      return { kind: "local_board", boardPath, remoteExists: hasRemote };
    }
    // The one resolvable pre-existing state: an EMPTY directory. Remove it so worktree add can
    // create the path itself.
    rmdirSync(boardPath);
  }

  // A branch name alone is not provenance. Interactive sync and SessionStart adopt an
  // unprovisioned local branch only when its commit exactly equals the freshly-pruned remote ref;
  // that preserves migration recovery while refusing unrelated/private branches.
  if (hasLocal && budget.allowLocalBranch === false && !localMatchesRemote) {
    return { kind: "local_board", boardPath, remoteExists: hasRemote };
  }

  const r = hasLocal
    ? runGit(top, [...RELATIVE_WORKTREE_CONFIG, "worktree", "add", boardPath, BOARD_BRANCH])
    : runGit(top, [
        ...RELATIVE_WORKTREE_CONFIG,
        "worktree",
        "add",
        "--no-track",
        "-b",
        BOARD_BRANCH,
        boardPath,
        `refs/remotes/${BOARD_REF}`,
      ]);
  if (r.status !== 0) {
    // The branch is already checked out (somewhere): the checkout EXISTS — idempotent success.
    // STRUCTURAL check, not message-matching: git's refusal phrasing changed across versions
    // ("already checked out" ≤2.47, "already used by worktree" ≥2.48), and LC_ALL=C pins locale
    // but not version. `worktree list --porcelain` names the checked-out branch of every
    // worktree in a stable machine format — version-proof.
    const list = runGit(top, ["worktree", "list", "--porcelain"]);
    if (list.status === 0 && list.stdout.split("\n").includes(`branch refs/heads/${BOARD_BRANCH}`)) {
      return { kind: "already", boardPath };
    }
    throw classifyGitError(failureOf(["worktree", "add"], r));
  }
  return { kind: "provisioned", boardPath, source: hasLocal ? "local" : "remote" };
}

// ── stale-rebase self-heal primitives (consumed at SYNC ENTRY by U3a, adjudication C) ─

/** True when the board worktree is wedged mid-rebase (a crash/kill left `rebase-merge` behind). */
export function detectStaleRebase(boardPath: string): boolean {
  return (
    existsSync(worktreeGitPath(boardPath, "rebase-merge")) ||
    existsSync(worktreeGitPath(boardPath, "rebase-apply"))
  );
}

/** Abort the wedged rebase, restoring the pre-rebase worktree. */
export function abortStaleRebase(boardPath: string): void {
  mustGit(boardPath, ["rebase", "--abort"], { rebase: true });
}

// ── doc-change vocabulary ─────────────────────────────────────────────────────

export type DocVerb = "added" | "updated" | "deleted";

/**
 * One board doc's change, ENRICHED from its own frontmatter. `actor` is read PER-DOC FROM
 * FRONTMATTER — never from a commit subject or git author (adjudication F: commit metadata is a
 * human mirror, not the attribution source).
 */
export interface DocChange {
  docId: string;
  actor: string;
  verb: DocVerb;
  kind: string;
  title: string;
}

const UNKNOWN = "unknown";

/** Non-empty trimmed string, else the `unknown` placeholder. */
function fmString(v: unknown): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN;
}

/** True when a repo-relative path is a concept document (a non-reserved `.md`). */
export function isConceptDocPath(relPath: string): boolean {
  return relPath.endsWith(".md") && !isReservedFile(relPath);
}

/** Parse `--name-status` output lines into `[statusLetter, path]` pairs (rename detection is off). */
export function nameStatusRows(out: string): Array<{ letter: string; relPath: string }> {
  return out
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.length > 0)
    .map((l) => {
      const [letter = "", ...rest] = l.split("\t");
      return { letter: letter.trim().charAt(0), relPath: rest.join("\t") };
    })
    .filter((r) => r.letter.length > 0 && r.relPath.length > 0);
}

/** Map a name-status letter to the doc verb (`T` type-change reads as an update). */
export function verbOf(letter: string): DocVerb | null {
  if (letter === "A") return "added";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}

/**
 * Build the enriched {@link DocChange} for one changed doc by parsing the frontmatter of the doc's
 * content AT `rev` (a `<rev>:<path>` readable by `git show` — the stage for a pending commit, HEAD
 * for a landed change, the old tip for a deletion). Malformed frontmatter degrades to `unknown`
 * fields — a corrupt doc must never block a commit or the feed. `idPath` (default: `relPath`)
 * names the BUNDLE-relative path the doc id derives from — `git show` always reads the full
 * repo-relative `relPath`, so a prefix-scoped diff strips its prefix from the id only.
 */
export function enrichDocChange(
  boardPath: string,
  relPath: string,
  verb: DocVerb,
  rev: string,
  runOptions: RunOptions = {},
  idPath: string = relPath,
): DocChange {
  const docId = conceptIdFromPath(idPath);
  let actor = UNKNOWN;
  let kind = UNKNOWN;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`], runOptions);
  if (shown.status === 0) {
    try {
      const { frontmatter } = parseMarkdown(shown.stdout, relPath);
      actor = fmString(frontmatter.actor);
      kind = fmString(frontmatter.type);
      const t = fmString(frontmatter.title);
      if (t !== UNKNOWN) title = t;
    } catch {
      // MalformedDocumentError: keep the unknown placeholders.
    }
  }
  return { docId, actor, verb, kind, title };
}

// ── stage + commit (the commit grammar) ───────────────────────────────────────

export interface CommitResult {
  committed: boolean;
  /** Present when committed. */
  sha?: string;
  /** The commit subject actually written (grammar below) — for envelopes/tests, never re-parsed. */
  subject?: string;
  /** The enriched per-doc changes that were committed (empty for a reserved-file-only commit). */
  docs: DocChange[];
}

/**
 * The commit-subject grammar (test-pinned, §U1): stable `board:` prefix; single-doc
 * `board: <actor> — <verb> <id>`; multi-doc single-actor `board: <actor> — N docs` (NEVER
 * "1 docs" — one doc always takes the single-doc form); multi-actor `board: N docs from M actors`
 * (the subject names an actor only when exactly one). A commit that touches ONLY reserved files
 * (index.md/log.md regeneration) gets the stable maintenance subject.
 */
function commitSubject(docs: DocChange[]): string {
  if (docs.length === 0) return "board: bundle maintenance";
  const first = docs[0]!;
  if (docs.length === 1) return `board: ${first.actor} — ${first.verb} ${first.docId}`;
  const actors = [...new Set(docs.map((d) => d.actor))];
  if (actors.length === 1) return `board: ${actors[0]} — ${docs.length} docs`;
  return `board: ${docs.length} docs from ${actors.length} actors`;
}

/**
 * Stage EVERYTHING in the board worktree (`add -A` — the worktree carries only the bundle, so
 * path-scoping is by construction) and commit it with the grammar subject plus a per-doc
 * verb-kind-id list in the BODY (the `git log board` activity feed — human mirror, NEVER parsed
 * back). Skips (idempotent no-op) when nothing is staged. The message travels via `-F -` on stdin
 * — no shell interpolation, no argv-length ceiling. `--no-verify` keeps user hook policy (and any
 * interactive hook) off the machine-managed board branch — hooks configured for the main worktree
 * are shared config in a linked worktree and could otherwise reject or hang the sync commit.
 */
export function stageAndCommit(boardPath: string): CommitResult {
  mustGit(boardPath, ["add", "-A"]);
  if (runGit(boardPath, ["diff", "--cached", "--quiet"]).status === 0) {
    return { committed: false, docs: [] };
  }

  const rows = nameStatusRows(mustGit(boardPath, ["diff", "--cached", "--name-status", "--no-renames"]));
  const docs: DocChange[] = [];
  for (const { letter, relPath } of rows) {
    if (!isConceptDocPath(relPath)) continue;
    const verb = verbOf(letter);
    if (!verb) continue;
    // A pending doc's frontmatter is read from the STAGE (`:0:` — the exact bytes being
    // committed); a deletion's from the outgoing HEAD version.
    docs.push(enrichDocChange(boardPath, relPath, verb, verb === "deleted" ? "HEAD" : ":0"));
  }

  const subject = commitSubject(docs);
  const bodyLines =
    docs.length > 0
      ? docs.map((d) => `${d.verb} ${d.kind} ${d.docId}`)
      : rows.map((r) => `${r.letter} ${r.relPath}`);
  const message = `${subject}\n\n${bodyLines.join("\n")}\n`;
  mustGit(boardPath, ["commit", "--no-verify", "-F", "-"], { input: message });
  const sha = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
  return { committed: true, sha, subject, docs };
}

/** A root commit assembled from a plain bundle without touching the real index or worktree. */
export interface BundleSnapshotCommit extends CommitResult {
  committed: true;
  sha: string;
  tree: string;
}

/** Enumerate the exact filesystem entries Git must capture; never follow symlinked directories. */
function snapshotFilesystemFiles(root: string): string[] {
  const files: string[] = [];
  const visit = (dir: string, prefix: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const relPath = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.name.toLowerCase() === ".git") {
        throw new BoardGitError(
          "RUNTIME",
          `the bundle contains nested git control data at '${relPath}' — establish refuses because ` +
            `Git can silently omit or collapse files below that boundary`,
          { details: { nested_git_paths: [relPath] } },
        );
      }
      if (entry.isDirectory()) visit(path.join(dir, entry.name), relPath);
      else if (entry.isFile() || entry.isSymbolicLink()) files.push(relPath);
      else {
        throw new BoardGitError(
          "RUNTIME",
          `the bundle contains an unsupported filesystem entry at '${relPath}' — only files, ` +
            `directories, and symbolic links can be established safely`,
        );
      }
    }
  };
  visit(root, "");
  return files.sort();
}

/**
 * Assert that a bundle directory's raw file/symlink bytes equal a commit, bypassing Git's clean
 * and smudge views. This guards the destructive establishment boundary: attributes, EOL policy,
 * and configured filters must never make a successful conversion discard the user's source bytes.
 */
export function assertBundleBytesMatchCommit(top: string, bundlePath: string, commit: string): void {
  const listed = runGit(top, ["ls-tree", "-r", "-z", commit]);
  if (listed.status !== 0) throw classifyGitError(failureOf(["ls-tree", "-r", "-z", commit], listed));
  const mismatches: string[] = [];
  for (const row of listed.stdout.split("\0").filter(Boolean)) {
    const tab = row.indexOf("\t");
    if (tab < 0) continue;
    const [mode, type, oid] = row.slice(0, tab).split(" ");
    const relPath = row.slice(tab + 1);
    const absolute = path.resolve(bundlePath, relPath);
    if (!absolute.startsWith(`${path.resolve(bundlePath)}${path.sep}`)) {
      mismatches.push(relPath);
      continue;
    }
    if (type !== "blob" || !oid) {
      mismatches.push(relPath);
      continue;
    }
    const stored = runGitBytes(top, ["cat-file", "blob", oid]);
    if (stored.status !== 0) {
      throw classifyGitError({
        args: ["cat-file", "blob", oid],
        status: stored.status,
        stdout: stored.stdout.toString("utf8"),
        stderr: stored.stderr,
      });
    }
    try {
      const stat = lstatSync(absolute);
      const actual = mode === "120000" ? readlinkSync(absolute, { encoding: "buffer" }) : readFileSync(absolute);
      if ((mode === "120000" && !stat.isSymbolicLink()) || (mode !== "120000" && !stat.isFile())) {
        mismatches.push(relPath);
      } else if (!Buffer.from(actual).equals(stored.stdout)) {
        mismatches.push(relPath);
      }
    } catch {
      mismatches.push(relPath);
    }
  }
  if (mismatches.length > 0) {
    throw new BoardGitError(
      "RUNTIME",
      `bundle bytes differ from the Git snapshot at '${mismatches[0]}' — a Git attribute, ` +
        `clean/smudge filter, EOL rule, or concurrent writer may be rewriting content; no source backup was removed`,
      { details: { byte_mismatches: mismatches.slice(0, 20) } },
    );
  }
}

/**
 * Snapshot a PLAIN bundle directory as a root commit using an isolated temporary Git index.
 *
 * This is the safe half of greenfield establishment: the source directory is read-only, the code
 * worktree/index are untouched, and no `board` ref is created. The returned commit is initially
 * unreachable except by its SHA; the caller either publishes that exact commit or lets normal Git
 * object pruning collect it later. The commit message uses the same grammar as
 * {@link stageAndCommit}, including per-document actor enrichment from the temporary stage.
 */
export function snapshotBundleCommit(top: string, bundlePath: string): BundleSnapshotCommit {
  const gitDir = mustGit(top, ["rev-parse", "--absolute-git-dir"]).trim();
  const filesystemFiles = snapshotFilesystemFiles(bundlePath);
  const scratch = mkdtempSync(path.join(tmpdir(), "aslite-establish-index-"));
  const indexFile = path.join(scratch, "index");
  const snapshotOptions: RunOptions = { gitDir, workTree: bundlePath, indexFile };
  try {
    mustGit(bundlePath, ["read-tree", "--empty"], snapshotOptions);
    // A project commonly ignores `.agentstate-lite/`, and users may also carry broad global or
    // info/exclude rules. Establish snapshots the explicit bundle source, so ignore policy must
    // not silently drop otherwise-valid bundle files from the first published commit.
    mustGit(
      bundlePath,
      ["-c", "core.sparseCheckout=false", "-c", "core.sparseCheckoutCone=false", "add", "-f", "-A", "--", "."],
      snapshotOptions,
    );
    const stagedRows = mustGit(bundlePath, ["ls-files", "--stage", "-z"], snapshotOptions)
      .split("\0")
      .filter(Boolean);
    const gitlinks = stagedRows
      .filter((row) => row.startsWith("160000 "))
      .map((row) => row.slice(row.indexOf("\t") + 1));
    if (gitlinks.length > 0) {
      throw new BoardGitError(
        "RUNTIME",
        `the bundle contains nested git checkout machinery at '${gitlinks[0]}' — establish ` +
          `refuses because Git would publish only a gitlink and omit that directory's files`,
        { details: { nested_git_paths: gitlinks } },
      );
    }
    const stagedFiles = stagedRows.map((row) => row.slice(row.indexOf("\t") + 1)).sort();
    if (
      stagedFiles.length !== filesystemFiles.length ||
      stagedFiles.some((file, index) => file !== filesystemFiles[index])
    ) {
      const staged = new Set(stagedFiles);
      const filesystem = new Set(filesystemFiles);
      throw new BoardGitError("RUNTIME", "Git did not capture every bundle file; nothing was published", {
        details: {
          omitted_paths: filesystemFiles.filter((file) => !staged.has(file)).slice(0, 20),
          unexpected_paths: stagedFiles.filter((file) => !filesystem.has(file)).slice(0, 20),
        },
      });
    }
    const tree = mustGit(bundlePath, ["write-tree"], snapshotOptions).trim();
    const emptyTree = mustGit(top, ["mktree"], { input: "" }).trim();
    const rows = nameStatusRows(
      mustGit(
        bundlePath,
        ["diff", "--cached", "--name-status", "--no-renames", emptyTree],
        snapshotOptions,
      ),
    );
    const docs: DocChange[] = [];
    for (const { letter, relPath } of rows) {
      if (!isConceptDocPath(relPath)) continue;
      const verb = verbOf(letter);
      if (!verb) continue;
      docs.push(enrichDocChange(bundlePath, relPath, verb, ":0", snapshotOptions));
    }
    const subject = commitSubject(docs);
    const bodyLines =
      docs.length > 0
        ? docs.map((d) => `${d.verb} ${d.kind} ${d.docId}`)
        : rows.map((r) => `${r.letter} ${r.relPath}`);
    const message = `${subject}\n\n${bodyLines.join("\n")}\n`;
    const sha = mustGit(top, ["commit-tree", tree], { input: message }).trim();
    assertBundleBytesMatchCommit(top, bundlePath, sha);
    return { committed: true, sha, tree, subject, docs };
  } finally {
    rmSync(scratch, { recursive: true, force: true });
  }
}

// ── fetch + rebase (conflict = DETECT ONLY, adjudication A) ───────────────────

export type FetchRebaseOutcome =
  | { status: "clean" }
  /**
   * A same-doc divergence was DETECTED: the conflicted ids were collected and the rebase was
   * ABORTED — the worktree is pristine, nothing moved. Conflicted concept docs report their doc
   * id; a conflicted reserved/non-doc path reports its repo-relative path verbatim.
   */
  | { status: "conflict"; conflictedDocIds: string[] };

/**
 * `git fetch --prune origin` then `git rebase origin/board` (explicit ref; editors forced non-interactive).
 * On conflict: collect `diff --name-only --diff-filter=U`, `rebase --abort`, and REPORT — zero
 * data movement in U1 (the converging mechanic is U3b). Any other rebase failure (it should not
 * happen on the sync path — full sync commits first, so the rebase starts clean) is classified
 * and thrown.
 */
export function fetchRebase(boardPath: string): FetchRebaseOutcome {
  mustGit(boardPath, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
  const r = runGit(boardPath, ["rebase", BOARD_REF], { rebase: true, timeoutMs: NETWORK_TIMEOUT_MS });
  if (r.status === 0) return { status: "clean" };
  if (detectStaleRebase(boardPath)) {
    const conflicted = mustGit(boardPath, ["diff", "--name-only", "--diff-filter=U"])
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
      .map((p) => (isConceptDocPath(p) ? conceptIdFromPath(p) : p));
    mustGit(boardPath, ["rebase", "--abort"], { rebase: true });
    return { status: "conflict", conflictedDocIds: conflicted };
  }
  throw classifyGitError(failureOf(["rebase", BOARD_REF], r));
}

// ── fetch + rebase, CONVERGING (U3b, plans/sync-verb-implementation §U3b) ─────

/** One conflicted file the converging rebase resolved (keep-upstream + export-local). */
export interface ResolvedConflict {
  /** The repo-relative path of the conflicted file. */
  relPath: string;
  /** The doc id for a concept doc; the repo-relative path VERBATIM for a reserved/non-doc file. */
  entry: string;
  /**
   * True when `entry` is a concept-doc id — the AUTHORITATIVE doc-vs-raw discriminator (derived
   * from the path shape at resolution time, round-2 REQUIRED 2). Consumers must branch on THIS,
   * never re-derive from the entry string (a dotted doc id like `notes/v1.2` is
   * indistinguishable from a raw path by string shape alone).
   */
  isDoc: boolean;
  /**
   * Absolute path of the exported LOCAL version — the FULL-FIDELITY artifact (the blob's exact
   * bytes, round-2 REQUIRED 1) — or null when the local side had no content to save (the local
   * commit DELETED the file — no stage-3 blob exists).
   */
  exportPath: string | null;
  /**
   * Absolute path of the exported LOCAL version's BODY ONLY (round-2 REQUIRED 3): the artifact
   * the reconcile chain's `doc update <id> --body-file <file>` can consume LITERALLY —
   * `--body-file` treats its input as a body, so feeding it the full export would nest the YAML
   * frontmatter into the body. Written only for a concept doc whose local blob parses as OKF
   * markdown; null otherwise (raw/reserved files, local deletions, unparseable blobs).
   */
  bodyExportPath: string | null;
}

export type FetchRebaseResolvingOutcome =
  | { status: "clean" }
  /**
   * Same-doc conflicts were RESOLVED by the converging mechanic (upstream kept, local exported)
   * and the rebase COMPLETED — the worktree is never left mid-state; non-conflicted local commits
   * landed on top of `origin/board`. One entry per conflicted file (deduped across rebase stops:
   * a doc conflicting at several stops keeps its LAST export — the local FINAL content).
   */
  | { status: "resolved"; conflicts: ResolvedConflict[] }
  /**
   * The fetch SUCCEEDED (a live, current view of the remote), but `origin/board` still doesn't
   * resolve — there is nothing to rebase onto because nobody has published this local branch.
   * The command layer refuses ordinary sync and routes the user to explicit `sync --establish`.
   * Distinct from a dead/misconfigured remote, which throws from the fetch above.
   */
  | { status: "no_upstream" };

/**
 * Backstop against a converging loop that stops making progress (should be impossible: every
 * iteration either completes a replayed commit or `--skip`s one, and the todo list is finite).
 */
const MAX_REBASE_STOPS = 1000;

/**
 * `git fetch --prune origin` then `git rebase origin/board`, RESOLVING same-doc conflicts with the
 * CONVERGING mechanic (U3b — replaces U3a's detect-and-abort interim guard on the full-sync path;
 * {@link fetchRebase} keeps its detect-only shape for any consumer that must never move data).
 *
 * WARNING — rebase INVERTS ours/theirs. Replaying local commits ONTO origin/board makes
 * HEAD/stage-2 ("ours") the UPSTREAM version and stage-3 ("theirs") YOUR local version. That
 * inversion is why every step below uses EXPLICIT refs (`origin/board`, `:3:`) and NEVER
 * `--ours`/`--theirs`.
 *
 * The exact verified sequence (research/sync-verb-review Round 2; test-pinned), per conflicted
 * `<path>`:
 *   1. `git show :3:<path> > <export-file>` — FIRST (`:3:` = theirs-in-rebase = the LOCAL
 *      version → this is "yours saved").
 *   2. `git checkout origin/board -- <path>` — keep the UPSTREAM (teammate's) version.
 *   3. `git add -- <path>`.
 * Then advance non-interactively: `GIT_EDITOR=true GIT_SEQUENCE_EDITOR=true git rebase --continue`
 * (the `rebase: true` env invariant), LOOPING the whole block until the rebase state
 * (`rev-parse --git-path rebase-merge` / `rebase-apply`) is GONE — multiple local commits each
 * stop the rebase. Two states the verbatim sequence meets in practice are handled explicitly:
 *   - a replayed commit whose EVERY change was a conflicted path now kept at upstream becomes
 *     EMPTY; `rebase --continue` refuses it, so a stop with NO unmerged files advances with
 *     `git rebase --skip` (the commit's content lives on in the export file);
 *   - a side that has no blob for the path (local deleted it → no stage 3: nothing to export;
 *     upstream deleted it → keep-upstream means `git rm -- <path>`).
 * On ANY unexpected failure mid-loop the rebase is ABORTED before rethrowing — the worktree is
 * never left mid-state on any path.
 *
 * Export files land at `<exportDir>/<relPath>` — the blob's EXACT BYTES (round-2 REQUIRED 1) —
 * with a `<relPath minus .md>.body.md` body-only companion for parseable concept docs (round-2
 * REQUIRED 3, the `doc update --body-file` input). Created 0700/0600; the caller passes a
 * per-bundle dir OUTSIDE the worktree (see cursor.ts `syncExportsDir`).
 */
export function fetchRebaseResolving(boardPath: string, exportDir: string): FetchRebaseResolvingOutcome {
  mustGit(boardPath, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
  // The fetch above is a LIVE view of origin, but there is no `origin/board` to rebase onto —
  // checked structurally (not by parsing rebase's failure prose) so this never collides with the
  // conflict-detection loop below.
  if (runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
    return { status: "no_upstream" };
  }
  const r = runGit(boardPath, ["rebase", BOARD_REF], { rebase: true, timeoutMs: NETWORK_TIMEOUT_MS });
  if (r.status === 0) return { status: "clean" };
  if (!detectStaleRebase(boardPath)) throw classifyGitError(failureOf(["rebase", BOARD_REF], r));

  // `-z` NUL framing (U3b review fix 1): the conflict list is the one parse whose corruption
  // means a STUCK LOOP (a mis-parsed path fails `show :3:`/`checkout`/`rm` on every iteration),
  // so it must be robust even against names the tab/newline-split parsers can't express — NUL
  // output is raw and unquoted BY DEFINITION, independent of any quotepath setting.
  const listConflicted = (): string[] =>
    mustGit(boardPath, ["diff", "--name-only", "-z", "--diff-filter=U"])
      .split("\0")
      .filter((l) => l.length > 0);

  const byPath = new Map<string, ResolvedConflict>();
  try {
    let stops = 0;
    while (detectStaleRebase(boardPath)) {
      if (++stops > MAX_REBASE_STOPS) {
        throw new BoardGitError(
          "RUNTIME",
          `sync's converging rebase did not terminate after ${MAX_REBASE_STOPS} stops — aborting to leave the board unchanged`,
        );
      }
      const conflicted = listConflicted();
      if (conflicted.length === 0) {
        // No unmerged files at this stop: the replayed commit became EMPTY (every change it
        // carried was a conflicted path kept at upstream) — drop it. `--skip` may itself stop on
        // the NEXT commit's conflict (tolerated nonzero); the loop handles that stop normally.
        runGit(boardPath, ["rebase", "--skip"], { rebase: true });
        continue;
      }
      for (const relPath of conflicted) {
        // 1. EXPORT yours FIRST: `:3:` = theirs-in-rebase = the LOCAL version (the inversion).
        // BYTES, not a utf8 string (round-2 REQUIRED 1): the export must round-trip the blob
        // byte-identically — a binary/invalid-UTF-8 blob routed through a string is corrupted
        // (invalid sequences become U+FFFD).
        const local = runGitBytes(boardPath, ["show", `:3:${relPath}`]);
        let exportPath: string | null = null;
        let bodyExportPath: string | null = null;
        const isDoc = isConceptDocPath(relPath);
        if (local.status === 0) {
          exportPath = path.join(exportDir, relPath);
          mkdirSync(path.dirname(exportPath), { recursive: true, mode: 0o700 });
          writeFileSync(exportPath, local.stdout, { mode: 0o600 });
          // The BODY-ONLY companion (round-2 REQUIRED 3): the literally-executable
          // `doc update --body-file` input. Only for a concept doc whose blob parses as OKF
          // markdown AND whose bytes round-trip utf8 cleanly (round-3 LOW 2: a doc that PARSES
          // after a lossy decode — an invalid byte became U+FFFD — would get a CORRUPTED body
          // companion while the full export stays exact, and the emitted chain would apply the
          // corruption; skip the companion, and with it the runnable chain, instead). A parse
          // failure likewise just means no runnable chain — the full export remains either way.
          if (isDoc) {
            try {
              const decoded = local.stdout.toString("utf8");
              if (Buffer.from(decoded, "utf8").equals(local.stdout)) {
                const { body } = parseMarkdown(decoded, relPath);
                bodyExportPath = exportPath.replace(/\.md$/, ".body.md");
                writeFileSync(bodyExportPath, body, { mode: 0o600 });
              }
            } catch {
              bodyExportPath = null;
            }
          }
        }
        // 2+3. Keep the UPSTREAM (teammate's) version — explicit ref, never --ours/--theirs. An
        // upstream-side DELETION keeps upstream's state by removing the path instead.
        if (runGit(boardPath, ["cat-file", "-e", `refs/remotes/${BOARD_REF}:${relPath}`]).status === 0) {
          mustGit(boardPath, ["checkout", BOARD_REF, "--", relPath]);
          mustGit(boardPath, ["add", "--", relPath]);
        } else {
          mustGit(boardPath, ["rm", "-f", "--", relPath]);
        }
        byPath.set(relPath, {
          relPath,
          entry: isDoc ? conceptIdFromPath(relPath) : relPath,
          isDoc,
          exportPath,
          bodyExportPath,
        });
      }
      // Advance non-interactively. A nonzero exit that leaves the rebase state behind is a NEW
      // stop (the next commit's conflict, or an empty commit) — the loop resolves it; a nonzero
      // exit with NO rebase state left is a genuine failure.
      const cont = runGit(boardPath, ["rebase", "--continue"], { rebase: true });
      if (cont.status !== 0 && !detectStaleRebase(boardPath)) {
        throw classifyGitError(failureOf(["rebase", "--continue"], cont));
      }
    }
  } catch (err) {
    // NEVER leave the worktree mid-state: restore the pre-rebase board, then rethrow.
    try {
      mustGit(boardPath, ["rebase", "--abort"], { rebase: true });
    } catch {
      /* best-effort — the original error is the one that matters */
    }
    throw err;
  }
  return { status: "resolved", conflicts: [...byPath.values()] };
}

// ── push ──────────────────────────────────────────────────────────────────────

/** `git push origin board`. Failures classify (AUTH exit 4 vs network exit 1, best-effort). */
export function push(boardPath: string): void {
  mustGit(boardPath, ["push", BOARD_REMOTE, BOARD_BRANCH], { timeoutMs: NETWORK_TIMEOUT_MS });
}

/**
 * The committed-folder establishment publishes the freshly created `board` branch WITH TRACKING —
 * `git push -u origin board`, run from the repo TOP (during establishment the branch exists only
 * as a ref; it is not checked out anywhere). The `-u` is LOAD-BEARING (panel round 2): without it
 * the establishing machine's fresh `board` branch has no tracking config at all — sync itself
 * always uses EXPLICIT `origin/board` refs precisely because that state exists, but the humans'
 * own git (`status`, `branch -vv`) reads the tracking config, and this is the one moment the
 * config can be written for free.
 */
export function pushBoardUpstream(top: string): void {
  mustGit(top, ["push", "-u", BOARD_REMOTE, BOARD_BRANCH], { timeoutMs: NETWORK_TIMEOUT_MS });
}

/**
 * Publish an exact, already-built root commit as `origin/board` without first creating a local
 * `board` ref. This is the snapshot-first establishment write: a failed push leaves the source
 * folder, code worktree, code index, and branch namespace untouched.
 */
export function pushBoardCommit(top: string, commit: string): void {
  mustGit(top, ["push", BOARD_REMOTE, `${commit}:refs/heads/${BOARD_BRANCH}`], {
    timeoutMs: NETWORK_TIMEOUT_MS,
  });
}

/** Set the provisioned local board branch's upstream without another network write. */
export function setBoardUpstream(boardPath: string): void {
  mustGit(boardPath, ["branch", "--set-upstream-to", BOARD_REF, BOARD_BRANCH]);
}

/**
 * `git fetch origin`, returning whether it succeeded (nonzero tolerated at THIS layer — the
 * CALLER decides what a dead fetch means). The committed-folder establish path REFUSES on false
 * (U5 fix round, review HIGH 1): the act cannot complete offline anyway — the mandatory `push -u`
 * would fail — and tolerating a dead fetch is exactly what would let a stale clone establish while
 * a teammate's board commit sat unseen on origin (the behind-origin freshness guard needs a LIVE
 * origin to be worth anything). Renamed from `fetchOriginTolerated`: the old name described a
 * tolerance its one real consumer no longer extends.
 */
export function fetchOrigin(top: string): boolean {
  // `--prune` matters here (same D/F class as review adjudication 5): a STALE
  // `refs/remotes/origin/board/<x>` tracking ref — left behind after the remote offender was
  // deleted — would block the push's own local `refs/remotes/origin/board` tracking-ref update.
  // Pruning against the live remote clears it before the namespace check even runs.
  return runGit(top, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS }).status === 0;
}

/** Fetch `origin` with pruning, preserving the classified auth/network failure for strict paths. */
export function fetchOriginRequired(top: string): void {
  mustGit(top, ["fetch", "--prune", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
}

/**
 * U5 fix round (review adjudication 5, empirically confirmed against THIS repo's own origin,
 * which carried `board/sync-verb-tasks`): branch names under the `board/` namespace make
 * `refs/heads/board` UNCREATABLE — git refs form a directory tree, so `refs/heads/board/<x>`
 * (a directory) and `refs/heads/board` (a file) conflict, and the establishment's `push -u` is
 * rejected by the remote. This lists the REMOTE offenders (`ls-remote --heads origin board/*`)
 * as short branch names; a failure to ask the remote throws classified (the committed-folder
 * establish path treats the remote as mandatory — see {@link fetchOrigin}).
 */
export function remoteBoardNamespaceBranches(top: string): string[] {
  const r = runGit(top, ["ls-remote", "--heads", BOARD_REMOTE, `${BOARD_BRANCH}/*`], {
    timeoutMs: NETWORK_TIMEOUT_MS,
  });
  if (r.status !== 0) throw classifyGitError(failureOf(["ls-remote"], r));
  return r.stdout
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => l.split("\t")[1] ?? "")
    .filter((ref) => ref.startsWith("refs/heads/"))
    .map((ref) => ref.slice("refs/heads/".length));
}

/**
 * Branches under the `board/` namespace — locally OR on the remote — make `refs/heads/board`
 * UNCREATABLE (a ref directory/file conflict; empirically confirmed against this repo's own
 * origin, which once carried `board/sync-verb-tasks`). Both establish cases share this guard.
 */
export function boardNamespaceConflicts(top: string): string[] {
  const local = runGit(top, ["for-each-ref", "--format=%(refname:short)", `refs/heads/${BOARD_BRANCH}/`]);
  const localNames =
    local.status === 0
      ? local.stdout
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((n) => `${n} (local)`)
      : [];
  const remoteNames = remoteBoardNamespaceBranches(top).map((n) => `${n} (on ${BOARD_REMOTE})`);
  return [...localNames, ...remoteNames];
}

// ── gitignore entry (both establish cases share the ONE idempotent transform) ──

/** The `.gitignore` line that keeps the board folder out of the code branch's own index. */
export const GITIGNORE_ENTRY = `${BUNDLE_DIR}/`;

/**
 * Return `content` with {@link GITIGNORE_ENTRY} present — unchanged when any existing line already
 * ignores the folder (with or without leading/trailing slash), appended otherwise. Both establish
 * cases share the same idempotent transform.
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

/**
 * The greenfield establish case's gitignore step: append {@link GITIGNORE_ENTRY} to
 * `<top>/.gitignore` in the WORKING TREE ONLY — never committed to the code branch (unlike the
 * committed case's version of this transform, which writes an object-database blob INTO the
 * prepared cleanup commit). Idempotent via {@link withIgnoreEntry}; a call that changes nothing reports
 * `changed: false`. Read/write failures are NOT swallowed — a caller that cannot write
 * `.gitignore` needs to know, since the receipt promises to announce it.
 */
export function ensureBoardGitignoreWorkingTree(top: string): { changed: boolean; path: string } {
  const gitignorePath = path.join(top, ".gitignore");
  let content = "";
  try {
    content = readFileSync(gitignorePath, "utf8");
  } catch {
    /* absent .gitignore reads as empty */
  }
  const updated = withIgnoreEntry(content);
  if (updated === content) return { changed: false, path: gitignorePath };
  writeFileSync(gitignorePath, updated);
  return { changed: true, path: gitignorePath };
}

// ── ff-only pull (the fail-soft SessionStart path) ────────────────────────────

export interface FfPullResult {
  /** True when `origin/board` fast-forwarded the local board HEAD. */
  updated: boolean;
  /**
   * Present when a nonzero exit was SWALLOWED (the fail-soft matrix): `not-a-repo`,
   * `detached-head`, `no-upstream`, `diverged`, `dirty`, `auth`, `network`, `busy`, `git-missing`,
   * `conflict`, or `runtime`. A successful merge after a failed fetch still reports the fetch's
   * reason (best-effort freshness — the merge ran against the last-known `origin/board`).
   */
  swallowed?: string;
}

/** Map a classified BoardGitError code to the ff-pull swallow-reason vocabulary. */
function swallowReason(err: BoardGitError): string {
  switch (err.code) {
    case "GIT_MISSING":
      return "git-missing";
    case "NO_UPSTREAM":
      return "no-upstream";
    case "GIT_BUSY":
      return "busy";
    case "AUTH_REQUIRED":
      return "auth";
    case "TRANSIENT":
      return "network";
    case "CONFLICT":
      return "conflict";
    default:
      return "runtime";
  }
}

/**
 * `git fetch origin` → `git merge --ff-only origin/board`, SWALLOWING every nonzero exit — the
 * fail-soft matrix (§U1): not-a-repo, no-remote/no-upstream, detached HEAD, divergence, dirty
 * refusal, auth/network, a held lock, even a missing git binary. This is the SessionStart pull's
 * primitive: it must never throw and never block a render on repo state.
 */
export function ffPull(boardPath: string, budget: NetworkBudgetOptions = {}): FfPullResult {
  try {
    if (!repoTopLevel(boardPath)) return { updated: false, swallowed: "not-a-repo" };
    // Detached HEAD: an ff merge would move the detached HEAD, not the board branch — skip.
    if (runGit(boardPath, ["symbolic-ref", "-q", "HEAD"]).status !== 0) {
      return { updated: false, swallowed: "detached-head" };
    }
    const before = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();

    let fetchReason: string | undefined;
    const fetched = runGit(boardPath, ["fetch", "--prune", BOARD_REMOTE], {
      timeoutMs: budget.fetchTimeoutMs ?? NETWORK_TIMEOUT_MS,
      connectTimeoutSeconds: budget.connectTimeoutSeconds,
    });
    if (fetched.status !== 0) {
      // Keep going: origin/board may exist from an earlier fetch; the merge is still meaningful.
      fetchReason = swallowReason(classifyGitError(failureOf(["fetch", "--prune"], fetched)));
    }

    const merged = runGit(boardPath, ["merge", "--ff-only", BOARD_REF]);
    if (merged.status !== 0) {
      const text = `${merged.stderr}\n${merged.stdout}`;
      if (/Not possible to fast-forward/i.test(text) || /have diverged/i.test(text)) {
        return { updated: false, swallowed: "diverged" };
      }
      if (/local changes .* would be overwritten|Please commit your changes or stash/i.test(text)) {
        return { updated: false, swallowed: "dirty" };
      }
      return { updated: false, swallowed: swallowReason(classifyGitError(failureOf(["merge"], merged))) };
    }

    const after = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();
    const result: FfPullResult = { updated: after !== before };
    if (fetchReason !== undefined) result.swallowed = fetchReason;
    return result;
  } catch (err) {
    // Fail-soft to the last defense: even a spawn-level failure is swallowed here.
    if (isBoardGitError(err)) return { updated: false, swallowed: swallowReason(err) };
    return { updated: false, swallowed: "runtime" };
  }
}

// ── unpushed count ────────────────────────────────────────────────────────────

/**
 * Local board commits ahead of the explicit `origin/board` ref, or `null` when no such ref exists
 * (no remote / never fetched) — the caller distinguishes "0 unpushed" from "no upstream to count
 * against" (the U4 backstop needs both).
 */
export function unpushedCount(boardPath: string): number | null {
  if (runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
    return null;
  }
  const out = mustGit(boardPath, ["rev-list", "--count", `${BOARD_REF}..HEAD`]).trim();
  const n = Number.parseInt(out, 10);
  return Number.isFinite(n) ? n : 0;
}

// ── small named ops the flow layer composes (promoted from commands/sync.ts, A0) ─

/** The board worktree's current HEAD sha; a failure throws classified. */
export function currentHead(boardPath: string): string {
  const r = runGit(boardPath, ["rev-parse", "HEAD"]);
  if (r.status !== 0) {
    throw classifyGitError({ args: ["rev-parse", "HEAD"], status: r.status, stdout: r.stdout, stderr: r.stderr });
  }
  return r.stdout.trim();
}

/**
 * Count of lines in `git status --porcelain` — uncommitted (staged or not) changes in the
 * worktree. `prefix` (board-git PR C) scopes the count to one pathspec — the in-tree backstop's
 * variant, so a dirty CODE tree never inflates the board's uncommitted count; branch-mode callers
 * omit it (the board worktree carries only the bundle, so repo-wide IS bundle-wide there).
 */
export function countUncommitted(boardPath: string, prefix?: string): number {
  const r = runGit(boardPath, ["status", "--porcelain", ...(prefix ? ["--", prefix] : [])]);
  if (r.status !== 0) return 0;
  return r.stdout.split("\n").filter((l) => l.trim().length > 0).length;
}
