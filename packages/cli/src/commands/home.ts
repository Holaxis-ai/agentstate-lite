// `axi` (zero-arg) — the content-first home view.
//
// This is the SessionStart hook payload: it loads on EVERY new session, so it MUST be cheap and
// offline. Per AXI §8 ("no-args shows live content, not a manual"), it leads with a compact,
// LIVE dashboard of the CWD's bundle when one is discoverable — total doc count, counts by type,
// and a small capped list of the most recent docs in the minimal list schema — and falls back to
// today's identity + auth + command-reference view when no bundle is discoverable. It ALWAYS
// exits 0, whether logged in OR out, whether a bundle is present OR not, and whether the bundle
// read succeeds OR fails (it never throws).
//
// OFFLINE GUARANTEE (structural, extended): this module imports `credentials.ts` (a single
// creds-file read), `reference.ts` (pure data), `invocation.ts` (path resolution), `output.ts`
// (TOON) — and now also `bundle.ts`'s `openBundle` + core's `query`, for a LOCAL bundle read.
// `openBundle(undefined, undefined)` (no `--dir`, no `--remote`) is structurally network-free: it
// only ever constructs a `RemoteBackend` when a truthy `remoteFlag` is passed, and home never
// passes one — home has no `--remote`/URL concept at all and never fetches. The local read is
// CHEAP (ONE `query()` — the sanctioned single bundle walk, gate 3; NO `loadKinds`, NO
// `freshness`, NO graph/backlink walk) and DOUBLE-GUARDED: the default summarizer swallows any
// throw into `null` (no bundle, permissions, malformed bundle — all become "no bundle"), and
// `home()` wraps the call in its OWN try/catch too, so even an injected/misbehaving dep can never
// fail a session.
//
// BOARD AWARENESS (sync-verb §U4): home additionally renders a `board` block — the moment-(e)
// strings ("since this machine last synced", per-doc human lines, the unpushed/uncommitted
// backstop, `board: up to date`) — read from the per-clone awareness CACHE (`cursor.ts`) that
// sync/session-start's pull steps write. The OFFLINE GUARANTEE is preserved: the default board
// loader spawns git for LOCAL-ONLY plumbing (rev-parse/status against the checkout on disk —
// never fetch/pull/push, no network I/O of any kind), reuses sync.ts's exported
// `resolveBundleKey` (THE one state-key derivation — cache-per-clone review advisory (a)), and is
// double-guarded like the summarizer: any throw (git missing, no repo, unreadable state) degrades
// to "no board block", never a failed session. The live "did a pull just happen / fail" signal is
// NEVER probed here — `session-start` (the pull-then-render hook command) passes its own pull
// outcome IN-PROCESS via `HomeDeps.boardPull`; a plain `home` render labels the cache with
// `as_of` instead of guessing at network state.
//
// PROJECT-BINDING PEEK (item 43 follow-on — `bundle.ts`'s `resolveProjectBinding`): home does NOT
// call `resolveRemoteFlag` (see `bundle.ts`'s header — home is a THIRD deliberate exception,
// alongside `init`/`serve`), so a committed `.agentstate.json` naming a remote URL can never make
// home fetch. Instead `home()` peeks at `resolveProjectBinding` itself, fs-only, purely to decide
// WHICH local directory to summarize (a directory-type binding) or to annotate the existing offline
// `view.remote` pointer block with where it came from (a URL-type binding — shown, never
// dereferenced, exactly like an explicit `--remote` flag already is). A malformed binding file is
// never allowed to crash the SessionStart hook either: the peek is wrapped in its own try/catch,
// surfacing a visible `project_binding_error` note instead of throwing (see `buildHomeView`).
//
// Adapted from holaxis-agentstate `packages/cli/src/commands/home.ts`.
import { loadCredentials, type Credentials } from "../credentials.js";
import { cliInvocation, binPath, collapseHomeDirectory } from "../invocation.js";
import { DESCRIPTION, commandReference, compactCommandReference } from "../reference.js";
import { render } from "../output.js";
import { openBundle, resolveProjectBinding } from "../bundle.js";
import { normalizeServer } from "../config.js";
import { queryHeads, type OkfDocument } from "@agentstate-lite/core";
import { parseArgs } from "node:util";
import path from "node:path";
import {
  BOARD_BRANCH,
  BOARD_REF,
  BUNDLE_DIR,
  isProvisioned,
  repoTopLevel,
  runGit,
  unpushedCount,
} from "../git.js";
import { countUncommitted, resolveBundleKey, retargetBoardInterior } from "./sync.js";
import { readSyncState, type AwarenessCache, type AwarenessDeltaRow } from "../cursor.js";
import { hookNeedsUpdate } from "./hook.js";

