/**
 * Cross-link extraction and resolution.
 *
 * OKF cross-links are STANDARD markdown links `[text](target)` — NOT
 * `[[wikilinks]]` (SPEC §5). Two target forms are supported and BOTH are
 * resolved here (unlike the reference tooling, which is internally split —
 * its edge-builder counts only relative links while its body-rewriter navigates
 * only absolute ones):
 *   - absolute bundle-relative: `/tables/users.md`   (spec-recommended, move-stable)
 *   - relative:                 `./x.md`, `../refs/m.md`
 * External (`scheme://…`, `mailto:`), in-page (`#…`) and non-`.md` targets are
 * ignored — they never become concept edges. A link to a nonexistent target is
 * still returned (broken links are valid, §5). A link whose resolved target's
 * FINAL SEGMENT is a reserved OKF filename (`index.md`/`log.md`, at any directory
 * level per §3.1) is likewise dropped: reserved files are never concept documents
 * (`paths.ts`'s `isReservedFile` — the ONE reserved-name predicate, reused here
 * rather than restated), so a concept id they'd resolve to (`index`, `docs/log`,
 * …) can never exist in the doc set. Without this guard such a link resolved to a
 * phantom concept id, which surfaced as a false-positive "unresolved link" in
 * `status` and could never become a real graph edge anywhere.
 *
 * These functions are pure and dependency-free (only `node:path` posix helpers),
 * hence directly unit-testable.
 */

import path from "node:path";
import { isReservedFile } from "./paths.js";
import type { ConceptId, Link, OkfDocument } from "./types.js";

/** A raw markdown link as written in the body, before resolution. */
export interface RawLink {
  text: string;
  href: string;
}

// Non-image markdown links: `[text](href)` where href has no spaces. The image
// form `![alt](src)` is filtered out by checking the char preceding `[`.
const MD_LINK_RE = /\[([^\]]*)\]\(([^)\s]+)\)/g;

/** True for links that never become concept edges (external / mail / in-page anchors). */
export function isExternalHref(href: string): boolean {
  const h = href.trim();
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(h) || h.startsWith("mailto:") || h.startsWith("#");
}

/** Extract every non-image markdown link from a body, in document order. */
export function extractMarkdownLinks(body: string): RawLink[] {
  const out: RawLink[] = [];
  for (const m of body.matchAll(MD_LINK_RE)) {
    // Skip image links: `![alt](src)`.
    if (typeof m.index === "number" && m.index > 0 && body[m.index - 1] === "!") continue;
    out.push({ text: m[1] ?? "", href: m[2] ?? "" });
  }
  return out;
}

/**
 * Resolve a raw markdown href to a bundle-relative {@link ConceptId}, or `null`
 * when the href is not an internal `.md` concept link. Absolute hrefs resolve
 * from the bundle root; relative hrefs resolve against the directory of `fromId`.
 */
export function resolveConceptId(fromId: ConceptId, href: string): ConceptId | null {
  // Drop anchor and query before reasoning about the path.
  const target = (href.split("#")[0] ?? "").split("?")[0]?.trim() ?? "";
  if (target === "" || isExternalHref(target)) return null;
  if (!target.endsWith(".md")) return null; // only `.md` targets become concept links

  let resolved: string;
  if (target.startsWith("/")) {
    resolved = target.slice(1);
  } else {
    const slash = fromId.lastIndexOf("/");
    const fromDir = slash >= 0 ? fromId.slice(0, slash) : "";
    // posix.join normalizes `.`/`..` segments deterministically.
    resolved = path.posix.join(fromDir, target);
  }
  // Strip any residual leading `../` that escaped the bundle root (best-effort).
  resolved = resolved.replace(/^(\.\.\/)+/, "");
  // Reserved files (index.md/log.md, any directory level) are never concept
  // documents — a link to one is not a concept edge. Check BEFORE dropping the
  // `.md` suffix, since `isReservedFile` matches on the filename incl. extension.
  if (isReservedFile(resolved)) return null;
  // Drop the `.md` suffix to yield the concept id.
  return resolved.replace(/\.md$/, "");
}

/**
 * Build a bundle-RELATIVE markdown href from `fromId` to a target concept id (or
 * pass an external URL through unchanged). This is the emit-side counterpart of
 * {@link resolveConceptId}: it produces the relative form (`../refs/x.md`,
 * `y.md`) that the OKF reference graph builder counts as an edge — the form
 * VISION and the sample bundles use — rather than the absolute `/…md` form,
 * which the OKF reference graph does not count as a relative concept edge.
 */
export function relativeHref(fromId: ConceptId, target: string): string {
  const t = target.trim();
  if (isExternalHref(t)) return t;
  const targetId = t.replace(/^\/+/, "").replace(/\.md$/, "");
  const slash = fromId.lastIndexOf("/");
  const fromDir = slash >= 0 ? fromId.slice(0, slash) : "";
  let rel = path.posix.relative(fromDir, targetId);
  if (rel === "") rel = path.posix.basename(targetId); // link to a concept in one's own dir
  return `${rel}.md`;
}

/**
 * Outbound resolved cross-links of a document. Non-concept links (external,
 * anchors, non-`.md`) are dropped; broken (unresolved-target) links are kept.
 */
export function parseLinksFromDoc(doc: OkfDocument): Link[] {
  const links: Link[] = [];
  for (const raw of extractMarkdownLinks(doc.body)) {
    const to = resolveConceptId(doc.id, raw.href);
    if (to === null) continue;
    links.push({ from: doc.id, to, text: raw.text, href: raw.href });
  }
  return links;
}
