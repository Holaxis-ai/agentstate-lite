/**
 * Markdown + YAML frontmatter (de)serialization via `gray-matter`.
 *
 * This is the ONLY module that touches the YAML layer; every other module works
 * with the already-parsed {@link Frontmatter}/body shapes. gray-matter delimits
 * frontmatter with `---` lines (OKF §4.1) and preserves unknown keys on
 * round-trip (OKF §9 permissive-consumption).
 */

import matter from "gray-matter";
import type { Frontmatter } from "./types.js";

/**
 * Coerce YAML-parsed date values back to ISO-8601 STRINGS.
 *
 * gray-matter/js-yaml turns an UNQUOTED ISO timestamp scalar — the form OKF's own
 * sample bundles use (`timestamp: 2026-07-01T12:05:00Z`) — into a JS `Date`.
 * Our {@link Frontmatter} model is string-typed, and every consumer guards with
 * `typeof … === "string"`, so a `Date` is treated as ABSENT: `freshness` reports
 * `empty` and `list` shows a blank timestamp on any externally-authored bundle.
 * We normalize here, at the ONE frontmatter parse layer, so a spec-shaped
 * external bundle round-trips like a self-produced (quoted) one: every Date-valued
 * key becomes its ISO string, and a numeric `timestamp` is read as epoch millis.
 */
function normalizeFrontmatter(data: Record<string, unknown>): Frontmatter {
  const out: Record<string, unknown> = { ...data };
  for (const [key, value] of Object.entries(out)) {
    if (value instanceof Date) {
      out[key] = value.toISOString();
    } else if (key === "timestamp" && typeof value === "number" && Number.isFinite(value)) {
      out[key] = new Date(value).toISOString();
    }
  }
  return out as Frontmatter;
}

/**
 * Thrown by {@link parseMarkdown} when a document's YAML frontmatter cannot be parsed. Carries
 * `context` — the document's id/path when the caller supplied one — so a whole-bundle scan can
 * attribute the corruption to a SPECIFIC document ("malformed frontmatter in 'notes/bad.md': …")
 * instead of surfacing a raw, id-less js-yaml message. `detail` is the underlying parser message
 * (first line only) for compact reporting; the original error is preserved on `.cause`.
 */
export class MalformedDocumentError extends Error {
  override readonly name = "MalformedDocumentError";
  /** The document id/path the malformed content belongs to (when the caller supplied one). */
  readonly context?: string;
  /** The underlying parser message, first line only — for compact per-doc reporting. */
  readonly detail: string;

  constructor(context: string | undefined, cause: unknown) {
    const detail = ((cause instanceof Error ? cause.message : String(cause)).split("\n")[0] ?? "")
      .trim();
    super(
      `malformed frontmatter${context ? ` in '${context}'` : ""}: ${detail} — ` +
        `fix the YAML or remove the file`,
    );
    if (context !== undefined) this.context = context;
    this.detail = detail;
    if (cause !== undefined) (this as { cause?: unknown }).cause = cause;
  }
}

/**
 * Parse raw markdown into `{ frontmatter, body }`. Missing frontmatter yields `{}`. Malformed YAML
 * throws an attributed {@link MalformedDocumentError} (naming `context` when given).
 *
 * The `matter(raw, {})` call passes an options object DELIBERATELY: gray-matter caches the parsed
 * file keyed by input, but populates that cache with the still-UNPARSED file BEFORE parsing and ONLY
 * when no options are given (see its source, index.js). A second parse of malformed content would
 * then hit that cache and silently return `{ data: {} }` instead of re-throwing — an order-dependent
 * footgun where the same bytes parse differently depending on what parsed them first. Passing an
 * (empty) options object bypasses the cache entirely, so malformed YAML throws DETERMINISTICALLY on
 * every call and identical bytes always parse identically. `{}` selects gray-matter's own defaults,
 * so well-formed documents are unaffected.
 */
export function parseMarkdown(
  raw: string,
  context?: string,
): { frontmatter: Frontmatter; body: string } {
  let parsed;
  try {
    parsed = matter(raw, {});
  } catch (err) {
    throw new MalformedDocumentError(context, err);
  }
  const frontmatter = normalizeFrontmatter((parsed.data ?? {}) as Record<string, unknown>);
  return { frontmatter, body: parsed.content };
}

/** Serialize an arbitrary YAML-mapping + body to OKF markdown (used for reserved files). */
export function stringifyWithData(data: Record<string, unknown>, body: string): string {
  const engines = (matter as typeof matter & {
    engines: { yaml: { stringify(value: object): string } };
  }).engines;
  const yaml = engines.yaml.stringify(data).trim();
  const content = body ?? "";
  const newline = (value: string): string => (value.endsWith("\n") ? value : `${value}\n`);
  if (yaml === "{}") return newline(content);
  return `---\n${newline(yaml)}---\n${newline(content)}`;
}

/** Serialize a concept document's frontmatter + body to OKF-conformant markdown. */
export function stringifyDoc(frontmatter: Frontmatter, body: string): string {
  return stringifyWithData(frontmatter as Record<string, unknown>, body);
}

/**
 * THE engine's usable-document-timestamp predicate: a non-empty (post-trim) string. Anything
 * else — absent, empty string, null, or any non-string — is unusable, and the engine write path
 * (`writeDocVersioned`) replaces it with the current time. A consumer that must DISCLOSE that
 * stamping (e.g. the legacy-name migration's `timestamp_added` receipt) reuses this predicate
 * rather than inventing a second definition of "has a timestamp".
 */
export function isUsableTimestamp(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}