/** A dashboard row in the minimal list schema (AXI §2) — reuses `list.ts`'s exact projection. */
export interface HomeRow {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

/** A compact, cheap summary of the CWD's bundle — the home dashboard's content (AXI §4 aggregates). */
export interface BundleSummary {
  /** Home-collapsed bundle root path (AXI §7 — WHICH bundle this dashboard reflects). */
  root: string;
  /** Total concept count. */
  docs: number;
  /** Count by frontmatter `type`, sorted by count desc then type asc (deterministic). */
  byType: Record<string, number>;
  /** The most-recent docs (timestamp desc, capped) in the minimal schema. Empty rows when docs===0. */
  recent: { shown: number; total: number; rows: HomeRow[] };
}

/**
 * A bundle root WAS discovered from the CWD, but reading it failed (e.g. a malformed/unreadable
 * doc). DISTINCT from "no bundle discoverable" (which is `null`): the home view must NOT tell an
 * agent to `init` over a bundle that already exists — see {@link buildHomeView}.
 */
export interface UnreadableBundle {
  root: string;
  unreadable: true;
}

/**
 * A committed `.agentstate.json` binding home resolved for ITSELF (see the module header's
 * PROJECT-BINDING PEEK) — surfaced as a `via` annotation on whichever block (`remote` or `bundle`)
 * the binding actually drove, so the view stays honest about where a non-cwd-walk resolution came
 * from without changing byte-identical output for the common no-binding case.
 */
export interface HomeBindingNote {
  file: string;
  target: string;
}

/** Cap on the home dashboard's "recent docs" list — small, every-session token budget (AXI §7). */
const HOME_RECENT_LIMIT = 5;

/** Injectable seam so the offline view is unit-testable without real I/O. */
export interface HomeDeps {
  loadCreds: () => Promise<Credentials | null>;
  /** The home-collapsed absolute path of the running executable (the `bin:` identity field). */
  binPath: () => string;
  /** The runnable command prefix for emitted next-step hints (bare bin, else `npx -y …`). */
  invocation: () => string;
  stdout: (s: string) => void;
  /**
   * Produce the live bundle dashboard for the CWD: a full {@link BundleSummary}, an
   * {@link UnreadableBundle} sentinel when a bundle exists but could not be read, or `null` when no
   * bundle is discoverable. Defaults to {@link defaultSummarizeBundle}. Tests inject a fake here
   * instead of doing real FS I/O.
   */
  summarizeBundle: () => Promise<BundleSummary | UnreadableBundle | null>;
  /**
   * The board-awareness probe (sync-verb §U4) — LOCAL git + the per-clone state file, never a
   * network op. Defaults to {@link defaultLoadBoardStatus}; tests inject a fake.
   */
  loadBoardStatus: (dir?: string) => Promise<BoardStatus | null>;
  /**
   * The in-process pull outcome from `session-start` (the pull-then-render hook command). Plain
   * `home` leaves it undefined — home itself NEVER pulls.
   */
  boardPull?: BoardPullOutcome;
  /**
   * True when an installed managed SessionStart hook predates `session-start` (the U6-inherited
   * re-install prompt's signal). Defaults to hook.ts's {@link hookNeedsUpdate} (fs-only reads).
   */
  hookNeedsUpdate: () => boolean;
}

/** A doc's `title` with the SAME fallback `list.ts` uses (frontmatter `title`, else the id's tail). */
function rowTitle(id: string, title: unknown): string {
  return typeof title === "string" ? title : (id.split("/").pop() ?? id);
}

/**
 * PURE: fold a scan result into the dashboard summary — count by `type` (count desc, type asc)
 * and the timestamp-desc / missing-last / id-asc-tiebreak `recent` list capped at
 * {@link HOME_RECENT_LIMIT}. Separated from the I/O in {@link defaultSummarizeBundle} so the sort +
 * cap is directly unit-testable with many docs (incl. missing/tied timestamps) without a real
 * bundle on disk. Input is structural (`id` + `frontmatter` only — the dashboard never reads a
 * body), so both full documents and `queryHeads` head projections fold identically.
 */
export function summarizeDocs(docs: Array<Pick<OkfDocument, "id" | "frontmatter">>, root: string): BundleSummary {
  const byType: Record<string, number> = {};
  for (const d of docs) {
    const t = typeof d.frontmatter.type === "string" ? d.frontmatter.type : "";
    byType[t] = (byType[t] ?? 0) + 1;
  }
  const sortedByType = Object.fromEntries(
    Object.entries(byType).sort(([ta, ca], [tb, cb]) => cb - ca || ta.localeCompare(tb)),
  );

  const rows: HomeRow[] = docs.map((d) => ({
    id: d.id,
    type: typeof d.frontmatter.type === "string" ? d.frontmatter.type : "",
    title: rowTitle(d.id, d.frontmatter.title),
    timestamp: typeof d.frontmatter.timestamp === "string" ? d.frontmatter.timestamp : "",
  }));
  // Timestamp desc; missing/empty timestamp sorts LAST; id asc as a deterministic tiebreak.
  rows.sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      if (a.timestamp !== b.timestamp) return a.timestamp < b.timestamp ? 1 : -1;
    } else if (a.timestamp !== b.timestamp) {
      return a.timestamp ? -1 : 1; // has-timestamp sorts before empty
    }
    return a.id.localeCompare(b.id);
  });

  return {
    root,
    docs: docs.length,
    byType: sortedByType,
    recent: {
      shown: Math.min(rows.length, HOME_RECENT_LIMIT),
      total: rows.length,
      rows: rows.slice(0, HOME_RECENT_LIMIT),
    },
  };
}

