/**
 * `D1R2Backend` — a {@link StorageBackend} over a Cloudflare D1 database (head index +
 * history) and an R2 bucket (content-addressed object store). Stage-1 Unit 2b Part A: the
 * backend a future CF Worker `fetch` handler mounts (Part B); this module has no fetch
 * entry point.
 *
 * Storage model (see `migrations/0001_d1r2_backend.sql`'s header for the schema):
 *   - Content bytes (a serialized concept document, a reserved file's raw content, or a
 *     blob's raw bytes) live in R2 at `content/<hex>`, where `<hex>` is the content's
 *     OWN version token (`sha256:<hex>`) with the prefix stripped — {@link r2KeyForVersion}.
 *     Docs, reserved files, and blobs share ONE content-addressed namespace: identical
 *     bytes are stored exactly once regardless of which namespace produced them (the
 *     canonical AgentState dedup model). The R2 write is a conditional, idempotent put
 *     (`onlyIf: { etagDoesNotMatch: "*" }`) — a pure "make sure the bytes exist" op, never
 *     the seam's compare-and-swap primitive. It carries NO `httpMetadata.contentType`: the
 *     namespace is shared/deduped, so a content-type set at write time would freeze onto
 *     whichever key happened to write those bytes FIRST and be silently wrong for every
 *     other key that later shares the same content but wants a different type. The single
 *     source of truth for a blob's content-type is `blob_heads.content_type` in D1 — a
 *     future Part B `fetch` handler MUST serve blob responses via `readBlob()`'s returned
 *     `contentType`, never by trusting the R2 object's own metadata.
 *   - D1 holds only HEAD rows (`doc_heads`/`reserved_heads`/`blob_heads`) plus a document
 *     history table (`doc_history`). The `version` column on every head table IS the
 *     compare-and-swap comparand: a conditional `UPDATE ... WHERE version = ?` (or a
 *     create-only `INSERT ... ON CONFLICT DO NOTHING`, relying on the PRIMARY KEY's
 *     UNIQUE constraint) is the WHOLE concurrency mechanism. D1 executes each prepared
 *     statement as one atomic operation against the database, so N concurrent writers
 *     issuing the SAME conditional `UPDATE` against the SAME row can have AT MOST one
 *     statement actually match and mutate a row — every other writer's statement matches
 *     zero rows, which this backend turns into a typed `VersionConflict`. No
 *     application-level locking is used or needed.
 *   - A document's head-row write and its `doc_history` append are NOT two independent
 *     statements: they are submitted together via `db.batch([...])`, which D1 commits as
 *     ONE atomic unit. Without this, a crash between the two statements could advance the
 *     head while silently dropping the revision from `versions()`. Each batch's SECOND
 *     statement (the history insert) is written as an `INSERT ... SELECT ... WHERE
 *     EXISTS (...)` / `INSERT ... SELECT ... FROM doc_heads WHERE ...` that only matches
 *     rows when the FIRST statement (in the SAME batch) actually won — so a losing head
 *     statement (a stale CAS, or a lost expect-absent-create race) naturally produces a
 *     losing (zero-row) history insert too, with no extra branching needed. Reserved
 *     files and blobs have no history table, so their writes stay single-statement
 *     (already atomic; nothing to batch).
 *
 * Version tokens are computed EXCLUSIVELY by core's existing functions (`contentVersion`/
 * `versionOfBytes` for docs and reserved files, `blobVersion` for blobs) — this backend
 * introduces no new hashing path, so it produces byte-identical tokens to
 * `FilesystemBackend`/`MemoryBackend`/`RemoteBackend` for the same content.
 *
 * Idempotency (a byte-identical write should not grow history) is honored two ways:
 *   - UNCONDITIONAL writes: a pre-read compares the incoming content's version against the
 *     current head; an identical match returns early with NO write at all (mirrors
 *     `MemoryBackend`'s in-process short-circuit). A real change proceeds through the
 *     batched upsert-plus-history-append above.
 *   - CAS writes (`expectedVersion` set to a specific token): if the NEW content's version
 *     equals `expectedVersion` itself, the caller is asserting "current == expectedVersion
 *     AND my new content hashes to that same value" — i.e. a redundant no-op CAS. This is
 *     verified with a plain read (current == expectedVersion ⇒ true no-op, no write; a
 *     mismatch ⇒ a genuine `VersionConflict`) BEFORE any batch is attempted, so a real
 *     content change never pays for a wasted write and a true no-op never grows history.
 *     For BLOBS specifically, matching bytes alone is not sufficient to call it a no-op:
 *     `writeBlob`'s CAS branch additionally compares the CURRENT row's `content_type`
 *     against the resolved incoming one. Bytes-and-content-type both matching ⇒ true
 *     no-op; bytes matching but content-type DIFFERENT ⇒ a real (metadata-only) update is
 *     applied via a conditional `UPDATE ... SET content_type = ? WHERE key = ? AND
 *     version = ?` (the version token itself does not change — it is bytes-derived).
 *     Silently dropping a content-type-only change would itself be a silent-data-loss bug
 *     — this mirrors `MemoryBackend.writeBlob`'s own idempotency check exactly (it also
 *     requires BOTH `version` and `contentType` unchanged before treating a write as a
 *     no-op).
 */

