// The PAGE-BYTES privilege tier of the `ui` command (tasks/ui-pages-spike): a bundle page is a
// self-contained HTML blob promoted into the store under `pages/…`. It is served to a SANDBOXED,
// OPAQUE-ORIGIN iframe (`sandbox="allow-scripts"`, no `allow-same-origin`) whose ONLY channel to
// the rest of the world is a postMessage bridge to the shell — never a direct fetch of the data
// API. Two mechanisms enforce that, belt-and-braces:
//
//   1. A per-page NONCE (this module). The session-authed shell mints a nonce for ONE specific
//      blob key; the nonce fetches THAT page's static bytes only and is rejected by every data
//      route (it is not the session secret, so `checkAuth` fails on `/v0/*`). The data token, in
//      turn, does not serve page bytes — the two credentials are structurally distinct.
//   2. A strict per-page CSP with `connect-src 'none'` ({@link pageCsp}). Even a hostile page
//      cannot open a fetch/XHR/WebSocket/EventSource at all — its bytes are inert except for
//      `postMessage`, which the shell validates by source before honoring (read-only in v0).
//
// The nonce is a capability, not a durable grant: short-TTL, single bundle-run, in-memory only.
import { randomBytes } from "node:crypto";

/** Bundle-relative key prefix page HTML blobs live under (`promote <file> --doc-key pages/<name>.html`). The watcher only snapshots blobs under this prefix for hot-reload — see `watch.ts`. */
export const PAGE_BLOB_PREFIX = "pages/";

/**
 * Nonce contract: a minted nonce authorizes exactly ONE blob key and is REUSABLE within a tight
 * TTL — long enough to cover the iframe's initial load plus a hot-reload's re-fetch of the same
 * bytes, short enough that a leaked nonce is not a durable capability. It is deliberately NOT
 * single-use (an iframe navigation can legitimately re-request the same URL), so growth is bounded
 * by a sweep + cap instead (see {@link PageNonceRegistry}).
 */
const DEFAULT_NONCE_TTL_MS = 120 * 1000;

/** Hard ceiling on live nonces — a human session opens/hot-reloads far fewer than this; the cap only guards against unbounded growth from an adversarial mint loop. */
const DEFAULT_MAX_NONCES = 256;

interface NonceEntry {
  key: string;
  expiresAt: number;
}

/**
 * In-memory registry mapping an unguessable nonce -> the ONE blob key it authorizes. Minting is
 * gated by the session (the shell calls `POST /__page/mint` with its cookie); resolution
 * (`GET /__page/<nonce>`) needs only the nonce, so the opaque-origin iframe — which holds no
 * session token — can still load its own bytes. The chain (session -> mint(key) -> nonce ->
 * bytes(key)) means an unauthenticated caller can mint nothing, so can obtain a nonce for nothing.
 *
 * Growth is bounded WITHOUT breaking the reusable-within-TTL contract: every mint first sweeps
 * expired entries, then evicts the oldest if still at the cap (the `Map` preserves insertion
 * order). So minted-but-never-resolved nonces and hot-reload re-mints cannot accumulate unbounded.
 */
export class PageNonceRegistry {
  private readonly map = new Map<string, NonceEntry>();
  private readonly ttlMs: number;
  private readonly maxEntries: number;

  constructor(ttlMs: number = DEFAULT_NONCE_TTL_MS, maxEntries: number = DEFAULT_MAX_NONCES) {
    this.ttlMs = ttlMs;
    this.maxEntries = Math.max(1, maxEntries);
  }

  /** Mint a fresh nonce authorizing exactly `key`. 32 random bytes, base64url. Sweeps expired entries and enforces the cap first. */
  mint(key: string): string {
    this.sweepExpired();
    while (this.map.size >= this.maxEntries) {
      const oldest = this.map.keys().next().value;
      if (oldest === undefined) break;
      this.map.delete(oldest);
    }
    const nonce = randomBytes(32).toString("base64url");
    this.map.set(nonce, { key, expiresAt: Date.now() + this.ttlMs });
    return nonce;
  }

  /** Resolve a nonce to its authorized blob key, or `null` if unknown/expired (an expired entry is deleted on read). */
  resolve(nonce: string): string | null {
    const entry = this.map.get(nonce);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.map.delete(nonce);
      return null;
    }
    return entry.key;
  }

  /** Drop every expired entry (Map iteration tolerates deletion of the current/remaining keys). */
  private sweepExpired(): void {
    const now = Date.now();
    for (const [nonce, entry] of this.map) {
      if (now > entry.expiresAt) this.map.delete(nonce);
    }
  }

  /** Test/observability hook: number of live (un-swept) nonces. */
  size(): number {
    return this.map.size;
  }
}

/**
 * The Content-Security-Policy for a served page's bytes. `connect-src 'none'` is the structural
 * lock: the page cannot make ANY network request, so it cannot reach the data API even if a token
 * leaked into its context. `script-src`/`style-src 'unsafe-inline'` are required because pages are
 * self-contained (inline `<script>`/`<style>`, no external hosts — the demo pages embed everything).
 * `frame-ancestors 'self'` lets ONLY the same-origin shell frame the page (the bytes are served
 * from the real origin; the opaque origin is an iframe-render-time artifact, so `'self'` still
 * matches the shell as the sole permitted embedder).
 */
export function pageCsp(): string {
  return [
    "default-src 'none'",
    "script-src 'unsafe-inline'",
    "style-src 'unsafe-inline'",
    "img-src data:",
    "font-src data:",
    "connect-src 'none'",
    "form-action 'none'",
    "base-uri 'none'",
    "frame-ancestors 'self'",
  ].join("; ");
}
