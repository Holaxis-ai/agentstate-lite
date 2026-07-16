import { describe, expect, it } from "vitest";
import {
  isAnyEntryKey,
  isAnyRegistryId,
  isPageEntryKey,
  isPageRegistryId,
  isViewEntryKey,
  isViewRegistryId,
  parseRegisteredPage,
  resolveBridgeCapability,
} from "./registry.js";

describe("Page registry authority", () => {
  it("accepts nested ids and ordinary dots, but rejects malformed or escaping ids", () => {
    for (const valid of ["pages-registry/about", "pages-registry/reviews/architecture.v2"]) {
      expect(isPageRegistryId(valid), valid).toBe(true);
    }
    for (const invalid of [
      "", "pages-registry/", "pages-registryevil/x", "docs/x", "/pages-registry/x",
      "pages-registry/x.md", "pages-registry/./x", "pages-registry/../x", "pages-registry/x//y",
      "pages-registry/.hidden", "pages-registry/reviews/.draft",
      "pages-registry/x\\y", "pages-registry/x%2fy", "pages-registry/x?y", "pages-registry/x#y",
      "pages-registry/http:x", "pages-registry/has space", "https://example.test/pages-registry/x",
    ]) expect(isPageRegistryId(invalid), invalid).toBe(false);
  });

  it("applies the same segment grammar to entries strictly under pages/", () => {
    expect(isPageEntryKey("pages/about.html")).toBe(true);
    expect(isPageEntryKey("pages/reviews/architecture.v2.html")).toBe(true);
    for (const invalid of [
      "pages/", "pagesevil/x", "/pages/x", "pages/../x", "pages/.hidden.html",
      "pages/reviews/.draft.html", "pages/x%2f.html", "pages/x?raw",
    ]) {
      expect(isPageEntryKey(invalid), invalid).toBe(false);
    }
  });

  it("requires the registry namespace, type Page, and safe entry", () => {
    const fm = { type: "Page", title: "About", entry: "pages/about.html", bridge: "bundle-read" };
    expect(parseRegisteredPage("pages-registry/about", fm)).toMatchObject({ title: "About", entry: "pages/about.html", bridge: "bundle-read", type: "Page" });
    expect(parseRegisteredPage("docs/about", fm)).toBeNull();
    expect(parseRegisteredPage("pages-registry/about", { ...fm, type: "Design" })).toBeNull();
    expect(parseRegisteredPage("pages-registry/about", { ...fm, entry: "other/about.html" })).toBeNull();
  });

  it("accepts type View over the views-registry//views/ namespaces with the same strictness", () => {
    const fm = { type: "View", title: "Board", entry: "views/board.html", bridge: "bundle-read" };
    expect(parseRegisteredPage("views-registry/board", fm)).toMatchObject({
      id: "views-registry/board",
      title: "Board",
      entry: "views/board.html",
      bridge: "bundle-read",
      type: "View",
    });
    // The kind name and the prefixes are accepted independently — ids never move under the
    // dual-read window, so a legacy-prefixed doc may adopt the new name (and vice versa).
    expect(parseRegisteredPage("pages-registry/board", { ...fm, entry: "pages/board.html" })).toMatchObject({ type: "View" });
    expect(parseRegisteredPage("views-registry/board", { ...fm, type: "Page" })).toMatchObject({ type: "Page" });
    // Same strictness: no trimming, no case-folding, no other kind names.
    expect(parseRegisteredPage("views-registry/board", { ...fm, type: "view" })).toBeNull();
    expect(parseRegisteredPage("views-registry/board", { ...fm, type: "View " })).toBeNull();
    expect(parseRegisteredPage("views-registry/../x", fm)).toBeNull();
    expect(parseRegisteredPage("views-registry/board", { ...fm, entry: "views/../x.html" })).toBeNull();
  });

  it("exposes the view-prefix grammar wrappers alongside the legacy ones (one helper, two prefixes)", () => {
    expect(isViewRegistryId("views-registry/board")).toBe(true);
    expect(isViewRegistryId("pages-registry/board")).toBe(false);
    expect(isViewEntryKey("views/board.html")).toBe(true);
    expect(isViewEntryKey("pages/board.html")).toBe(false);
    expect(isAnyRegistryId("pages-registry/board")).toBe(true);
    expect(isAnyRegistryId("views-registry/board")).toBe(true);
    expect(isAnyEntryKey("pages/board.html")).toBe(true);
    expect(isAnyEntryKey("views/board.html")).toBe(true);
  });

  it("parses bridge grants fail-closed", () => {
    expect(resolveBridgeCapability("bundle-read")).toBe("bundle-read");
    for (const value of [undefined, "none", "Bundle-Read", "bundle-write", true]) {
      expect(resolveBridgeCapability(value)).toBe("none");
    }
  });
});
