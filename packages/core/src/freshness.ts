/**
 * Freshness derivation from the OKF `timestamp` frontmatter field.
 *
 * OKF has NO first-class staleness concept (mapping §c) — `timestamp` is just the
 * ISO-8601 instant of the last meaningful change. Staleness is a CONSUMER
 * judgment, layered here on top of the raw field:
 *   - `empty` — no usable timestamp is present.
 *   - `stale` — a declared dependency was written more recently than this concept,
 *               OR the concept's age exceeds `maxAgeMs`.
 *   - `fresh` — otherwise.
 * Dependency-newer takes precedence over the age rule.
 *
 * Pure and dependency-free, hence directly unit-testable.
 */

import type { FreshnessOptions, FreshnessResult, OkfDocument } from "./types.js";

/**
 * Parse a timestamp to epoch ms, or `null`. Accepts an ISO-8601 (or any
 * `Date.parse`-able) STRING — the normal case, since {@link parseMarkdown}
 * normalizes frontmatter dates to strings — and, as belt-and-suspenders, a raw
 * `Date` or epoch-millis `number` should one reach here unnormalized.
 */
export function parseTimestamp(ts: unknown): number | null {
  if (ts instanceof Date) {
    const ms = ts.getTime();
    return Number.isNaN(ms) ? null : ms;
  }
  if (typeof ts === "number") {
    return Number.isFinite(ts) ? ts : null;
  }
  if (typeof ts !== "string" || ts.trim() === "") return null;
  const ms = Date.parse(ts);
  return Number.isNaN(ms) ? null : ms;
}

/**
 * Derive a freshness verdict for a concept from its `timestamp` frontmatter.
 *
 * @param doc     the concept document (only `frontmatter.timestamp` is consulted).
 * @param options `now` (defaults to the current instant), `maxAgeMs`, and the
 *                ISO timestamps of upstream `dependsOn` artifacts.
 */
export function freshness(doc: OkfDocument, options: FreshnessOptions = {}): FreshnessResult {
  const tsMs = parseTimestamp(doc.frontmatter?.timestamp);
  if (tsMs === null) {
    return { verdict: "empty", reason: "no usable `timestamp` frontmatter" };
  }

  const now = (options.now ?? new Date()).getTime();
  const ageMs = now - tsMs;

  // Dependency-based staleness wins: any dependency newer than this concept.
  if (options.dependsOn && options.dependsOn.length > 0) {
    for (const dep of options.dependsOn) {
      const depMs = parseTimestamp(dep);
      if (depMs !== null && depMs > tsMs) {
        return {
          verdict: "stale",
          ageMs,
          reason: `a dependency (${dep}) is newer than this concept`,
        };
      }
    }
  }

  if (typeof options.maxAgeMs === "number" && ageMs > options.maxAgeMs) {
    return {
      verdict: "stale",
      ageMs,
      reason: `age ${ageMs}ms exceeds max ${options.maxAgeMs}ms`,
    };
  }

  return { verdict: "fresh", ageMs };
}
