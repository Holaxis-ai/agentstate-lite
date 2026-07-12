/**
 * PageFrame bridge-revocation race tests (P1, adversarial-review fold-in). The bridge broker's
 * dep calls (`getDoc`, `mintPageNonce`, `listAllHeads`, …) are async, so a fail-closed capability
 * check taken at the WRONG time — either too late (the reload hasn't revoked yet) or only at
 * receipt with no re-check at delivery — leaves a window where a `bundle-read` grant survives
 * past the edit/reload that was supposed to end it. These two tests reproduce both windows
 * against the REAL component (a real iframe, a real postMessage round-trip) and prove
 * `PageFrame.tsx`'s fix closes them: (a) pre-revoking the capability/subscription ref
 * SYNCHRONOUSLY at the top of `loadPage`, before its first `await`, and (b) fencing the
 * `onMessage` broker's async reply against `loadSeqRef` so a reply computed under an OLD
 * generation is dropped, never delivered into a frame that has since reloaded.
 */
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { PageFrame } from "./PageFrame.js";
import { getDoc, listAllHeads } from "../api/client.js";
import { mintPageNonce, resolvePageTarget } from "../api/pages.js";
import { subscribeToChanges } from "../pages/pageEvents.js";
import { __resetInterceptorForTests } from "../query/interceptor.js";

// No @testing-library/react in this workspace (see package.json) — a bare react-dom/client
// render still needs this flag set for `act` to batch/flush synchronously instead of warning.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../api/client.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../api/client.js")>();
  return { ...actual, getDoc: vi.fn(), listAllHeads: vi.fn() };
});

vi.mock("../api/pages.js", () => ({
  mintPageNonce: vi.fn(async (entry: string) => `/__page/nonce-${entry}`),
  fetchConfig: vi.fn(async () => ({ root: "/tmp/b", name: "b", mode: "dir" })),
  fetchKinds: vi.fn(async () => []),
  fetchEdges: vi.fn(async () => []),
  invalidateKinds: vi.fn(),
  resolvePageTarget: vi.fn(async () => true),
}));

// `subscribeToChanges`/`subscribeToResync` open a real EventSource on first subscribe (jsdom ships
// none) — stub them so PageFrame's live-update effects mount cleanly, and so the test can invoke
// the captured listener directly to simulate an SSE frame without a real stream.
vi.mock("../pages/pageEvents.js", () => ({
  subscribeToChanges: vi.fn(() => () => {}),
  subscribeToResync: vi.fn(() => () => {}),
}));

function pageDoc(overrides: Record<string, unknown> = {}) {
  return {
    doc: { id: "pages-registry/p", frontmatter: { type: "Page", title: "P", entry: "pages/p.html", bridge: "bundle-read", ...overrides }, body: "" },
    version: "v1",
  };
}

/** An externally-resolvable promise, for controlling exactly when an async dep settles. */
function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

/** Flush pending microtask chains (our mocks resolve via plain Promises, not real timers). */
async function flush() {
  await new Promise((r) => setTimeout(r, 0));
}

