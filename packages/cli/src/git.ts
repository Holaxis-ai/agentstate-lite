/**
 * `git.ts` — the sync verb's git PORCELAIN layer (U1, plans/sync-verb-implementation §U1).
 *
 * ONE spawn wrapper ({@link runGit}) enforces the plan's "global porcelain invariants" on every
 * invocation; the exported ops (provision, stage-and-commit, fetch-rebase, push, ff-pull,
 * changes-since, unpushed-count, stale-rebase detect/abort) are the ONLY vocabulary the sync
 * command (U3a) and SessionStart pull (U4) speak. COMMAND LAYER ONLY: `@agentstate-lite/core`
 * never learns git exists — this module CONSUMES core (its one frontmatter parser, its one
 * path/reserved-file vocabulary) and is consumed by `commands/`.
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
 *   - No raw git on stdout: every failure routes through `classifyGitError` (errors.ts) into the
 *     capped exit taxonomy.
 *
 * CONFLICT BOUNDARY (adjudication A): {@link fetchRebase} DETECTS a same-doc conflict — collects
 * the conflicted ids via `diff --name-only --diff-filter=U` — and `git rebase --abort`s cleanly.
 * ZERO data movement, no ours/theirs logic anywhere in this module; the converging keep/export
 * mechanic is U3b, built ON these primitives.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, realpathSync, rmdirSync } from "node:fs";
import path from "node:path";

import { conceptIdFromPath, isReservedFile, parseMarkdown } from "@agentstate-lite/core";
import { CliError, classifyGitError, type GitFailure } from "./errors.js";

/** The dedicated branch that carries ONLY the bundle (its root IS the bundle root). */
export const BOARD_BRANCH = "board";
/** The one remote the board syncs against. */
export const BOARD_REMOTE = "origin";
/** The EXPLICIT remote-tracking ref every pull/rebase/count uses — never `@{u}`. */
export const BOARD_REF = `${BOARD_REMOTE}/${BOARD_BRANCH}`;
/** The conventional folder the board worktree is checked out at (relative to the repo top level). */
export const BUNDLE_DIR = ".agentstate-lite";

// ── the ONE spawn wrapper ─────────────────────────────────────────────────────

/** Env keys whose INHERITED values override `-C` — scrubbed on every invocation (invariant). */
const SCRUBBED_GIT_VARS = ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE"] as const;

/** Default per-op timeout for local plumbing/porcelain. */
const LOCAL_TIMEOUT_MS = 30_000;
/** Budget for ops that touch the network (fetch/push) — bounded, but tolerant of a slow remote. */
const NETWORK_TIMEOUT_MS = 60_000;

export interface GitRunResult {
  status: number;
  stdout: string;
  stderr: string;
}

interface RunOptions {
  /** Per-op timeout; defaults to {@link LOCAL_TIMEOUT_MS}. */
  timeoutMs?: number;
  /** Piped to the child's stdin (the `commit -F -` message channel — no shell interpolation). */
  input?: string;
  /** True for rebase ops: forces GIT_EDITOR/GIT_SEQUENCE_EDITOR=true so nothing interactive opens. */
  rebase?: boolean;
}

/** The hermetic environment for one invocation: ambient env, scrubbed, with the invariants forced. */
function gitEnv(rebase: boolean): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const v of SCRUBBED_GIT_VARS) delete env[v];
  env.GIT_TERMINAL_PROMPT = "0";
  env.GIT_SSH_COMMAND = "ssh -o BatchMode=yes -o ConnectTimeout=10";
  if (rebase) {
    env.GIT_EDITOR = "true";
    env.GIT_SEQUENCE_EDITOR = "true";
  }
  return env;
}

/**
 * Run `git -C <dir> <args…>` under the porcelain invariants, TOLERATING a nonzero exit (the caller
 * inspects `status`). A spawn-level failure (no git binary, fired timeout) can never be a
 * legitimate outcome, so it THROWS the classified `CliError` (GIT_MISSING / TRANSIENT) directly.
 */
export function runGit(dir: string, args: string[], opts: RunOptions = {}): GitRunResult {
  const r = spawnSync("git", ["-C", dir, ...args], {
    env: gitEnv(opts.rebase ?? false),
    encoding: "utf8",
    timeout: opts.timeoutMs ?? LOCAL_TIMEOUT_MS,
    input: opts.input,
    maxBuffer: 32 * 1024 * 1024,
  });
  if (r.error) {
    const code = (r.error as NodeJS.ErrnoException).code;
    throw classifyGitError({
      args,
      status: r.status ?? null,
      stdout: r.stdout ?? "",
      stderr: r.stderr ?? "",
      timedOut: code === "ETIMEDOUT",
      spawnErrorCode: code ?? "SPAWN",
    });
  }
  // A killed child (e.g. timeout without an error object on some platforms) has status null.
  if (r.status === null) {
    throw classifyGitError({ args, status: null, stdout: r.stdout ?? "", stderr: r.stderr ?? "", timedOut: true });
  }
  return { status: r.status, stdout: r.stdout ?? "", stderr: r.stderr ?? "" };
}

