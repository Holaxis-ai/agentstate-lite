import { describe, expect, it, vi } from "vitest";
import {
  handleBridgeRequest,
  applyRowFilters,
  normalizeQueryParams,
  normalizeEdgeParams,
  changeMessage,
  resolveBridgeCapability,
  BRIDGE_PROTOCOL,
  type BridgeDeps,
} from "./bridge.js";
import type { DocHead, Edge, ReadDocResponse } from "../api/types.js";
import type { KindConvention } from "@agentstate-lite/core/kinds";

function head(id: string, frontmatter: Record<string, unknown>): DocHead {
  return { id, version: `v-${id}`, frontmatter: frontmatter as DocHead["frontmatter"] };
}

/** A minimal Task kind whose convention declares status done/canceled terminal — the shape the work-tracking recipe seeds. */
function taskKind(): KindConvention {
  return {
    id: "conventions/task",
    title: "Task",
    governs: "Task",
    fields: { required: ["title", "status"], optional: [], values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] }, terminal: { status: ["done", "canceled"] }, descriptions: {} },
  };
}

function stubDeps(overrides: Partial<BridgeDeps> = {}): BridgeDeps {
  return {
    config: vi.fn(async () => ({ root: "/tmp/b", name: "b", mode: "dir" })),
    query: vi.fn(async () => []),
    read: vi.fn(async (): Promise<ReadDocResponse> => ({ id: "x", frontmatter: { type: "Task" }, body: "" })),
    kinds: vi.fn(async () => [taskKind()]),
    edges: vi.fn(async (): Promise<Edge[]> => []),
    resolvePage: vi.fn(async () => true),
    ...overrides,
  };
}

