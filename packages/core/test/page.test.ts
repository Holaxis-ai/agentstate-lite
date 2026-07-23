import test from "node:test";
import assert from "node:assert/strict";

import {
  declaredAccessValue,
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
  parseRegistration,
  resolveBridgeCapability,
  resolveDeclaredAccess,
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
    // PR #54 review finding 1 (tasks/pr-54-review-followups): a MID-PATH `.md` segment must be
    // rejected too, not just a trailing one — it would create an on-disk directory that blocks a
    // future doc write to id `pages-registry/x` (the entry-key side already rejected this shape
    // via assertSafeBlobKey; the registry-id side did not). Checked case-insensitively.
    "pages-registry/x.md/y",
    "pages-registry/X.MD/y",
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
    // PR #54 review finding 1's exact literal shape, pinned on the entry-key side too.
    "pages/x.MD/y.html",
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
    "views-registry/x.md/y",
    "views-registry/X.MD/y",
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
    "views/x.MD/y.html",
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

test("parseRegistration: THE one registration predicate — valid triples parse, in both namespaces", () => {
  assert.deepEqual(parseRegistration("pages-registry/about", { type: "Page", entry: "pages/about.html" }), {
    id: "pages-registry/about",
    type: "Page",
    entry: "pages/about.html",
  });
  assert.deepEqual(parseRegistration("views-registry/board", { type: "View", entry: "views/board.html" }), {
    id: "views-registry/board",
    type: "View",
    entry: "views/board.html",
  });
  // Names and prefixes are accepted independently (ids never move under the dual-read window).
  assert.deepEqual(parseRegistration("pages-registry/board", { type: "View", entry: "pages/board.html" })?.type, "View");
});

test("parseRegistration: rejects an invalid registry id even when the entry is valid (the mint/serve drift hole)", () => {
  for (const id of ["notes/foo", "docs/x", "pages-registryevil/x", "pages-registry/x.md", "pages-registry/x.md/y", "pages-registry/../x", "", undefined]) {
    assert.equal(parseRegistration(id, { type: "Page", entry: "pages/about.html" }), null, String(id));
    assert.equal(parseRegistration(id, { type: "View", entry: "views/board.html" }), null, String(id));
  }
});

test("parseRegistration: rejects a nonempty malformed or off-prefix entry even when id and type are valid", () => {
  for (const entry of [
    "secrets/creds.bin",
    "pages/has space.html",
    "pages/../x.html",
    "pages/.hidden.html",
    "views/has space.html",
    "views-registry/x.html",
    "pages",
    "",
    undefined,
    1,
  ]) {
    assert.equal(parseRegistration("pages-registry/about", { type: "Page", entry }), null, JSON.stringify(entry));
    assert.equal(parseRegistration("views-registry/board", { type: "View", entry }), null, JSON.stringify(entry));
  }
});

test("parseRegistration: rejects any type outside the exact accepted names, even with valid id + entry", () => {
  for (const type of ["Design", "page", "View ", " Page", "", undefined, null, 1]) {
    assert.equal(parseRegistration("pages-registry/about", { type, entry: "pages/about.html" }), null, JSON.stringify(type));
  }
});

test("resolveDeclaredAccess: a legacy bridge-only doc resolves IDENTICALLY to the enum resolver — byte-for-byte the pre-rename behavior", () => {
  for (const value of ["none", "bundle-read", "bundle-propose"]) {
    assert.equal(resolveDeclaredAccess({ bridge: value }), resolveBridgeCapability(value));
    assert.equal(resolveDeclaredAccess({ bridge: value }), value);
    assert.equal(declaredAccessValue({ bridge: value }), value);
  }
});

test("resolveDeclaredAccess: the current field is read under its own name", () => {
  for (const value of ["none", "bundle-read", "bundle-propose"]) {
    assert.equal(resolveDeclaredAccess({ access: value }), value);
    assert.equal(declaredAccessValue({ access: value }), value);
  }
});

test("resolveDeclaredAccess: a doc carrying BOTH fields is decided by access ALONE — bridge can never widen the grant", () => {
  assert.equal(resolveDeclaredAccess({ access: "bundle-read", bridge: "bundle-propose" }), "bundle-read");
  assert.equal(resolveDeclaredAccess({ access: "bundle-propose", bridge: "none" }), "bundle-propose");
  assert.equal(resolveDeclaredAccess({ access: "none", bridge: "bundle-read" }), "none");
  // A PRESENT-but-unrecognized access never falls through to a permissive bridge value.
  assert.equal(resolveDeclaredAccess({ access: "bundle-write", bridge: "bundle-read" }), "none");
  assert.equal(resolveDeclaredAccess({ access: null, bridge: "bundle-propose" }), "none");
  assert.equal(resolveDeclaredAccess({ access: undefined, bridge: "bundle-read" }), "none");
});

test("resolveDeclaredAccess: unrecognized values in EITHER field fail closed to none", () => {
  const invalid = [undefined, null, "", "BUNDLE-READ", "bundle_read", "read", "propose", " bundle-read", "bundle-read ", 1, true, ["bundle-read"], {}];
  for (const bad of invalid) {
    assert.equal(resolveDeclaredAccess({ access: bad }), "none", `access=${JSON.stringify(bad)}`);
    assert.equal(resolveDeclaredAccess({ bridge: bad }), "none", `bridge=${JSON.stringify(bad)}`);
  }
  assert.equal(resolveDeclaredAccess({}), "none");
});