import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

import {
  assertSafeBlobKey,
  assertSafeConceptId,
  assertSafeReservedDir,
  blobVersion,
  defaultActor,
  parseMarkdown,
  resolveContentType,
  stringifyDoc,
  versionOfBytes,
  VersionConflict,
} from "@agentstate-lite/core";
import type {
  BlobKey,
  ConceptId,
  DeleteOptions,
  Frontmatter,
  HeadResult,
  OkfDocument,
  QueryFilter,
  ReadBlobResult,
  ReadResult,
  ReservedFilename,
  ReservedReadResult,
  StorageBackend,
  Version,
  VersionInfo,
  WriteOptions,
} from "@agentstate-lite/core";

import { r2KeyForVersion } from "./keys.js";

const enc = new TextEncoder();
const dec = new TextDecoder();

/** Conservative D1 bound-parameter chunk size for an `IN (...)` list (task-pinned: ~50). */
const READ_MANY_CHUNK = 50;

/** An ENOENT-shaped rejection, matching `FilesystemBackend`/`MemoryBackend`'s `read()`. */
function notFound(id: ConceptId): NodeJS.ErrnoException {
  const err = new Error(`no concept document '${id}'`) as NodeJS.ErrnoException;
  err.code = "ENOENT";
  return err;
}

/** Bundle-relative reserved-file key for a directory (`""` = bundle root), mirroring the other adapters' layout. */
function reservedKey(dir: string, name: ReservedFilename): string {
  const d = dir.replace(/^\.?\/+/, "").replace(/\/+$/, "");
  return d === "" ? name : `${d}/${name}`;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * True when `value` survives a JSON round-trip IDENTICALLY: plain objects/arrays of
 * strings, finite numbers, booleans, and null. Anything else — a nested `Date` (js-yaml
 * parses an unquoted nested date to one, and only TOP-LEVEL dates are ISO-normalized by
 * the parse layer), `Infinity`/`NaN` (JSON turns them into `null`), `undefined` (JSON
 * drops the key) — would make a cached `frontmatter` column DIVERGE from what a direct
 * `parseMarkdown` returns. Such frontmatter is simply NOT cached (column stays NULL →
 * read-through serves the exact parsed shapes), so column-vs-parse divergence is
 * unrepresentable rather than merely unlikely.
 */
function isJsonPure(value: unknown): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(isJsonPure);
  if (typeof value === "object") {
    const proto = Object.getPrototypeOf(value);
    if (proto !== Object.prototype && proto !== null) return false; // Date, Map, class instances
    return Object.values(value).every(isJsonPure);
  }
  return false; // undefined, function, symbol, bigint
}

/** A `StorageBackend` over a Cloudflare D1 database (`db`) and R2 bucket (`bucket`). */
export class D1R2Backend implements StorageBackend {
  // Explicit field + assignment (not a constructor parameter property): Node's built-in
  // strip-only TypeScript support (`node --test`'s type-stripping, see `test/ts-loader.mjs`)
  // does not implement TS parameter properties, and every other adapter in this codebase
  // (`FilesystemBackend`, `MemoryBackend`) already uses this exact explicit-field form.
  private readonly db: D1Database;
  private readonly bucket: R2Bucket;

  constructor(db: D1Database, bucket: R2Bucket) {
    this.db = db;
    this.bucket = bucket;
  }

