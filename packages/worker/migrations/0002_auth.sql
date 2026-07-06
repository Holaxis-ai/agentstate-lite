-- Stage-2 auth (Part A): keys + invites multi-human auth — five ADDITIVE tables.
-- 0001's doc_heads/reserved_heads/blob_heads/doc_history are UNTOUCHED.
--
-- Principals: `users.id` is an app-internal ULID minted by THIS system (never an
-- upstream identity) — the ONLY id used elsewhere: `memberships.user_id`,
-- `api_keys.user_id`, provenance/actor attribution (fed into the existing
-- `writeDocVersioned`/`WriteOptions.actor` plumbing via `X-Actor`, see src/auth.ts).
-- `user_identities` binds an upstream credential to that internal id (v1 providers:
-- 'invite' — subject = the invites.id that created the user; 'agent' — an admin-minted
-- non-human user, subject = its own user id, no external upstream at all). 'root' is
-- the distinguished bootstrap identity and is handled VIRTUALLY (no `users` row): its
-- authority derives entirely from possessing the `API_KEY` secret, not from a mutable
-- DB row — see src/auth.ts's `ApiKeyVerifier` doc comment for the full rationale.
--
-- Secrets at rest: `invites.token_hash` / `api_keys.key_hash` are
-- HMAC-SHA-256(KEY_PEPPER, <raw token/key>) — the raw value is shown to the caller
-- exactly ONCE (the mint/join response) and never stored or logged. See src/tokens.ts.
--
-- `auth_events.actor_user_id` deliberately carries NO foreign key: it must be able to
-- record 'root' (no `users` row, see above) and NULL (a denied request with no
-- resolved identity at all — an anonymous/bad-credential probe).

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id         TEXT PRIMARY KEY,   -- app-internal ULID (src/ulid.ts)
  display    TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_identities (
  provider   TEXT NOT NULL,      -- 'invite' | 'agent' (v1) — NEVER 'root' (virtual, no row)
  subject    TEXT NOT NULL,      -- provider-specific (see header comment)
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  UNIQUE (provider, subject)
);

-- Bundle-scoped even though only one bundle ("default") exists today (CLAUDE.md gate 3).
CREATE TABLE IF NOT EXISTS memberships (
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  bundle     TEXT NOT NULL,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'writer', 'reader')),
  UNIQUE (user_id, bundle)
);

CREATE INDEX IF NOT EXISTS idx_memberships_bundle ON memberships (bundle);

-- `token_hash` is the CAS comparand for the atomic single-use redemption in
-- `POST /v0/join` (src/membership-store.ts's `redeemInvite`): a conditional
-- `UPDATE ... WHERE token_hash = ? AND redeemed_at IS NULL AND revoked_at IS NULL
-- AND expires_at > ?`, the SAME "one atomic D1 statement per attempt" idiom
-- `d1r2-backend.ts` uses for doc/blob CAS — D1 guarantees at most one concurrent
-- writer's UPDATE actually matches this row.
CREATE TABLE IF NOT EXISTS invites (
  id            TEXT PRIMARY KEY,
  token_hash    TEXT NOT NULL UNIQUE,
  bundle        TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin', 'writer', 'reader')),
  expires_at    TEXT NOT NULL,
  created_by    TEXT NOT NULL,
  redeemed_by   TEXT,
  redeemed_at   TEXT,
  revoked_at    TEXT,
  display_hint  TEXT
);

CREATE INDEX IF NOT EXISTS idx_invites_bundle ON invites (bundle);

CREATE TABLE IF NOT EXISTS api_keys (
  id         TEXT PRIMARY KEY,
  key_hash   TEXT NOT NULL UNIQUE,
  key_prefix TEXT NOT NULL,      -- e.g. first 12 chars of "aslk_..." — humane identification, never the secret
  last_four  TEXT NOT NULL,
  user_id    TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  label      TEXT,
  created_by TEXT NOT NULL,      -- the minting identity's user id ('root' for the bootstrap identity)
  created_at TEXT NOT NULL,
  revoked_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user ON api_keys (user_id);

-- Append-only audit trail. No update/delete path is ever exposed on this table.
CREATE TABLE IF NOT EXISTS auth_events (
  id             TEXT PRIMARY KEY,
  at             TEXT NOT NULL,
  actor_user_id  TEXT,           -- 'root', a real user id, or NULL (see header comment) — NO FK, by design
  event          TEXT NOT NULL,
  detail         TEXT
);

CREATE INDEX IF NOT EXISTS idx_auth_events_at ON auth_events (at);