describe("handleBridgeRequest", () => {
  it("ignores a non-bridge message (reply null)", async () => {
    const deps = stubDeps();
    expect(await handleBridgeRequest({ hello: true }, deps, "bundle-read")).toEqual({ reply: null });
    expect(await handleBridgeRequest("nope", deps, "bundle-read")).toEqual({ reply: null });
    expect(await handleBridgeRequest({ bridge: "v1", type: "hello" }, deps, "bundle-read")).toEqual({ reply: null });
  });

  it("hello: returns bundle summary + a read grant", async () => {
    const deps = stubDeps();
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "1", type: "hello" }, deps, "bundle-read");
    expect(reply).toMatchObject({
      bridge: "v0",
      id: "1",
      type: "hello:result",
      result: { bundle: { root: "/tmp/b", name: "b" }, mode: "dir", protocol: "v0", grant: "read" },
    });
  });

  it.each(["none", "bundle-read"] as const)("open-page is available to %s pages and returns only a shell-navigation outcome", async (capability) => {
    const resolvePage = vi.fn(async () => true);
    const deps = stubDeps({ resolvePage });
    const outcome = await handleBridgeRequest(
      { bridge: "v0", id: "nav", type: "open-page", pageId: "pages-registry/reviews/architecture.v2" },
      deps,
      capability,
    );
    expect(outcome).toEqual({ reply: null, openPageId: "pages-registry/reviews/architecture.v2" });
    expect(resolvePage).toHaveBeenCalledWith("pages-registry/reviews/architecture.v2");
    expect(deps.config).not.toHaveBeenCalled();
    expect(deps.query).not.toHaveBeenCalled();
    expect(deps.read).not.toHaveBeenCalled();
  });

  it("open-page rejects malformed ids before resolving and reports unusable targets without metadata", async () => {
    const resolvePage = vi.fn(async () => false);
    const deps = stubDeps({ resolvePage });
    for (const pageId of [undefined, "", "pages-registry/", "pages-registryevil/x", "docs/x", "/pages-registry/x", "pages-registry/x.md", "pages-registry/../x", "pages-registry/x%2f", "pages-registry/x?y", "https://example.test/x", "pages/x.html"]) {
      const { reply } = await handleBridgeRequest({ bridge: "v0", id: "bad", type: "open-page", pageId }, deps, "none");
      expect((reply as { error: { code: string } }).error.code, String(pageId)).toBe("USAGE");
    }
    expect(resolvePage).not.toHaveBeenCalled();

    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "missing", type: "open-page", pageId: "pages-registry/missing" }, deps, "none");
    expect((reply as { error: { code: string }; result?: unknown }).error.code).toBe("NOT_FOUND");
    expect(reply).not.toHaveProperty("result");
  });

  it("query: fetches by server facets, then applies field/open/limit before replying", async () => {
    const rows = [
      head("tasks/a", { type: "Task", status: "todo" }),
      head("tasks/b", { type: "Task", status: "done" }),
      head("tasks/c", { type: "Task", status: "in_progress" }),
    ];
    const query = vi.fn(async () => rows);
    const deps = stubDeps({ query });
    const { reply } = await handleBridgeRequest(
      { bridge: "v0", id: "7", type: "query", params: { type: "Task", prefix: "tasks/", open: true } },
      deps,
      "bundle-read",
    );
    // Server facets forwarded; the row the Task KIND marks terminal (done) dropped by open.
    expect(query).toHaveBeenCalledWith({ type: "Task", prefix: "tasks/" });
    expect(deps.kinds).toHaveBeenCalled();
    const result = (reply as { result: { rows: DocHead[]; count: number } }).result;
    expect(result.count).toBe(2);
    expect(result.rows.map((r) => r.id)).toEqual(["tasks/a", "tasks/c"]);
  });

  it("query without open never loads the kind registry", async () => {
    const deps = stubDeps({ query: vi.fn(async () => [head("tasks/a", { type: "Task", status: "done" })]) });
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "8", type: "query", params: {} }, deps, "bundle-read");
    expect(deps.kinds).not.toHaveBeenCalled();
    expect((reply as { result: { count: number } }).result.count).toBe(1);
  });

  it("read: returns the doc; a missing docId is a USAGE error", async () => {
    const read = vi.fn(async () => ({ id: "tasks/a", frontmatter: { type: "Task" }, body: "hi" }));
    const deps = stubDeps({ read });
    const ok = await handleBridgeRequest({ bridge: "v0", id: "2", type: "read", docId: "tasks/a" }, deps, "bundle-read");
    expect((ok.reply as { type: string }).type).toBe("read:result");
    expect(read).toHaveBeenCalledWith("tasks/a");

    const bad = await handleBridgeRequest({ bridge: "v0", id: "3", type: "read" }, deps, "bundle-read");
    expect((bad.reply as { type: string; error: { code: string } }).type).toBe("error");
  });

  it("edges: forwards normalized params to the dep and wraps the result with a count", async () => {
    const rows: Edge[] = [
      { from: "roadmap-items/a", to: "tasks/1", text: "contains" },
      { from: "roadmap-items/a", to: "tasks/2", text: "contains" },
    ];
    const edges = vi.fn(async () => rows);
    const deps = stubDeps({ edges });
    const { reply } = await handleBridgeRequest(
      { bridge: "v0", id: "10", type: "edges", params: { from: "roadmap-items/a", text: "contains" } },
      deps,
      "bundle-read",
    );
    expect(edges).toHaveBeenCalledWith({ from: "roadmap-items/a", text: "contains" });
    const result = (reply as { result: { edges: Edge[]; count: number } }).result;
    expect(result.count).toBe(2);
    expect(result.edges).toEqual(rows);
  });

  it("edges: backlinks are a thin {to: docId} call — no separate bridge request needed", async () => {
    const edges = vi.fn(async () => [{ from: "pages-registry/board", to: "docs/core", text: "cites" }]);
    const deps = stubDeps({ edges });
    await handleBridgeRequest({ bridge: "v0", id: "11", type: "edges", params: { to: "docs/core" } }, deps, "bundle-read");
    expect(edges).toHaveBeenCalledWith({ to: "docs/core" });
  });

  it("subscribe: acks and flags a subscription", async () => {
    const { reply, subscribed } = await handleBridgeRequest({ bridge: "v0", id: "4", type: "subscribe" }, stubDeps(), "bundle-read");
    expect(subscribed).toBe(true);
    expect((reply as { type: string }).type).toBe("subscribe:result");
  });

  it("READ-ONLY BY CONSTRUCTION: a would-be mutation is an error reply and touches no dep", async () => {
    const deps = stubDeps();
    for (const type of ["write", "delete", "update", "putDoc", "promote"]) {
      const { reply } = await handleBridgeRequest({ bridge: "v0", id: "9", type, docId: "tasks/a", frontmatter: {} }, deps, "bundle-read");
      const r = reply as { type: string; error: { message: string } };
      expect(r.type).toBe("error");
      expect(r.error.message).toMatch(/read-only/);
    }
    // No handler exists for any of them, so nothing was fetched/read/mutated.
    expect(deps.query).not.toHaveBeenCalled();
    expect(deps.read).not.toHaveBeenCalled();
    expect(deps.edges).not.toHaveBeenCalled();
  });

  it("surfaces a dep failure as a RUNTIME error reply (never throws)", async () => {
    const deps = stubDeps({ query: vi.fn(async () => { throw new Error("boom"); }) });
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "5", type: "query", params: {} }, deps, "bundle-read");
    const r = reply as { type: string; error: { code: string; message: string } };
    expect(r.type).toBe("error");
    expect(r.error.message).toBe("boom");
  });
});

