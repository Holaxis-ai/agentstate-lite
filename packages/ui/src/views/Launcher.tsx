/**
 * Launcher (tasks/ui-pages-spike): the ui command's SOLE landing surface. Shows the bundle summary
 * plus every `type: Page` registry doc as a card (title, description, entry key, and provenance —
 * actor + timestamp). Clicking a page card routes to `?view=page&id=<registry doc id>`, which mounts
 * a sandboxed {@link PageFrame}. (The old paused React board/doc/admin/graph views were removed.)
 *
 * Live: a doc change over SSE may add/remove/retitle a Page doc, so the page list refetches on any
 * doc change — the launcher reflects a freshly-promoted page without a manual reload.
 */
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchConfig, listPages, type PageEntry } from "../api/pages.js";
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
      if (e.docs.changed.length > 0 || e.docs.removed.length > 0) {
        void queryClient.invalidateQueries({ queryKey: ["pages"] });
      }
    });
  }, [queryClient]);

  // A reconnected SSE stream replays nothing — refetch the list so a page promoted/removed during
  // the gap shows up (tasks/ui-pages-spike P1, connection resilience).
  useEffect(() => {
    return subscribeToResync(() => {
      void queryClient.invalidateQueries({ queryKey: ["pages"] });
    });
  }, [queryClient]);

  const config = configQuery.data;
  const pages = pagesQuery.data ?? [];

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

      <section className="launcher-grid">
        {pages.map((page) => (
          <PageCard key={page.id} page={page} />
        ))}
      </section>

      {pagesQuery.isPending && <p className="view-status">Loading pages…</p>}
      {pagesQuery.isError && (
        <p className="view-status view-status-error">Could not load pages: {(pagesQuery.error as Error).message}</p>
      )}
      {!pagesQuery.isPending && !pagesQuery.isError && pages.length === 0 && (
        <p className="launcher-empty">
          No <code>type: Page</code> docs in this bundle yet. Promote an HTML page under <code>pages/</code> and declare a{" "}
          <code>Page</code> registry doc — see <code>examples/pages/</code>.
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
        {page.actor && <span>{page.actor}</span>}
        {when && <span>{when}</span>}
      </p>
    </button>
  );
}
