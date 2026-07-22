/**
 * The home surface (designs/home-surface; historically "the launcher", tasks/ui-pages-spike —
 * the working name is provisional pending test users, see the design's Naming section). The `ui`
 * command's SOLE landing surface: bundle identity, a first-run orientation, ONE flat
 * recency-sorted grid of every `type: View` (or legacy `type: Page`) registry doc, and the live
 * activity feed ({@link ActivityFeed}).
 *
 * The grid is FLAT by design: the former Dashboards/Interactive/Documents sections grouped by the
 * enforced `bridge` capability, which projected the security model into the information
 * architecture (and "Documents" collided with the product's core doc noun). Capability is now a
 * BADGE on each card — `live data` / `can edit` / `artifact` — still derived from the SAME
 * enforced field the bridge broker reads (`../pages/bridge.js`'s `resolveBridgeCapability`), so
 * the card can never claim a page is one thing while the bridge treats it as another; it is just
 * no longer the organizing principle.
 *
 * First-run orientation: shown until dismissed, tracked in localStorage keyed by the bundle root
 * (accepted caveat: a stable-port fallback to an ephemeral port changes the origin, which may
 * resurface it once). Copy rules (designs/home-surface): the privacy promise is worded to cover
 * the in-tree mode, and the try-it hook carries a no-agent-yet fallback.
 *
 * Live: a doc change over SSE may add/remove/retitle a View doc, so the grid refetches on any
 * doc change — a freshly-promoted view shows up without a manual reload.
 */
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConfig, listPages, invalidateKinds, type PageEntry, type SharingSummary, type WorkspaceSummaryEntry } from "../api/pages.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import type { BridgeCapability } from "../pages/registry.js";
import { navigate } from "../routing.js";
import { ActivityFeed } from "./ActivityFeed.js";
import { DocumentBrowser } from "./DocumentBrowser.js";
import { formatWhen } from "./format.js";

/** Capability badge per enforced `bridge` value — role-based wording (the design's content model). */
export const BRIDGE_BADGES: Record<BridgeCapability, { label: string; className: string }> = {
  "bundle-read": { label: "live data", className: "badge badge-read" },
  "bundle-propose": { label: "can edit", className: "badge badge-propose" },
  none: { label: "artifact", className: "badge badge-artifact" },
};

/**
 * The trust chip's WORDS — the SPA owns wording over ui-server's state vocabulary
 * (designs/home-surface truth table; every row pinned by Launcher.test.tsx). Rules: never
 * fabricate in either direction; `unavailable` is honest refusal, never a guessed "private";
 * `unscoped` (a non-conventional --dir bundle) makes NO claim at all (null — no chip).
 */
export function sharingChip(sharing: SharingSummary | null): { text: string; className: string; title?: string } | null {
  if (sharing === null) return null;
  switch (sharing.kind) {
    case "private":
      return { text: "private — this computer only", className: "chip chip-private" };
    case "private_local_branch":
      return { text: "private — local board branch, not yet shared", className: "chip chip-private" };
    case "private_intree_no_remote":
      return { text: "private — committed with code, no remote", className: "chip chip-private" };
    case "private_intree_not_pushed":
      return { text: "private — committed with code, not yet pushed", className: "chip chip-private" };
    case "shared_branch":
      return { text: `shared · ${sharing.remote ?? "remote"}`, className: "chip chip-shared" };
    case "shared_intree":
      return { text: `shared with the code · ${sharing.remote ?? "remote"}`, className: "chip chip-shared" };
    case "hosted":
      return { text: `hosted · ${sharing.remote ?? "remote"}`, className: "chip chip-shared" };
    case "unavailable":
      return { text: "sharing status unavailable", className: "chip chip-unavailable", title: sharing.reason };
    case "unscoped":
      return null;
    default:
      // An unknown future kind must not fabricate a claim — same posture as unavailable.
      return { text: "sharing status unavailable", className: "chip chip-unavailable" };
  }
}