/**
 * The default `summarizeBundle`: a LOCAL-only bundle discovery (`openBundle(undefined, undefined)` —
 * never constructs a `RemoteBackend`) + ONE `queryHeads()` scan, folded by {@link summarizeDocs}
 * (the dashboard is a frontmatter-only consumer — head projections are its natural shape, and if
 * this path ever gains a remote variant, bodies stay off the wire by construction). The two
 * failure modes are DISTINGUISHED, not both collapsed to `null`: if discovery throws (no `index.md`
 * up-tree), return `null` (the "run init" fallback); if a bundle root IS found but the read throws
 * (a malformed/unreadable doc), return an {@link UnreadableBundle} sentinel so home never tells an
 * agent to `init` over a bundle that already exists. Cheap: ONE scan (the sanctioned single
 * bundle walk, gate 3), no kinds/freshness/graph load.
 */
export async function defaultSummarizeBundle(dir?: string): Promise<BundleSummary | UnreadableBundle | null> {
  let bundle;
  try {
    bundle = await openBundle(dir, undefined);
  } catch {
    return null; // no bundle discoverable up-tree (NOT_FOUND) — the offline "run init" fallback
  }
  try {
    const docs = await queryHeads(bundle);
    return summarizeDocs(docs, collapseHomeDirectory(bundle.root));
  } catch {
    // A bundle root exists but could not be read — DISTINCT from "no bundle" (see UnreadableBundle).
    return { root: collapseHomeDirectory(bundle.root), unreadable: true };
  }
}

// ── board awareness (sync-verb §U4) ───────────────────────────────────────────

/**
 * The IN-PROCESS pull outcome `session-start` hands the render (never persisted — the honest
 * "did THIS run reach the remote" signal only the process that just pulled can give).
 */
export interface BoardPullOutcome {
  /**
   * True when this run could NOT confirm the board's currency: the fetch failed (offline, auth,
   * a held lock), the pull lost its time box, or the pull step threw. Renders the pinned
   * {@link BOARD_OFFLINE_NOTE}.
   */
  offline: boolean;
  /** Rider-2 provisioning announcements when THIS run provisioned/repaired the checkout. */
  announcement?: Record<string, string>;
  /** Additional honest condition lines (e.g. a non-network pull skip pointing at `sync`). */
  notes?: string[];
  /**
   * The provisioned board checkout the pull step resolved (absolute). session-start uses it to
   * point an explicit `--dir <project>` invocation's bundle dashboard at the board bundle (home's
   * own `--dir` names a literal bundle root, not a project directory — different verb, different
   * flag semantics).
   */
  boardPath?: string;
}

