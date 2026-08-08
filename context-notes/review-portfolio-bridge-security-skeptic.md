---
type: Context Note
title: Review portfolio bridge security skeptic
actor: bridge-security-adjudicator
timestamp: '2026-08-08T17:54:18.040Z'
---
# Summary

## Final revised-Plan re-review

- **status:** COMPLETE
- **verdict:** APPROVED
- **exact subject:** `plans/review-portfolio-bridge-identity-repair@sha256:624ea79a22241cbd53e0bea26ca100d7afd1572b5e4f5ca8a238228f16d4c35b`
- **confidence:** high
- **remaining security blockers:** none at Plan stage

The revised Plan incorporates all eight mandatory conditions from the initial adjudication:

1. It preserves the executable fail-closed grammar: only absent `from`/`to` facets mean unrestricted; supplied blank/all-whitespace values, empty arrays, blank/invalid array entries, and over-cardinality arrays remain invalid, while the inaccurate blank-as-omitted prose is corrected.
2. It preserves exact raw UTF-8 bytes and applies the original-byte bound for nonblank `from`, `to`, and `text`, including the exact-to-prefix widening regression, without narrowing core IDs or adding fields.
3. It limits invalid-envelope correlation to a plain v0 envelope with string type and an ID accepted by the one existing 1–128-byte helper; parsing still rejects, the error stays generic, v1 remains uncorrelated, and no launch/bundle authority is touched.
4. It requires deterministic batches of at most 32, one edge request in flight, first-failure short circuit, and a cumulative accepted budget of 1,000 rows per direction.
5. It fails graph evidence closed on malformed or exact-duplicate Review row IDs while leaving safe records visible and avoiding normalization.
6. It replaces lossy Set deduplication with maximum multiplicity per exact `(from,to,text)` across outbound/inbound multisets, after per-batch validation.
7. It requires red-first owning tests plus an exact-candidate harness routed through the real parser/service/core, a parser-validating fault broker, threshold/deadline/resource/multiplicity fixtures, and an actual sandboxed-host correlation regression.
8. It makes exact-SHA review a hard predecessor of QA and keeps candidate bytes inert until a compatible released/installed host is verified; live CAS promotion and byte reapproval are a separate host-first/View-second gate.

The Plan also correctly narrows the delivery claim to v0 edge-selector parity and leaves `query.prefix` and broader Markdown-link whitespace behavior as separate follow-ups. Its View-side row checks are transport conformance checks only: they reject or mark incomplete and never normalize, alias, or redefine an OKF identity. The 1,000-row cumulative limit is explicitly a conservative View resource policy matching the pre-batching exposure boundary; it does not change v0.

Approval is for the Plan only. Builder output still requires the specified red/green evidence, independent exact-SHA code and exact-byte View reviews, adversarial QA, and host-compatible rollout gate. Any substantive Plan change requires re-review.

## Initial repair-shape adjudication

## Result Envelope

- **status:** COMPLETE
- **verdict:** PLAN_CHANGES_REQUIRED
- **approval state:** conditionally approvable only after the mandatory contract, resource, aggregation, test, and rollout changes below are in the implementation plan; no source or View candidate is approved by this note.
- **confidence:** high on selector/correlation/aggregation semantics and rollout ordering; medium-high on the chosen cumulative View budget because it is a local resource-policy decision, albeit one needed to prevent batching from widening the former host boundary.
- **review subject:** source branch base `56b5693d9aa205d9d65d8513ca07642fcbf596dc`; `packages/view-runtime/src/bridge.ts` SHA-256 `1430be3af30e830ddd862ecfede9e7d9a494a5bdb63921c55641bff7fa941325`; Review View `/private/tmp/reviews-current.html` / bundle `pages/reviews.html` SHA-256 `70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`.

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** adjudicate the v0 selector, invalid-envelope, and Review portfolio batching contracts before implementation; this serves the ultimate goal by keeping exact identity, bounded work, and evidence completeness in their owning layers rather than in a brittle View-local workaround.

## Conflict decision: supplied blank selectors stay invalid

The shipped prose says an empty/blank `from` or `to` value is treated as omitted. The actual v0 parser rejects a supplied empty/all-whitespace scalar, an empty array, and any array containing a blank entry; only an absent facet is omitted. The Task expressly forbids expanding the v0 grammar.

**Security adjudication:** preserve the safer implemented grammar and correct the prose. Supplied blank/all-whitespace values must remain invalid. Treating them as omitted would newly admit requests that are rejected today, erase a caller-supplied restriction, and turn a typo or all-blank array into an unfiltered whole-graph query. Filtering blank array entries has the same fail-open outcome when every entry is blank. This is both a protocol expansion and an avoidable disclosure/work amplification.

