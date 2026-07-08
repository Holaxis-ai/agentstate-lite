// `agentstate-lite sync` — share the board branch with a remote (U3a core flow + U3b conflict
// resolution, plans/sync-verb-implementation §U3a/§U3b).
//
// FLOW (full sync; `--pull-only` skips steps 2 and 4):
//   0. entry self-heal (adjudication C): a stale mid-rebase state found at ENTRY (a crashed/killed
//      prior run) is aborted BEFORE the commit step — a wedged worktree kills commit first.
//   1. provision the board worktree (U1 self-heal, `provisionBoardWorktree`).
//   2. commit (`stageAndCommit`; skip-empty).
//   3. pull — full sync: `rebase origin/board` with the CONVERGING conflict mechanic
//      (`fetchRebaseResolving`, U3b: keep upstream, export local, COMPLETE the rebase — replaces
//      U3a's detect-and-abort interim guard). `--pull-only`: `merge --ff-only origin/board`
//      (`ffPull`) — NEVER rebase.
//   4. push (`push`). A run that resolved conflicts SKIPS the push and exits CONFLICT(5) with the
//      amended pack (c) envelope — the documented reconcile chain's next `sync` pushes everything.
//   5. envelope + awareness cache write (U2's cursor/cache/marker store — consumed by U4).
//
// `sync --show-incoming <id>` (U3b) is the conflict VIEWER: prints the upstream version of one doc
// via `git show origin/board:<path>` with full doc-read semantics (truncation, `--out` byte hatch,
// `--out -` stderr envelope), labeled "as of last fetch" (no implicit fetch — adjudication G).
//
// COMMAND LAYER ONLY: this module is the FIRST real caller of both U1 (`git.ts`) and U2
// (`cursor.ts`) — it composes their exported vocabulary but never re-implements git plumbing or
// the state-store schema. `runGit` (U1's own spawn wrapper) is called directly in a few spots
// below ONLY for primitives U1 doesn't already expose as a named op (current HEAD, uncommitted
// count, the origin remote URL for cursor keying) — never to duplicate an op U1 already provides.
//
// TWO CALLERS, ONE `ffPull` PRIMITIVE, DIFFERENT TOLERANCE: U1's `ffPull` is deliberately fail-soft
// (its own header: "must never throw and never block a render") for U4's SessionStart caller. THIS
// command is the OTHER caller of the SAME primitive and has the OPPOSITE posture: `--pull-only` is
// an interactive verb that must report a REAL structured outcome, so `ffSwallowToError` below
// translates every `FfPullResult.swallowed` reason into the capped CliError taxonomy instead of
// silently no-op'ing.
import { existsSync, realpathSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import {
  assertSafeConceptId,
  conceptIdFromPath,
  isReservedFile,
  parseMarkdown,
  pathFromConceptId,
} from "@agentstate-lite/core";
import {
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  abortStaleRebase,
  changesSince,
  detectStaleRebase,
  fetchRebaseResolving,
  ffPull,
  provisionBoardWorktree,
  push,
  repoTopLevel,
  runGit,
  stageAndCommit,
  unpushedCount,
  type CommitResult,
  type DocChange,
  type FetchRebaseResolvingOutcome,
  type ResolvedConflict,
} from "../git.js";
import {
  REANCHOR_NOTE,
  bundleKey,
  readCursor,
  recordReanchor,
  syncExportsDir,
  writeCache,
  writeCursor,
  type AwarenessDeltaRow,
} from "../cursor.js";
import { CliError, asHandled, classifyGitError, toExit } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, renderErrorEnvelope, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { BODY_PREVIEW_LIMIT } from "./doc/common.js";

export const SYNC_USAGE = `agentstate-lite sync — share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]

Shares this repo's board (\`.agentstate-lite\`, a linked worktree of the \`board\` branch) with your
teammates: commits any pending local doc changes, pulls theirs, and pushes yours — touching
nothing outside the board. \`--pull-only\` skips commit + push and only fast-forwards from origin
(never rebases) — the mode a read-only session (or SessionStart) uses to pick up incoming changes
without publishing local ones.

Two definitive empty states (exit 0): no git repo (or no board anywhere yet, local or on origin)
prints 'sync: nothing to sync'; a clean, already-current board prints 'sync: already up to date'.
Otherwise the receipt reports { committed, pushed, pulled, actor, incoming } — \`incoming\` is the
enriched delta of docs that arrived this run (capped; --limit controls the row cap, default 20).

When a doc changed on BOTH sides, sync CONVERGES: your teammate's version is kept on the board,
YOUR version is saved to an export file named in the receipt, and the sync completes (the
worktree is never left mid-state; non-conflicted local changes still land). The run exits 5 with
one row per conflicted doc and the reconcile chain: \`sync --show-incoming <id>\` to view the kept
incoming version, \`doc update <id> --body-file <export-file>\` to write your merged version on
top, then \`sync\` again to share it.

\`sync --show-incoming <id>\` prints the board's incoming (upstream) version of one doc — the
state of \`origin/board\` as of the last fetch (it never fetches). Full doc-read semantics: large
bodies truncate and point at \`--out <file>\` (raw bytes to disk); \`--out -\` streams the raw
bytes to stdout with the receipt (or any error envelope) on stderr. A doc absent upstream renders
as an expected state, not an error.

If the push fails after a local commit already landed (offline, revoked/expired credentials, or a
locked repository), the receipt still reports what committed/pulled successfully — your work is
saved locally either way, and re-running sync retries the push.

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --out <file>         With --show-incoming: write the raw bytes to <file> ('-' = raw to stdout)
  --dir <path>         Directory to run sync from (default: the cwd) — must be inside a git repo
  --limit <n>          Cap the incoming-delta row list to <n> rows (default: 20; 0 = unlimited)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;

export interface SyncCliDeps {
  stdout: (s: string) => void;
  /** show-incoming's receipt/envelope channel when stdout is reserved for raw bytes (--out -). */
  stderr: (s: string) => void;
  /** Raw byte writes for `--show-incoming --out -` (stdout stays a pure byte stream). */
  writeStdoutBytes: (data: Uint8Array) => void;
}

/** AXI list-cap default: 20 rows unless `--limit` overrides it (0 = unlimited). */
const DEFAULT_LIMIT = 20;

/** A capped row list — the repo's standard `{shown, total, rows}` convention (see `status.ts`). */
export interface Capped {
  shown: number;
  total: number;
  rows: Record<string, unknown>[];
}

export function cap(rows: Record<string, unknown>[], limit: number): Capped {
  const bounded = limit > 0 ? rows.slice(0, limit) : rows;
  return { shown: bounded.length, total: rows.length, rows: bounded };
}

/**
 * The push-fail safety message (message pack (d), test-pinned VERBATIM): leads with reassurance,
 * then names the failure class and the retry path. Used for the two failure classes the brief
 * names explicitly (auth/network) — see {@link pushFailureMessage} for the generalization to any
 * other push-failure code.
 */
export const PUSH_FAIL_SAFETY_MESSAGE =
  "committed to the board locally — your work is saved. The push failed (offline or auth); " +
  "re-run sync when you're back online or your access is restored.";

/**
 * Build the push-failure warning for the partial envelope. AUTH_REQUIRED and TRANSIENT (the two
 * classes the brief names — "offline or auth") get the EXACT pinned safety string. Any other
 * classification (NO_UPSTREAM, GIT_BUSY, a generic RUNTIME) still gets the SAME safety-first
 * framing — a local commit already landed regardless of why the push failed — with the actual
 * classified message appended instead of the auth/network-specific phrasing (deviation, flagged in
 * the builder report: the brief pins the exact string only for auth/network; this generalizes the
 * REASSURANCE without inventing a second exact-pinned string for the other codes).
 */
export function pushFailureMessage(err: CliError): string {
  if (err.code === "AUTH_REQUIRED" || err.code === "TRANSIENT") return PUSH_FAIL_SAFETY_MESSAGE;
  return `committed to the board locally — your work is saved. ${err.message}`;
}

/**
 * Help attached to a NO_UPSTREAM error encountered on the sync path (message pack (f) pins the
 * MESSAGE, not this help text — the exact wording here is a builder judgment call, flagged in the
 * report). Points at the two real fixes: this repo was never migrated onto a shared board, or the
 * local `origin` remote doesn't point at the same repo a teammate already migrated.
 */
export function upstreamHelp(inv: string): string {
  return (
    `if a teammate has already set this project up for sharing, make sure your \`origin\` remote ` +
    `points at the SAME repository they pushed the \`board\` branch to; if not, someone needs to run ` +
    `the (human-gated) migration once before ${inv} sync can share it`
  );
}

