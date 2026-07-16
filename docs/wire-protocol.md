---
type: Doc
title: Wire Protocol v0.1 — the `StorageBackend` seam over HTTP
actor: mike/codex
timestamp: '2026-07-16T13:59:23.126Z'
---
# Wire Protocol v0.1 — the `StorageBackend` seam over HTTP

Status: **v0.1 implemented by reference** (v0: 2026-07-01, Stage 1 Unit 1,
human-authorized 2026-07-01; v0.1 bump: 2026-07-02, Stage-1 Unit 2a Part B,
human-approved plan rev 7 — the SANCTIONED protocol bump that fills the reserved
`GET /blobs/{key}` slot the base v0 draft deliberately left deferred). `packages/server`
(`@agentstate-lite/server`) implements every endpoint below — the original document
endpoints plus the new blob endpoints — as a Web-standard `fetch`-style router over the
OKF engine, and `core/src/remote-backend.ts` (`RemoteBackend`) implements the client
half — a full `StorageBackend` over HTTP, docs AND blobs. The tri-backend contract suite
(`packages/core/test/wire-protocol.test.ts`) proves `RemoteBackend` + the reference
router return results IDENTICAL to `FilesystemBackend`/`MemoryBackend`, with
byte-identical version tokens crossing the wire — now including a 0x00–0xFF binary
fixture (incl. invalid-UTF-8 byte sequences) proving blob content survives the wire
byte-identical, not just document content. This remains a REFERENCE implementation —
no auth, loopback-only default bind — proving the protocol, not a production
deployment. The URL prefix stays `/v0` (the bump is this document's version header,
`GET /v0/capabilities`'s `blobs: true`, and the additive `/blobs` endpoints — not a
path rename). **The Cloudflare deployment (Worker + D1 head-index + R2 blobs) is now REAL
and production-verified (Stage 1 Unit 2b, 2026-07-02):** the same router mounts unchanged in
a Worker `fetch` handler over `D1R2Backend` (`packages/worker`), behind a fail-closed API-key
gate, and the full acceptance passed against the deployed URL — including lossless
multi-writer convergence on production D1 (5 concurrent `link add`s, all landed) and a
promoted HTML artifact served byte-identical by content-type from R2. The first production
run also CAUGHT a real protocol defect (the bare-ETag version transport — see the
version-token deviation below) that no local layer could see; the protocol now carries the
token in `X-Version`. The container deployment (directory volume + SQLite head index)
remains the one **future deployment** behind this same protocol, running the same engine +
the same router over a different `StorageBackend` adapter.

## Principles

1. **Document-centric.** Per-doc identity, per-doc version, per-doc compare-and-swap —
   carrying canonical AgentState's proven model: content-addressed snapshots, a head
   with a version, CAS writes, actor attribution (see NORTH-STAR §8 / CLAUDE.md gate 3).
2. **The seam is the schema.** Every endpoint maps 1:1 to a `StorageBackend` method;
   the seam's semantics — including a degenerate backend's honesty about missing
   history — transfer unchanged.
3. **Version tokens are opaque and content-addressed** (`sha256:<hex>` of the OKF
   serialization). Identical content ⇒ identical token, regardless of backend — the
   invariant the dual-backend tests already assert. **Transport (revised, production
   repair — see "Version-token transport" below): `X-Version` (a bare custom header) is
   the PRIMARY vehicle; a properly RFC-7232-quoted `ETag` rides alongside it for
   HTTP-ecosystem compatibility. A production incident proved an unquoted ETag is not a
   safe sole transport for this value — see the deviation for the full finding.**
4. **OKF invariants are enforced server-side too.** The server IS the engine over an
   adapter, so §9.2 (non-empty `type`), reserved-file rules, and id-safety hold even
   with multiple or untrusted clients. Multi-writer changes the trust model; the
   engine-keeps-semantics principle is what makes server-side enforcement free.
5. **Thin by default** (the query-payload posture, NORTH-STAR §8): `list` is a
   frontmatter-only projection with filter push-down; bodies ship only when asked for.

## Conventions

- Base path: `/v0/bundles/{bundle}/…` (bundle namespace model: open question below).
- Auth: `Authorization: Bearer <token>`. Mechanics are Stage 2; v0 reserves the slot.
- Actor: derived from the auth identity when present; else an `X-Actor` header; else
  the server default (mirrors `defaultActor()`).
- Errors: JSON envelope `{ "error": { "code", "message", "details"? } }` mirroring the
  CLI taxonomy — `VERSION_CONFLICT`, `NOT_FOUND`, `USAGE`, `AUTH_REQUIRED`, `RUNTIME`.

## Endpoints ↔ seam mapping

