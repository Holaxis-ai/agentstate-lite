/**
 * `MembershipStore` — the ONE module through which ALL access to the five Stage-2 auth
 * tables (`migrations/0002_auth.sql`: `users`, `user_identities`, `memberships`,
 * `invites`, `api_keys`, `auth_events`) happens. Nothing else in this codebase touches
 * those tables directly (portability pin — BINDING, per the team-lead brief): every
 * query here is plain SQLite-dialect SQL (no D1-specific features), so this module is
 * what a future non-D1 deployment would need to reimplement, and nothing else.
 *
 * Field style matches `d1r2-backend.ts`: explicit `private readonly` fields assigned in
 * the constructor BODY, not TypeScript constructor parameter properties — Node's
 * built-in strip-only TypeScript support (this package's `test/ts-loader.mjs` harness)
 * does not implement that syntax.
 *
 * `redeemInvite` is the one non-trivial method: an ATOMIC single-use invite redemption
 * via `db.batch(...)`, using the SAME idiom `d1r2-backend.ts`'s doc-write batches use —
 * statement 1 is the CAS gate (a conditional `UPDATE` that at most one concurrent
 * caller's statement can match), and every later statement is an `INSERT ... SELECT
 * ... FROM invites WHERE token_hash = ? AND redeemed_by = ?` guard that only fires when
 * THIS caller's statement 1 actually won — so a losing caller's whole batch is a no-op
 * (no orphaned user/identity/membership/key rows), with no multi-statement transaction
 * control flow needed beyond what one D1 `batch()` already guarantees.
 */
import type { D1Database } from "@cloudflare/workers-types";

import { ulid } from "./ulid.js";

export type Role = "admin" | "writer" | "reader";

export interface UserRecord {
  id: string;
  display: string | null;
  createdAt: string;
}

export interface MembershipRecord {
  userId: string;
  bundle: string;
  role: Role;
}

export interface MemberRecord extends MembershipRecord {
  display: string | null;
}

export interface InviteRecord {
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

export interface ApiKeyRecord {
  id: string;
  keyPrefix: string;
  lastFour: string;
  userId: string;
  label: string | null;
  createdBy: string;
  createdAt: string;
  revokedAt: string | null;
}

export interface AuthEventRecord {
  id: string;
  at: string;
  actorUserId: string | null;
  event: string;
  detail: string | null;
}

const INVITE_COLUMNS = `
  id, bundle, role, expires_at as expiresAt, created_by as createdBy,
  redeemed_by as redeemedBy, redeemed_at as redeemedAt, revoked_at as revokedAt,
  display_hint as displayHint
`;

const KEY_COLUMNS = `
  id, key_prefix as keyPrefix, last_four as lastFour, user_id as userId, label,
  created_by as createdBy, created_at as createdAt, revoked_at as revokedAt
`;

export class MembershipStore {
  private readonly db: D1Database;

  constructor(db: D1Database) {
    this.db = db;
  }

  // ── users ────────────────────────────────────────────────────────────────────────

  async getUser(id: string): Promise<UserRecord | null> {
    const row = await this.db
      .prepare("SELECT id, display, created_at as createdAt FROM users WHERE id = ?")
      .bind(id)
      .first<UserRecord>();
    return row ?? null;
  }

  async createUser(input: { id: string; display: string | null; createdAt: string }): Promise<void> {
    await this.db
      .prepare("INSERT INTO users (id, display, created_at) VALUES (?, ?, ?)")
      .bind(input.id, input.display, input.createdAt)
      .run();
  }

  async linkIdentity(provider: string, subject: string, userId: string): Promise<void> {
    await this.db
      .prepare("INSERT INTO user_identities (provider, subject, user_id) VALUES (?, ?, ?)")
      .bind(provider, subject, userId)
      .run();
  }

  async findUserByIdentity(provider: string, subject: string): Promise<string | null> {
    const row = await this.db
      .prepare("SELECT user_id as userId FROM user_identities WHERE provider = ? AND subject = ?")
      .bind(provider, subject)
      .first<{ userId: string }>();
    return row?.userId ?? null;
  }

