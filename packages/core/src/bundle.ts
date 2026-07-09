/**
 * OKF bundle operations — the engine.
 *
 * The engine owns all OKF SEMANTICS (id safety, the non-empty `type` rule,
 * reserved-file handling, `timestamp` defaulting, link/backlink derivation) and routes
 * every store access through a {@link StorageBackend}.
 * When a {@link Bundle} carries no `backend`, a {@link FilesystemBackend} rooted at
 * `bundle.root` is used — so existing `{ root }` callers keep working unchanged while
 * a non-filesystem store becomes a plug-in rather than a rewrite.
 */

import path from "node:path";

import { FilesystemBackend } from "./backend.js";
import { MalformedDocumentError, parseMarkdown, stringifyWithData } from "./frontmatter.js";
import { parseLinksFromDoc } from "./links.js";
import {
  assertSafeConceptId,
  isReservedFile,
  pathFromConceptId,
  toPosix,
} from "./paths.js";
import { VersionConflict } from "./versioning.js";
import type {
  BlobKey,
  Bundle,
  ConceptId,
  DeleteOptions,
  EdgeFilter,
  Frontmatter,
  HeadResult,
  InitBundleOptions,
  Link,
  OkfDocument,
  QueryFilter,
  ReadBlobResult,
  ReadResult,
  StorageBackend,
  Version,
  VersionInfo,
  WriteOptions,
} from "./types.js";

/** A written concept document together with the {@link Version} the backend recorded for it. */
export interface WriteResult {
  /** The persisted document (with `type` leading, `timestamp` trailing, defaults applied). */
  doc: OkfDocument;
  /** Opaque version token of the write — pass it back as {@link WriteOptions.expectedVersion} for a later compare-and-swap. */
  version: Version;
}

/** Bounded compare-and-swap retry budget for the engine's read-modify-write paths (reserved files, `link add`). */
const CAS_MAX_ATTEMPTS = 5;

/** Resolve the backend a bundle operation should use (defaults to a filesystem adapter). */
function backendFor(bundle: Bundle): StorageBackend {
  return bundle.backend ?? new FilesystemBackend(bundle.root);
}

// ── bundle lifecycle ──────────────────────────────────────────────────────────

/**
 * Initialize (or open) an OKF bundle at `root`. Creates the directory and a root
 * `index.md` carrying `okf_version` frontmatter (§11 — the sole place any
 * index.md may carry frontmatter). Idempotent: an existing `index.md` is left
 * untouched. Filesystem-backed by construction (creating a bundle is inherently
 * a local operation; a remote store is provisioned out of band).
 */
export async function initBundle(root: string, options: InitBundleOptions = {}): Promise<Bundle> {
  const resolved = path.resolve(root);
  const backend = new FilesystemBackend(resolved);
  if ((await backend.readReserved("", "index.md")) === null) {
    const okfVersion = options.okfVersion ?? "0.1";
    const name = path.basename(resolved);
    const body = `# ${name}\n\nAn Open Knowledge Format bundle.\n`;
    await backend.writeReserved("", "index.md", stringifyWithData({ okf_version: okfVersion }, body));
  }
  return { root: resolved };
}

// ── concept documents ─────────────────────────────────────────────────────────

/**
 * Atomically write (create or overwrite) a concept document to `<id>.md` and
 * surface the backend's {@link WriteResult} (the normalized document + its version
 * token). Enforces OKF §9.2 (non-empty `type`), rejects reserved-file ids, preserves
 * unknown frontmatter keys, and guarantees a `timestamp` (defaults to now).
 *
 * `options` threads the seam's hard-case capabilities THROUGH the engine: an
 * `expectedVersion` makes the write a compare-and-swap (typed `VersionConflict` on
 * mismatch), and `actor` attributes the revision. This is the version-returning
 * surface; {@link writeDoc} is the contract-stable wrapper that returns just the
 * document (so the version never leaks into a caller — e.g. CLI TOON output — that
 * did not ask for it).
 */
