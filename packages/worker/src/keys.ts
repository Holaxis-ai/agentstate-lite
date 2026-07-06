/**
 * Pure helper for {@link D1R2Backend}: deriving the content-addressed R2 key from a
 * {@link Version} token.
 *
 * Every {@link Version} the seam produces (`contentVersion`/`versionOfBytes`/`blobVersion`
 * in `@agentstate-lite/core`) has the exact shape `sha256:<64 lowercase hex chars>` — so the
 * R2 key is ALWAYS derivable from the version token; there is no need for a separate
 * "r2 key" column in D1 (see `migrations/0001_d1r2_backend.sql`'s header comment). Docs,
 * reserved files, and blobs all share ONE content-addressed R2 prefix: identical bytes
 * (regardless of which namespace produced them) are stored exactly once, which is the
 * dedup canonical AgentState's model promises.
 *
 * (An earlier revision also exported `isUniqueConstraintError`, a string-match over a D1
 * error message, to detect a lost expect-absent-create race. It is gone: every expect-absent
 * create path now uses `INSERT ... ON CONFLICT DO NOTHING RETURNING <col>` instead — a row
 * returned means the write won, zero rows means it lost — which needs no error-message
 * pattern-matching at all.)
 */
import type { Version } from "@agentstate-lite/core";

const VERSION_RE = /^sha256:([0-9a-f]{64})$/;

/** The R2 object key holding the raw content addressed by `version`. */
export function r2KeyForVersion(version: Version): string {
  const m = VERSION_RE.exec(version);
  if (!m) {
    throw new Error(`D1R2Backend: not a content-addressed version token: '${version}'.`);
  }
  return `content/${m[1]}`;
}
