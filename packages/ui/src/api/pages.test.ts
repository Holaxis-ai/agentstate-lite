import { describe, expect, it, vi } from "vitest";
import { getDoc, listAllHeads } from "./client.js";
import { listPages, pageFromFrontmatter, resolvePageTarget } from "./pages.js";
import type { Frontmatter } from "./types.js";

vi.mock("./client.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./client.js")>();
  return { ...actual, getDoc: vi.fn(), listAllHeads: vi.fn() };
});

describe("pageFromFrontmatter", () => {
  it("defaults 'bridge' to none when the field is absent", () => {
    const fm: Frontmatter = { type: "Page", title: "About", entry: "pages/about.html" };
    expect(pageFromFrontmatter("pages-registry/about", "v1", fm)?.bridge).toBe("none");
  });

  it("honors only the two exact shell capabilities", () => {
    const fm: Frontmatter = { type: "Page", title: "Pulse", entry: "pages/pulse.html", bridge: "bundle-read" };
    expect(pageFromFrontmatter("pages-registry/pulse", "v1", fm)?.bridge).toBe("bundle-read");
    expect(pageFromFrontmatter("pages-registry/pulse", "v1", { ...fm, bridge: "bundle-propose" })?.bridge).toBe("bundle-propose");
  });

  it("FAIL-CLOSED: a malformed or unrecognized 'bridge' value denies (none), same as absent", () => {
    for (const bad of ["Bundle-Read", "bundle-write", "", 1, true, {}, ["bundle-read"]]) {
      const fm: Frontmatter = { type: "Page", title: "X", entry: "pages/x.html", bridge: bad };
      expect(pageFromFrontmatter("pages-registry/x", "v1", fm)?.bridge, `bridge=${JSON.stringify(bad)}`).toBe("none");
    }
  });

  it("reads the current 'access' field, which WINS over a coexisting legacy 'bridge'", () => {
    const fm: Frontmatter = { type: "View", title: "X", entry: "views/x.html", access: "bundle-read" };
    expect(pageFromFrontmatter("views-registry/x", "v1", fm)?.bridge).toBe("bundle-read");
    expect(pageFromFrontmatter("views-registry/x", "v1", { ...fm, access: "none", bridge: "bundle-propose" })?.bridge).toBe("none");
    // A present-but-unrecognized access fail-closes even when the legacy field is permissive.
    expect(pageFromFrontmatter("views-registry/x", "v1", { ...fm, access: "bundle-write", bridge: "bundle-read" })?.bridge).toBe("none");
  });

  it("still returns null when 'entry' is missing, regardless of 'bridge'", () => {
    const fm: Frontmatter = { type: "Page", title: "No entry", bridge: "bundle-read" };
    expect(pageFromFrontmatter("pages-registry/bad", "v1", fm)).toBeNull();
  });

  it("filters launcher entries through the complete registered-Page definition", () => {
    const valid: Frontmatter = { type: "Page", title: "P", entry: "pages/p.html", bridge: "none" };
    expect(pageFromFrontmatter("docs/p", "v1", valid)).toBeNull();
    expect(pageFromFrontmatter("pages-registry/p", "v1", { ...valid, type: "Design" })).toBeNull();
    expect(pageFromFrontmatter("pages-registry/p", "v1", { ...valid, entry: "other/p.html" })).toBeNull();
  });
});

describe("listPages", () => {
  it("merges type View rows with legacy type Page rows — one query per accepted kind name, one sorted launcher list", async () => {
    vi.mocked(listAllHeads).mockImplementation(async ({ type }) => {
      if (type === "Page") {
        return [
          { id: "pages-registry/legacy", version: "v1", frontmatter: { type: "Page", title: "Legacy", entry: "pages/legacy.html", timestamp: "2026-07-01T00:00:00.000Z" } },
        ];
      }
      if (type === "View") {
        return [
          { id: "views-registry/board", version: "v2", frontmatter: { type: "View", title: "Board", entry: "views/board.html", timestamp: "2026-07-02T00:00:00.000Z" } },
        ];
      }
      return [];
    });
    const pages = await listPages();
    expect(listAllHeads).toHaveBeenCalledWith({ type: "Page" });
    expect(listAllHeads).toHaveBeenCalledWith({ type: "View" });
    // Both kinds land in ONE list; ordering stays the launcher's stable newest-first sort.
    expect(pages.map((p) => p.id)).toEqual(["views-registry/board", "pages-registry/legacy"]);
    expect(pages.map((p) => p.entry)).toEqual(["views/board.html", "pages/legacy.html"]);
  });
});

describe("pageFromFrontmatter (View)", () => {
  it("projects a type View doc under views-registry//views/ for the launcher", () => {
    const fm: Frontmatter = { type: "View", title: "Board", entry: "views/board.html", bridge: "bundle-read" };
    expect(pageFromFrontmatter("views-registry/board", "v1", fm)).toMatchObject({
      id: "views-registry/board",
      entry: "views/board.html",
      bridge: "bundle-read",
    });
  });
});

describe("resolvePageTarget", () => {
  it("returns only a boolean from the same registered-Page authority", async () => {
    vi.mocked(getDoc).mockResolvedValue({ doc: { id: "pages-registry/p", frontmatter: { type: "Page", entry: "pages/p.html", bridge: "none" }, body: "secret" }, version: "v1" });
    expect(await resolvePageTarget("pages-registry/p")).toBe(true);
    vi.mocked(getDoc).mockResolvedValue({ doc: { id: "pages-registry/p", frontmatter: { type: "Design", entry: "pages/p.html" }, body: "" }, version: "v2" });
    expect(await resolvePageTarget("pages-registry/p")).toBe(false);
  });

  it("turns missing documents into a false target result", async () => {
    vi.mocked(getDoc).mockRejectedValue(new Error("not found"));
    expect(await resolvePageTarget("pages-registry/missing")).toBe(false);
  });
});