/**
 * Attach {@link upstreamHelp} to a NO_UPSTREAM CliError (idempotent — never doubles up); any other
 * error passes through UNCHANGED. Non-throwing (unlike its predecessor `enrichNoUpstream`) so the
 * caller can compose it with {@link withCommitSafety} before deciding whether/how to throw —
 * review finding 3 needs both transformations applied to the SAME error, in order, before the
 * final throw.
 */
function withUpstreamHelp(err: CliError, inv: string): CliError {
  if (err.code === "NO_UPSTREAM" && err.help === undefined) {
    return new CliError("NO_UPSTREAM", err.message, { details: err.details, help: upstreamHelp(inv) });
  }
  return err;
}

/**
 * Classify a raw catch-block value into a CliError (mirrors the fallback every other catch site in
 * this module already uses) — a bare `git.ts` throw is always ALREADY a CliError, but a defensive
 * fallback keeps this module's error handling total.
 */
function toCliError(err: unknown, op: string): CliError {
  if (err instanceof CliError) return err;
  return classifyGitError({ args: [op], status: null, stdout: "", stderr: err instanceof Error ? err.message : String(err) });
}

/**
 * REVIEW FINDING 3 (fixed; retained by U3b): a full sync that COMMITS locally and THEN fails — at
 * fetch/rebase (offline, no upstream, busy) or at the converging conflict terminal — used to
 * rethrow bare, losing the "your work is saved" reassurance push-fail already gets, and skipping
 * the cache write (so U4's unpushed backstop would miss a genuinely stranded commit). This
 * composes {@link pushFailureMessage}'s SAME message selection (the exact safety string for
 * auth/network, a reassurance-prefixed classified message otherwise) onto ANY post-commit failure,
 * not just a push failure — the "work is saved" framing is equally true regardless of WHICH later
 * step failed. `committedThisRun` gates it: when nothing NEW was committed this run
 * (`CommitResult.committed === false` — a skip-empty no-op, OR a conflict against a divergence
 * that was ALREADY committed before this run even started, as in the stale-mid-rebase self-heal
 * path), the error passes through UNCHANGED and NO cache write happens — there is nothing new to
 * reassure about or persist, and the converge terminal's exact test-pinned string must not gain
 * an unexpected prefix in that case.
 */
async function throwPostCommitFailure(
  err: CliError,
  committedThisRun: boolean,
  key: string,
  boardPath: string,
): Promise<never> {
  if (!committedThisRun) throw err;
  const wrapped = new CliError(err.code, pushFailureMessage(err), { details: err.details, help: err.help });
  await writeCache(key, {
    updatedAt: new Date().toISOString(),
    delta: [],
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
  });
  throw wrapped;
}

/**
 * A conflicted entry from `fetchRebase`'s `conflictedDocIds` is EITHER a concept-doc id (extension
 * already stripped by `conceptIdFromPath`) or a reserved/non-doc repo-relative path reported
 * VERBATIM (git.ts's own mapping: `isConceptDocPath(p) ? conceptIdFromPath(p) : p`). A genuine
 * concept id NEVER carries a file extension (the ONE `.md` it had is always stripped); ANY raw
 * path kept verbatim DOES — a reserved file keeps its `.md`, but so would a stray NON-markdown
 * file committed to the board branch (e.g. a binary blob) keep ITS OWN extension. Review finding 4
 * (fixed): the original check here was `.endsWith(".md")`, which wrongly gave a non-`.md` raw path
 * the "doc " prefix too (it doesn't end in `.md`, so it read as a "doc"). The correct structural
 * signal is "does this entry's FINAL PATH SEGMENT carry any extension at all" — no extension means
 * a real concept id; any extension (`.md` or otherwise) means a raw/reserved path, rendered
 * verbatim. Known residual edge case: a concept id whose OWN basename happens to contain a literal
 * dot (e.g. an id derived from `notes/v1.2.md`) would still be misclassified as "raw" here — there
 * is no type tag on `conflictedDocIds` to disambiguate further.
 */