  // ── memberships ──────────────────────────────────────────────────────────────────

  async getRole(userId: string, bundle: string): Promise<Role | null> {
    const row = await this.db
      .prepare("SELECT role FROM memberships WHERE user_id = ? AND bundle = ?")
      .bind(userId, bundle)
      .first<{ role: Role }>();
    return row?.role ?? null;
  }

  async listMemberships(userId: string): Promise<MembershipRecord[]> {
    const { results } = await this.db
      .prepare("SELECT user_id as userId, bundle, role FROM memberships WHERE user_id = ? ORDER BY bundle")
      .bind(userId)
      .all<MembershipRecord>();
    return results;
  }

  /** Every bundle with at least one membership row — used to compose root's virtual "sees everything" view. */
  async listAllBundles(): Promise<string[]> {
    const { results } = await this.db.prepare("SELECT DISTINCT bundle FROM memberships ORDER BY bundle").all<{ bundle: string }>();
    return results.map((r) => r.bundle);
  }

  /** How many REAL (non-root — root is virtual, never a row here) admin memberships `bundle` currently has. The L3 last-admin guard's basis. */
  async countAdmins(bundle: string): Promise<number> {
    const row = await this.db
      .prepare("SELECT COUNT(*) as n FROM memberships WHERE bundle = ? AND role = 'admin'")
      .bind(bundle)
      .first<{ n: number }>();
    return row?.n ?? 0;
  }

  async listMembers(bundle: string): Promise<MemberRecord[]> {
    const { results } = await this.db
      .prepare(
        `SELECT m.user_id as userId, m.bundle, m.role, u.display
         FROM memberships m JOIN users u ON u.id = m.user_id
         WHERE m.bundle = ?
         ORDER BY m.role, u.display`,
      )
      .bind(bundle)
      .all<MemberRecord>();
    return results;
  }