  /**
   * Self-declared capabilities (Stage-1 Unit 2b Part B — the seam's optional
   * `capabilities?()` addition, `core/src/types.ts`): the wire router's `GET
   * /v0/capabilities` endpoint prefers this over its `instanceof` fallback, so this
   * backend's REAL guarantees are reported instead of being guessed at (and misreported
   * as the FilesystemBackend/MemoryBackend fallback would, since D1R2Backend is neither).
   */
  capabilities(): { enforced_cas: boolean; blobs: boolean; projections: boolean; backlinks: boolean } {
    return { enforced_cas: true, blobs: true, projections: true, backlinks: false };
  }

  // ── shared content store (content-addressed, disjoint from head bookkeeping) ──────

  /**
   * Idempotent: ensure `bytes` exist in R2 at the content address `version`. Safe to call
   * unconditionally. Deliberately carries NO `httpMetadata.contentType` — see this
   * module's doc comment on why a shared content-addressed namespace cannot honestly
   * attach a per-write content-type to the underlying object.
   */
  private async ensureContent(version: Version, bytes: Uint8Array): Promise<void> {
    await this.bucket.put(r2KeyForVersion(version), bytes, { onlyIf: { etagDoesNotMatch: "*" } });
  }

  /** Fetch content bytes at `version`, or throw if the R2 object is unexpectedly missing (a head/content desync). */
  private async fetchContentBytes(version: Version): Promise<Uint8Array> {
    const obj = await this.bucket.get(r2KeyForVersion(version));
    if (!obj) {
      throw new Error(`D1R2Backend: content '${version}' is referenced by a head row but missing from R2.`);
    }
    return new Uint8Array(await obj.arrayBuffer());
  }

  /**
   * ONE R2 fetch per DISTINCT content address, in parallel — the shared dedup-fetch loop
   * `readMany` and `queryHeads`' read-through both ride, so the fetch strategy (and the
   * loud head/content-desync throw inside `fetchContentBytes`) cannot drift between the
   * read path and the scan path.
   */
  private async fetchBytesByVersion(versions: Iterable<Version>): Promise<Map<Version, Uint8Array>> {
    const byVersion = new Map<Version, Uint8Array>();
    await Promise.all(
      [...new Set(versions)].map(async (version) => {
        byVersion.set(version, await this.fetchContentBytes(version));
      }),
    );
    return byVersion;
  }

  // ── concept documents ──────────────────────────────────────────────────────────────

  async read(id: ConceptId): Promise<ReadResult> {
    assertSafeConceptId(id);
    const row = await this.db
      .prepare("SELECT version FROM doc_heads WHERE id = ?")
      .bind(id)
      .first<{ version: string }>();
    if (!row) throw notFound(id);
    const raw = dec.decode(await this.fetchContentBytes(row.version));
    const { frontmatter, body } = parseMarkdown(raw);
    return { doc: { id, frontmatter, body }, version: versionOfBytes(raw) };
  }

  async readMany(ids: ConceptId[]): Promise<ReadResult[]> {
    for (const id of ids) assertSafeConceptId(id);
    if (ids.length === 0) return [];

    const unique = [...new Set(ids)];
    const versionById = new Map<string, Version>();
    for (const group of chunk(unique, READ_MANY_CHUNK)) {
      const placeholders = group.map(() => "?").join(", ");
      const { results } = await this.db
        .prepare(`SELECT id, version FROM doc_heads WHERE id IN (${placeholders})`)
        .bind(...group)
        .all<{ id: string; version: string }>();
      for (const r of results) versionById.set(r.id, r.version);
    }

    // Fail fast on the first requested id with no head row (seam contract: reject if ANY
    // id is absent), before doing any content fetch.
    for (const id of ids) {
      if (!versionById.has(id)) throw notFound(id);
    }

    const byVersion = await this.fetchBytesByVersion(versionById.values());

    return ids.map((id) => {
      const version = versionById.get(id)!;
      const raw = dec.decode(byVersion.get(version)!);
      const { frontmatter, body } = parseMarkdown(raw);
      return { doc: { id, frontmatter, body }, version: versionOfBytes(raw) };
    });
  }

  /** Current doc-head version for `id`, or `null` if no head row exists — used for VersionConflict reporting. */
  private async currentDocVersion(id: ConceptId): Promise<Version | null> {
    const row = await this.db.prepare("SELECT version FROM doc_heads WHERE id = ?").bind(id).first<{ version: string }>();
    return row?.version ?? null;
  }