export function isRawPathEntry(entry: string): boolean {
  const base = entry.split("/").pop() ?? entry;
  return base.includes(".");
}

export function conflictLabel(entry: string): string {
  return isRawPathEntry(entry) ? entry : `doc ${entry}`;
}

/**
 * The converging mechanic's per-doc string (adjudication D, test-pinned): "teammate's version
 * kept; yours saved at <path> — reconcile with doc update", prefixed by the entry's label
 * ("doc <id>" for a concept doc; a reserved/raw path VERBATIM). Two builder judgment calls,
 * flagged in the report: (1) a reserved/raw path drops the "— reconcile with doc update" suffix
 * (there is no `doc update` verb for log.md — the kept-upstream/export mechanic still applied
 * identically); (2) a local-side DELETION (no stage-3 blob → nothing to export) says so honestly
 * instead of naming a file that doesn't exist. The DROPPED phrase "nothing was overwritten" stays
 * dropped (amended pack (c)).
 */
export function convergeDocLine(c: Pick<ResolvedConflict, "entry" | "isDoc" | "exportPath">): string {
  const label = conflictLabel(c.entry);
  if (c.exportPath === null) {
    return `${label} — teammate's version kept (your side deleted it; nothing to save)`;
  }
  const reconcile = c.isDoc ? " — reconcile with doc update" : "";
  return `${label} — teammate's version kept; yours saved at ${c.exportPath}${reconcile}`;
}

/** The CONFLICT(5) envelope message: one converge line per conflicted entry, "; "-joined. */
export function buildConvergeMessage(
  conflicts: Array<Pick<ResolvedConflict, "entry" | "isDoc" | "exportPath">>,
): string {
  return conflicts.map(convergeDocLine).join("; ");
}

/**
 * The reconcile HELP CHAIN (amended pack (c)): view the kept incoming version, write your merged
 * version on top as a NEW doc update, then sync again — converges in one pass, loses nothing.
 */
export function convergeHelp(inv: string, id: string, exportPath: string): string {
  return (
    `${inv} sync --show-incoming ${id} → ${inv} doc update ${id} --body-file ${exportPath} → ${inv} sync`
  );
}

/**
 * Enrich one kept-upstream conflicted doc's {kind, title} from the content that LANDED on the
 * board (HEAD after the completed rebase — the teammate's version, unless a later non-conflicting
 * local commit modified it cleanly on top). Absent/malformed content degrades to no fields, the
 * codebase's omit-when-empty convention.
 */
function keptDocMeta(boardPath: string, relPath: string): { kind?: string; title?: string } {
  const shown = runGit(boardPath, ["show", `HEAD:${relPath}`]);
  if (shown.status !== 0) return {};
  try {
    const { frontmatter } = parseMarkdown(shown.stdout, relPath);
    const kind = fmValue(frontmatter.type);
    const title = fmValue(frontmatter.title);
    return {
      ...(kind !== UNKNOWN_FIELD ? { kind } : {}),
      ...(title !== UNKNOWN_FIELD ? { title } : {}),
    };
  } catch {
    return {};
  }
}

/**
 * Project the resolved conflicts into the envelope's row shape (amended pack (c)):
 * `{id|path, kind, title, yours, theirs}` — `yours` is the export file's absolute path (the
 * directly actionable `doc update --body-file` argument), `theirs` names the disposition of the
 * teammate's version ("kept" — it is what's on the board now).
 */
export function toConflictRows(boardPath: string, conflicts: ResolvedConflict[]): Record<string, unknown>[] {
  return conflicts.map((c) => {
    const row: Record<string, unknown> = c.isDoc ? { id: c.entry } : { path: c.entry };
    if (c.isDoc) Object.assign(row, keptDocMeta(boardPath, c.relPath));
    row.yours = c.exportPath !== null ? c.exportPath : "deleted locally — nothing to save";
    const landed = runGit(boardPath, ["cat-file", "-e", `HEAD:${c.relPath}`]).status === 0;
    row.theirs = landed ? "kept" : "kept (deleted upstream)";
    return row;
  });
}

/** Map an `FfPullResult.swallowed` reason (U1's fail-soft vocabulary) to the capped CliError taxonomy. */
export function ffSwallowToError(reason: string, inv: string): CliError {
  switch (reason) {
    case "git-missing":
      return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
        help: "install git (https://git-scm.com/downloads), then re-run the command",
      });
    case "no-upstream":
      return new CliError(
        "NO_UPSTREAM",
        "the board branch isn't linked to a remote yet — sync can't share it",
        { help: upstreamHelp(inv) },
      );
    case "auth":
      return new CliError(
        "AUTH_REQUIRED",
        "sync was denied access to the remote (or the repository is not visible to your credentials)",
        { details: { best_effort: true } },
      );
    case "network":
      return new CliError(
        "TRANSIENT",
        "sync could not reach the remote — offline or the host is unreachable; retry",
        { details: { retryable: true } },
      );
    case "busy":
      return new CliError(
        "GIT_BUSY",
        "another git process is using this repository — retry once it finishes",
        { details: { retryable: true } },
      );
    case "diverged":
      return new CliError(
        "CONFLICT",
        `the board has local commits not yet pushed, and origin has moved too — \`sync --pull-only\` ` +
          `only fast-forwards; run \`${inv} sync\` (without --pull-only) to reconcile`,
      );
    case "conflict":
      return new CliError(
        "CONFLICT",
        `the board worktree has unresolved conflicts — run \`${inv} sync\` (without --pull-only) to reconcile`,
      );
    case "dirty":
      return new CliError(
        "RUNTIME",
        "the board worktree has uncommitted local changes that a fast-forward-only pull would " +
          "overwrite — commit or discard them, or run a full sync instead of --pull-only",
      );
    case "detached-head":
      return new CliError(
        "RUNTIME",
        "the board worktree is in a detached-HEAD state — sync needs the board branch checked out",
        { details: { state: "detached-head" } },
      );
    case "not-a-repo":
      return new CliError(
        "RUNTIME",
        "the board worktree is not a git repository — run sync again to re-provision it",
      );
    default:
      return new CliError(
        "RUNTIME",
        `sync's pull step failed for an unclassified reason (${reason}) — re-run, or run without --pull-only`,
      );
  }
}

