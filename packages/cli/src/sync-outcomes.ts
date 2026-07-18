// `sync-outcomes.ts` — the ONE enumerable table of the sync-family's refusal/guidance outcomes.
//
// Every in-scope refusal envelope (sync/establish/home) is constructed from a row here via
// {@link syncOutcomeError}; every in-scope exit-0 guidance string comes from a line row via its
// bound template. Package-side factories (`preShareWindowError`, `dualBoardError`,
// `existingDirRefusal` — thrown inside @agentstate-lite/board-git) stay the construction sites for
// their states; their rows COMPOSE the factories so the agreement suite
// (`test/sync-outcomes.test.ts`) can enumerate every row against the pre-refactor rendered-byte
// fixtures (`test/fixtures/sync-outcomes/`). Behavior is BYTE-FROZEN, today's copy inconsistencies
// included — copy improvements are follow-up work, never folded into this table.
//
// Rows carry a `code` (CliErrorCode) and NEVER an exit: the exit derives solely through errors.ts's
// one CODE_EXIT mapping when the CliError is constructed.
import {
  BOARD_BRANCH,
  BOARD_REMOTE,
  BUNDLE_DIR,
  dualBoardError,
  existingDirRefusal,
  preShareWindowError,
  runGit,
} from "@agentstate-lite/board-git";
import { CliError, type CliErrorCode } from "./errors.js";

// ── shared string templates (bound into rows below; command modules re-export them) ──

/** Route a missing upstream to either the existing shared repo or explicit first publication. */
export function upstreamHelp(inv: string): string {
  return (
    `if a teammate already shares this project's board, make sure your \`origin\` remote points at ` +
    `the SAME repository they pushed the \`board\` branch to; if nobody has started sharing this ` +
    `project's board yet, run \`${inv} sync --establish\` to start — until then a local-only ` +
    `board is a supported mode: every local command keeps working, and nothing leaves this machine`
  );
}

/**
 * Full sync's in-tree refusal (write-side is a non-goal: pushing the branch publishes code).
 * `hasOrigin` false (no `origin` remote configured at all) names that dead end instead of
 * pointing at `sync --establish`, which would just refuse again with nothing else to try.
 */
export function syncInTreeRefusalMessage(inv: string, hasOrigin: boolean = true): string {
  const establishRemedy = hasOrigin
    ? `run '${inv} sync --establish' to move the board to a dedicated '${BOARD_BRANCH}' branch`
    : `this repo has no '${BOARD_REMOTE}' remote yet — run 'git remote add ${BOARD_REMOTE} <url>', ` +
      `then '${inv} sync --establish' to move the board to a dedicated '${BOARD_BRANCH}' branch`;
  return (
    `this board rides your code branch — '${BUNDLE_DIR}/' is committed with the code, so a full ` +
    `sync would have to publish the code branch itself; share board changes with your normal git ` +
    `commit/push, run '${inv} sync --pull-only' to fetch-and-report incoming board changes, or ` +
    `${establishRemedy}`
  );
}

/** The in-tree no-comparison-basis reasons (upstream decision table — never a guessed ref). */
export type InTreeNoBasisReason = "detached-head" | "no-upstream" | "unusable-upstream";

/** Human phrasing per decision-table reason — never a guessed `origin/<branch>`. */
export function inTreeNoBasisNote(reason: InTreeNoBasisReason, ref?: string): string {
  const cause =
    reason === "detached-head"
      ? "the checkout is on a detached HEAD (no branch, so no tracking upstream)"
      : reason === "no-upstream"
        ? "the current branch has no upstream tracking configured"
        : `the branch's tracking ref '${ref ?? "?"}' does not resolve (never fetched, or deleted on the remote)`;
  return `${cause} — there is nothing to fetch from or compare against, so board freshness is unknown; sync will not guess an upstream`;
}

// ── home's board-block line templates (home.ts re-exports these names) ────────

