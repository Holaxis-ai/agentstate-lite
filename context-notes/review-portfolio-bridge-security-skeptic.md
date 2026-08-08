---
type: Context Note
title: Review portfolio bridge security skeptic
actor: bridge-security-skeptic
timestamp: '2026-08-08T17:44:38.164Z'
---
# Summary

## Result Envelope

- **status:** COMPLETE
- **repair-shape verdict:** PLAN_CHANGES_REQUIRED; conditionally approve the shared owning-layer exact-selector and bounded-error-correlation repairs, but reject naive batching or View-first rollout.
- **confidence:** high on parser/core/service findings; medium-high on aggregate resource policy because the exact performance budget is a product choice, although an explicit budget is security-required.
- **review subject:** main/source at `56b5693d`; `packages/view-runtime/src/bridge.ts` SHA-256 `1430be3af30e830ddd862ecfede9e7d9a494a5bdb63921c55641bff7fa941325`; Review View SHA-256 `70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea` (`50,182` bytes).

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** adversarially determine the smallest owning-layer and Review-View repair that preserves exact selector identity, correlates invalid-envelope failure, and bounds request/response work; this serves the ultimate goal by preventing a trusted read projection from manufacturing false graph truth or becoming a denial-of-service amplifier.

## Findings by severity

### HIGH — trimming can widen one exact identity into a namespace prefix

Core accepts nonblank IDs verbatim (`assertSafeConceptId` uses trim only for blank detection). `queryEdges` treats only a value whose actual final character is `/` as a prefix; otherwise it compares exact strings. The bridge currently trims `from`/`to` selectors before core sees them. A real parser/core probe proved:

- core `queryEdges({from: "reviews/ "})` matched only the exact document `"reviews/ "`;
- core `queryEdges({from: "reviews/"})` matched every `reviews/*` source;
- `parseBridgeRequest(...{from:"reviews/ "})` returned `"reviews/"`.

This is a selector-class change, not cosmetic normalization. It can over-return graph rows and allow a complete response for the wrong evidence universe. The owning parser must preserve the original exact nonblank string and apply its byte limit to the original bytes. Required fixtures include `"reviews/ "`, leading/trailing Unicode whitespace, `" /abs"`, quotes, option-like prefixes, 1,024/1,025 UTF-8-byte boundaries, single values, and arrays.

The same exact-match defect exists for `params.text`: core preserves Markdown link label text and compares it exactly, while the bridge trims it. A real probe found core matched `"  succeeds review  "`, did not match `"succeeds review"`, and the bridge normalized the former to the latter. Fixing `text` in the same edge-selector repair is necessary, not scope creep. Do not normalize Unicode, case, slash spelling, or whitespace.

### HIGH — selector batching otherwise multiplies the work and row boundary

Every `Bridge.edges` call invokes core `queryEdges`, which performs a whole-bundle document/body scan before the service checks the 1,000-edge limit. Over `RemoteBackend`, that is a paged list plus a full `readMany` body transfer. At 500 Reviews, 32-value outbound/inbound chunking emits 32 whole-bundle scans per refresh. Parallel `Promise.allSettled` over all chunks would create an avoidable local/remote CPU, memory, and bandwidth burst; accepting 1,000 rows per chunk would silently expand the former per-direction result boundary to 16,000.

Required plan changes:

1. Run edge batch requests sequentially (maximum in-flight edge request one), with each selector array at most 32 and a fixed maximum of 32 calls for 500 Review ids.
2. Validate one batch's array and exact finite nonnegative safe-integer count before retaining any rows or issuing dependent conclusions.
3. Stop on the first rejection/invalid/contradictory batch and mark the graph incomplete; do not continue spending work once currentness is already impossible.
4. Define an explicit cumulative View graph budget. The security-preserving default is at most 1,000 accepted rows per direction, matching the former host boundary; crossing it stops further batches, produces an incomplete notice, and suppresses currentness. This is a View work budget, not a change to v0.
5. Retain at most the budgeted rows. Per-reply 2 MiB checking alone is insufficient because it occurs after core materializes a result and does not bound cumulative batching.

The pre-existing lack of core early-abort/indexing and the shared client timeout are residual risks, not reasons to add a new protocol or graph implementation here.

### HIGH — invalid requests with a valid v0 id strand the shipped client

`BridgeService.handle` discards the id when full request parsing fails. A 33-selector probe produced a generic `USAGE` reply with no `id`; the shipped client ignores it and leaves the Promise pending.

Add one bounded envelope extractor beside the full parser, reusing the existing byte-counted `requestId` helper. It may recover an id only when the top-level value is a plain record with `bridge === "v0"` and a nonempty request id of at most 128 UTF-8 bytes. The error remains static/generic and must not serialize the raw payload, parser reason, bundle state, or launch state. Oversize/missing ids and non-v0/malformed envelopes remain uncorrelated. Do not create a second request codec and do not broaden v1 behavior silently.

