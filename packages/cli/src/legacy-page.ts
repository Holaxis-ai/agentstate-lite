// The ONE legacy-naming primitive for the Page→View kind rename (Option C+,
// plans/rename-page-kind-to-view — Unit 2). 'Page' is the LEGACY name of the 'View' kind;
// legacy-typed docs and old-prefix ids stay fully legal forever (nothing migrates, nothing is
// warned-as-wrong). This module is the single owner of that classification, consumed by exactly
// two read-only surfaces:
//
//   1. The WRITE-TIME NUDGE: `new`/`doc write`/`doc update` attach {@link LEGACY_PAGE_TYPE_HINT}
//      to a SUCCESS receipt when the produced doc's type is Page — authoring moments only, never
//      reads, never a warning, never a block.
//   2. The `status` AUDIT section (`legacy_naming`): counts + ids of Page-typed docs, plus an
//      informational count of items still under the legacy id prefixes.
//
// Do not fork this predicate into a consumer — a second trim/compare would be exactly the
// parallel-implementation class gate 3 forbids.

/**
 * True when this frontmatter declares the LEGACY kind name: `type: Page` (trimmed, case-sensitive
 * — OKF `type` values are exact strings everywhere else, so `page`/`PAGE` are simply other types,
 * not legacy near-misses).
 */
export function isLegacyPageDoc(frontmatter: Record<string, unknown>): boolean {
  const type = frontmatter["type"];
  return typeof type === "string" && type.trim() === "Page";
}

/**
 * The legacy id prefixes, frozen as historical facts (they mirror what `core/page.ts` /
 * `ui/pages.ts` hardcoded before the rename; a LEGACY constant can never change by definition,
 * so this is deliberately not an import from the live grammar).
 */
export const LEGACY_PAGE_REGISTRY_PREFIX = "pages-registry/";
export const LEGACY_PAGE_BLOB_PREFIX = "pages/";

/**
 * INFORMATIONAL classifier: which legacy prefix (if any) this concept id / blob key sits under.
 * Old-prefix ids are fully legal under Option C+ — a non-null result is REPORTED (the `status`
 * audit), never warned about or acted on.
 */
export function legacyPagePrefixOf(idOrKey: string): typeof LEGACY_PAGE_REGISTRY_PREFIX | typeof LEGACY_PAGE_BLOB_PREFIX | null {
  if (idOrKey.startsWith(LEGACY_PAGE_REGISTRY_PREFIX)) return LEGACY_PAGE_REGISTRY_PREFIX;
  if (idOrKey.startsWith(LEGACY_PAGE_BLOB_PREFIX)) return LEGACY_PAGE_BLOB_PREFIX;
  return null;
}

/**
 * The ONE write-time nudge line (receipt `hint` field, matching `init`/`sync`'s hint idiom).
 * Fired only by authoring verbs on a SUCCESS receipt whose produced doc is Page-typed.
 */
export const LEGACY_PAGE_TYPE_HINT =
  "type 'Page' is the legacy name for the 'View' kind — existing Page docs keep working and never need migrating; author new dashboards with --type View.";