/** Test-pinned, machine-honest home board-status strings. */
export const BOARD_UP_TO_DATE = "up to date";
export const BOARD_OFFLINE_NOTE = "board sync offline — showing last known state";

/** The probe-gated first-contact line — NEVER "run init" (the divergent-second-bundle footgun). */
export function boardFirstContactLine(inv: string): string {
  return `not yet provisioned — run \`${inv} sync\` to set it up`;
}

/**
 * The IN-TREE board line (board-git PR C) — doubles as first contact AND the quiet steady state:
 * it is true whether or not this render could verify freshness, so it never over-claims currency
 * the way "up to date" would for a mode whose plain render never fetches.
 */
export const BOARD_IN_TREE_LINE =
  `rides this branch — '${BUNDLE_DIR}/' is committed with the code; teammates' board changes ` +
  "arrive with your normal 'git pull'";

/** "2 incoming board changes are not yet in this checkout — run 'git pull' to get them". */
export function inTreePullHintLine(n: number): string {
  return `${n} incoming board ${n === 1 ? "change is" : "changes are"} not yet in this checkout — run 'git pull' to get ${n === 1 ? "it" : "them"}`;
}

/** In-tree unpushed backstop (prefix-scoped): sharing rides the normal git flow, never sync. */
export function inTreeUnpushedLine(n: number): string {
  return `${n} board ${n === 1 ? "commit" : "commits"} on this branch not yet pushed — 'git push' shares ${n === 1 ? "it" : "them"}`;
}

/** In-tree uncommitted backstop (prefix-scoped). */
export function inTreeUncommittedLine(n: number): string {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} — commit ${n === 1 ? "it" : "them"} with your normal git flow to share`;
}

/** "2 local board commits not yet pushed — run sync when online" (pack (e), never "1 commits"). */
export function unpushedLine(n: number): string {
  return `${n} local board ${n === 1 ? "commit" : "commits"} not yet pushed — run sync when online`;
}

/** The backstop's other half: uncommitted board changes (the agent that never ran sync at all). */
export function uncommittedLine(n: number): string {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} — run sync to share ${n === 1 ? "it" : "them"}`;
}

// ── the row model ─────────────────────────────────────────────────────────────

/** One refusal outcome: stable code + parameterized message/help/details. NO exit field, ever. */
export interface SyncOutcomeRow<P> {
  code: CliErrorCode;
  message: (p: P) => string;
  help?: (p: P) => string | undefined;
  details?: (p: P) => Record<string, unknown> | undefined;
}

const row = <P>(r: SyncOutcomeRow<P>): SyncOutcomeRow<P> => r;

/** One exit-0 guidance string template (a record FIELD's value — record assembly stays site-side). */
export interface SyncOutcomeLineRow<P> {
  message: (p: P) => string;
}

const line = <P>(message: (p: P) => string): SyncOutcomeLineRow<P> => ({ message });

/** `git fetch --unshallow origin` — shared by the shallow note and the shallow refusal's help. */
function unshallowCmd(): string {
  return `git fetch --unshallow ${BOARD_REMOTE}`;
}

// ── the error-outcome rows ────────────────────────────────────────────────────

