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
// COMMAND LAYER ONLY: this module composes `@agentstate-lite/board-git`'s exported vocabulary —
// porcelain ops, the diff family, the flow steps, the neutral engine helpers — plus the CLI's
// store wiring (`cursor.ts`), but never re-implements git plumbing or the state-store schema.
// This module keeps COMMAND UX: arg parsing, envelopes, help text, and the git tier's CLI
// command boundary (BoardGitError → CliError, see `sync()`).
//
// TWO CALLERS, ONE `ffPull` PRIMITIVE, DIFFERENT TOLERANCE: U1's `ffPull` is deliberately fail-soft
// (its own header: "must never throw and never block a render") for U4's SessionStart caller. THIS
// command is the OTHER caller of the SAME primitive and has the OPPOSITE posture: `--pull-only` is
// an interactive verb that must report a REAL structured outcome, so `ffSwallowToError` below
// translates every `FfPullResult.swallowed` reason into the capped CliError taxonomy instead of
// silently no-op'ing.
import { readFileSync } from "node:fs";
import { promises as fs } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { assertSafeConceptId, parseMarkdown, pathFromConceptId } from "@agentstate-lite/core";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BOARD_REMOTE,
  BUNDLE_DIR,
  annotateLanded,
  changesSince,
  classifyGitError,
  countUncommitted,
  currentHead,
  detectBoardChannel,
  fetchRebaseResolving,
  ffPull,
  folderTreeAtHead,
  hasLocalOnlyBundle,
  healStaleRebaseBeforeProvisioning,
  inTreeFetchAndRecord,
  inTreeUpstreamSha,
  isBoardGitError,
  originDocsBetween,
  provisionAnnouncement,
  provisionBoardWorktree,
  push,
  readDocBytesAtRef,
  repoTopLevel,
  resolveBundleKey,
  resolveInTreeUpstream,
  resolveOriginRef,
  retargetBoardInterior,
  runGit,
  singleActor,
  stageAndCommit,
  toDeltaRows,
  unpushedCount,
  type CommitResult,
  type DocChange,
  type FetchRebaseResolvingOutcome,
  type LandedConflict,
  type ProvisionOutcome,
  type ResolvedConflict,
} from "@agentstate-lite/board-git";
import { REANCHOR_NOTE, defaultSyncStore } from "../cursor.js";
import { hookInstallHintOnce, type SyncCliDeps } from "../sync-cli.js";
import { ESTABLISH_ALREADY, establishBoard } from "./sync-establish.js";
import {
  ffSwallowToError,
  syncOutcomeError,
  syncOutcomeLine,
  upstreamHelp,
  type InTreeNoBasisReason,
} from "../sync-outcomes.js";
import { CliError, asHandled, cliErrorFromBoardGit, toExit } from "../errors.js";
import { parseOrUsage } from "../args.js";
import { render, renderErrorEnvelope, resolveMode } from "../output.js";
import { cliInvocation } from "../invocation.js";
import { BODY_PREVIEW_LIMIT } from "./doc/common.js";