  async write(id: ConceptId, doc: OkfDocument, options: WriteOptions = {}): Promise<Version> {
    assertSafeConceptId(id);
    const raw = stringifyDoc(doc.frontmatter, doc.body ?? "");
    const version = versionOfBytes(raw);
    // The head row's `frontmatter` column (migration 0004) stores the PARSED frontmatter
    // of the exact serialized bytes — parse-parity with what `read()`/`readMany()` return
    // (the one normalization layer has run), so `queryHeads` can serve heads from D1
    // alone. Cached ONLY when the value is JSON-pure (see `isJsonPure`): exotic values a
    // JSON round-trip would mangle (nested Date, Infinity) leave the column NULL, and the
    // read-through path serves their exact parsed shapes — parity by construction, not by
    // hope. INVARIANT for future write paths: any statement that sets `doc_heads.version`
    // MUST bind `frontmatter` in the same statement — a version bump without the column
    // re-bind serves a stale-but-non-NULL head silently (no read-through fires).
    const parsedFm = parseMarkdown(raw).frontmatter;
    const fmJson = isJsonPure(parsedFm) ? JSON.stringify(parsedFm) : null;
    const actor = options.actor?.trim() || defaultActor();
    // Nullable, unlike `actor`: an unattested agent is simply absent (NULL), not defaulted.
    const agent = options.agent?.trim() || null;
    const now = new Date().toISOString();

    await this.ensureContent(version, enc.encode(raw));

    if (options.expectedVersion === undefined) {
      // Idempotency pre-check: an identical unconditional re-write is a true no-op — no
      // head write, no history growth (mirrors MemoryBackend's content-address short-circuit).
      // Deliberate consequence: a byte-identical re-write of a PRE-0004 row does NOT heal
      // its NULL `frontmatter` column (nothing runs); healing rides real writes only,
      // read-through covers the rest (see plans/d1-frontmatter-heads.md decision 5).
      const current = await this.currentDocVersion(id);
      if (current === version) return version;

      await this.db.batch([
        this.db
          .prepare(
            `INSERT INTO doc_heads (id, version, actor, agent, updated_at, seq, frontmatter) VALUES (?, ?, ?, ?, ?, 1, ?)
             ON CONFLICT(id) DO UPDATE SET
               version = excluded.version, actor = excluded.actor, agent = excluded.agent, updated_at = excluded.updated_at,
               seq = doc_heads.seq + 1, frontmatter = excluded.frontmatter`,
          )
          .bind(id, version, actor, agent, now, fmJson),
        this.db
          .prepare(
            `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
             SELECT ?, seq, ?, ?, ?, ? FROM doc_heads WHERE id = ? AND version = ?`,
          )
          .bind(id, version, actor, agent, now, id, version),
      ]);
      return version;
    }

    if (options.expectedVersion === null) {
      const results = await this.db.batch([
        this.db
          .prepare(
            "INSERT INTO doc_heads (id, version, actor, agent, updated_at, seq, frontmatter) VALUES (?, ?, ?, ?, ?, 1, ?) ON CONFLICT(id) DO NOTHING RETURNING id",
          )
          .bind(id, version, actor, agent, now, fmJson),
        this.db
          .prepare(
            // The EXISTS guard is meant to append history ONLY when statement 1's head INSERT won.
            // But its `(id, version, seq = 1)` shape ALSO matches a PRE-EXISTING head left by a prior
            // BYTE-IDENTICAL create (same content ⇒ same version token, head still at seq = 1). In
            // that losing case statement 1 already did nothing, yet the guard would still fire and
            // collide with the existing doc_history(id, seq = 1) PK — surfacing as a RAW D1 constraint
            // error (enveloped 400) instead of the typed VersionConflict the loser must get (the other
            // three backends detect head-existence directly). `ON CONFLICT(id, seq) DO NOTHING` makes
            // that stray append a harmless no-op; conflict detection stays driven by statement 1's
            // empty `RETURNING` (results[0] below), so a loser still throws cleanly. A genuine winner
            // has no pre-existing history row for seq = 1, so its append never hits this conflict.
            `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
             SELECT ?, 1, ?, ?, ?, ? WHERE EXISTS (SELECT 1 FROM doc_heads WHERE id = ? AND version = ? AND seq = 1)
             ON CONFLICT(id, seq) DO NOTHING`,
          )
          .bind(id, version, actor, agent, now, id, version),
      ]);
      if (results[0]!.results.length === 0) {
        throw new VersionConflict(id, null, await this.currentDocVersion(id));
      }
      return version;
    }

    // CAS against a specific expectedVersion.
    if (version === options.expectedVersion) {
      // The caller's new content hashes to the SAME value as expectedVersion — verify the
      // implied assertion (current == expectedVersion) with a plain read; if it holds this
      // is a true no-op (no write, no history growth), and if it doesn't it's a genuine
      // conflict. No batch is attempted either way.
      const current = await this.currentDocVersion(id);
      if (current === options.expectedVersion) return version;
      throw new VersionConflict(id, options.expectedVersion, current);
    }
    const results = await this.db.batch([
      this.db
        .prepare(
          "UPDATE doc_heads SET version = ?, actor = ?, agent = ?, updated_at = ?, seq = seq + 1, frontmatter = ? WHERE id = ? AND version = ?",
        )
        .bind(version, actor, agent, now, fmJson, id, options.expectedVersion),
      this.db
        .prepare(
          `INSERT INTO doc_history (id, seq, version, actor, agent, updated_at)
           SELECT ?, seq, ?, ?, ?, ? FROM doc_heads WHERE id = ? AND version = ?`,
        )
        .bind(id, version, actor, agent, now, id, version),
    ]);
    if (results[0]!.meta.changes === 0) {
      throw new VersionConflict(id, options.expectedVersion, await this.currentDocVersion(id));
    }
    return version;
  }

