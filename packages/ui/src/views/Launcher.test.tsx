/**
 * Home-surface pins (designs/home-surface):
 *
 *  1. The empty Views state is written for a first-time reader: what a view IS, plus the plain-
 *     language ask that produces one. Authoring mechanics (kind names, blob prefixes, registry
 *     docs) are pinned ABSENT — this is the surface a user meets before they know any of it.
 *     Supersedes the earlier canonical-vocabulary pin from plans/rename-page-kind-to-view
 *     Unit 3, which taught `type: View` / `views/` / `examples/views/` here.
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
import { Launcher, orientationStorageKey, sharingChip } from "./Launcher.js";
import { fetchConfig, listPages, type SharingSummary, type UiConfig } from "../api/pages.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const BUNDLE_ROOT = "/tmp/bundle";
/**
 * The canonical View-authoring vocabulary. ONE list, asserted in both directions: absent from the
 * empty state's first read, present once "learn more" is expanded. Editing either surface without
 * the other turns one of the two assertions red.
 */
const AUTHORING_JARGON = ["type: View", "type: Page", "views/", "examples/views/"] as const;
const BASE_CONFIG: UiConfig = { mode: "dir", remoteUrl: null, root: BUNDLE_ROOT, name: "bundle", sharing: null, workspaces: [] };

