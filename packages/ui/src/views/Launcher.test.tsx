/**
 * Launcher empty-state teaching pin (plans/rename-page-kind-to-view, Unit 3): the launcher is a
 * teaching surface — with no registered views it tells an agent-adjacent human HOW to author one,
 * so its vocabulary must be the CANONICAL kind name (`type: View`, `views/`, `examples/views/`)
 * with Page mentioned only as the accepted legacy name. Red-on-old: the pre-rename empty state
 * taught `type: Page` under `pages/` and pointed at `examples/pages/`.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Launcher } from "./Launcher.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../api/pages.js", () => ({
  fetchConfig: vi.fn(async () => ({ mode: "dir", remoteUrl: null, root: "/tmp/bundle", name: "bundle" })),
  listPages: vi.fn(async () => []),
  invalidateKinds: vi.fn(),
}));

vi.mock("../pages/pageEvents.js", () => ({
  subscribeToChanges: vi.fn(() => () => {}),
  subscribeToResync: vi.fn(() => () => {}),
}));

async function flush() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

describe("Launcher empty state", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
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

  it("teaches View authoring canonically, naming Page only as the accepted legacy form", async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <Launcher />
        </QueryClientProvider>,
      );
    });
    // Let the mocked queries settle (isPending -> resolved) before asserting the empty state.
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
});