  /**
   * Hard-delete: `DELETE FROM doc_heads` (conditionally on `version` when `expectedVersion`
   * is given), plus a GUARDED second statement that purges `doc_history` for `id` ONLY WHEN
   * the head is now gone — batched atomically with the head delete so a crash between the
   * two can never leave orphaned history. The guard is `NOT EXISTS (SELECT 1 FROM doc_heads
   * WHERE id = ?)`, evaluated against the batch's post-first-statement state (the same
   * within-batch "did the prior statement in this SAME batch actually win" idiom `write`'s
   * CAS path already uses for its history INSERT) — it does NOT rely on `PRAGMA
   * foreign_keys`/`ON DELETE CASCADE` being active on this connection. A lost CAS (head
   * still present, stale `expectedVersion`) therefore leaves `doc_history` untouched; a
   * successful delete purges it entirely (D5 — a delete's history is unobservable
   * afterward, mirroring `MemoryBackend`'s whole-chain purge). R2 content bytes are
   * deliberately left behind (content-addressed/deduped, unreachable once every head
   * referencing them is gone; GC is out of scope for this unit).
   */
  async delete(id: ConceptId, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeConceptId(id);
    const headDelete =
      options.expectedVersion === undefined
        ? this.db.prepare("DELETE FROM doc_heads WHERE id = ?").bind(id)
        : this.db.prepare("DELETE FROM doc_heads WHERE id = ? AND version = ?").bind(id, options.expectedVersion);
    const historyDelete = this.db
      .prepare("DELETE FROM doc_history WHERE id = ? AND NOT EXISTS (SELECT 1 FROM doc_heads WHERE id = ?)")
      .bind(id, id);

    const results = await this.db.batch([headDelete, historyDelete]);
    if (results[0]!.meta.changes > 0) return true; // existed, and this call removed it

    if (options.expectedVersion === undefined) return false; // unconditional: nothing existed to delete

    // CAS: an absent target ALWAYS returns false regardless of expectedVersion (DeleteOptions'
    // idempotency contract) — distinguish that from a genuinely stale expectedVersion.
    const current = await this.currentDocVersion(id);
    if (current === null) return false;
    throw new VersionConflict(id, options.expectedVersion, current);
  }

  async exists(id: ConceptId): Promise<boolean> {
    assertSafeConceptId(id);
    const row = await this.db.prepare("SELECT 1 FROM doc_heads WHERE id = ?").bind(id).first();
    return row !== null;
  }

  async list(prefix?: string): Promise<ConceptId[]> {
    const { results } = await this.db.prepare("SELECT id FROM doc_heads").all<{ id: string }>();
    const ids = results.map((r) => r.id).filter((id) => !prefix || id.startsWith(prefix));
    ids.sort((a, b) => a.localeCompare(b));
    return ids;
  }

