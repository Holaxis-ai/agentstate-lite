// The ONE legacy-naming primitive for the Page→View kind rename (Option C+,
// plans/rename-page-kind-to-view; the removal phase is tasks/remove-legacy-page-bridge-support).
// 'Page' is the LEGACY name of the 'View' kind and 'bridge' the legacy spelling of its `access`
// field — and as of the removal phase the runtime no longer ACCEPTS either: a Page-typed doc does
// not register, and a bridge-only doc resolves to `access: none`. Legacy folder LOCATIONS
// (`pages-registry/`/`pages/`) remain recognized — only the names are retired. The repo's
// `migrate-legacy-view-names` script renames legacy content in place.
//
// The literals below are DELIBERATE, and this module is their one home: post-removal these docs
// fall OUT of core's `isPageTypeName`/`declaredAccessValue` recognition, so a diagnostic for them
// cannot ride the live grammar — it must detect exactly what the runtime no longer accepts. That
// is what a removal diagnostic is FOR; do not "fix" these to import core's accepted names.
// Consumed by two read-only surfaces:
//
//   1. The WRITE-TIME HINT: the doc-authoring verbs (`new`/`doc write`/`doc update`, and
//      `promote`'s `.md` route) attach {@link LEGACY_PAGE_TYPE_HINT} to a SUCCESS receipt when
//      the produced doc's type is the legacy name — authoring moments only, never reads, never a
//      block (a Page-typed doc is still a perfectly legal OKF doc; it just isn't a View).
//   2. The `status` legacy_naming FINDING: counts + ids of Page-typed docs and of docs carrying
//      an own legacy `bridge` field (the stock the runtime now ignores), plus an informational,
//      STORE-AWARE count of items under the legacy id prefixes (locations — still recognized).
//
// Do not fork these predicates into a consumer — a second compare would be exactly the
// parallel-implementation class gate 3 forbids.

/** The retired legacy kind name, frozen as a historical fact (see the module comment). */
export const LEGACY_PAGE_TYPE_NAME = "Page";

/**
 * True when this frontmatter declares the LEGACY kind name: `type` exactly `"Page"` — the same
 * EXACT-match strictness core's grammar applies (`isPageTypeName`, `core/src/page.ts`), so what
 * this module flags as legacy is precisely the spelling the pre-removal dual-read accepted. No
 * trimming: YAML plain scalars are whitespace-trimmed by the YAML parser itself, so a value that
 * reaches consumers with surrounding whitespace was deliberately QUOTED (`type: " Page "`) —
 * that was never a registration under any phase, and this predicate agrees it is not legacy.
 */
export function isLegacyPageDoc(frontmatter: Record<string, unknown>): boolean {
  return frontmatter["type"] === LEGACY_PAGE_TYPE_NAME;
}

/**
 * True when this frontmatter carries an OWN legacy `bridge` field on a View-kind doc (current
 * `View` or legacy `Page` spelling). Scope mirrors the migration script's `planDocChange`:
 * `bridge` is only the View kind's legacy capability spelling, not a reserved word — a doc of any
 * OTHER type carrying `bridge` is ordinary user data and is never flagged. Own-property-gated for
 * the same reason core's `declaredAccessValue` is.
 */
export function hasLegacyBridgeField(frontmatter: Record<string, unknown>): boolean {
  const viewKind = frontmatter["type"] === LEGACY_PAGE_TYPE_NAME || frontmatter["type"] === "View";
  return viewKind && Object.hasOwn(frontmatter, "bridge");
}

/**
 * The legacy id prefixes, frozen as historical facts (they mirror the legacy-location values
 * core's grammar still accepts; a LEGACY constant can never change by definition, so this is
 * deliberately not an import from the live grammar — `legacy-constants-tripwire.test.ts` pins
 * the two sides equal by assertion instead).
 */
export const LEGACY_PAGE_REGISTRY_PREFIX = "pages-registry/";
export const LEGACY_PAGE_BLOB_PREFIX = "pages/";

/**
 * INFORMATIONAL, STORE-AWARE classifiers: registry docs live in the CONCEPT-DOC store and are
 * legacy only under `pages-registry/`; entries live in the BLOB store and are legacy only under
 * `pages/`. The split matters — an unrelated concept doc at e.g. `pages/manual` is NOT a legacy
 * item (the legacy doc prefix is the registry one), so a cross-store check would over-count.
 * Old-prefix LOCATIONS remain fully recognized — a `true` here is REPORTED (the `status`
 * legacy_naming section), never warned about or acted on.
 */
export function isLegacyRegistryDocId(id: string): boolean {
  return id.startsWith(LEGACY_PAGE_REGISTRY_PREFIX);
}

/** See {@link isLegacyRegistryDocId} — the blob-store half. */
export function isLegacyEntryBlobKey(key: string): boolean {
  return key.startsWith(LEGACY_PAGE_BLOB_PREFIX);
}

/**
 * The ONE write-time hint line (receipt `hint` field, matching `init`/`sync`'s hint idiom).
 * Fired only by doc-authoring verbs on a SUCCESS receipt whose produced doc is legacy-typed.
 */
export const LEGACY_PAGE_TYPE_HINT =
  "type 'Page' is the legacy name for the 'View' kind and is no longer registered — the ui launcher ignores Page-typed docs. Author dashboards with --type View; migrate existing legacy content in place with the repo's scripts/migrate-legacy-view-names.mjs.";