  /** Upsert: create the membership, or change its role if one already exists for `(userId, bundle)`. */
  async setMembership(userId: string, bundle: string, role: Role): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO memberships (user_id, bundle, role) VALUES (?, ?, ?)
         ON CONFLICT(user_id, bundle) DO UPDATE SET role = excluded.role`,
      )
      .bind(userId, bundle, role)
      .run();
  }

  /** Returns whether a row was actually removed (idempotent: removing an absent membership is `false`, not an error). */
  async removeMembership(userId: string, bundle: string): Promise<boolean> {
    const result = await this.db.prepare("DELETE FROM memberships WHERE user_id = ? AND bundle = ?").bind(userId, bundle).run();
    return result.meta.changes > 0;
  }

  // ── invites ──────────────────────────────────────────────────────────────────────

  async createInvite(input: {
    id: string;
    tokenHash: string;
    bundle: string;
    role: Role;
    expiresAt: string;
    createdBy: string;
    displayHint: string | null;
  }): Promise<void> {
    await this.db
      .prepare("INSERT INTO invites (id, token_hash, bundle, role, expires_at, created_by, display_hint) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(input.id, input.tokenHash, input.bundle, input.role, input.expiresAt, input.createdBy, input.displayHint)
      .run();
  }

  async listInvites(bundle?: string): Promise<InviteRecord[]> {
    const stmt = bundle
      ? this.db.prepare(`SELECT ${INVITE_COLUMNS} FROM invites WHERE bundle = ? ORDER BY expires_at DESC`).bind(bundle)
      : this.db.prepare(`SELECT ${INVITE_COLUMNS} FROM invites ORDER BY expires_at DESC`);
    const { results } = await stmt.all<InviteRecord>();
    return results;
  }

  async getInvite(id: string): Promise<InviteRecord | null> {
    const row = await this.db.prepare(`SELECT ${INVITE_COLUMNS} FROM invites WHERE id = ?`).bind(id).first<InviteRecord>();
    return row ?? null;
  }

  /** Idempotent: revoking an already-revoked (or never-existed) invite returns `false`, not an error. */
  async revokeInvite(id: string): Promise<boolean> {
    const result = await this.db
      .prepare("UPDATE invites SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL")
      .bind(new Date().toISOString(), id)
      .run();
    return result.meta.changes > 0;
  }

  /**
   * Atomically redeem the invite whose token hashes to `tokenHash`, or report a loss.
   * See this module's header comment for the CAS/guarded-insert shape. The caller
   * supplies EVERY value that ends up persisted (the candidate `userId`, the freshly
   * minted API key's hash/fingerprint, an `auth_events` id) up front — nothing is
   * read back mid-batch, so this is exactly ONE round trip regardless of outcome, and
   * a losing caller's attempt is indistinguishable, timing-wise, from a winning one
   * (the SAME six statements run either way; only whether they match any rows differs).
   *
   * Returns `null` on ANY failure mode (token unknown, already redeemed, revoked,
   * expired, or lost the race to a concurrent redeemer) — deliberately one shape for
   * all of them; the caller (`auth-routes.ts`'s `handleJoin`) must not be able to
   * distinguish WHY a token failed (join-oracle-freedom, per the team-lead brief).
   */
  async redeemInvite(input: {
    tokenHash: string;
    now: string;
    userId: string;
    display: string | null;
    apiKeyId: string;
    keyHash: string;
    keyPrefix: string;
    lastFour: string;
    eventId: string;
  }): Promise<{ bundle: string; role: Role } | null> {
    const { tokenHash, now, userId, display, apiKeyId, keyHash, keyPrefix, lastFour, eventId } = input;

    const claim = this.db
      .prepare(
        `UPDATE invites SET redeemed_by = ?, redeemed_at = ?
         WHERE token_hash = ? AND redeemed_at IS NULL AND revoked_at IS NULL AND expires_at > ?`,
      )
      .bind(userId, now, tokenHash, now);

    const createUser = this.db
      .prepare(
        `INSERT INTO users (id, display, created_at)
         SELECT ?, COALESCE(?, display_hint), ? FROM invites WHERE token_hash = ? AND redeemed_by = ?`,
      )
      .bind(userId, display, now, tokenHash, userId);

    const linkIdentity = this.db
      .prepare(
        `INSERT INTO user_identities (provider, subject, user_id)
         SELECT 'invite', id, ? FROM invites WHERE token_hash = ? AND redeemed_by = ?`,
      )
      .bind(userId, tokenHash, userId);

    const createMembership = this.db
      .prepare(
        `INSERT INTO memberships (user_id, bundle, role)
         SELECT ?, bundle, role FROM invites WHERE token_hash = ? AND redeemed_by = ?`,
      )
      .bind(userId, tokenHash, userId);

    const mintKey = this.db
      .prepare(
        `INSERT INTO api_keys (id, key_hash, key_prefix, last_four, user_id, label, created_by, created_at)
         SELECT ?, ?, ?, ?, ?, NULL, ?, ? FROM invites WHERE token_hash = ? AND redeemed_by = ?`,
      )
      .bind(apiKeyId, keyHash, keyPrefix, lastFour, userId, userId, now, tokenHash, userId);

    const auditEvent = this.db
      .prepare(
        `INSERT INTO auth_events (id, at, actor_user_id, event, detail)
         SELECT ?, ?, ?, 'invite_redeemed', 'bundle=' || bundle || ' role=' || role FROM invites
         WHERE token_hash = ? AND redeemed_by = ?`,
      )
      .bind(eventId, now, userId, tokenHash, userId);

    const results = await this.db.batch([claim, createUser, linkIdentity, createMembership, mintKey, auditEvent]);
    if (results[0]!.meta.changes === 0) return null;

    const row = await this.db.prepare("SELECT bundle, role FROM memberships WHERE user_id = ?").bind(userId).first<{
      bundle: string;
      role: Role;
    }>();
    return row ?? null; // row always exists here; the fallback is defensive, not a real code path
  }

  // ── api keys ─────────────────────────────────────────────────────────────────────

  async mintApiKey(input: {
    id: string;
    keyHash: string;
    keyPrefix: string;
    lastFour: string;
    userId: string;
    label: string | null;
    createdBy: string;
    createdAt: string;
  }): Promise<void> {
    await this.db
      .prepare(
        "INSERT INTO api_keys (id, key_hash, key_prefix, last_four, user_id, label, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(input.id, input.keyHash, input.keyPrefix, input.lastFour, input.userId, input.label, input.createdBy, input.createdAt)
      .run();
  }

  /** Active-only lookup by hash — the hot path `ApiKeyVerifier` calls on every request. Never returns a revoked key. */
  async findActiveKeyByHash(keyHash: string): Promise<{ id: string; userId: string } | null> {
    const row = await this.db
      .prepare("SELECT id, user_id as userId FROM api_keys WHERE key_hash = ? AND revoked_at IS NULL")
      .bind(keyHash)
      .first<{ id: string; userId: string }>();
    return row ?? null;
  }

  async getKey(id: string): Promise<{ id: string; userId: string; revokedAt: string | null } | null> {
    const row = await this.db
      .prepare("SELECT id, user_id as userId, revoked_at as revokedAt FROM api_keys WHERE id = ?")
      .bind(id)
      .first<{ id: string; userId: string; revokedAt: string | null }>();
    return row ?? null;
  }

  /** `userId` omitted lists EVERY key deployment-wide (admin scope) — never selects `key_hash`. */
  async listKeys(userId?: string): Promise<ApiKeyRecord[]> {
    const stmt = userId
      ? this.db.prepare(`SELECT ${KEY_COLUMNS} FROM api_keys WHERE user_id = ? ORDER BY created_at DESC`).bind(userId)
      : this.db.prepare(`SELECT ${KEY_COLUMNS} FROM api_keys ORDER BY created_at DESC`);
    const { results } = await stmt.all<ApiKeyRecord>();
    return results;
  }

  /** Idempotent: revoking an already-revoked (or absent) key returns `false`. */
  async revokeKey(id: string): Promise<boolean> {
    const result = await this.db.prepare("UPDATE api_keys SET revoked_at = ? WHERE id = ? AND revoked_at IS NULL").bind(new Date().toISOString(), id).run();
    return result.meta.changes > 0;
  }

  /** Revokes every still-active key belonging to `userId`; returns how many were actually revoked. */
  async revokeAllKeysForUser(userId: string): Promise<number> {
    const result = await this.db
      .prepare("UPDATE api_keys SET revoked_at = ? WHERE user_id = ? AND revoked_at IS NULL")
      .bind(new Date().toISOString(), userId)
      .run();
    return result.meta.changes;
  }

  // ── audit ────────────────────────────────────────────────────────────────────────

  /** Append an audit row. `actorUserId` is `null` for a denied request with no resolved identity at all. */
  async recordEvent(actorUserId: string | null, event: string, detail?: string): Promise<void> {
    await this.db
      .prepare("INSERT INTO auth_events (id, at, actor_user_id, event, detail) VALUES (?, ?, ?, ?, ?)")
      .bind(ulid(), new Date().toISOString(), actorUserId, event, detail ?? null)
      .run();
  }

  /** Test/inspection surface: the append-only audit trail, newest-first, optionally filtered by `event`. */
  async listEvents(filter?: { event?: string }): Promise<AuthEventRecord[]> {
    const stmt = filter?.event
      ? this.db.prepare("SELECT id, at, actor_user_id as actorUserId, event, detail FROM auth_events WHERE event = ? ORDER BY at DESC").bind(filter.event)
      : this.db.prepare("SELECT id, at, actor_user_id as actorUserId, event, detail FROM auth_events ORDER BY at DESC");
    const { results } = await stmt.all<AuthEventRecord>();
    return results;
  }
}