/** realpath when the path exists; the path unchanged otherwise (for stable comparisons — mirrors git.ts's own private `realOrSame`, duplicated here since it isn't exported). */
function realOrSame(p: string): string {
  try {
    return realpathSync(p);
  } catch {
    return p;
  }
}

/**
 * STEP 0, entry self-heal (adjudication C) — run BEFORE `provisionBoardWorktree` is even called,
 * not just before commit. `isProvisioned`'s own check reads `git rev-parse --abbrev-ref HEAD` and
 * requires it to equal `board`; during a REBASE, HEAD is DETACHED (rebase checks out commits
 * directly), so a genuinely-provisioned-but-wedged worktree reads as "not provisioned" and
 * `provisionBoardWorktree` would misclassify it as a stray non-worktree directory and refuse
 * outright — never reaching the commit step where the brief's own self-heal was meant to run
 * first. Resolving `<repoTop>/.agentstate-lite` independently here (without going through
 * `provisionBoardWorktree`) breaks that chicken-and-egg: heal the wedge FIRST (restoring the
 * `board` branch checkout), so provisioning's own idempotent "already" check then succeeds
 * normally.
 *
 * REVIEW FINDING 1 (HIGH, fixed): this probe used to skip straight to `detectStaleRebase` once
 * `candidateBoardPath` merely EXISTED, with no check that it is genuinely its OWN worktree root.
 * On a PRE-MIGRATION repo (a PLAIN `.agentstate-lite/` directory committed on `main` — this
 * project's own on-disk shape today, before U5 ever runs), `.agentstate-lite` has no `.git` of its
 * own: `git -C .agentstate-lite rev-parse --git-path rebase-merge` walks UP and resolves into the
 * PARENT repo's shared git dir, so a wedged `main` (the user's own in-progress rebase, unrelated to
 * sync entirely) reads as "the board is wedged" — and `abortStaleRebase` would then run `rebase
 * --abort` against the SAME shared git dir, silently destroying the user's own rebase. The fix
 * mirrors `isProvisioned`'s OWN worktree-boundary check (`git.ts`): `candidateBoardPath` is only
 * ever probed/healed when `repoTopLevel(candidateBoardPath)` resolves back to ITSELF — the
 * structural signature of a genuine linked worktree, never true for a plain subdirectory of the
 * enclosing repo. Best-effort otherwise: any OTHER failure here (path doesn't exist, isn't a repo
 * at all) is swallowed — a genuine problem still resurfaces, correctly classified, from
 * `provisionBoardWorktree` right after.
 */
function healStaleRebaseBeforeProvisioning(dir: string): void {
  try {
    const top = repoTopLevel(dir);
    if (!top) return;
    const candidateBoardPath = path.join(top, BUNDLE_DIR);
    if (!existsSync(candidateBoardPath)) return;
    const boardTop = repoTopLevel(candidateBoardPath);
    if (!boardTop || realOrSame(boardTop) !== realOrSame(candidateBoardPath)) return;
    // REVIEW ROUND 2, FINDING 1 (HIGH impact / low likelihood): the self-resolution check above is
    // ALSO true for an independent NESTED git repo that happens to sit at `.agentstate-lite` (its
    // own `git init`, not our board) — and healing THAT would `rebase --abort` an innocent repo's
    // in-progress rebase, then report "nothing to sync". The board worktree's structural signature
    // is the LINKED-worktree shape: its per-worktree git dir (`.git/worktrees/<name>` inside the
    // parent) differs from the shared common dir (the parent's `.git`); a standalone nested repo
    // has the two EQUAL. Note the `board`-branch check canNOT serve here — the wedged state this
    // heal exists for has a DETACHED HEAD by definition. Only a linked worktree may ever be healed.
    if (!isLinkedWorktree(candidateBoardPath)) return;
    if (detectStaleRebase(candidateBoardPath)) {
      abortStaleRebase(candidateBoardPath);
    }
  } catch {
    /* best-effort probe only — see the doc comment above */
  }
}

/**
 * True when `p` is inside a LINKED git worktree: its per-worktree git dir differs from the shared
 * common dir. A standalone repo — including an unrelated nested repo squatting at the bundle path
 * (review round 2, finding 1) — resolves both to the SAME directory.
 */
function isLinkedWorktree(p: string): boolean {
  const r = runGit(p, ["rev-parse", "--absolute-git-dir", "--git-common-dir"]);
  if (r.status !== 0) return false;
  const [gitDirRaw, commonDirRaw] = r.stdout.trim().split("\n");
  if (!gitDirRaw || !commonDirRaw) return false;
  const commonDir = path.isAbsolute(commonDirRaw) ? commonDirRaw : path.resolve(p, commonDirRaw);
  return realOrSame(gitDirRaw) !== realOrSame(commonDir);
}

/**
 * REVIEW ROUND 2, FINDING 2 (MEDIUM-HIGH): `sync` run from INSIDE the board worktree — exactly
 * where an agent sits right after `doc write --dir .agentstate-lite` — used to fail with a leaked
 * doubled path: `repoTopLevel(dir)` resolves to the board worktree itself, provisioning then
 * fabricates `<board>/.agentstate-lite`, its `worktree add` fails "already checked out", and the
 * fallback returned a boardPath that does not exist. The structural signature of "standing inside
 * the board" is a repo top that is BOTH named `.agentstate-lite` AND a linked worktree; retarget
 * to its parent directory (the enclosing project), where the normal resolution — heal probe, then
 * provisioning's idempotent "already" branch — proceeds against the REAL board path.
 */
function retargetBoardInterior(dir: string): string {
  try {
    const top = repoTopLevel(dir);
    if (top && path.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path.dirname(top);
    }
  } catch {
    /* fall through — the normal flow classifies whatever this is */
  }
  return dir;
}

/** The board worktree's current HEAD sha, via U1's exported `runGit` (no U1 op named this directly). */
function currentHead(boardPath: string): string {
  const r = runGit(boardPath, ["rev-parse", "HEAD"]);
  if (r.status !== 0) {
    throw classifyGitError({ args: ["rev-parse", "HEAD"], status: r.status, stdout: r.stdout, stderr: r.stderr });
  }
  return r.stdout.trim();
}

/** Count of lines in `git status --porcelain` — uncommitted (staged or not) changes in the worktree. */
function countUncommitted(boardPath: string): number {
  const r = runGit(boardPath, ["status", "--porcelain"]);
  if (r.status !== 0) return 0;
  return r.stdout.split("\n").filter((l) => l.trim().length > 0).length;
}

