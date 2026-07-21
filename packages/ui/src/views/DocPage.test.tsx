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

  it("renders outbound edges grouped by declared relationship, with every row href a ?view=doc route", async () => {
    vi.mocked(getDoc).mockResolvedValue({
      doc: { id: "roadmap-items/x", frontmatter: { type: "Roadmap Item", title: "X" }, body: "" },
      version: "v1",
    });
    vi.mocked(fetchKinds).mockResolvedValue([
      { id: "conventions/roadmap-item", title: "Roadmap Item", governs: "Roadmap Item", fields: { required: [], optional: [], values: {} }, links: { contains: "Task" } },
    ] as never);
    vi.mocked(fetchEdges).mockImplementation(async (params: { from?: unknown; to?: unknown }) => {
      if (params.from) {
        return [
          { from: "roadmap-items/x", to: "tasks/a", text: "contains" },
          { from: "roadmap-items/x", to: "tasks/b", text: "contains" },
          { from: "roadmap-items/x", to: "designs/d", text: "the design behind this" }, // prose → Related
        ];
      }
      return [{ from: "plans/p", to: "roadmap-items/x", text: "implements" }]; // backlink
    });

    await render("roadmap-items/x");

    const verbs = [...container.querySelectorAll(".doc-rel-verb")].map((h) => h.textContent);
    expect(verbs).toEqual(["contains", "Related"]);
    const links = container.querySelector(".doc-links")!;
    expect(links.textContent).toContain("tasks/a");
    expect(links.textContent).toContain("tasks/b");
    // Prose edge lands in Related, carrying its text.
    expect(links.textContent).toContain("the design behind this");
    // Every outbound + backlink anchor is a same-page reader route — never a raw target attribute.
    for (const a of container.querySelectorAll(".doc-relationships a")) {
      expect(a.getAttribute("href")).toMatch(/^\?view=doc&id=/);
    }
    // Backlink still renders under "Cited by".
    expect(container.querySelector(".doc-backlinks")!.textContent).toContain("plans/p");
  });

  it("a relationship row to a dangling target navigates to the reader (which shows its own not-found state)", async () => {
    // First render: the source doc with one outbound edge to a target that does not exist.
    vi.mocked(getDoc).mockImplementation(async (id: string) => {
      if (id === "tasks/src") return { doc: { id, frontmatter: { type: "Task", title: "Src" }, body: "" }, version: "v1" };
      throw new ApiError(404, "NOT_FOUND", "no such doc");
    });
    vi.mocked(fetchKinds).mockResolvedValue([]);
    vi.mocked(fetchEdges).mockImplementation(async (params: { from?: unknown }) =>
      params.from ? [{ from: "tasks/src", to: "tasks/ghost", text: "" }] : [],
    );

    await render("tasks/src");
    const ghostLink = [...container.querySelectorAll(".doc-links a")].find((a) => a.textContent === "tasks/ghost") as HTMLAnchorElement;
    expect(ghostLink, "the dangling target still renders as a link").toBeTruthy();
    expect(ghostLink.getAttribute("href")).toBe("?view=doc&id=tasks%2Fghost");
  });

  it("a standalone declared-verb link dump is lifted from the body into the grouped Links section", async () => {
    vi.mocked(getDoc).mockResolvedValue({
      doc: {
        id: "roadmap-items/x",
        frontmatter: { type: "Roadmap Item", title: "X" },
        body: "Ships the inventory.\n\n[contains](../tasks/a.md)\n\n[contains](../tasks/b.md)",
      },
      version: "v1",
    });
    vi.mocked(fetchKinds).mockResolvedValue([
      { id: "conventions/roadmap-item", title: "Roadmap Item", governs: "Roadmap Item", fields: { required: [], optional: [], values: {} }, links: { contains: "Task" } },
    ] as never);
    vi.mocked(fetchEdges).mockImplementation(async (params: { from?: unknown }) =>
      params.from
        ? [
            { from: "roadmap-items/x", to: "tasks/a", text: "contains" },
            { from: "roadmap-items/x", to: "tasks/b", text: "contains" },
          ]
        : [],
    );

    await render("roadmap-items/x");

    // Prose stays; the bare-verb dump is gone from the body (no body anchors).
    expect(container.querySelector(".doc-body")!.textContent).toContain("Ships the inventory.");
    expect(container.querySelectorAll(".doc-body a")).toHaveLength(0);
    // The same edges show grouped-with-targets in the Links section.
    const links = container.querySelector(".doc-links")!;
    expect([...links.querySelectorAll(".doc-rel-verb")].map((h) => h.textContent)).toEqual(["contains"]);
    expect(links.textContent).toContain("tasks/a");
    expect(links.textContent).toContain("tasks/b");
  });

  it("a doc with neither outbound nor inbound edges shows a single quiet empty state", async () => {
    vi.mocked(getDoc).mockResolvedValue({ doc: { id: "notes/lonely", frontmatter: { type: "Context Note", title: "Lonely" }, body: "" }, version: "v1" });
    vi.mocked(fetchEdges).mockResolvedValue([]);
    await render("notes/lonely");
    expect(container.querySelector(".doc-links")).toBeNull();
    expect(container.querySelector(".doc-backlinks-empty")!.textContent).toBe("No links yet.");
  });
});
