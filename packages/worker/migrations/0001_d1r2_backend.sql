-- D1R2Backend head/history index — Stage-1 Unit 2b Part A.
--
-- Storage model: content bytes (serialized concept documents, reserved-file content,
-- and blob bytes) live in R2, addressed by the CONTENT-ADDRESSED version token itself
-- (sha256:<hex> -> R2 key `content/<hex>`, derived in code, never stored as a separate
-- column — see src/keys.ts). D1 holds only head rows (the CURRENT version per id/dir+name/
-- key) plus a document history table. The `version` column on every head table IS the
-- compare-and-swap comparand: a conditional `UPDATE ... WHERE version = ?` or a
-- create-only `INSERT` (relying on the PRIMARY KEY's UNIQUE constraint) is the whole
-- concurrency mechanism — no application-level locking, no R2-conditional-put CAS for
-- the head transition (R2's own conditional put is used only as a harmless idempotent
-- guard around the shared content store, never as the seam's CAS primitive).
--
-- `seq` is a monotonic per-id/key counter used ONLY to order `doc_history` rows
-- newest-first; it never surfaces through the `StorageBackend` seam.

PRAGMA foreign_keys = ON;

-- One row per concept document id: its current head.
CREATE TABLE IF NOT EXISTS doc_heads (
  id           TEXT PRIMARY KEY,
  version      TEXT NOT NULL,
  actor        TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  seq          INTEGER NOT NULL
);

-- Attributed version history per concept document id, newest-first by `seq`.
CREATE TABLE IF NOT EXISTS doc_history (
  id           TEXT NOT NULL,
  seq          INTEGER NOT NULL,
  version      TEXT NOT NULL,
  actor        TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (id, seq),
  FOREIGN KEY (id) REFERENCES doc_heads (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_doc_history_id_seq_desc
  ON doc_history (id, seq DESC);

-- One row per reserved file (`index.md` / `log.md`) per directory (`dir = ''` is the
-- bundle root). No history table: the seam's `readReserved`/`writeReserved` contract
-- (like every adapter) tracks only the current content, matching MemoryBackend's plain
-- `Map<string,string>`.
CREATE TABLE IF NOT EXISTS reserved_heads (
  dir          TEXT NOT NULL,
  name         TEXT NOT NULL,
  version      TEXT NOT NULL,
  updated_at   TEXT NOT NULL,
  PRIMARY KEY (dir, name)
);

-- One row per blob key: its current state. No history table — blob actor attribution is
-- unobservable on the seam today (no `blobVersions`, mirroring MemoryBackend's `BlobState`,
-- which deliberately holds no chain either).
CREATE TABLE IF NOT EXISTS blob_heads (
  key          TEXT PRIMARY KEY,
  version      TEXT NOT NULL,
  content_type TEXT NOT NULL,
  actor        TEXT,
  updated_at   TEXT NOT NULL
);
