---
type: Doc
title: UI-facing contract (Stage-2 auth)
timestamp: '2026-07-06T19:18:17.111Z'
---
# UI-facing contract (Stage-2 auth)

The endpoint surface a future Web UI consumes. Written at the close of the auth unit (Parts A–C,
2026-07-02) so the UI unit starts against a documented, deployed, production-verified backend
rather than an intention. Everything here is ALREADY implemented in `packages/worker` and served
by the deployed Worker; the UI is a pure consumer.

**The session mechanism is deliberately NOT specified here.** v1 has no browser login — humans
onboard via `join` (invite → minted API key). When the UI unit adds browser sessions, it plugs a
new verifier in BEHIND the existing `IdentityVerifier` seam (`auth.ts`); the membership/role model
and every endpoint below are unchanged by that addition. The recorded direction is a generic
OIDC/JWKS verifier (covers Clerk/Auth0/Supabase/self-hosted IdPs with one implementation) — see
`designs/auth-model.md` rev 4 and `research/auth-spike.md`.

## Authorization model the UI must respect

- **Verifiers authenticate; membership authorizes.** A request carries a credential (today: an API
  key as `Authorization: Bearer`); the gate resolves it to an `Identity{userId, method}`, then
  checks the user's `memberships` role for the bundle. Roles: `reader` (GET), `writer` (+writes),
  `admin` (+ the invite/member/key admin routes). The `root` bootstrap identity (the `API_KEY`
  secret) is admin everywhere and flagged `bootstrap:true`.
- **Single-bundle (v1).** Every bundle value must be `"default"`; other values are rejected
  `400 USAGE`. Multi-bundle dispatch + per-bundle scoping is a deferred future unit.
- **Provenance is the internal user id**, never an upstream identity — so a later provider swap
  never rewrites history.

## Endpoints (all under the deployed Worker; `Authorization: Bearer <credential>` unless noted)

| Route | Who | Returns / does |
| --- | --- | --- |
| `POST /v0/join` | UNAUTHENTICATED (the invite token IS the credential) | `{invite_token, display?}` → `201 {user_id, role, bundle, api_key, key_prefix}`. Atomic single-use redemption; mints a personal key. Invalid/expired/revoked → uniform `400` (no oracle). |
| `GET /v0/whoami` | any member | `{user_id, display, method, memberships:[{bundle,role}], bootstrap?}` |
| `GET /v0/bundles` | any member | `{count, bundles:[...]}` — membership-scoped |
| `POST /v0/invites` | admin | `{role, bundle?, expires_in_hours?, display_hint?}` → `201 {invite_id, token, expires_at}` (token shown once — it is the shareable secret) |
| `GET /v0/invites` | admin | list (no tokens/hashes) |
| `DELETE /v0/invites/{id}` | admin | revoke; `404` if absent |
| `GET /v0/members` | admin | list `{user_id, display, role}` |
| `PUT /v0/members/{id}/role` | admin | `{role}`; `409 LAST_ADMIN` if it would strip the bundle's last admin (root exempt) |
| `DELETE /v0/members/{id}` | admin | remove membership + revoke that user's keys; `409 LAST_ADMIN` guard |
| `POST /v0/keys` | member (self) / admin (`{new_agent_label}` → a fresh agent user) | → `201 {id, user_id, api_key, key_prefix, last_four, label}` (key shown once). Cannot target an existing user (no impersonation). |
| `GET /v0/keys` | member (own) / admin (all) | list `{id, key_prefix, last_four, label, ...}` — never the secret |
| `DELETE /v0/keys/{id}` | owner or admin | revoke |

## Error taxonomy the UI can branch on

`{error:{code, message, details?}}` on every non-2xx. Codes the UI will see: `AUTH_REQUIRED`
(401 — no/invalid/revoked credential), `FORBIDDEN` (403 — authenticated but wrong role),
`NOT_FOUND` (404), `LAST_ADMIN` (409 — the last-admin guard), `USAGE` (400 — bad input, incl. a
non-`default` bundle), `RATE_LIMITED` (429), `RUNTIME` (5xx). The CLI maps these to its exit-code
taxonomy; a UI branches on `code` directly.

## What the UI adds (its own unit, not this one)

Browser login + sessions (behind a new verifier at the seam), the actual pages (member/invite/key
management screens over the admin routes above, a bundle browser over the existing doc/blob read
routes, the link-graph view the static `viz.html` already renders), and — the NORTH-STAR §4
signature workflow — pointing a remote agent at a doc and surfacing its produced artifact back for
human review. None of that changes the contract above; it consumes it.
