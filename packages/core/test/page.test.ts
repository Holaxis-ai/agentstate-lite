import test from "node:test";
import assert from "node:assert/strict";

import {
  isAnyEntryKey,
  isAnyRegistryId,
  isPageEntryKey,
  isPageRegistryId,
  isPageTypeName,
  isViewEntryKey,
  isViewRegistryId,
  PAGE_ENTRY_PREFIX,
  PAGE_REGISTRY_PREFIX,
  PAGE_TYPE_NAMES,
  VIEW_ENTRY_PREFIX,
  VIEW_REGISTRY_PREFIX,
} from "../src/page.js";

test("Page registry ids preserve valid nested runtime identities", () => {
  for (const valid of ["pages-registry/about", "pages-registry/reviews/architecture.v2", "pages-registry/X_1-y"]) {
    assert.equal(isPageRegistryId(valid), true, valid);
  }
});

test("Page registry ids reject paths that discovery cannot round-trip", () => {
  for (const invalid of [
    "",
    "pages-registry/",
    "pages-registryevil/x",
    "docs/x",
    "/pages-registry/x",
    "pages-registry/x.md",
    "pages-registry/./x",
    "pages-registry/../x",
    "pages-registry/x//y",
    "pages-registry/.hidden",
    "pages-registry/reviews/.draft",
    "pages-registry/x\\y",
    "pages-registry/x%2fy",
    "pages-registry/x?y",
    "pages-registry/x#y",
    "pages-registry/http:x",
    "pages-registry/has space",
    "pages-registry/résumé",
    "https://example.test/pages-registry/x",
  ]) {
    assert.equal(isPageRegistryId(invalid), false, invalid);
  }
});

test("Page entry keys preserve valid nested blob identities", () => {
  for (const valid of ["pages/about.html", "pages/reviews/architecture.v2.html", "pages/X_1-y.html"]) {
    assert.equal(isPageEntryKey(valid), true, valid);
  }
});

test("Page entry keys reject paths that storage or discovery cannot round-trip", () => {
  for (const invalid of [
    "",
    "pages/",
    "pagesevil/x",
    "/pages/x",
    "pages/../x",
    "pages/.hidden.html",
    "pages/reviews/.draft.html",
    "pages/x\\y.html",
    "pages/x%2f.html",
    "pages/x?raw",
    "pages/x#fragment",
    "pages/http:x.html",
    "pages/has space.html",
    "pages/résumé.html",
    "pages/assets.md/review.html",
    "pages/assets.MD/review.html",
  ]) {
    assert.equal(isPageEntryKey(invalid), false, invalid);
  }
});

test("prefix constants pin the exact accepted namespaces (current + legacy)", () => {
  assert.equal(PAGE_REGISTRY_PREFIX, "pages-registry/");
  assert.equal(PAGE_ENTRY_PREFIX, "pages/");
  assert.equal(VIEW_REGISTRY_PREFIX, "views-registry/");
  assert.equal(VIEW_ENTRY_PREFIX, "views/");
});

test("View registry ids preserve valid nested runtime identities (the SAME grammar over views-registry/)", () => {
  for (const valid of ["views-registry/about", "views-registry/reviews/architecture.v2", "views-registry/X_1-y"]) {
    assert.equal(isViewRegistryId(valid), true, valid);
    assert.equal(isAnyRegistryId(valid), true, valid);
  }
});

test("View registry ids reject the SAME safe-segment attacks the legacy grammar rejects", () => {
  for (const invalid of [
    "",
    "views-registry/",
    "views-registryevil/x",
    "docs/x",
    "/views-registry/x",
    "views-registry/x.md",
    "views-registry/./x",
    "views-registry/../x",
    "views-registry/x//y",
    "views-registry/.hidden",
    "views-registry/reviews/.draft",
    "views-registry/x\\y",
    "views-registry/x%2fy",
    "views-registry/x?y",
    "views-registry/x#y",
    "views-registry/http:x",
    "views-registry/has space",
    "views-registry/résumé",
    "https://example.test/views-registry/x",
  ]) {
    assert.equal(isViewRegistryId(invalid), false, invalid);
    assert.equal(isAnyRegistryId(invalid), false, invalid);
  }
});

test("View entry keys preserve valid nested blob identities and reject the same attacks", () => {
  for (const valid of ["views/about.html", "views/reviews/architecture.v2.html", "views/X_1-y.html"]) {
    assert.equal(isViewEntryKey(valid), true, valid);
    assert.equal(isAnyEntryKey(valid), true, valid);
  }
  for (const invalid of [
    "",
    "views/",
    "viewsevil/x",
    "/views/x",
    "views/../x",
    "views/.hidden.html",
    "views/reviews/.draft.html",
    "views/x\\y.html",
    "views/x%2f.html",
    "views/x?raw",
    "views/x#fragment",
    "views/http:x.html",
    "views/has space.html",
    "views/résumé.html",
    "views/assets.md/review.html",
    "views/assets.MD/review.html",
  ]) {
    assert.equal(isViewEntryKey(invalid), false, invalid);
    assert.equal(isAnyEntryKey(invalid), false, invalid);
  }
});

test("the per-prefix wrappers never cross-accept — a views id is not a pages id and vice versa", () => {
  assert.equal(isPageRegistryId("views-registry/x"), false);
  assert.equal(isViewRegistryId("pages-registry/x"), false);
  assert.equal(isPageEntryKey("views/x.html"), false);
  assert.equal(isViewEntryKey("pages/x.html"), false);
  // The registry prefix is not an entry prefix in either direction.
  assert.equal(isViewEntryKey("views-registry/x.html"), false);
  assert.equal(isViewRegistryId("views/x"), false);
  // The combined wrappers accept both namespaces.
  assert.equal(isAnyRegistryId("pages-registry/x"), true);
  assert.equal(isAnyRegistryId("views-registry/x"), true);
  assert.equal(isAnyEntryKey("pages/x.html"), true);
  assert.equal(isAnyEntryKey("views/x.html"), true);
});

test("isPageTypeName accepts exactly the registered kind names — same strictness as a literal equality", () => {
  assert.deepEqual([...PAGE_TYPE_NAMES], ["Page", "View"]);
  assert.equal(isPageTypeName("Page"), true);
  assert.equal(isPageTypeName("View"), true);
  for (const invalid of ["page", "view", "VIEW", " View", "View ", "Views", "Pages", "", undefined, null, 1, ["View"]]) {
    assert.equal(isPageTypeName(invalid), false, JSON.stringify(invalid));
  }
});
