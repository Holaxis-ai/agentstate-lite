import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_BOARD_SHAPE, fetchBoardShape, humanizeEnumValue } from "./boardShape.js";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("humanizeEnumValue", () => {
  it("replaces underscores with spaces and capitalizes only the first character", () => {
    expect(humanizeEnumValue("in_progress")).toBe("In progress");
    expect(humanizeEnumValue("done")).toBe("Done");
    expect(humanizeEnumValue("todo")).toBe("Todo");
  });
});

describe("fetchBoardShape", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("derives the shape from a bundle-declared Task convention doc", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, {
        count: 1,
        docs: [
          {
            id: "conventions/task",
            version: "v1",
            frontmatter: {
              type: "Convention",
              governs: "Task",
              fields: { required: ["title", "status"], optional: [], values: { status: ["todo", "in_progress", "done"] } },
            },
          },
        ],
        next_cursor: null,
      }),
    );

    const shape = await fetchBoardShape();
    expect(shape).toEqual({ docType: "Task", enumField: "status", values: ["todo", "in_progress", "done"] });

    // Confirms it queried the conventions/ prefix + Convention type, not a hardcoded Task scan.
    const [url] = fetchMock.mock.calls[0] as [string];
    expect(url).toContain("prefix=conventions%2F");
    expect(url).toContain("type=Convention");
  });

  it("falls back to DEFAULT_BOARD_SHAPE when no convention governs Task (a conventions-free bundle)", async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse(200, { count: 0, docs: [], next_cursor: null }));
    const shape = await fetchBoardShape();
    expect(shape).toEqual(DEFAULT_BOARD_SHAPE);
  });

  it("falls back to DEFAULT_BOARD_SHAPE when the matching convention's fields.values is malformed", async () => {
    fetchMock.mockResolvedValueOnce(
      jsonResponse(200, {
        count: 1,
        docs: [{ id: "conventions/task", version: "v1", frontmatter: { type: "Convention", governs: "Task", fields: {} } }],
        next_cursor: null,
      }),
    );
    const shape = await fetchBoardShape();
    expect(shape).toEqual(DEFAULT_BOARD_SHAPE);
  });

  it("falls back to DEFAULT_BOARD_SHAPE on a transport failure — never throws", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("network down"));
    const shape = await fetchBoardShape();
    expect(shape).toEqual(DEFAULT_BOARD_SHAPE);
  });
});