export async function writeDocVersioned(
  bundle: Bundle,
  doc: OkfDocument,
  options?: WriteOptions,
): Promise<WriteResult> {
  assertSafeConceptId(doc.id);
  const rel = pathFromConceptId(doc.id);
  if (isReservedFile(rel)) {
    throw new Error(
      `'${doc.id}' maps to a reserved file (${rel}); use the index/log accessors, not writeDoc.`,
    );
  }

  const type = doc.frontmatter?.type;
  if (typeof type !== "string" || type.trim() === "") {
    throw new Error(`OKF §9.2: frontmatter.type is required and must be non-empty (concept '${doc.id}').`);
  }

  const existingTs = doc.frontmatter.timestamp;
  const timestamp =
    typeof existingTs === "string" && existingTs.trim() !== ""
      ? existingTs
      : new Date().toISOString();

  // Reorder so `type` leads and `timestamp` trails, matching OKF sample docs.
  const { type: _t, timestamp: _ts, ...rest } = doc.frontmatter;
  const frontmatter: Frontmatter = { type, ...rest, timestamp };
  const saved: OkfDocument = { id: doc.id, frontmatter, body: doc.body ?? "" };

  const version = await backendFor(bundle).write(doc.id, saved, options);
  return { doc: saved, version };
}

/**
 * Atomically write (create or overwrite) a concept document, returning the
 * normalized {@link OkfDocument}. Contract-stable: the return type is unchanged from
 * the historical `Promise<OkfDocument>`, and the new `options` argument is optional.
 * Callers that need the resulting version token use {@link writeDocVersioned}.
 */
export async function writeDoc(
  bundle: Bundle,
  doc: OkfDocument,
  options?: WriteOptions,
): Promise<OkfDocument> {
  return (await writeDocVersioned(bundle, doc, options)).doc;
}

/**
 * Read a single concept document by ID together with its {@link ReadResult} version
 * token (the compare-and-swap basis for a later {@link writeDoc}). Same id-safety and
 * reserved-file guards as {@link readDoc}; this is the version-surfacing read that
 * leaves {@link readDoc}'s existing `Promise<OkfDocument>` return untouched.
 */
export async function readDocVersioned(bundle: Bundle, id: ConceptId): Promise<ReadResult> {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
  }
  return backendFor(bundle).read(id);
}

/** Read and parse a single concept document by ID. Rejects reserved-file ids. */
export async function readDoc(bundle: Bundle, id: ConceptId): Promise<OkfDocument> {
  return (await readDocVersioned(bundle, id)).doc;
}

/**
 * Attributed version history for a concept, newest-first (delegates to
 * {@link StorageBackend.versions}). Same id-safety and reserved-file guards as
 * {@link readDoc}. A backend that keeps no history (the plain filesystem) honestly
 * returns just the single current revision; `MemoryBackend` and a document-centric
 * remote adapter return the full chain. `[]` for a never-written concept.
 */