/** What the fs+local-git board probe found for the render (see {@link defaultLoadBoardStatus}). */
export type BoardStatus =
  /** A board exists for this repo (local `board` branch or `origin/board`) but is NOT checked out. */
  | { state: "unprovisioned" }
  | {
      state: "provisioned";
      /** The last pull step's awareness cache (null: never pulled from this clone). */
      cache: AwarenessCache | null;
      /** Actors this clone's own syncs committed — filtered from the human count (cursor.ts). */
      selfActors: string[];
      /** LIVE local backstop counts (git plumbing against the checkout — network-free). */
      unpushed: number | null;
      uncommitted: number | null;
    };

/** Pinned moment-(e) strings (research/sync-verb-ux-review (e); machine-honest per adjudication). */
export const BOARD_UP_TO_DATE = "up to date";
export const BOARD_OFFLINE_NOTE = "board sync offline — showing last known state";
/** Cap on the rendered per-doc human lines (the since-line header carries the full count). */
export const BOARD_CHANGES_SHOWN_LIMIT = 10;

/** The probe-gated first-contact line — NEVER "run init" (the divergent-second-bundle footgun). */
export function boardFirstContactLine(inv: string): string {
  return `not yet provisioned — run \`${inv} sync\` to set it up`;
}

/** The hook-reinstall prompt (U6-inherited): the installed hook predates `session-start`. */
export function hookUpdateNote(inv: string): string {
  return `the installed SessionStart hook predates \`session-start\` — re-run \`${inv} hook install\` to pick up the board-aware hook`;
}

/**
 * The actor phrase, built from the ACTUAL actors of the visible rows (cursor-honesty adjudication:
 * never assume one teammate) — unique, first-appearance order: "mike", "mike and sara",
 * "mike, sara and jo".
 */
export function actorPhrase(rows: Array<Pick<AwarenessDeltaRow, "actor">>): string {
  const actors: string[] = [];
  for (const r of rows) if (!actors.includes(r.actor)) actors.push(r.actor);
  if (actors.length <= 1) return actors[0] ?? "";
  return `${actors.slice(0, -1).join(", ")} and ${actors[actors.length - 1]}`;
}

/** "3 board changes from mike" — the machine-honest since-line's value (label = the field key). */
export function sinceLine(rows: Array<Pick<AwarenessDeltaRow, "actor">>): string {
  const n = rows.length;
  return `${n} board ${n === 1 ? "change" : "changes"} from ${actorPhrase(rows)}`;
}

/** One per-doc human line: `mike · updated Task "Seed one"` (kind omitted when unknown). */
export function docLine(row: Pick<AwarenessDeltaRow, "actor" | "verb" | "kind" | "title">): string {
  const kindPart = row.kind && row.kind !== "unknown" ? `${row.kind} ` : "";
  return `${row.actor} · ${row.verb} ${kindPart}"${row.title}"`;
}

/** "2 local board commits not yet pushed — run sync when online" (pack (e), never "1 commits"). */
export function unpushedLine(n: number): string {
  return `${n} local board ${n === 1 ? "commit" : "commits"} not yet pushed — run sync when online`;
}

/** The backstop's other half: uncommitted board changes (the agent that never ran sync at all). */
export function uncommittedLine(n: number): string {
  return `${n} uncommitted board ${n === 1 ? "change" : "changes"} — run sync to share ${n === 1 ? "it" : "them"}`;
}

/** `n` when it parses as a live count; the cache's persisted count otherwise (last-known fallback). */
function countOr(live: number | null, cached: number | undefined): number {
  return live ?? cached ?? 0;
}

