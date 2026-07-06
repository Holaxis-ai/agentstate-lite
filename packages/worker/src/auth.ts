/**
 * Identity + authorization for the Cloudflare Worker deployment — Stage-2 auth Part A,
 * evolving the single-shared-secret gate (Stage-1 Unit 2b Part C) into keys+invites
 * multi-human auth. Deliberately NO OAuth, NO passwords, NO sessions, NO email (SETTLED
 * design, human-authorized plan rev 3).
 *
 * Three layers, each independently testable:
 *   1. {@link IdentityVerifier} — an extensible seam: "given a `Request`, who (if
 *      anyone) is making it?" {@link ApiKeyVerifier} is the one production verifier
 *      (root shared-secret OR a minted `api_keys` row); {@link authenticate} runs an
 *      ORDERED list of verifiers, first non-null wins — a test can register an
 *      additional stub verifier ahead of it to prove multi-verifier dispatch (see
 *      `test/auth.test.ts`'s seam-conformance test) without this module knowing
 *      anything about that test verifier's existence.
 *   2. Authorization — once an {@link Identity} is resolved, {@link createAuthGate}
 *      looks up its membership role for the target bundle (root is admin EVERYWHERE,
 *      virtually — see {@link ApiKeyVerifier}'s doc comment) and enforces a route
 *      class: reader = read-shaped bundle routes; writer = + doc/blob/reserved
 *      writes; admin = + the new `/v0/invites`, `/v0/members`, `/v0/keys` routes
 *      (dispatched and self-authorized in `auth-routes.ts`, NOT here — see that
 *      module for why route-level authorization couldn't stay generic for those).
 *   3. Actor + agent injection (principal/agent split, Stage-1 Unit 2b's actor-identity
 *      Unit 2) — the resolved identity's `userId` becomes the forwarded request's
 *      `X-Actor` header, OVERRIDING any client-supplied value (unchanged from before:
 *      this is the unforgeable PRINCIPAL). ADDITIONALLY, the client's OWN claimed
 *      `X-Actor` — read BEFORE it is overridden — is sanitized and forwarded as a NEW
 *      `X-Agent` header: the client-attested sub-identity/label recorded UNDER that
 *      principal (e.g. "you are principal P; your claimed actor A is your agent under
 *      P"). A client cannot forge `X-Agent` directly — the worker is the only place it
 *      is minted, and only from the client's own (sanitized) claimed actor. Both land
 *      via `@agentstate-lite/server`'s `writeOptionsFromHeaders` (see `router.ts` — no
 *      change needed there beyond reading the new header) into `doc_history.actor`
 *      (principal) and `doc_history.agent` (attested label) / `versions()`.
 *
 * Fail-closed, EXACTLY as before but now requiring TWO secrets: an unset/blank
 * `API_KEY` OR `KEY_PEPPER` refuses every request with the SAME loud `500 RUNTIME`
 * envelope the single-secret gate always used — never "auth optional." This check
 * runs before touching D1 at all (before even parsing the credential), same as
 * before.
 *
 * `POST /v0/join` is the ONE exception: it is reachable WITHOUT an identity (the
 * invite token itself IS the credential) — but the deployment must still be
 * configured (both secrets set). `createAuthGate` special-cases this path before
 * running the verifier chain at all; see `auth-routes.ts`'s `handleJoin`.
 */
import { timingSafeEqual } from "node:crypto";

import { errorFromCaught, errorResponse } from "./envelope.js";
import { hmacSha256Hex } from "./tokens.js";
import { clientIp, type RateLimiters } from "./rate-limit.js";
import { routeAuthRequest, handleJoin } from "./auth-routes.js";
import type { MembershipStore, Role } from "./membership-store.js";

/**
 * B1 (adversarial review — BLOCKER, fixed): this deployment is SINGLE-BUNDLE.
 * `D1R2Backend` is one shared, unpartitioned namespace — a `{bundle}` path segment
 * other than this literal string does not select a different store, it is just a
 * different label over the SAME data (see `auth-routes.ts`'s `bundleGuardError` doc
 * comment for the full scope decision). The gate rejects any OTHER value before doing
 * a role lookup at all.
 */
const DEFAULT_BUNDLE = "default";

/** Who is making this request, and how they authenticated. */
export interface Identity {
  /** The app-internal `users.id` — "root" for the virtual bootstrap identity (no `users` row). */
  userId: string;
  method: "api-key" | "root" | string;
  display?: string;
}

/** An extensible authentication seam: given a `Request`, resolve an {@link Identity}, or `null` if this verifier has no opinion. */
export interface IdentityVerifier {
  verify(request: Request): Promise<Identity | null>;
}

