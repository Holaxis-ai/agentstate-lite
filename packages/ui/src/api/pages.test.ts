import { describe, expect, it } from "vitest";
import { pageFromFrontmatter } from "./pages.js";
import type { Frontmatter } from "./types.js";

describe("pageFromFrontmatter", () => {
  it("defaults 'bridge' to none when the field is absent", () => {
    const fm: Frontmatter = { type: "Page", title: "About", entry: "pages/about.html" };
    expect(pageFromFrontmatter("pages-registry/about", "v1", fm)?.bridge).toBe("none");
  });

  it("honors ONLY the exact string 'bundle-read'", () => {
    const fm: Frontmatter = { type: "Page", title: "Pulse", entry: "pages/pulse.html", bridge: "bundle-read" };
    expect(pageFromFrontmatter("pages-registry/pulse", "v1", fm)?.bridge).toBe("bundle-read");
  });

  it("FAIL-CLOSED: a malformed or unrecognized 'bridge' value denies (none), same as absent", () => {
    for (const bad of ["Bundle-Read", "bundle-write", "", 1, true, {}, ["bundle-read"]]) {
      const fm: Frontmatter = { type: "Page", title: "X", entry: "pages/x.html", bridge: bad };
      expect(pageFromFrontmatter("pages-registry/x", "v1", fm)?.bridge, `bridge=${JSON.stringify(bad)}`).toBe("none");
    }
  });

  it("still returns null when 'entry' is missing, regardless of 'bridge'", () => {
    const fm: Frontmatter = { type: "Page", title: "No entry", bridge: "bundle-read" };
    expect(pageFromFrontmatter("pages-registry/bad", "v1", fm)).toBeNull();
  });
});
