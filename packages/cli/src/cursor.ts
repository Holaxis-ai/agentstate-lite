// `cursor.ts` — the per-bundle sync/awareness STATE STORE (sync-verb plan §U2).
//
// ONE module owns the three pieces of per-clone local state that the sync verb (U3) writes and
// SessionStart/home (U4) reads, all under ONE per-clone key in `~/.agentstate/sync/`:
//
//   1. the awareness CURSOR — an OPAQUE `{tier, token}` ("where this machine last read up to").
//      The git tier stores a commit SHA as the token; a future hosted tier ships
//      `{tier: "d1", token: <seq>}` behind the SAME `changesSince` interface, so the store (and
//      the CLI above it) never interprets the token — an UNKNOWN tier round-trips untouched.
//   2. the awareness CACHE — the enriched delta rows plus the unpushed/uncommitted backstop
//      counts that `home` renders fs-only ("since your last session: …" + "M local board commits
//      not yet pushed"), timestamped so a consumer can label/expire it.
//   3. the board-pending MARKER — a timestamp refreshed by every pull step; its PRESENCE is the
//      fs-only "a board exists for this repo" signal that keeps first-contact from ever hinting
//      `init` at a founder whose origin already has a board. Under per-clone keying the marker is
//      per-checkout too (a brand-new clone has none until its first pull) — deliberately NOT
//      split out onto a shared per-remote key: it has no shipped consumer yet (U4), its contract
//      already requires absence to read as "unknown, never an error", and a second keyspace would
//      reintroduce exactly the cross-clone file coupling this keying exists to prevent.
//
// BOUNDARY (binding): this module is the state store + its schema/serialization ONLY. The git
// diff, the `git cat-file -e` cursor-existence guard, and per-doc frontmatter enrichment live in
// U1's `git.ts` (`changesSince` et al.) — this module NEVER shells out to git. When the CALLER's
// existence guard finds the stored token gone (history rewritten), it re-anchors through
// {@link recordReanchor}, which records the honest {@link REANCHOR_NOTE} in the cache so the miss
// is REPORTED, never a silent skip and never fatal.
//
// KEYING: per CLONE — remote URL + subpath + the CHECKOUT ROOT (this checkout's absolute board
// path), falling back to the absolute bundle root alone for a remote-less repo. Every piece of
// state here is a per-CLONE fact: the cursor is "what THIS CHECKOUT's board last saw" (each
// clone's board worktree has its own HEAD), the unpushed/uncommitted backstop counts are computed
// against this checkout's worktree, and the cache's delta rows derive from the per-clone cursor.
// An earlier revision keyed by remote+subpath only ("every checkout of the same shared board on
// this machine shares one cursor") — empirically WRONG (PR#13 review, item 4): two clones of one
// origin on one machine shared one state file, so clone A's clean sync erased clone B's
// "unpushed: 2" backstop state — the backstop failed exactly on its target case, and the
// agent-worktree pattern makes same-machine multi-clone the norm. The remote-URL component is
// KEPT alongside the checkout root so a recycled path (project X's clone deleted, project Y
// cloned at the same location) reads the old state as foreign instead of inheriting it. The key
// is hashed into the state file's name and ALSO stored inside the file; a read whose stored key
// mismatches is treated as foreign (null), so a hash collision can never bleed one bundle's
// state into another.
//
// MIGRATION (old remote-only keys → per-clone keys): none — ignore-and-reanchor. State files
// written under the pre-fix key are simply never read again (their stored key can't match any
// new-shape key, so even a hand-renamed file reads as foreign); they sit as small orphaned JSON
// under `~/.agentstate/sync/` and are harmless. Every piece of state is re-derivable from git:
// the first post-upgrade sync finds no cursor and falls back to its pre-sync HEAD baseline (the
// same honest first-sync shape a fresh clone gets), and the backstop counts are recomputed from
// the worktree on every sync. No cleanup sweep — deleting files we cannot positively attribute
// is riskier than leaving them.
//
// DURABILITY: every write goes through `credentials.ts`'s `writeFileAtomic0600` — THE one
// `~/.agentstate/` atomic-write discipline (O_EXCL temp 0600 → chmod → rename, dir forced 0700).
// Writes are read-merge-write over the whole per-bundle file; the rename keeps readers
// crash-consistent (old complete file or new complete file, never a partial). Like
// `FilesystemBackend`, cross-process last-writer-wins is accepted — the state here is a cursor
// and a render cache, both re-derivable from git on the next sync.
//
// READS NEVER THROW: absent, malformed, foreign-keyed, unreadable, or (where a max age is given)
// stale state all read as `null` — `home`'s double-guard depends on this, and marker/cache
// absence alone must never degrade a session (U2 DoD: marker absence ALONE never produces
// "run init").
import { chmod, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";

import { credentialsDir, writeFileAtomic0600 } from "./credentials.js";

/** The subdirectory of `~/.agentstate/` holding per-bundle sync state files. */
export const SYNC_STATE_DIR_NAME = "sync";
const DIR_MODE = 0o700;

/**
 * The honest re-anchor note recorded when the stored cursor's object no longer exists (history
 * rewritten under it) — surfaced by the next `home` render instead of the delta. NEVER a silent
 * skip, never fatal (plan §U2).
 */
export const REANCHOR_NOTE = "delta unavailable (history rewritten)";

// ── per-bundle key ────────────────────────────────────────────────────────────

/**
 * What identifies a bundle CHECKOUT for state-keying: the repo's remote URL + the bundle's
 * subpath within the repo + this checkout's absolute root (the caller — sync's command layer —
 * knows all three), or, for a repo with no remote, the absolute bundle root alone. Deliberately
 * per-CLONE, not per-remote-per-machine: two checkouts of the same shared board on one machine
 * get two keys, because the cursor and the unpushed/uncommitted backstop counts are facts about
 * ONE checkout's worktree (PR#13 review, item 4 — the shared-key shape let one clone's clean
 * sync erase another's stranded-unpushed state). U4's honesty story is per-checkout too: "since
 * this checkout last synced" is the delta a session sitting in that checkout can act on.
 */
export type BundleKeySource =
  | { remoteUrl: string; subpath: string; checkoutRoot: string }
  | { root: string };

/**
 * Light, lossless-in-spirit normalization so trivially-equivalent URL spellings key together.
 * Known caveats (recorded on tasks/sync-cursor-store): ssh-vs-https spellings of one repo still
 * FALSE-SPLIT, and `.git`-stripping can FALSE-MERGE two genuinely distinct remote paths. With the
 * checkout root now in the key, both are far less load-bearing: a false-split only bites when the
 * SAME checkout's own origin URL spelling changes (the state honestly re-derives from the
 * first-sync baseline), and a false-merge can no longer merge two different clones' state — only
 * the same checkout across a `repo`↔`repo.git` remote flip, which IS the same bundle.
 */
function normalizeRemoteUrl(url: string): string {
  let u = url.trim().replace(/\/+$/, "");
  if (u.endsWith(".git")) u = u.slice(0, -".git".length);
  return u;
}

function normalizeSubpath(subpath: string): string {
  return subpath
    .trim()
    .replace(/^\.\//, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

/**
 * Derive the canonical per-clone key string. Newline-separated fields (a newline can appear in
 * neither a git URL nor a path in practice), prefixed with the key kind so a remote-keyed and a
 * path-keyed bundle can never collide textually. The checkout root is `resolve`d (one absolute
 * spelling) but NOT realpath'd here — the store stays a pure serialization layer; a caller that
 * can sit behind symlinks (sync does, via its board-path resolution) realpaths before keying.
 */
export function bundleKey(src: BundleKeySource): string {
  if ("remoteUrl" in src) {
    return `remote\n${normalizeRemoteUrl(src.remoteUrl)}\n${normalizeSubpath(src.subpath)}\n${resolve(src.checkoutRoot)}`;
  }
  return `path\n${resolve(src.root)}`;
}

/** `~/.agentstate/sync` — the 0700 directory holding one state file per bundle key. */
export function syncStateDir(home: string = homedir()): string {
  return join(credentialsDir(home), SYNC_STATE_DIR_NAME);
}

/** The truncated sha256 digest that names this key's on-disk artifacts (ONE hashing locus). */
function keyDigest(key: string): string {
  return createHash("sha256").update(key, "utf8").digest("hex").slice(0, 32);
}

/** The absolute path of the state file for `key` (filename = truncated sha256 of the key). */
export function syncStatePath(key: string, home: string = homedir()): string {
  return join(syncStateDir(home), `${keyDigest(key)}.json`);
}

/**
 * `~/.agentstate/sync/exports/<key-digest>` — the per-bundle directory sync's CONVERGING conflict
 * mechanic (U3b) exports the LOCAL version of each conflicted doc into ("yours saved at <path>").
 * Deliberately OUTSIDE any worktree (the board worktree must end every sync pristine) and under
 * the same per-clone key discipline as the cursor/cache/marker state — exports for two different
 * bundles (or two clones of ONE bundle: each clone's conflicted local version is its own "yours")
 * can never collide. Stable per doc (no per-run timestamp): a re-conflict on the same doc
 * overwrites the export with the NEWER local version, which is what "yours" means at that point,
 * and nothing accumulates unboundedly. This module only names the path; the git layer creates it.
 */
export function syncExportsDir(key: string, home: string = homedir()): string {
  return join(syncStateDir(home), "exports", keyDigest(key));
}

// ── schema ────────────────────────────────────────────────────────────────────

/**
 * The OPAQUE awareness cursor. `tier` names the sync backend that minted the token; `token` is
 * meaningful ONLY to that tier (git: a commit SHA string; a future d1 tier: a sequence number).
 * The store validates shape, never meaning, and preserves any extra fields a future tier adds —
 * so a new tier swaps in without CLI changes (plan §U2).
 */
export interface SyncCursor {
  readonly tier: string;
  readonly token: string | number;
  readonly [extra: string]: unknown;
}

/**
 * One enriched delta row — THE single feed shape (produced by U1's `changesSince`, rendered by
 * U3's sync envelope and U4's home face, and the future activity feed's row). `actor` is sourced
 * PER-DOC FROM FRONTMATTER, never from a commit subject (adjudication F) — this store only
 * persists it.
 */
export interface AwarenessDeltaRow {
  docId: string;
  /** "added" | "updated" | "deleted" — minted by the producer; persisted verbatim here. */
  verb: string;
  kind: string;
  title: string;
  actor: string;
  [extra: string]: unknown;
}

/**
 * The awareness cache `home` renders fs-only (§U4): the since-last-session delta plus the
 * backstop counts (BOTH unpushed board commits AND uncommitted board changes — catching the agent
 * that never ran sync at all, not just the failed-push one). `note` carries an honest condition
 * to surface instead of/alongside the delta (e.g. {@link REANCHOR_NOTE}).
 */
export interface AwarenessCache {
  /** ISO timestamp of the pull step that refreshed this cache (staleness labeling/expiry). */
  updatedAt: string;
  delta: AwarenessDeltaRow[];
  /** Local board commits not yet pushed to origin. */
  unpushedCount: number;
  /** Uncommitted changes sitting in the board worktree. */
  uncommittedCount: number;
  note?: string;
  [extra: string]: unknown;
}

/**
 * The board-pending marker: presence = "a board exists for this repo" (fs-only first-contact
 * signal, §U4); `updatedAt` is refreshed by every pull step. Absence is ALWAYS a valid state —
 * consumers must treat a missing marker as "unknown", never as an error.
 */
export interface BoardPendingMarker {
  updatedAt: string;
  [extra: string]: unknown;
}

/**
 * The actors THIS CLONE has committed to the board (U4's "self" identity — how the home render
 * knows which awareness-delta rows are self-authored and filters them from the human count). There
 * is no machine-level identity to derive "self" from (adjudication F rejected git authorship as an
 * attribution source), so self is DEFINED operationally: every actor that appeared in a doc THIS
 * checkout's own `sync` committed is recorded here at commit time. A clone that never committed
 * anything has an empty list and filters nothing — honest for a read-only session. `"unknown"`
 * (core's absent-actor placeholder) is deliberately NEVER recorded: filtering it would also hide a
 * TEAMMATE's unattributed changes, and hiding real incoming work is worse than showing your own
 * unattributed rows. Capped ({@link SELF_ACTORS_CAP}, newest kept) so a pathological bundle cannot
 * grow the state file unboundedly.
 */
export const SELF_ACTORS_CAP = 64;

/** The whole per-bundle state record. Every piece is independently nullable. */
export interface SyncState {
  cursor: SyncCursor | null;
  cache: AwarenessCache | null;
  marker: BoardPendingMarker | null;
  /** See {@link SELF_ACTORS_CAP}'s doc — the actors this clone's own syncs have committed. */
  selfActors: string[] | null;
  /**
   * ISO timestamp of the last OPPORTUNISTIC auto-pull ATTEMPT (autopull.ts — the stale-cache pull
   * board-reading commands run). Recorded at attempt time, success or not, so a pull that CANNOT
   * refresh the cache (offline, diverged, dirty) still backs the trigger off for a full staleness
   * window instead of re-paying the network budget on every subsequent read. The cache's own
   * `updatedAt` stays the success-side signal (written only by a successful pull — that contract
   * is unchanged); this is the attempt-side throttle next to it.
   */
  autoPullAttemptAt: string | null;
  /**
   * ISO timestamp of the one-time hook-install onboarding hint (sync's receipt hints
   * `hook install` when no SessionStart hook is installed — once per clone, never nagging).
   * Presence = "already hinted"; the hint also self-suppresses once a hook IS installed.
   */
  hookHintedAt: string | null;
}

const EMPTY_STATE: SyncState = {
  cursor: null,
  cache: null,
  marker: null,
  selfActors: null,
  autoPullAttemptAt: null,
  hookHintedAt: null,
};

// ── validation (malformed → null, section-independent) ───────────────────────

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** A string that parses to a real date — the schema's timestamp requirement. */
function isTimestamp(v: unknown): v is string {
  return typeof v === "string" && Number.isFinite(Date.parse(v));
}

function isCount(v: unknown): v is number {
  return typeof v === "number" && Number.isInteger(v) && v >= 0;
}

/** Validate a cursor SHAPE (tier + token present and sane) while preserving it verbatim. */
function asCursor(v: unknown): SyncCursor | null {
  if (!isRecord(v)) return null;
  if (typeof v.tier !== "string" || v.tier.length === 0) return null;
  const token = v.token;
  const tokenOk =
    (typeof token === "string" && token.length > 0) ||
    (typeof token === "number" && Number.isFinite(token));
  if (!tokenOk) return null;
  return { ...v } as SyncCursor;
}

function asDeltaRow(v: unknown): AwarenessDeltaRow | null {
  if (!isRecord(v)) return null;
  for (const field of ["docId", "verb", "kind", "title", "actor"] as const) {
    if (typeof v[field] !== "string") return null;
  }
  return { ...v } as AwarenessDeltaRow;
}

function asCache(v: unknown): AwarenessCache | null {
  if (!isRecord(v)) return null;
  if (!isTimestamp(v.updatedAt)) return null;
  if (!Array.isArray(v.delta)) return null;
  const delta: AwarenessDeltaRow[] = [];
  for (const raw of v.delta) {
    const row = asDeltaRow(raw);
    if (row === null) return null; // one malformed row poisons the cache — a partial delta would lie
    delta.push(row);
  }
  if (!isCount(v.unpushedCount) || !isCount(v.uncommittedCount)) return null;
  if (v.note !== undefined && typeof v.note !== "string") return null;
  return { ...v, delta } as AwarenessCache;
}

function asMarker(v: unknown): BoardPendingMarker | null {
  if (!isRecord(v)) return null;
  if (!isTimestamp(v.updatedAt)) return null;
  return { ...v } as BoardPendingMarker;
}

/** Validate the self-actors SHAPE (an array of non-empty strings) — malformed reads as null. */
function asSelfActors(v: unknown): string[] | null {
  if (!Array.isArray(v)) return null;
  if (!v.every((a) => typeof a === "string" && a.length > 0)) return null;
  return [...v];
}

/** `null` when `updatedAt` is older than `maxAgeMs` (or unbounded when no max age is given). */
function freshOrNull<T extends { updatedAt: string }>(
  value: T | null,
  opts?: ReadOptions,
): T | null {
  if (value === null) return null;
  if (opts?.maxAgeMs === undefined) return value;
  const now = (opts.now ?? (() => new Date()))();
  const age = now.getTime() - Date.parse(value.updatedAt);
  return age > opts.maxAgeMs ? null : value;
}

// ── reads (never throw) ───────────────────────────────────────────────────────

/** Staleness policy for timestamped reads — the CONSUMER decides how old is too old. */
export interface ReadOptions {
  /** When set, a cache/marker older than this reads as `null` (stale = absent). */
  maxAgeMs?: number;
  /** Injectable clock for tests. */
  now?: () => Date;
}

/**
 * Read the whole per-bundle state record. NEVER throws: absent file, unreadable file, invalid
 * JSON, or a foreign key all read as the empty record; each SECTION is validated independently,
 * so one malformed section reads null without taking the others down.
 */
export async function readSyncState(key: string, home: string = homedir()): Promise<SyncState> {
  let raw: string;
  try {
    raw = await readFile(syncStatePath(key, home), "utf8");
  } catch {
    return { ...EMPTY_STATE }; // absent or unreadable — both are just "no state yet"
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ...EMPTY_STATE };
  }
  if (!isRecord(parsed)) return { ...EMPTY_STATE };
  // Foreign-file guard: the key is stored INSIDE the file too; a truncated-hash collision (or a
  // hand-copied file) must read as absent for this key, never as another bundle's state.
  if (parsed.key !== key) return { ...EMPTY_STATE };
  return {
    cursor: asCursor(parsed.cursor),
    cache: asCache(parsed.cache),
    marker: asMarker(parsed.marker),
    selfActors: asSelfActors(parsed.selfActors),
    autoPullAttemptAt: isTimestamp(parsed.autoPullAttemptAt) ? parsed.autoPullAttemptAt : null,
    hookHintedAt: isTimestamp(parsed.hookHintedAt) ? parsed.hookHintedAt : null,
  };
}

/** The stored cursor, or `null` (absent/malformed — never throws). Cursors do not age out. */
export async function readCursor(key: string, home: string = homedir()): Promise<SyncCursor | null> {
  return (await readSyncState(key, home)).cursor;
}

/** The awareness cache, or `null` (absent/malformed/stale-past-`maxAgeMs` — never throws). */
export async function readCache(
  key: string,
  opts?: ReadOptions,
  home: string = homedir(),
): Promise<AwarenessCache | null> {
  return freshOrNull((await readSyncState(key, home)).cache, opts);
}

/** The board-pending marker, or `null` (absent/malformed/stale-past-`maxAgeMs` — never throws). */
export async function readMarker(
  key: string,
  opts?: ReadOptions,
  home: string = homedir(),
): Promise<BoardPendingMarker | null> {
  return freshOrNull((await readSyncState(key, home)).marker, opts);
}

// ── writes (atomic read-merge-write; invalid input is a programmer error) ─────

/**
 * Merge `patch` into the stored record and write the whole file atomically. An explicit `null` in
 * the patch CLEARS that section; an absent field preserves it. Returns the state as written.
 * Writes CAN throw (disk/permission errors) — they run inside sync, never inside `home`.
 */
export async function writeSyncState(
  key: string,
  patch: Partial<SyncState>,
  home: string = homedir(),
): Promise<SyncState> {
  const next: SyncState = { ...(await readSyncState(key, home)), ...patch };
  // Force the PARENT `~/.agentstate/` to 0700 too (writeFileAtomic0600 only governs the leaf dir).
  const parent = credentialsDir(home);
  await mkdir(parent, { recursive: true, mode: DIR_MODE });
  await chmod(parent, DIR_MODE);
  const path = syncStatePath(key, home);
  const record = {
    key,
    cursor: next.cursor ?? undefined,
    cache: next.cache ?? undefined,
    marker: next.marker ?? undefined,
    selfActors: next.selfActors ?? undefined,
    autoPullAttemptAt: next.autoPullAttemptAt ?? undefined,
    hookHintedAt: next.hookHintedAt ?? undefined,
  };
  await writeFileAtomic0600(syncStateDir(home), basename(path), JSON.stringify(record, null, 2) + "\n");
  return next;
}

/** Persist the cursor (verbatim — opaque token, unknown tiers untouched). */
export async function writeCursor(
  key: string,
  cursor: SyncCursor,
  home: string = homedir(),
): Promise<void> {
  if (asCursor(cursor) === null) {
    throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
  }
  await writeSyncState(key, { cursor }, home);
}

/** Persist the awareness cache the next `home` render reads. */
export async function writeCache(
  key: string,
  cache: AwarenessCache,
  home: string = homedir(),
): Promise<void> {
  if (asCache(cache) === null) {
    throw new TypeError(
      "cache must carry { updatedAt: ISO timestamp, delta: AwarenessDeltaRow[], unpushedCount, uncommittedCount }",
    );
  }
  await writeSyncState(key, { cache }, home);
}

/**
 * Refresh the board-pending marker's timestamp (called by every pull step). Preserves any extra
 * fields a prior writer stored on the marker. Returns the marker as written.
 */
export async function refreshMarker(
  key: string,
  home: string = homedir(),
  now: () => Date = () => new Date(),
): Promise<BoardPendingMarker> {
  const current = (await readSyncState(key, home)).marker;
  const marker: BoardPendingMarker = { ...(current ?? {}), updatedAt: now().toISOString() };
  await writeSyncState(key, { marker }, home);
  return marker;
}

/** The self-actor list for a bundle key, or `[]` (absent/malformed — never throws). */
export async function readSelfActors(key: string, home: string = homedir()): Promise<string[]> {
  return (await readSyncState(key, home)).selfActors ?? [];
}

/**
 * Record actors THIS CLONE just committed (sync's commit step calls this — see
 * {@link SELF_ACTORS_CAP}'s doc for the whole "self" identity story). Merge-union with the stored
 * list, newest-last, deduped, capped to the NEWEST {@link SELF_ACTORS_CAP} entries. `"unknown"` and
 * empty strings are dropped at this one chokepoint (recording the placeholder would make the U4
 * render hide a teammate's unattributed changes too). A call that changes nothing skips the write.
 */
export async function recordSelfActors(
  key: string,
  actors: string[],
  home: string = homedir(),
): Promise<string[]> {
  const current = (await readSyncState(key, home)).selfActors ?? [];
  const merged = [...current];
  for (const a of actors) {
    if (typeof a !== "string" || a.length === 0 || a === "unknown") continue;
    if (!merged.includes(a)) merged.push(a);
  }
  const capped = merged.slice(-SELF_ACTORS_CAP);
  if (capped.length === current.length && capped.every((a, i) => a === current[i])) {
    return current;
  }
  await writeSyncState(key, { selfActors: capped }, home);
  return capped;
}

/**
 * Re-anchor after the CALLER's existence guard (U1's `git cat-file -e` before diffing) finds the
 * stored token gone — history was rewritten under the cursor. Atomically records the NEW cursor
 * (HEAD, minted by the caller) AND an awareness cache whose `note` is the honest
 * {@link REANCHOR_NOTE} with an EMPTY delta (the real delta is unknowable across a rewrite) plus
 * the caller's current backstop counts — so the miss is reported on the next render, never a
 * silent skip, and never fatal. Returns the cache as written.
 */
export async function recordReanchor(
  key: string,
  cursor: SyncCursor,
  counts: { unpushedCount: number; uncommittedCount: number },
  home: string = homedir(),
  now: () => Date = () => new Date(),
): Promise<AwarenessCache> {
  if (asCursor(cursor) === null) {
    throw new TypeError("cursor must be { tier: non-empty string, token: non-empty string | finite number }");
  }
  const cache: AwarenessCache = {
    updatedAt: now().toISOString(),
    delta: [],
    unpushedCount: counts.unpushedCount,
    uncommittedCount: counts.uncommittedCount,
    note: REANCHOR_NOTE,
  };
  await writeSyncState(key, { cursor, cache }, home);
  return cache;
}

/** The last opportunistic auto-pull ATTEMPT timestamp, or `null` (absent/malformed — never throws). */
export async function readAutoPullAttemptAt(key: string, home: string = homedir()): Promise<string | null> {
  return (await readSyncState(key, home)).autoPullAttemptAt;
}

/**
 * Record an opportunistic auto-pull ATTEMPT (autopull.ts calls this BEFORE its network op — see
 * {@link SyncState.autoPullAttemptAt}: a failing/hanging pull must still back off for the window).
 */
export async function recordAutoPullAttempt(
  key: string,
  home: string = homedir(),
  now: () => Date = () => new Date(),
): Promise<void> {
  await writeSyncState(key, { autoPullAttemptAt: now().toISOString() }, home);
}

/** The one-time hook-install hint's shown-at timestamp, or `null` (absent/malformed — never throws). */
export async function readHookHintedAt(key: string, home: string = homedir()): Promise<string | null> {
  return (await readSyncState(key, home)).hookHintedAt;
}

/** Record that sync's one-time hook-install hint was shown for this clone (never shown again). */
export async function recordHookHinted(
  key: string,
  home: string = homedir(),
  now: () => Date = () => new Date(),
): Promise<void> {
  await writeSyncState(key, { hookHintedAt: now().toISOString() }, home);
}
