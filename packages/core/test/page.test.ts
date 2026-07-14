import test from "node:test";
import assert from "node:assert/strict";

import { isPageEntryKey, isPageRegistryId } from "../src/page.js";

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
