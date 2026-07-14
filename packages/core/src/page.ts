/**
 * Pure Page registry/entry path grammar shared by every Page producer and consumer.
 *
 * Page registry ids are concept ids under `pages-registry/`; Page entries are opaque
 * blob keys under `pages/`. Both retain exact, case-preserving nested paths while
 * rejecting spellings that discovery or storage cannot safely round-trip.
 */

import { assertSafeBlobKey, assertSafeConceptId } from "./paths.js";

const PAGE_SEGMENT = /^[A-Za-z0-9._-]+$/;

function hasSafePageSegments(value: string, prefix: string): boolean {
  if (!value.startsWith(prefix) || value.length === prefix.length) return false;
  if (value.startsWith("/") || /[\\%?#]/.test(value)) return false;
  const segments = value.slice(prefix.length).split("/");
  return segments.every((segment) => !segment.startsWith(".") && PAGE_SEGMENT.test(segment));
}

/** Strict concept-id grammar for Page registry documents. Nested ids and ordinary dots are valid. */
export function isPageRegistryId(id: unknown): id is string {
  if (typeof id !== "string" || id.endsWith(".md") || !hasSafePageSegments(id, "pages-registry/")) {
    return false;
  }
  try {
    assertSafeConceptId(id);
    return true;
  } catch {
    return false;
  }
}

/** Strict blob-key grammar for executable Page entries. */
export function isPageEntryKey(entry: unknown): entry is string {
  if (typeof entry !== "string" || !hasSafePageSegments(entry, "pages/")) return false;
  try {
    assertSafeBlobKey(entry);
    return true;
  } catch {
    return false;
  }
}
