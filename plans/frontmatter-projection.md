---
type: Plan
title: Frontmatter projection — the engine consumes the wire's push-down list
timestamp: '2026-07-06T16:48:18.887Z'
---
# Frontmatter projection — the engine consumes the wire's push-down list

**Status: binding plan (2026-07-04).** Closes the read-path scaling gap recorded twice in
STATUS.md (item 28's deferred "frontmatter-only `list` seam"; the AXI pass's "unbounded
per-session read cost" review finding): every `list`/`query` today is `backend.list` +
`backend.readMany` of FULL BODIES, then client-side filtering — even over `--remote`,
where `GET /docs?prefix=&type=&tag=&fields=frontmatter` (WIRE-PROTOCOL.md §"Endpoints",
implemented by the reference router AND the deployed worker since v0) already answers the
same question server-side with thin rows. The server capability exists; no client consumes
it. This unit wires the consumption end to end. **No wire-protocol change, no router route
change, no worker change, no deploy** — the deployed production worker already serves the
route this unit starts using.

## Decisions (recorded, not re-litigated)

1. **Seam shape: an OPTIONAL `queryHeads?(filter?: QueryFilter): Promise<HeadResult[]>`**
   on `StorageBackend`, where `HeadResult = { id, frontmatter, version }` — full
   frontmatter, never a body. Full frontmatter (not the thin 4-field row) because the
   CLI's `--fields` hatch, kind-aware columns, and `QueryFilter.fields` equality all need
   arbitrary frontmatter keys; bodies are the transfer weight, frontmatter is not.
2. **Gate-3 discipline: the backend does NOT own filter semantics.** `queryHeads` is a
   push-down HINT: a backend MAY over-return (ignore facets it can't push); the ENGINE
   re-applies the one canonical predicate to whatever comes back. A backend MUST NOT
   under-return for a facet it chooses to honor — and the only in-repo implementor
   (`RemoteBackend`) honors `prefix`/`type`/`tag` by delegating them to the reference
   router, which this unit switches onto the SAME shared predicate (see 4). OKF semantics
   stay in core.
3. **Only `RemoteBackend` implements it (v1).** The win is wire-transfer bytes;
   Filesystem/Memory/D1R2 are local to their data (D1R2 runs server-side under the worker
   router — the CLI reaches it THROUGH `RemoteBackend`), so they gain nothing and stay
   unchanged. The engine's fallback (`list` + `readManyExisting` + filter, bodies read
   then dropped) keeps behavior identical for them — including `onSkip` malformed-doc
   resilience.
4. **Close the pre-existing filter fork while here:** `router.ts`'s `handleList`
   reimplements `query()`'s type/tag matching inline. Extract ONE exported
   `matchesFilter({id, frontmatter}, filter)` in core (`bundle.ts`), consume it from
   `query()`, `queryHeads()`, AND `handleList` — one predicate, three consumers, no drift.
5. **`QueryFilter.fields` equality is NOT pushed down** (the wire's `fields=` param is the
   projection selector, a name collision recorded in WIRE-PROTOCOL.md; adding a second
   param is future protocol work). The engine-side re-filter covers it — correct, just
   not yet thinner.
6. **CLI: only `list`/`query` switches to `queryHeads`.** `status`/`view`/backlinks need
   bodies (link scan, section lint) — untouched. `home`'s dashboard is structurally
   offline (`openBundle(undefined, undefined)`) where heads save nothing — untouched.
   `loadKinds` parses convention docs (prefix-scoped, small) — untouched.
7. **`onSkip` on the push-down path:** not honored (a malformed doc on the server fails
   the server-side scan, exactly as today's remote `list` already does). Recorded in the
   seam doc, not silently divergent.

## Touch list

- `core/src/types.ts` — `HeadResult`, `StorageBackend.queryHeads?` (doc: contract above).
- `core/src/bundle.ts` — `matchesFilter` (exported), `queryHeads()` engine fn
  (push-down + re-filter, or fallback), `query()` refactored onto `matchesFilter`.
- `core/src/remote-backend.ts` — `queryHeads` over `GET /docs?fields=frontmatter`
  (+ `prefix`/`type`/repeated `tag`), cursor-paginated like `list()`.
- `core/src/index.ts` — export `queryHeads`, `matchesFilter`, `HeadResult`.
- `packages/server/src/router.ts` — `handleList` consumes `matchesFilter` (no route change).
- `packages/cli/src/commands/list.ts` — `query` → `queryHeads`.
- Tests: `core/test/query-heads.test.ts` (adapter parity incl. wire; no-body-on-the-wire
  assertion via transport capture; over-return re-filter; fields-equality over remote;
  pagination past the router's 50-row page; fallback `onSkip`); one CLI remote-parity
  addition.
- Docs: WIRE-PROTOCOL.md "Implemented by reference" note (client now consumes push-down);
  STATUS.md changelog + component rows.

## Acceptance

- `queryHeads(bundle, f)` ≡ `query(bundle, f)` minus `body`, same versions as `read()`,
  same sort, across Filesystem/Memory/Remote (tri-backend).
- The heads request over the wire carries `fields=frontmatter` and its response contains
  NO `body` key (transport-captured, not inferred).
- `list --remote` output byte-identical to before the change (same rows, same count).
- `npm run check` green; committed skill bundle byte-compare green.

## Review outcome (8-angle adversarial review over the diff)

**Fixed:** the vanished-cursor fallback comparator bug in `handleList`/`handleListBlobs`
(pre-existing, code-unit `>` vs `localeCompare` sort — dup/skip rows when the cursor doc
vanishes between pages); server-side mid-scan-delete tolerance in `handleList` via a newly
exported `readManyExisting` (the server half of STATUS item 33); `RemoteBackend`
`list`/`queryHeads` share one private `pageDocs` pager; engine `query`/`queryHeads`
fallback share one `scanMatching` skeleton; `home`'s dashboard switched to `queryHeads`
(structural `{id, frontmatter}` input); comment/count honesty fixes.

**Declined, with rationale (not silently dropped):**

1. *"Seam should be `listHeads(prefix)` instead of `queryHeads(QueryFilter)`"* — the
   QueryFilter shape mirrors the wire spec's own push-down row (`type`/`tag` params are
   PROTOCOL semantics the reference router evaluates via core's `matchesFilter`, not
   backend-invented semantics), over-return tolerance is explicit in the contract, and
   prefix-only push-down would forfeit the server-side row-count narrowing the route
   already implements. The under-return risk for a FOREIGN spec-implementing server is
   the same conformance class as any other endpoint's semantics, untestable from this
   repo either way.
2. *"Drop the redundant sort on the push-down branch"* — the contract deliberately
   allows a backend to return rows in ANY order (over-return, any order; the engine owns
   semantics), so the sort is load-bearing defense, not waste. O(n log n) on in-memory
   heads is noise next to the wire transfer it replaced.
3. *"Dedup test fixtures across suites (`freshWireBundle` et al.)"* — 3-line
   per-file fixtures; a shared factory across test files buys little and couples suites.
   The genuinely new piece (the recording transport) exists once.