export async function docVersions(bundle: Bundle, id: ConceptId): Promise<VersionInfo[]> {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file (index.md / log.md), not a concept document.`);
  }
  return backendFor(bundle).versions(id);
}

/**
 * Hard-delete a concept document. Same id-safety and reserved-file guards
 * {@link writeDocVersioned}/{@link readDocVersioned} carry (D4: `index.md`/`log.md` are
 * never deletable through this path — enforced HERE at the engine layer, not left to each
 * backend to reimplement). Returns `true` when the document existed and was removed,
 * `false` when it was already absent (idempotent — AXI P6, never an error for "nothing to
 * delete"). Honors {@link DeleteOptions.expectedVersion} (compare-and-swap -> typed
 * `VersionConflict` on a genuine mismatch; an absent target always returns `false`
 * regardless).
 *
 * Non-cascading and NOT self-logging (D8, a deliberate decision): outbound/inbound links
 * are left exactly as written (backlinks are derived, so a dangling reference simply stops
 * resolving on the next graph walk), and this does NOT append a `log.md` "deleted" entry —
 * no other engine write path self-logs either, and doing so here would add a reserved-file
 * CAS write (and, over `--remote`, an extra round trip) that also re-seeds the very id
 * being deleted back into `log.md`'s provenance trail. A caller that wants a delete logged
 * calls `appendLog` itself.
 */
export async function deleteDoc(bundle: Bundle, id: ConceptId, options?: DeleteOptions): Promise<boolean> {
  assertSafeConceptId(id);
  const rel = pathFromConceptId(id);
  if (isReservedFile(rel)) {
    throw new Error(`'${id}' is a reserved file (${rel}); reserved files cannot be deleted.`);
  }
  return backendFor(bundle).delete(id, options);
}

/**
 * List/query concept documents. With no filter, returns every non-reserved `.md`
 * file (sorted by id). {@link QueryFilter} facets (`type`, `tags`, `prefix`, `fields`) are
 * ANDed. Reserved `index.md`/`log.md` are always excluded.
 */
const isEnoent = (err: unknown): boolean => (err as NodeJS.ErrnoException)?.code === "ENOENT";

/**
 * A document a scan could not include, reported to {@link QueryOptions.onSkip}. `id` is the
 * concept id; `reason` is the underlying parser detail (the js-yaml message, one line).
 */
export interface SkippedDoc {
  id: ConceptId;
  reason: string;
}

/**
 * Batch-read `ids`, SKIPPING any that have vanished since they were listed. A scan
 * ({@link query}) or dir/index traversal over a LIVE bundle must tolerate a concurrent
 * delete in the window between the `list` that produced these ids and this read — a
 * listed-then-gone id simply no longer matches; it must NOT fail the whole operation with
 * an internal not-found (the exact multi-writer read-side race a usability round hit:
 * a concurrent delete during a scan surfaced a RUNTIME error instead of a clean result).
 * The no-race path is a single `readMany`; a not-found (or a malformed doc, when `onMalformed`
 * is supplied) triggers a per-doc, skip-missing fallback over the SAME id set — no extra cost
 * off that path, and the fallback is itself resilient to further concurrent deletes.
 *
 * `onMalformed` opts a caller into resilience against a CORRUPT document (unparseable YAML
 * frontmatter): the offending doc is skipped and reported here instead of failing the whole
 * scan — so one bad file never blinds routine inspection (`list`/`status`/`kinds`). When it is
 * OMITTED, a {@link MalformedDocumentError} propagates (attributed to the doc), preserving the
 * loud default for callers (`view`, index regeneration, backlinks) that must not silently drop
 * content.
 */
async function readManyExisting(
  backend: StorageBackend,
  ids: ConceptId[],
  onMalformed?: (skip: SkippedDoc) => void,
): Promise<ReadResult[]> {
  try {
    return await backend.readMany(ids);
  } catch (err) {
    const malformed = err instanceof MalformedDocumentError;
    if (!isEnoent(err) && !(malformed && onMalformed)) throw err;
    const out: ReadResult[] = [];
    for (const id of ids) {
      try {
        out.push(await backend.read(id));
      } catch (e) {
        if (isEnoent(e)) continue; // vanished between list and read (a concurrent delete) — skip
        if (e instanceof MalformedDocumentError && onMalformed) {
          onMalformed({ id, reason: e.detail });
          continue;
        }
        throw e;
      }
    }
    return out;
  }
}

/** Options for {@link query}/{@link list}. */
export interface QueryOptions {
  /**
   * Invoked once per document that could not be parsed (malformed YAML frontmatter). Supplying
   * this opts the scan into resilience: the corrupt doc is SKIPPED and reported here instead of
   * failing the whole query — so one bad file never blinds `list`/`status`. Omit it to keep the
   * loud default (a malformed doc throws an attributed {@link MalformedDocumentError}).
   */
  onSkip?: (skip: SkippedDoc) => void;
}

/**
 * THE canonical {@link QueryFilter} predicate — every facet (`prefix`, `type`, `tags`,
 * `fields`), ANDed. One implementation, three consumers: {@link query}, {@link queryHeads}
 * (which re-applies it to whatever a backend's push-down returned — gate 3: a backend may
 * over-return, the engine owns semantics), and the reference router's `GET /docs` handler
 * (which previously carried its own inline type/tag copy of this logic).
 */
export function matchesFilter(
  doc: { id: ConceptId; frontmatter: Frontmatter },
  filter: QueryFilter,
): boolean {
  if (filter.prefix && !doc.id.startsWith(filter.prefix)) return false;
  if (filter.type && doc.frontmatter.type !== filter.type) return false;
  if (filter.tags && filter.tags.length > 0) {
    const tags = Array.isArray(doc.frontmatter.tags) ? doc.frontmatter.tags : [];
    if (!filter.tags.every((t) => tags.includes(t))) return false;
  }
  if (filter.fields) {
    const fm = doc.frontmatter as Record<string, unknown>;
    for (const [k, want] of Object.entries(filter.fields)) {
      const raw = fm[k];
      const actual =
        raw === undefined || raw === null
          ? []
          : (Array.isArray(raw) ? raw : [raw]).map((v) => String(v));
      if (!actual.includes(want)) return false;
    }
  }
  return true;
}

/**
 * THE one scan skeleton: list under the filter's prefix, batch-read in ONE round-trip
 * (not N single reads — backlink/link-graph traversal rides this, so it must not fan
 * out per document; a networked backend answers `readMany` with a single multi-get),
 * keep what {@link matchesFilter} admits, sort by id. {@link query} and
 * {@link queryHeads}'s fallback are both thin projections over this — the walk itself
 * exists ONCE, so scan semantics (ordering, skip behavior, the batch round-trip) cannot
 * drift between the document-shaped and head-shaped surfaces.
 */
async function scanMatching(
  backend: StorageBackend,
  filter: QueryFilter,
  onSkip?: (skip: SkippedDoc) => void,
): Promise<ReadResult[]> {
  const ids = await backend.list(filter.prefix);
  const results: ReadResult[] = [];
  for (const result of await readManyExisting(backend, ids, onSkip)) {
    if (!matchesFilter(result.doc, filter)) continue;
    results.push(result);
  }
  results.sort((a, b) => a.doc.id.localeCompare(b.doc.id));
  return results;
}

export async function query(
  bundle: Bundle,
  filter: QueryFilter = {},
  options: QueryOptions = {},
): Promise<OkfDocument[]> {
  const scanned = await scanMatching(backendFor(bundle), filter, options.onSkip);
  return scanned.map((r) => r.doc);
}

/** Alias for {@link query} (the `list` half of the `list/query` API surface). */
export const list = query;

/**
 * Like {@link query}, but returns HEAD projections ({@link HeadResult}: id + full
 * frontmatter + version, never bodies) — the scan shape for every consumer that only
 * reads frontmatter (`list`/`query` rows, dashboards). When the backend implements the
 * optional {@link StorageBackend.queryHeads} push-down (today: `RemoteBackend`, over the
 * wire's `GET /docs?fields=frontmatter` projection), a filtered scan is ONE round-trip
 * carrying no bodies; the engine re-applies {@link matchesFilter} to the returned rows
 * regardless (a push-down may over-return — semantics stay here, not in backends). A
 * backend without the method gets the same `list` + batch-read walk {@link query} does,
 * with bodies dropped after the read — identical behavior and cost to `query`, including
 * {@link QueryOptions.onSkip} malformed-doc resilience (which the push-down path cannot
 * honor: a malformed doc fails the server-side scan, as the wire list always has).
 */
export async function queryHeads(
  bundle: Bundle,
  filter: QueryFilter = {},
  options: QueryOptions = {},
): Promise<HeadResult[]> {
  const backend = backendFor(bundle);
  if (backend.queryHeads) {
    const rows = (await backend.queryHeads(filter)).filter((r) => matchesFilter(r, filter));
    rows.sort((a, b) => a.id.localeCompare(b.id));
    return rows;
  }
  const scanned = await scanMatching(backend, filter, options.onSkip);
  return scanned.map(({ doc, version }) => ({ id: doc.id, frontmatter: doc.frontmatter, version }));
}

/**
 * Outbound cross-links of a document. Standard markdown links only (never
 * wikilinks); external / non-`.md` targets are dropped; broken links are kept.
 * `bundle` is accepted for signature stability but resolution is purely path-based.
 */
export function parseLinks(_bundle: Bundle, doc: OkfDocument): Link[] {
  return parseLinksFromDoc(doc);
}

/**
 * Normalize a raw `from`/`to` {@link EdgeFilter} selector the same way a concept id is
 * normalized everywhere else (posix-ify, strip a single leading `./` or `/` — mirroring
 * {@link backlinks}'s pre-existing target normalization). A trailing slash is a deliberate
 * prefix marker and is kept; it is stripped from nothing else.
 */
function normalizeEdgeSelector(raw: string): string {
  return toPosix(raw).replace(/^\.?\//, "");
}

/**
 * True when `value` (a resolved `from` or `to` concept id) matches ANY of `selectors` —
 * union (OR) within one flag — or when `selectors` is `undefined` (the facet was never
 * set, so it imposes no restriction). Each selector is either an EXACT id match (any
 * trailing `.md` stripped) or, when it ends in `/`, a PREFIX match — one rule, no glob
 * syntax, per {@link EdgeFilter}'s contract.
 */
function matchesEdgeSelector(value: ConceptId, selectors: string[] | undefined): boolean {
  if (selectors === undefined) return true;
  for (const raw of selectors) {
    const normalized = normalizeEdgeSelector(raw);
    if (normalized.endsWith("/")) {
      if (value.startsWith(normalized)) return true;
    } else if (value === normalized.replace(/\.md$/, "")) {
      return true;
    }
  }
  return false;
}

/** Coerce an {@link EdgeFilter} `from`/`to` facet to a selector list, or `undefined` when the
 * facet is absent entirely (meaning "no restriction" — distinct from an empty array, which
 * would restrict to nothing matching). A single selector is wrapped, an array passed through. */
function toSelectorList(v: string | string[] | undefined): string[] | undefined {
  if (v === undefined) return undefined;
  return Array.isArray(v) ? v : [v];
}

/**
 * The whole-bundle derived edge list, filtered (graph-query-v0). This is the ONE atom every
 * edge-shaped question reduces to — {@link backlinks} below is now a thin call into it, and
 * so is the CLI's `link list`. Edges are DERIVED by scanning every concept's outbound links,
 * never stored (gate 2) — there is exactly one link resolver ({@link parseLinksFromDoc}, via
 * {@link parseLinks}) and exactly one whole-bundle walk ({@link query}) underneath this, per
 * gate 3.
 *
 * `filter.from`/`filter.to` each accept a single id, a trailing-slash prefix, or an array of
 * either (union within the flag; providing BOTH facets ANDs them); `filter.text` is an exact
 * match. Dangling edges are included: a link whose target has no document yet is still a real
 * edge (the unresolved-link lint and pre-delete impact checks depend on seeing them) — `to`
 * is the raw resolved concept id, not a proof the target exists. Per-literal-link counting: a
 * source linking to the same target via two differently-worded links yields two rows (typed-
 * edge reading v0's pinned semantics), matching {@link parseLinks}' own no-dedup granularity.
 * Reserved files (`index.md`/`log.md`) can never be a link target ({@link parseLinksFromDoc}
 * drops them at resolution) and reserved files are never a `from` either (they are excluded
 * from every {@link query} scan) — so this never surfaces a phantom edge to/from a reserved
 * concept id. Deterministic output: sorted by `(from, to, text)`.
 */
export async function queryEdges(bundle: Bundle, filter: EdgeFilter = {}): Promise<Link[]> {
  const fromSelectors = toSelectorList(filter.from);
  const toSelectors = toSelectorList(filter.to);
  const docs = await query(bundle);
  const edges: Link[] = [];
  for (const doc of docs) {
    for (const link of parseLinksFromDoc(doc)) {
      if (!matchesEdgeSelector(link.from, fromSelectors)) continue;
      if (!matchesEdgeSelector(link.to, toSelectors)) continue;
      if (filter.text !== undefined && link.text !== filter.text) continue;
      edges.push(link);
    }
  }
  edges.sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.text.localeCompare(b.text));
  return edges;
}

/**
 * "Cited by" set for a target concept — derived by reversing the resolved link
 * graph over the whole bundle. Backlinks are DERIVED, never stored (OKF has no
 * `cited_by` frontmatter field). Returns the full citing {@link Link} (carrying
 * `text`, the only relationship-type signal the bytes carry), not a bare source
 * id — a source citing the target via two differently-worded links yields two
 * rows, mirroring {@link parseLinks}'s own no-dedup-by-target granularity on the
 * outbound side. A thin `{ to: target }` call into {@link queryEdges} (graph-query-v0's
 * generalization) — sorted `(from, to, text)` collapses to `(from, text)` here since
 * `to` is constant across every row, so this is byte-identical to the pre-generalization
 * sort.
 *
 * `queryEdges` treats a trailing `/` as a PREFIX selector — that capability belongs to
 * `queryEdges`/the CLI's `link list`, never to `backlinks`, which is a per-concept "cited
 * by" lookup and must stay EXACT-match on the LITERAL `target` ALWAYS (its
 * pre-generalization contract; `link show`, `status`'s backlink-count lints, and every
 * other caller depend on this). A valid concept id never ends in `/`, so a trailing-slash
 * `target` can never legitimately name a real concept — `backlinks(bundle, "tasks/")`
 * must be `[]` byte-identically, REGARDLESS of whether a doc literally named `tasks`
 * happens to exist. (An earlier fix here stripped the trailing slash and delegated
 * `{ to: "tasks" }` into `queryEdges` — which is wrong: it ALIASES `"tasks/"` to the
 * bare id `"tasks"`, so a bundle with a `tasks` doc would report ITS backlinks under
 * the `"tasks/"` query, when main never did. Short-circuiting instead — never handing a
 * trailing-slash target to `queryEdges` at all — avoids that alias entirely.)
 */
export async function backlinks(bundle: Bundle, target: ConceptId): Promise<Link[]> {
  if (target.endsWith("/")) return [];
  return queryEdges(bundle, { to: target });
}

// ── blobs: opaque bytes + a content-type (Stage-1 Unit 2a Part A) ──────────────
//
// Thin, additive engine wrappers routing through `backendFor` — mirroring
// `writeDocVersioned`'s shape (B4). Future consumers (the CLI's `promote`/`pull`,
// Part C) use ONLY these, never a backend directly, so storage stays pluggable
// (gate 3). Unlike concept documents, blobs carry no OKF semantics of their own (no
// `type` requirement, no reserved-file check, no timestamp defaulting) — the guard
// against traversal / `.md` collision / dot-segments lives at the BACKEND layer
// (`assertSafeBlobKey`, applied identically by every adapter), so these wrappers are
// pure pass-throughs.

/** Read a blob by key, or `null` if absent. See {@link StorageBackend.readBlob}. */
export async function readBlob(bundle: Bundle, key: BlobKey): Promise<ReadBlobResult | null> {
  return backendFor(bundle).readBlob(key);
}

/**
 * Persist a blob (create or overwrite) and return its new {@link Version}. `options`
 * threads the same compare-and-swap + actor capabilities as {@link writeDoc}. See
 * {@link StorageBackend.writeBlob} for the content-type override's per-adapter
 * persistence posture.
 */
export async function writeBlob(
  bundle: Bundle,
  key: BlobKey,
  bytes: Uint8Array,
  contentType?: string,
  options?: WriteOptions,
): Promise<Version> {
  return backendFor(bundle).writeBlob(key, bytes, contentType, options);
}

/** True when a blob exists at `key`. See {@link StorageBackend.existsBlob}. */
export async function existsBlob(bundle: Bundle, key: BlobKey): Promise<boolean> {
  return backendFor(bundle).existsBlob(key);
}

/** Blob keys, optionally restricted to a bundle-relative `prefix`. See {@link StorageBackend.listBlobs}. */
export async function listBlobs(bundle: Bundle, prefix?: string): Promise<BlobKey[]> {
  return backendFor(bundle).listBlobs(prefix);
}

/**
 * Hard-delete a blob. Pure pass-through (blobs carry no OKF semantics of their own to
 * enforce — no reserved-file concept, no id-safety guard beyond what the backend's own
 * `assertSafeBlobKey` already applies). See {@link StorageBackend.deleteBlob} for the
 * idempotency/CAS contract, which is identical to {@link deleteDoc}'s.
 */
export async function deleteBlob(bundle: Bundle, key: BlobKey, options?: DeleteOptions): Promise<boolean> {
  return backendFor(bundle).deleteBlob(key, options);
}

// ── reserved files: index.md (§6) & log.md (§7) ───────────────────────────────

/** Read an `index.md` (raw body + declared okf_version for the root index). Null if absent. */
export async function readIndex(
  bundle: Bundle,
  dir = "",
): Promise<{ body: string; okfVersion?: string } | null> {
  const raw = await backendFor(bundle).readReserved(dir, "index.md");
  if (raw === null) return null;
  const { frontmatter, body } = parseMarkdown(raw.content);
  const okfVersion = typeof frontmatter.okf_version === "string" ? frontmatter.okf_version : undefined;
  return okfVersion !== undefined ? { body, okfVersion } : { body };
}

/** Read a `log.md` body for a directory, or `null` if absent. */
export async function readLog(bundle: Bundle, dir = ""): Promise<string | null> {
  const raw = await backendFor(bundle).readReserved(dir, "log.md");
  return raw === null ? null : raw.content;
}

/** A `## YYYY-MM-DD` heading from an ISO instant. */
function dateHeading(when: Date): string {
  return `## ${when.toISOString().slice(0, 10)}`;
}

/**
 * Append a chronological entry to `log.md` (§7), newest-first. Entries are grouped
 * under `## YYYY-MM-DD` headings; a matching date group gets the entry prepended,
 * otherwise a new group is inserted at the top. `verb` (Update/Creation/…) is a
 * conventional leading bold marker.
 */
export async function appendLog(
  bundle: Bundle,
  opts: { dir?: string; entry: string; when?: Date; verb?: string },
): Promise<void> {
  const backend = backendFor(bundle);
  const dir = opts.dir ?? "";
  const when = opts.when ?? new Date();
  const heading = dateHeading(when);
  const line = `- ${opts.verb ? `**${opts.verb}** ` : ""}${opts.entry}`;

  // `log.md` is the provenance surface and the least-safe write path: a plain
  // read-modify-write drops a concurrent writer's entry. Read the current bytes WITH
  // their version, splice, then compare-and-swap; on a conflict re-read and re-splice
  // (never overwriting the racing entry) up to a bounded budget. The first-ever create
  // uses `expectedVersion: null` (expect-absent), so even the create path is guarded —
  // if a concurrent writer created the file between our read and our write, the CAS
  // rejects and the retry re-reads to append instead of clobbering.
  for (let attempt = 0; ; attempt++) {
    const prior = await backend.readReserved(dir, "log.md");
    const existing = prior?.content ?? "# Log\n";
    const lines = existing.split("\n");

    // Find an existing group for today's date.
    const headingIdx = lines.findIndex((l) => l.trim() === heading);
    let next: string;
    if (headingIdx >= 0) {
      lines.splice(headingIdx + 1, 0, line);
      next = lines.join("\n");
    } else {
      // Insert a new date group directly after the top-of-file `# Log` title if present.
      const titleIdx = lines.findIndex((l) => /^#\s+/.test(l.trim()));
      const block = `${heading}\n\n${line}\n`;
      if (titleIdx >= 0) {
        lines.splice(titleIdx + 1, 0, "", block);
        next = lines.join("\n");
      } else {
        next = `${block}\n${existing}`;
      }
    }

    try {
      await backend.writeReserved(
        dir,
        "log.md",
        next,
        { expectedVersion: prior ? prior.version : null },
      );
      return;
    } catch (err) {
      if (err instanceof VersionConflict && attempt < CAS_MAX_ATTEMPTS - 1) continue;
      throw err;
    }
  }
}

/**
 * Regenerate a directory's `index.md` for progressive disclosure (§6): concepts
 * grouped by `type`, subdirectories under a "Subdirectories" heading, each a
 * `* [title](child.md) - description` bullet with RELATIVE links (matching the
 * reference `index.py`). The bundle-root index preserves its `okf_version`
 * frontmatter; nested indexes carry none.
 *
 * Directory structure is derived from the backend's concept-id list (a subdir
 * appears when it contains at least one concept beneath it); this keeps index
 * regeneration backend-agnostic rather than assuming a filesystem tree.
 */
export async function regenerateIndex(bundle: Bundle, dir = ""): Promise<string> {
  const backend = backendFor(bundle);
  const dirRel = toPosix(dir).replace(/^\.?\//, "").replace(/\/$/, "");
  const prefix = dirRel === "" ? "" : `${dirRel}/`;
  const ids = await backend.list(prefix === "" ? undefined : prefix);

  const conceptsByType = new Map<string, string[]>();
  const subdirs = new Set<string>();
  const directIds: ConceptId[] = [];
  for (const id of ids) {
    const relToDir = id.slice(prefix.length);
    const slash = relToDir.indexOf("/");
    if (slash >= 0) {
      subdirs.add(relToDir.slice(0, slash)); // deeper concept ⇒ an immediate subdir
    } else {
      directIds.push(id); // an immediate concept of this dir
    }
  }
  // Batch-read the immediate concepts in one round-trip (backend-agnostic, not N reads).
  for (const { doc } of await readManyExisting(backend, directIds)) {
    const relToDir = doc.id.slice(prefix.length);
    const { frontmatter } = doc;
    const type =
      typeof frontmatter.type === "string" && frontmatter.type.trim() !== "" ? frontmatter.type : "Concept";
    const title =
      typeof frontmatter.title === "string" && frontmatter.title.trim() !== "" ? frontmatter.title : relToDir;
    const desc = typeof frontmatter.description === "string" ? frontmatter.description : "";
    const bullet = `* [${title}](${relToDir}.md)${desc ? ` - ${desc}` : ""}`;
    const arr = conceptsByType.get(type) ?? [];
    arr.push(bullet);
    conceptsByType.set(type, arr);
  }

  const sections: string[] = [];
  for (const type of [...conceptsByType.keys()].sort()) {
    const bullets = (conceptsByType.get(type) ?? []).sort();
    sections.push(`# ${type}\n\n${bullets.join("\n")}\n`);
  }
  if (subdirs.size > 0) {
    const bullets = [...subdirs].sort().map((name) => `* [${name}](${name}/index.md)`);
    sections.push(`# Subdirectories\n\n${bullets.join("\n")}\n`);
  }

  const name = dirRel === "" ? path.basename(path.resolve(bundle.root)) : dirRel.split("/").pop()!;
  const body = `# ${name}\n\n${sections.join("\n")}`.trimEnd() + "\n";

  // Bring the index write into the CAS model as well (the same read-modify-write hazard the
  // log has): read the current index WITH its version, assemble the deterministic replacement
  // (preserving the root okf_version declaration), and compare-and-swap; retry on a racing
  // writer. The first-ever create uses `expectedVersion: null` (expect-absent) so the create
  // path is guarded too.
  for (let attempt = 0; ; attempt++) {
    const prior = await backend.readReserved(dirRel, "index.md");
    let content: string;
    if (dirRel === "") {
      // Preserve/refresh the root okf_version declaration (only the root index may carry frontmatter).
      const priorOkf = prior ? parseMarkdown(prior.content).frontmatter.okf_version : undefined;
      content = stringifyWithData({ okf_version: typeof priorOkf === "string" ? priorOkf : "0.1" }, body);
    } else {
      content = body; // nested index.md carries NO frontmatter (§3.1)
    }
    try {
      await backend.writeReserved(
        dirRel,
        "index.md",
        content,
        { expectedVersion: prior ? prior.version : null },
      );
      return content;
    } catch (err) {
      if (err instanceof VersionConflict && attempt < CAS_MAX_ATTEMPTS - 1) continue;
      throw err;
    }
  }
}