  /**
   * The seam's OPTIONAL head-projection push-down (`plans/d1-frontmatter-heads.md`):
   * serve `{ id, frontmatter, version }` heads from the D1 head index ALONE — ZERO R2
   * reads for any row whose `frontmatter` column (migration 0004) is populated. A NULL
   * or unparseable column (a pre-0004 legacy row) falls back to R2 read-through
   * (content fetch + the one parser, batched per distinct content address like
   * `readMany`), loud on a head/content desync exactly like `read()`. Only `prefix` is
   * pushed into SQL (LIKE with `%`/`_`/`\` escaped so a literal `_` in a prefix cannot
   * over-match); `type`/`tags`/`fields` are deliberately NOT pushed — the consumer
   * re-runs `matchesFilter` per the seam contract (over-return is fine; filter
   * semantics stay in core, never in SQL).
   *
   * SCHEMA DEPENDENCY: this SELECT — and every head-writing statement in `write()` —
   * references the `frontmatter` column UNCONDITIONALLY. Migration 0004 must be applied
   * BEFORE code carrying this method deploys; against a pre-0004 schema the failure is
   * `no such column`, an outage, not a graceful fallback (the read-through path guards
   * NULL column VALUES, not a missing column).
   */
  async queryHeads(filter: QueryFilter = {}): Promise<HeadResult[]> {
    type HeadRow = { id: string; version: string; frontmatter: string | null };
    let rows: HeadRow[];
    if (filter.prefix) {
      const escaped = filter.prefix.replace(/[\\%_]/g, (c) => `\\${c}`);
      ({ results: rows } = await this.db
        .prepare("SELECT id, version, frontmatter FROM doc_heads WHERE id LIKE ? ESCAPE '\\'")
        .bind(`${escaped}%`)
        .all<HeadRow>());
    } else {
      ({ results: rows } = await this.db.prepare("SELECT id, version, frontmatter FROM doc_heads").all<HeadRow>());
    }

    // First pass: accept the column ONLY when it parses to a plain object (a corrupted
    // column holding valid-but-wrong JSON — the literal `null`, a number, an array — must
    // behave exactly like an unparseable one: read through, never crash a page render or
    // serve garbage frontmatter); collect the read-through set.
    const parsed = new Map<string, Frontmatter>(); // id -> frontmatter from the column
    const readThroughVersions = new Set<Version>();
    for (const row of rows) {
      if (row.frontmatter !== null) {
        try {
          const value: unknown = JSON.parse(row.frontmatter);
          if (value !== null && typeof value === "object" && !Array.isArray(value)) {
            parsed.set(row.id, value as Frontmatter);
            continue;
          }
        } catch {
          // fall through to read-through
        }
      }
      readThroughVersions.add(row.version);
    }
    // Read-through for legacy/uncacheable rows: the shared dedup fetch, then ONE parse
    // per distinct content address.
    const byVersion = new Map<Version, Frontmatter>();
    for (const [version, bytes] of await this.fetchBytesByVersion(readThroughVersions)) {
      byVersion.set(version, parseMarkdown(dec.decode(bytes)).frontmatter);
    }

    return rows.map((row) => ({
      id: row.id,
      frontmatter: parsed.get(row.id) ?? byVersion.get(row.version)!,
      version: row.version,
    }));
  }

  async versions(id: ConceptId): Promise<VersionInfo[]> {
    assertSafeConceptId(id);
    const { results } = await this.db
      .prepare("SELECT version, actor, agent, updated_at FROM doc_history WHERE id = ? ORDER BY seq DESC")
      .bind(id)
      .all<{ version: string; actor: string; agent: string | null; updated_at: string }>();
    // NULL (no attested agent) -> omit the field entirely, matching MemoryBackend's shape.
    return results.map((r) =>
      r.agent === null
        ? { version: r.version, actor: r.actor, timestamp: r.updated_at }
        : { version: r.version, actor: r.actor, timestamp: r.updated_at, agent: r.agent },
    );
  }

  // ── reserved files (index.md / log.md) ─────────────────────────────────────────────

  private async currentReservedVersion(dir: string, name: ReservedFilename): Promise<Version | null> {
    const row = await this.db
      .prepare("SELECT version FROM reserved_heads WHERE dir = ? AND name = ?")
      .bind(dir, name)
      .first<{ version: string }>();
    return row?.version ?? null;
  }