vi.mock("../api/pages.js", () => ({
  fetchConfig: vi.fn(async () => ({ mode: "dir", remoteUrl: null, root: "/tmp/bundle", name: "bundle", sharing: null, workspaces: [] })),
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

// Likewise the document browser (DocumentBrowser.test.tsx) — stub it so the Launcher tests stay focused.
vi.mock("./DocumentBrowser.js", () => ({
  DocumentBrowser: () => null,
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
    vi.mocked(fetchConfig).mockReset();
    vi.mocked(fetchConfig).mockResolvedValue({ ...BASE_CONFIG });
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

  it("empty state explains what a view is and how to ask for one, in a first-time reader's vocabulary", async () => {
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
    // What it is, and the one route to getting one: ask the agent in plain language.
    expect(text).toContain("interactive HTML file");
    expect(text).toContain("asking your agent");
    expect(text).toMatch(/create a view showing every open task/);
    // Authoring MECHANICS are deliberately absent from the FIRST read: a reader who has never
    // seen a view should not have to parse kind names or blob prefixes to understand it. They
    // live one click behind "learn more" — asserted below, so this is disclosure, not deletion.
    for (const jargon of AUTHORING_JARGON) {
      expect(text, `first read must stay free of "${jargon}"`).not.toContain(jargon);
    }
  });

  it("'learn more' discloses the authoring mechanics the first read withholds", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    await render();
    for (let i = 0; i < 50 && !container.querySelector(".launcher-empty"); i++) {
      await act(async () => {
        await flush();
      });
    }

    const empty = container.querySelector(".launcher-empty");
    const toggle = empty!.querySelector<HTMLButtonElement>("button.where-btn");
    expect(toggle, "empty state must offer a 'learn more' disclosure").not.toBeNull();
    // Collapsed by default — the whole point is that the mechanics are not the first thing read.
    expect(toggle!.textContent).toContain("learn more");
    expect(toggle!.getAttribute("aria-expanded")).toBe("false");
    expect(empty!.querySelector(".launcher-empty-details")).toBeNull();

    await act(async () => {
      toggle!.click();
      await flush();
    });

    const details = empty!.querySelector(".launcher-empty-details");
    expect(details, "clicking 'learn more' must reveal the mechanics panel").not.toBeNull();
    const disclosed = details!.textContent ?? "";
    // Every term withheld from the first read is reachable here — the canonical authoring
    // vocabulary, with Page named only as the legacy form that keeps working.
    for (const jargon of AUTHORING_JARGON) {
      expect(disclosed, `"${jargon}" must be reachable behind 'learn more'`).toContain(jargon);
    }
    expect(toggle!.getAttribute("aria-expanded")).toBe("true");
    expect(toggle!.textContent).toContain("hide details");
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

  it("renders the sharing chip and the where-panel behind the disclosure (path no longer up front)", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    vi.mocked(fetchConfig).mockResolvedValue({
      ...BASE_CONFIG,
      sharing: { kind: "shared_branch", remote: "org/repo", as_of: "2026-07-21T12:00:00.000Z" },
    });
    await render();
    for (let i = 0; i < 50 && !container.querySelector(".chip"); i++) {
      await act(async () => {
        await flush();
      });
    }

    // The chip is up front; the raw path is NOT (progressive disclosure).
    expect(container.querySelector(".chip")!.textContent).toBe("shared · org/repo");
    expect(container.querySelector(".launcher-meta")!.textContent).not.toContain(BUNDLE_ROOT);
    expect(container.querySelector(".where-panel")).toBeNull();

    await act(async () => {
      (container.querySelector(".where-btn") as HTMLButtonElement).click();
      await flush();
    });
    const panel = container.querySelector(".where-panel");
    expect(panel, "the disclosure opens the panel").not.toBeNull();
    expect(panel!.textContent).toContain(BUNDLE_ROOT);
    expect(panel!.textContent).toContain("dedicated board branch");
  });

  it("workspaces block is COLLAPSED by default; expanding reveals rows, then per-row paths", async () => {
    storage.setItem(orientationStorageKey(BUNDLE_ROOT), "dismissed");
    vi.mocked(fetchConfig).mockResolvedValue({
      ...BASE_CONFIG,
      workspaces: [
        { label: "here", path: BUNDLE_ROOT, open: true },
        { label: "other", path: "/tmp/other", open: false },
      ],
    });
    await render();
    for (let i = 0; i < 50 && !container.querySelector(".workspaces-toggle"); i++) {
      await act(async () => {
        await flush();
      });
    }

    const toggle = container.querySelector(".workspaces-toggle") as HTMLButtonElement;
    expect(toggle.textContent).toContain("Workspaces (2)");
    expect(container.querySelector(".workspace-list"), "collapsed by default").toBeNull();

    await act(async () => {
      toggle.click();
      await flush();
    });
    expect(container.querySelectorAll(".workspace")).toHaveLength(2);
    expect(container.textContent).not.toContain("/tmp/other"); // paths stay behind the row expand

    await act(async () => {
      ([...container.querySelectorAll(".workspace-row")] as HTMLButtonElement[])
        .find((b) => b.textContent!.includes("other"))!
        .click();
      await flush();
    });
    expect(container.textContent).toContain("/tmp/other");
    expect(container.textContent).toContain("aslite ui --dir /tmp/other");
  });
});

describe("sharingChip truth table (the SPA owns the words; every state row pinned)", () => {
  const asOf = "2026-07-21T12:00:00.000Z";
  const rows: Array<[SharingSummary["kind"], string | undefined, string | null, string]> = [
    ["private", undefined, "private — this computer only", "chip chip-private"],
    ["private_local_branch", undefined, "private — local board branch, not yet shared", "chip chip-private"],
    ["private_intree_no_remote", undefined, "private — committed with code, no remote", "chip chip-private"],
    ["private_intree_not_pushed", undefined, "private — committed with code, not yet pushed", "chip chip-private"],
    ["shared_branch", "org/repo", "shared · org/repo", "chip chip-shared"],
    ["shared_intree", "org/repo", "shared with the code · org/repo", "chip chip-shared"],
    ["hosted", "host:1", "hosted · host:1", "chip chip-shared"],
    ["unavailable", undefined, "sharing status unavailable", "chip chip-unavailable"],
  ];

  for (const [kind, remote, text, className] of rows) {
    it(`${kind} → “${text}”`, () => {
      const chip = sharingChip({ kind, remote, as_of: asOf });
      expect(chip).not.toBeNull();
      expect(chip!.text).toBe(text);
      expect(chip!.className).toBe(className);
    });
  }

  it("unscoped and null make NO claim (no chip at all)", () => {
    expect(sharingChip({ kind: "unscoped", as_of: asOf })).toBeNull();
    expect(sharingChip(null)).toBeNull();
  });

  it("an unknown future kind refuses honestly instead of fabricating", () => {
    const chip = sharingChip({ kind: "surprise" as SharingSummary["kind"], as_of: asOf });
    expect(chip!.text).toBe("sharing status unavailable");
  });
});