The reference must instead say: omit the `from`/`to` property to mean no restriction; a supplied selector is one exact nonblank string, or an array of 1–32 exact nonblank strings; empty/all-whitespace strings, empty arrays, blank array entries, non-string entries, and arrays above 32 are invalid. The 1,024-byte bound applies to each original UTF-8 string. This resolves the prose/code conflict without changing the wire grammar.

## Mandatory plan changes

### 1. Preserve exact edge selectors in the owning parser

- For `from` and `to`, use `trim()` only as the all-whitespace predicate. Return the original string byte-for-byte and enforce the 1,024-byte bound on those original bytes. Keep supplied array cardinality 1–32 and preserve duplicate entries; semantic deduplication must not bypass the transport bound.
- Apply the same exact-nonblank rule to `params.text`. Core documents `text` as an exact link-label match, but the bridge currently trims it too. Boundary whitespace in a nonblank label must not alias another label. Supplied all-whitespace text remains invalid. This is correction of an existing exact-match field, not a new grammar field.
- Include the selector-class regression `"reviews/ "`: core treats it as one exact ID, while current bridge trimming changes it to the `"reviews/"` namespace prefix. Include leading/trailing Unicode whitespace, internal whitespace, quotes, option-like strings, newline-bearing values, and raw 1,024/1,025 UTF-8-byte boundaries.
- Do not narrow or normalize core concept IDs, add a View-side identity codec, raise the selector limit, add pagination/limit fields, or modify v1.
- Narrow delivery claims to exact **v0 edge-selector parity used by the Review portfolio**. `normalizeQueryParams.prefix` also trims, and core link emission/resolution has broader whitespace limitations; those pre-existing cross-surface issues require separate follow-up rather than an inflated universal-identity claim in this unit.

### 2. Correlate invalid v0 requests without weakening validation

- Add one small bounded envelope-ID extractor beside the full parser, reusing `isPlainRecord` and the existing byte-counted `requestId` helper. It may recover an ID only when `bridge === "v0"`, `type` is a string, and `id` is a nonempty string of at most 128 UTF-8 bytes.
- Full parsing still decides admission. On parse failure, return the same static/generic `USAGE` error with the recovered ID; do not echo the type, params, raw payload, parser reason, bundle state, or launch state.
- Missing/non-string/oversized IDs, non-record input, non-v0 envelopes, and invalid v1 messages remain uncorrelated. Do not broaden the action protocol silently.
- Correlation must require no launch resolution or bundle read. The current syntax-error path already precedes authorization and reveals no protected state; echoing only the caller-supplied bounded ID keeps that property and lets the shipped client settle its Promise.
- Pin extra top-level fields, bad params, unknown string type, 33 selectors, 128/129-byte IDs, malformed envelopes, valid v0, and valid/invalid v1. Ordinary valid reply shapes and before/after launch revalidation must remain unchanged.

### 3. Batch sequentially and preserve the former resource boundary

- Extract unique, string Review IDs without trimming or canonicalization. A malformed or duplicate Review-row ID makes graph evidence incomplete rather than being silently normalized/deduplicated.
- Partition exact IDs deterministically into arrays of at most 32; emit no empty array. For 0/1/32/33/500 Reviews, the successful edge-request totals are 0/2/2/4/32.
- Run edge requests sequentially with maximum in-flight edge requests **one**. Stop on the first rejected, malformed, contradictory, `TOO_LARGE`, or over-budget batch; once currentness is impossible, later whole-bundle scans add cost but no authority.
- Validate each response before retaining it: `edges` must be an array and `count` a finite nonnegative safe integer exactly equal to that batch's array length. Missing, fractional, unsafe, negative, under-, or over-counted results fail closed.
- Add a cumulative accepted-row budget of at most **1,000 per direction**, matching the previous one-query-per-direction host boundary. Check before retaining the batch that would cross it, stop, show partial evidence, and suppress currentness. Without this, 16 individually valid batches silently expand a former 1,000-row direction into 16,000 rows and turn the View into a scan/reply amplifier.
- Retain the existing query cap of 500, per-reply 1,000-row host limit, 2 MiB reply limit, serialized/coalesced refresh authority, and generation fences. Batching remains bounded to 32 whole-bundle scans per successful refresh; lack of core indexing/early abort is residual risk, not a reason to invent another graph authority here.

### 4. Aggregate with multiset union, not set deduplication

The current View's exact-triple `Set` is too lossy. Core is explicitly per-literal-link and `parseLinksFromDoc` does not deduplicate; two identical Markdown links can therefore yield two identical `(from,to,text)` rows. The same underlying edge is also expected to appear once in the outbound projection and once in the inbound projection when both endpoints are Reviews.

