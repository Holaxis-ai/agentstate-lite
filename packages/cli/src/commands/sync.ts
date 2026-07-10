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
import { existsSync, readFileSync, realpathSync, statSync } from "node:fs";
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
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  GITIGNORE_ENTRY,
  abortStaleRebase,
  changesSince,
  detectStaleRebase,
  ensureBoardGitignoreWorkingTree,
  fetchRebaseResolving,
  ffPull,
  provisionBoardWorktree,
  push,
  pushBoardUpstream,
  repoTopLevel,
  runGit,
  runGitBytes,
  stageAndCommit,
  unpushedCount,
  type CommitResult,
  type DocChange,
  type FetchRebaseResolvingOutcome,
  type ProvisionOutcome,
  type ResolvedConflict,
} from "../git.js";
import {
  REANCHOR_NOTE,
  bundleKey,
  readCursor,
  readHookHintedAt,
  recordHookHinted,
  recordReanchor,
  recordSelfActors,
  refreshMarker,
  syncExportsDir,
  writeCache,
  writeCursor,
  type AwarenessDeltaRow,
} from "../cursor.js";
import { hookInstalled } from "./hook.js";
import { migrateBoard } from "./sync-migrate.js";
import { ESTABLISH_ALREADY, establishBoard } from "./sync-establish.js";
import { CliError, asHandled, classifyGitError, toExit } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, renderErrorEnvelope, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { BODY_PREVIEW_LIMIT } from "./doc/common.js";

export const SYNC_USAGE = `agentstate-lite sync — share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --establish [--dir <path>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]
  agentstate-lite sync --migrate [--yes] [--dir <path>] [--json]

Shares this repo's board (\`.agentstate-lite\`, kept on its own \`board\` branch) with your
teammates: commits any pending local doc changes, pulls theirs, and pushes yours — touching
nothing outside the board. \`--pull-only\` skips commit + push and only fast-forwards from origin
(never rebases) — the mode a read-only session uses to pick up incoming changes without
publishing local ones.

\`init\` creates a LOCAL bundle; sharing it is a separate, explicit act. \`sync --establish\` turns
this project's local \`.agentstate-lite/\` into the shared board: it creates the \`board\` branch,
moves the bundle onto it, and pushes — never automatic, never inferred from a bare \`sync\` (which
never publishes a bundle nobody has chosen to share). Once established (here or by a teammate),
plain \`sync\` is everyone's setup AND ongoing verb: on a project that already shares a board, a
bare \`sync\` provisions the local checkout and publishes/pulls exactly as it always has.
\`--establish\` on an already-established project is a safe no-op that notes \`already established\`
and proceeds as an ordinary sync.

On a repo that has never had the board checkout materialized locally (a fresh clone, or the first
\`aslite\` invocation after one), sync provisions \`.agentstate-lite\` itself from \`origin/board\` —
never silently: the receipt carries a \`provisioned: <path>\` line. If the checkout already exists
but its pointers went stale (e.g. it was moved or remounted at a different path), sync self-heals
it via \`git worktree repair\` and reports \`repaired: <path>\` the same way — a repair is a git
mutation too, and both lines appear even on an otherwise-empty run.

Two definitive empty states (exit 0): no git repo (or no board anywhere yet, local or on origin)
prints 'sync: nothing to sync'; a clean, already-current board prints 'sync: already up to date'.
Otherwise the receipt reports { committed, pushed, pulled, actor, incoming } — \`incoming\` is the
enriched delta of docs that arrived this run (capped; --limit controls the row cap, default 20).

When a doc changed on BOTH sides, sync CONVERGES: your teammate's version is kept on the board,
YOUR version is saved to an export file named in the receipt, and the sync completes (the
board is never left mid-state; non-conflicted local changes still land). The run exits 5 with
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

Board-READING commands (\`list\`, \`doc read\`, \`status\`, \`home\`, \`link show\`) also keep a
provisioned board fresh opportunistically: when the board's awareness state is older than ~5
minutes, the read first runs the same fast-forward-only pull \`--pull-only\` uses (time-boxed to
~2s; never a rebase, never provisioning, silent on any failure) and then serves fresh state — so
the board checkout's HEAD can advance after a plain \`list\`. Reads never auto-push; sharing YOUR
changes is always this verb. Set AGENTSTATE_LITE_NO_AUTOPULL to any non-empty value to disable
the auto-pull (note: "0" disables it too — the variable's PRESENCE is the switch) for CI or
scripted runs that must never touch the network.

\`sync --migrate\` is the ONE-TIME move for a project whose board is a folder committed on the
default branch: it creates a \`board\` branch carrying the folder's CURRENT files (files only —
the folder's history stays where it is), pushes it to origin with tracking, and prepares ONE
local commit on a new \`board-migration\` branch that removes the folder from the current branch
and gitignores it — you push that branch and open the PR yourself; nothing on the current branch
is pushed or changed. Until that PR merges the old committed folder is a frozen snapshot: sync no
longer updates it, so treat it as read-only. Without \`--yes\`, \`--migrate\` prints a preview (a
dry run, including the rollout note to send teammates) and changes nothing. It refuses while
\`.agentstate-lite/\` has uncommitted changes, when the current branch is behind origin on
commits touching the folder (pull first — a teammate's board commit must never be stranded on
the frozen copy), when origin is unreachable (the freshness check and the push both need it),
and when any \`board/...\` branch exists locally or on the remote (git cannot create a \`board\`
branch alongside them). It reports 'already migrated' (exit 0) once a board branch exists on
origin — with state-aware guidance, including re-creating the folder-removal commit when an
interrupted run left it missing. Coordinate first: every founder syncs (at minimum commits)
their board work before anyone migrates.

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --migrate            One-time: move a committed .agentstate-lite/ folder onto its own board branch
  --yes                Execute --migrate (without it, --migrate prints a preview and changes nothing)
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
  /** The installed-hook probe behind the one-time onboarding hint (default hook.ts's {@link hookInstalled}). */
  hookInstalled: () => boolean;
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
 * report). D6 (greenfield establish): the old wording pointed at "the (human-gated) migration",
 * which is false once establish exists — rewritten to the two-verb model. This case now fires only
 * when `origin` itself isn't configured to point at a shared project's remote at all (the more
 * common "board exists locally, absent on origin" state is intercepted earlier as a PUBLISH, not an
 * error — see `fetchRebaseResolving`'s `no_upstream` outcome).
 */
export function upstreamHelp(inv: string): string {
  return (
    `if a teammate already shares this project's board, make sure your \`origin\` remote points at ` +
    `the SAME repository they pushed the \`board\` branch to; if nobody has started sharing this ` +
    `project's board yet, run \`${inv} sync --establish\` to start`
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
 * Label a conflicted entry by its EXPLICIT doc-vs-raw discriminator (round-2 REQUIRED 2):
 * "doc <id>" for a concept doc, the reserved/raw repo-relative path VERBATIM otherwise. The
 * discriminator travels ON the conflict data ({@link ResolvedConflict}.isDoc, set by
 * `fetchRebaseResolving` from the path shape at resolution time) — it is never re-derived from
 * the entry STRING, because a dotted doc id (`notes/v1.2`, legal in core) is indistinguishable
 * from a raw path by string shape alone (the retired `isRawPathEntry` heuristic's documented
 * residual, now structural).
 */