| Seam method | Endpoint | Semantics |
| --- | --- | --- |
| `read(id)` | `GET /docs/{id}` | `200` → `{ id, frontmatter, body }` + `X-Version: <version>` + `ETag: "<version>"`; `404` if absent. |
| `readMany(ids)` | `POST /docs:read-many` `{ ids }` | **One round trip** (the graph/backlink traversal path). Results in input order, each with its version (in the JSON body, not a header — see "Version-token transport" below); `404` + `{ missing: [...] }` if **any** id is absent (seam semantics: list-then-read a known set). |
| `write(id, doc, opts)` | `PUT /docs/{id}` | Body `{ frontmatter, body }`. `If-Match: <version>` = CAS → `412` + `{ expected, actual }` ⇔ `VersionConflict`. No `If-Match` = unconditional (last-writer-wins, the historical default). `If-None-Match: *` = **expect-absent create** — closes the seam's create-race gap; back-port to the seam as `expectedVersion: null`. `200` → `{ version }` (+ `X-Version` + quoted `ETag`). `If-Match` accepts the bare token OR a quoted/weak-prefixed reflection of one — see "Version-token transport". |
| `exists(id)` | `HEAD /docs/{id}` | `200` + `X-Version` + quoted `ETag`, or `404`. |
| `delete(id, opts)` | `DELETE /docs/{id}` | `If-Match: <version>` = CAS → `412` + `{ expected, actual }` ⇔ `VersionConflict`. No `If-Match` = unconditional. `200` → `{ deleted: true｜false }` **always** — an ABSENT target is `200 { deleted: false }`, **never `404`** (idempotency, AXI P6 — deleting nothing is success, not failure), regardless of whether `If-Match` was sent. A reserved id (`index.md`/`log.md`) is `400 USAGE` (same `assertValidDocId` guard reads/writes use). No `X-Actor`/`If-None-Match` on this route — a delete records no new revision to attribute, and expect-absent is meaningless for a delete. |
| `list(prefix)` + push-down | `GET /docs?prefix=&type=&tag=&fields=&limit=&cursor=` | Default row `{ id, version, type, title, timestamp }` — thin. `fields=frontmatter` adds full frontmatter; bodies only via `read`/`read-many`. Response carries `count` (total) + `next_cursor`. Filters are ANDed, evaluated server-side. |
| `versions(id)` | `GET /docs/{id}/versions` | Newest-first `[{ version, actor, timestamp }]`; `[]` for never-written. A no-history backend honestly returns one entry. |
| `readReserved(dir, name)` | `GET /reserved/{name}?dir=` | `name ∈ {index.md, log.md}`; `dir=""` = bundle root. `200` → `{ content }` + `X-Version` + quoted `ETag`; `404` ⇔ seam `null`. |
| `writeReserved(dir, name, content, opts)` | `PUT /reserved/{name}?dir=` | Same `If-Match` CAS semantics as docs — `appendLog`/`regenerateIndex` retry loops work unchanged over the wire. |
| `readBlob(key)` | `GET /blobs/{key}` | Raw bytes as the response body, **served by the blob's content-type** (`Content-Type` header — this is the NORTH-STAR §4 signature-workflow requirement) + `X-Version: <version>` + `ETag: "<version>"`. `404` ⇔ seam `null` (a missing blob is a normal result, not a rejection — unlike `read(id)`). |
| `writeBlob(key, bytes, contentType, opts)` | `PUT /blobs/{key}` | Raw request body = the bytes (never JSON); `Content-Type` header = an explicit content-type override. Same `If-Match`/`If-None-Match: *` CAS semantics as docs. `200`/`201` → `{ version }` + `X-Version` + quoted `ETag`. |
| `existsBlob(key)` | `HEAD /blobs/{key}` | `200` + `Content-Type` + `X-Version` + quoted `ETag`, or `404` — bodiless on every status. |
| `deleteBlob(key, opts)` | `DELETE /blobs/{key}` | Same `If-Match` CAS / `200 { deleted }` / absent-is-`200-false`-not-`404` contract as `DELETE /docs/{id}`. `assertSafeBlobKey` runs first (traversal / `.md`-collision / dot-segment rejection), same as every other blob route. |
| `listBlobs(prefix)` | `GET /blobs?prefix=&limit=&cursor=` | `{ count, keys, next_cursor }`, mirroring `GET /docs`'s pagination shape (no `type`/`tag` filters — blobs carry no frontmatter). |

**Idempotency:** a byte-identical `PUT` SHOULD return the same version without growing
history (today's `MemoryBackend` behavior). Confirm feasibility per substrate. Blobs
follow the same rule: `MemoryBackend.writeBlob` is a true no-op (same version, no
internal state churn) when both the bytes AND the resolved content-type are unchanged.

**Content-addressed CAS semantics (ABA) — a property, not a bug, stated so nobody
debugs it as one.** Because the version token is a hash of CONTENT, `If-Match` means
"the content I read is still the current content" — NOT "no writes happened since I
read." If a document goes A → B → A, a writer still holding A's token passes CAS even
though two writes intervened (the classic ABA case). For a knowledge store this is the
intended meaning: a caller merges against content, not against a position in history,
so a same-bytes round-trip poses no conflict for it to lose against. The consequences
to keep in mind: (1) history/attribution can interleave "around" a successful CAS —
`versions()` (where the backend keeps history) is the record of what actually happened,
and tokens must NEVER be compared for recency (they are equality-only, per the seam
contract); (2) the byte-identical-PUT idempotency rule above is the same property seen
from the other side — identical content is indistinguishable BY DESIGN, including for
concurrency control. A deployment that ever needs write-fencing semantics ("no
intervening writes at all") would need a monotonic component in the precondition (e.g.
a sequence check against `versions()`), which is deliberately NOT part of v0.x.

## Capabilities discovery

`GET /v0/capabilities` → `{ history, enforced_cas, projections, backlinks, blobs }`.
A degenerate backend states its limits instead of pretending (the `FilesystemBackend`
honesty rule, promoted to the wire). **`blobs` is now `true`** for the reference server
(v0.1) — it was `false` under v0 while blob serving was deferred; `backlinks` remains
`false` (still deferred to v1, see below).

## Implemented by reference: deviations and clarifications

The draft above left several shapes underspecified. This is what the reference
implementation (`packages/server`, `core/src/remote-backend.ts`) actually does —
recorded as findings, per the plan, not silently decided:

- **Router-level id/dir validation (principle 4, closed after an external review).**
  **Correction (this pass — the paragraph below was stale):** at the time this deviation
  was first recorded, `FilesystemBackend` performed NO id safety of its own, so
  `backend.read('../../etc/hosts')` resolved outside the bundle root. That gap was
  independently closed by the fs-hardening pass (before this wire-protocol pass existed)
  — `FilesystemBackend` AND `MemoryBackend` now both call `assertSafeConceptId` /
  `assertSafeReservedDir` internally on every id/dir-taking method, and
  `FilesystemBackend.abs()` asserts the resolved path stays within the bundle root as a
  backstop. The router's OWN validation below is retained regardless, as deliberate
  defense-in-depth (principle 4): reads/HEAD/versions/read-many call the
  `StorageBackend` directly (principle 2), and the router wants a UNIFORM `400 USAGE`
  envelope for a rejected id/dir/key rather than depending on whatever shape each
  backend's own thrown `Error` happens to have — the router validates every id itself
  (`assertValidDocId`: `assertSafeConceptId` + a reserved-filename reject) and the
  reserved-file `dir` query param (`assertSafeDir`: no absolute path, no `..`
  segment — the `reservedPath`/`reservedKey` helpers in `backend.ts`/`memory-backend.ts`
  do not guard this themselves) BEFORE any backend call. Doc writes were already safe
  (they route through the engine, which validates internally). The SAME posture extends
  to the v0.1 blob KEY routes: `GET`/`PUT`/`HEAD /blobs/{key}` all call
  `assertSafeBlobKey` (Part A's guard — traversal, a case-insensitive `.md`-ending
  segment at any depth, dot-prefixed segments) on `key` before touching the backend,
  even though `FilesystemBackend`/`MemoryBackend` guard blob keys internally too. **The
  list endpoint's `prefix` (`GET /blobs?prefix=`) is a DELIBERATE exception** — it is
  NEVER validated (correcting an earlier, inaccurate draft of this paragraph that
  claimed it was): `listBlobs(prefix)` uses `prefix` purely as an in-memory
  `String.startsWith` filter over an already-enumerated key list, never joins it onto
  a filesystem path or otherwise realizes it, so there is no traversal surface to
  guard — unlike a `key`, which IS joined onto a path. All KEY rejections are
  `400 USAGE` with a structured envelope, never a raw filesystem error; `HEAD` returns
  a bodiless 4xx per HTTP convention rather than the JSON envelope. Note that a LITERAL
  `..` in the URL PATH is usually collapsed away by
  URL parsing before it ever reaches route matching (RFC 3986 dot-segment removal
  operates before percent-decoding) — the real bypass vector is a percent-encoded
  segment (`%2e%2e%2f…` or `%2F` for a leading slash) that survives as one raw path
  segment and only becomes multi-segment after the router's own `decodeURIComponent`,
  or a traversal string delivered verbatim in a `POST /docs:read-many` JSON body (no
  URL involved at all). See `packages/core/test/wire-protocol.test.ts` "wire security"
  tests (both the original doc-route set and the v0.1 blob-route set).
- **Single-bundle router.** `createRouter(bundle: Bundle)` takes ONE bundle. The
  `{bundle}` path segment is accepted syntactically (any value routes) but is NOT used
  to select among multiple bundles — there is no multi-tenant dispatch in v0. This
  answers "bundle namespace model" below for the reference server specifically: a
  real multi-bundle deployment would wrap several routers behind a name -> router map,
  which is additive and does not change this contract.
- **`GET /docs/{id}/versions` ambiguity.** The `/versions` suffix is a sub-resource of
  a doc id. A concept whose id's FINAL path segment is literally `versions` (e.g.
  `foo/versions`) is ambiguous with the history endpoint for `foo`; the reference
  router resolves in favor of the `/versions` sub-resource. Rare in practice (`versions`
  is an unusual concept-id leaf), but a real limitation of path-based sub-resourcing —
  worth keeping in mind for a v1 that wants to lift it (e.g. a `?history=1` query flag
  instead of a path suffix).
