/**
 * SHARED WIRE CONTRACT for the auth/collaboration surface: `POST /v0/join`
 * (unauthenticated) and the authenticated `GET /v0/whoami`, `GET /v0/bundles`,
 * `/v0/invites*`, `/v0/members*`, `/v0/keys*` routes.
 *
 * Consumed by THREE places today: `packages/worker/src/auth-routes.ts` (the ENDPOINT
 * CONTRACT that PRODUCES these shapes — each response body is `satisfies`-checked
 * against the matching type here), the CLI's `auth-client.ts` + `commands/{join,whoami,
 * invite,member,key}.ts` (the CONSUMER that parses these shapes), and — eventually — the
 * future web UI.
 *
 * This lives in `@agentstate-lite/core` for now purely because core is the only package
 * both the CLI and the worker already depend on — it carries NO engine/`StorageBackend`
 * semantics of its own. It will be PROMOTED to a dedicated, browser-safe
 * `@agentstate-lite/wire` package (with a `fetch` client) during the UI work; until then,
 * treat this file as that future package's contents staged in the one shared location.
 */

export const ROLES = ["admin", "writer", "reader"] as const;
export type Role = (typeof ROLES)[number];

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

// ── wire response shapes (transcribed from packages/worker/src/auth-routes.ts) ─────────

export interface JoinResponse {
  user_id: string;
  role: Role;
  bundle: string;
  api_key: string;
  key_prefix: string;
}

export interface MembershipWire {
  bundle: string;
  role: Role;
}

export interface WhoamiResponse {
  user_id: string;
  display: string | null;
  method: string;
  memberships: MembershipWire[];
  bootstrap?: boolean;
}

export interface ListBundlesResponse {
  count: number;
  bundles: MembershipWire[];
  bootstrap?: boolean;
}

export interface InviteRecordWire {
  id: string;
  bundle: string;
  role: Role;
  expiresAt: string;
  createdBy: string;
  redeemedBy: string | null;
  redeemedAt: string | null;
  revokedAt: string | null;
  displayHint: string | null;
}

export interface CreateInviteResponse {
  invite_id: string;
  token: string;
  expires_at: string;
  bundle: string;
  role: Role;
  bootstrap?: boolean;
}

export interface ListInvitesResponse {
  count: number;
  invites: InviteRecordWire[];
  bootstrap?: boolean;
}

export interface RevokeInviteResponse {
  invite_id: string;
  changed: boolean;
  bootstrap?: boolean;
}

export interface MemberRecordWire {
  userId: string;
  bundle: string;
  role: Role;
  display: string | null;
}

export interface ListMembersResponse {
  count: number;
  members: MemberRecordWire[];
  bootstrap?: boolean;
}

export interface SetMemberRoleResponse {
  user_id: string;
  bundle: string;
  role: Role;
  changed: boolean;
  bootstrap?: boolean;
}

export interface RemoveMemberResponse {
  user_id: string;
  bundle: string;
  changed: boolean;
  revoked_keys: number;
  bootstrap?: boolean;
}

export interface MintKeyResponse {
  id: string;
  user_id: string;
  api_key: string;
  key_prefix: string;
  last_four: string;
  label: string | null;
  bootstrap?: boolean;
}

export interface ApiKeyRecordWire {
  id: string;
  keyPrefix: string;
  lastFour: string;
  userId: string;
  label: string | null;
  createdBy: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface ListKeysResponse {
  count: number;
  keys: ApiKeyRecordWire[];
  bootstrap?: boolean;
}

export interface RevokeKeyResponse {
  id: string;
  changed: boolean;
}