export const SYNC_OUTCOMES = {
  // ffSwallowToError family: `sync --pull-only`'s structured translation of the fail-soft pull's
  // swallow reasons (the SessionStart caller swallows the same reasons silently).
  "ff.git-missing": row<Record<string, never>>({
    code: "GIT_MISSING",
    message: () => "sync needs git, which isn't installed on this machine",
    help: () => "install git (https://git-scm.com/downloads), then re-run the command",
  }),
  "ff.no-upstream.unpublished": row<{ inv: string }>({
    code: "NO_UPSTREAM",
    message: (p) => `board not published yet — run '${p.inv} sync --establish' to publish it explicitly`,
    help: (p) => `${p.inv} sync --establish`,
  }),
  "ff.no-upstream.unlinked": row<{ inv: string }>({
    code: "NO_UPSTREAM",
    message: () =>
      "the board branch isn't linked to a remote — there is nothing to pull from or push to " +
      "(a local-only board is a supported mode; sharing needs a remote 'board' branch)",
    help: (p) => upstreamHelp(p.inv),
  }),
  "ff.auth": row<Record<string, never>>({
    code: "AUTH_REQUIRED",
    message: () => "sync was denied access to the remote (or the repository is not visible to your credentials)",
    details: () => ({ best_effort: true }),
  }),
  "ff.network": row<Record<string, never>>({
    code: "TRANSIENT",
    message: () => "sync could not reach the remote — offline or the host is unreachable; retry",
    details: () => ({ retryable: true }),
  }),
  "ff.busy": row<Record<string, never>>({
    code: "GIT_BUSY",
    message: () => "another git process is using this repository — retry once it finishes",
    details: () => ({ retryable: true }),
  }),
  "ff.diverged": row<{ inv: string }>({
    code: "CONFLICT",
    message: (p) =>
      `the board has local commits not yet pushed, and origin has moved too — \`sync --pull-only\` ` +
      `only fast-forwards; run \`${p.inv} sync\` (without --pull-only) to reconcile`,
  }),
  "ff.conflict": row<{ inv: string }>({
    code: "CONFLICT",
    message: (p) =>
      `the board checkout has unresolved conflicts — run \`${p.inv} sync\` (without --pull-only) to reconcile`,
  }),
  "ff.dirty": row<Record<string, never>>({
    code: "RUNTIME",
    message: () =>
      "the board checkout has uncommitted local changes that a fast-forward-only pull would " +
      "overwrite — commit or discard them, or run a full sync instead of --pull-only",
  }),
  "ff.detached-head": row<Record<string, never>>({
    code: "RUNTIME",
    message: () => "the board checkout is in a detached-HEAD state — sync needs the board branch checked out",
    details: () => ({ state: "detached-head" }),
  }),
  "ff.not-a-repo": row<Record<string, never>>({
    code: "RUNTIME",
    message: () => "the board checkout is not a git repository — run sync again to re-provision it",
  }),
  "ff.unclassified": row<{ reason: string }>({
    code: "RUNTIME",
    message: (p) => `sync's pull step failed for an unclassified reason (${p.reason}) — re-run, or run without --pull-only`,
  }),

  // Provisioning's local_board outcomes (bare sync never adopts or publishes a local branch).
  "sync.local-board.remote-exists": row<{ inv: string }>({
    code: "CONFLICT",
    message: () =>
      `both a local '${BOARD_BRANCH}' branch and origin/${BOARD_BRANCH} exist, but the local branch ` +
      `is not the managed board checkout — bare sync will not guess which history is safe`,
    help: (p) =>
      `preserve or rename the local branch (for example: git branch -m ${BOARD_BRANCH} ` +
      `${BOARD_BRANCH}-local-backup), then re-run '${p.inv} sync' to join origin/${BOARD_BRANCH}`,
  }),
  "sync.local-board.unpublished": row<{ inv: string }>({
    code: "NO_UPSTREAM",
    message: () =>
      `a local '${BOARD_BRANCH}' branch exists but has not been explicitly adopted or published — ` +
      `bare sync will not check it out or create origin/${BOARD_BRANCH}`,
    help: (p) => `${p.inv} sync --establish`,
  }),

  // The in-tree board's write refusal + the viewer's no-comparison-basis refusal.
  "in-tree.sync-refusal": row<{ inv: string; boardPath: string; hasOrigin: boolean }>({
    code: "USAGE",
    message: (p) => syncInTreeRefusalMessage(p.inv, p.hasOrigin),
    details: (p) => ({ path: p.boardPath, state: "in-tree" }),
    help: (p) => (p.hasOrigin ? `${p.inv} sync --establish` : `git remote add ${BOARD_REMOTE} <url>`),
  }),
  "in-tree.show-incoming.no-basis": row<{ inv: string; reason: InTreeNoBasisReason; ref?: string }>({
    code: "NO_UPSTREAM",
    message: (p) => `this board rides the current branch, and ${inTreeNoBasisNote(p.reason, p.ref)}`,
    details: () => ({ state: "in-tree" }),
    help: (p) =>
      `configure tracking (git branch --set-upstream-to=<remote>/<branch>) or fetch once, then re-run ${p.inv} sync --show-incoming <id>`,
  }),

  // establish's refusal arms (committed-folder preconditions + the greenfield namespace guard).
  "establish.behind-origin": row<{ inv: string; branch: string; behind: string[] }>({
    code: "RUNTIME",
    message: (p) =>
      `establish refused: '${p.branch}' is behind ${BOARD_REMOTE}/${p.branch} with board changes — ` +
      `establishing from this stale state would strand a teammate's board commits on the frozen ` +
      `folder forever`,
    details: (p) => ({ behind_board_commits: p.behind.length, commits: p.behind.slice(0, 20) }),
    help: (p) => `git pull, then re-run ${p.inv} sync --establish --yes`,
  }),
  "establish.namespace-conflict.greenfield": row<{ conflicts: string[] }>({
    code: "RUNTIME",
    message: (p) => `branches named '${BOARD_BRANCH}/…' block establishment: ${p.conflicts.join(", ")}`,
    details: (p) => ({ conflicting_branches: p.conflicts }),
  }),
  "establish.namespace-conflict.committed": row<{ inv: string; conflicts: string[] }>({
    code: "RUNTIME",
    message: (p) =>
      `establish refused: branches named '${BOARD_BRANCH}/…' exist — git cannot create a ` +
      `'${BOARD_BRANCH}' branch alongside them: ${p.conflicts.join(", ")}`,
    details: (p) => ({ conflicting_branches: p.conflicts }),
    help: (p) => `delete or rename these branches, then re-run ${p.inv} sync --establish --yes`,
  }),
  "establish.board-branch-mismatch": row<Record<string, never>>({
    code: "RUNTIME",
    message: () =>
      `a local '${BOARD_BRANCH}' branch already exists and does not match the committed ` +
      `folder — if it is left over from an interrupted establishment, delete it ` +
      `(git branch -D ${BOARD_BRANCH}); if it is used for something else, rename it — then re-run`,
  }),
  "establish.detached-head.committed": row<Record<string, never>>({
    code: "RUNTIME",
    message: () =>
      `the repository is on a detached HEAD — check out the branch that carries the committed ` +
      `${BUNDLE_DIR}/ folder, then re-run`,
  }),
  "establish.detached-head.marker": row<{ inv: string }>({
    code: "RUNTIME",
    message: (p) =>
      `the repository is on a detached HEAD — check out the branch that carries the committed ` +
      `${BUNDLE_DIR}/ folder, then re-run '${p.inv} sync --establish --yes'`,
  }),

  // The committed-case marker (crash/lost-race provenance) refusal arms.
  "marker.shallow.refusal": row<{ inv: string; marker: string }>({
    code: "RUNTIME",
    message: () =>
      `establish refused: this clone's git history is shallow (truncated), so the interrupted ` +
      `establishment's snapshot cannot be verified against origin/${BOARD_BRANCH}; nothing was changed`,
    details: (p) => ({ snapshot_commit: p.marker }),
    help: (p) => `${unshallowCmd()}  # then re-run ${p.inv} sync --establish`,
  }),
  "marker.lost-race.conflict": row<{ inv: string; marker: string; markerValid: boolean }>({
    code: "CONFLICT",
    message: (p) =>
      p.markerValid
        ? `origin/${BOARD_BRANCH} does not contain this clone's interrupted establishment ` +
          `snapshot — a different board is published now; nothing was changed, and the ` +
          `committed folder here is untouched`
        : `this clone's establishment marker is invalid or unverifiable — it names a commit ` +
          `that cannot be found even after fetching, so establish cannot tie it to what ` +
          `origin/${BOARD_BRANCH} publishes; nothing was changed, and the committed folder ` +
          `here is untouched`,
    details: (p) => ({ snapshot_commit: p.marker }),
    help: (p) =>
      `coordinate with whoever published origin/${BOARD_BRANCH}; to discard this clone's ` +
      `unpublished attempt: git branch -D ${BOARD_BRANCH}, then re-run ` +
      `'${p.inv} sync --establish' — the stale marker is cleared automatically once the ` +
      `branch is gone`,
  }),
  "marker.offline.refusal": row<Record<string, never>>({
    code: "TRANSIENT",
    message: () =>
      `establish refused: could not reach '${BOARD_REMOTE}' — finishing the interrupted ` +
      `establishment re-creates the folder-removal commit, which must be cut from a fresh view ` +
      `of ${BOARD_REMOTE}; get online, then re-run`,
    details: () => ({ retryable: true }),
  }),
  "marker.tree-changed.conflict": row<{ inv: string; branch: string; snapshotTree: string; currentTree: string }>({
    code: "CONFLICT",
    message: (p) =>
      `${BUNDLE_DIR}/ changed on '${p.branch}' after the interrupted establishment pushed its ` +
      `snapshot — re-creating the folder-removal now would strand those newer board changes ` +
      `on the frozen folder; nothing was changed`,
    details: (p) => ({ snapshot_tree: p.snapshotTree, current_tree: p.currentTree }),
    help: (p) =>
      `the newer changes stay recoverable in '${p.branch}' history; after the cleanup PR ` +
      `merges and this clone joins via '${p.inv} sync', re-apply them with doc update`,
  }),
  // The three marker-unavailable wordings — per-site rows, inconsistencies frozen as-is.
  "marker.unavailable.tree": row<{ marker: string }>({
    code: "RUNTIME",
    message: (p) => `the establishment marker names an unavailable tree (${p.marker})`,
  }),
  "marker.unavailable.commit.moved": row<{ marker: string }>({
    code: "RUNTIME",
    message: (p) => `the establishment marker names an unavailable commit (${p.marker}); nothing was moved`,
  }),
  "marker.unavailable.commit.changed": row<{ marker: string }>({
    code: "RUNTIME",
    message: (p) => `the establishment marker names an unavailable commit (${p.marker}); nothing was changed`,
  }),

  // Package-side rows: the factories stay the construction sites (thrown inside board-git);
  // these rows COMPOSE them so the agreement suite enumerates their arms. `top` must be a repo in
  // the row's state (the factory probes it for the remnant discrimination).
  "window.pre-share": row<{ top: string; boardPath: string }>({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, true).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, true).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, true).details,
  }),
  "window.pre-share.no-origin": row<{ top: string; boardPath: string }>({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, false).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, false).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, false).details,
  }),
  "window.remnant": row<{ top: string; boardPath: string }>({
    code: "RUNTIME",
    message: (p) => preShareWindowError(p.top, p.boardPath, true).message,
    help: (p) => preShareWindowError(p.top, p.boardPath, true).help,
    details: (p) => preShareWindowError(p.top, p.boardPath, true).details,
  }),
  "window.dual-board": row<{ boardPath: string }>({
    code: "CONFLICT",
    message: (p) => dualBoardError(p.boardPath).message,
    help: (p) => dualBoardError(p.boardPath).help,
    details: (p) => dualBoardError(p.boardPath).details,
  }),
  "provision.foreign": row<{ boardPath: string; top: string }>({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("foreign", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("foreign", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("foreign", p.boardPath, p.top).details,
  }),
  "provision.foreign-checkout": row<{ boardPath: string; top: string }>({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("foreign_checkout", p.boardPath, p.top).details,
  }),
  "provision.unrepairable": row<{ boardPath: string; top: string }>({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("unrepairable", p.boardPath, p.top).details,
  }),
  "provision.wrong-branch": row<{ boardPath: string; top: string }>({
    code: "RUNTIME",
    message: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).message,
    help: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).help,
    details: (p) => existingDirRefusal("wrong_branch", p.boardPath, p.top).details,
  }),
} as const;

