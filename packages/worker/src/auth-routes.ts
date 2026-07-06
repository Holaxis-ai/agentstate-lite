/**
 * Route handlers for the new Stage-2 auth surface: `POST /v0/join` (unauthenticated),
 * `GET /v0/whoami`, `GET /v0/bundles`, `/v0/invites*`, `/v0/members*`, `/v0/keys*`.
 * Same envelope/error conventions as `@agentstate-lite/server`'s `router.ts`.
 *
 * Unlike the bundle-scoped doc/blob/reserved routes (whose role requirement
 * `auth.ts`'s `createAuthGate` derives generically from `{bundle}` in the URL path),
 * these routes each know their OWN required role — and for the admin-gated ones,
 * WHICH bundle to check it against usually comes from the request BODY or a query
 * param, not a URL segment — so each handler below does its own authorization via
 * `requireAdmin`/`isAnyAdmin` rather than the gate doing it generically.
 *
 * Root bootstrap nag: every successful admin-route response includes `bootstrap: true`
 * when the caller authenticated as the virtual "root" identity (never for a real
 * admin), recommending the operator create a real admin instead of running on the
 * bootstrap secret indefinitely.
 *
 * `routeAuthRequest` returns `null` for any path it does not recognize, so
 * `auth.ts`'s gate can fall through to the bundle router unchanged.
 */
import { errorResponse, jsonResponse } from "./envelope.js";
import { fingerprint, hmacSha256Hex, mintApiKeyToken, mintInviteToken } from "./tokens.js";
import { ulid } from "./ulid.js";
import type { InviteRecord, MembershipStore, Role } from "./membership-store.js";
import type { Identity } from "./auth.js";
// The SHARED WIRE CONTRACT (CLAUDE.md gate 3 / see `@agentstate-lite/core`'s
// `auth-wire.ts` module doc comment): every response body below is `satisfies`-checked
// against these types so the worker and the CLI (and, later, the UI) cannot silently
// drift apart. Compile-time only — no runtime behavior change.
import type {
  CreateInviteResponse,
  JoinResponse,
  ListBundlesResponse,
  ListInvitesResponse,
  ListKeysResponse,
  ListMembersResponse,
  MintKeyResponse,
  RemoveMemberResponse,
  RevokeInviteResponse,
  RevokeKeyResponse,
  SetMemberRoleResponse,
  WhoamiResponse,
} from "@agentstate-lite/core";

const ROLES: readonly Role[] = ["admin", "writer", "reader"];
function isRole(value: unknown): value is Role {
  return typeof value === "string" && (ROLES as readonly string[]).includes(value);
}

const DEFAULT_BUNDLE = "default";
const DEFAULT_INVITE_HOURS = 24 * 7; // one week

/**
 * SCOPE DECISION (adversarial review, this pass): this unit is SINGLE-BUNDLE. The
 * bundle-scoped role model (`memberships.bundle`) exists for the FUTURE multi-bundle
 * unit (plan rev 3 F5, deferred), but `D1R2Backend` is today ONE shared, unpartitioned
 * namespace — naming a DIFFERENT bundle string does not select a different data store,
 * it is just a different label over the SAME data. Before this guard, an admin could
 * create an invite/membership for an arbitrary bundle name, giving a false impression
 * of isolation while every "bundle" actually read/wrote the identical underlying store
 * (the live-exploited cross-bundle read this fixes). Rather than build real store
 * partitioning now (a separate, future unit — see `docs/WIRE-PROTOCOL.md`'s "Multi-user
 * auth" section), every bundle-accepting input in this module (and `auth.ts`'s gate, for
 * the URL-path bundle) is validated against the literal string `"default"` — the ONE
 * bundle that is honestly true today. Returns an error `Response` when `bundle` is
 * anything else, `null` when it is fine to proceed.
 */
function bundleGuardError(bundle: string): Response | null {
  if (bundle === DEFAULT_BUNDLE) return null;
  return errorResponse(
    400,
    "USAGE",
    `this deployment is single-bundle — bundle must be '${DEFAULT_BUNDLE}', got '${bundle}'`,
  );
}

/** Context threaded through every AUTHENTICATED auth-route handler. */
export interface AuthedContext {
  identity: Identity;
  store: MembershipStore;
  pepper: string;
}