export const SYNC_USAGE = `agentstate-lite sync — share the board branch with a remote (git tier)

Usage:
  agentstate-lite sync [--pull-only] [--dir <path>] [--limit <n>] [--json]
  agentstate-lite sync --establish [--yes] [--dir <path>] [--json]
  agentstate-lite sync --show-incoming <id> [--out <file>] [--dir <path>] [--json]

Shares this repo's board (\`.agentstate-lite\`, kept on its own \`board\` branch) with your
teammates: ordinary sync commits pending local doc changes, pulls theirs, and pushes yours without
touching code files. The one-time \`--establish\` transition also appends the board path to the
root working-tree \`.gitignore\` and reports that edit. \`--pull-only\` skips commit + push and
only fast-forwards from origin
(never rebases) — the mode a read-only session uses to pick up incoming changes without
publishing local ones.

\`init\` creates a LOCAL bundle; sharing it is a separate, explicit act. \`sync --establish\` turns
this project's local \`.agentstate-lite/\` into the shared board: it snapshots and publishes the
bundle, then checks out the new \`board\` branch at the same path — never automatic, never inferred
from a bare \`sync\` (which never publishes a bundle nobody has chosen to share). Once established
(here or by a teammate), plain \`sync\` is everyone's setup AND ongoing verb: on a project that
already shares a board, it provisions the local checkout, then commits, pulls, and pushes ordinary
board changes.
\`--establish\` on an already-established project is a safe no-op that notes \`already established\`
and proceeds as an ordinary sync.

On a repo that has never had the board checkout materialized locally (a fresh clone, or the first
\`aslite\` invocation after one), sync provisions \`.agentstate-lite\` itself from \`origin/board\` —
never silently: the receipt carries a \`provisioned: <path>\` line. If the checkout already exists
but its pointers went stale (e.g. it was moved or remounted at a different path), sync self-heals
it via \`git worktree repair\` and reports \`repaired: <path>\` the same way — a repair is a git
mutation too, and both lines appear even on an otherwise-empty run.

Three definitive empty states (exit 0): no git repo — or a repo with neither a board branch nor
a bundle — prints 'sync: nothing to sync'; a repo whose bundle is known to have no board branch
anywhere is a LOCAL-ONLY board; a clean shared board prints 'sync: already up to date'. If origin
cannot be checked and no board ref is available, sync reports the shared-board state as unknown
and recommends retrying when origin is reachable.
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

A board can also ride IN-TREE: \`.agentstate-lite/\` committed WITH the code on the current
branch, with no dedicated \`board\` branch anywhere. That is a supported, read-side mode — sync
recognizes it and behaves accordingly: \`sync --pull-only\` fetches the branch's own tracking
upstream and reports incoming board doc changes (your normal \`git pull\` delivers them);
\`session-start\`/\`home\` show the same upstream awareness; \`--show-incoming <id>\` reads the
upstream version. Sharing YOUR board changes rides your normal commit/push — a full \`sync\`
refuses (it would have to publish the code branch itself) and \`sync --establish\` remains the
explicit conversion to a dedicated \`board\` branch. If the branch has no upstream (or a detached
HEAD), in-tree awareness honestly reports that there is no comparison basis rather than guessing.

Board-READING commands (\`list\`, \`doc read\`, \`status\`, \`home\`, \`link show\`) also keep a
provisioned board fresh opportunistically: when the board's awareness state is older than ~5
minutes, the read first runs the same fast-forward-only pull \`--pull-only\` uses (time-boxed to
~2s; never a rebase, never provisioning, silent on any failure) and then serves fresh state — so
the board checkout's HEAD can advance after a plain \`list\`. Reads never auto-push; sharing YOUR
changes is always this verb. Set AGENTSTATE_LITE_NO_AUTOPULL to any non-empty value to disable
the auto-pull (note: "0" disables it too — the variable's PRESENCE is the switch) for CI or
scripted runs that must never touch the network.

\`--establish\` also handles the project whose \`.agentstate-lite/\` folder is ALREADY COMMITTED
on the current branch: it creates the \`board\` branch carrying the folder's CURRENT files (files
only — the folder's history stays where it is), pushes it to origin with tracking, and prepares
ONE local commit on a new \`board-cleanup\` branch that removes the folder from the current branch
and gitignores it — you push that branch and open the PR yourself; nothing on the current branch
is pushed or changed. Until that PR merges the old committed folder is a frozen snapshot: sync no
longer updates it, so treat it as read-only. Without \`--yes\`, the committed case prints a
preview (a dry run, including the rollout note to send teammates) and changes nothing. It refuses
while \`.agentstate-lite/\` has uncommitted changes, when the current branch is behind origin on
commits touching the folder (pull first — a teammate's board commit must never be stranded on
the frozen copy), when origin is unreachable (the freshness check and the push both need it),
and when any \`board/...\` branch exists locally or on the remote (git cannot create a \`board\`
branch alongside them). It reports 'already established' (exit 0) once a board branch exists on
origin — with state-aware guidance, including re-creating the folder-removal commit when an
interrupted run left it missing. Coordinate first: every board writer syncs (at minimum commits)
their board work before anyone establishes.

Two edge states are ACCEPTED rather than auto-resolved. (1) On a case-insensitive filesystem, a
committed folder whose name differs from \`.agentstate-lite\` only by case (a state this CLI never
creates) can misroute establishment — rename it to the exact lowercase spelling first. (2) Deleting
the remote \`board\` branch in the middle of the both-worlds window (a deliberate, destructive,
out-of-band act) leaves the prepared cleanup PR pointing at a board that no longer exists — do not
merge that PR; re-run \`sync --establish\` to publish the board again first.

Options:
  --pull-only          Only fast-forward from origin (never rebase); skip commit + push
  --establish          Explicitly publish this project's bundle as its shared board (a folder
                       already committed on the branch is handled too — preview first)
  --yes                Execute the committed-folder establishment (without it, that case prints
                       a preview and changes nothing; the uncommitted case never needs it)
  --show-incoming <id> Print the upstream (origin/board) version of one doc, as of the last fetch
  --out <file>         With --show-incoming: write the raw bytes to <file> ('-' = raw to stdout)
  --dir <path>         Directory to run sync from (default: the cwd) — must be inside a git repo
  --limit <n>          Cap the incoming-delta row list to <n> rows (default: 20; 0 = unlimited)
  --json               Emit compact JSON instead of TOON
  -h, --help           Show this help
`;

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