After every admitted batch has passed its own count check, aggregate by exact triple using **maximum multiplicity across the outbound and inbound direction multisets**. This removes only the duplicate projection of the same graph while preserving literal-link multiplicity. Summing would double cross-direction overlap; a Set would erase legitimate repeated literal links. Different `text` values remain separate. Sort deterministically after aggregation. Deduplication/aggregation must never repair a bad batch count or make an incomplete direction complete.

### 5. Fail closed at every evidence boundary

- `edgesKnown` is true only if the Review query is exact, all required direction/batch requests completed, every batch passed strict count/shape validation, and neither direction crossed its cumulative budget.
- On any impairment, retain only already validated, budgeted rows as useful evidence; set `partial`, identify the direction and batch, terminate refresh, label last-good data `not live`, and render **Effective conclusion not asserted**. Never infer currentness from aggregate counts alone.
- Preserve the selected-record single-ID path, strict count check, read-only retry, `detailGeneration` fence, watcher serialization, trusted shared renderer, and metadata-through-text-node boundary.

### 6. Make the feedback and rollout gates executable

- Red-first owning tests must pin core exact ID acceptance, bridge `from`/`to`/`text` exactness, blank rejection, raw byte/cardinality bounds, exact-to-prefix widening, parser/service agreement, and invalid-v0 correlation without bundle access.
- The exact-blob View harness must route successful requests through the real built parser/service and use a parser-validating fault broker for degraded replies. Cover 0/1/32/33/500, maximum in-flight one, failure stops later calls, cumulative-budget crossing, whitespace IDs, duplicate row IDs, strict bad-count/shape rows, cross-batch succession, repeated identical literal edges, cross-direction overlap, and later-refresh failure.
- Update both canonical authoring references and mechanically regenerate only the npm-target copy through the documented generator/drift gate. Do not edit committed plugin bytes or versions; those remain bot-owned after merge.
- Builder must produce a committed/pushed exact SHA, then independent source review must approve that SHA before adversarial QA. A changed SHA restarts review.
- Test the candidate View only in a scratch bundle against the branch-built web and MCP hosts until compatible host bytes are actually available. Then release/verify the parser-service repair first, CAS-promote the exact approved View, require exact-byte reapproval, and rerun source/security plus browser/scratch QA. V0 `hello` carries no implementation version, so a portable View cannot prove an old host is safe. Do not promote the batched View first and do not add a View-local trim guard. If the source repair is rolled back after View promotion, disable/unapprove the View until a compatible host is restored.

## Survived attacks and compatibility assessment

- The View remains `bundle-read`, read-only, exact-byte approved, CSP/sandboxed, and has one HTML sink fed only by unmodified shared-renderer output. Metadata, IDs, errors, counts, and command guidance remain text nodes; no mutation, credential, network, form, or arbitrary navigation path was found.
- Exact-selector preservation changes accidental trim-dependent behavior: a padded selector will now address the padded identity (or return no match) instead of the unpadded identity/prefix. That is the required correction to the documented exact-match contract. Ordinary selectors and valid reply shapes remain compatible.
- Correlated `USAGE` adds only the caller's already-bounded ID. It creates no authorization result, data result, or launch oracle.
- Sequential batching plus the per-direction 1,000-row budget bounds concurrency and retained data, but a successful 500-Review refresh still performs 32 whole-bundle scans. Watch serialization prevents overlap, not cumulative repeated cost under sustained changes. Treat observed performance as a follow-up signal for an owning graph index/pagination decision; do not solve it with an unreviewed protocol extension here.

## Evidence

The exact source and prior notes were inspected. A direct built-authority probe reproduced: `from:"reviews/ "` parsing as `"reviews/"`; `text:"  succeeds review  "` parsing as `"succeeds review"`; supplied blank rejection; 32 accepted and 33 rejected; and a 33-selector `BridgeService` reply with no correlating `id`. Source inspection confirmed core preserves nonblank IDs, treats only an actual trailing slash as a prefix marker, compares text exactly, scans the bundle once per `queryEdges` call, preserves per-literal links, caps each edge result at 1,000, and caps each serialized reply at 2 MiB.

No source, Plan, Task, View, registry, or sync mutation was performed. This Context Note is the sole persistent mutation.

## Approval conditions

The plan is approved only when every mandatory item above is explicit: blank rejection/prose correction; exact `from`/`to`/**text** preservation on raw bytes; v0-only bounded correlation; sequential stop-on-failure batching; 1,000-row per-direction cumulative budget; multiset-max aggregation; red-first real-authority tests; exact-SHA Review-before-QA; and host-first/View-second rollout. Absent any one of those, verdict remains **BLOCKED / CHANGES_REQUIRED**.