/**
 * PURE: fold the board status + the (optional) in-process pull outcome into the rendered block.
 * Returns `block` (a string — the pinned "up to date" — or the record of moment-(e) lines) for a
 * provisioned board, or `firstContact` (the "run sync, never init" line) for a detected-but-
 * unprovisioned one. Self-authored rows (actor ∈ selfActors) are filtered from the human count;
 * `as_of` labels a render that did NOT just complete a successful pull (plain home, or an offline
 * session-start) so a stale cache never reads as current.
 */
export function buildBoardBlock(
  status: BoardStatus | null,
  pull: BoardPullOutcome | undefined,
  inv: string,
): { block?: string | Record<string, unknown>; firstContact?: string } {
  if (!status) return {};
  if (status.state === "unprovisioned") return { firstContact: boardFirstContactLine(inv) };

  const rec: Record<string, unknown> = {};
  if (pull?.announcement) Object.assign(rec, pull.announcement);
  const rows = status.cache?.delta ?? [];
  const visible = rows.filter((r) => !status.selfActors.includes(r.actor));
  if (visible.length > 0) {
    // CURSOR HONESTY (decided trade-off, plan §U4): labeled by MACHINE reality — the cursor is
    // per-clone state, not a cross-machine per-person one (that defers to the hosted tier).
    rec.since_this_machine_last_synced = sinceLine(visible);
    rec.changes = visible.slice(0, BOARD_CHANGES_SHOWN_LIMIT).map(docLine);
  }
  const unpushed = countOr(status.unpushed, status.cache?.unpushedCount);
  const uncommitted = countOr(status.uncommitted, status.cache?.uncommittedCount);
  if (unpushed > 0) rec.unpushed = unpushedLine(unpushed);
  if (uncommitted > 0) rec.uncommitted = uncommittedLine(uncommitted);
  const notes: string[] = [];
  if (pull?.offline) notes.push(BOARD_OFFLINE_NOTE);
  if (pull?.notes) notes.push(...pull.notes);
  if (status.cache?.note) notes.push(status.cache.note);
  if (notes.length > 0) rec.note = notes.join("; ");
  // Freshness labeling: only a render straight after a SUCCESSFUL pull may skip it.
  if (status.cache && (!pull || pull.offline) && Object.keys(rec).length > 0) {
    rec.as_of = status.cache.updatedAt;
  }
  if (Object.keys(rec).length === 0) return { block: BOARD_UP_TO_DATE };
  return { block: rec };
}

/**
 * The default board-status probe: LOCAL git plumbing only (never a fetch — the OFFLINE GUARANTEE
 * holds; see the module header). Unprovisioned first-contact detection is PROBE-GATED on the
 * board ref's existence (`origin/board` — present in any full clone's local refs — or a local
 * `board` branch), NEVER marker-only: under per-clone state keying a brand-new clone has no
 * marker until its first pull (sync-cache-per-clone rider), and the marker's key derivation needs
 * the same git calls anyway, so the ref probe is strictly stronger AND equally offline. Every
 * failure mode (no git binary, not a repo, unreadable state file) degrades to `null` — no board
 * block, never a failed session.
 */
export async function defaultLoadBoardStatus(dir?: string): Promise<BoardStatus | null> {
  try {
    // Retarget when sitting INSIDE the board worktree (exactly where an agent lands after
    // `doc write --dir .agentstate-lite`) — otherwise the worktree reads as its OWN repo top,
    // `<board>/.agentstate-lite` doesn't exist, and the shared refs would misreport the live
    // board as "unprovisioned" (sync round-2 finding 2's shape, reused via its exported fix).
    const top = repoTopLevel(retargetBoardInterior(dir ?? process.cwd()));
    if (!top) return null;
    const boardPath = path.join(top, BUNDLE_DIR);
    if (!isProvisioned(top)) {
      const probed =
        runGit(top, ["rev-parse", "--verify", "--quiet", `refs/remotes/${BOARD_REF}`]).status === 0 ||
        runGit(top, ["rev-parse", "--verify", "--quiet", `refs/heads/${BOARD_BRANCH}`]).status === 0;
      return probed ? { state: "unprovisioned" } : null;
    }
    const key = resolveBundleKey(boardPath);
    const state = await readSyncState(key);
    let uncommitted: number | null;
    try {
      uncommitted = countUncommitted(boardPath);
    } catch {
      uncommitted = null;
    }
    return {
      state: "provisioned",
      cache: state.cache,
      selfActors: state.selfActors ?? [],
      unpushed: unpushedCount(boardPath),
      uncommitted,
    };
  } catch {
    return null;
  }
}