export function entryLabel(c: Pick<ResolvedConflict, "entry" | "isDoc">): string {
  return c.isDoc ? `doc ${c.entry}` : c.entry;
}

/**
 * A {@link ResolvedConflict} annotated with whether the kept-upstream version actually LANDED at
 * HEAD (false = the teammate's side DELETED the file, so keep-upstream meant removing it). The
 * one `cat-file -e HEAD:<path>` probe per conflict happens in {@link annotateLanded}; the message
 * builder, the row projector, and the help-chain pick (review fix 2) all read the SAME answer —
 * the help chain must never name a doc whose file is gone (`doc update` on it fails NOT_FOUND).
 */
export type LandedConflict = ResolvedConflict & { landed: boolean };

/** Annotate each resolved conflict with the post-rebase HEAD existence probe (ONE probe per doc). */
export function annotateLanded(boardPath: string, conflicts: ResolvedConflict[]): LandedConflict[] {
  return conflicts.map((c) => ({
    ...c,
    landed: runGit(boardPath, ["cat-file", "-e", `HEAD:${c.relPath}`]).status === 0,
  }));
}

/**
 * The converging mechanic's per-doc string (adjudication D, test-pinned): "teammate's version
 * kept; yours saved at <path> — reconcile with doc update", prefixed by the entry's label
 * ("doc <id>" for a concept doc; a reserved/raw path VERBATIM). Builder judgment calls, flagged
 * in the report: (1) a reserved/raw path drops the fixing-verb suffix (there is no `doc update`/
 * `doc write` verb for log.md — the kept-upstream/export mechanic still applied identically);
 * (2) a local-side DELETION (no stage-3 blob → nothing to export) says so honestly instead of
 * naming a file that doesn't exist; (3) review fix 2: a doc DELETED UPSTREAM says "teammate's
 * deletion kept" and points at `doc write` (re-create) — `doc update` on a doc whose file is
 * gone fails NOT_FOUND. The DROPPED phrase "nothing was overwritten" stays dropped (pack (c)).
 */
export function convergeDocLine(
  c: Pick<LandedConflict, "entry" | "isDoc" | "exportPath" | "bodyExportPath" | "landed">,
): string {
  const label = entryLabel(c);
  if (c.exportPath === null) {
    return `${label} — teammate's version kept (your side deleted it; nothing to save)`;
  }
  // ROUND-3 LOW 1: the fixing-verb suffix is keyed on the BODY export's existence, not on
  // isDoc alone — a doc with no .body.md (unparseable or non-utf8-round-trippable local blob)
  // must not tell the user to `doc update` with the only file that exists (the FULL export),
  // which would nest YAML frontmatter into the body. Mirrors the deletion case: no runnable
  // artifact, no verb.
  if (!c.landed) {
    const recreate = c.isDoc && c.bodyExportPath !== null ? " — re-create with doc write" : "";
    return `${label} — teammate's deletion kept; yours saved at ${c.exportPath}${recreate}`;
  }
  const reconcile = c.isDoc && c.bodyExportPath !== null ? " — reconcile with doc update" : "";
  return `${label} — teammate's version kept; yours saved at ${c.exportPath}${reconcile}`;
}