// The refusal/guidance envelope templates this command renders live in THE sync-outcome table
// (../sync-outcomes.ts); these re-exports keep the module's historical import surface stable.
export { ffSwallowToError, inTreeNoBasisNote, syncInTreeRefusalMessage, upstreamHelp } from "../sync-outcomes.js";

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
 * Classify a raw catch-block value into a CliError — a bare `git.ts` throw is always ALREADY a
 * typed `BoardGitError` (mapped through THE one boundary, `cliErrorFromBoardGit`), but a
 * defensive fallback keeps this module's error handling total.
 */
function toCliError(err: unknown, op: string): CliError {
  if (err instanceof CliError) return err;
  if (isBoardGitError(err)) return cliErrorFromBoardGit(err);
  return cliErrorFromBoardGit(
    classifyGitError({ args: [op], status: null, stdout: "", stderr: err instanceof Error ? err.message : String(err) }),
  );
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
  await defaultSyncStore.writeCache(key, {
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

const UNKNOWN_FIELD = "unknown";
function fmValue(v: unknown): string {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : UNKNOWN_FIELD;
}

/** Project the enriched delta feed into the envelope's `incoming` row shape (message pack (a)). */
export function toIncomingRows(changes: DocChange[]): Record<string, unknown>[] {
  return changes.map((c) => ({ verb: c.verb, kind: c.kind, id: c.docId, title: c.title, actor: c.actor }));
}

/** The bundle exists locally and origin was successfully checked for a shared board. */
export const SYNC_LOCAL_ONLY_MESSAGE =
  "local-only board — no shared board branch exists, so there is nothing to pull or push";

export function syncLocalOnlyNote(inv: string): string {
  return (
    "a supported mode: every local command works, and your board changes stay on this machine " +
    `(sync committed nothing). To share the board with teammates, run \`${inv} sync --establish\` ` +
    "— it publishes the board as a 'board' branch on the repo's 'origin' remote (add one first " +
    "if the repo has none); teammates then just run sync."
  );
}

export const SYNC_REMOTE_STATE_UNKNOWN_MESSAGE =
  "shared board state unknown — origin could not be checked, so sync cannot tell whether a remote board exists";

export function syncRemoteStateUnknownNote(inv: string, hasLocalBundle: boolean): string {
  const local = hasLocalBundle
    ? "your local bundle remains usable and sync committed nothing. "
    : "sync changed nothing. ";
  return local + `Retry \`${inv} sync\` when origin is available; a shared board may already exist.`;
}

// ── the in-tree board (read-side mode, board-git PR C) ─────────────────────────

/** The in-tree board's one-line identity, led by every in-tree receipt. */
export const SYNC_IN_TREE_BOARD_LINE = `in-tree — board docs ride the current code branch (${BUNDLE_DIR}/ is committed with the code)`;

/** The explicit "no comparison basis" state (upstream decision table: report nothing, honestly). */
export const SYNC_IN_TREE_NO_BASIS = "no-comparison-basis";

/** "N incoming board changes not yet in this checkout — run 'git pull' to get them". */
export function inTreePullHint(behind: number): string {
  return `${behind} incoming board ${behind === 1 ? "change is" : "changes are"} not yet in this checkout — run 'git pull' to get ${behind === 1 ? "it" : "them"}`;
}

/** The in-tree `--pull-only` up-to-date state (nothing upstream this checkout lacks). */
export const SYNC_IN_TREE_CURRENT = "checkout is current with upstream";

/**
 * The in-tree sync flow: full sync REFUSES with truthful guidance (structured, `details.state:
 * "in-tree"` — consumers discriminate on the state, never the code alone); `--pull-only`
 * degrades to FETCH-AND-REPORT — the same `inTreeFetchAndRecord` step session-start budgets,
 * here with the interactive posture (a failed fetch throws its classified error instead of
 * degrading silently). Delivery is always the user's own `git pull`; the working tree is never
 * touched on any path.
 */
async function syncInTree(
  dir: string,
  pullOnly: boolean,
  inv: string,
  mode: ReturnType<typeof resolveMode>,
  limit: number,
  stdout: (s: string) => void,
  deps: Partial<SyncCliDeps>,
): Promise<void> {
  const top = repoTopLevel(dir);
  if (!top) throw new CliError("RUNTIME", "not inside a git repository");
  const boardPath = path.join(top, BUNDLE_DIR);

  if (!pullOnly) {
    const hasOrigin = runGit(top, ["remote", "get-url", BOARD_REMOTE]).status === 0;
    throw syncOutcomeError("in-tree.sync-refusal", { inv, boardPath, hasOrigin });
  }

  const key = resolveBundleKey(boardPath);
  // A confirmed board exists for this repo (the in-tree one) — same marker contract as the
  // branch-mode pull steps.
  await defaultSyncStore.refreshMarker(key);

  const result = await inTreeFetchAndRecord(defaultSyncStore, top, key);
  if (result.state === "fetch-failed") throw result.failure; // classified; maps at the boundary

  const rec: Record<string, unknown> = { board: SYNC_IN_TREE_BOARD_LINE };
  if (result.state === "no-upstream") {
    rec.state = SYNC_IN_TREE_NO_BASIS;
    rec.note = syncOutcomeLine("line.in-tree.no-basis", { reason: result.reason });
  } else if (result.state === "unusable-upstream") {
    rec.state = SYNC_IN_TREE_NO_BASIS;
    rec.note = syncOutcomeLine("line.in-tree.no-basis", { reason: "unusable-upstream", ref: result.ref });
  } else {
    rec.upstream = result.upstreamRef;
    rec.incoming = cap(toIncomingRows(result.changes), limit);
    const notes: string[] = [];
    if (result.reanchored) notes.push(REANCHOR_NOTE);
    notes.push(result.behind > 0 ? inTreePullHint(result.behind) : SYNC_IN_TREE_CURRENT);
    rec.note = notes.join("; ");
  }
  const hookHint = await hookInstallHintOnce(key, inv, deps.hookInstalled);
  if (hookHint) rec.hint = hookHint;
  stdout(render(rec, mode));
}

/**
 * The sync command entry — and the git tier's CLI COMMAND BOUNDARY: any typed `BoardGitError`
 * that reaches this edge (git.ts ops, the establish flows dispatched below) maps through
 * THE one `cliErrorFromBoardGit` layer, so callers (the bin wrapper, tests) always observe
 * `CliError` with the exact envelope/exit the tier produced before the taxonomy split.
 */
export async function sync(argv: string[], deps: Partial<SyncCliDeps> = {}): Promise<void> {
  try {
    await syncCommand(argv, deps);
  } catch (err) {
    throw isBoardGitError(err) ? cliErrorFromBoardGit(err) : err;
  }
}

async function syncCommand(argv: string[], deps: Partial<SyncCliDeps> = {}): Promise<void> {
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

  // `--migrate` is a RETIRED spelling: `--establish` subsumed the committed-folder case. The flag
  // stays recognized so old muscle memory gets a pointer instead of a generic unknown-option error.
  if (values.migrate) {
    throw new CliError(
      "USAGE",
      "--migrate was retired — 'sync --establish' now handles a committed .agentstate-lite/ folder " +
        "too (preview first; --yes executes)",
      { help: `${inv} sync --establish` },
    );
  }
  if (values.yes && !values.establish) {
    throw new CliError("USAGE", "--yes only applies to sync --establish (it confirms the committed-folder case)", {
      help: `${inv} sync --establish --yes`,
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

  // `--establish` dispatches before ordinary provisioning. A genuinely fresh or explicitly
  // published local-only board prints its own receipt; an already-shared board falls through to
  // the ordinary sync flow with an idempotence note.
  let establishAlreadyNote: string | undefined;
  if (values.establish) {
    const establishOutcome = await establishBoard(dir, inv, mode, stdout, deps, { yes: Boolean(values.yes) });
    if (!establishOutcome.already) return;
    establishAlreadyNote = ESTABLISH_ALREADY;
  }

  // STEP 0: entry self-heal (adjudication C) — a stale mid-rebase state found at ENTRY (a
  // crashed/killed prior sync) is aborted BEFORE provisioning is even checked, let alone the
  // commit step (see the doc comment on {@link healStaleRebaseBeforeProvisioning} for why this
  // must run BEFORE, not after, `provisionBoardWorktree`).
  healStaleRebaseBeforeProvisioning(dir);

  // CHANNEL DETECTION (board-git PR C) — the act-time probe at sync's own resolution point,
  // computed fresh on every run (never cached across a network boundary — B review's TOCTOU
  // note). Routing is deliberately narrow: ONLY a positively detected `in-tree` channel leaves
  // today's flow; `branch`, `local-only`, AND the fail-closed `indeterminate` outcome all fall
  // through to the provisioning state machine unchanged (its remote-unknown / local-only /
  // nothing-to-sync messages stay byte-identical — detection composes with that machine, never
  // re-routes its reviewed guidance). The tracked-folder refusal arms (pre-share-window /
  // dual-board) throw typed here and map at this command's boundary — the pre-share arm via the
  // ONE factory provisioning itself uses, verbatim.
  const detection = detectBoardChannel(dir);
  if (detection.kind === "channel" && detection.channel.mode === "in-tree") {
    await syncInTree(dir, pullOnly, inv, mode, limit, stdout, deps);
    return;
  }

  // Provisioning owns the distinction between known remote absence and a failed remote check.
  const outcome = provisionBoardWorktree(dir, { allowLocalBranch: false });
  if (outcome.kind === "local_board") {
    throw outcome.remoteExists
      ? syncOutcomeError("sync.local-board.remote-exists", { inv })
      : syncOutcomeError("sync.local-board.unpublished", { inv });
  }
  if (outcome.kind === "no_repo") {
    stdout(render({ sync: "nothing to sync" }, mode));
    return;
  }
  if (outcome.kind === "no_board") {
    const hasLocalBundle = hasLocalOnlyBundle(dir);
    if (outcome.remoteState === "unknown") {
      stdout(
        render(
          {
            sync: SYNC_REMOTE_STATE_UNKNOWN_MESSAGE,
            note: syncRemoteStateUnknownNote(inv, hasLocalBundle),
          },
          mode,
        ),
      );
      return;
    }
    if (hasLocalBundle) {
      stdout(render({ sync: SYNC_LOCAL_ONLY_MESSAGE, note: syncLocalOnlyNote(inv) }, mode));
      return;
    }
    stdout(render({ sync: "nothing to sync" }, mode));
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
  await defaultSyncStore.refreshMarker(key);

  const storedCursor = await defaultSyncStore.readCursor(key);
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
      await defaultSyncStore.recordSelfActors(key, commitResult.docs.map((d) => d.actor));
    }
  }

  // STEP 3: pull. Full sync rebases with the CONVERGING conflict mechanic (U3b: keep upstream,
  // export local, COMPLETE the rebase — never left mid-state); --pull-only ff-only-merges (NEVER
  // rebases) via the SAME `ffPull` primitive U4's SessionStart pull uses — but THIS caller
  // translates every swallowed reason into a real structured error instead of silently no-op'ing
  // (see the module header).
  if (pullOnly) {
    const ff = ffPull(boardPath);
    if (ff.swallowed) {
      throw withProvisionAnnouncement(ffSwallowToError(ff.swallowed, inv, boardPath), outcome);
    }
  } else {
    let rebaseOutcome: FetchRebaseResolvingOutcome;
    try {
      rebaseOutcome = fetchRebaseResolving(boardPath, defaultSyncStore.exportsDir(key));
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
      // First publication is ALWAYS explicit. A local branch name or an index.md file is evidence
      // of neither user consent nor transaction provenance; inferring either here can publish an
      // unrelated private branch. `--establish` owns snapshot, publish, and recovery.
      const noUpstream = withProvisionAnnouncement(
        new CliError(
          "NO_UPSTREAM",
          `the local board has not been published — bare sync never creates origin/${BOARD_BRANCH}; ` +
            `run '${inv} sync --establish' to publish it explicitly`,
          { help: `${inv} sync --establish` },
        ),
        outcome,
      );
      throw await throwPostCommitFailure(noUpstream, commitResult.committed, key, boardPath);
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
    await defaultSyncStore.writeCursor(key, { tier: "git", token: postPullHead });
  } else {
    // The STORED cursor's object no longer exists (history was rewritten under it) — U2's own
    // re-anchor path: record the honest note, an empty delta (unknowable across a rewrite), and
    // advance the cursor to now. NEVER a silent skip, never fatal (U2's contract).
    changes = [];
    reanchorNote = REANCHOR_NOTE;
    await defaultSyncStore.recordReanchor(
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
      const partial: Record<string, unknown> = {};
      const announcement = provisionAnnouncement(outcome);
      if (announcement) Object.assign(partial, announcement);
      partial.warning = warning;
      partial.committed = commitResult.docs.length;
      partial.pushed = 0;
      partial.pulled = originDelta.length;
      const actor = singleActor(commitResult.docs);
      if (actor) partial.actor = actor;
      partial.incoming = cap(toIncomingRows(originDelta), limit);
      if (reanchorNote) partial.note = reanchorNote;
      stdout(render(partial, mode));
      await defaultSyncStore.writeCache(key, {
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
  await defaultSyncStore.writeCache(key, {
    updatedAt: new Date().toISOString(),
    delta: toDeltaRows(changes),
    unpushedCount: unpushedCount(boardPath) ?? 0,
    uncommittedCount: countUncommitted(boardPath),
    ...(reanchorNote ? { note: reanchorNote } : {}),
  });

  const committedCount = commitResult.docs.length;
  const pulledCount = originDelta.length;

  // The clean-shared-board definitive empty state: nothing committed, nothing pulled FROM ORIGIN, nothing
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

/** The in-tree variant: absence is judged under the board prefix on the branch's tracking upstream. */
export const SHOW_INCOMING_IN_TREE_ABSENT_STATE =
  `absent upstream — not under ${BUNDLE_DIR}/ on the branch's tracking upstream as of the last ` +
  "fetch (deleted upstream, or a new local doc)";

/** `--show-incoming` reads only the last fetched remote ref and never fetches implicitly. */
export const SHOW_INCOMING_NO_UPSTREAM =
  "there is no fetched origin/board state to show — either this board is local-only (no remote " +
  "board branch, so no incoming versions exist), or nothing has been fetched yet";

/** The in-tree viewer's refusal when the branch has no usable upstream to read a version from. */
export function showIncomingInTreeNoBasis(inv: string, reason: InTreeNoBasisReason, ref?: string): CliError {
  return syncOutcomeError("in-tree.show-incoming.no-basis", { inv, reason, ref });
}

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

    // The ref the incoming version is read FROM, and the repo-relative prefix doc paths live
    // under. Branch mode (any fetched `origin/board`): the board ref, no prefix — byte-identical
    // to before PR C. In-tree (tracked conventional folder, no board refs anywhere): the branch's
    // OWN tracking upstream, docs under `.agentstate-lite/` — still "as of last fetch", still no
    // implicit fetch (adjudication G holds; the upstream resolution here is local config/refs).
    let readRef = `refs/remotes/${BOARD_REF}`;
    let pathPrefix = "";
    if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status !== 0) {
      if (runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0) {
        throw ffSwallowToError("no-upstream", inv, top);
      }
      if (folderTreeAtHead(top) !== null) {
        const resolution = resolveInTreeUpstream(top);
        if (resolution.state === "none") throw showIncomingInTreeNoBasis(inv, resolution.reason);
        const sha = inTreeUpstreamSha(top, resolution.config.ref);
        if (sha === null) throw showIncomingInTreeNoBasis(inv, "unusable-upstream", resolution.config.ref);
        readRef = sha;
        pathPrefix = `${BUNDLE_DIR}/`;
      } else {
        throw new CliError("NO_UPSTREAM", SHOW_INCOMING_NO_UPSTREAM, {
          help: `on a shared board, run ${inv} sync --pull-only once to fetch origin/board, then re-run --show-incoming`,
        });
      }
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
      const bytes = readDocBytesAtRef(top, readRef, `${pathPrefix}${probe.relPath}`);
      if (bytes === null) continue; // absent under THIS interpretation — try the next candidate
      hit = { probe, bytes };
      break;
    }
    if (hit === null) {
      const state = {
        sync: "show-incoming",
        id,
        as_of: SHOW_INCOMING_AS_OF,
        state: pathPrefix === "" ? SHOW_INCOMING_ABSENT_STATE : SHOW_INCOMING_IN_TREE_ABSENT_STATE,
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