function isRoot(ctx: AuthedContext): boolean {
  return ctx.identity.userId === "root";
}

/** root is admin of every bundle, virtually; anyone else needs a real `admin` membership row for `bundle`. */
async function requireAdmin(ctx: AuthedContext, bundle: string): Promise<boolean> {
  if (isRoot(ctx)) return true;
  return (await ctx.store.getRole(ctx.identity.userId, bundle)) === "admin";
}

/** root, or an admin of AT LEAST ONE bundle — the bar for deployment-wide actions (minting for others, listing all keys) that are not tied to one specific bundle. */
async function isAnyAdmin(ctx: AuthedContext): Promise<boolean> {
  if (isRoot(ctx)) return true;
  const memberships = await ctx.store.listMemberships(ctx.identity.userId);
  return memberships.some((m) => m.role === "admin");
}

async function forbidden(ctx: AuthedContext, detail: Record<string, unknown>): Promise<Response> {
  await ctx.store.recordEvent(ctx.identity.userId, "access_denied", JSON.stringify(detail));
  return errorResponse(403, "FORBIDDEN", "insufficient role for this action");
}

/**
 * Merge the root bootstrap nag into a successful admin-route body, never mutating the
 * caller's object. Generic over `T` so each call site can `satisfies Omit<XResponse,
 * "bootstrap">` its own base literal (see the SHARED WIRE CONTRACT import above) while
 * this helper stays the ONE place `bootstrap` gets added — same runtime merge as before.
 */
function withBootstrapNag<T extends object>(ctx: AuthedContext, base: T): T & { bootstrap?: true } {
  return isRoot(ctx) ? { ...base, bootstrap: true } : base;
}