/** Run `verifiers` in order; the first to resolve a non-null {@link Identity} wins. `null` if none do. */
export async function authenticate(request: Request, verifiers: IdentityVerifier[]): Promise<Identity | null> {
  for (const verifier of verifiers) {
    const identity = await verifier.verify(request);
    if (identity) return identity;
  }
  return null;
}

// Case-insensitive per RFC 7235 §2.1 ("auth-scheme" is a token, matched case-insensitively).
const BEARER_RE = /^Bearer\s+(.+)$/i;

const textEncoder = new TextEncoder();

/** SHA-256 digest of `input` via the Web Crypto API. */
async function sha256(input: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", textEncoder.encode(input)));
}

/**
 * Constant-time comparison of two SHA-256 digests. Both are always 32 bytes by
 * construction, so this never has to handle — or leak timing through — a length
 * mismatch. Tries Node's `timingSafeEqual` first; falls back to a manual
 * constant-time XOR-accumulate loop if unavailable (still safe here specifically
 * because both inputs are the SAME fixed 32-byte length).
 *
 * This is the ONE constant-time comparator in this package (Stage-1 Unit 2b Part C),
 * reused as-is for the root shared-secret check below — see `tokens.ts`'s header
 * comment for why a MINTED key's lookup does not need this (indexed hash lookup, not
 * a fixed-secret compare).
 */
export function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false; // unreachable for two SHA-256 digests; kept for correctness
  try {
    return timingSafeEqual(a, b);
  } catch {
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a[i]! ^ b[i]!;
    return diff === 0;
  }
}

/**
 * The one production {@link IdentityVerifier}: `Authorization: Bearer <token>` is
 * checked against two things, in order:
 *
 * 1. The `API_KEY` secret, constant-time-compared (`sha256` + {@link constantTimeEqual},
 *    unchanged from Stage-1 Unit 2b Part C). A match resolves the DISTINGUISHED
 *    "root" identity.
 * 2. Failing that, HMAC-SHA-256(`KEY_PEPPER`, token) is looked up against
 *    `api_keys.key_hash` (active keys only) via {@link MembershipStore.findActiveKeyByHash}.
 *
 * Root is handled VIRTUALLY — no `users` row is lazily created for it. This is a
 * deliberate choice (justification, since the brief left it open): root's authority
 * derives ENTIRELY from possessing the `API_KEY` secret, which is already the
 * fail-closed trust anchor this whole gate rests on. A lazily-created "root" row
 * would (a) be a write on every root request until it exists, racing itself under
 * concurrent bootstrap traffic exactly like the invite-redemption race this unit
 * already has to solve elsewhere, and (b) create a MUTABLE row whose role/existence
 * could be edited or deleted independently of the secret that is supposed to BE
 * root's authority — a real security regression (deleting a DB row should not be
 * able to strip root of its power while the operator still holds the secret, and
 * conversely a stray DB row must never be able to GRANT root-equivalent access on
 * its own). Treating "root" as a name derived purely from the secret, never a row,
 * keeps that authority exactly as strong as the secret and no stronger.
 */
export class ApiKeyVerifier implements IdentityVerifier {
  private readonly apiKey: string | undefined;
  private readonly pepper: string | undefined;
  private readonly store: MembershipStore;

  constructor(apiKey: string | undefined, pepper: string | undefined, store: MembershipStore) {
    this.apiKey = apiKey;
    this.pepper = pepper;
    this.store = store;
  }

  async verify(request: Request): Promise<Identity | null> {
    const header = request.headers.get("Authorization") ?? "";
    const match = BEARER_RE.exec(header);
    const provided = match?.[1]?.trim();
    if (!provided) return null;

    const rootKey = this.apiKey?.trim();
    if (rootKey) {
      const [providedDigest, rootDigest] = await Promise.all([sha256(provided), sha256(rootKey)]);
      if (constantTimeEqual(providedDigest, rootDigest)) {
        return { userId: "root", method: "root" };
      }
    }

    const pepper = this.pepper?.trim();
    if (!pepper) return null; // defensive: the gate's fail-closed check already refuses before this is reachable
    const digest = await hmacSha256Hex(pepper, provided);
    const row = await this.store.findActiveKeyByHash(digest);
    if (!row) return null;
    return { userId: row.userId, method: "api-key" };
  }
}

const ROLE_RANK: Record<Role, number> = { reader: 1, writer: 2, admin: 3 };

/** Does `have` satisfy a route that requires `need`? (admin ⊇ writer ⊇ reader) */
function roleSatisfies(have: Role, need: Role): boolean {
  return ROLE_RANK[have] >= ROLE_RANK[need];
}

const BUNDLE_PATH_RE = /^\/v0\/bundles\/([^/]+)\/(.*)$/;