// ── review finding 2: an origin-ref-only diff for the RECEIPT's pulled/incoming ────────────────
//
// `changesSince` (U1) is deliberately HEAD-anchored — the cursor/awareness-cache "since I last
// read up to" contract, which U4 will filter self-authored rows out of at the human face (the
// reviewer judged that cache feed acceptable to stay self-inclusive; see the two `writeCache`
// calls below, which still use `toDeltaRows(changes)`, the cursor-based feed, UNCHANGED). But the
// RECEIPT's `pulled`/`incoming` must report ONLY what genuinely arrived FROM ORIGIN this run —
// a HEAD-anchored diff can't express that: HEAD, after a full sync's rebase, is origin/board's tip
// PLUS whatever this run (or an earlier, still-unpushed run) committed locally, so it double-counts
// self-authored (or already-locally-committed-but-unpushed) docs as "incoming". The fix diffs TWO
// EXPLICIT origin/board refs — before this run's own fetch, and after — which is by construction
// unrelated to local HEAD or local commit history at all.
//
// This duplicates git.ts's private per-doc frontmatter enrichment (`enrichDocChange`/
// `nameStatusRows`/`verbOf`) rather than extending `changesSince` itself, since U1 is
// consume-only for this unit and `changesSince`'s HEAD-anchored shape is deliberate (U2's cursor
// contract). A natural FUTURE refactor: promote a `diffDocsBetween(boardPath, fromRef, toRef)`
// primitive into git.ts, with `changesSince(token)` becoming `diffDocsBetween(token, "HEAD")` — but
// that is a git.ts change, out of scope for a "consume only" unit; flagged in the builder report.

/** The `refs/remotes/origin/board` sha, or `null` when it doesn't resolve (mirrors `unpushedCount`'s own check). */
function resolveOriginRef(boardPath: string): string | null {
  const r = runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]);
  return r.status === 0 ? r.stdout.trim() : null;
}

const UNKNOWN_FIELD = "unknown";
function fmValue(v: unknown): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN_FIELD;
}

function isConceptDocRelPath(relPath: string): boolean {
  return relPath.endsWith(".md") && !isReservedFile(relPath);
}