  async readReserved(dir: string, name: ReservedFilename): Promise<ReservedReadResult | null> {
    assertSafeReservedDir(dir);
    const row = await this.db
      .prepare("SELECT version FROM reserved_heads WHERE dir = ? AND name = ?")
      .bind(dir, name)
      .first<{ version: string }>();
    if (!row) return null;
    const content = dec.decode(await this.fetchContentBytes(row.version));
    return { content, version: versionOfBytes(content) };
  }

  async writeReserved(dir: string, name: ReservedFilename, content: string, options: WriteOptions = {}): Promise<Version> {
    assertSafeReservedDir(dir);
    const version = versionOfBytes(content);
    const now = new Date().toISOString();

    await this.ensureContent(version, enc.encode(content));

    if (options.expectedVersion === undefined) {
      await this.db
        .prepare(
          `INSERT INTO reserved_heads (dir, name, version, updated_at) VALUES (?, ?, ?, ?)
           ON CONFLICT(dir, name) DO UPDATE SET version = excluded.version, updated_at = excluded.updated_at
           WHERE reserved_heads.version != excluded.version`,
        )
        .bind(dir, name, version, now)
        .run();
      return version;
    }

    if (options.expectedVersion === null) {
      // Expect-absent create: ON CONFLICT DO NOTHING + RETURNING, not a try/catch around a
      // bare INSERT — a row returned means we won; zero rows means someone else's row is
      // already there (F2: no more string-matching a D1 error message to detect this).
      const row = await this.db
        .prepare(
          "INSERT INTO reserved_heads (dir, name, version, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(dir, name) DO NOTHING RETURNING dir",
        )
        .bind(dir, name, version, now)
        .first<{ dir: string }>();
      if (!row) {
        throw new VersionConflict(reservedKey(dir, name), null, await this.currentReservedVersion(dir, name));
      }
      return version;
    }

    const result = await this.db
      .prepare("UPDATE reserved_heads SET version = ?, updated_at = ? WHERE dir = ? AND name = ? AND version = ?")
      .bind(version, now, dir, name, options.expectedVersion)
      .run();
    if (result.meta.changes === 0) {
      throw new VersionConflict(reservedKey(dir, name), options.expectedVersion, await this.currentReservedVersion(dir, name));
    }
    return version;
  }

  // ── blobs: opaque bytes + a content-type ───────────────────────────────────────────

  private async currentBlobVersion(key: BlobKey): Promise<Version | null> {
    const row = await this.db.prepare("SELECT version FROM blob_heads WHERE key = ?").bind(key).first<{ version: string }>();
    return row?.version ?? null;
  }

  async readBlob(key: BlobKey): Promise<ReadBlobResult | null> {
    assertSafeBlobKey(key);
    const row = await this.db
      .prepare("SELECT version, content_type FROM blob_heads WHERE key = ?")
      .bind(key)
      .first<{ version: string; content_type: string }>();
    if (!row) return null;
    const bytes = await this.fetchContentBytes(row.version);
    return { bytes, contentType: row.content_type, version: row.version };
  }

