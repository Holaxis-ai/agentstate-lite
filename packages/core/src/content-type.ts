/**
 * Shared content_type inference — PORTED from holaxis-agentstate
 * (`packages/schemas/src/content-type.ts`, dx-05 / `specs/zod-validation-layer-spec.md` §2.7).
 *
 * This is the single source for "infer a MIME `content_type` from a doc path extension." In the
 * OKF store engine it is exposed for downstream consumers (the CLI's promote/pull commands, viewer
 * asset handling, and any `resource`-pointing frontmatter) rather than being stamped onto concept
 * docs — OKF concept files are always markdown, and the format favors clean, spec-minimal
 * frontmatter, so the engine does NOT inject a `content_type` key into concept documents.
 *
 * IMPORTANT: this file has NO runtime `zod` import (only a type-only import of `ValidationWarning`,
 * which the compiler erases), so it stays dependency-free.
 *
 * Design guardrails (unchanged from source):
 *  - Inference only FILLS a gap: an explicit caller-supplied `content_type` always wins.
 *  - For an unknown/ambiguous extension we keep the call site's existing default AND emit a warning —
 *    we never guess wildly. Genuinely ambiguous extensions (e.g. `.ts` = TypeScript vs MPEG-TS) are
 *    deliberately omitted from the table so they fall through to the fallback.
 *  - A path with NO extension infers nothing and warns nothing.
 *  - When the inferred type EQUALS the call site's existing default there is no behavior change, so no
 *    warning is emitted.
 */

import type { ValidationWarning } from "./validation.js";

// Type-only re-export (erased at runtime — keeps this subpath zod-free).
export type { ValidationWarning } from "./validation.js";

/**
 * Extension (lower-case, no dot) -> MIME content_type. Text-ish types carry `; charset=utf-8`.
 * Binary types carry no charset. Deliberately conservative — ambiguous extensions are omitted.
 */
export const EXTENSION_CONTENT_TYPES: Readonly<Record<string, string>> = Object.freeze({
  // Text / markup / data (searchable + text-readable)
  html: "text/html; charset=utf-8",
  htm: "text/html; charset=utf-8",
  md: "text/markdown; charset=utf-8",
  markdown: "text/markdown; charset=utf-8",
  txt: "text/plain; charset=utf-8",
  text: "text/plain; charset=utf-8",
  log: "text/plain; charset=utf-8",
  csv: "text/csv; charset=utf-8",
  tsv: "text/tab-separated-values; charset=utf-8",
  json: "application/json; charset=utf-8",
  jsonl: "application/json; charset=utf-8",
  ndjson: "application/json; charset=utf-8",
  xml: "application/xml; charset=utf-8",
  yaml: "application/yaml; charset=utf-8",
  yml: "application/yaml; charset=utf-8",
  toml: "application/toml; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  mjs: "text/javascript; charset=utf-8",
  cjs: "text/javascript; charset=utf-8",
  // Images
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
  svg: "image/svg+xml",
  // Documents / archives / binary
  pdf: "application/pdf",
  zip: "application/zip",
  gz: "application/gzip",
  tar: "application/x-tar",
  wasm: "application/wasm",
  woff: "font/woff",
  woff2: "font/woff2",
});

/**
 * Lower-cased extension (no dot) of the LAST path segment of `docKey`, or `undefined` when the final
 * segment has no extension (no dot, or a leading-dot dotfile like `.gitignore`).
 */
export function extensionOfDocKey(docKey: string): string | undefined {
  const lastSegment = docKey.split("/").pop() ?? docKey;
  const dot = lastSegment.lastIndexOf(".");
  // No dot, or a leading-dot dotfile (".gitignore") — nothing to infer from.
  if (dot <= 0) return undefined;
  const ext = lastSegment.slice(dot + 1).toLowerCase();
  return ext.length > 0 ? ext : undefined;
}

/**
 * Look up the inferred content_type for a `doc_key` extension, or `undefined` when the extension is
 * absent or unrecognized. This is the low-level lookup; most callers want
 * {@link inferContentTypeForNewBlob}, which also produces the warning.
 */
export function inferContentTypeFromDocKey(docKey: string): string | undefined {
  const ext = extensionOfDocKey(docKey);
  if (!ext) return undefined;
  return EXTENSION_CONTENT_TYPES[ext];
}

/** Outcome of {@link inferContentTypeForNewBlob}. */
export type ContentTypeInference = {
  /** The content_type to stamp on a brand-new blob (inferred type, or the call site's `fallback`). */
  contentType: string;
  /** True when an extension was recognized and produced `contentType`. */
  inferred: boolean;
  /**
   * Non-fatal warning to surface, or `undefined` when there is nothing to report (no extension, or
   * the inferred type equals `fallback` so behavior is unchanged).
   */
  warning?: ValidationWarning;
};

/** Fallback content-type when a blob key has no extension, or an unrecognized one, and no explicit override was supplied. */
export const DEFAULT_BLOB_CONTENT_TYPE = "application/octet-stream";

/**
 * THE ONE place a blob's content-type is resolved (`StorageBackend.readBlob`/`writeBlob`
 * both route through this): an explicit `override` always wins; otherwise infer from
 * `key`'s extension via {@link inferContentTypeFromDocKey}; otherwise
 * {@link DEFAULT_BLOB_CONTENT_TYPE}. A trimmed-empty `override` is treated as absent
 * (never resolves to `""`).
 */
export function resolveContentType(key: string, override?: string): string {
  if (typeof override === "string" && override.trim() !== "") return override;
  return inferContentTypeFromDocKey(key) ?? DEFAULT_BLOB_CONTENT_TYPE;
}

/**
 * Decide the brand-new-blob content_type from a `doc_key` extension, FALLING BACK to the call site's
 * existing default. Call this ONLY when the caller supplied no explicit content_type — explicit types
 * always win and must short-circuit before reaching here.
 *
 * @param docKey   the destination document key.
 * @param fallback the call site's pre-existing brand-new-blob default.
 */
export function inferContentTypeForNewBlob(docKey: string, fallback: string): ContentTypeInference {
  const ext = extensionOfDocKey(docKey);
  if (!ext) {
    // No extension to reason about — preserve today's silent default.
    return { contentType: fallback, inferred: false };
  }

  const mime = EXTENSION_CONTENT_TYPES[ext];
  if (mime) {
    if (mime === fallback) {
      // Recognized, but identical to today's default — no behavior change, so stay quiet.
      return { contentType: mime, inferred: true };
    }
    return {
      contentType: mime,
      inferred: true,
      warning: {
        code: "CONTENT_TYPE_INFERRED",
        message: `content_type not provided; inferred '${mime}' from the '.${ext}' doc_key extension.`,
        field: "content_type",
        severity: "info",
      },
    };
  }

  // Present-but-unrecognized extension: keep the existing default, but breadcrumb that we saw an
  // extension we do not infer for (do not guess wildly).
  return {
    contentType: fallback,
    inferred: false,
    warning: {
      code: "CONTENT_TYPE_INFER_FALLBACK",
      message: `content_type not provided and the '.${ext}' doc_key extension is not recognized; defaulting to '${fallback}'.`,
      field: "content_type",
      severity: "info",
    },
  };
}