export type SyncOutcomeKey = keyof typeof SYNC_OUTCOMES;

type RowParams<K extends SyncOutcomeKey> = Parameters<(typeof SYNC_OUTCOMES)[K]["message"]>[0];

/** Build the CliError for one outcome row — the ONE construction path for in-scope refusals. */
export function syncOutcomeError<K extends SyncOutcomeKey>(key: K, params: RowParams<K>): CliError {
  const r = SYNC_OUTCOMES[key] as SyncOutcomeRow<RowParams<K>>;
  const details = r.details?.(params);
  const help = r.help?.(params);
  return new CliError(r.code, r.message(params), {
    ...(details !== undefined ? { details } : {}),
    ...(help !== undefined ? { help } : {}),
  });
}

// ── the exit-0 guidance line rows ─────────────────────────────────────────────

export const SYNC_OUTCOME_LINES = {
  "line.in-tree.no-basis": line<{ reason: InTreeNoBasisReason; ref?: string }>((p) =>
    inTreeNoBasisNote(p.reason, p.ref),
  ),
  // establish's window notes for a clone with no local establishment work left (pull-first;
  // probed per state at the site — the remnant state renders the package factory's message).
  "line.window-note.landed": line<{ inv: string; branch: string }>(
    (p) =>
      `this clone still carries the committed ${BUNDLE_DIR}/ folder and the folder-removal has ` +
      `already landed on '${p.branch}' — run 'git pull' (the folder vanishes), then '${p.inv} sync' ` +
      `(it returns as the live board)`,
  ),
  "line.window-note.pending": line<{ inv: string }>(
    (p) =>
      `this clone still carries the committed ${BUNDLE_DIR}/ folder — once the folder-removal ` +
      `lands on the default branch: 'git pull' (the folder vanishes), then '${p.inv} sync' ` +
      `(it returns as the live board)`,
  ),
  // alreadyShared's marker-state record FIELD templates (record assembly stays at the site).
  "line.marker.story.lost-race": line<Record<string, never>>(
    () =>
      `a different board is published on ${BOARD_REMOTE}/${BOARD_BRANCH} and this clone's ` +
      `earlier establishment snapshot is not part of it`,
  ),
  "line.marker.story.unverifiable": line<Record<string, never>>(
    () =>
      `this clone's establishment marker is invalid or unverifiable (it names a commit that ` +
      `cannot be found even after fetching), and the board published on ` +
      `${BOARD_REMOTE}/${BOARD_BRANCH} cannot be tied to it`,
  ),
  "line.marker.cleared.removed": line<{ story: string }>(
    (p) => `${p.story} — its stale marker has been cleared (the only change made by this run)`,
  ),
  "line.marker.cleared.failed": line<{ story: string; markerPath: string }>(
    (p) =>
      `${p.story} — its stale marker could NOT be removed (this run changed nothing); remove ` +
      `it by hand: rm ${p.markerPath}`,
  ),
  "line.marker.lost-race.note": line<{ story: string }>(
    (p) => `${p.story} — this clone's earlier '--establish --yes' did not win; nothing has been changed by this run`,
  ),
  "line.marker.lost-race.discard": line<{ inv: string }>(
    (p) =>
      `git branch -D ${BOARD_BRANCH}, then re-run '${p.inv} sync --establish' — the stale ` +
      `marker is cleared automatically once the branch is gone`,
  ),
  "line.marker.shallow.note": line<{ inv: string }>(
    (p) =>
      `an earlier establishment on this clone was interrupted, but this clone's git history ` +
      `is shallow (truncated), so establish cannot verify whether that attempt's snapshot was ` +
      `published — deepen the history (${unshallowCmd()}), then re-run '${p.inv} sync --establish' ` +
      `(nothing has been changed by this run)`,
  ),
  "line.marker.interrupted-offer.note": line<{ inv: string; cleanupBranch: string }>(
    (p) =>
      `an interrupted establishment left the board branch pushed but no folder-removal commit — ` +
      `re-run '${p.inv} sync --establish --yes' to re-create it on '${p.cleanupBranch}' ` +
      `(nothing has been changed by this run)`,
  ),
  "line.marker.offline.note": line<{ inv: string }>(
    (p) =>
      `an earlier establishment on this clone was interrupted, but '${BOARD_REMOTE}' cannot ` +
      `be reached to verify what was published — get online, then re-run ` +
      `'${p.inv} sync --establish' (nothing has been changed by this run)`,
  ),
  "line.marker.prepared.note": line<{ cleanupBranch: string }>(
    (p) =>
      `the folder-removal commit is already prepared on '${p.cleanupBranch}' — push it and ` +
      `open its PR`,
  ),
  // home's board-block lines (bound to the shared templates above).
  "line.home.first-contact": line<{ inv: string }>((p) => boardFirstContactLine(p.inv)),
  "line.home.up-to-date": line<Record<string, never>>(() => BOARD_UP_TO_DATE),
  "line.home.offline-note": line<Record<string, never>>(() => BOARD_OFFLINE_NOTE),
  "line.home.in-tree": line<Record<string, never>>(() => BOARD_IN_TREE_LINE),
  "line.home.unpushed": line<{ n: number }>((p) => unpushedLine(p.n)),
  "line.home.uncommitted": line<{ n: number }>((p) => uncommittedLine(p.n)),
  "line.home.in-tree.unpushed": line<{ n: number }>((p) => inTreeUnpushedLine(p.n)),
  "line.home.in-tree.uncommitted": line<{ n: number }>((p) => inTreeUncommittedLine(p.n)),
  "line.home.in-tree.pull-hint": line<{ n: number }>((p) => inTreePullHintLine(p.n)),
} as const;