describe("handleBridgeRequest: bridge capability enforcement", () => {
  it("a 'none' capability denies EVERY v0 request type — FORBIDDEN, and touches no dep", async () => {
    const requests: Record<string, unknown> = {
      hello: { bridge: "v0", id: "h", type: "hello" },
      query: { bridge: "v0", id: "q", type: "query", params: {} },
      read: { bridge: "v0", id: "r", type: "read", docId: "tasks/a" },
      edges: { bridge: "v0", id: "e", type: "edges", params: {} },
      subscribe: { bridge: "v0", id: "s", type: "subscribe" },
    };
    for (const [type, msg] of Object.entries(requests)) {
      const deps = stubDeps();
      const { reply, subscribed } = await handleBridgeRequest(msg, deps, "none");
      const r = reply as { type: string; error: { code: string; message: string } };
      expect(r.type, `${type} should error`).toBe("error");
      expect(r.error.code).toBe("FORBIDDEN");
      expect(r.error.message).toMatch(/bridge: none/);
      expect(subscribed).toBeUndefined();
      expect(deps.config).not.toHaveBeenCalled();
      expect(deps.query).not.toHaveBeenCalled();
      expect(deps.read).not.toHaveBeenCalled();
      expect(deps.kinds).not.toHaveBeenCalled();
      expect(deps.edges).not.toHaveBeenCalled();
    }
  });

  it("FAIL-CLOSED DEFAULT: an omitted capability argument denies, same as an explicit 'none'", async () => {
    const deps = stubDeps();
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "1", type: "hello" }, deps);
    expect((reply as { type: string; error: { code: string } }).type).toBe("error");
    expect((reply as { error: { code: string } }).error.code).toBe("FORBIDDEN");
    expect(deps.config).not.toHaveBeenCalled();
  });

  it("a 'bundle-read' capability is answered exactly as before (no change to the happy path)", async () => {
    const deps = stubDeps();
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "1", type: "hello" }, deps, "bundle-read");
    expect((reply as { type: string }).type).toBe("hello:result");
    expect(deps.config).toHaveBeenCalled();
  });
});

describe("resolveBridgeCapability", () => {
  it("honors ONLY the exact string 'bundle-read'", () => {
    expect(resolveBridgeCapability("bundle-read")).toBe("bundle-read");
  });

  it("FAIL-CLOSED: absent, malformed, or any other value denies ('none')", () => {
    expect(resolveBridgeCapability(undefined)).toBe("none");
    expect(resolveBridgeCapability(null)).toBe("none");
    expect(resolveBridgeCapability("none")).toBe("none");
    expect(resolveBridgeCapability("")).toBe("none");
    expect(resolveBridgeCapability("Bundle-Read")).toBe("none"); // case-sensitive, no fuzzy match
    expect(resolveBridgeCapability("bundle-write")).toBe("none");
    expect(resolveBridgeCapability(true)).toBe("none");
    expect(resolveBridgeCapability(1)).toBe("none");
    expect(resolveBridgeCapability({})).toBe("none");
    expect(resolveBridgeCapability(["bundle-read"])).toBe("none");
  });
});