/** The "where is this?" panel's sharing detail sentence (fuller than the chip; same truth rules). */
function sharingDetail(sharing: SharingSummary | null): string {
  if (sharing === null) return "no sharing information for this bundle";
  switch (sharing.kind) {
    case "private":
      return "not shared — stays here until you run aslite sync --establish, or commit it with your code";
    case "private_local_branch":
      return "a local board branch exists but has never been pushed — aslite sync shares it";
    case "private_intree_no_remote":
      return "committed with the code, but this repo has no remote — pushing the repo shares it";
    case "private_intree_not_pushed":
      return "committed with the code, but no upstream evidence it has been shared — your next git push shares it";
    case "shared_branch":
      return `git — ${sharing.remote ?? "the repo's remote"}, on a dedicated board branch beside the code`;
    case "shared_intree":
      return `git — committed with the code and present on ${sharing.remote ?? "the tracking remote"} (as of the last fetch)`;
    case "hosted":
      return `served by ${sharing.remote ?? "a remote server"} — sharing is that server's policy`;
    case "unavailable":
      return `could not determine sharing state${sharing.reason ? ` — ${sharing.reason}` : ""}`;
    case "unscoped":
      return "no sharing claim — this folder is not the repo's conventional board";
    default:
      // Unknown future kind: refuse honestly, mirroring the chip (review F-3).
      return "sharing status unavailable";
  }
}

/** localStorage key for the first-run orientation's dismissal, scoped per bundle root. */
export function orientationStorageKey(root: string): string {
  return `aslite-home-orientation:${root}`;
}

function readOrientationDismissed(root: string): boolean {
  try {
    return window.localStorage.getItem(orientationStorageKey(root)) === "dismissed";
  } catch {
    // Storage unavailable (privacy mode) — don't re-orient on every render forever.
    return true;
  }
}

