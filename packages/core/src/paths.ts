/**
 * Pure path helpers for OKF concept identity and reserved-file handling.
 *
 * A *Concept ID* is a bundle-relative path with the trailing `.md` removed
 * (`tables/users.md` -> `tables/users`); IDs use forward slashes. Two filenames
 * are RESERVED at any directory level — `index.md` (§6) and `log.md` (§7) — and
 * are NOT concept documents (they carry no `type` and are excluded from queries).
 *
 * Everything here is pure and dependency-free, hence directly unit-testable.
 */

import type { ConceptId } from "./types.js";

/** The two OKF reserved filenames, valid at any directory level (§3.1). */
export const RESERVED_FILENAMES = ["index.md", "log.md"] as const;

/** Normalize any separators to forward slashes and collapse duplicate slashes. */
export function toPosix(p: string): string {
  return p.replace(/\\/g, "/").replace(/\/{2,}/g, "/");
}

/**
 * True when the bundle-relative path's final segment is a reserved OKF filename
 * (`index.md` / `log.md`) at ANY directory level.
 */
export function isReservedFile(relPath: string): boolean {
  const base = toPosix(relPath).split("/").pop() ?? "";
  return (RESERVED_FILENAMES as readonly string[]).includes(base);
}

/**
 * Concept ID from a bundle-relative markdown file path: normalize separators,
 * drop a leading `./` or `/`, and strip the trailing `.md`.
 */
export function conceptIdFromPath(relPath: string): ConceptId {
  const norm = toPosix(relPath).replace(/^\.?\//, "");
  return norm.endsWith(".md") ? norm.slice(0, -3) : norm;
}

/** Bundle-relative markdown file path for a concept ID (adds `.md` exactly once). */
export function pathFromConceptId(id: ConceptId): string {
  const norm = toPosix(id).replace(/^\.?\//, "").replace(/\.md$/, "");
  return `${norm}.md`;
}

/**
 * Guard a concept ID against path traversal / absolute escape before it is joined
 * onto the bundle root for a filesystem read or write. Throws on empty ids,
 * absolute ids, or any `..` segment.
 */
export function assertSafeConceptId(id: ConceptId): void {
  if (typeof id !== "string" || id.trim() === "") {
    throw new Error("Concept id must be a non-empty string.");
  }
  const norm = toPosix(id);
  if (norm.startsWith("/")) {
    throw new Error(`Concept id must be bundle-relative, got absolute '${id}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new Error(`Concept id must not contain '..' segments: '${id}'.`);
  }
}

/**
 * Guard a blob key before it is joined onto the bundle root for a filesystem read or
 * write. Same traversal/absolute-escape shape as {@link assertSafeConceptId}, PLUS
 * three blob-specific rejections so the blob and concept-document namespaces stay
 * disjoint in both directions:
 *   - ANY segment ending in `.md`, checked CASE-INSENSITIVELY (`report.MD` would collide
 *     with `report.md` on a case-insensitive filesystem such as APFS, silently bypassing
 *     concept-doc CAS and getting ingested as a doc by the next bundle walk) — not just
 *     the FINAL segment: a key like `report.md/attachment.png` would otherwise pass (its
 *     final segment is `attachment.png`) while creating an on-disk DIRECTORY literally
 *     named `report.md`, which collides with — and blocks — any future concept doc write
 *     to id `report` (`pathFromConceptId("report")` targets that exact path as a FILE).
 *     This also covers the two reserved filenames (`index.md`/`log.md`), which always
 *     carry that extension, at any depth.
 *   - any dot-prefixed path segment (invisible to the concept walk by convention, and
 *     the exact shape `FilesystemBackend.atomicWrite`'s own temp files use — a blob key
 *     must never collide with that).
 *   - a trailing-slash / empty final segment (a blob key must name a file, not a dir).
 * Applies to EVERY blob operation — read and exists included, not just write — so a
 * probing `readBlob`/`existsBlob` can't be used to bypass the guard writes enforce.
 *
 * Note (raw-vs-normalized storage): like a {@link ConceptId}, the key's non-extension
 * segments are stored VERBATIM (case preserved, no other normalization) — this mirrors
 * the engine's pre-existing concept-id behavior (an id's casing/spelling is exactly what
 * the caller wrote) rather than introducing a NEW normalization rule just for blobs.
 */
export function assertSafeBlobKey(key: string): void {
  if (typeof key !== "string" || key.trim() === "") {
    throw new Error("Blob key must be a non-empty string.");
  }
  const norm = toPosix(key);
  if (norm.startsWith("/")) {
    throw new Error(`Blob key must be bundle-relative, got absolute '${key}'.`);
  }
  const segments = norm.split("/");
  if (segments.some((seg) => seg === "..")) {
    throw new Error(`Blob key must not contain '..' segments: '${key}'.`);
  }
  if (segments.some((seg) => seg.startsWith("."))) {
    throw new Error(`Blob key must not contain dot-prefixed segments: '${key}'.`);
  }
  const last = segments[segments.length - 1] ?? "";
  if (last === "") {
    throw new Error(`Blob key must name a file, not end with '/': '${key}'.`);
  }
  if (segments.some((seg) => seg.toLowerCase().endsWith(".md"))) {
    throw new Error(
      `Blob key '${key}' has a path segment ending in '.md' (checked case-insensitively, at ` +
        `any depth), which collides with the concept-document namespace — write it as a doc ` +
        `instead.`,
    );
  }
}

/**
 * Guard a reserved-file directory (the `dir` argument to `readReserved`/`writeReserved`,
 * where `""` denotes the bundle root) against path traversal / absolute escape before it
 * is joined onto the bundle root. Unlike {@link assertSafeConceptId}, an empty string IS
 * valid here (it means "the bundle root itself"). Throws on a non-string, an absolute
 * dir, or any `..` segment.
 */
export function assertSafeReservedDir(dir: string): void {
  if (typeof dir !== "string") {
    throw new Error("Reserved-file directory must be a string.");
  }
  const norm = toPosix(dir);
  if (norm.startsWith("/")) {
    throw new Error(`Reserved-file directory must be bundle-relative, got absolute '${dir}'.`);
  }
  if (norm.split("/").some((seg) => seg === "..")) {
    throw new Error(`Reserved-file directory must not contain '..' segments: '${dir}'.`);
  }
}
