/**
 * Activity feed (designs/home-surface): the home surface's live pulse — the most recent docs by
 * timestamp, each attributed (actor · kind · title · when). Data is HEAD projections only
 * (`listAllHeads` — frontmatter, never bodies), so a render costs one cheap scan.
 *
 * LIVE SEMANTICS ARE INVALIDATE-AND-REFETCH, not event append: the SSE `ChangeEvent` carries only
 * `{id, version}` (no frontmatter), so a change/removal DEBOUNCES into one refetch of the head
 * list (chatty bundles collapse to one scan); a reconnect (`subscribeToResync`) refetches
 * immediately — the stream carries no replay, so "trust the stream caught you up" is never an
 * option. Rows whose id/version is new since the previous snapshot get a `fresh` marker (a
 * cosmetic land animation; best-effort by set-membership, never claimed as an authoritative verb).
 *
 * FILTERED, so first-run reads as knowledge rather than plumbing: `conventions/` docs (kind
 * declarations) and the View/Page registry docs (the views grid already shows those) stay out of
 * the feed.
 *
 * Beneath the SSE mechanism, the query also inherits the app-wide 5s visible-tab poll
 * (queryClient.ts's default `refetchInterval`) — the same SSE-fallback posture the pages query
 * rides; heads-only and local, so the cost is one cheap scan (review follow-up: stated, chosen).
 */
import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listAllHeads } from "../api/client.js";
import type { DocHead } from "../api/types.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";
import { PAGE_TYPE_NAMES } from "../pages/registry.js";
import { formatWhen } from "./format.js";

/** How many rows the feed shows — recent pulse, not a history browser. */
export const FEED_LIMIT = 8;
/** Collapse a burst of SSE change frames into ONE head-list refetch. */
export const FEED_REFETCH_DEBOUNCE_MS = 300;
/** Id prefixes the feed hides (kind declarations are plumbing, not knowledge). */
const HIDDEN_PREFIXES = ["conventions/"] as const;

export interface FeedRow {
  id: string;
  version: string;
  kind: string;
  title: string;
  actor?: string;
  when: string | null;
}

function stringField(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

/** True iff a head belongs in the feed — not a convention doc, not a View/Page registry doc. */
export function isFeedHead(head: DocHead): boolean {
  if (HIDDEN_PREFIXES.some((p) => head.id.startsWith(p))) return false;
  const type = String(head.frontmatter.type ?? "");
  if ((PAGE_TYPE_NAMES as readonly string[]).includes(type)) return false;
  return true;
}

/** Project heads into display rows: filtered, newest-first by `timestamp` (undated last), capped at {@link FEED_LIMIT}. Pure — the unit-tested core. */
export function feedRows(heads: DocHead[]): FeedRow[] {
  return heads
    .filter(isFeedHead)
    .map((h) => ({
      id: h.id,
      version: h.version,
      kind: String(h.frontmatter.type ?? "Doc"),
      title: stringField(h.frontmatter.title) ?? h.id,
      actor: stringField(h.frontmatter.actor),
      when: formatWhen(stringField(h.frontmatter.timestamp)),
      timestamp: stringField(h.frontmatter.timestamp) ?? "",
    }))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp) || a.title.localeCompare(b.title))
    .slice(0, FEED_LIMIT)
    .map(({ timestamp: _timestamp, ...row }) => row);
}

/** Ids whose row is NEW or CHANGED relative to the previous snapshot (best-effort freshness marker). `null` previous = first load, nothing is "fresh". Pure. */
export function freshIds(rows: FeedRow[], previous: Map<string, string> | null): Set<string> {
  const fresh = new Set<string>();
  if (previous === null) return fresh;
  for (const row of rows) {
    if (previous.get(row.id) !== row.version) fresh.add(row.id);
  }
  return fresh;
}

export function ActivityFeed() {
  const queryClient = useQueryClient();
  const feedQuery = useQuery({ queryKey: ["activity"], queryFn: () => listAllHeads({}) });
  const previousRef = useRef<Map<string, string> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = subscribeToChanges((e) => {
      if (e.docs.changed.length === 0 && e.docs.removed.length === 0) return;
      if (debounceRef.current !== undefined) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = undefined;
        void queryClient.invalidateQueries({ queryKey: ["activity"] });
      }, FEED_REFETCH_DEBOUNCE_MS);
    });
    return () => {
      unsubscribe();
      if (debounceRef.current !== undefined) clearTimeout(debounceRef.current);
    };
  }, [queryClient]);

  useEffect(() => {
    return subscribeToResync(() => {
      void queryClient.invalidateQueries({ queryKey: ["activity"] });
    });
  }, [queryClient]);

  const rows = feedRows(feedQuery.data ?? []);
  const fresh = freshIds(rows, previousRef.current);

  // Snapshot AFTER computing freshness so the next data change diffs against this render's rows.
  useEffect(() => {
    if (feedQuery.data === undefined) return;
    previousRef.current = new Map(rows.map((r) => [r.id, r.version]));
    // rows derives from feedQuery.data; keying the effect on the data identity is sufficient.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedQuery.data]);

  if (feedQuery.isPending) return <p className="view-status">Loading activity…</p>;
  if (feedQuery.isError) {
    return <p className="view-status view-status-error">Could not load activity: {(feedQuery.error as Error).message}</p>;
  }
  if (rows.length === 0) {
    return <p className="feed-empty">Nothing yet. Every doc your agent writes lands here, live — this feed is the bundle’s pulse.</p>;
  }
  return (
    <ul className="feed-list">
      {rows.map((row) => (
        <li key={row.id} className={fresh.has(row.id) ? "feed-row feed-row-fresh" : "feed-row"}>
          {row.actor && <span className="feed-actor">{row.actor}</span>}
          <span className="feed-line">
            <span className="feed-kind">{row.kind}</span> <span className="feed-title">“{row.title}”</span>
          </span>
          {row.when && <span className="feed-when">{row.when}</span>}
        </li>
      ))}
    </ul>
  );
}
