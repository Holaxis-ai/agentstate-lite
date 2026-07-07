---
type: Plan
title: D1 frontmatter heads — Worker scans stop touching R2
timestamp: '2026-07-06T16:48:13.757Z'
---
# D1 frontmatter heads — Worker scans stop touching R2

**Status: binding plan (2026-07-04).** Follow-on to `plans/frontmatter-projection.md`.
That unit made the CLI's scans body-free ON THE WIRE; this one makes them cheap ON THE
SERVER. Today the Worker's `GET /docs` (`handleList`) does `backend.list` + a full
`readMany` per page request — on `D1R2Backend` that is one R2 GET per doc per page
(`fetchContentBytes`), so a paginated scan re-reads the whole bundle from R2 once per
page: O(pages × N) R2 operations for data whose scan-relevant part (frontmatter) is
tiny and already flows through D1's head row lifecycle.

## Decisions

1. **Migration `0004`: `doc_heads` gains a nullable `frontmatter` TEXT column** (JSON).
   Nullable because existing rows can't be backfilled in SQL (frontmatter lives inside
   markdown in R2) — a NULL row is served by R2 READ-THROUGH and the column self-heals
   on that doc's next write. No backfill script; prod has 13 docs, and read-through is
   correct at any scale, just not yet cheap for never-rewritten legacy rows.
2. **The column stores `JSON.stringify(parseMarkdown(raw).frontmatter)`** — parsed once
   at write time from the exact serialized bytes, so the column is parse-parity with
   what `read()`/`readMany()` produce (the frontmatter normalization layer — Date→ISO
   etc. — has already run). JSON round-trip is lossless post-normalization.
3. **`D1R2Backend.queryHeads(filter)`** (the seam's optional push-down): ONE D1
   `SELECT id, version, frontmatter FROM doc_heads`, prefix pushed as a LIKE with
   `%`/`_`/`\` escaped (an unescaped `_` would make LIKE over-match — tolerable under
   the over-return contract, but escaping is trivial so we don't lean on it);
   `type`/`tags`/`fields` NOT pushed (SQL-JSON filtering buys little — the consumer
   re-filters with `matchesFilter` per the seam contract). NULL or non-JSON column →
   R2 read-through (`fetchContentBytes` + `parseMarkdown`), loud on a head/content
   desync exactly like `read()`.
4. **`handleList` prefers `backend.queryHeads` when the backend implements it**, folding
   both paths to `HeadResult[]` before the (unchanged) filter → sort → cursor → project
   pipeline; the fallback keeps `list` + `readManyExisting`. Reference-server behavior
   (Filesystem/Memory — no `queryHeads`) is byte-identical; the Worker's scan becomes
   D1-only the moment it deploys with 0004. `matchesFilter` re-runs on BOTH paths
   (including `prefix` on the push-down path — belt-and-braces against LIKE semantics).
5. **Idempotent no-op writes deliberately do NOT heal a NULL column** (byte-identical
   re-write short-circuits before any statement runs, same as before). Healing rides
   real writes only; read-through covers the rest. Recorded, not accidental.
6. **Deploy is human-gated as always — and the ORDER IS LOAD-BEARING: migrate FIRST.**
   `wrangler d1 migrations apply agentstate-lite --remote` (0004), THEN `wrangler
   deploy`. The new code references the `frontmatter` column UNCONDITIONALLY (every
   head-writing statement and the `queryHeads` SELECT); deployed against a pre-0004
   schema it fails EVERY doc write and every `GET /docs` with `no such column` — a full
   outage, not degradation (the read-through path guards NULL column VALUES, not a
   missing COLUMN). Until both steps run, production keeps the OLD code's readMany scan
   path — correct, just R2-hot; "graceful" describes the old deployed code, never
   deploy-before-migrate.

## Review outcome (8-angle adversarial review over the diff)

**Fixed:** (a) `handleList` collapsed onto core's `queryHeads(bundle, filter)` — the
router had re-implemented the prefer-push-down-else-scan dance inline, re-opening the
exact one-implementation fork this pass's predecessor closed; the synthetic
`{root:"", backend}` bundle the router already uses for `writeDocVersioned` made the
collapse one line (and `readManyExisting`'s one-day-old export was withdrawn — its only
external consumer vanished). (b) Column values that parse to valid-JSON-NON-OBJECTS
(the literal `null`, a number, an array) now read through like corrupt JSON — a `null`
column previously produced `frontmatter: undefined` and a 500 on the whole page.
(c) JSON-impure frontmatter (nested `Date` from an unquoted nested YAML date,
`Infinity`) is now NEVER cached (`isJsonPure` gate → column NULL → read-through serves
the exact parsed shapes) — a JSON round-trip would silently diverge the column from
`read()`'s shapes; divergence is now unrepresentable, not unlikely. (d) The R2
dedup-fetch loop is ONE shared `fetchBytesByVersion` (was copied between `readMany` and
`queryHeads`). (e) These ordering/honesty doc fixes.

**Recorded, deliberately not built:**

1. *Cursor-aware SQL pagination* (`WHERE id > ? LIMIT ?`) — the honest next step at
   scale: today every page request re-SELECTs all matching heads. Blocked by two real
   constraints: the route's `count` is the TOTAL matched (needs a full scan or a second
   COUNT query) and the cursor contract is `localeCompare` order, which diverges from
   SQLite byte order — a naive SQL cursor would re-emit/skip rows. Revisit when bundle
   scale makes page latency observable.
2. *Normalization-change invalidation*: the column caches the CURRENT parse layer's
   output. If core's frontmatter normalization ever changes, ship a migration that
   `UPDATE doc_heads SET frontmatter = NULL` — read-through + self-heal re-normalizes
   lazily with zero downtime. Recorded so the future change carries its invalidation.
3. *Type-filter push-down into SQL* — deliberate over-return (filter semantics stay in
   core); revisit only if type-filtered scans of large heterogeneous bundles get hot.

## Touch list

- `packages/worker/migrations/0004_frontmatter_column.sql`
- `packages/worker/src/d1r2-backend.ts` — column on all three head-writing statements;
  `queryHeads`; LIKE-escape helper.
- `packages/server/src/router.ts` — `handleList` head-first restructure.
- `packages/worker/test/frontmatter-heads.test.ts` — parity vs `readMany`-derived heads
  (byte-identical versions); zero-R2-GET assertion via a counting bucket wrapper;
  NULL-column read-through + self-heal-on-write; corrupt-JSON column read-through;
  LIKE `_` escape; thin + `fields=frontmatter` row parity through the real router.
- STATUS.md (item 39 + worker row), `docs/WIRE-PROTOCOL.md` (deviation note update).

## Acceptance

- Existing 660 tests green unchanged (reference-server scan behavior identical).
- `queryHeads` rows ≡ `readMany`-derived heads on D1R2 (ids, frontmatter, versions).
- A D1R2-backed `GET /docs` performs ZERO R2 GETs when every head row carries
  frontmatter (counted, not inferred).
- `npm run check` green.