/**
 * Classify a bundle-scoped route (the `rest` tail `router.ts`'s OWN `BUNDLE_PATH_RE`
 * would extract) into the role it requires. Deliberately DENY-BY-DEFAULT: every
 * bundle-scoped request needs AT LEAST `reader`, escalating to `writer` only for the
 * specific write-shaped combinations (`PUT` to `docs/`, `reserved/`, or `blobs/`).
 * An unrecognized method/pattern under `/v0/bundles/...` still requires `reader`
 * before it can even reach the router (which will then itself reject it, e.g.
 * `400 USAGE` for an unsupported method) — safer than trying to enumerate every
 * non-write shape and falling through unchecked for anything missed.
 *
 * ONE DELIBERATE DEVIATION from the settled "reader = GET routes only" wording,
 * flagged rather than silently reinterpreted: `POST /docs:read-many` is a READ (the
 * seam's `readMany`, the one-round-trip graph/backlink-traversal path) but is a
 * `POST` by HTTP method, not `GET`. Classifying it as `writer`-required under a
 * literal "GET only" reading would silently break the primary batch-read path for
 * every reader-role caller — reserved judgment: classified as `reader` here. Please
 * confirm this is the intended reading during review.
 *
 * DELETE is writer-class too, on the SAME two prefixes a PUT is (`docs/`/`blobs/`) —
 * removing a doc/blob is exactly as mutating as writing one. `reserved/` deliberately
 * stays PUT-only writer here (its `isWrite` clause below lists no DELETE branch): the
 * router has no reserved-file DELETE handler at all (D4, no bulk/reserved delete) — a
 * `DELETE reserved/{name}` request is classified `reader` by this function and then
 * 400s at the ROUTER regardless, matching every other unsupported-method-on-a-
 * recognized-prefix shape (a reader-role caller can reach that 400; it is never a
 * write it could actually perform).
 */
export function classifyBundleRoute(method: string, rest: string): Role {
  const isWrite =
    (rest.startsWith("docs/") && (method === "PUT" || method === "DELETE")) ||
    (rest.startsWith("reserved/") && method === "PUT") ||
    (rest.startsWith("blobs/") && (method === "PUT" || method === "DELETE"));
  return isWrite ? "writer" : "reader";
}

/** Max stored agent-label length (chars). A free-form attested sub-identity, not an id — capped to bound storage. */
const AGENT_LABEL_MAX = 64;

/**
 * Sanitize a CLIENT-DECLARED agent label before it is attested under the server-set principal:
 * trim, drop ASCII control characters (0x00-0x1F and 0x7F), and cap length. Returns `null` when
 * nothing usable remains (an empty/blank/all-control label -> no X-Agent set -> agent absent).
 * The label is free-form and untrusted-but-scoped: it can only ever attribute WITHIN the caller's
 * own principal (the principal is unforgeable), so the sanitize is about storage hygiene and
 * header safety, not authorization.
 */
function sanitizeAgent(raw: string | null): string | null {
  if (raw === null) return null;
  // eslint-disable-next-line no-control-regex
  const cleaned = raw
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, AGENT_LABEL_MAX);
  return cleaned === "" ? null : cleaned;
}

/**
 * Inject `X-Actor: userId` into a clone of `req`, OVERRIDING any client-supplied value (the
 * unforgeable PRINCIPAL, unchanged behavior) — AND set `X-Agent` to the SANITIZED client-claimed
 * `X-Actor` (read before it is overridden), i.e. the client's attested sub-identity under that
 * principal. A client cannot smuggle its own `X-Agent` directly: this function is the ONLY place
 * `X-Agent` is minted, and any incoming `X-Agent` on `req` is unconditionally dropped and replaced
 * (or removed, if the client's claimed actor sanitizes to nothing). Safe to call before the body
 * is ever read.
 */
export function withActor(req: Request, userId: string): Request {
  const clientActor = sanitizeAgent(req.headers.get("X-Actor")); // the client's claimed actor -> their agent label
  const headers = new Headers(req.headers);
  headers.set("X-Actor", userId); // principal, OVERRIDING any client value (unchanged, unforgeable)
  if (clientActor) headers.set("X-Agent", clientActor);
  else headers.delete("X-Agent"); // never let a client forge X-Agent directly
  return new Request(req, { headers });
}

export interface AuthGateDeps {
  apiKey: string | undefined;
  pepper: string | undefined;
  store: MembershipStore;
  /** Ordered verifier chain — first non-null wins. Production: `[new ApiKeyVerifier(...)]`. Tests may prepend a stub. */
  verifiers: IdentityVerifier[];
  /** The wire-protocol v0 router over the bundle backend (`createRouterForBackend(D1R2Backend)` in production). */
  bundleRouter: (req: Request) => Promise<Response>;
  rateLimiters: RateLimiters;
}