function nameStatusPairs(out: string): Array<{ letter: string; relPath: string }> {
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

function verbForLetter(letter: string): DocChange["verb"] | null {
  if (letter === "A") return "added";
  if (letter === "M" || letter === "T") return "updated";
  if (letter === "D") return "deleted";
  return null;
}

/** Enrich one changed doc from its OWN frontmatter at `rev` — mirrors git.ts's `enrichDocChange`. */
function enrichDocChangeAt(boardPath: string, relPath: string, verb: DocChange["verb"], rev: string): DocChange {
  const docId = conceptIdFromPath(relPath);
  let actor = UNKNOWN_FIELD;
  let kind = UNKNOWN_FIELD;
  let title = docId;
  const shown = runGit(boardPath, ["show", `${rev}:${relPath}`]);
  if (shown.status === 0) {
    try {
      const { frontmatter } = parseMarkdown(shown.stdout, relPath);
      actor = fmValue(frontmatter.actor);
      kind = fmValue(frontmatter.type);
      const t = fmValue(frontmatter.title);
      if (t !== UNKNOWN_FIELD) title = t;
    } catch {
      /* malformed doc: keep the unknown placeholders, same policy as git.ts's own enrichment */
    }
  }
  return { docId, actor, verb, kind, title };
}

/**
 * The concept docs that changed strictly between two EXPLICIT refs — both origin/board states,
 * NEVER touching local HEAD or local commit history. `null`/equal refs (no known baseline, or
 * genuinely nothing new fetched) yield an empty result rather than a git error.
 */
export function originDocsBetween(boardPath: string, fromRef: string | null, toRef: string | null): DocChange[] {
  if (!fromRef || !toRef || fromRef === toRef) return [];
  const r = runGit(boardPath, ["diff", "--name-status", "--no-renames", `${fromRef}..${toRef}`]);
  if (r.status !== 0) return [];
  const changes: DocChange[] = [];
  for (const { letter, relPath } of nameStatusPairs(r.stdout)) {
    if (!isConceptDocRelPath(relPath)) continue;
    const verb = verbForLetter(letter);
    if (!verb) continue;
    changes.push(enrichDocChangeAt(boardPath, relPath, verb, verb === "deleted" ? fromRef : toRef));
  }
  return changes;
}

/**
 * The per-bundle cursor/cache/marker key (U2's `bundleKey`) for THIS board worktree: keyed by the
 * `origin` remote URL (git worktrees share one remote config with their main worktree) with an
 * empty subpath (the board branch's root IS the bundle root — gate 2), falling back to the
 * absolute board path when no origin URL resolves (mirrors U2's own path fallback for a
 * remote-less repo).
 */
function resolveBundleKey(boardPath: string): string {
  const r = runGit(boardPath, ["remote", "get-url", BOARD_REMOTE]);
  if (r.status === 0 && r.stdout.trim().length > 0) {
    return bundleKey({ remoteUrl: r.stdout.trim(), subpath: "" });
  }
  return bundleKey({ root: boardPath });
}

/** The single actor when every committed doc shares one (mirrors `git.ts`'s commit-subject grammar). */
export function singleActor(docs: DocChange[]): string | undefined {
  if (docs.length === 0) return undefined;
  const actors = new Set(docs.map((d) => d.actor));
  return actors.size === 1 ? docs[0]!.actor : undefined;
}

/** Project the enriched delta feed into the envelope's `incoming` row shape (message pack (a)). */
export function toIncomingRows(changes: DocChange[]): Record<string, unknown>[] {
  return changes.map((c) => ({ verb: c.verb, kind: c.kind, id: c.docId, title: c.title, actor: c.actor }));
}

/**
 * Project the enriched delta feed into `AwarenessDeltaRow[]` (the cache's persisted shape). A plain
 * `DocChange[]` isn't directly assignable — `AwarenessDeltaRow` carries an index signature for a
 * future producer's extra fields, and `DocChange` (a fixed, non-indexed interface) doesn't
 * structurally satisfy it — so this rebuilds each row as a fresh object literal instead.
 */
export function toDeltaRows(changes: DocChange[]): AwarenessDeltaRow[] {
  return changes.map((c) => ({ docId: c.docId, verb: c.verb, kind: c.kind, title: c.title, actor: c.actor }));
}

export async function sync(argv: string[], deps: Partial<SyncCliDeps> = {}): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const inv = cliInvocation();

  const { values } = parseOrUsage(
    () =>
      parseArgs({
        args: argv,
        options: {
          "pull-only": { type: "boolean" },
          "show-incoming": { type: "string" },
          out: { type: "string" },
          dir: { type: "string" },
          limit: { type: "string" },
          json: { type: "boolean" },
          help: { type: "boolean", short: "h" },
        },
        allowPositionals: true,
      }),
    "sync",
  );
  if (values.help) {
    stdout(SYNC_USAGE);
    return;
  }

  // `--show-incoming <id>` is the conflict VIEWER — a pure read of the last-fetched origin/board
  // state, dispatched before any of the sync flow (it never provisions, commits, pulls or pushes).
  if (values["show-incoming"] !== undefined) {
    const id = values["show-incoming"].trim();
    if (!id) {
      throw new CliError("USAGE", "--show-incoming was given an empty value — pass a doc id (or a reserved path like log.md)", {
        help: `${inv} sync --show-incoming <id>`,
      });
    }
    if (values["pull-only"]) {
      throw new CliError("USAGE", "--show-incoming and --pull-only cannot be combined — the viewer never pulls");
    }
    await showIncoming(id, values, deps);
    return;
  }
  if (values.out !== undefined) {
    throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
      help: `${inv} sync --show-incoming <id> --out <file>`,
    });
  }

  let limit = DEFAULT_LIMIT;
  if (values.limit !== undefined) {
    const raw = values.limit.trim();
    if (!/^\d+$/.test(raw)) {
      throw new CliError("USAGE", "--limit must be a non-negative integer (0 = unlimited)");
    }
    limit = Number(raw);
  }

  // Review round 2, finding 2: standing inside the board worktree retargets to the enclosing
  // project so provisioning's idempotent path resolves the REAL board (see retargetBoardInterior).
  const dir = retargetBoardInterior(values.dir ?? process.cwd());
  const pullOnly = Boolean(values["pull-only"]);
  const mode = resolveMode(values);

  // STEP 0: entry self-heal (adjudication C) — a stale mid-rebase state found at ENTRY (a
  // crashed/killed prior sync) is aborted BEFORE provisioning is even checked, let alone the
  // commit step (see the doc comment on {@link healStaleRebaseBeforeProvisioning} for why this
  // must run BEFORE, not after, `provisionBoardWorktree`).
  healStaleRebaseBeforeProvisioning(dir);

  // STEP 1: provisionBoardWorktree resolves repoTopLevel itself, so a bare `dir` outside any git
  // repo — or a repo with no board branch anywhere, local or on origin — both report the SAME
  // definitive empty state: there is nothing to sync (exit 0).
  const outcome = provisionBoardWorktree(dir);
  if (outcome.kind === "no_repo" || outcome.kind === "no_board") {
    stdout(render({ sync: "nothing to sync" }, mode));
    return;
  }
  const boardPath = outcome.boardPath;

  const key = resolveBundleKey(boardPath);
  const storedCursor = await readCursor(key);
  const startHead = currentHead(boardPath);
  // Finding 2's baseline: origin/board's OWN ref as this run understood it BEFORE its own
  // fetch — captured now, before step 2's commit or step 3's fetch, so it can never include
  // anything local.
  const preFetchOriginRef = resolveOriginRef(boardPath);

  // STEP 2: commit (skipped for --pull-only).
  let commitResult: CommitResult = { committed: false, docs: [] };
  if (!pullOnly) {
    commitResult = stageAndCommit(boardPath);
  }

  // STEP 3: pull. Full sync rebases with the CONVERGING conflict mechanic (U3b: keep upstream,
  // export local, COMPLETE the rebase — never left mid-state); --pull-only ff-only-merges (NEVER
  // rebases) via the SAME `ffPull` primitive U4's SessionStart pull uses — but THIS caller
  // translates every swallowed reason into a real structured error instead of silently no-op'ing
  // (see the module header).
  if (pullOnly) {
    const ff = ffPull(boardPath);
    if (ff.swallowed) {
      throw ffSwallowToError(ff.swallowed, inv);
    }
  } else {
    let rebaseOutcome: FetchRebaseResolvingOutcome;
    try {
      rebaseOutcome = fetchRebaseResolving(boardPath, syncExportsDir(key));
    } catch (rawErr) {
      // Finding 3: a fetch/rebase failure AFTER a real local commit this run gets the SAME
      // safety-first framing a push failure does (composed with the NO_UPSTREAM help, in order),
      // and the cache is written with honest counts before the throw.
      const enriched = withUpstreamHelp(toCliError(rawErr, "rebase"), inv);
      throw await throwPostCommitFailure(enriched, commitResult.committed, key, boardPath);
    }
    if (rebaseOutcome.status === "resolved") {
      // CONVERGING outcome (amended pack (c)): the rebase COMPLETED — the teammate's version of
      // each conflicted doc is on the board, the local version is exported, and non-conflicted
      // local changes landed on top of origin/board. The run is still a CONFLICT(5) terminal
      // state: the push is deliberately SKIPPED — the documented reconcile chain's next `sync`
      // (after `doc update <id> --body-file <export>`) commits the merged version and pushes
      // everything in one pass.
      const conflicts = rebaseOutcome.conflicts;
      const rows = toConflictRows(boardPath, conflicts);
      const firstReconcilable = conflicts.find((c) => c.isDoc && c.exportPath !== null);
      const conflictErr = new CliError("CONFLICT", buildConvergeMessage(conflicts), {
        details: { conflicts: cap(rows, limit) },
        ...(firstReconcilable
          ? { help: convergeHelp(inv, firstReconcilable.entry, firstReconcilable.exportPath!) }
          : {}),
      });
      // Finding 3 composition (unchanged from U3a): when THIS run committed, the safety prefix
      // ("committed to the board locally — your work is saved.") composes onto the converge
      // message, and the cache is written with honest counts. When nothing new was committed this
      // run, the converge message passes through unchanged.
      throw await throwPostCommitFailure(conflictErr, commitResult.committed, key, boardPath);
    }
  }

  // Finding 2's baseline, other half: origin/board's ref AFTER this run's own fetch (whether via
  // fetchRebase or ffPull) — still entirely origin-side, unrelated to local HEAD.
  const postFetchOriginRef = resolveOriginRef(boardPath);
  // The RECEIPT's pulled/incoming: ONLY what origin/board itself gained this run (Finding 2) — see
  // `originDocsBetween`'s header comment for why a HEAD-anchored diff can't express this.
  const originDelta = originDocsBetween(boardPath, preFetchOriginRef, postFetchOriginRef);

  // The pull step succeeded (clean rebase, or an ff-only merge that didn't throw) — compute the
  // CACHE's enriched delta (U4's "since I last read" feed — deliberately SEPARATE from the
  // receipt's originDelta above; the reviewer judged this feed acceptable to stay self-inclusive,
  // since U4 filters self-authored rows out at the human face). Prefer the STORED cursor (this
  // machine's own token, U2); an absent or foreign-tier cursor (first sync ever for this bundle on
  // this machine) falls back to `startHead` (the board's OWN pre-sync HEAD) as the diff baseline —
  // so a teammate's very first sync still reports everything that just arrived, not an empty delta.
  const cursorToken =
    storedCursor && storedCursor.tier === "git" && typeof storedCursor.token === "string"
      ? storedCursor.token
      : undefined;
  const postPullHead = currentHead(boardPath);
  const delta = changesSince(boardPath, cursorToken ?? startHead);
  let changes: DocChange[];
  let reanchorNote: string | undefined;
  if (delta.ok) {
    changes = delta.changes;
    await writeCursor(key, { tier: "git", token: postPullHead });
  } else {
    // The STORED cursor's object no longer exists (history was rewritten under it) — U2's own
    // re-anchor path: record the honest note, an empty delta (unknowable across a rewrite), and
    // advance the cursor to now. NEVER a silent skip, never fatal (U2's contract).
    changes = [];
    reanchorNote = REANCHOR_NOTE;
    await recordReanchor(
      key,
      { tier: "git", token: postPullHead },
      { unpushedCount: unpushedCount(boardPath) ?? 0, uncommittedCount: countUncommitted(boardPath) },
    );
  }

  // STEP 4: push (skipped for --pull-only). A push failure AFTER a successful commit+pull gets a
  // PARTIAL envelope (what committed/pulled is real and already persisted) LEADING with the safety
  // message, then throws `asHandled` so the bin wrapper sets the exit code without a second
  // (conflicting) error envelope.
  let pushedCount = 0;
  if (!pullOnly) {
    const ahead = unpushedCount(boardPath) ?? 0;
    try {
      push(boardPath);
      pushedCount = ahead;
    } catch (err) {
      const classified = toCliError(err, "push");
      const warning = pushFailureMessage(classified);
      const partial: Record<string, unknown> = { warning };
      partial.committed = commitResult.docs.length;
      partial.pushed = 0;
      partial.pulled = originDelta.length;
      const actor = singleActor(commitResult.docs);
      if (actor) partial.actor = actor;
      partial.incoming = cap(toIncomingRows(originDelta), limit);
      if (reanchorNote) partial.note = reanchorNote;
      stdout(render(partial, mode));
      await writeCache(key, {
        updatedAt: new Date().toISOString(),
        delta: toDeltaRows(changes),
        unpushedCount: unpushedCount(boardPath) ?? 0,
        uncommittedCount: countUncommitted(boardPath),
        ...(reanchorNote ? { note: reanchorNote } : {}),
      });
      throw asHandled(new CliError(classified.code, warning, { details: classified.details }));
    }
  }

  // STEP 5: the awareness cache — refreshed with FINAL (post-push-attempt) backstop counts, so a
  // successful push is reflected (not the stale pre-push "still ahead" count). Deliberately still
  // the cursor-based `changes` (see the comment above `cursorToken`), NOT `originDelta`.
  await writeCache(key, {
    updatedAt: new Date().toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
    ...(reanchorNote ? { note: reanchorNote } : {}),
  });

  const committedCount = commitResult.docs.length;
  const pulledCount = originDelta.length;

  // The second definitive empty state: nothing committed, nothing pulled FROM ORIGIN, nothing
  // pushed, and no re-anchor to report — a genuinely idempotent re-run.
  if (committedCount === 0 && pulledCount === 0 && pushedCount === 0 && !reanchorNote) {
    stdout(render({ sync: "already up to date" }, mode));
    return;
  }

  const receipt: Record<string, unknown> = {};
  receipt.committed = committedCount;
  receipt.pushed = pushedCount;
  receipt.pulled = pulledCount;
  const actor = singleActor(commitResult.docs);
  if (actor) receipt.actor = actor;
  receipt.incoming = cap(toIncomingRows(originDelta), limit);
  // `conflicts` is OMITTED here rather than rendered empty: a conflicted run always THROWS above
  // (the converging branch's CONFLICT(5) envelope carries the populated rows in its details), so a
  // success receipt's `conflicts` would always be {shown:0,total:0,rows:[]} — dead weight every
  // sync, against this codebase's own omit-when-empty convention (status.ts, home.ts) and AXI §7
  // (ruthlessly minimize).
  if (reanchorNote) receipt.note = reanchorNote;
  stdout(render(receipt, mode));
}

