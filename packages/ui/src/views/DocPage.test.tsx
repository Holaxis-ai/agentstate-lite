/**
 * DocPage pins (designs/doc-reader rev 2): header card renders kind + KIND-DECLARED chips only
 * (mechanism in the shell, meaning from the bundle), body renders through the bounded pipeline,
 * backlinks list + navigate, unknown id lands in the honest not-found state with a way home.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DocPage } from "./DocPage.js";
import { ApiError, getDoc } from "../api/client.js";
import { fetchEdges, fetchKinds } from "../api/pages.js";

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("../api/client.js", async (importOriginal) => {
  const original = await importOriginal<typeof import("../api/client.js")>();
  return { ...original, getDoc: vi.fn(), listAllHeads: vi.fn(async () => []) };
});

vi.mock("../api/pages.js", () => ({
  fetchEdges: vi.fn(async () => []),
  fetchKinds: vi.fn(async () => []),
  invalidateKinds: vi.fn(),
}));

vi.mock("../pages/pageEvents.js", () => ({
  subscribeToChanges: vi.fn(() => () => {}),
  subscribeToResync: vi.fn(() => () => {}),
}));

const TASK_KIND = {
  id: "conventions/task",
  title: "Task",
  governs: "Task",
  fields: { required: ["title", "status"], optional: ["priority", "assignee"], values: {} },
  linkTypes: {},
};

describe("DocPage", () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.mocked(getDoc).mockReset();
    vi.mocked(fetchEdges).mockReset();
    vi.mocked(fetchEdges).mockResolvedValue([]);
    vi.mocked(fetchKinds).mockReset();
    vi.mocked(fetchKinds).mockResolvedValue([]);
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

  async function render(docId: string): Promise<void> {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false, refetchInterval: false } } });
    await act(async () => {
      root.render(
        <QueryClientProvider client={client}>
          <DocPage docId={docId} />
        </QueryClientProvider>,
      );
    });
    for (let i = 0; i < 10; i++) {
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });
    }
  }

  it("renders header (kind pill + declared chips only), body, and backlinks", async () => {
    vi.mocked(getDoc).mockResolvedValue({
      doc: {
        id: "tasks/alpha",
        frontmatter: {
          type: "Task",
          title: "Ship the reader",
          status: "in_progress",
          priority: "1",
          secret_internal: "never-a-chip",
          actor: "mike",
          timestamp: "2026-07-21T10:00:00.000Z",
        },
        body: "# Progress\n\nSee [the design](../designs/doc-reader.md).",
      },
      version: "v1",
    });
    vi.mocked(fetchKinds).mockResolvedValue([TASK_KIND] as never);
    vi.mocked(fetchEdges).mockResolvedValue([{ from: "plans/doc-reader-build", to: "tasks/alpha", text: "implements" }]);

    await render("tasks/alpha");

    expect(container.querySelector(".doc-head h1")!.textContent).toBe("Ship the reader");
    expect(container.querySelector(".pill")!.textContent).toBe("Task");
    const chips = [...container.querySelectorAll(".doc-chip")].map((c) => c.textContent);
    expect(chips).toContain("status: in_progress");
    expect(chips).toContain("priority: 1");
    // An undeclared field is NEVER a chip — chips are the kind's vocabulary, not the doc's.
    expect(chips.join("|")).not.toContain("secret_internal");
    expect(container.querySelector(".doc-body h1")!.textContent).toBe("Progress");
    expect(container.querySelector(".doc-body a")!.getAttribute("href")).toBe("?view=doc&id=designs%2Fdoc-reader");
    expect(container.querySelector(".doc-backlinks")!.textContent).toContain("plans/doc-reader-build");
    expect(container.querySelector(".doc-backlinks")!.textContent).toContain("implements");
  });

  it("an unknown id renders the honest not-found state with a way home", async () => {
    vi.mocked(getDoc).mockRejectedValue(new ApiError(404, "NOT_FOUND", "no such doc"));
    await render("tasks/ghost");
    expect(container.textContent).toContain("No doc 'tasks/ghost' exists");
    expect(container.querySelector(".doc-terminal .page-back")).not.toBeNull();
    expect(container.querySelector(".doc-body")).toBeNull();
  });

  it("a non-404 failure reports the error without claiming absence", async () => {
    vi.mocked(getDoc).mockRejectedValue(new ApiError(502, "RUNTIME", "upstream broke"));
    await render("tasks/alpha");
    expect(container.textContent).toContain("Could not load 'tasks/alpha'");
    expect(container.textContent).not.toContain("No doc");
  });
});