describe("applyRowFilters", () => {
  const rows = [
    head("a", { type: "Task", status: "todo" }),
    head("b", { type: "Task", status: "blocked" }),
    head("c", { type: "Task", status: "done" }),
    head("d", { type: "Task", status: "canceled" }),
  ];

  it("field: k=v with comma-OR", () => {
    expect(applyRowFilters(rows, { field: "status=todo,blocked" }).map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("open: drops rows their OWN kind marks terminal (mirrors list --open; no hardcoded statuses)", () => {
    expect(applyRowFilters(rows, { open: true }, [taskKind()]).map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("open: a row with NO governing kind is kept, whatever its status", () => {
    const ungoverned = [head("x", { type: "Memo", status: "done" }), ...rows];
    expect(applyRowFilters(ungoverned, { open: true }, [taskKind()]).map((r) => r.id)).toEqual(["x", "a", "b"]);
  });

  it("open: a registry with no terminal declarations filters nothing (list --open's structural no-op)", () => {
    expect(applyRowFilters(rows, { open: true }, []).map((r) => r.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("limit: caps after filtering", () => {
    expect(applyRowFilters(rows, { limit: 1 }).map((r) => r.id)).toEqual(["a"]);
  });

  it("limit: 0 means UNLIMITED (matches CLI `list --limit 0`), never an empty slice", () => {
    expect(applyRowFilters(rows, { limit: 0 }).map((r) => r.id)).toEqual(["a", "b", "c", "d"]);
  });

  it("limit: absent returns every row", () => {
    expect(applyRowFilters(rows, {}).map((r) => r.id)).toEqual(["a", "b", "c", "d"]);
  });
});

describe("normalizeQueryParams", () => {
  it("coerces and drops junk", () => {
    expect(normalizeQueryParams({ type: "Task", prefix: " ", field: "status=todo", open: true, limit: 3.7, junk: 1 })).toEqual({
      type: "Task",
      field: "status=todo",
      open: true,
      limit: 3,
    });
  });
  it("returns empty for a non-object", () => {
    expect(normalizeQueryParams(null)).toEqual({});
  });
});

describe("normalizeEdgeParams", () => {
  it("passes through a single from/to id plus text", () => {
    expect(normalizeEdgeParams({ from: "tasks/a", to: "tasks/b", text: "depends on" })).toEqual({
      from: "tasks/a",
      to: "tasks/b",
      text: "depends on",
    });
  });

  it("passes through an array-union from/to (a trailing-slash prefix mixed with an exact id)", () => {
    expect(normalizeEdgeParams({ from: ["tasks/", "roadmap-items/a"] })).toEqual({ from: ["tasks/", "roadmap-items/a"] });
  });

  it("trims strings and drops blank array entries", () => {
    expect(normalizeEdgeParams({ from: [" tasks/a ", "  ", ""], text: "  cites  " })).toEqual({
      from: ["tasks/a"],
      text: "cites",
    });
  });

  it("an entirely-blank facet is 'no restriction', not 'match nothing'", () => {
    expect(normalizeEdgeParams({ from: "   ", to: ["", "  "] })).toEqual({});
  });

  it("drops non-string array entries and junk keys", () => {
    expect(normalizeEdgeParams({ from: ["tasks/a", 42, null], junk: 1 })).toEqual({ from: ["tasks/a"] });
  });

  it("returns empty for a non-object", () => {
    expect(normalizeEdgeParams(null)).toEqual({});
    expect(normalizeEdgeParams(undefined)).toEqual({});
  });
});

describe("changeMessage", () => {
  it("builds a server-initiated change event (no request id)", () => {
    expect(changeMessage([{ id: "a", version: "v2" }], ["b"])).toEqual({
      bridge: BRIDGE_PROTOCOL,
      type: "change",
      event: { changes: [{ id: "a", version: "v2" }], removed: ["b"] },
    });
  });
});
