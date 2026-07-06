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
  } else {
    view.getting_started = `no OKF bundle found in this directory — run \`${deps.invocation()} init\` to create one`;
    if (binding) {
      // A URL-type binding always routes into the `if (remote)` branch above instead (home's own
      // pre-check sets `remote`, never reaching here) — so a `binding` present at THIS point is
      // always the directory-type half, resolved to a location with no bundle. Say so rather than
      // leaving the `init` hint looking like there was never a binding at all.
      view.getting_started += ` (project binding ${binding.file} -> ${binding.target} did not resolve to a bundle)`;
    }
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

  stdout(
    render(
      buildHomeView(
        creds,
        {
          binPath: deps.binPath ?? binPath,
          invocation: deps.invocation ?? cliInvocation,
        },
        summary,
        remote,
        remoteKeyStored,
        binding,
        bindingError,
      ),
      // Honor --json (JSON is equally offline/never-throw); default remains TOON, the format the
      // SessionStart hook ingests as ambient context.
      jsonMode ? "json" : "default",
    ),
  );
}
