/** Browser-safe, storage-free query predicate shared by every head-projection consumer. */
import type { ConceptId, Frontmatter, QueryFilter } from "./types.js";

/**
 * THE canonical {@link QueryFilter} predicate — every facet (`prefix`, `type`, `tags`, `fields`),
 * ANDed. Kept in a storage-free module so both Node consumers and the browser View bridge can use
 * the same scalar/array/string-coercion semantics without importing the filesystem-backed engine.
 */
export function matchesFilter(
  doc: { id: ConceptId; frontmatter: Frontmatter },
  filter: QueryFilter,
): boolean {
  if (filter.prefix && !doc.id.startsWith(filter.prefix)) return false;
  if (filter.type && doc.frontmatter.type !== filter.type) return false;
  if (filter.tags && filter.tags.length > 0) {
    const tags = Array.isArray(doc.frontmatter.tags) ? doc.frontmatter.tags : [];
    if (!filter.tags.every((tag) => tags.includes(tag))) return false;
  }
  if (filter.fields) {
    const frontmatter = doc.frontmatter as Record<string, unknown>;
    for (const [key, expected] of Object.entries(filter.fields)) {
      const raw = frontmatter[key];
      const actual =
        raw === undefined || raw === null
          ? []
          : (Array.isArray(raw) ? raw : [raw]).map((value) => String(value));
      if (!actual.includes(expected)) return false;
    }
  }
  return true;
}