describe("PageFrame: bridge revocation race (P1)", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    __resetInterceptorForTests();
    window.history.replaceState(null, "", "/");
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

  it("registry-doc bundle-read -> none: a bridge request received during the async reload gap is DENIED, never answered under the stale grant", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(pageDoc({ bridge: "bundle-read" }));
    vi.mocked(listAllHeads).mockResolvedValue([]);

    await act(async () => {
      root.render(<PageFrame pageId="pages-registry/p" />);
      await flush();
    });

    const iframe = container.querySelector("iframe.page-frame-iframe") as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    const contentWindow = iframe.contentWindow!;
    const postSpy = vi.spyOn(contentWindow, "postMessage");

    // The registry doc is edited live (bridge flips to "none") — simulate the SSE change event
    // that fires `loadPage()` again. Defer its `getDoc` resolution so we can send a bridge
    // request INTO the async gap between the edit landing and the reload completing.
    const changeListener = vi.mocked(subscribeToChanges).mock.calls[0]![0];
    const pending = deferred<ReturnType<typeof pageDoc>>();
    vi.mocked(getDoc).mockImplementationOnce(() => pending.promise);

    act(() => {
      changeListener({
        docs: { changed: [{ id: "pages-registry/p", version: "v2" }], removed: [] },
        blobs: { changed: [], removed: [] },
      });
    });

    // The reload is now in flight (getDoc pending) — a page->shell request arriving in exactly
    // this gap is the window the reviewer flagged: pre-fix, the OLD "bundle-read" capability was
    // still standing (only reset once getDoc resolved), so this would have been answered for
    // real. Post-fix, `loadPage` pre-revokes synchronously before its first `await`.
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", { data: { bridge: "v0", id: "q1", type: "query", params: {} }, source: contentWindow }),
      );
    });
    await flush();

    // Denied outright — no dep touched, no real data ever fetched for this request.
    expect(listAllHeads).not.toHaveBeenCalled();
    const forbidden = postSpy.mock.calls.find(([msg]) => (msg as { id?: string }).id === "q1");
    expect(forbidden).toBeTruthy();
    const [reply] = forbidden!;
    expect((reply as { type: string }).type).toBe("error");
    expect((reply as { error: { code: string } }).error.code).toBe("FORBIDDEN");

    // Let the reload settle so no promise is left dangling.
    pending.resolve(pageDoc({ bridge: "none" }));
    await act(async () => {
      await flush();
    });
  });

  it("an in-flight bundle-read reply whose epoch advanced (page reloaded to bridge: none) is DROPPED — never delivered to the downgraded frame", async () => {
    vi.mocked(getDoc).mockResolvedValueOnce(pageDoc({ bridge: "bundle-read" }));

    await act(async () => {
      root.render(<PageFrame pageId="pages-registry/p" />);
      await flush();
    });

    const iframe = container.querySelector("iframe.page-frame-iframe") as HTMLIFrameElement;
    const firstContentWindow = iframe.contentWindow!;

    // A `query` request arrives while this page is still `bundle-read` — captured (correctly) at
    // receipt time — but its dep call is held open so the reload below can race ahead of it.
    const pendingQuery = deferred<[]>();
    vi.mocked(listAllHeads).mockImplementationOnce(() => pendingQuery.promise);
    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", { data: { bridge: "v0", id: "q1", type: "query", params: {} }, source: firstContentWindow }),
      );
    });
    await flush();
    expect(listAllHeads).toHaveBeenCalledTimes(1); // in flight, not yet resolved

    // The page reloads to a DIFFERENT (downgraded) capability BEFORE that reply is ready — this
    // reload's own getDoc/mint resolve promptly and retarget `entry`, which navigates the SAME
    // iframe DOM node to a fresh `src` (jsdom mints a brand-new `contentWindow` object per
    // navigation, unlike a real browser's stable WindowProxy — either way, whatever window is
    // CURRENT when the stale reply is finally ready is the one that must never receive it).
    const changeListener = vi.mocked(subscribeToChanges).mock.calls[0]![0];
    vi.mocked(getDoc).mockResolvedValueOnce(pageDoc({ bridge: "none", entry: "pages/p2.html" }));
    await act(async () => {
      changeListener({
        docs: { changed: [{ id: "pages-registry/p", version: "v3" }], removed: [] },
        blobs: { changed: [], removed: [] },
      });
      await flush();
    });

    // The reload navigated the iframe — re-read its (now different, `none`-capability) window and
    // watch IT: this is exactly what the component's own `frame.contentWindow` read (at delivery
    // time, inside the broker's `.then()`) resolves to.
    const currentIframe = container.querySelector("iframe.page-frame-iframe") as HTMLIFrameElement;
    const secondContentWindow = currentIframe.contentWindow!;
    const postSpy = vi.spyOn(secondContentWindow, "postMessage");

    // NOW the stale query's dep resolves — its reply was computed for the OLD (bundle-read)
    // generation, but the frame has since moved on to a `none` (content) page.
    await act(async () => {
      pendingQuery.resolve([]);
      await flush();
    });

    // The stale reply must never reach the (new, downgraded) frame — post-fix, the epoch check
    // drops it before `postMessage` is ever called for it.
    const leaked = postSpy.mock.calls.find(([msg]) => (msg as { id?: string; type?: string }).id === "q1");
    expect(leaked).toBeUndefined();
  });
});

