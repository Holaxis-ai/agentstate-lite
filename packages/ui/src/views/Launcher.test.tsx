/**
 * Home-surface pins (designs/home-surface + the pre-existing empty-state teaching pin from
 * plans/rename-page-kind-to-view Unit 3):
 *
 *  1. The empty state still teaches View authoring in CANONICAL vocabulary (`type: View`,
 *     `views/`, `examples/views/`; Page named only as the accepted legacy form). Red-on-old:
 *     the pre-rename empty state taught `type: Page` under `pages/`.
 *  2. The grid is FLAT — the capability-grouped sections (Dashboards / Interactive / Documents)
 *     are gone; capability renders as a per-card BADGE (`live data` / `can edit` / `artifact`)
 *     derived from the same enforced `bridge` field. Red-on-old: the grouped launcher rendered a
 *     "Documents" heading.
 *  3. First-run orientation shows until dismissed; dismissal persists per bundle root in
 *     localStorage, and a stored dismissal suppresses it.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Launcher, orientationStorageKey } from "./Launcher.js";
import { listPages } from "../api/pages.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const BUNDLE_ROOT = "/tmp/bundle";

vi.mock("../api/pages.js", () => ({
  fetchConfig: vi.fn(async () => ({ mode: "dir", remoteUrl: null, root: BUNDLE_ROOT, name: "bundle" })),
  listPages: vi.fn(async () => []),
  invalidateKinds: vi.fn(),
}));

vi.mock("../pages/pageEvents.js", () => ({
  subscribeToChanges: vi.fn(() => () => {}),
  subscribeToResync: vi.fn(() => () => {}),
}));

// The feed has its own suite (ActivityFeed.test.tsx); the Launcher tests pin the shell around it.
vi.mock("./ActivityFeed.js", () => ({
  ActivityFeed: () => null,
}));

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/** Deterministic localStorage stub — the runtime's own (Node webstorage/jsdom mix) is nonstandard under vitest. */
function stubLocalStorage(): { getItem(k: string): string | null; setItem(k: string, v: string): void } {
  const store = new Map<string, string>();
  const stub = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, String(v));
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
    clear: () => store.clear(),
    key: (i: number) => [...store.keys()][i] ?? null,
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(window, "localStorage", { value: stub, configurable: true });
  return stub;
}

describe("home surface", () => {
  let container: HTMLDivElement;
  let root: Root;
  let storage: ReturnType<typeof stubLocalStorage>;

  beforeEach(() => {
    storage = stubLocalStorage();
    vi.mocked(listPages).mockReset();
    vi.mocked(listPages).mockResolvedValue([]);
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

  async function render(): Promise<void> {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchInterval: false } } });
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <Launcher />
        </QueryClientProvider>,
      );
    });
    // Let the mocked queries settle (isPending -> resolved) before the callers assert.
    for (let i = 0; i < 5; i++) {
      await act(async () => {
        await flush();
      });
    }
  }

  it("empty state teaches View authoring canonically, naming Page only as the accepted legacy form", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    await render();
    for (let i = 0; i < 50 && !container.querySelector(".launcher-empty"); i++) {
      await act(async () => {
        await flush();
      });
    }

    const empty = container.querySelector(".launcher-empty");
    expect(empty, "empty state must render when no views are registered").not.toBeNull();
    const text = empty!.textContent ?? "";
    // Canonical teaching: the View kind, the views/ blob prefix, the worked examples.
    expect(text).toContain("type: View");
    expect(text).toContain("views/");
    expect(text).toContain("examples/views/");
    // Legacy is a note, not guidance: mentioned as still working, never as the thing to author.
    expect(text).toContain("Legacy");
    expect(text).toContain("type: Page");
    expect(text).not.toContain("examples/pages/");
    expect(text).not.toMatch(/Promote an HTML page/);
  });

  it("renders ONE flat grid with capability badges — no Dashboards/Interactive/Documents sections", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    vi.mocked(listPages).mockResolvedValue([
      { id: "views-registry/board", version: "v1", title: "Board", entry: "views/board.html", bridge: "bundle-propose" },
      { id: "views-registry/pulse", version: "v1", title: "Pulse", entry: "views/pulse.html", bridge: "bundle-read" },
      { id: "views-registry/map", version: "v1", title: "Map", entry: "views/map.html", bridge: "none" },
    ]);
    await render();
    for (let i = 0; i < 50 && container.querySelectorAll(".launcher-card").length < 3; i++) {
      await act(async () => {
        await flush();
      });
    }

    // The old capability-section headings are gone…
    const headings = [...container.querySelectorAll("h3")].map((h) => h.textContent);
    for (const retired of ["Dashboards", "Interactive", "Documents"]) {
      expect(headings, `retired section heading '${retired}' must not render`).not.toContain(retired);
    }
    // …one grid holds every card, in listPages order (recency — the API sorts)…
    const grids = container.querySelectorAll(".launcher-grid");
    expect(grids).toHaveLength(1);
    const cardIds = [...grids[0]!.querySelectorAll(".launcher-card")].map((c) => c.getAttribute("data-page-id"));
    expect(cardIds).toEqual(["views-registry/board", "views-registry/pulse", "views-registry/map"]);
    // …and capability renders as the role-worded badge.
    const badges = [...container.querySelectorAll(".launcher-card .badge")].map((b) => b.textContent);
    expect(badges).toEqual(["can edit", "live data", "artifact"]);
  });

  it("shows first-run orientation with the in-tree-safe promise and no-agent fallback; dismissal persists", async () => {
    await render();
    for (let i = 0; i < 50 && !container.querySelector(".orientation"); i++) {
      await act(async () => {
        await flush();
      });
    }

    const orientation = container.querySelector(".orientation");
    expect(orientation, "first run must render the orientation").not.toBeNull();
    const text = orientation!.textContent ?? "";
    // The promise is worded to cover the in-tree mode (chip and promise must never contradict).
    expect(text).toMatch(/stays private until you choose to share it/i);
    expect(text).toContain("committing the folder with your code");
    // The try-it hook carries a no-agent-yet fallback.
    expect(text).toContain("No agent set up yet?");

    await act(async () => {
      (container.querySelector(".orientation-dismiss") as HTMLButtonElement).click();
      await flush();
    });
    expect(container.querySelector(".orientation"), "dismissal hides the orientation").toBeNull();
    expect(storage.getItem(orientationStorageKey(BUNDLE_ROOT))).toBe("dismissed");
  });

  it("suppresses orientation when a stored dismissal exists", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    await render();
    await act(async () => {
      await flush();
    });
    expect(container.querySelector(".orientation")).toBeNull();
  });
});
