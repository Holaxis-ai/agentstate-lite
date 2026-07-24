// The ONE legacy-naming primitive for the Page→View kind rename (Option C+,
// plans/rename-page-kind-to-view — Unit 2). 'Page' is the LEGACY name of the 'View' kind —
// transitional, not permanent: legacy-typed docs and old-prefix ids stay legal during the
// migration window (nothing is warned-as-wrong), the repo's `migrate-legacy-view-names` script
// renames legacy content in place (old-prefix LOCATIONS stay recognized; relocation is a
// separate open decision), and removal of legacy support is a planned later phase. This module
// is the single owner of that classification, consumed by exactly
// two read-only surfaces:
//
//   1. The WRITE-TIME NUDGE: the doc-authoring verbs (`new`/`doc write`/`doc update`, and
//      `promote`'s `.md` route) attach {@link LEGACY_PAGE_TYPE_HINT} to a SUCCESS receipt when
//      the produced doc's type is the legacy name — authoring moments only, never reads, never a
//      warning, never a block.
//   2. The `status` AUDIT section (`legacy_naming`): counts + ids of legacy-typed docs, plus an
//      informational, STORE-AWARE count of items under the legacy id prefixes.
//
// Do not fork these predicates into a consumer — a second compare would be exactly the
// parallel-implementation class gate 3 forbids.

/**
 * True when this frontmatter declares the LEGACY kind name: `type` exactly `"Page"` — the same
 * EXACT match core's legacy/current grammar applies (`isPageTypeName`, `core/src/page.ts`), so
 * what this module counts as legacy is precisely what dual-read accepts as the legacy
 * registration name. No trimming: YAML plain scalars are whitespace-trimmed by the YAML parser
 * itself, so a value that reaches consumers with surrounding whitespace was deliberately QUOTED
 * (`type: " Page "`) — core rejects that as a registration, and this predicate agrees it is not
 * legacy.
 */
export function isLegacyPageDoc(frontmatter: Record<string, unknown>): boolean {
  return frontmatter["type"] === "Page";
}

/**
 * The legacy id prefixes, frozen as historical facts (they mirror the legacy values core's
 * dual-read grammar accepts; a LEGACY constant can never change by definition, so this is
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
 * Old-prefix ids are fully legal under Option C+ — a `true` here is REPORTED (the `status`
 * audit), never warned about or acted on.
 */
export function isLegacyRegistryDocId(id: string): boolean {
  return id.startsWith(LEGACY_PAGE_REGISTRY_PREFIX);
}

/** See {@link isLegacyRegistryDocId} — the blob-store half. */
export function isLegacyEntryBlobKey(key: string): boolean {
  return key.startsWith(LEGACY_PAGE_BLOB_PREFIX);
}

/**
 * The ONE write-time nudge line (receipt `hint` field, matching `init`/`sync`'s hint idiom).
 * Fired only by doc-authoring verbs on a SUCCESS receipt whose produced doc is legacy-typed.
 */
export const LEGACY_PAGE_TYPE_HINT =
  "type 'Page' is the legacy name for the 'View' kind — existing Page docs keep working during the migration window (the migrate-legacy-view-names script renames them in place; removal of legacy support is a planned later phase); author new dashboards with --type View.";