describe("PageFrame: registered Page navigation", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.clearAllMocks();
    __resetInterceptorForTests();
    window.history.replaceState(null, "", "/");
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    container.remove();
  });

  async function mount(overrides: Record<string, unknown> = {}) {
    vi.mocked(getDoc).mockResolvedValue(pageDoc(overrides));
    await act(async () => {
      root.render(<PageFrame pageId="pages-registry/p" />);
      await flush();
    });
    return (container.querySelector("iframe.page-frame-iframe") as HTMLIFrameElement).contentWindow!;
  }

  it("allows a bridge:none Page to navigate through the shell", async () => {
    const source = await mount({ bridge: "none" });
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/target" } }));
      await flush();
    });
    expect(resolvePageTarget).toHaveBeenCalledWith("pages-registry/target");
    expect(window.location.search).toBe("?view=page&id=pages-registry%2Ftarget");
  });

  it("navigates at most once per source generation when resolutions race", async () => {
    const source = await mount();
    const first = deferred<boolean>();
    const second = deferred<boolean>();
    vi.mocked(resolvePageTarget).mockImplementationOnce(() => first.promise).mockImplementationOnce(() => second.promise);
    const push = vi.spyOn(window.history, "pushState");
    act(() => {
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/first" } }));
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/second" } }));
    });
    await act(async () => { second.resolve(true); await flush(); });
    await act(async () => { first.resolve(true); await flush(); });
    expect(push).toHaveBeenCalledTimes(1);
    expect(window.location.search).toContain("second");
  });

  it("ignores a second navigation message from the same old contentWindow after the first push", async () => {
    const source = await mount();
    const push = vi.spyOn(window.history, "pushState");
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/first" } }));
      await flush();
    });
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/second" } }));
      await flush();
    });
    expect(resolvePageTarget).toHaveBeenCalledTimes(2);
    expect(push).toHaveBeenCalledTimes(1);
    expect(window.location.search).toContain("first");
  });

  it("treats self-navigation as an idempotent no-op", async () => {
    const source = await mount();
    const push = vi.spyOn(window.history, "pushState");
    await act(async () => {
      window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/p" } }));
      await flush();
    });
    expect(push).not.toHaveBeenCalled();
  });

  it("drops navigation whose source generation became stale during validation", async () => {
    const source = await mount();
    const pending = deferred<boolean>();
    vi.mocked(resolvePageTarget).mockImplementationOnce(() => pending.promise);
    const push = vi.spyOn(window.history, "pushState");
    act(() => window.dispatchEvent(new MessageEvent("message", { source, data: { bridge: "v0", type: "open-page", pageId: "pages-registry/target" } })));
    const reload = deferred<ReturnType<typeof pageDoc>>();
    vi.mocked(getDoc).mockImplementationOnce(() => reload.promise);
    act(() => vi.mocked(subscribeToChanges).mock.calls[0]![0]({ docs: { changed: [{ id: "pages-registry/p", version: "v2" }], removed: [] }, blobs: { changed: [], removed: [] } }));
    await act(async () => { pending.resolve(true); await flush(); });
    expect(push).not.toHaveBeenCalled();
    reload.resolve(pageDoc());
    await act(async () => await flush());
  });

  it("revalidates at mount and refuses a non-Page deep link even when its entry is safe", async () => {
    vi.mocked(getDoc).mockResolvedValue(pageDoc({ type: "Design", entry: "pages/p.html" }));
    await act(async () => {
      root.render(<PageFrame pageId="pages-registry/p" />);
      await flush();
    });
    expect(mintPageNonce).not.toHaveBeenCalled();
    expect(container.querySelector("iframe")).toBeNull();
    expect(container.textContent).toContain("not a usable registered Page");
  });
});
