/** Pure document-shape policies applied before a normalized document reaches storage. */

import type { Frontmatter, OkfDocument } from "./types.js";

/**
 * Normalize one document according to AgentState Lite's current OKF v0.1 write contract.
 * The caller supplies one evaluated preserve-or-fallback timestamp decision, keeping this policy
 * deterministic and free of I/O.
 */
export function normalizeV01DocumentForWrite(
  doc: OkfDocument,
  validatedType: string,
  timestamp: { preserveExisting: true; existingTimestamp: string }
    | { preserveExisting: false; fallbackTimestamp: string },
): OkfDocument {
  const normalizedTimestamp = timestamp.preserveExisting
    ? timestamp.existingTimestamp
    : timestamp.fallbackTimestamp;

  // `type` leads and `timestamp` trails, matching OKF sample documents and historical bytes.
  const { type: _type, timestamp: _timestamp, ...rest } = doc.frontmatter;
  const frontmatter: Frontmatter = { type: validatedType, ...rest, timestamp: normalizedTimestamp };
  return { id: doc.id, frontmatter, body: doc.body ?? "" };
}