/** The CONFLICT(5) envelope message: one converge line per conflicted entry, "; "-joined. */
export function buildConvergeMessage(
  conflicts: Array<Pick<LandedConflict, "entry" | "isDoc" | "exportPath" | "bodyExportPath" | "landed">>,
): string {
  return conflicts.map(convergeDocLine).join("; ");
}

/**
 * The reconcile HELP CHAIN (amended pack (c)): view the kept incoming version, write your merged
 * version on top as a NEW doc update, then sync again — converges in one pass, loses nothing.
 * Only ever built for a conflict whose kept version LANDED (review fix 2 — see {@link pickHelp}),
 * and ALWAYS over the BODY-ONLY export (round-2 REQUIRED 3): `doc update --body-file` treats its
 * input as a body, so the full-fidelity export (frontmatter included) would nest YAML into the
 * body if fed to it — the chain must be literally executable without corrupting frontmatter.
 */
export function convergeHelp(inv: string, id: string, bodyExportPath: string): string {
  return (
    `${inv} sync --show-incoming ${id} → ${inv} doc update ${id} --body-file ${bodyExportPath} → ${inv} sync`
  );
}

/** The re-create chain for a doc DELETED upstream: `doc write` (a fresh doc), then sync. */
export function recreateHelp(inv: string, id: string, bodyExportPath: string): string {
  return `${inv} doc write ${id} --type <Type> --body-file ${bodyExportPath} → ${inv} sync`;
}

/**
 * REVIEW FIX 2 + round-2 REQUIRED 3: pick the help chain from the ANNOTATED conflicts — prefer a
 * doc whose kept version LANDED (the `doc update` reconcile chain is directly runnable for it);
 * when every conflicted doc was deleted upstream, fall back to the `doc write` re-create chain.
 * Both chains require the BODY-ONLY export (the literally-executable `--body-file` input); a doc
 * with no body export (unparseable local blob) is skipped. No usable doc at all → no help (the
 * message lines carry the per-doc disposition).
 */