async function readJsonBody(req: Request): Promise<Record<string, unknown>> {
  try {
    const parsed = await req.json();
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

function stringField(body: Record<string, unknown>, key: string): string | null {
  const v = body[key];
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

// ── POST /v0/join (unauthenticated) ─────────────────────────────────────────────────

/**
 * Redeem an invite token: atomic single-use (`MembershipStore.redeemInvite`), and
 * ORACLE-FREE — an unknown, expired, revoked, or already-redeemed token all produce
 * the IDENTICAL `400 INVITE_INVALID` envelope, so a caller can never distinguish WHY
 * a token failed. The winner gets a freshly minted user, membership (the invite's
 * bundle+role), and an API key — shown ONCE in this response, never again.
 */
export async function handleJoin(req: Request, ctx: { store: MembershipStore; pepper: string }): Promise<Response> {
  const body = await readJsonBody(req);
  const token = stringField(body, "invite_token");
  if (!token) {
    return errorResponse(400, "USAGE", "request body must be JSON { invite_token, display? } with a non-empty invite_token");
  }
  const display = stringField(body, "display");

  const tokenHash = await hmacSha256Hex(ctx.pepper, token);
  const userId = ulid();
  const rawKey = mintApiKeyToken();
  const keyHash = await hmacSha256Hex(ctx.pepper, rawKey);
  const { prefix, lastFour } = fingerprint(rawKey);

  const result = await ctx.store.redeemInvite({
    tokenHash,
    now: new Date().toISOString(),
    userId,
    display,
    apiKeyId: ulid(),
    keyHash,
    keyPrefix: prefix,
    lastFour,
    eventId: ulid(),
  });

  if (!result) {
    // SAME shape regardless of cause (unknown / expired / revoked / already redeemed / lost the race).
    return errorResponse(400, "INVITE_INVALID", "invite token is invalid, expired, revoked, or already used");
  }

  return jsonResponse(201, {
    user_id: userId,
    role: result.role,
    bundle: result.bundle,
    api_key: rawKey,
    key_prefix: prefix,
  } satisfies JoinResponse);
}

// ── GET /v0/whoami ───────────────────────────────────────────────────────────────────

async function handleWhoami(ctx: AuthedContext): Promise<Response> {
  if (isRoot(ctx)) {
    const bundles = new Set(await ctx.store.listAllBundles());
    bundles.add(DEFAULT_BUNDLE);
    return jsonResponse(200, {
      user_id: "root",
      display: "root",
      method: "root",
      memberships: [...bundles].sort().map((bundle) => ({ bundle, role: "admin" as const })),
      bootstrap: true,
    } satisfies WhoamiResponse);
  }
  const [user, memberships] = await Promise.all([ctx.store.getUser(ctx.identity.userId), ctx.store.listMemberships(ctx.identity.userId)]);
  return jsonResponse(200, {
    user_id: ctx.identity.userId,
    display: user?.display ?? null,
    method: ctx.identity.method,
    memberships: memberships.map((m) => ({ bundle: m.bundle, role: m.role })),
  } satisfies WhoamiResponse);
}

// ── GET /v0/bundles ──────────────────────────────────────────────────────────────────

async function handleListBundlesForCaller(ctx: AuthedContext): Promise<Response> {
  if (isRoot(ctx)) {
    const bundles = new Set(await ctx.store.listAllBundles());
    bundles.add(DEFAULT_BUNDLE);
    const list = [...bundles].sort().map((bundle) => ({ bundle, role: "admin" as const }));
    return jsonResponse(200, { count: list.length, bundles: list, bootstrap: true } satisfies ListBundlesResponse);
  }
  const memberships = await ctx.store.listMemberships(ctx.identity.userId);
  const list = memberships.map((m) => ({ bundle: m.bundle, role: m.role }));
  return jsonResponse(200, { count: list.length, bundles: list } satisfies ListBundlesResponse);
}

// ── /v0/invites ──────────────────────────────────────────────────────────────────────

function sanitizeInvite(invite: InviteRecord): InviteRecord {
  // `MembershipStore`'s own SELECT list already excludes `token_hash` — this is a
  // pass-through, kept as a named step so a future column addition to `InviteRecord`
  // does not silently leak through this endpoint without a deliberate decision here.
  // (Typed as the non-null `InviteRecord` — every call site maps it over an
  // already-fetched array, never a possibly-absent single lookup — so `.map(sanitizeInvite)`
  // below infers `InviteRecord[]`, matching `ListInvitesResponse.invites` exactly.)
  return invite;
}

async function handleCreateInvite(req: Request, ctx: AuthedContext): Promise<Response> {
  const body = await readJsonBody(req);
  const role = body.role;
  if (!isRole(role)) return errorResponse(400, "USAGE", "request body must include role: 'admin' | 'writer' | 'reader'");
  const bundle = stringField(body, "bundle") ?? DEFAULT_BUNDLE;
  const bundleError = bundleGuardError(bundle);
  if (bundleError) return bundleError;

  if (!(await requireAdmin(ctx, bundle))) return forbidden(ctx, { action: "create_invite", bundle });

  const hoursRaw = body.expires_in_hours;
  const hours = typeof hoursRaw === "number" && Number.isFinite(hoursRaw) && hoursRaw > 0 ? hoursRaw : DEFAULT_INVITE_HOURS;
  const displayHint = stringField(body, "display_hint");

  const id = ulid();
  const token = mintInviteToken();
  const tokenHash = await hmacSha256Hex(ctx.pepper, token);
  const expiresAt = new Date(Date.now() + hours * 3_600_000).toISOString();

  await ctx.store.createInvite({ id, tokenHash, bundle, role, expiresAt, createdBy: ctx.identity.userId, displayHint });
  await ctx.store.recordEvent(ctx.identity.userId, "invite_created", JSON.stringify({ invite_id: id, bundle, role }));

  return jsonResponse(
    201,
    withBootstrapNag(ctx, { invite_id: id, token, expires_at: expiresAt, bundle, role } satisfies Omit<
      CreateInviteResponse,
      "bootstrap"
    >),
  );
}

async function handleListInvites(url: URL, ctx: AuthedContext): Promise<Response> {
  const bundleParam = url.searchParams.get("bundle");
  if (bundleParam) {
    const bundleError = bundleGuardError(bundleParam);
    if (bundleError) return bundleError;
    if (!(await requireAdmin(ctx, bundleParam))) return forbidden(ctx, { action: "list_invites", bundle: bundleParam });
    const invites = await ctx.store.listInvites(bundleParam);
    return jsonResponse(
      200,
      withBootstrapNag(ctx, { count: invites.length, invites: invites.map(sanitizeInvite) } satisfies Omit<
        ListInvitesResponse,
        "bootstrap"
      >),
    );
  }
  if (isRoot(ctx)) {
    const invites = await ctx.store.listInvites();
    return jsonResponse(
      200,
      withBootstrapNag(ctx, { count: invites.length, invites: invites.map(sanitizeInvite) } satisfies Omit<
        ListInvitesResponse,
        "bootstrap"
      >),
    );
  }
  const memberships = await ctx.store.listMemberships(ctx.identity.userId);
  const adminBundles = memberships.filter((m) => m.role === "admin").map((m) => m.bundle);
  if (adminBundles.length === 0) return jsonResponse(200, { count: 0, invites: [] } satisfies ListInvitesResponse);
  const perBundle = await Promise.all(adminBundles.map((bundle) => ctx.store.listInvites(bundle)));
  const invites = perBundle.flat();
  return jsonResponse(200, { count: invites.length, invites: invites.map(sanitizeInvite) } satisfies ListInvitesResponse);
}

/**
 * L1 (adversarial review): authorize BEFORE existence. Every invite lives in the ONE
 * bundle (B1), so — unlike the pre-fix version, which had to read the invite FIRST to
 * learn which bundle to check admin-of — `requireAdmin(ctx, DEFAULT_BUNDLE)` needs no
 * invite lookup at all. A non-admin caller now gets 403 without ever learning whether
 * `id` exists; only an admin's request reaches the existence check.
 */
async function handleRevokeInvite(id: string, ctx: AuthedContext): Promise<Response> {
  if (!(await requireAdmin(ctx, DEFAULT_BUNDLE))) return forbidden(ctx, { action: "revoke_invite", invite_id: id });

  const invite = await ctx.store.getInvite(id);
  if (!invite) return errorResponse(404, "NOT_FOUND", `no invite '${id}'`);

  const changed = await ctx.store.revokeInvite(id);
  await ctx.store.recordEvent(ctx.identity.userId, "invite_revoked", JSON.stringify({ invite_id: id, changed }));
  return jsonResponse(
    200,
    withBootstrapNag(ctx, { invite_id: id, changed } satisfies Omit<RevokeInviteResponse, "bootstrap">),
  );
}

// ── /v0/members ──────────────────────────────────────────────────────────────────────

async function handleListMembers(url: URL, ctx: AuthedContext): Promise<Response> {
  const bundle = url.searchParams.get("bundle") ?? DEFAULT_BUNDLE;
  const bundleError = bundleGuardError(bundle);
  if (bundleError) return bundleError;
  if (!(await requireAdmin(ctx, bundle))) return forbidden(ctx, { action: "list_members", bundle });
  const members = await ctx.store.listMembers(bundle);
  return jsonResponse(
    200,
    withBootstrapNag(ctx, { count: members.length, members } satisfies Omit<ListMembersResponse, "bootstrap">),
  );
}

/**
 * L3 (adversarial review): reject a NON-ROOT admin's own action if it would demote the
 * LAST real (non-root) admin of `bundle` — root remains an unaffected backstop (its own
 * admin-everywhere authority never depends on this count), but a real admin should not
 * be able to accidentally strip `bundle` of every human admin via the API.
 */
async function wouldRemoveLastAdmin(ctx: AuthedContext, bundle: string, currentRole: Role | null, becomingAdmin: boolean): Promise<boolean> {
  if (isRoot(ctx)) return false; // root's actions are never blocked by this guard
  if (currentRole !== "admin" || becomingAdmin) return false; // not a demotion/removal of an existing admin
  return (await ctx.store.countAdmins(bundle)) <= 1;
}

async function handleSetMemberRole(userId: string, req: Request, ctx: AuthedContext): Promise<Response> {
  const body = await readJsonBody(req);
  const role = body.role;
  if (!isRole(role)) return errorResponse(400, "USAGE", "request body must include role: 'admin' | 'writer' | 'reader'");
  const bundle = stringField(body, "bundle") ?? DEFAULT_BUNDLE;
  const bundleError = bundleGuardError(bundle);
  if (bundleError) return bundleError;

  if (!(await requireAdmin(ctx, bundle))) return forbidden(ctx, { action: "set_member_role", user_id: userId, bundle });

  const target = await ctx.store.getUser(userId);
  if (!target) return errorResponse(404, "NOT_FOUND", `no user '${userId}'`);

  const before = await ctx.store.getRole(userId, bundle);
  if (await wouldRemoveLastAdmin(ctx, bundle, before, role === "admin")) {
    return errorResponse(409, "LAST_ADMIN", `cannot demote '${userId}' — they are the last admin of '${bundle}'`);
  }
  await ctx.store.setMembership(userId, bundle, role);
  await ctx.store.recordEvent(ctx.identity.userId, "membership_changed", JSON.stringify({ user_id: userId, bundle, before, after: role }));

  return jsonResponse(
    200,
    withBootstrapNag(ctx, { user_id: userId, bundle, role, changed: before !== role } satisfies Omit<
      SetMemberRoleResponse,
      "bootstrap"
    >),
  );
}

/**
 * SINGLE-BUNDLE ASSUMPTION (documented, not silently assumed — adversarial review):
 * `api_keys` carries no `bundle` column (a key belongs to a USER, not one membership —
 * see `handleMintKey`), so removing a membership revokes ALL of that user's keys
 * DEPLOYMENT-WIDE, not just access to `bundle`. Correct today because `bundle` can only
 * ever be `"default"` (B1) — there is no OTHER bundle whose access this could
 * over-reach into. A future multi-bundle unit (see `docs/WIRE-PROTOCOL.md`) will need
 * per-bundle key scoping before this stays correct with more than one bundle.
 */
async function handleRemoveMember(userId: string, url: URL, ctx: AuthedContext): Promise<Response> {
  const bundle = url.searchParams.get("bundle") ?? DEFAULT_BUNDLE;
  const bundleError = bundleGuardError(bundle);
  if (bundleError) return bundleError;
  if (!(await requireAdmin(ctx, bundle))) return forbidden(ctx, { action: "remove_member", user_id: userId, bundle });

  const currentRole = await ctx.store.getRole(userId, bundle);
  if (await wouldRemoveLastAdmin(ctx, bundle, currentRole, false)) {
    return errorResponse(409, "LAST_ADMIN", `cannot remove '${userId}' — they are the last admin of '${bundle}'`);
  }

  const changed = await ctx.store.removeMembership(userId, bundle);
  const revokedKeys = await ctx.store.revokeAllKeysForUser(userId);
  await ctx.store.recordEvent(ctx.identity.userId, "membership_removed", JSON.stringify({ user_id: userId, bundle, changed, revoked_keys: revokedKeys }));

  return jsonResponse(
    200,
    withBootstrapNag(ctx, { user_id: userId, bundle, changed, revoked_keys: revokedKeys } satisfies Omit<
      RemoveMemberResponse,
      "bootstrap"
    >),
  );
}

// ── /v0/keys ─────────────────────────────────────────────────────────────────────────

/**
 * B2 (adversarial review — BLOCKER, fixed): the prior version let ANY admin mint a
 * WORKING key for an arbitrary EXISTING `user_id` and receive the raw key back —
 * i.e. mint themselves a credential that authenticates as some other human, whether
 * or not that human ever asked for one. That is impersonation, full stop, and it does
 * not depend on bundle count at all — it is closed structurally here, not by B1.
 *
 * Key minting is now EXACTLY two shapes:
 *   (a) self-mint — any member mints a key for THEMSELVES (`targetUserId` defaults to
 *       the caller); no admin role needed.
 *   (b) admin-only NEW AGENT creation — `new_agent_label` creates a brand-new
 *       synthetic user (never an existing one) and mints its first key. There is no
 *       longer any `user_id` field: minting a credential for an EXISTING user_id —
 *       human or otherwise — is not a thing this endpoint can do anymore. A human
 *       gets access via `POST /v0/join` (an invite) ONLY, which is the entire point
 *       of the invite flow — this endpoint must never become a side door around it.
 */
async function handleMintKey(req: Request, ctx: AuthedContext): Promise<Response> {
  const body = await readJsonBody(req);
  const label = stringField(body, "label");
  const newAgentLabel = stringField(body, "new_agent_label");

  let targetUserId = ctx.identity.userId;
  if (newAgentLabel) {
    if (!(await isAnyAdmin(ctx))) {
      return forbidden(ctx, { action: "mint_agent_key", new_agent_label: newAgentLabel });
    }
    // A brand-new agent user: no upstream identity of its own, so its `user_identities`
    // subject is self-referential (its OWN freshly minted id) — mirroring how "root" has
    // no external upstream either, but unlike root an agent DOES get a real `users` row
    // (it is a real, addressable principal an admin can grant membership to later; root
    // is deliberately never a row — see `auth.ts`'s `ApiKeyVerifier` doc comment).
    targetUserId = ulid();
    const now = new Date().toISOString();
    await ctx.store.createUser({ id: targetUserId, display: newAgentLabel, createdAt: now });
    await ctx.store.linkIdentity("agent", targetUserId, targetUserId);
  } else if (isRoot(ctx)) {
    // M1 (adversarial review): root self-mint must be a clean reject, not an
    // uncaught FK failure (api_keys.user_id="root" has no `users` row to reference)
    // or — worse, on a D1 that doesn't enforce the FK — a stray root-equivalent key
    // row, exactly what treating root as VIRTUAL (no row, ever) exists to forbid.
    // Root's authority IS the `API_KEY` secret; it needs no minted key of its own.
    return errorResponse(
      400,
      "USAGE",
      "root cannot self-mint a key — root's authority is the API_KEY secret itself; mint a key for a real admin instead (POST /v0/invites)",
    );
  }

  const rawKey = mintApiKeyToken();
  const keyHash = await hmacSha256Hex(ctx.pepper, rawKey);
  const { prefix, lastFour } = fingerprint(rawKey);
  const id = ulid();
  const now = new Date().toISOString();
  await ctx.store.mintApiKey({ id, keyHash, keyPrefix: prefix, lastFour, userId: targetUserId, label, createdBy: ctx.identity.userId, createdAt: now });
  await ctx.store.recordEvent(ctx.identity.userId, "key_minted", JSON.stringify({ key_id: id, user_id: targetUserId, label }));

  return jsonResponse(
    201,
    withBootstrapNag(ctx, { id, user_id: targetUserId, api_key: rawKey, key_prefix: prefix, last_four: lastFour, label } satisfies Omit<
      MintKeyResponse,
      "bootstrap"
    >),
  );
}

/**
 * SINGLE-BUNDLE ASSUMPTION (documented — adversarial review): a bare `GET /v0/keys`
 * from an admin lists EVERY key DEPLOYMENT-WIDE, not scoped to any one bundle —
 * correct today because `isAnyAdmin` can only ever mean "admin of `default`" (B1: no
 * other bundle can exist), so "any admin" and "the only bundle's admin" are the same
 * caller. A future multi-bundle unit would need to decide whether an admin of bundle A
 * should see keys whose owner also happens to have access to bundle B — deliberately
 * not decided here. Never selects `key_hash` (`MembershipStore.listKeys`'s own SELECT
 * list excludes it) — kept that way regardless of scope.
 */
async function handleListKeys(url: URL, ctx: AuthedContext): Promise<Response> {
  const requested = url.searchParams.get("user_id");
  const admin = await isAnyAdmin(ctx);

  if (requested) {
    if (requested !== ctx.identity.userId && !admin) return forbidden(ctx, { action: "list_keys_for_other", user_id: requested });
    const keys = await ctx.store.listKeys(requested);
    return jsonResponse(200, { count: keys.length, keys } satisfies ListKeysResponse);
  }
  if (admin) {
    const keys = await ctx.store.listKeys(); // deployment-wide — "admin sees all" (SETTLED design)
    return jsonResponse(
      200,
      withBootstrapNag(ctx, { count: keys.length, keys } satisfies Omit<ListKeysResponse, "bootstrap">),
    );
  }
  const keys = await ctx.store.listKeys(ctx.identity.userId);
  return jsonResponse(200, { count: keys.length, keys } satisfies ListKeysResponse);
}

/**
 * L1 (adversarial review): authorize BEFORE existence is DISCLOSED to the caller.
 * Ownership can only be known by reading the key, so this cannot avoid the READ the
 * way `handleRevokeInvite` now can (single-bundle lets that one skip the read
 * entirely) — instead, a caller who is NEITHER an admin NOR the key's owner gets the
 * IDENTICAL `404 NOT_FOUND` whether `id` is absent or belongs to someone else, so the
 * read never becomes an existence oracle for an unauthorized caller. Only an admin,
 * or the actual owner, ever learns the difference between "absent" and "not yours".
 */
async function handleRevokeKey(id: string, ctx: AuthedContext): Promise<Response> {
  const [admin, key] = await Promise.all([isAnyAdmin(ctx), ctx.store.getKey(id)]);
  const isOwner = key !== null && key.userId === ctx.identity.userId;
  if (!admin && !isOwner) {
    // The audit trail still records the attempt (visible to a real admin later) —
    // only the HTTP RESPONSE stays uniform, so the caller learns nothing from it.
    await ctx.store.recordEvent(ctx.identity.userId, "access_denied", JSON.stringify({ action: "revoke_key_for_other", key_id: id }));
    return errorResponse(404, "NOT_FOUND", `no key '${id}'`);
  }
  if (!key) return errorResponse(404, "NOT_FOUND", `no key '${id}'`); // admin path, genuinely absent

  const changed = await ctx.store.revokeKey(id);
  await ctx.store.recordEvent(ctx.identity.userId, "key_revoked", JSON.stringify({ key_id: id, user_id: key.userId, changed }));
  return jsonResponse(200, { id, changed } satisfies RevokeKeyResponse);
}

// ── dispatch ─────────────────────────────────────────────────────────────────────────

const INVITE_ID_RE = /^\/v0\/invites\/([^/]+)$/;
const MEMBER_ROLE_RE = /^\/v0\/members\/([^/]+)\/role$/;
const MEMBER_RE = /^\/v0\/members\/([^/]+)$/;
const KEY_ID_RE = /^\/v0\/keys\/([^/]+)$/;

/**
 * Dispatch an AUTHENTICATED request to the matching auth-route handler, or return
 * `null` if `url.pathname` is not one of these routes (the caller — `auth.ts`'s gate —
 * falls through to the bundle router in that case). Every branch here does its own
 * `requireAdmin`/`isAnyAdmin`/ownership check; there is no generic role gate above
 * this dispatch the way there is for bundle-scoped routes.
 */
export async function routeAuthRequest(url: URL, req: Request, ctx: AuthedContext): Promise<Response | null> {
  const { pathname } = url;

  if (pathname === "/v0/whoami") {
    return req.method === "GET" ? handleWhoami(ctx) : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/whoami`);
  }
  if (pathname === "/v0/bundles") {
    return req.method === "GET"
      ? handleListBundlesForCaller(ctx)
      : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/bundles`);
  }
  if (pathname === "/v0/invites") {
    if (req.method === "POST") return handleCreateInvite(req, ctx);
    if (req.method === "GET") return handleListInvites(url, ctx);
    return errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/invites`);
  }
  const inviteMatch = INVITE_ID_RE.exec(pathname);
  if (inviteMatch) {
    return req.method === "DELETE"
      ? handleRevokeInvite(decodeURIComponent(inviteMatch[1]!), ctx)
      : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/invites/{id}`);
  }
  if (pathname === "/v0/members") {
    return req.method === "GET" ? handleListMembers(url, ctx) : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/members`);
  }
  const memberRoleMatch = MEMBER_ROLE_RE.exec(pathname);
  if (memberRoleMatch) {
    return req.method === "PUT"
      ? handleSetMemberRole(decodeURIComponent(memberRoleMatch[1]!), req, ctx)
      : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/members/{user_id}/role`);
  }
  const memberMatch = MEMBER_RE.exec(pathname);
  if (memberMatch) {
    return req.method === "DELETE"
      ? handleRemoveMember(decodeURIComponent(memberMatch[1]!), url, ctx)
      : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/members/{user_id}`);
  }
  if (pathname === "/v0/keys") {
    if (req.method === "POST") return handleMintKey(req, ctx);
    if (req.method === "GET") return handleListKeys(url, ctx);
    return errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/keys`);
  }
  const keyMatch = KEY_ID_RE.exec(pathname);
  if (keyMatch) {
    return req.method === "DELETE"
      ? handleRevokeKey(decodeURIComponent(keyMatch[1]!), ctx)
      : errorResponse(400, "USAGE", `unsupported method ${req.method} for /v0/keys/{id}`);
  }

  return null;
}
