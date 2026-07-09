import { describe, expect, it, vi } from "vitest";
import {
  handleBridgeRequest,
  applyRowFilters,
  normalizeQueryParams,
  changeMessage,
  BRIDGE_PROTOCOL,
  type BridgeDeps,
} from "./bridge.js";
import type { DocHead, ReadDocResponse } from "../api/types.js";

function head(id: string, frontmatter: Record<string, unknown>): DocHead {
  return { id, version: `v-${id}`, frontmatter: frontmatter as DocHead["frontmatter"] };
}

function stubDeps(overrides: Partial<BridgeDeps> = {}): BridgeDeps {
  return {
    config: vi.fn(async () => ({ root: "/tmp/b", name: "b", mode: "dir" })),
    query: vi.fn(async () => []),
    read: vi.fn(async (): Promise<ReadDocResponse> => ({ id: "x", frontmatter: { type: "Task" }, body: "" })),
    ...overrides,
  };
}

describe("handleBridgeRequest", () => {
  it("ignores a non-bridge message (reply null)", async () => {
    const deps = stubDeps();
    expect(await handleBridgeRequest({ hello: true }, deps)).toEqual({ reply: null });
    expect(await handleBridgeRequest("nope", deps)).toEqual({ reply: null });
    expect(await handleBridgeRequest({ bridge: "v1", type: "hello" }, deps)).toEqual({ reply: null });
  });

  it("hello: returns bundle summary + a read grant", async () => {
    const deps = stubDeps();
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "1", type: "hello" }, deps);
    expect(reply).toMatchObject({
      bridge: "v0",
      id: "1",
      type: "hello:result",
      result: { bundle: { root: "/tmp/b", name: "b" }, mode: "dir", protocol: "v0", grant: "read" },
    });
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
    );
    // Server facets forwarded; terminal `done` row dropped by open.
    expect(query).toHaveBeenCalledWith({ type: "Task", prefix: "tasks/" });
    const result = (reply as { result: { rows: DocHead[]; count: number } }).result;
    expect(result.count).toBe(2);
    expect(result.rows.map((r) => r.id)).toEqual(["tasks/a", "tasks/c"]);
  });

  it("read: returns the doc; a missing docId is a USAGE error", async () => {
    const read = vi.fn(async () => ({ id: "tasks/a", frontmatter: { type: "Task" }, body: "hi" }));
    const deps = stubDeps({ read });
    const ok = await handleBridgeRequest({ bridge: "v0", id: "2", type: "read", docId: "tasks/a" }, deps);
    expect((ok.reply as { type: string }).type).toBe("read:result");
    expect(read).toHaveBeenCalledWith("tasks/a");

    const bad = await handleBridgeRequest({ bridge: "v0", id: "3", type: "read" }, deps);
    expect((bad.reply as { type: string; error: { code: string } }).type).toBe("error");
  });

  it("subscribe: acks and flags a subscription", async () => {
    const { reply, subscribed } = await handleBridgeRequest({ bridge: "v0", id: "4", type: "subscribe" }, stubDeps());
    expect(subscribed).toBe(true);
    expect((reply as { type: string }).type).toBe("subscribe:result");
  });

  it("READ-ONLY BY CONSTRUCTION: a would-be mutation is an error reply and touches no dep", async () => {
    const deps = stubDeps();
    for (const type of ["write", "delete", "update", "putDoc", "promote"]) {
      const { reply } = await handleBridgeRequest({ bridge: "v0", id: "9", type, docId: "tasks/a", frontmatter: {} }, deps);
      const r = reply as { type: string; error: { message: string } };
      expect(r.type).toBe("error");
      expect(r.error.message).toMatch(/read-only/);
    }
    // No handler exists for any of them, so nothing was fetched/read/mutated.
    expect(deps.query).not.toHaveBeenCalled();
    expect(deps.read).not.toHaveBeenCalled();
  });

  it("surfaces a dep failure as a RUNTIME error reply (never throws)", async () => {
    const deps = stubDeps({ query: vi.fn(async () => { throw new Error("boom"); }) });
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "5", type: "query", params: {} }, deps);
    const r = reply as { type: string; error: { code: string; message: string } };
    expect(r.type).toBe("error");
    expect(r.error.message).toBe("boom");
  });
});

describe("applyRowFilters", () => {
  const rows = [
    head("a", { status: "todo" }),
    head("b", { status: "blocked" }),
    head("c", { status: "done" }),
    head("d", { status: "canceled" }),
  ];

  it("field: k=v with comma-OR", () => {
    expect(applyRowFilters(rows, { field: "status=todo,blocked" }).map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("open: drops the built-in terminal statuses", () => {
    expect(applyRowFilters(rows, { open: true }).map((r) => r.id)).toEqual(["a", "b"]);
  });

  it("limit: caps after filtering", () => {
    expect(applyRowFilters(rows, { limit: 1 }).map((r) => r.id)).toEqual(["a"]);
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

describe("changeMessage", () => {
  it("builds a server-initiated change event (no request id)", () => {
    expect(changeMessage([{ id: "a", version: "v2" }], ["b"])).toEqual({
      bridge: BRIDGE_PROTOCOL,
      type: "change",
      event: { changes: [{ id: "a", version: "v2" }], removed: ["b"] },
    });
  });
});