export function Launcher() {
  const queryClient = useQueryClient();
  const configQuery = useQuery({ queryKey: ["ui-config"], queryFn: fetchConfig, refetchInterval: false });
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: listPages });
  const [orientationDismissed, setOrientationDismissed] = useState<boolean | null>(null);
  const [whereOpen, setWhereOpen] = useState(false);
  const [viewsHelpOpen, setViewsHelpOpen] = useState(false);
  const [orientationHelpOpen, setOrientationHelpOpen] = useState(false);

  useEffect(() => {
    return subscribeToChanges((e) => {
      invalidateKinds([...e.docs.changed.map((c) => c.id), ...e.docs.removed]);
      if (e.docs.changed.length > 0 || e.docs.removed.length > 0) {
        void queryClient.invalidateQueries({ queryKey: ["pages"] });
        // Board doc changes are how a mid-session `sync` manifests — refetch the config so the
        // sharing chip cannot freeze for a days-long server run (design-review F4; the server's
        // TTL caps the cost of these invalidations).
        void queryClient.invalidateQueries({ queryKey: ["ui-config"] });
      }
    });
  }, [queryClient]);

  // A reconnected SSE stream replays nothing — refetch the list so a page promoted/removed during
  // the gap shows up (tasks/ui-pages-spike P1, connection resilience). Config included: the chip's
  // truth may have moved during the gap.
  useEffect(() => {
    return subscribeToResync(() => {
      invalidateKinds();
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
      void queryClient.invalidateQueries({ queryKey: ["ui-config"] });
    });
  }, [queryClient]);

  const config = configQuery.data;

  // Orientation is keyed on `config.root` — DELIBERATELY absent in `--remote` mode (root is null
  // there): the orientation's privacy promise describes a LOCAL bundle and would be wrong for a
  // hosted origin (review follow-up #3 — a decision, not an accident).
  useEffect(() => {
    if (config?.root == null) return;
    setOrientationDismissed(readOrientationDismissed(config.root));
  }, [config?.root]);

  const pages = pagesQuery.data ?? [];
  const showOrientation = config !== undefined && orientationDismissed === false;

  const dismissOrientation = () => {
    if (config?.root != null) {
      try {
        window.localStorage.setItem(orientationStorageKey(config.root), "dismissed");
      } catch {
        // best-effort persistence; the dismissal still holds for this session
      }
    }
    setOrientationDismissed(true);
  };

  const chip = config ? sharingChip(config.sharing ?? null) : null;

  return (
    <div className="launcher">
      <section className="launcher-summary">
        <h2>{config?.name ?? "bundle"}</h2>
        <p className="launcher-meta">
          {config ? (
            <>
              <span className="pill">{config.mode}</span>
              {chip && (
                <span className={chip.className} title={chip.title ?? (config.sharing ? `as of ${formatWhen(config.sharing.as_of) ?? config.sharing.as_of}` : undefined)}>
                  {chip.text}
                </span>
              )}
              <button type="button" className="where-btn" aria-expanded={whereOpen} onClick={() => setWhereOpen((v) => !v)}>
                {whereOpen ? "hide details" : "where is this?"}
              </button>
            </>
          ) : (
            "Loading bundle…"
          )}
        </p>
        {config && whereOpen && (
          <dl className="where-panel">
            <div>
              <dt>{config.mode === "remote" ? "Server" : "Folder"}</dt>
              <dd>
                <code>{config.root ?? config.remoteUrl ?? "unknown"}</code>
              </dd>
            </div>
            <div>
              <dt>Serving</dt>
              <dd>
                {config.mode === "remote"
                  ? "reverse proxy to the server above — this window only (127.0.0.1)"
                  : "local folder · this computer only (127.0.0.1, per-run session)"}
              </dd>
            </div>
            <div>
              <dt>Sharing</dt>
              <dd>{sharingDetail(config.sharing)}</dd>
            </div>
            {config.sharing && (
              <div>
                <dt>As of</dt>
                <dd>{formatWhen(config.sharing.as_of) ?? config.sharing.as_of}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      <div className="home-columns">
        <div className="home-main">
          {showOrientation && (
            <section className="orientation">
              <h2>This is your ASLite bundle’s home</h2>
              <p>
                A bundle is a folder of plain markdown documents shared with your agents: notes, decisions, tasks, and
                the links between them. Each document follows a shared structure which, together with the ASLite CLI
                and skill, lets agents write, track, and retrieve them as work happens.{" "}
                <button
                  type="button"
                  className="where-btn"
                  aria-expanded={orientationHelpOpen}
                  onClick={() => setOrientationHelpOpen((v) => !v)}
                >
                  {orientationHelpOpen ? "hide details" : "learn more"}
                </button>
              </p>
              {orientationHelpOpen && (
                <div className="orientation-details">
                  <p>
                    That shared structure is an open standard called OKF — the Open Knowledge Format. In practice it
                    means each file is ordinary markdown with a short header naming what the document is and what it is
                    called, and ordinary markdown links between files.
                  </p>
                  <p>
                    Nothing about it is proprietary or locked to this tool: any editor that opens markdown can read
                    your bundle, and aslite can read a bundle some other program wrote.
                  </p>
                </div>
              )}
              <p>
                It stays private until you choose to share it — by establishing a shared board (
                <code>aslite sync --establish</code>) or committing the folder with your code.
              </p>
              <p>
                <strong>Try it:</strong> ask your agent to write something down — a decision you just made, or how some
                corner of this project works — and watch it land in the activity feed.
              </p>
              <p>
                Agent doesn’t know about this bundle yet? From your project’s root folder,{" "}
                <code>aslite skill install</code> teaches it the commands, and <code>aslite hook install</code> starts
                each new session with this bundle’s state already in view. (Both write into the folder you run them
                from, so run them where your project lives — or add <code>--scope global</code> to set them up for
                every project at once.)
              </p>
              <button type="button" className="orientation-dismiss" onClick={dismissOrientation}>
                Got it
              </button>
            </section>
          )}

          <section className="launcher-section">
            <h3>Views</h3>
            {pages.length > 0 && (
              <div className="launcher-grid">
                {pages.map((page) => (
                  <PageCard key={page.id} page={page} />
                ))}
              </div>
            )}
            {pagesQuery.isPending && <p className="view-status">Loading views…</p>}
            {pagesQuery.isError && (
              <p className="view-status view-status-error">Could not load views: {(pagesQuery.error as Error).message}</p>
            )}
            {!pagesQuery.isPending && !pagesQuery.isError && pages.length === 0 && (
              <div className="launcher-empty">
                <p>
                  You don’t have any views yet. A view is an interactive HTML file that displays information captured in
                  the bundle in whatever way is valuable to you. Examples include a board of open tasks, a map of how
                  your notes link to each other, a navigable folder hierarchy, or a list of the decisions made this
                  week. Views dynamically update as content changes.
                </p>
                <p>
                  With the aslite skill, you can create views by asking your agent to create one using plain language:
                  Ex: <em>“create a view showing every open task, grouped by who it’s assigned to.”</em> When it creates
                  a view, a card or tile summarizing the view will appear on this page, along with a link to it.
                </p>
                <p>
                  <button
                    type="button"
                    className="where-btn"
                    aria-expanded={viewsHelpOpen}
                    onClick={() => setViewsHelpOpen((v) => !v)}
                  >
                    {viewsHelpOpen ? "hide details" : "learn more"}
                  </button>
                </p>
                {viewsHelpOpen && (
                  <div className="launcher-empty-details">
                    <p>
                      A view is an HTML file stored in this bundle under <code>views/</code>, registered by a{" "}
                      <code>type: View</code> document that gives it a title, points at the file, and declares how much
                      of the bundle it may see. Every view runs in a sandboxed frame with no network access, and that
                      declaration is what the badge on its card reports:
                    </p>
                    <ul>
                      <li>
                        <strong>live data</strong> — reads documents through a narrow, read-only channel, so it redraws
                        itself as they change.
                      </li>
                      <li>
                        <strong>can edit</strong> — the same reads, plus it may propose one field change, which only
                        takes effect when you confirm it.
                      </li>
                      <li>
                        <strong>artifact</strong> — self-contained HTML; the shell refuses it bundle data entirely.
                      </li>
                    </ul>
                    <p>
                      Worked examples — including the bridge client to copy — ship with the CLI under{" "}
                      <code>examples/views/</code>. (Views used to be called pages; existing{" "}
                      <code>type: Page</code> documents keep working and never need migrating.)
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="launcher-section">
            <h3>Browse</h3>
            <DocumentBrowser />
          </section>
        </div>

        <aside className="home-aside">
          <section className="launcher-section">
            <h3>Activity</h3>
            <ActivityFeed />
          </section>
          {config && (config.workspaces?.length ?? 0) > 0 && <WorkspacesBlock entries={config.workspaces} />}
        </aside>
      </div>
    </div>
  );
}

/**
 * The registered-workspaces block (tier 1: SEE, not switch — designs/home-surface). COLLAPSED by
 * default: the demo/screenshot mitigation standing in for the deferred catalog privacy flag. Each
 * row expands to its path + copy-paste open command; no availability probes ride this display.
 */
function WorkspacesBlock({ entries }: { entries: WorkspaceSummaryEntry[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  return (
    <section className="launcher-section">
      <h3>
        <button type="button" className="workspaces-toggle" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          Workspaces ({entries.length}) <span aria-hidden="true">{open ? "−" : "+"}</span>
        </button>
      </h3>
      {open && (
        <ul className="workspace-list">
          {entries.map((entry) => (
            <li key={entry.label} className="workspace">
              <button
                type="button"
                className="workspace-row"
                aria-expanded={!!expanded[entry.label]}
                onClick={() => setExpanded((prev) => ({ ...prev, [entry.label]: !prev[entry.label] }))}
              >
                <span className="workspace-name">{entry.label}</span>
                {entry.open && <span className="workspace-open">open</span>}
                <span className="workspace-caret" aria-hidden="true">
                  {expanded[entry.label] ? "−" : "+"}
                </span>
              </button>
              {expanded[entry.label] && (
                <>
                  <span className="workspace-path">{entry.path}</span>
                  {!entry.open && (
                    <span className="workspace-cmd">
                      open with <code>aslite ui --dir {entry.path}</code>
                    </span>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function PageCard({ page }: { page: PageEntry }) {
  const when = formatWhen(page.timestamp);
  const badge = BRIDGE_BADGES[page.bridge];
  return (
    <button type="button" className="launcher-card" data-page-id={page.id} onClick={() => navigate({ view: "page", id: page.id })}>
      <h3>{page.title}</h3>
      {page.description && <p className="launcher-card-desc">{page.description}</p>}
      <p className="launcher-card-provenance">
        <span className={badge.className}>{badge.label}</span>
        {page.actor && <span className="launcher-card-actor">{page.actor}</span>}
        {when && <span className="launcher-card-when">{when}</span>}
      </p>
    </button>
  );
}