export function pickHelp(inv: string, conflicts: LandedConflict[]): string | undefined {
  const reconcilable = conflicts.find((c) => c.isDoc && c.bodyExportPath !== null && c.landed);
  if (reconcilable) return convergeHelp(inv, reconcilable.entry, reconcilable.bodyExportPath!);
  const recreatable = conflicts.find((c) => c.isDoc && c.bodyExportPath !== null);
  if (recreatable) return recreateHelp(inv, recreatable.entry, recreatable.bodyExportPath!);
  return undefined;
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
 * Round-2 REQUIRED 3, constraint (b) — no silent local-data loss: the reconcile chain writes a
 * merged BODY, so a LOCAL frontmatter change (a status flip, a retitle) that differed from the
 * kept upstream version would otherwise vanish without a trace. Surface it: the top-level
 * frontmatter keys whose values differ between the exported local version and the kept (HEAD)
 * version, `timestamp` excluded (the engine refreshes it on every write — it ALWAYS differs,
 * pure noise). Empty on any parse/read failure and for deleted-upstream docs (where the whole
 * doc's disposition is already the story).
 */
function frontmatterDiffKeys(boardPath: string, c: LandedConflict): string[] {
  if (!c.isDoc || c.exportPath === null || !c.landed) return [];
  try {
    const local = parseMarkdown(readFileSync(c.exportPath, "utf8"), c.relPath).frontmatter as Record<string, unknown>;
    const shown = runGit(boardPath, ["show", `HEAD:${c.relPath}`]);
    if (shown.status !== 0) return [];
    const kept = parseMarkdown(shown.stdout, c.relPath).frontmatter as Record<string, unknown>;
    const keys = new Set([...Object.keys(local), ...Object.keys(kept)]);
    keys.delete("timestamp");
    return [...keys].filter((k) => JSON.stringify(local[k]) !== JSON.stringify(kept[k])).sort();
  } catch {
    return [];
  }
}

/**
 * Project the resolved conflicts into the envelope's row shape (amended pack (c)):
 * `{id|path, kind, title, yours, theirs}` — `yours` is the full-fidelity export's absolute path
 * (your version, recoverable byte-for-byte), `yours_body` (when present) is the BODY-ONLY export
 * the reconcile chain's `doc update --body-file` consumes literally, `theirs` names the
 * disposition of the teammate's version ("kept" — it is what's on the board now; "kept (deleted
 * upstream)" when keeping it meant removing the file), and `frontmatter_differs` (when present)
 * lists the local frontmatter fields the body-merge chain would NOT carry over — re-apply those
 * via `doc update` flags (no silent loss, round-2 REQUIRED 3).
 */
export function toConflictRows(boardPath: string, conflicts: LandedConflict[]): Record<string, unknown>[] {
  return conflicts.map((c) => {
    const row: Record<string, unknown> = c.isDoc ? { id: c.entry } : { path: c.entry };
    if (c.isDoc) Object.assign(row, keptDocMeta(boardPath, c.relPath));
    row.yours = c.exportPath !== null ? c.exportPath : "deleted locally — nothing to save";
    if (c.bodyExportPath !== null) row.yours_body = c.bodyExportPath;
    const diff = frontmatterDiffKeys(boardPath, c);
    if (diff.length > 0) row.frontmatter_differs = diff;
    row.theirs = c.landed ? "kept" : "kept (deleted upstream)";
    return row;
  });
}

/**
 * decisions/board-branch-sync rider 2 (binding): provisioning is a git mutation and must be
 * ANNOUNCEABLE — "says so in structured output — never a silent git mutation." Only `provisioned`
 * (a fresh materialize) and `repaired` (the stale-pointer self-heal) MUTATED anything this run;
 * `already`/`no_repo`/`no_board` did nothing to announce, so this returns `undefined` for them —
 * the omit-when-absent convention every envelope in this module already follows. Message pack
 * shape (test-pinned): one field, named for the outcome, `<path> — <what happened>`.
 */
export function provisionAnnouncement(outcome: ProvisionOutcome): Record<string, string> | undefined {
  if (outcome.kind === "provisioned") {
    // review SHOULD-FIX: `source` distinguishes the classic clone/join case (genuinely
    // "materialized from origin/board") from the `hasLocal` arm — an ALREADY-EXISTING local
    // `board` branch (greenfield combo 2's hand-built/crash-recovered boards, and establish's own
    // empty-root branch) that never touched origin/board at all — so this never claims a remote
    // origin for content that came from a purely local branch.
    const detail =
      outcome.source === "remote" ? "materialized from origin/board" : "materialized from the local board branch";
    return { provisioned: `${outcome.boardPath} — ${detail}` };
  }
  if (outcome.kind === "repaired") {
    return { repaired: `${outcome.boardPath} — worktree pointers repaired` };
  }
  return undefined;
}

/**
 * Merge {@link provisionAnnouncement} into a CliError's `details`, for the (rarer) case where
 * provisioning mutated git state and THEN the same run hit a later failure (a conflict, a
 * fetch/rebase error) — rider 2 applies to every envelope this run can produce, not only the
 * success receipt. `err` passes through UNCHANGED when there is nothing to announce, so a run
 * with no provisioning event keeps its exact prior shape (no test-pinned string gains an
 * unexpected key).
 */
function withProvisionAnnouncement(err: CliError, outcome: ProvisionOutcome): CliError {
  const announcement = provisionAnnouncement(outcome);
  if (!announcement) return err;
  return new CliError(err.code, err.message, { details: { ...err.details, ...announcement }, help: err.help });
}

/**
 * The onboarding last-mile hint (tasks/sync-opportunistic-pull): when NO managed SessionStart hook
 * is installed anywhere (project or global scope), a successful sync's receipt hints `hook install`
 * ONCE per clone. Once-ness mechanism: recorded on the per-clone sync state (cursor.ts's
 * `hookHintedAt` — the same keyed store the cursor/cache ride), so the hint is honest (it names the
 * ONE manual step left in the onboarding chain) and never nagging (a clone sees it exactly once;
 * an already-installed hook suppresses it before it is ever shown, and installing later simply
 * makes the probe true). Chosen surface: sync's SUCCESS receipts — sync is the setup verb (first
 * contact provisions through it), and the receipt is read at exactly the moment onboarding
 * completes; home renders every session and would nag. Best-effort throughout: any probe/state
 * failure suppresses the hint, never the receipt.
 */
export async function hookInstallHintOnce(
  key: string,
  inv: string,
  installed: () => boolean = hookInstalled,
): Promise<string | undefined> {
  try {
    if (installed()) return undefined;
    if ((await readHookHintedAt(key)) !== null) return undefined;
    await recordHookHinted(key);
    return (
      `no SessionStart hook is installed — run \`${inv} hook install\` once and every new agent ` +
      `session will start with the board pulled and rendered`
    );
  } catch {
    return undefined;
  }
}

/**
 * Map an `FfPullResult.swallowed` reason (U1's fail-soft vocabulary) to the capped CliError
 * taxonomy. `boardPath`, when given, disambiguates "no-upstream" (D6): a LOCAL `board` branch that
 * simply hasn't been published yet (greenfield combo 2 under `--pull-only`, which never publishes)
 * gets the specific "board not published yet" message; its absence falls back to the generic
 * no-shared-project-yet wording ({@link upstreamHelp}).
 */
export function ffSwallowToError(reason: string, inv: string, boardPath?: string): CliError {
  switch (reason) {
    case "git-missing":
      return new CliError("GIT_MISSING", "sync needs git, which isn't installed on this machine", {
        help: "install git (https://git-scm.com/downloads), then re-run the command",
      });
    case "no-upstream": {
      const hasLocalBoard =
        boardPath !== undefined &&
        runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      if (hasLocalBoard) {
        return new CliError(
          "NO_UPSTREAM",
          "board not published yet — run sync to publish (--pull-only never publishes)",
          { help: `${inv} sync` },
        );
      }
      return new CliError(
        "NO_UPSTREAM",
        "the board branch isn't linked to a remote yet — sync can't share it",
        { help: upstreamHelp(inv) },
      );
    }
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
        `the board checkout has unresolved conflicts — run \`${inv} sync\` (without --pull-only) to reconcile`,
      );
    case "dirty":
      return new CliError(
        "RUNTIME",
        "the board checkout has uncommitted local changes that a fast-forward-only pull would " +
          "overwrite — commit or discard them, or run a full sync instead of --pull-only",
      );
    case "detached-head":
      return new CliError(
        "RUNTIME",
        "the board checkout is in a detached-HEAD state — sync needs the board branch checked out",
        { details: { state: "detached-head" } },
      );
    case "not-a-repo":
      return new CliError(
        "RUNTIME",
        "the board checkout is not a git repository — run sync again to re-provision it",
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

/** True for git's linked-worktree/submodule marker shape: a `.git` FILE, not a directory. */
function hasGitFileSignature(p: string): boolean {
  try {
    return statSync(path.join(p, ".git")).isFile();
  } catch {
    return false;
  }
}

/**
 * Path-only fallback for the mount-move case: stale worktree pointers make `repoTopLevel(dir)`
 * fail from inside `.agentstate-lite`, but the enclosing path still names the conventional board
 * checkout. Retarget to its parent so `provisionBoardWorktree` can run the repair path. The `.git`
 * FILE gate keeps this away from plain pre-migration bundle directories; independent nested repos
 * with a `.git` directory still fall through to the normal no-board/no-repo classification.
 */
function retargetStaleBoardInteriorByPath(dir: string): string | null {
  let cur = path.resolve(dir);
  for (;;) {
    if (path.basename(cur) === BUNDLE_DIR && hasGitFileSignature(cur)) {
      return path.dirname(cur);
    }
    const parent = path.dirname(cur);
    if (parent === cur) return null;
    cur = parent;
  }
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
export function retargetBoardInterior(dir: string): string {
  try {
    const top = repoTopLevel(dir);
    if (top && path.basename(top) === BUNDLE_DIR && isLinkedWorktree(top)) {
      return path.dirname(top);
    }
  } catch {
    /* fall through — the normal flow classifies whatever this is */
  }
  return retargetStaleBoardInteriorByPath(dir) ?? dir;
}

/** The board worktree's current HEAD sha, via U1's exported `runGit` (no U1 op named this directly). */
export function currentHead(boardPath: string): string {
  const r = runGit(boardPath, ["rev-parse", "HEAD"]);
  if (r.status !== 0) {
    throw classifyGitError({ args: ["rev-parse", "HEAD"], status: r.status, stdout: r.stdout, stderr: r.stderr });
  }
  return r.stdout.trim();
}

/** Count of lines in `git status --porcelain` — uncommitted (staged or not) changes in the worktree. */
export function countUncommitted(boardPath: string): number {
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
 * The per-clone cursor/cache/marker key (U2's `bundleKey`) for THIS board worktree — EXPORTED as
 * THE one derivation (cache-per-clone review advisory (a): home/session-start REUSE this; a second
 * independent derivation is the real state-split risk). NOTE for callers: this realpaths the board
 * path itself (`realOrSame`) — pass the board worktree path as resolved from the repo top, and do
 * NOT pre-normalize it differently. Keyed by the
 * `origin` remote URL (git worktrees share one remote config with their main worktree) with an
 * empty subpath (the board branch's root IS the bundle root — gate 2) PLUS the board worktree's
 * own realpath as the checkout identity — two clones of one origin on one machine must never
 * share a state file (PR#13 review, item 4: the shared file let clone A's clean sync erase clone
 * B's stranded-unpushed backstop state). Falls back to the absolute board path alone when no
 * origin URL resolves (U2's own path fallback for a remote-less repo). The realpath (via
 * `realOrSame`) keeps the key stable across symlinked spellings of one checkout (macOS
 * `/tmp` → `/private/tmp`, an aliased home) — same clone, same key, every invocation.
 */
export function resolveBundleKey(boardPath: string): string {
  const checkoutRoot = realOrSame(boardPath);
  const r = runGit(boardPath, ["remote", "get-url", BOARD_REMOTE]);
  if (r.status === 0 && r.stdout.trim().length > 0) {
    return bundleKey({ remoteUrl: r.stdout.trim(), subpath: "", checkoutRoot });
  }
  return bundleKey({ root: checkoutRoot });
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
          establish: { type: "boolean" },
          "show-incoming": { type: "string" },
          migrate: { type: "boolean" },
          yes: { type: "boolean" },
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

  // `--migrate` (U5) is the one-time, --yes-gated move of a committed board folder onto its own
  // board branch — dispatched before the everyday flow (it never commits/pulls/pushes the board).
  // TEMPORARY: founders' one-time act, scheduled for removal post-execution; kept out of every
  // taught surface (see sync-migrate.ts's header).
  if (values.migrate) {
    if (values["pull-only"]) {
      throw new CliError("USAGE", "--migrate and --pull-only cannot be combined — migration never pulls");
    }
    if (values.establish) {
      throw new CliError("USAGE", "--migrate and --establish cannot be combined — they are two different one-time moves");
    }
    if (values["show-incoming"] !== undefined) {
      throw new CliError("USAGE", "--migrate and --show-incoming cannot be combined");
    }
    if (values.out !== undefined) {
      throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
        help: `${inv} sync --show-incoming <id> --out <file>`,
      });
    }
    const migrateDir = retargetBoardInterior(values.dir ?? process.cwd());
    await migrateBoard(migrateDir, { yes: Boolean(values.yes), ...(values.json !== undefined ? { json: values.json } : {}) }, stdout);
    return;
  }
  if (values.yes) {
    throw new CliError("USAGE", "--yes only applies to sync --migrate", {
      help: `${inv} sync --migrate --yes`,
    });
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
    if (values.establish) {
      throw new CliError("USAGE", "--show-incoming and --establish cannot be combined");
    }
    await showIncoming(id, values, deps);
    return;
  }
  if (values.out !== undefined) {
    throw new CliError("USAGE", "--out only applies to sync --show-incoming <id>", {
      help: `${inv} sync --show-incoming <id> --out <file>`,
    });
  }
  if (values.establish && values["pull-only"]) {
    throw new CliError(
      "USAGE",
      "--establish and --pull-only cannot be combined — establishing always publishes",
    );
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

  // `--establish` (greenfield combo 1) dispatches BEFORE the ordinary flow's own entry self-heal/
  // provisioning: an "already established" state (any of combos 2/3/4) mutates NOTHING and falls
  // through into the SAME ordinary flow below — never a second, bespoke path for a state the
  // regular flow already handles — folding a note into whatever receipt this run ultimately
  // renders; a genuinely fresh establish prints its OWN complete receipt and returns immediately.
  let establishAlreadyNote: string | undefined;
  if (values.establish) {
    const establishOutcome = await establishBoard(dir, inv, mode, stdout, deps);
    if (!establishOutcome.already) return;
    establishAlreadyNote = ESTABLISH_ALREADY;
  }

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
    const rec: Record<string, unknown> = { sync: "nothing to sync" };
    // Greenfield combo-1 routing hint (decision 1): the pinned string above never changes; a bare
    // `sync` against an establishABLE state (a git repo, an `origin` remote, and a local bundle
    // folder already sitting there) just ADDS a hint naming `--establish` — never auto-publishes.
    if (outcome.kind === "no_board") {
      const top = repoTopLevel(dir);
      const hasOrigin = top !== null && runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
      const hasFolder = top !== null && existsSync(path.join(top, BUNDLE_DIR, "index.md"));
      if (hasOrigin && hasFolder) {
        rec.hint =
          `this project has a local bundle but no shared board yet — run \`${inv} sync --establish\` ` +
          `to start sharing it over a '${BOARD_BRANCH}' branch on origin`;
      }
    }
    stdout(render(rec, mode));
    return;
  }
  const boardPath = outcome.boardPath;
  const top = path.dirname(boardPath);

  // THE HEAL-ORDERING EDGE: `healStaleRebaseBeforeProvisioning` above ran BEFORE this worktree was
  // known to be sound — its own worktree-root guard correctly SKIPPED a worktree with stale
  // pointers (repoTopLevel(candidate) resolved to nothing, reading as "not a linked worktree yet"
  // rather than "wedged"). The repair `provisionBoardWorktree` just performed fixes those pointers,
  // so a rebase left wedged INSIDE this worktree would otherwise go unhealed for the rest of this
  // run. Re-run the SAME entry heal now that the worktree is structurally sound (best-effort,
  // matching the entry heal's own posture — see its doc comment).
  if (outcome.kind === "repaired") {
    healStaleRebaseBeforeProvisioning(dir);
  }

  const key = resolveBundleKey(boardPath);

  // BOARD-PENDING MARKER (U4 inherited item 5 — plan §U2 "refreshed by every pull step"): the
  // provisioning step above just CONFIRMED a board exists for this repo, which is exactly the
  // marker's meaning — so it is refreshed here, BEFORE the pull, covering every path out of this
  // run (clean, conflict, offline fetch failure, push failure) with one write. session-start's
  // pull step refreshes it the same way.
  await refreshMarker(key);

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
    if (commitResult.committed && commitResult.docs.length > 0) {
      // U4's "self" identity: the actors THIS clone just committed are recorded per-clone, so the
      // home render can filter self-authored rows out of the human "since" count ("unknown" is
      // dropped inside recordSelfActors — see its doc).
      await recordSelfActors(key, commitResult.docs.map((d) => d.actor));
    }
  }

  // STEP 3: pull. Full sync rebases with the CONVERGING conflict mechanic (U3b: keep upstream,
  // export local, COMPLETE the rebase — never left mid-state); --pull-only ff-only-merges (NEVER
  // rebases) via the SAME `ffPull` primitive U4's SessionStart pull uses — but THIS caller
  // translates every swallowed reason into a real structured error instead of silently no-op'ing
  // (see the module header).
  // Greenfield combo 2 (present locally / absent on origin): this run PUBLISHES rather than
  // pulls — set below when `fetchRebaseResolving` reports `no_upstream`; STEP 4 pushes WITH
  // tracking (`pushBoardUpstream`) instead of a plain push, and ensures the working-tree
  // gitignore entry (the matrix's "ensure gitignore" — idempotent, covers a hand-built or
  // establish-crash-recovered local board that never got the entry appended).
  let willPublish = false;
  if (pullOnly) {
    const ff = ffPull(boardPath);
    if (ff.swallowed) {
      throw withProvisionAnnouncement(ffSwallowToError(ff.swallowed, inv, boardPath), outcome);
    }
  } else {
    let rebaseOutcome: FetchRebaseResolvingOutcome;
    try {
      rebaseOutcome = fetchRebaseResolving(boardPath, syncExportsDir(key));
    } catch (rawErr) {
      // Finding 3: a fetch/rebase failure AFTER a real local commit this run gets the SAME
      // safety-first framing a push failure does (composed with the NO_UPSTREAM help, in order),
      // and the cache is written with honest counts before the throw.
      const enriched = withProvisionAnnouncement(withUpstreamHelp(toCliError(rawErr, "rebase"), inv), outcome);
      throw await throwPostCommitFailure(enriched, commitResult.committed, key, boardPath);
    }
    if (rebaseOutcome.status === "resolved") {
      // CONVERGING outcome (amended pack (c)): the rebase COMPLETED — the teammate's version of
      // each conflicted doc is on the board, the local version is exported, and non-conflicted
      // local changes landed on top of origin/board. The run is still a CONFLICT(5) terminal
      // state: the push is deliberately SKIPPED — the documented reconcile chain's next `sync`
      // (after `doc update <id> --body-file <export>`) commits the merged version and pushes
      // everything in one pass.
      // ONE landed probe per conflict feeds the message lines, the rows, AND the help-chain pick
      // (review fix 2: the chain must never name a doc whose kept version is a deletion).
      const conflicts = annotateLanded(boardPath, rebaseOutcome.conflicts);
      const rows = toConflictRows(boardPath, conflicts);
      const help = pickHelp(inv, conflicts);
      const conflictErr = withProvisionAnnouncement(
        new CliError("CONFLICT", buildConvergeMessage(conflicts), {
          details: { conflicts: cap(rows, limit) },
          ...(help ? { help } : {}),
        }),
        outcome,
      );
      // Finding 3 composition (unchanged from U3a): when THIS run committed, the safety prefix
      // ("committed to the board locally — your work is saved.") composes onto the converge
      // message, and the cache is written with honest counts. When nothing new was committed this
      // run, the converge message passes through unchanged.
      throw await throwPostCommitFailure(conflictErr, commitResult.committed, key, boardPath);
    }
    if (rebaseOutcome.status === "no_upstream") {
      // REVIEW MUST-FIX 1 (a real auto-publish hole): `provisionBoardWorktree`'s `hasLocal` arm
      // checks out WHATEVER local branch is literally named `board` — it carries no bundle-shape
      // check at all, because the pre-establish world never needed one (a `board` branch only ever
      // existed if IT was the bundle). Now that this "no_upstream" branch means PUBLISH, a repo
      // with an unrelated local branch happening to be named `board` (a private WIP branch, say)
      // would otherwise get silently published here — the exact "never auto-publish" class this
      // whole feature exists to prevent. Same bundle-evidence establish's OWN ladder demands
      // (sync-establish.ts's `assertPlainBundleFolder`): a root `index.md`. This ALSO closes
      // establish's crash-window B for free (a crash after the empty-root branch exists but before
      // its content is moved back in provisions an EMPTY board — no index.md either).
      if (!existsSync(path.join(boardPath, "index.md"))) {
        const noBundleErr = withProvisionAnnouncement(
          new CliError(
            "RUNTIME",
            `'${boardPath}' is checked out on the '${BOARD_BRANCH}' branch but carries no root ` +
              `index.md — this doesn't look like an OKF bundle, so sync refuses to publish it as ` +
              `one. If '${BOARD_BRANCH}' here is unrelated to agentstate-lite, rename or delete it; ` +
              `if it's a genuine bundle interrupted mid-establish, its content may be sitting in a ` +
              `sibling '${BUNDLE_DIR}.establishing-<pid>' folder — move it back in, then re-run sync`,
          ),
          outcome,
        );
        throw await throwPostCommitFailure(noBundleErr, commitResult.committed, key, boardPath);
      }
      willPublish = true;
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
  let publishedNote: string | undefined;
  let gitignoreNote: string | undefined;
  if (!pullOnly) {
    // Combo 2's own "ensure gitignore" (matrix): idempotent, runs whenever this is a first-time
    // publish — covers a hand-built local board OR one an interrupted `--establish` left without
    // ever reaching its own gitignore step (the crash self-heals here, on the next plain sync).
    if (willPublish) {
      const gi = ensureBoardGitignoreWorkingTree(top);
      gitignoreNote = gi.changed
        ? `${gi.path} — appended '${GITIGNORE_ENTRY}' (uncommitted; commit it so teammates' clones stay clean)`
        : undefined;
    }
    const ahead = unpushedCount(boardPath) ?? 0;
    try {
      if (willPublish) {
        pushBoardUpstream(boardPath);
        pushedCount = Number.parseInt(runGit(boardPath, ["rev-list", "--count", "HEAD"]).stdout.trim(), 10) || 0;
        publishedNote = `${BOARD_REMOTE}/${BOARD_BRANCH} (tracking set)`;
      } else {
        push(boardPath);
        pushedCount = ahead;
      }
    } catch (err) {
      const classified = toCliError(err, "push");
      const warning = pushFailureMessage(classified);
      const partial: Record<string, unknown> = {};
      const announcement = provisionAnnouncement(outcome);
      if (announcement) Object.assign(partial, announcement);
      partial.warning = warning;
      partial.committed = commitResult.docs.length;
      partial.pushed = 0;
      partial.pulled = originDelta.length;
      const actor = singleActor(commitResult.docs);
      if (actor) partial.actor = actor;
      if (gitignoreNote) partial.gitignore = gitignoreNote;
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
  // pushed, and no re-anchor to report — a genuinely idempotent re-run. Rider 2 still applies here:
  // a FRESH provision/repair with nothing else to report must not read as a silent no-op — the
  // announcement (when present) rides alongside the "already up to date" line, never replacing it.
  // The onboarding last-mile hint rides BOTH success surfaces (the full receipt and "already up
  // to date") — a founder's very first sync is often an empty one right after provisioning.
  const hookHint = await hookInstallHintOnce(key, inv, deps.hookInstalled);

  if (committedCount === 0 && pulledCount === 0 && pushedCount === 0 && !reanchorNote) {
    const rec: Record<string, unknown> = {};
    if (establishAlreadyNote) rec.establish = establishAlreadyNote;
    const announcement = provisionAnnouncement(outcome);
    if (announcement) Object.assign(rec, announcement);
    rec.sync = "already up to date";
    if (hookHint) rec.hint = hookHint;
    stdout(render(rec, mode));
    return;
  }

  const receipt: Record<string, unknown> = {};
  if (establishAlreadyNote) receipt.establish = establishAlreadyNote;
  const announcement = provisionAnnouncement(outcome);
  if (announcement) Object.assign(receipt, announcement);
  receipt.committed = committedCount;
  receipt.pushed = pushedCount;
  if (publishedNote) receipt.published = publishedNote;
  receipt.pulled = pulledCount;
  const actor = singleActor(commitResult.docs);
  if (actor) receipt.actor = actor;
  if (gitignoreNote) receipt.gitignore = gitignoreNote;
  receipt.incoming = cap(toIncomingRows(originDelta), limit);
  // `conflicts` is OMITTED here rather than rendered empty: a conflicted run always THROWS above
  // (the converging branch's CONFLICT(5) envelope carries the populated rows in its details), so a
  // success receipt's `conflicts` would always be {shown:0,total:0,rows:[]} — dead weight every
  // sync, against this codebase's own omit-when-empty convention (status.ts, home.ts) and AXI §7
  // (ruthlessly minimize).
  if (reanchorNote) receipt.note = reanchorNote;
  if (hookHint) receipt.hint = hookHint;
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

    // The '..'/absolute safety guard applies to EVERY interpretation of the id (this read
    // bypasses the engine, so it must enforce its own path safety).
    if (path.isAbsolute(id) || id.split("/").some((seg) => seg === "..")) {
      throw new CliError("USAGE", `--show-incoming needs a repo-relative doc id or path without '..' segments: ${id}`);
    }

    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      throw ffSwallowToError("no-upstream", inv, top);
    }

    // id → repo-relative path, PROBE-FIRST (round-2 REQUIRED 2: no string-shape heuristic —
    // a dotted concept id like `notes/v1.2` is legal, so the CONCEPT interpretation
    // (`origin/board:<id>.md`) is probed first, with the verbatim raw path (log.md, a stray
    // blob) as the fallback). Bytes, not utf8 (round-2 REQUIRED 1): the --out channels must
    // deliver the blob's exact bytes.
    interface Probe {
      relPath: string;
      isDoc: boolean;
    }
    const candidates: Probe[] = [];
    let conceptIdOk = true;
    try {
      assertSafeConceptId(id);
    } catch {
      conceptIdOk = false;
    }
    if (conceptIdOk) candidates.push({ relPath: pathFromConceptId(id), isDoc: true });
    if (candidates.every((c) => c.relPath !== id)) candidates.push({ relPath: id, isDoc: false });

    let hit: { probe: Probe; bytes: Buffer } | null = null;
    for (const probe of candidates) {
      // Each candidate's absence is detected STRUCTURALLY (`cat-file -e` on the exact ref:path —
      // the same probe fetchRebaseResolving uses), never by matching git's human error prose:
      // message strings drift across git versions even with LC_ALL=C pinned (the standing
      // porcelain lesson, CLAUDE.md "branch from current main" note; Mike's review fix 00203a1,
      // carried through this probe-first candidate walk).
      if (runGit(top, ["cat-file", "-e", `refs/remotes/${BOARD_REF}:${probe.relPath}`]).status !== 0) {
        continue; // absent under THIS interpretation — try the next candidate
      }
      const shown = runGitBytes(top, ["show", `refs/remotes/${BOARD_REF}:${probe.relPath}`]);
      if (shown.status !== 0) {
        // The path EXISTS at the ref (the structural probe just said so) — this is a genuine
        // failure, never an absence.
        throw classifyGitError({ args: ["show"], status: shown.status, stdout: "", stderr: shown.stderr });
      }
      hit = { probe, bytes: shown.stdout };
      break;
    }
    if (hit === null) {
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
    const bytes = hit.bytes;

    // Byte channel (`--out`): the blob's EXACT bytes, receipt on the appropriate channel.
    if (out) {
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

    // Default render: the parsed detail view with doc-read body semantics (a TEXT view — the
    // utf8 decode here is fine; the byte-exact channel is --out above). A raw/reserved path
    // (log.md carries no frontmatter) — or a doc whose upstream frontmatter is malformed —
    // renders the raw content as the body instead of failing: the viewer's job is to SHOW the
    // incoming version, whatever its shape.
    const content = bytes.toString("utf8");
    const byteHatch = `${inv} sync --show-incoming ${id} --out <file>`;
    const rec: Record<string, unknown> = {};
    if (!hit.probe.isDoc) {
      rec.path = id;
      rec.as_of = SHOW_INCOMING_AS_OF;
      attachBodyPreview(rec, content, byteHatch);
    } else {
      let parsed: { frontmatter: Record<string, unknown>; body: string } | null = null;
      try {
        const { frontmatter, body } = parseMarkdown(content, hit.probe.relPath);
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
