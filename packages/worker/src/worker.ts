/**
 * Cloudflare Worker `fetch` entry point (Stage-1 Unit 2b Part B; Stage-2 auth Part A) —
 * mounts the wire-protocol v0.1 router (`@agentstate-lite/server`) over {@link D1R2Backend},
 * behind {@link createAuthGate} (`auth.ts`): keys+invites multi-human auth, evolved from the
 * original single-shared-secret gate.
 *
 * WORKER-CLEAN BY CONSTRUCTION: this imports `createRouterForBackend`, not `createRouter` —
 * the latter falls back to `new FilesystemBackend(bundle.root)` when no explicit backend is
 * given, which pulls in `node:fs` (see `packages/server/src/router.ts`'s doc comment on why
 * that split exists). This module supplies `D1R2Backend` explicitly and has no bundle
 * directory to fall back to, so the `FilesystemBackend` code path is never reached from this
 * entry point's module graph — verified by the dry-run build's `node:` import grep (see
 * `packages/worker`'s test/report for the evidence).
 *
 * No auth is enforced by this module directly; `createAuthGate` wraps the router before it
 * ever sees a request. `env.API_KEY` and/or `env.KEY_PEPPER` unset/blank means "refuse
 * everything" (fail-closed — see `auth.ts`'s doc comment), not "auth optional."
 *
 * `rateLimiters` is the ONE piece of state hoisted to MODULE scope rather than constructed
 * fresh per request (unlike `backend`/`store`/`router`/`gate` below, which follow the
 * pre-existing per-request-construction pattern this file has always used): a rate limiter
 * that resets on every request would limit nothing. Module scope persists for the lifetime of
 * ONE Worker isolate — the honest "per-isolate, best-effort" scope `rate-limit.ts` documents.
 */
import type { D1Database, ExecutionContext, R2Bucket } from "@cloudflare/workers-types";

import { createRouterForBackend } from "@agentstate-lite/server";

import { D1R2Backend } from "./d1r2-backend.js";
import { MembershipStore } from "./membership-store.js";
import { ApiKeyVerifier, createAuthGate } from "./auth.js";
import { createRateLimiters } from "./rate-limit.js";

/** Bindings this Worker expects (`wrangler.jsonc`'s `d1_databases`/`r2_buckets`, plus the `API_KEY`/`KEY_PEPPER` secrets). */
export interface Env {
  /** D1 binding: the head/history index (`migrations/0001_d1r2_backend.sql`) plus the auth tables (`migrations/0002_auth.sql`). */
  DB: D1Database;
  /** R2 binding: the content-addressed object store. */
  BUCKET: R2Bucket;
  /** Secret (`wrangler secret put API_KEY`), NOT a `vars` entry — never checked into `wrangler.jsonc`. The root bootstrap identity's shared secret. */
  API_KEY?: string;
  /**
   * Secret (`wrangler secret put KEY_PEPPER`), NOT a `vars` entry. HMAC pepper for every
   * minted invite token / API key's at-rest hash (`tokens.ts`). Fails closed exactly like
   * `API_KEY` when unset — see `auth.ts`'s `createAuthGate`.
   */
  KEY_PEPPER?: string;
}

const rateLimiters = createRateLimiters();

// Deliberately NOT typed against `@cloudflare/workers-types`' `ExportedHandler<Env>`: that
// type's `fetch` signature uses Cloudflare's own generic `Request<CfProperties>`/`Response`
// shapes, which are structurally incompatible with the plain Fetch-standard `Request`/
// `Response` this repo's router (`@agentstate-lite/server`, which does not depend on
// `@cloudflare/workers-types` at all) is typed against — even though BOTH are the same
// Fetch API at runtime. Typing this handler against the plain global `Request`/`Response`
// (from `lib.dom`, already available without any Cloudflare-specific import) keeps it
// assignable to `router`'s signature with no cast, and is exactly the shape `wrangler`
// expects a default-exported `fetch` handler to have.
export default {
  async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    const backend = new D1R2Backend(env.DB, env.BUCKET);
    const store = new MembershipStore(env.DB);
    const bundleRouter = createRouterForBackend(backend);
    // The verifier chain (first-non-null wins). Today: API keys only. The
    // IdentityVerifier seam is the sanctioned slot for a future browser-login verifier
    // (the recorded direction is a CLI-brokered / GitHub-device-flow session cookie —
    // see plans/ui-v1.md) — added there when built, never bolted onto this entry point.
    const gate = createAuthGate({
      apiKey: env.API_KEY,
      pepper: env.KEY_PEPPER,
      store,
      verifiers: [new ApiKeyVerifier(env.API_KEY, env.KEY_PEPPER, store)],
      bundleRouter,
      rateLimiters,
    });
    return gate(request);
  },
};
