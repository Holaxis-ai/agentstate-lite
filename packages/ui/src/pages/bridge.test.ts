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
    fields: { required: ["title", "status"], optional: [], values: { status: ["todo", "in_progress", "blocked", "done", "canceled"] }, terminal: { status: ["done", "canceled"] } },
  };
}

function stubDeps(overrides: Partial<BridgeDeps> = {}): BridgeDeps {
  return {
    config: vi.fn(async () => ({ root: "/tmp/b", name: "b", mode: "dir" })),
    query: vi.fn(async () => []),
    read: vi.fn(async (): Promise<ReadDocResponse> => ({ id: "x", frontmatter: { type: "Task" }, body: "" })),
    kinds: vi.fn(async () => [taskKind()]),
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
    // Server facets forwarded; the row the Task KIND marks terminal (done) dropped by open.
    expect(query).toHaveBeenCalledWith({ type: "Task", prefix: "tasks/" });
    expect(deps.kinds).toHaveBeenCalled();
    const result = (reply as { result: { rows: DocHead[]; count: number } }).result;
    expect(result.count).toBe(2);
    expect(result.rows.map((r) => r.id)).toEqual(["tasks/a", "tasks/c"]);
  });

  it("query without open never loads the kind registry", async () => {
    const deps = stubDeps({ query: vi.fn(async () => [head("tasks/a", { type: "Task", status: "done" })]) });
    const { reply } = await handleBridgeRequest({ bridge: "v0", id: "8", type: "query", params: {} }, deps);
    expect(deps.kinds).not.toHaveBeenCalled();
    expect((reply as { result: { count: number } }).result.count).toBe(1);
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