// ── `sync --show-incoming <id>` — the conflict viewer (U3b) ─────────────────────

/**
 * The staleness label every show-incoming render carries (adjudication G, a conscious deferral):
 * the output reflects `origin/board` AS OF THE LAST FETCH — the viewer never fetches implicitly.
 */
export const SHOW_INCOMING_AS_OF = "last fetch";

/** The expected-state string for a doc that is absent on origin/board (deleted upstream, or new locally). */
export const SHOW_INCOMING_ABSENT_STATE =
  "absent upstream — not on origin/board as of the last fetch (deleted upstream, or a new local doc)";

/** Attach the doc-read body semantics to a render record: truncate large bodies, point at the byte hatch. */
function attachBodyPreview(rec: Record<string, unknown>, body: string, byteHatch: string): void {
  if (body.length > BODY_PREVIEW_LIMIT) {
    rec.body = body.slice(0, BODY_PREVIEW_LIMIT);
    rec.body_truncated = true;
    rec.body_chars = body.length;
    rec.help = [byteHatch];
  } else {
    rec.body = body;
  }
}

/**
 * Print the UPSTREAM version of one board doc — `git show origin/board:<path>` — with FULL
 * doc-read semantics (gate-1): the default render truncates a large body and points at the byte
 * hatch; `--out <file>` writes the raw bytes to disk; `--out -` streams the raw bytes to stdout
 * with the receipt (or ANY error envelope) on STDERR, keeping the byte stream pure. A doc absent
 * upstream renders as an EXPECTED STATE (exit 0), never a fatal — it may be deleted upstream or
 * simply new locally; either way there is nothing incoming to show. Every render is labeled
 * "as of last fetch" (no implicit fetch — adjudication G).
 */