- **Version-token transport: `X-Version` is now the PRIMARY vehicle, a quoted `ETag`
  secondary (PRODUCTION REPAIR, Stage-1 Unit 2b — closes the item this used to be:
  "ETags are unquoted... a v1 polish item").** The reference implementation originally
  shipped exactly that "polish item" as a live defect: `sha256:<hex>` rode `ETag` as a
  BARE opaque token, not RFC 7232's `"quoted-string"` form a strong ETag requires. This
  was found in PRODUCTION, not by inspection: Cloudflare's edge silently STRIPS an
  invalid (unquoted) `ETag` response header when applying Brotli compression — verified
  via D1 ground-truth + R2 content forensics — while preserving it on an uncompressed
  response, so the failure was intermittent and compression-dependent. `RemoteBackend`
  read the (now-absent) header via `res.headers.get("etag") ?? ""`, silently substituting
  an empty string for the version; that empty string, fed back as the CALLER's next
  `expectedVersion`, produced an EMPTY `If-Match` header — which the seam treats as
  UNCONDITIONAL (no CAS guard at all) — silently downgrading a compare-and-swap write to
  last-writer-wins and losing concurrent updates with no error, no conflict, no signal of
  any kind. **Request-direction `If-Match` was proven UNAFFECTED** by the same forensics
  (only RESPONSE headers pass through the edge's compression path), so the repair is
  response-side plus a client-side hard-failure guard, not a request-shape change:
  - `packages/server/src/router.ts`'s `versionHeaders(version)` now emits BOTH `X-Version:
    <bare token>` (a custom header no compressing/caching intermediary has any standing
    reason to touch) and a correctly RFC-7232-quoted `ETag: "<bare token>"` on every
    version-carrying response (doc/reserved-file/blob GET+HEAD, write receipts including
    `201`s). `writeOptionsFromHeaders`'s `If-Match` parsing gained `stripETagWrapper`
    tolerance for a quoted or weak-prefixed (`W/"..."`) reflection, defense-in-depth for a
    client or intermediary that normalizes the value before echoing it back — the bare
    form it already accepted keeps working unchanged.
  - `core/src/remote-backend.ts`'s `extractVersion(res, context)` prefers `X-Version`,
    falls back to a quote/weak-prefix-stripped `ETag`, and THROWS a loud `RemoteError`
    (`code: "VERSION_MISSING"`) when a response has NEITHER — never silently defaulting to
    `""` again. `write`/`writeReserved`/`writeBlob` additionally call
    `assertValidExpectedVersion` and REJECT `expectedVersion === ""` before ever
    constructing a request, so even a caller holding a stale/corrupted empty version
    string from before this fix cannot silently produce an unconditional write. This bug
    class — a stripped/absent version header silently becoming a lossy unconditional
    write — is now unrepresentable in this client.
  - Version tokens themselves are UNCHANGED (still `sha256:<hex>`, still computed
    identically by `contentVersion`/`versionOfBytes`/`blobVersion`) — only their HTTP
    TRANSPORT changed. The tri-backend byte-identical-version-token parity
    (`packages/core/test/wire-protocol.test.ts`) holds exactly as before.
- **`readMany`'s `404` envelope nests `missing` under `details`,** matching the
  uniform error envelope (`{ error: { code, message, details: { missing: [...] } } }`)
  rather than a bespoke top-level `{ missing }` shape — consistency with every other
  error response won over the shorthand in this doc's endpoint table.
- **`GET /docs` response fields:** `{ count, docs: [...], next_cursor }`. `next_cursor`
  is the last-returned row's `id` (an opaque continuation token in practice, since ids
  sort lexicographically); `null` when there is no further page. Default `limit` is
  **50** when omitted (resolves the "pagination defaults" open question for the
  reference server; a production deployment may want a different default and an
  enforced cap — not yet enforced here).
- **`If-None-Match: *` (expect-absent create) is accepted on reserved-file writes too**
  (`PUT /reserved/{name}`), not just concept docs — resolving the "should reserved-file
  writes also accept `If-None-Match: *`?" open question below: yes, and it maps to the
  same `expectedVersion: null` seam semantics `appendLog`/`regenerateIndex` use.
- **Expect-absent create returns `201`,** not `200` — a small enhancement over the
  draft's single "`200` → `{ version }`" note. Existing clients only need to check
  `res.ok`, so this is additive, not breaking.
- **Capabilities are seam-self-declared, with the original `instanceof MemoryBackend`
  inference retained only as a compatibility fallback.** `StorageBackend` may implement
  `capabilities?(): { history?, enforced_cas, blobs, projections?, backlinks? }`
  (`core/src/types.ts`), and `GET /v0/capabilities` reports that declaration. `history`
  and `enforced_cas` are independent guarantees: a backend can enforce compare-and-swap
  without retaining prior revisions. When `history` is omitted, the wire response mirrors
  `enforced_cas` for backward compatibility with older third-party adapters.
  `FilesystemBackend` now declares `{ history: false, enforced_cas: true, blobs: true }`:
  its external same-user cross-process mutation lock makes each version premise atomic,
  while a plain filesystem still retains only the current revision. `MemoryBackend`
  declares both `history` and `enforced_cas` as true. Adapters without `capabilities()`
  continue through the additive fallback path.
- **Error-status mapping for writes:** any `Error` thrown by the engine's own
  validation (OKF §9.2 non-empty `type`, id safety, reserved-file rejection, malformed
  request bodies) maps to `400 USAGE` — these are client-input problems, not runtime
  bugs. Only a non-`Error` throw (a genuine bug) maps to `500 RUNTIME`.
- **Blob routes (v0.1, new this pass).** `GET`/`PUT`/`HEAD /blobs/{key}` and
  `GET /blobs` (list) map 1:1 to `readBlob`/`writeBlob`/`existsBlob`/`listBlobs` —
  same "seam is the schema" posture as docs (principle 2), called directly against the
  `StorageBackend`, not through an engine wrapper (blobs carry no OKF semantics of
  their own to enforce). Bytes cross the wire as the RAW request/response body, never
  JSON: `PUT`'s body is the exact bytes to store (`Content-Type` header = an explicit
  content-type override, honored/persisted per-adapter exactly as the seam documents —
  see `core/src/backend.ts`/`memory-backend.ts`); `GET`'s response body is the exact
  stored bytes with the resolved `Content-Type` header — this is the "served by
  content-type" requirement, verified with a REAL `node:http` socket round-trip in
  `wire-protocol.test.ts` (not just the router-as-transport contract tests). A missing
  blob is `404` on `GET`/`HEAD`, and `readBlob` returns `null` (not a thrown error) —
  this is the one place `RemoteBackend`'s error mapping deliberately differs from the
  doc routes' ENOENT-shaped rejection, matching the LOCAL adapters' own "absence is a
  normal result" posture for blobs. `assertSafeBlobKey` (Part A) runs before every
  route touches the backend, INCLUDING `GET`/`HEAD` (not just `PUT`) — a `.md`-ending
  key (checked case-insensitively) is rejected at the blob routes exactly as it is at
  the backend layer, so there is no way to reach a concept document's bytes, or plant
  one, through `/blobs/{key}`. The list endpoint (`GET /blobs?prefix=&limit=&cursor=`)
  mirrors `GET /docs`'s pagination shape (`count`/`next_cursor`, default `limit` 50) but
  carries no `type`/`tag` filters, since blobs have no frontmatter to filter on.

- **`DELETE` endpoints (new this pass — hard-delete, non-cascading, idempotent).**
  `DELETE /docs/{id}` and `DELETE /blobs/{key}` map 1:1 to the seam's new `delete`/
  `deleteBlob` (`core/src/types.ts`'s `DeleteOptions` — deliberately narrower than
  `WriteOptions`: no `null`/expect-absent branch, since "expect-absent" is meaningless
  for a delete, and no `actor`, since a delete records no new revision to attribute).
  Same validate-id-before-backend posture as every other doc/blob route (principle 4):
  `assertValidDocId`/`assertSafeBlobKey` reject a traversal or reserved-filename target
  `400 USAGE` before the backend is ever called. **Idempotency is the load-bearing
  contract (AXI P6):** an ABSENT target is `200 { deleted: false }`, not `404` — this is
  the ONE deliberate divergence from `GET`/`HEAD`'s absence-is-`404` convention on this
  seam, because "delete something that isn't there" is a normal, successful no-op, not
  an error. A present-but-CAS-mismatched target is still `412` (`VersionConflict`),
  exactly like a write. **D4 (no bulk/reserved delete):** `DELETE /docs`, `DELETE
  /blobs` (the collection routes), and `DELETE /reserved/{name}` all fall through to the
  pre-existing "unsupported method → `400 USAGE`" branch — there is no bulk-delete
  endpoint and reserved files (`index.md`/`log.md`) have no delete route at all (on top
  of `assertValidDocId` also rejecting them by id on the concept-doc route). **D5
  (history purge):** a successful doc delete purges the WHOLE version chain, not just
  the head — `GET /docs/{id}/versions` reports `[]` afterward, matching a never-written
  concept (`MemoryBackend.delete` clears the chain map entry; `D1R2Backend.delete`
  batches a guarded `DELETE FROM doc_history ... WHERE NOT EXISTS (SELECT 1 FROM
  doc_heads ...)` atomically alongside the head delete, so a LOST CAS delete — the head
  is still present — leaves history untouched, and does not depend on `PRAGMA
  foreign_keys`/`ON DELETE CASCADE` being active on the connection). **D8 (no
  self-logging):** a delete does NOT append a `log.md` entry — no other engine write
  path self-logs either, and doing so here would add a reserved-file CAS write (and,
  over the wire, an extra round trip) that also re-seeds the deleted id's provenance
  right back into the log it was supposedly removed from. **Non-cascading:** other
  docs' links to/from the deleted id are left exactly as written; backlinks are
  DERIVED, so a dangling reference simply stops resolving on the next graph walk — no
  server-side cleanup pass runs. Multi-user auth (below) classifies `DELETE` as
  `writer`-class on `docs/`/`blobs/`, the same as `PUT`.

## Multi-user auth (Stage 2 Part A — Worker deployment only, additive)

**Status: implemented (2026-07-02), narrowing the "roles/per-user access" item that used
to sit entirely in "Deferred to v1" below; hardened the same day by an adversarial
security-review pass (see "SINGLE-BUNDLE SCOPE" below — TWO blockers, both fixed).**
Keys+invites multi-human auth — deliberately NO OAuth, NO passwords, NO sessions, NO
email. This is DEPLOYMENT policy for `packages/worker` (`auth.ts`'s `createAuthGate`,
`auth-routes.ts`, `membership-store.ts`, `migrations/0002_auth.sql`), exactly like the
single-shared-secret gate it evolves (Stage-1 Unit 2b Part C) — `packages/core` is
untouched, and the reference `serve()` (`packages/server`) stays keyless. The wire
protocol itself does not change: these are new routes, additive, under the same `/v0`
prefix and error-envelope conventions.

Auth: `Authorization: Bearer <token>` — either the deployment's root `API_KEY` secret
(resolves the distinguished, virtual "root" identity — admin everywhere, no `users` row)
or a minted API key (`aslk_...`, HMAC-hashed at rest under the `KEY_PEPPER` secret). A
deployment with either secret unset/blank fails closed (`500 RUNTIME`) for every route
including these. `POST /v0/join` is the one unauthenticated route — the invite token
itself is the credential.

**SINGLE-BUNDLE SCOPE (adversarial review, 2026-07-02 — BLOCKER, fixed).** The role model
below is written bundle-scoped (`memberships.bundle`) for a FUTURE multi-bundle unit
(plan rev 3 F5, deferred — not built now), but `D1R2Backend` today is ONE shared,
UNPARTITIONED namespace: naming a different `bundle` string in a URL/body/query does not
select different data, it is just a different label over the SAME store. Before this
fix, that gap was live-exploitable — an admin could create an invite/membership for an
arbitrary bundle name, and any member of ANY nominally-different bundle could read/write
ALL data, because there was really only one store underneath every label. **The fix is
NOT store partitioning (a separate, future unit) — it is making the API HONEST about the
single-bundle reality it runs on today:** every bundle-accepting input — the gate's
URL-path `{bundle}` segment, and every `bundle` field/query param in the table below — is
validated against the literal string `"default"`, the ONE bundle that actually exists,
and rejected `400 USAGE` otherwise. No invite/membership for any other bundle name can
ever be created, so there is nothing for a role lookup to find at any other name either.
**Deferred to a future unit, not silently dropped:** real multi-bundle store
partitioning, per-bundle `api_keys` scoping (today a key belongs to a USER, not one
membership — see `DELETE /v0/members/{user_id}` below), and multi-bundle semantics for
admin-minted agent keys, must all be designed and built TOGETHER — this pass deliberately
does not attempt any of them piecemeal.

Roles are bundle-scoped (`memberships.bundle`, one row per `(user, bundle)` — today
always `bundle = "default"`, see above): `reader` (read-shaped bundle routes), `writer`
(+ doc/blob/reserved writes), `admin` (+ every route below). Root is `admin` everywhere
and its successful admin-route responses carry an extra `bootstrap: true` field, nagging
the operator to create a real admin instead of running on the bootstrap secret
indefinitely.

| Route | Auth | Semantics |
| --- | --- | --- |
| `POST /v0/join` | none (invite token IS the credential); rate-limited | `{ invite_token, display? }` → atomic single-use redemption. `201` → `{ user_id, role, bundle, api_key, key_prefix }` (`api_key` shown ONCE). Unknown/expired/revoked/already-redeemed tokens ALL return the IDENTICAL `400 INVITE_INVALID` envelope — no oracle. |
| `GET /v0/whoami` | any identity | `{ user_id, display, method, memberships: [{bundle, role}], bootstrap? }`. |
| `GET /v0/bundles` | any identity | Membership-scoped list: `{ count, bundles: [{bundle, role}] }`. Root sees every bundle with a membership row, plus `"default"`, all as `admin` — in practice always just `[{bundle: "default", role: "admin"}]` (single-bundle, above). |
| `POST /v0/invites` | admin of `bundle` (body field, default/only `"default"`) | `{ role, bundle?, expires_in_hours?, display_hint? }` → `201` → `{ invite_id, token, expires_at, bundle, role }` (`token` shown ONCE, prefix `aslinv_`). A non-`"default"` `bundle` is `400 USAGE`. |
| `GET /v0/invites?bundle=` | admin of `bundle` (omitted: every bundle the caller admins; root: all) | `{ count, invites: [...] }` — never a `token_hash`. A non-`"default"` `bundle` is `400 USAGE`. |
| `DELETE /v0/invites/{id}` | admin of `"default"` | Authorizes BEFORE reading the invite (no existence oracle for a non-admin — 403 either way). Idempotent: `{ invite_id, changed }` — revoking an already-revoked invite is `changed: false`, not an error. |
| `GET /v0/members?bundle=` (default/only `"default"`) | admin of `bundle` | `{ count, members: [{userId, bundle, role, display}] }`. A non-`"default"` `bundle` is `400 USAGE`. |
| `PUT /v0/members/{user_id}/role` | admin of `bundle` (body field, default/only `"default"`) | `{ bundle?, role }` → `{ user_id, bundle, role, changed }` — idempotent (same role twice ⇒ `changed: false`). Demoting the LAST admin of `bundle` is `409 LAST_ADMIN` (root exempt — see below). A non-`"default"` `bundle` is `400 USAGE`. |
| `DELETE /v0/members/{user_id}?bundle=` (default/only `"default"`) | admin of `bundle` | Removes the membership AND revokes every one of the user's API keys DEPLOYMENT-WIDE (keys carry no bundle scope — see the open question below; correct only because there is exactly one bundle). Removing the LAST admin of `bundle` is `409 LAST_ADMIN` (root exempt). A non-`"default"` `bundle` is `400 USAGE`. |
| `POST /v0/keys` | self (mints for self, any member) or admin (`{new_agent_label}` to create a brand-new non-human user and mint its first key) | `201` → `{ id, user_id, api_key, key_prefix, last_four, label }` (`api_key` shown ONCE). **No `user_id` field** — minting a usable credential for an EXISTING user (human or otherwise) is not possible via this endpoint (adversarial-review BLOCKER, fixed — see below); a human gets access via `POST /v0/join` only. Root self-mint (no `new_agent_label`) is a clean `400 USAGE` reject — root's authority is the `API_KEY` secret itself, not a row. |
| `GET /v0/keys?user_id=` | self (own keys) or admin (any/all — a bare `GET` from an admin lists EVERY key deployment-wide) | `{ count, keys: [...] }` — never a `key_hash`. |
| `DELETE /v0/keys/{id}` | self-own or admin | Idempotent: `{ id, changed }`. A caller who is neither the owner nor an admin gets the IDENTICAL `404 NOT_FOUND` whether `id` is absent or belongs to someone else — no existence oracle. |

**Impersonation vector closed (adversarial review, 2026-07-02 — BLOCKER, fixed).**
`POST /v0/keys` used to accept `{user_id}` and mint a WORKING key for that existing
user, returning the raw key to the CALLER — i.e. any admin could hand themselves a
credential that authenticates as an arbitrary human, whether or not that human ever
asked for one. This is now structurally impossible: the endpoint has exactly two shapes
(self-mint; admin-only NEW-agent creation), and there is no code path that reads an
existing `user_id` from the request body at all — a `user_id` field, if sent, is simply
never consulted.

Actor attribution: the resolved identity's internal `userId` is injected into the
forwarded request's `X-Actor` header (OVERRIDING any client-supplied value) before it
reaches the pre-existing bundle router — `writeOptionsFromHeaders`' `X-Actor` read
(Conventions, above) needed no change. A minted key's writes are attributed to that
key's owner in `doc_history.actor` / `GET /docs/{id}/versions`, not to root or a
generic default.

Rate limiting: `POST /v0/join` and repeated authentication FAILURES are both limited
per client IP (`CF-Connecting-IP`, 10/minute by default) — honestly per-isolate,
best-effort (an in-memory counter, reset on isolate recycle, not coordinated across
colos); production hardening for a real deployment is Cloudflare's own edge WAF/rate-
limiting rules, not a bigger version of this limiter.

Audit trail: every key mint/revoke, invite create/redeem/revoke, membership change, and
access-denied event appends an `auth_events` row (`packages/worker/src/membership-store.ts`),
append-only, no route exposes update/delete on it. A denial that avoids an existence
oracle in its HTTP response (`DELETE /v0/keys/{id}` above) still writes the audit row —
only the response the CALLER sees stays uniform.

Error envelope completeness: `auth.ts`'s gate wraps its entire post-authentication
dispatch (the auth routes AND the bundle-role lookup) in the same
`VersionConflict`-\>`412` / ENOENT-\>`404` / `Error`-\>`400 USAGE` / else-\>`500 RUNTIME`
mapping `packages/server/src/router.ts`'s own `errorFromCaught` uses (a separate copy,
`envelope.ts` — that package stays untouched). A `MembershipStore`/D1 throw reaching this
layer is now always a structured `{ error: { code, message } }` response, never a bare
failure.

**Recorded deviation, not silently absorbed:** `POST /docs:read-many` is a READ (the
seam's `readMany`, the one-round-trip graph/backlink-traversal path) but a `POST` by
HTTP method. `classifyBundleRoute` (`auth.ts`) treats it as `reader`-permitted — a
literal "reader = GET routes only" reading would have silently broken the primary
batch-read path for every reader-role caller, which reads as unintended rather than a
deliberate restriction.

**Push-down list: now CONSUMED client-side (frontmatter-projection pass, 2026-07-04).**
The `GET /docs?fields=frontmatter&prefix=&type=&tag=` projection above had been served
since v0 but never asked for: `RemoteBackend.list()` kept only the ids and the engine's
`query()` then pulled FULL BODIES over `POST /docs:read-many`. The seam gained an
OPTIONAL `queryHeads?(filter)` (`core/src/types.ts` — a push-down HINT returning
`{ id, frontmatter, version }` heads, never bodies), `RemoteBackend` implements it over
this route (cursor-paginated like `list()`), and the engine's new `queryHeads()`
re-applies the ONE canonical filter predicate (`matchesFilter`, `bundle.ts`) to whatever
a push-down returns — a backend may over-return, semantics stay in core (gate 3), and
the reference router's own list handler now consumes that same predicate instead of its
former inline type/tag copy. The CLI's `list`/`query` rides `queryHeads`, so a filtered
`--remote` scan is thin-row round-trips with no bodies on the wire. **Name-collision
note:** the wire's `fields=` param is the PROJECTION selector, so `QueryFilter.fields`
EQUALITY facets are NOT pushed down — the server over-returns matching-type heads and
the engine re-filter narrows (correct, still body-free; a dedicated filter param is
future protocol work if head-row counts ever matter). No ROUTE or protocol-shape change
(the deployed Worker already served this projection), but the same pass's review
hardened the list handlers behaviorally: (1) `handleList` batch-reads via core's
delete-tolerant `readManyExisting` (briefly exported for this; the export was withdrawn
the same day when the handler switched to consuming core's `queryHeads` wholesale — the
tolerance now arrives through that one scan implementation), so a doc deleted between the
route's `list` and its batch read is skipped rather than 404-failing the whole scan —
the server-side half of the client-side mid-scan-delete hardening; a MALFORMED doc
still fails the scan loudly (see the open question on a `skipped` response shape);
(2) `handleList`/`handleListBlobs`' vanished-cursor fallback now compares with the same
`localeCompare` the page sort uses — the previous code-unit `>` could re-emit or skip
rows when the cursor doc vanished between pages (a pre-existing defect, fixed with a
stepwise-pagination regression test). These reach the deployed Worker at its next
redeploy; until then the production scan keeps the previous (fail-loud, correct-cursor-
happy-path) behavior.

**Server side of the same story (D1 frontmatter heads, same day):** `handleList` is now
HEAD-FIRST by consuming core's ONE `queryHeads(bundle, filter)` wholesale (via the same
synthetic bundle the router already routes `writeDocVersioned` through — it does NOT
re-implement the prefer-push-down-else-fallback dance; an earlier draft did, and the
review collapsed it). A backend implementing the seam's optional `queryHeads` push-down
serves the whole route from head projections; every other backend gets the
delete-tolerant `list` + batch-read fallback inside core's implementation. On the
Worker, `D1R2Backend.queryHeads` reads `{id, version, frontmatter}` from the D1 head
index alone (migration 0004's column, written by every head-writing statement for
JSON-PURE frontmatter only — values a JSON round-trip would mangle, e.g. a nested
unquoted-YAML date, are never cached; NULL/corrupt/impure columns read through R2 and
self-heal on the next real write) — so a paginated scan stops costing one R2 GET per
doc per page. Scoping: the reference server's OWN backends (Filesystem/Memory)
implement no `queryHeads`, so its default behavior is unchanged; a queryHeads-capable
backend mounted behind the router (e.g. a `RemoteBackend` proxy chain) takes the
push-down path by design. **Deploy ordering is LOAD-BEARING (human-gated): apply
migration 0004 BEFORE deploying this code — the new statements reference the column
unconditionally, so deploy-first fails every write and scan with `no such column`
until the migration lands.**

## Deferred to v1 (recorded, not designed)

- **Server-side backlinks / graph traversal** (`GET /docs/{id}/backlinks`) — the
  strongest form of the query-payload posture.
- **Materialization endpoint** (`GET /export.tar`) — the materialization boundary as
  an API; any backend exports a conformant OKF directory.
- Change events/subscriptions; an MCP adapter surface (becomes a requirement if the
  canonical-replacement is confirmed). ~~Roles, per-namespace/per-user access,
  multi-tenant identity (Stage 2)~~ **narrowed further, then answered for the Worker
  deployment specifically:** Stage-1 Unit 2b Part C's single-shared-secret gate answered
  "is this caller allowed to talk to this deployment at all"; **Stage-2 Part A (see
  "Multi-user auth" above) now answers "which user/role is this" too** — real
  keys+invites, bundle-scoped roles, actor attribution to the individual user, an audit
  trail. What remains genuinely deferred: OAuth/SSO/passwords/sessions/email (explicitly
  OUT of Part A's design, not merely unbuilt), per-namespace access finer than
  bundle-scoped, and a collaboration/admin UI (`CLAUDE.md` gate 4) — the routes above are
  API-only.

~~**Blob / artifact serving** (`GET /blobs/{key}` by content-type).~~ **Implemented,
v0.1 (this pass)** — see the endpoint table and the "Blob routes" deviation above. The
CLI's `promote`/`pull` verbs that consume this over HTTP are Stage-1 Unit 2a **Part C**,
a separate follow-on unit; the R2/D1 deployment of blob serving is Unit 2 (Part D).

## Open questions

- Bundle namespace model: one bundle per workspace vs nested namespaces (interacts
  with per-namespace access control at Stage 2). **Partially answered** by the
  reference server (single-bundle router, see deviations above) — a future
  multi-bundle deployment still needs to pick a real dispatch model.
- Pagination defaults and caps for `list` (**answered for the reference server:**
  default `limit` 50, no enforced cap yet); `read-many` batch-size cap (note D1's
  bound-parameter limit ⇒ server-side chunking) — **still open**, not hit by the
  in-repo adapters.
- ~~Should reserved-file writes also accept `If-None-Match: *`?~~ **Answered: yes** —
  see deviations above.
- **New (Stage-2 Part A): `api_keys` carries no `bundle` column — a key belongs to a
  USER, not to one membership.** `DELETE /v0/members/{user_id}` revokes ALL of that
  user's keys, deployment-wide, not scoped to one bundle. **Made HONESTLY correct, not
  just "correct in practice," by the adversarial-review single-bundle enforcement
  (B1, "Multi-user auth" above): since no bundle other than `"default"` can ever exist
  via the API, there is no "bundle B" for this to over-reach into.** The real fix — real
  multi-bundle store partitioning PLUS per-bundle key scoping, designed and built
  together as one future unit, not piecemeal — is recorded as deferred in "Multi-user
  auth" above, not silently dropped. "Multi-user auth" also documents the
  deliberate-literal-reading rationale ("revokes their keys for that deployment") this
  entry originally recorded.
- Whether `fields=` should ever admit body previews (truncated) for search-style UIs,
  or bodies stay strictly read-only endpoints. **Still open** — the reference `fields=`
  only toggles between the thin row and full frontmatter; no body preview exists yet.
- **Should `GET /docs` be able to QUARANTINE a malformed doc instead of failing the
  scan?** Locally, `list` skips an unparseable doc and reports it under `skipped[]`
  (corrupt-doc robustness, STATUS item 36); over the wire there is no response shape to
  carry that report, so the server deliberately fails LOUD rather than silently dropping
  content — a remote `list` against a bundle with one corrupt doc errors entirely where
  a local `list` degrades gracefully. Closing this needs a protocol addition (e.g. an
  optional `skipped[]{id,reason}` block on the list envelope) — recorded here rather
  than smuggled in.
- **UPDATED, not resolved (v0.1): the raw-bytes endpoint now exists, but it cannot carry
  a concept DOCUMENT — `doc read --out` over `--remote` still cannot deliver the
  original on-disk bytes for a `.md` id.** The new `GET /blobs/{key}` route (this pass)
  is a raw-bytes channel, but `assertSafeBlobKey` rejects a `.md`-ending key at that
  route by design (I1 — the blob and concept-document namespaces stay disjoint in both
  directions; a blob endpoint must never become a back-door raw-doc channel that
  bypasses §9.2/kind validation and the one-parser layer). A concept document's bytes
  therefore still travel only via `GET /docs/{id}`'s parsed `{ frontmatter, body }`. The
  CLI (`packages/cli/src/commands/doc.ts`) works around this by re-serializing the
  parsed document through core's exported `stringifyDoc` and writing THOSE bytes
  locally. For an ENGINE-WRITTEN document this is byte-identical to the original
  (`stringifyDoc` is exactly what `writeDoc` used to produce the on-disk bytes in the
  first place — verified by `packages/cli/test/remote.test.ts`'s byte-parity test), but
  a hand-edited file with idiosyncratic YAML formatting (unusual quoting, key order,
  comments) would round-trip to the CANONICAL form over `--remote`, not its original
  bytes. **Still open for docs** — this is a documented, honest divergence between
  `--dir` and `--remote` for `doc read --out`, not a bug. (A brand-new, non-`.md` blob
  key DOES now round-trip byte-identical over `--remote` via `GET`/`PUT /blobs/{key}` —
  see the endpoint table above; that half of the original open question is resolved.)
  **Confirmed unchanged by the CLI's `promote`/`pull` (Stage-1 Unit 2a Part C):** `pull`
  of a `.md` `--doc-key` deliberately ALSO delivers the canonical `stringifyDoc`
  re-serialization — for BOTH `--dir` and `--remote`, not only `--remote` — rather than
  reusing `doc read --out`'s local raw-on-disk-bytes path; it is built fresh on the
  `readDocVersioned`/`writeDocVersioned` engine API and is backend-agnostic by design.
  This does not open a new gap — it is the SAME documented divergence stated once more
  precisely, and it is why `pull`'s doc route reports the store's version token with NO
  byte-verification (a shared self-verify would hard-fail a valid pull of a hand-edited
  doc like `examples/sample-bundle`). See `packages/cli/src/commands/pull.ts`'s file
  header and `packages/cli/test/promote-pull.test.ts`.
- **CLOSED (Stage-1 Unit 2b Part C): the client-side error envelope now carries a `code`.**
  `RemoteBackend.toError` (`core/src/remote-backend.ts`) still distinguishes `404`
  (ENOENT-shaped) and `412` (`VersionConflict`) exactly as before — UNCHANGED, so the
  tri-backend contract suite needed no edits — but every OTHER non-2xx status now throws a
  new, additively-exported `RemoteError` (`code`, `message`, `status`) instead of a plain
  `Error`: the envelope's own `code` wins when present (every route in this repo's servers
  emits one); a status-derived guess (`401` -> `AUTH_REQUIRED`, `5xx` -> `RUNTIME`, else
  `USAGE`) covers a malformed/absent envelope or a conformant-but-foreign server. The CLI's
  `errors.ts` gained `classifyBundleError(err, remoteUrl?)`, the ONE mapping every
  `--remote`-facing command catch-all now uses instead of a blind `USAGE`: `AUTH_REQUIRED`
  -> the AUTH exit-code taxonomy (4) with a `login --remote <url> --api-key <key>` fixing
  hint; `RUNTIME` -> RUNTIME (1) — the regression this closes, since a genuine server-side
  `500` used to surface as exit 2 ("fix your input") instead of exit 1 ("retry/report a
  bug"); anything else -> USAGE (2), unchanged. `toExit` (the function `cli.ts`'s
  `formatError` calls on whatever any command throws) ALSO classifies an uncaught
  `RemoteError` via the same function, so a command with no catch-all of its own (most
  commands — `list`, `doc`, `view`, `new`, `status`, `kinds`) gets the correct exit code
  too, not just the handful with an explicit try/catch around their engine calls.
- **API-key gate is the Worker deployment's posture; the reference `serve()` stays
  keyless (Stage-1 Unit 2b Part C).** `packages/worker/src/auth.ts`'s `withApiKey`
  middleware wraps the wire-protocol router before a Cloudflare Worker's `fetch` handler
  ever sees a request: a configured `API_KEY` secret is required as
  `Authorization: Bearer <key>` on every request (`401 AUTH_REQUIRED` on a
  missing/wrong key); an UNCONFIGURED `API_KEY` fails CLOSED — every request gets a
  `500 RUNTIME` envelope, never "auth optional" — since an open Worker is reachable from
  the whole Internet. The reference `serve()` (`packages/server`) is UNCHANGED and
  remains loopback-only/keyless by design (a local, same-machine reference
  implementation proving the protocol, not a deployment) — `RemoteBackend`'s new
  optional `authToken` (sent as `Authorization: Bearer <token>` on every request) is
  simply ignored by `serve()`, so a client configured with a key still talks to a local
  reference server exactly as before. The CLI sources this token, in priority order,
  from the `AGENTSTATE_LITE_API_KEY` env var, then an origin-keyed entry written by
  `agentstate-lite login --remote <url> --api-key <key>` (`packages/cli/src/credentials.ts`'s
  `remotes` map, `~/.agentstate/okf-config.json`).
- **The Worker deployment requires `compatibility_flags: ["nodejs_compat"]`** (`packages/
  worker/wrangler.jsonc`, Stage-1 Unit 2b Part B review finding). Reason: core's
  `backendFor(bundle)` (`packages/core/src/bundle.ts`) statically references `new
  FilesystemBackend(bundle.root)` as its default-adapter fallback — reachable from
  `writeDocVersioned`, which the router's own one-engine rule requires calling for every
  doc write (so a Worker-received write gets the same OKF §9.2/id-safety validation every
  other write path gets) — so `node:fs`/`node:path`/`node:crypto`/`node:http` end up in the
  Worker's bundle graph even though this Worker always constructs an explicit `D1R2Backend`
  and that fallback branch is never taken at runtime. `nodejs_compat` lets the bundle
  resolve; the fix that would make the flag unnecessary — a worker-clean core entry-point
  split so the fallback isn't statically reachable from a caller that always supplies its
  own backend — is a deferred, separate unit, not attempted here.

## Test coupling note

The tri-backend contract suite lives in `packages/core/test/wire-protocol.test.ts` and
imports `@agentstate-lite/server` (a TEST-ONLY reverse dependency: `core`'s
`package.json` lists `@agentstate-lite/server` as a `devDependency` so the test can
call `createRouter`/`serve` directly). Production code has no such edge — `core/src`
never imports `server`; only the test does, to prove `RemoteBackend` (which DOES ship
in `core/src`) round-trips against the reference router. `packages/server` must be
built (`npm run build`, now dependency-ordered after `core`) before
`npm test -w @agentstate-lite/core` can resolve that import — `npm run check` does
this in the right order; a bare `npm test -w @agentstate-lite/core` without a prior
build will fail to resolve `@agentstate-lite/server` if `packages/server/dist` is stale
or missing.
