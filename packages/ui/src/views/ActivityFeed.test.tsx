/**
 * Activity feed tests (designs/home-surface): the pure projection (`feedRows` — filter, sort,
 * cap; `freshIds` — best-effort change marking) plus the component's live contract: an SSE change
 * DEBOUNCES into one refetch of the head list (the event carries no frontmatter, so
 * invalidate-and-refetch is the only honest semantics), and a resync refetches immediately.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { DocHead } from "../api/types.js";
import { ActivityFeed, FEED_LIMIT, FEED_REFETCH_DEBOUNCE_MS, feedRows, freshIds } from "./ActivityFeed.js";
import { listAllHeads } from "../api/client.js";
import { subscribeToChanges, subscribeToResync } from "../pages/pageEvents.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../api/client.js", () => ({
  listAllHeads: vi.fn(async () => []),
}));

vi.mock("../pages/pageEvents.js", () => ({
  subscribeToChanges: vi.fn(() => () => {}),
  subscribeToResync: vi.fn(() => () => {}),
}));

function head(id: string, frontmatter: { type: string } & Record<string, unknown>, version = "v1"): DocHead {
  return { id, version, frontmatter };
}

describe("feedRows (pure projection)", () => {
  it("filters conventions and View/Page registry docs, sorts newest-first, caps at the limit", () => {
    const heads: DocHead[] = [
      head("conventions/task", { type: "Convention", title: "Task", timestamp: "2026-07-21T10:00:00Z" }),
      head("views-registry/board", { type: "View", title: "Board", entry: "views/b.html", timestamp: "2026-07-21T09:00:00Z" }),
      head("pages-registry/about", { type: "Page", title: "About", entry: "pages/a.html", timestamp: "2026-07-21T08:00:00Z" }),
      head("tasks/older", { type: "Task", title: "Older", timestamp: "2026-07-20T10:00:00Z" }),
      head("tasks/newer", { type: "Task", title: "Newer", timestamp: "2026-07-21T10:00:00Z" }),
      head("notes/undated", { type: "Context Note", title: "Undated" }),
    ];
    const rows = feedRows(heads);
    expect(rows.map((r) => r.id)).toEqual(["tasks/newer", "tasks/older", "notes/undated"]);
    expect(rows[0]).toMatchObject({ kind: "Task", title: "Newer" });
  });

  it("falls back to the id for an untitled doc and caps at FEED_LIMIT", () => {
    const heads = Array.from({ length: FEED_LIMIT + 3 }, (_, i) =>
      head(`docs/d${i}`, { type: "Doc", timestamp: `2026-07-0${(i % 9) + 1}T00:00:00Z` }),
    );
    const rows = feedRows(heads);
    expect(rows).toHaveLength(FEED_LIMIT);
    expect(rows[0]!.title).toBe(rows[0]!.id);
  });
});

describe("freshIds (pure change marking)", () => {
  const rows = feedRows([
    head("a", { type: "Doc", title: "A", timestamp: "2026-07-21T02:00:00Z" }, "v2"),
    head("b", { type: "Doc", title: "B", timestamp: "2026-07-21T01:00:00Z" }, "v1"),
  ]);

  it("marks nothing on first load (null previous)", () => {
    expect(freshIds(rows, null).size).toBe(0);
  });

  it("marks new and version-changed ids, never unchanged ones", () => {
    const previous = new Map([["b", "v1"]]);
    const fresh = freshIds(rows, previous);
    expect(fresh.has("a"), "new id is fresh").toBe(true);
    expect(fresh.has("b"), "unchanged id is not fresh").toBe(false);
    expect(freshIds(rows, new Map([["a", "v1"], ["b", "v1"]])).has("a"), "version change is fresh").toBe(true);
  });
});

describe("ActivityFeed live contract", () => {
  let container: HTMLDivElement;
  let root: Root;
  let changeHandler: ((e: unknown) => void) | undefined;
  let resyncHandler: (() => void) | undefined;

  beforeEach(() => {
    vi.mocked(listAllHeads).mockClear();
    vi.mocked(subscribeToChanges).mockImplementation((handler: (e: never) => void) => {
      changeHandler = handler as (e: unknown) => void;
      return () => {};
    });
    vi.mocked(subscribeToResync).mockImplementation((handler: () => void) => {
      resyncHandler = handler;
      return () => {};
    });
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  async function renderFeed(): Promise<void> {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchInterval: false } } });
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <ActivityFeed />
        </QueryClientProvider>,
      );
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  it("renders rows from heads and an empty state when the bundle has none", async () => {
    vi.mocked(listAllHeads).mockResolvedValueOnce([
      head("tasks/x", { type: "Task", title: "Ship it", actor: "mike", timestamp: "2026-07-21T10:00:00Z" }),
    ]);
    await renderFeed();
    expect(container.textContent).toContain("Ship it");
    expect(container.textContent).toContain("mike");
    expect(container.querySelector(".feed-empty")).toBeNull();
  });

  it("debounces a burst of SSE changes into ONE refetch; resync refetches immediately", async () => {
    await renderFeed();
    expect(container.querySelector(".feed-empty"), "empty bundle renders the empty state").not.toBeNull();
    const callsAfterMount = vi.mocked(listAllHeads).mock.calls.length;

    // A burst of three change frames within the debounce window → exactly one refetch.
    await act(async () => {
      const event = { docs: { changed: [{ id: "tasks/x", version: "v2" }], removed: [] }, blobs: { changed: [], removed: [] } };
      changeHandler!(event);
      changeHandler!(event);
      changeHandler!(event);
      await new Promise((resolve) => setTimeout(resolve, FEED_REFETCH_DEBOUNCE_MS + 100));
    });
    expect(vi.mocked(listAllHeads).mock.calls.length).toBe(callsAfterMount + 1);

    // A doc-free frame (blob-only change) never triggers a refetch.
    await act(async () => {
      changeHandler!({ docs: { changed: [], removed: [] }, blobs: { changed: [{ key: "views/x.html", version: "v2" }], removed: [] } });
      await new Promise((resolve) => setTimeout(resolve, FEED_REFETCH_DEBOUNCE_MS + 100));
    });
    expect(vi.mocked(listAllHeads).mock.calls.length).toBe(callsAfterMount + 1);

    // Resync = full refetch, immediately (the stream replays nothing).
    await act(async () => {
      resyncHandler!();
      await new Promise((resolve) => setTimeout(resolve, 50));
    });
    expect(vi.mocked(listAllHeads).mock.calls.length).toBe(callsAfterMount + 2);
  });

  it("unmount with a PENDING debounce clears the timer — no refetch after teardown (review follow-up)", async () => {
    await renderFeed();
    const callsAfterMount = vi.mocked(listAllHeads).mock.calls.length;
    await act(async () => {
      changeHandler!({ docs: { changed: [{ id: "tasks/x", version: "v2" }], removed: [] }, blobs: { changed: [], removed: [] } });
      root.unmount(); // before the debounce window elapses
      await new Promise((resolve) => setTimeout(resolve, FEED_REFETCH_DEBOUNCE_MS + 100));
    });
    expect(vi.mocked(listAllHeads).mock.calls.length).toBe(callsAfterMount);
    // afterEach unmounts again — recreate so it has a live root to tear down.
    root = createRoot(container);
  });
});