/**
 * Build the home view object (PURE — no I/O). Insertion order is the rendered TOON field order:
 * identity header FIRST (AXI §10 — identify the tool before live data; a one-line identity header
 * is not "the manual"), then auth status, then the LIVE `bundle` dashboard (when present — AXI
 * §8, content above the manual), then the command reference (the manual, now demoted below live
 * content), then the static kind/remote-env pointers. When no bundle is discoverable, `bundle` is
 * omitted and a `getting_started` hint (pointing at `init`) is inserted just before `commands`.
 *
 * `binding` (when the caller's own project-binding peek resolved one — see the module header)
 * annotates whichever block it drove with a `via` field naming the `.agentstate.json` file, WITHOUT
 * changing that block's shape otherwise. `bindingError` (a malformed binding file — never a thrown
 * exception, since home must never crash) renders as a standalone `project_binding_error` note.
 */
export function buildHomeView(
  creds: Credentials | null,
  deps: { binPath: () => string; invocation: () => string },
  summary?: BundleSummary | UnreadableBundle | null,
  remote?: string,
  remoteKeyStored?: boolean,
  binding?: HomeBindingNote,
  bindingError?: string,
  board?: { block?: string | Record<string, unknown>; firstContact?: string },
  hookUpdate?: string,
): Record<string, unknown> {
  const inv = deps.invocation();
  // Auth status is purely "is a per-origin API key stored for this --remote?" (`remoteKeyStored`,
  // derived from `creds` in the caller). home is OFFLINE (never fetches), so when a key IS stored it
  // reports `key-stored` and points at `whoami --remote` for the LIVE identity; otherwise
  // `logged-out` with join guidance. (`creds` is also read below for the un-scoped `remotes.stored`
  // discovery block.)
  let auth: Record<string, unknown>;
  if (remote && remoteKeyStored) {
    // The REAL wire-protocol auth: a per-origin API key is stored for this --remote. home is
    // OFFLINE, so verify live via whoami.
    auth = {
      status: "key-stored",
      note: `an API key for this remote is stored locally; this home view is OFFLINE — run \`${inv} whoami --remote ${remote}\` to verify the live identity`,
    };
  } else {
    auth = {
      status: "logged-out",
      help: `not logged in to any remote — local bundles need no login; for a shared remote, get its URL + an invite from a teammate → \`${inv} join --remote <url> --invite <token>\``,
    };
  }
  const ref = commandReference(inv);

  const view: Record<string, unknown> = {
    "agentstate-lite": { bin: deps.binPath(), description: DESCRIPTION },
    auth,
  };

  if (remote) {
    // Scoped to a remote bundle: an OFFLINE orientation pointer (home never fetches — it is the
    // every-session hook payload and must stay cheap). No local bundle block, no `init` nudge; point
    // the agent at the commands that DO read the remote. Resolves the #6 gap where the canonical
    // `agentstate-lite --remote <url>` invocation errored instead of orienting.
    const remoteBlock: Record<string, unknown> = {
      url: remote,
      help: [
        `${inv} whoami --remote ${remote}`,
        `${inv} list --remote ${remote}`,
        `${inv} status --remote ${remote}`,
      ],
    };
    if (binding && binding.target === remote) remoteBlock.via = binding.file;
    view.remote = remoteBlock;
  } else if (summary && "unreadable" in summary) {
    // A bundle EXISTS here but could not be read (a malformed doc) — NOT "no bundle". Never emit the
    // `getting_started`/`init` hint (that would tell an agent to init over an existing bundle);
    // point at `list`, which will surface the actual parse error.
    const bundleBlock: Record<string, unknown> = {
      root: summary.root,
      status: "unreadable",
      help: `a document in this bundle could not be read — run \`${deps.invocation()} list\` to surface the parse error`,
    };
    // `remote` is guaranteed falsy in this branch (the `if (remote)` branch above already returned),
    // so a present `binding` here can only be the directory-type half — see the module header.
    if (binding) bundleBlock.via = binding.file;
    view.bundle = bundleBlock;
  } else if (summary) {
    const bundleBlock: Record<string, unknown> = {
      root: summary.root,
      docs: summary.docs,
      by_type: summary.byType,
    };
    if (summary.docs > 0) {
      bundleBlock.recent = summary.recent;
      bundleBlock.next = [
        `${deps.invocation()} list`,
        `${deps.invocation()} status`,
        `${deps.invocation()} view`,
      ];
    } else {
      // Definitive empty state (AXI §5), distinct from "no bundle at all": the bundle exists but
      // has no docs yet.
      bundleBlock.help = `${deps.invocation()} new "Context Note" <id> … | ${deps.invocation()} doc write … — create the first doc`;
    }
    if (binding) bundleBlock.via = binding.file;
    view.bundle = bundleBlock;
  } else if (!board?.firstContact && board?.block === undefined) {
    // A live board block (or the first-contact line) supersedes the init hint entirely: a project
    // with a provisioned/detected board HAS its bundle — "run init" there is the divergent-
    // second-bundle footgun.
    view.getting_started = `no OKF bundle found in this directory — run \`${deps.invocation()} init\` to create one`;
    if (binding) {
      // A URL-type binding always routes into the `if (remote)` branch above instead (home's own
      // pre-check sets `remote`, never reaching here) — so a `binding` present at THIS point is
      // always the directory-type half, resolved to a location with no bundle. Say so rather than
      // leaving the `init` hint looking like there was never a binding at all.
      view.getting_started += ` (project binding ${binding.file} -> ${binding.target} did not resolve to a bundle)`;
    }
  }
  // The board block (sync-verb §U4). FIRST-CONTACT footgun guard: when a board exists for this
  // repo but isn't provisioned, the line above the fold is "run sync" — and the `init` hint is
  // SUPPRESSED entirely (the else-if above), so a founder can never be told to init a divergent
  // second bundle by our own hint.
  if (board?.firstContact) {
    view.board = board.firstContact;
  } else if (board?.block !== undefined) {
    view.board = board.block;
  }
  if (hookUpdate) {
    // U6-inherited re-install prompt: self-clearing (disappears once `hook install` is re-run).
    view.hook_update = hookUpdate;
  }
  if (bindingError) {
    // A malformed .agentstate.json — never a thrown exception (home must never crash the
    // SessionStart hook), surfaced instead as a visible, non-fatal note.
    view.project_binding_error = bindingError;
  }

  // When NOT scoped to a specific --remote, surface the remotes you already hold a stored key for, so
  // a cold agent handed no URL can DISCOVER a reachable shared workspace from this first-contact view
  // (cold-start study r3: `whoami` listed them but the home view did not, so discovery was luck).
  if (!remote) {
    const storedRemotes = creds?.remotes ? Object.keys(creds.remotes).sort() : [];
    if (storedRemotes.length > 0) {
      view.remotes = {
        stored: storedRemotes,
        help: `you hold a key for these remote workspace(s) — reach one with \`${inv} list --remote <origin>\` (or \`${inv} whoami --remote <origin>\`)`,
      };
    }
  }
  // Compact command list (names per group + a `--help` pointer) — the home view is the SessionStart
  // hook payload, so it stays token-lean; the FULL usage/summary reference is the `--help` view.
  const compact = compactCommandReference(inv);
  view.commands = compact.commands;
  view.commands_help = compact.commands_help;
  view.kinds = ref.kinds;
  view.remote_env = ref.remoteEnv;
  return view;
}