/** A {@link GitFailure} from a tolerated-but-failed invocation, for classification. */
function failureOf(args: string[], r: GitRunResult): GitFailure {
  return { args, status: r.status, stdout: r.stdout, stderr: r.stderr };
}

/** Run a git op that MUST succeed; a nonzero exit throws the classified `CliError`. */
function mustGit(dir: string, args: string[], opts: RunOptions = {}): string {
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

/**
 * True when the conventional board worktree is genuinely provisioned for the repo containing
 * `dir`: `<toplevel>/.agentstate-lite` exists, is ITSELF a worktree root (not a plain directory
 * falling through to the parent repo), and has the `board` branch checked out.
 */
export function isProvisioned(dir: string): boolean {
  const top = repoTopLevel(dir);
  if (!top) return false;
  const boardPath = path.join(top, BUNDLE_DIR);
  if (!existsSync(boardPath)) return false;
  const boardTop = repoTopLevel(boardPath);
  if (!boardTop || realOrSame(boardTop) !== realOrSame(boardPath)) return false;
  const branch = runGit(boardPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
  return branch.status === 0 && branch.stdout.trim() === BOARD_BRANCH;
}

// ── provisioning (self-heal) ──────────────────────────────────────────────────

export type ProvisionOutcome =
  /** The worktree was created (fresh or self-healed clone). */
  | { kind: "provisioned"; boardPath: string }
  /** Already provisioned (or the board branch is already checked out) — idempotent success. */
  | { kind: "already"; boardPath: string }
  /** `dir` is not inside a git repository at all — the caller emits `sync: nothing to sync`. */
  | { kind: "no_repo" }
  /** A repo, but no `board` branch exists locally OR on origin — nothing to provision from. */
  | { kind: "no_board" };

/**
 * SELF-HEALING board-worktree provisioning (all branches empirically grounded, §U1):
 * `git fetch origin` runs BEFORE `board` is referenced (best-effort: offline provisioning still
 * works from a previously fetched `origin/board`); worktree absent but a board ref exists → a
 * fresh `git worktree add`; a pre-existing NON-EMPTY `.agentstate-lite/` that is NOT the board
 * worktree is REFUSED with guidance (never a blind add — a pre-existing EMPTY directory is the one
 * resolvable case, removed so the add can proceed); "already checked out" from git = idempotent
 * success. The `--no-track` add faithfully reproduces the migration machine's no-tracking-config
 * state — which is exactly why every other op uses EXPLICIT `origin/board` refs.
 */
export function provisionBoardWorktree(dir: string): ProvisionOutcome {
  const top = repoTopLevel(dir);
  if (!top) return { kind: "no_repo" };
  const boardPath = path.join(top, BUNDLE_DIR);
  if (isProvisioned(top)) return { kind: "already", boardPath };

  // Fetch BEFORE referencing board — tolerated nonzero (offline / no remote): the local ref
  // checks below decide what is actually provisionable.
  runGit(top, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });

  const hasLocal = runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
  const hasRemote =
    runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0;
  if (!hasLocal && !hasRemote) return { kind: "no_board" };

  if (existsSync(boardPath)) {
    if (readdirSync(boardPath).length > 0) {
      // Non-empty and (per isProvisioned above) not the board worktree: REFUSE with guidance.
      throw new CliError(
        "RUNTIME",
        `a non-empty '${BUNDLE_DIR}' directory already exists at ${boardPath} but is not the shared board checkout — move it aside, then re-run sync`,
        {
          details: { path: boardPath },
          help: `mv ${BUNDLE_DIR} ${BUNDLE_DIR}.bak  # then re-run sync; reconcile any local-only docs afterwards`,
        },
      );
    }
    // The one resolvable pre-existing state: an EMPTY directory. Remove it so worktree add can
    // create the path itself.
    rmdirSync(boardPath);
  }

  const r = hasLocal
    ? runGit(top, ["worktree", "add", boardPath, BOARD_BRANCH])
    : runGit(top, [
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
    if (/already checked out/i.test(r.stderr)) return { kind: "already", boardPath };
    throw classifyGitError(failureOf(["worktree", "add"], r));
  }
  return { kind: "provisioned", boardPath };
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

export type DocVerb = "created" | "updated" | "deleted";

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
function isConceptDocPath(relPath: string): boolean {
  return relPath.endsWith(".md") && !isReservedFile(relPath);
}

/** Parse `--name-status` output lines into `[statusLetter, path]` pairs (rename detection is off). */
function nameStatusRows(out: string): Array<{ letter: string; relPath: string }> {
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
function verbOf(letter: string): DocVerb | null {
  if (letter === "A") return "created";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}

/**
 * Build the enriched {@link DocChange} for one changed doc by parsing the frontmatter of the doc's
 * content AT `rev` (a `<rev>:<path>` readable by `git show` — the stage for a pending commit, HEAD
 * for a landed change, the old tip for a deletion). Malformed frontmatter degrades to `unknown`
 * fields — a corrupt doc must never block a commit or the feed.
 */
function enrichDocChange(boardPath: string, relPath: string, verb: DocVerb, rev: string): DocChange {
  const docId = conceptIdFromPath(relPath);
  let actor = UNKNOWN;
  let kind = UNKNOWN;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`]);
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
 * `git fetch origin` then `git rebase origin/board` (explicit ref; editors forced non-interactive).
 * On conflict: collect `diff --name-only --diff-filter=U`, `rebase --abort`, and REPORT — zero
 * data movement in U1 (the converging mechanic is U3b). Any other rebase failure (it should not
 * happen on the sync path — full sync commits first, so the rebase starts clean) is classified
 * and thrown.
 */
export function fetchRebase(boardPath: string): FetchRebaseOutcome {
  mustGit(boardPath, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
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

// ── push ──────────────────────────────────────────────────────────────────────

/** `git push origin board`. Failures classify (AUTH exit 4 vs network exit 1, best-effort). */
export function push(boardPath: string): void {
  mustGit(boardPath, ["push", BOARD_REMOTE, BOARD_BRANCH], { timeoutMs: NETWORK_TIMEOUT_MS });
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

/** Map a classified git CliError code to the ff-pull swallow-reason vocabulary. */
function swallowReason(err: CliError): string {
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
export function ffPull(boardPath: string): FfPullResult {
  try {
    if (!repoTopLevel(boardPath)) return { updated: false, swallowed: "not-a-repo" };
    // Detached HEAD: an ff merge would move the detached HEAD, not the board branch — skip.
    if (runGit(boardPath, ["symbolic-ref", "-q", "HEAD"]).status !== 0) {
      return { updated: false, swallowed: "detached-head" };
    }
    const before = mustGit(boardPath, ["rev-parse", "HEAD"]).trim();

    let fetchReason: string | undefined;
    const fetched = runGit(boardPath, ["fetch", BOARD_REMOTE], { timeoutMs: NETWORK_TIMEOUT_MS });
    if (fetched.status !== 0) {
      // Keep going: origin/board may exist from an earlier fetch; the merge is still meaningful.
      fetchReason = swallowReason(classifyGitError(failureOf(["fetch"], fetched)));
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
    if (err instanceof CliError) return { updated: false, swallowed: swallowReason(err) };
    return { updated: false, swallowed: "runtime" };
  }
}

// ── changes since a cursor token ──────────────────────────────────────────────

export type ChangesSinceOutcome =
  | { ok: true; changes: DocChange[] }
  /** The cursor token no longer resolves to a commit (history rewritten) — the caller re-anchors. */
  | { ok: false; reason: "dangling" };

/**
 * The enriched delta feed: every concept doc changed between `<token>..HEAD` (two-dot —
 * snapshot-to-snapshot, requiring object EXISTENCE not ancestry), each row read from the doc's OWN
 * frontmatter at HEAD (or, for a deletion, at the cursor's snapshot). Guarded by
 * `git cat-file -e <token>^{commit}` so a rewritten-away cursor reports `dangling` instead of a
 * fatal `Invalid revision range` — the honest re-anchor path is the CURSOR module's job (U2).
 */
export function changesSince(boardPath: string, token: string): ChangesSinceOutcome {
  if (runGit(boardPath, ["cat-file", "-e", `${token}^{commit}`]).status !== 0) {
    return { ok: false, reason: "dangling" };
  }
  const rows = nameStatusRows(
    mustGit(boardPath, ["diff", "--name-status", "--no-renames", `${token}..HEAD`]),
  );
  const changes: DocChange[] = [];
  for (const { letter, relPath } of rows) {
    if (!isConceptDocPath(relPath)) continue;
    const verb = verbOf(letter);
    if (!verb) continue;
    changes.push(enrichDocChange(boardPath, relPath, verb, verb === "deleted" ? token : "HEAD"));
  }
  return { ok: true, changes };
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