Tests must prove invalid params, unknown fields, and 33 selectors reject the matching client Promise; a 128-byte id correlates, a 129-byte id does not; authorization/data resolution is not needed to formulate the generic syntax error; and ordinary valid replies are byte-shape compatible.

### MEDIUM — blank-selector prose contradicts the safer implemented behavior

The shipped reference says an empty/blank selector is treated as omitted. The implementation rejects a supplied blank string/blank array entry; only an absent facet is omitted. Changing supplied blank to omitted would turn a selector error into an unfiltered whole-graph query, increasing disclosure and work and making a typo fail open.

Security decision: preserve rejection for every supplied empty/all-whitespace scalar and every blank array entry. Omission is represented only by omitting `from`/`to`. Update the authoritative reference in the same source unit to state this explicitly and regenerate copies through the documented workflow. Do not filter blank array entries, because an all-blank array could otherwise become an unfiltered facet.

### MEDIUM — exact-identity claims must be narrower than this repair

`normalizeQueryParams.prefix` also trims an identity-bearing prefix, and the probe changed `"reviews/ "` to `"reviews/"`. Core link emission/resolution also has broader whitespace limitations (`relativeHref` trims targets; the Markdown href grammar excludes spaces). These are real pre-existing parity gaps, but the Review View does not issue prefix queries and repairing the link grammar is a separate, larger contract decision.

Do not silently add those changes here. Either record a separate follow-up or narrow the PR/task claim to exact **edge selectors used by the Review portfolio**. Do not claim universal cross-surface whitespace-ID parity after this unit.

## Aggregation and deduplication criteria

- Construct disjoint 32-value chunks from exact Review row ids without trimming or canonicalization. A malformed duplicate/non-string Review id should fail closed rather than be silently normalized.
- Validate every batch independently before aggregation. Missing arrays/counts, unequal count/length, unsafe/fractional/negative counts, rejection, or budget overflow makes `edgesKnown:false` and suppresses all effective/standalone currentness.
- Sum per-direction counts only from validated batches and before deduplication.
- Deduplicate only after all admitted batches are validated, using the exact `(from,to,text)` triple. Cross-direction duplication is expected. Deduplication must never be used to repair a contradictory count or to make an incomplete direction complete.
- Harness cases: 0/1/32/33/500 Reviews; exact whitespace IDs; 33 gives four valid calls and 500 gives 32; maximum in-flight one; one bad middle batch stops later calls; cumulative-budget crossing fails closed; duplicate outbound/inbound triples render once; ordinary <=32 corpus output remains behaviorally unchanged.

## Backward compatibility, rollout, and rollback

Exact preservation is a corrective behavior change: callers that accidentally relied on trimming will now address the exact padded selector (often yielding no match) rather than an unpadded identity/prefix. That is required by the documented exact-match contract and must be release-noted/tested. Valid ordinary selectors and reply shapes remain unchanged; correlated `USAGE` adds only the id clients already expect.

Rollout order is a blocking gate:

1. Merge/release the parser + correlated-error + reference/test repair and independently review/QA it.
2. Prove the actual web and MCP host bytes used to launch the View contain that repair.
3. Only then promote the new batched View bytes, require exact-byte reapproval, rerun source/security review, and perform scratch/browser QA.

Promoting the View first leaves whitespace IDs normalized by an old host. V0 `hello` has no implementation-version signal, so a portable shared bundle cannot self-prove host readiness. If old hosts may consume the shared board, withhold the View rollout or explicitly require their upgrade; do not add a View-side trim guard/identity codec. If the source repair is rolled back after View rollout, stop/unapprove the View until the host repair is restored. The prior View is not a safe rollback for 33+ or whitespace IDs.

Non-goals: no selector limit increase; no v0 grammar/pagination/batch verb; no core ID narrowing; no View identity codec; no link resolver/emitter rewrite; no trust/access/registry change; no ad hoc timeout without cancellation; no claim that the post-materialization 2 MiB check bounds backend scan cost.

## Disclosure

No new private disclosure material was found. The defects are already documented on the public project board/source and affect integrity/availability of an exact-byte-approved, bundle-read View; no credential exposure, cross-origin escape, mutation authority, or code execution path was found. Treat hostile shared-bundle data as capable of triggering the failure, but keep remediation prose generic and avoid adding unnecessary exploit payloads to public release notes.

## Evidence and phase end

Read `CLAUDE.md`, `docs/core`, the task/system/security notes, the shipped View authoring v0 reference, parser/service/core/link source and tests, and the exact View. Real in-memory probes reproduced exact-to-prefix widening, exact link-text normalization, query-prefix normalization, 33-selector rejection, and an uncorrelated service error. No source, Plan, Task, artifact, or sync mutation was performed. The only persistent mutation is this required Context Note.