/**
 * Build the top-level gated handler: fail-closed config check, `POST /v0/join`'s
 * unauthenticated special case, identity resolution, then EITHER dispatch to the new
 * auth routes (`auth-routes.ts`, which self-authorize) OR authorize-by-membership and
 * forward to `bundleRouter` with the actor injected.
 */
export function createAuthGate(deps: AuthGateDeps): (req: Request) => Promise<Response> {
  const { store, verifiers, bundleRouter, rateLimiters } = deps;
  const configured = Boolean(deps.apiKey?.trim()) && Boolean(deps.pepper?.trim());
  const pepper = deps.pepper?.trim();

  return async (req: Request): Promise<Response> => {
    if (!configured) {
      return errorResponse(
        500,
        "RUNTIME",
        "this deployment has no API_KEY and/or KEY_PEPPER configured — refusing to serve until the " +
          "operator sets BOTH secrets (`wrangler secret put API_KEY`, `wrangler secret put KEY_PEPPER`); " +
          "an unauthenticated/unpeppered Worker would be reachable and mintable by anyone on the open Internet",
      );
    }

    let url: URL;
    try {
      url = new URL(req.url);
    } catch {
      return errorResponse(400, "USAGE", "invalid request URL");
    }

    const ip = clientIp(req);

    // `POST /v0/join` is the ONE unauthenticated route: the invite token itself is
    // the credential. Still rate-limited (invite-token brute-forcing / spam-joining).
    if (url.pathname === "/v0/join" && req.method === "POST") {
      if (!rateLimiters.join.check(ip)) {
        return errorResponse(429, "RATE_LIMITED", "too many join attempts from this address — try again later");
      }
      return handleJoin(req, { store, pepper: pepper! });
    }

    // Everything from IDENTITY RESOLUTION onward is wrapped in the SAME error-to-envelope
    // mapping the bundle router uses internally, so a `MembershipStore`/D1 throw — or a
    // THROWING VERIFIER (a future browser-login verifier may reject with a typed error) —
    // becomes a structured `{ error: { code, message } }` response, never a bare 500.
    // `authenticate` runs INSIDE the try deliberately (M2 + the UI-v1 review): a verifier
    // that throws must not escape unmapped. `bundleRouter` has its own catch-all too; this
    // is the first line of defense for everything `auth.ts`/`auth-routes.ts` own.
    try {
      const identity = await authenticate(req, verifiers);
      if (!identity) {
        if (!rateLimiters.authFailure.check(ip)) {
          return errorResponse(429, "RATE_LIMITED", "too many failed authentication attempts from this address — try again later");
        }
        return errorResponse(
          401,
          "AUTH_REQUIRED",
          "missing or invalid credential — send 'Authorization: Bearer <api-key>' " +
            "(see 'agentstate-lite login --remote <url> --api-key <key>', or POST /v0/join with an invite token)",
        );
      }
      // The new auth routes (whoami/bundles/invites/members/keys) self-authorize —
      // each knows its OWN required role and (for admin routes) which bundle to check
      // it against, since that bundle usually comes from the request BODY, not a URL
      // segment the way it does for the bundle-scoped router below.
      const authRouteResponse = await routeAuthRequest(url, req, { identity, store, pepper: pepper! });
      if (authRouteResponse) return authRouteResponse;

      const match = BUNDLE_PATH_RE.exec(url.pathname);
      if (match) {
        const bundle = decodeURIComponent(match[1]!);
        if (bundle !== DEFAULT_BUNDLE) {
          return errorResponse(400, "USAGE", `this deployment is single-bundle — bundle must be '${DEFAULT_BUNDLE}', got '${bundle}'`);
        }
        const rest = match[2] ?? "";
        const needed = classifyBundleRoute(req.method, rest);
        const role: Role | null = identity.userId === "root" ? "admin" : await store.getRole(identity.userId, bundle);
        if (!role || !roleSatisfies(role, needed)) {
          await store.recordEvent(
            identity.userId,
            "access_denied",
            JSON.stringify({ path: url.pathname, method: req.method, bundle, needed, have: role }),
          );
          return errorResponse(403, "FORBIDDEN", `role '${role ?? "none"}' does not satisfy the required '${needed}' role for this route`);
        }
      }
      // Anything else (e.g. `GET /v0/capabilities`, which is not bundle-scoped) needs
      // no further role check beyond having resolved SOME identity above — matches the
      // pre-existing gate's behavior (any valid credential could always reach it).

      return await bundleRouter(withActor(req, identity.userId));
    } catch (err) {
      return errorFromCaught(err);
    }
  };
}