/**
 * CLI entry for the zero-arg home view. Reads creds (file only) and the live bundle summary (LOCAL
 * only, double-guarded), builds the view, writes TOON. Exits 0 in EVERY case — auth state, bundle
 * present/absent/unreadable — never throws, so a SessionStart hook can never fail a session.
 */
export async function home(argv: string[], deps: Partial<HomeDeps> = {}): Promise<void> {
  const loadCreds = deps.loadCreds ?? loadCredentials;
  const stdout = deps.stdout ?? ((s: string) => void process.stdout.write(s));

  // Parse the home-compatible global flags. Best-effort — an unknown/bad flag just yields the bare
  // local view (home NEVER throws). `--remote <url>` scopes the view to a remote (offline: a pointer
  // + next-steps, NOT a fetch — the every-session hook payload must stay cheap); `--dir <path>`
  // summarizes THAT directory's bundle instead of the CWD.
  let remote: string | undefined;
  let dir: string | undefined;
  let jsonMode = false;
  try {
    const parsed = parseArgs({
      args: argv,
      options: {
        remote: { type: "string" },
        dir: { type: "string" },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" },
      },
      allowPositionals: true,
    });
    remote = parsed.values.remote;
    dir = parsed.values.dir;
    jsonMode = Boolean(parsed.values.json);
  } catch {
    /* ignore — fall back to the bare local view */
  }

  // A committed project binding (see the module header's PROJECT-BINDING PEEK) is consulted ONLY
  // when the caller passed NEITHER --remote NOR --dir themselves — the same suppression rule every
  // other rung already follows. Fs-only; never a fetch, preserving the OFFLINE GUARANTEE regardless
  // of what the binding names. A URL-type binding scopes the view exactly like an explicit --remote
  // flag would (still offline — see the `if (remote)` branch in buildHomeView); a directory-type
  // binding scopes the local summarize() call instead. A malformed file must never crash the
  // SessionStart hook, so it is caught here and surfaced as a visible `bindingError` note instead.
  let binding: HomeBindingNote | undefined;
  let bindingError: string | undefined;
  if (!remote && !dir) {
    try {
      const found = await resolveProjectBinding();
      if (found) {
        binding = { file: found.file, target: found.target };
        if (found.isRemote) {
          remote = found.target;
        } else {
          dir = found.target;
        }
      }
    } catch (err) {
      bindingError = err instanceof Error ? err.message : String(err);
    }
  }

  const summarize = deps.summarizeBundle ?? (() => defaultSummarizeBundle(dir));

  let creds: Credentials | null = null;
  try {
    creds = await loadCreds();
  } catch {
    creds = null; // belt + suspenders: an injected/real creds read must never fail the session either
  }

  // OFFLINE check (no fetch, no extra I/O — reads the already-loaded creds): is a per-origin API
  // key stored for the --remote origin? Lets the auth block report "key-stored" instead of the old
  // misleading "logged-out" when the key is present and valid (cold-start study #2).
  let remoteKeyStored = false;
  if (remote) {
    try {
      remoteKeyStored = Boolean(creds?.remotes?.[normalizeServer(remote).resource]);
    } catch {
      /* malformed --remote URL — leave false; the remote block still orients */
    }
  }

  // A --remote scope does NOT summarize (offline guarantee — the remote block orients toward the
  // fetching commands instead). Local / `--dir` scopes read the bundle as before.
  let summary: BundleSummary | UnreadableBundle | null = null;
  if (!remote) {
    try {
      summary = await summarize();
    } catch {
      summary = null; // an injected/misbehaving summarizer throwing -> offline fallback (the default one never throws)
    }
  }

  const invocation = deps.invocation ?? cliInvocation;

  // The board block (sync-verb §U4) — skipped for a --remote scope (the board is a git-tier LOCAL
  // concept). Double-guarded like everything else here: a throwing probe yields no board block.
  let board: { block?: string | Record<string, unknown>; firstContact?: string } | undefined;
  if (!remote) {
    try {
      const status = await (deps.loadBoardStatus ?? defaultLoadBoardStatus)(dir);
      board = buildBoardBlock(status, deps.boardPull, invocation());
    } catch {
      board = undefined;
    }
  }

  // U6-inherited hook re-install prompt (fs-only reads; guarded — never fails the session).
  let hookUpdate: string | undefined;
  try {
    if ((deps.hookNeedsUpdate ?? hookNeedsUpdate)()) hookUpdate = hookUpdateNote(invocation());
  } catch {
    hookUpdate = undefined;
  }

  stdout(
    render(
      buildHomeView(
        creds,
        {
          binPath: deps.binPath ?? binPath,
          invocation,
        },
        summary,
        remote,
        remoteKeyStored,
        binding,
        bindingError,
        board,
        hookUpdate,
      ),
      // Honor --json (JSON is equally offline/never-throw); default remains TOON, the format the
      // SessionStart hook ingests as ambient context.
      jsonMode ? "json" : "default",
    ),
  );
}
