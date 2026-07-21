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
import { fetchConfig, listPages, invalidateKinds, type PageEntry } from "../api/pages.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import type { BridgeCapability } from "../pages/registry.js";
import { navigate } from "../routing.js";
import { ActivityFeed } from "./ActivityFeed.js";
import { formatWhen } from "./format.js";

/** Capability badge per enforced `bridge` value — role-based wording (the design's content model). */
const BRIDGE_BADGES: Record<BridgeCapability, { label: string; className: string }> = {
  "bundle-read": { label: "live data", className: "badge badge-read" },
  "bundle-propose": { label: "can edit", className: "badge badge-propose" },
  none: { label: "artifact", className: "badge badge-artifact" },
};

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

  useEffect(() => {
    return subscribeToChanges((e) => {
      invalidateKinds([...e.docs.changed.map((c) => c.id), ...e.docs.removed]);
      if (e.docs.changed.length > 0 || e.docs.removed.length > 0) {
        void queryClient.invalidateQueries({ queryKey: ["pages"] });
      }
    });
  }, [queryClient]);

  // A reconnected SSE stream replays nothing — refetch the list so a page promoted/removed during
  // the gap shows up (tasks/ui-pages-spike P1, connection resilience).
  useEffect(() => {
    return subscribeToResync(() => {
      invalidateKinds();
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
    });
  }, [queryClient]);

  const config = configQuery.data;

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

  return (
    <div className="launcher">
      <section className="launcher-summary">
        <h2>{config?.name ?? "bundle"}</h2>
        <p className="launcher-meta">
          {config ? (
            <>
              <span className="pill">{config.mode}</span>
              {config.root && <code className="launcher-root">{config.root}</code>}
            </>
          ) : (
            "Loading bundle…"
          )}
        </p>
      </section>

      <div className="home-columns">
        <div className="home-main">
          {showOrientation && (
            <section className="orientation">
              <h2>This is your bundle’s home</h2>
              <p>
                A bundle is a folder of plain markdown you share with your agents — notes, decisions, tasks, and the
                links between them. Agents write it from the terminal; you watch and steer from here.
              </p>
              <p>
                It stays private until you choose to share it — by establishing a shared board (
                <code>aslite sync --establish</code>) or committing the folder with your code.
              </p>
              <p>
                <strong>Try it:</strong> ask your agent to remember something, and watch it land in the activity feed.
                (No agent set up yet? <code>npx -y aslite new "Context Note" hello --title hello</code> works from any
                terminal.)
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
              <p className="launcher-empty">
                No <code>type: View</code> docs in this bundle yet — when your agent (or a teammate) registers one, its
                card appears here, live. To author one: promote an HTML view under <code>views/</code> and declare a{" "}
                <code>View</code> registry doc — see <code>examples/views/</code>. (Legacy <code>type: Page</code> docs
                keep working.)
              </p>
            )}
          </section>
        </div>

        <aside className="home-aside">
          <section className="launcher-section">
            <h3>Activity</h3>
            <ActivityFeed />
          </section>
        </aside>
      </div>
    </div>
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
