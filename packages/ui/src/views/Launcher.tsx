/**
 * Launcher (tasks/ui-pages-spike): the ui command's SOLE landing surface. Shows the bundle summary
 * plus every `type: View` (or legacy `type: Page`) registry doc as a card (title, description,
 * entry key, and provenance — actor + timestamp), grouped by the view's ENFORCED `bridge`
 * capability: "Dashboards"
 * (`bundle-read` — live bundle data) and "Documents" (`none` — arbitrary self-contained HTML,
 * zero bundle access). The grouping is a read of the SAME field the bridge broker enforces
 * (`../pages/bridge.js`'s `resolveBridgeCapability`) — it can never claim a page is one thing while
 * the bridge treats it as another. Clicking a page card routes to `?view=page&id=<registry doc
 * id>`, which mounts a sandboxed {@link PageFrame}. (The old paused React board/doc/admin/graph
 * views were removed.)
 *
 * Live: a doc change over SSE may add/remove/retitle a Page doc, so the page list refetches on any
 * doc change — the launcher reflects a freshly-promoted page without a manual reload.
 */
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConfig, listPages, invalidateKinds, type PageEntry } from "../api/pages.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import { navigate } from "../routing.js";

function formatWhen(timestamp?: string): string | null {
  if (!timestamp) return null;
  const d = new Date(timestamp);
  return Number.isNaN(d.getTime()) ? timestamp : d.toLocaleString();
}

export function Launcher() {
  const queryClient = useQueryClient();
  const configQuery = useQuery({ queryKey: ["ui-config"], queryFn: fetchConfig, refetchInterval: false });
  const pagesQuery = useQuery({ queryKey: ["pages"], queryFn: listPages });

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
  const pages = pagesQuery.data ?? [];
  const dashboards = pages.filter((page) => page.bridge === "bundle-read");
  const documents = pages.filter((page) => page.bridge === "none");

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

      {dashboards.length > 0 && (
        <section className="launcher-section">
          <h3>Dashboards</h3>
          <div className="launcher-grid">
            {dashboards.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        </section>
      )}

      {documents.length > 0 && (
        <section className="launcher-section">
          <h3>Documents</h3>
          <div className="launcher-grid">
            {documents.map((page) => (
              <PageCard key={page.id} page={page} />
            ))}
          </div>
        </section>
      )}

      {pagesQuery.isPending && <p className="view-status">Loading pages…</p>}
      {pagesQuery.isError && (
        <p className="view-status view-status-error">Could not load pages: {(pagesQuery.error as Error).message}</p>
      )}
      {!pagesQuery.isPending && !pagesQuery.isError && pages.length === 0 && (
        <p className="launcher-empty">
          No <code>type: View</code> docs in this bundle yet. Promote an HTML view under <code>views/</code> and declare a{" "}
          <code>View</code> registry doc — see <code>examples/views/</code>. (Legacy <code>type: Page</code> docs keep working.)
        </p>
      )}
    </div>
  );
}

function PageCard({ page }: { page: PageEntry }) {
  const when = formatWhen(page.timestamp);
  return (
    <button type="button" className="launcher-card" data-page-id={page.id} onClick={() => navigate({ view: "page", id: page.id })}>
      <h3>{page.title}</h3>
      {page.description && <p className="launcher-card-desc">{page.description}</p>}
      <p className="launcher-card-entry">
        <code>{page.entry}</code>
      </p>
      <p className="launcher-card-provenance">
        {page.actor && <span className="launcher-card-actor">{page.actor}</span>}
        {when && <span className="launcher-card-when">{when}</span>}
      </p>
    </button>
  );
}
