// Serve the embedded SPA assets (plans/ui-v1.md rev 3.2 "Asset shipping"): the Vite dist is
// gzip-embedded into the CLI's esbuild bundle at build time (`scripts/embed-ui-assets.mjs`
// generates `../generated/ui-assets.generated.ts`, which this module is the ONLY runtime
// consumer of). `Content-Encoding: gzip` is sent only when the request's `Accept-Encoding`
// admits it; otherwise the stored bytes are gunzipped per-response (rare — every browser sends
// `gzip`).
//
// NOTE: this file imports a BUILD-GENERATED source module that does not exist until
// `packages/cli/build.mjs` has run once (see that generated file's own header comment) — the
// standing build/verify gate (CLAUDE.md: `npm run build && npm run typecheck && npm test`, always
// in that order) guarantees it exists before `tsc --noEmit`/tests ever import this module.
import { gunzipSync } from "node:zlib";
import { UI_ASSETS } from "../generated/ui-assets.generated.js";

/**
 * Strict CSP for every shell asset response (rev 3.2: "same-origin XSS here is key-equivalent").
 * No inline script/style, no plugins, and — EXPLICITLY — `frame-src`/`child-src 'self'` so the
 * shell can frame ONLY same-origin page-bytes URLs (tasks/ui-pages-spike B1). This is also the
 * confinement that blocks a sandboxed page from self-navigating its own frame to an external
 * origin: a nested frame's navigation is subject to the embedder's `frame-src`, so `'self'` here
 * refuses any off-origin URL — closing an exfil channel the `connect-src 'none'` page CSP alone
 * did not (navigation is not a fetch). Previously this rested on the ABSENCE of `frame-src`
 * (falling back to `default-src 'self'`); it is now stated outright.
 */
export const CSP_HEADER =
  "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; frame-src 'self'; child-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'";

export interface AssetResponse {
  status: number;
  headers: Record<string, string>;
  body: Uint8Array;
}

function acceptsGzip(acceptEncoding: string | null | undefined): boolean {
  return !!acceptEncoding && acceptEncoding.split(",").some((part) => part.trim().split(";")[0] === "gzip");
}

/**
 * Resolve `pathname` against the embedded asset map, falling back to `/index.html` for any
 * unknown path (the SPA's `not_found_handling: single-page-application` shape, client-side
 * routing via `routing.ts`'s URL search params rather than history-API sub-paths — but the
 * fallback still matters for a hard-refresh on a future non-root deep link).
 */
export function serveAsset(pathname: string, acceptEncoding: string | null | undefined): AssetResponse {
  const asset = UI_ASSETS[pathname] ?? UI_ASSETS["/index.html"];
  if (!asset) {
    return { status: 500, headers: { "content-type": "text/plain; charset=utf-8" }, body: new TextEncoder().encode("no ui assets embedded") };
  }
  const gzipBytes = Buffer.from(asset.gzipBase64, "base64");
  const headers: Record<string, string> = {
    "content-type": asset.contentType,
    "content-security-policy": CSP_HEADER,
    "x-content-type-options": "nosniff",
  };
  if (acceptsGzip(acceptEncoding)) {
    headers["content-encoding"] = "gzip";
    return { status: 200, headers, body: gzipBytes };
  }
  return { status: 200, headers, body: gunzipSync(gzipBytes) };
}