async function showIncoming(
  id: string,
  values: { out?: string; dir?: string; json?: boolean },
  deps: Partial<SyncCliDeps>,
): Promise<void> {
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));
  const stderr = deps.stderr ?? ((s: string) => void process.stderr.write(s));
  const writeStdoutBytes = deps.writeStdoutBytes ?? ((d: Uint8Array) => void process.stdout.write(d));
  const inv = cliInvocation();
  const mode = resolveMode(values);
  const out = values.out?.trim();
  const streamMode = out === "-";

  const run = async (): Promise<void> => {
    // Same location resolution as sync itself (board-interior invocations retarget to the
    // enclosing project); refs/remotes are SHARED across a repo's worktrees, so any directory
    // inside the repo can read the last-fetched origin/board state — no provisioning required.
    const dir = retargetBoardInterior(values.dir ?? process.cwd());
    const top = repoTopLevel(dir);
    if (!top) {
      throw new CliError(
        "RUNTIME",
        "not inside a git repository — there is no fetched board state to show",
        { details: { state: "no-repo" } },
      );
    }

    // id → repo-relative path. A raw/reserved entry (log.md, index.md, …) is used VERBATIM (the
    // same vocabulary the conflict rows report); a concept id maps through core's ONE path
    // vocabulary, with the same id-safety guard core applies (this read bypasses the engine).
    let relPath: string;
    if (isRawPathEntry(id)) {
      if (path.isAbsolute(id) || id.split("/").some((seg) => seg === "..")) {
        throw new CliError("USAGE", `--show-incoming needs a repo-relative path without '..' segments: ${id}`);
      }
      relPath = id;
    } else {
      try {
        assertSafeConceptId(id);
      } catch (err) {
        throw new CliError("USAGE", err instanceof Error ? err.message : String(err));
      }
      relPath = pathFromConceptId(id);
    }

    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      throw ffSwallowToError("no-upstream", inv);
    }

    const shown = runGit(top, ["show", `refs/remotes/${BOARD_REF}:${relPath}`]);
    if (shown.status !== 0) {
      const text = `${shown.stderr}\n${shown.stdout}`;
      if (/does not exist in|exists on disk, but not in/i.test(text)) {
        const state = {
          sync: "show-incoming",
          id,
          as_of: SHOW_INCOMING_AS_OF,
          state: SHOW_INCOMING_ABSENT_STATE,
        };
        // Stream mode keeps stdout a pure byte channel — the state record rides the receipt
        // channel (stderr), same as the receipt would have.
        (streamMode ? stderr : stdout)(render(state, mode));
        return;
      }
      throw classifyGitError({ args: ["show"], status: shown.status, stdout: shown.stdout, stderr: shown.stderr });
    }
    const content = shown.stdout;

    // Byte channel (`--out`): the raw committed bytes, receipt on the appropriate channel.
    if (out) {
      const bytes = Buffer.from(content, "utf8");
      const receipt: Record<string, unknown> = {
        sync: "show-incoming",
        id,
        as_of: SHOW_INCOMING_AS_OF,
        out,
        size_bytes: bytes.byteLength,
      };
      if (streamMode) {
        writeStdoutBytes(bytes);
        stderr(render(receipt, mode));
        return;
      }
      await fs.writeFile(out, bytes);
      stdout(render(receipt, mode));
      return;
    }

    // Default render: the parsed detail view with doc-read body semantics. A raw/reserved path
    // (log.md carries no frontmatter) — or a doc whose upstream frontmatter is malformed — renders
    // the raw content as the body instead of failing: the viewer's job is to SHOW the incoming
    // version, whatever its shape.
    const byteHatch = `${inv} sync --show-incoming ${id} --out <file>`;
    const rec: Record<string, unknown> = {};
    if (isRawPathEntry(id)) {
      rec.path = id;
      rec.as_of = SHOW_INCOMING_AS_OF;
      attachBodyPreview(rec, content, byteHatch);
    } else {
      let parsed: { frontmatter: Record<string, unknown>; body: string } | null = null;
      try {
        const { frontmatter, body } = parseMarkdown(content, relPath);
        parsed = { frontmatter: frontmatter as Record<string, unknown>, body };
      } catch {
        parsed = null;
      }
      rec.id = id;
      if (parsed) {
        const KNOWN_ORDER = ["type", "title", "description", "resource", "tags", "timestamp"];
        const RESERVED_OUTPUT = new Set(["id", "as_of", "body", "body_truncated", "body_chars", "help"]);
        for (const key of KNOWN_ORDER) {
          if (parsed.frontmatter[key] !== undefined && parsed.frontmatter[key] !== null) rec[key] = parsed.frontmatter[key];
        }
        for (const key of Object.keys(parsed.frontmatter)) {
          if (KNOWN_ORDER.includes(key) || RESERVED_OUTPUT.has(key)) continue;
          if (parsed.frontmatter[key] === undefined || parsed.frontmatter[key] === null) continue;
          rec[key] = parsed.frontmatter[key];
        }
      }
      rec.as_of = SHOW_INCOMING_AS_OF;
      attachBodyPreview(rec, parsed ? parsed.body : content, byteHatch);
    }
    stdout(render(rec, mode));
  };

  if (!streamMode) {
    await run();
    return;
  }
  // `--out -`: route any error envelope to STDERR (stdout is reserved for raw bytes), then rethrow
  // as `handled` so the bin wrapper sets the exit code WITHOUT re-emitting the envelope to stdout —
  // the same dance `doc read --out -` pins (gate-1).
  try {
    await run();
  } catch (err) {
    const { envelope } = toExit(err);
    stderr(renderErrorEnvelope(envelope));
    throw asHandled(err);
  }
}