export type SyncOutcomeLineKey = keyof typeof SYNC_OUTCOME_LINES;

type LineParams<K extends SyncOutcomeLineKey> = Parameters<(typeof SYNC_OUTCOME_LINES)[K]["message"]>[0];

/** Render one exit-0 guidance line from its row. */
export function syncOutcomeLine<K extends SyncOutcomeLineKey>(key: K, params: LineParams<K>): string {
  return (SYNC_OUTCOME_LINES[key] as SyncOutcomeLineRow<LineParams<K>>).message(params);
}

/**
 * Map a fail-soft pull reason to the capped CliError taxonomy. `boardPath` distinguishes a local
 * unpublished board from a project with no shared board configured.
 */
export function ffSwallowToError(reason: string, inv: string, boardPath?: string): CliError {
  switch (reason) {
    case "git-missing":
      return syncOutcomeError("ff.git-missing", {});
    case "no-upstream": {
      const hasLocalBoard =
        boardPath !== undefined &&
        runGit(boardPath, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      return hasLocalBoard
        ? syncOutcomeError("ff.no-upstream.unpublished", { inv })
        : syncOutcomeError("ff.no-upstream.unlinked", { inv });
    }
    case "auth":
      return syncOutcomeError("ff.auth", {});
    case "network":
      return syncOutcomeError("ff.network", {});
    case "busy":
      return syncOutcomeError("ff.busy", {});
    case "diverged":
      return syncOutcomeError("ff.diverged", { inv });
    case "conflict":
      return syncOutcomeError("ff.conflict", { inv });
    case "dirty":
      return syncOutcomeError("ff.dirty", {});
    case "detached-head":
      return syncOutcomeError("ff.detached-head", {});
    case "not-a-repo":
      return syncOutcomeError("ff.not-a-repo", {});
    default:
      return syncOutcomeError("ff.unclassified", { reason });
  }
}