  async writeBlob(key: BlobKey, bytes: Uint8Array, contentType?: string, options: WriteOptions = {}): Promise<Version> {
    assertSafeBlobKey(key);
    const version = blobVersion(bytes);
    const resolvedType = resolveContentType(key, contentType);
    const actor = options.actor?.trim() || null;
    const now = new Date().toISOString();

    await this.ensureContent(version, bytes);

    if (options.expectedVersion === undefined) {
      await this.db
        .prepare(
          `INSERT INTO blob_heads (key, version, content_type, actor, updated_at) VALUES (?, ?, ?, ?, ?)
           ON CONFLICT(key) DO UPDATE SET
             version = excluded.version, content_type = excluded.content_type,
             actor = excluded.actor, updated_at = excluded.updated_at
           WHERE blob_heads.version != excluded.version OR blob_heads.content_type != excluded.content_type`,
        )
        .bind(key, version, resolvedType, actor, now)
        .run();
      return version;
    }

    if (options.expectedVersion === null) {
      // Expect-absent create: ON CONFLICT DO NOTHING + RETURNING (F2 — same shape as docs/reserved).
      const row = await this.db
        .prepare(
          "INSERT INTO blob_heads (key, version, content_type, actor, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(key) DO NOTHING RETURNING key",
        )
        .bind(key, version, resolvedType, actor, now)
        .first<{ key: string }>();
      if (!row) {
        throw new VersionConflict(key, null, await this.currentBlobVersion(key));
      }
      return version;
    }

    // CAS against a specific expectedVersion.
    if (version === options.expectedVersion) {
      // The new BYTES hash to the SAME value as expectedVersion. Unlike docs, that alone
      // does not make this a no-op: a blob also carries a content-type, and a content-type
      // CHANGE on otherwise-identical bytes is a real update (MemoryBackend's own blob
      // idempotency check requires bytes AND content-type both unchanged — see
      // `writeBlob` there — so silently dropping a content-type-only change here would be
      // exactly the silent-data-loss class this unit exists to prevent; review JC1).
      const row = await this.db
        .prepare("SELECT version, content_type FROM blob_heads WHERE key = ?")
        .bind(key)
        .first<{ version: string; content_type: string }>();
      const current = row?.version ?? null;
      if (current !== options.expectedVersion) {
        throw new VersionConflict(key, options.expectedVersion, current);
      }
      if (row!.content_type === resolvedType) {
        return version; // true no-op: bytes AND content-type both unchanged
      }
      // Bytes match `expectedVersion` (so the version token itself does not change — it is
      // bytes-derived) but content-type differs: apply it. Still CAS-guarded by the SAME
      // `expectedVersion` — if a concurrent writer moved the row in between, this UPDATE
      // matches zero rows and falls through to a genuine VersionConflict below, exactly
      // like every other conditional write on this backend.
      const typeResult = await this.db
        .prepare("UPDATE blob_heads SET content_type = ?, actor = ?, updated_at = ? WHERE key = ? AND version = ?")
        .bind(resolvedType, actor, now, key, options.expectedVersion)
        .run();
      if (typeResult.meta.changes === 0) {
        throw new VersionConflict(key, options.expectedVersion, await this.currentBlobVersion(key));
      }
      return version;
    }
    const result = await this.db
      .prepare("UPDATE blob_heads SET version = ?, content_type = ?, actor = ?, updated_at = ? WHERE key = ? AND version = ?")
      .bind(version, resolvedType, actor, now, key, options.expectedVersion)
      .run();
    if (result.meta.changes === 0) {
      throw new VersionConflict(key, options.expectedVersion, await this.currentBlobVersion(key));
    }
    return version;
  }

  /**
   * Hard-delete: a single conditional `DELETE FROM blob_heads` (no history table to purge —
   * blobs never had one, see this module's header). Same zero-rows classification as
   * `delete()`: a row actually removed -> `true`; zero rows under an unconditional delete ->
   * `false` (nothing existed); zero rows under CAS -> re-check current to distinguish
   * "already absent" (`false`) from a genuinely stale `expectedVersion` (`VersionConflict`).
   * R2 content bytes are left behind, same rationale as `delete()`.
   */
  async deleteBlob(key: BlobKey, options: DeleteOptions = {}): Promise<boolean> {
    assertSafeBlobKey(key);
    const stmt =
      options.expectedVersion === undefined
        ? this.db.prepare("DELETE FROM blob_heads WHERE key = ?").bind(key)
        : this.db.prepare("DELETE FROM blob_heads WHERE key = ? AND version = ?").bind(key, options.expectedVersion);
    const result = await stmt.run();
    if (result.meta.changes > 0) return true;

    if (options.expectedVersion === undefined) return false;

    const current = await this.currentBlobVersion(key);
    if (current === null) return false;
    throw new VersionConflict(key, options.expectedVersion, current);
  }

  async existsBlob(key: BlobKey): Promise<boolean> {
    assertSafeBlobKey(key);
    const row = await this.db.prepare("SELECT 1 FROM blob_heads WHERE key = ?").bind(key).first();
    return row !== null;
  }

  async listBlobs(prefix?: string): Promise<BlobKey[]> {
    const { results } = await this.db.prepare("SELECT key FROM blob_heads").all<{ key: string }>();
    const keys = results.map((r) => r.key).filter((k) => !prefix || k.startsWith(prefix));
    keys.sort((a, b) => a.localeCompare(b));
    return keys;
  }
}
