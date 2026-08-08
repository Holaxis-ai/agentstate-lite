---
type: Context Note
title: Review portfolio bridge product analysis
actor: bridge-product-plan
timestamp: '2026-08-08T17:40:18.208Z'
---
# Summary

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** define a complete, bounded product and architecture contract for repairing the owning v0 selector parser, error correlation, and Review portfolio edge aggregation; this serves the ultimate goal by making exact identity and complete-evidence claims mechanically consistent from bundle through bridge and View.

## Product problem and user outcome

The current system is correct for the present 19-Review corpus but violates its reusable portfolio contract at two reachable boundaries. The Review query admits 500 rows while one `edges` selector array admits at most 32, so 33-500 Review IDs produce a parser failure. `BridgeService.handle` replies to every parse failure with `id: undefined`; the embedded client accepts replies only by pending request id, so the initial refresh can remain pending forever. Independently, the selector parser trims each scalar/array value and forwards the trimmed value to core. Core treats a nonblank concept ID as exact opaque identity and accepts leading/trailing whitespace, so a bridge request can receive a numerically complete graph for a different identity and falsely support standalone/effective currentness.

**Required user outcome:** a human opening the Review portfolio sees a terminating, accurately labeled snapshot for 0-500 Reviews. Every core-valid nonblank ID reaches `queryEdges` byte-for-byte; every admitted request receives a reply correlated to its request id; every graph batch is independently validated before aggregation; and any rejected, malformed, contradictory, capped, or partial batch keeps useful evidence visible but suppresses every currentness/effective-conclusion claim.

## Exact production evidence

- Current branch `fix/review-portfolio-bridge-identity` is clean and was cut from current `origin/main`; HEAD, merge-base, and `origin/main` were all `56b5693d9aa205d9d65d8513ca07642fcbf596dc` when inspected.
- `packages/view-runtime/src/bridge.ts:17-22` owns the limits: 128-byte request id, 1,024-byte selector, 32 selector values, 500 query rows, and 1,000 edge rows.
- `packages/view-runtime/src/bridge.ts:185-200` trims scalar and array selector entries and returns the trimmed values. `normalizeEdgeParams` at lines 202-217 admits only `from`, `to`, and `text`; the repair must not add fields.
- `packages/view-runtime/src/bridge.ts:220-268` is the one v0 parser. `BridgeService.handle` at lines 328-330 loses the request id on every parse failure. `execute` at lines 549-555 delegates admitted edges directly to core `queryEdges` and returns `{edges,count}`.
- `packages/core/src/paths.ts:65-89` uses `trim()` only to reject an all-whitespace ID and otherwise preserves the exact spelling. `packages/core/src/bundle.ts:392-418` validates exact canonical selectors/prefix markers and compares exact values. This is the owning identity contract and must not be narrowed.
- Reviewed View blob `pages/reviews.html` is `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`, 50,182 bytes. At lines 126 and 204-233 it queries up to 500 Reviews and sends every returned id in one outbound and one inbound request; strict single-result `resultShape` already requires a safe nonnegative integer count exactly equal to returned length and deduplicates exact `(from,to,text)` tuples. Lines 450-478 keep selected-record relation retry generation-guarded and fail closed. Registry `pages-registry/reviews` remains `access: bundle-read`, entry `pages/reviews.html`, with reviewed hash `sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`.
- The shipped `view-authoring-v0.md` contract admits only `edges.params.{from,to,text}`; `from`/`to` are exact scalar-or-array selectors; blank means omitted; arrays are union within a facet and both facets AND; `text` is exact; v0 is read-only; requests carry `bridge`, `type`, and `id`; Views remain sandboxed/exact-byte-approved and insert only unmodified shared-renderer HTML.
- Existing `packages/view-runtime/test/bridge.test.mjs` covers general exact-key parsing, authorization, polling, and document rendering, but has no edge selector identity/cardinality or invalid-request correlation table. The CLI query agreement suite covers `query`, not edge selector agreement. The durable regression therefore belongs first in view-runtime parser/service tests, plus an exact View harness routed through the real built parser/service.
- Root `npm run build` compiles view-runtime and bundles its source into the self-contained CLI. `npm run check` additionally runs typecheck, all workspace tests, script tests, the isolated npm-package proof, skill drift, MCP browser tests, and UI E2E. Dev/package `dist/` is ignored; the committed plugin bundle and plugin versions are bot-owned after merge and must not be hand-updated in this PR.
- The installed skill path advertised in session metadata (`1.0.147`) was absent; the fully read installed fallback was `1.0.154`. Near phase end, another shared-workspace process removed the previously available `packages/cli/dist/agentstate-lite.mjs`, so `./aslite` temporarily stopped resolving. The phase-start note was written with `./aslite`; final note update used the identical installed self-contained CLI rather than rebuilding or interfering with another phase. No sync occurred.

## Non-goals

- Do not narrow, normalize, slugify, or otherwise redefine core/OKF concept-ID grammar.
- Do not add a second ID codec or graph-query authority in bundle HTML; the View only chunks exact values and aggregates responses.
- Do not change v0 wire fields, add edge `limit`/pagination, raise the 32-value bound, change prefix/union/AND/text semantics, or alter v1 actions.
- Do not relax exact-key parsing, byte/cardinality bounds, launch authorization, exact-byte approval, CSP/sandbox, read-only capability, shared renderer, or generation fencing.
- Do not redesign Review/Review Request lifecycle, succession semantics, the 500-row Review query cap, selected-relation display cap, registry identity/access, folder locations, or CLI recovery grammar.
- Do not hand-edit generated `dist`, committed plugin bundle bytes, plugin manifest versions, or create/push a PR/main merge from this unit.

## Proposed acceptance criteria

### A. Exact selector identity and v0 compatibility

1. `parseBridgeRequest` retains the existing exact request keys and `edges` field grammar. No new field is accepted; scalar/array/prefix/union/AND/text semantics and the 32 supplied-value/1,024-byte bounds remain.
2. For each nonblank scalar or array entry, trimming is used only as a blank predicate; the exact original string is returned and its byte bound is evaluated on the exact returned value. Leading/trailing whitespace, internal whitespace, quotes, option-like prefixes, and ordinary IDs round-trip unchanged.
3. The shipped blank-as-omitted behavior is pinned explicitly: blank scalar selectors are omitted; within an admitted 1-32 element array, blank entries are omitted while nonblank entries remain exact; if none remain the facet is omitted. The cardinality guard applies to the supplied array before omission, so 33 supplied values remain invalid. Non-string entries remain invalid. This restores the documented grammar without expanding it.
4. Direct core `queryEdges` and `BridgeService` fixtures agree row-for-row for exact leading-space and trailing-space source/target IDs as well as ordinary/prefix cases. No core source or ID grammar changes are required.

### B. Error correlation and termination

5. If full parsing fails but the raw value is a plain valid v0 envelope with a bounded valid request id and string type, `BridgeService.handle` returns a v0 `USAGE` error with that exact id. A 33-selector request therefore rejects the client's pending Promise instead of stranding it.
6. Non-record input, wrong protocol, missing/invalid/oversized id, or otherwise invalid envelope never receives an invented/correlated id. Correlation extraction performs no launch resolution or bundle read and reveals no data. Valid request behavior and all authorization/revalidation paths are unchanged.
7. Tests exercise invalid extra fields, unknown type, 33 selectors, oversize selector/id, malformed envelope, and valid v1 behavior so v0 correlation hardening does not broaden the parser or regress action-host boundaries.

### C. Review portfolio batching and aggregation

8. The View partitions exact Review IDs deterministically into batches of at most 32 and issues both directions for every batch. Exact observable request counts are: 0 Reviews -> 0 edge requests; 1 -> 2; 32 -> 2; 33 -> 4; 500 -> 32. No empty selector array is emitted.
9. Every request emitted by the exact View parses through the real built `parseBridgeRequest`; every non-fire-and-forget request receives a same-id `edges:result` or `error` through `BridgeService`.
10. Every batch settles and is independently passed through the existing strict collection/count predicate before aggregation. Missing/non-array collections, missing/negative/fractional/infinite/unsafe counts, undercount, overcount, rejection, or host `TOO_LARGE` marks the graph incomplete.
11. Available rows may remain visible on a failed/partial batch, but `edgesKnown` is true only when the Review row query and every outbound/inbound batch are exact and complete. Any impairment sets `partial`, produces direction/batch-specific recovery text, and suppresses standalone/effective currentness.
12. Aggregate deduplication occurs only after batch validation and uses the exact `(from,to,text)` tuple. An edge matching both outbound and inbound directions or repeated across fixture responses renders once without masking any incomplete batch. Deterministic sorting/current succession behavior is preserved.
13. Whitespace-bearing Review IDs are transmitted exactly in their batch, matched to exact graph edges, retained as distinct from their trimmed spellings, and never gain false standalone currentness. Zero rows remain an empty complete graph without accidentally querying the whole bundle.
14. Existing selected-record relation behavior remains single-ID, strict-count, read-only, retryable, and `detailGeneration`-guarded. Batching does not add concurrent snapshot refreshes or weaken `Bridge.watch` serialization.

### D. Durable feedback and security regression

15. Committed view-runtime tests cover parser + service + core-edge agreement. The exact View harness covers 0/1/32/33/500, boundary-whitespace IDs, duplicate cross-direction edges, each bad count/shape, one rejected batch, and same-id correlated error. Fake bridge fixtures may supplement but cannot replace the real built parser/service path.
16. Red-before/green-after evidence is retained for the two owning defects: exact-ID mutation and 33-value uncorrelated rejection. The harness proves no fixture can label partial evidence current/effective.
17. Exact-source security checks continue to show `access: bundle-read`, no mutation/action/network/form path, no new HTML sink, only unmodified `render-document` HTML at the sole sink, metadata/ids/errors through text nodes, and unchanged source/protocol/pending-id checks.
18. Renewed exact-byte Review portfolio source/security review records the new View SHA, unchanged registry SHA/access, code commit SHA, parser/service provenance, and survived attacks. Scratch browser QA covers CSP/sandbox, exact-byte reapproval, hostile metadata, live create/update/delete, keyboard retry, selected-record removal, narrow layout, and inert shared rendering.

### E. Build, artifacts, review, and delivery

19. Targeted view-runtime tests, View harness, root build/typecheck/test, and final `npm run check` pass on the exact committed SHA; failure logs are bounded per repository policy. Packaging proof demonstrates the self-contained npm CLI contains the repaired view-runtime implementation.
20. The feature branch contains only coherent source/tests/reference changes that are actually required. `packages/*/dist` stays uncommitted. The PR does not hand-bump plugin manifests or rebuild/commit the bot-owned plugin bundle; after merge, the main bot is expected to regenerate/bump those distributed bytes atomically. Any reference clarification must preserve grammar and flow through the repository's authoritative-copy/drift workflow, not ad hoc plugin edits.
21. The source/test unit is committed descriptively and pushed on `fix/review-portfolio-bridge-identity`; no AI attribution. Independent code review approves the exact pushed SHA before any QA begins. Any fix produces a new SHA and restarts review.
22. The candidate View is tested in a scratch bundle against the branch-built host. Live `pages/reviews.html` promotion uses hard CAS from `sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`, reads back/verifies the new hash, leaves the registry unchanged unless separately justified, and is synchronized only at the rollout point described below.
23. Immutable approval/QA records bind code SHA + View SHA + registry SHA + gate outputs. Board records are synchronized through `aslite sync`; code ships only by pushed feature branch and a paste-ready PR title/body for the human to open. The agent does not create the PR or merge/push main.

## Proposed task DAG and parallelism

1. **Contract/plan review** — depends on this analysis; product owner + architecture/security reviewers approve the acceptance table and rollout sequence.
2. **Source Builder** — depends on 1; changes the owning selector parser/error-correlation primitive and committed view-runtime tests.
3. **View Builder + harness** — depends on 1 and may run in parallel with 2; transforms the exact reviewed View into <=32 batching and exercises exact-source fixtures in a scratch bundle. It does not promote live bytes yet.
4. **Integration/convergence** — depends on 2 and 3; root-build the branch, route every exact View request through the built parser/service/core path, run threshold/identity/failure fixtures, compute candidate View SHA, and ensure tracked diff contains only authorized files.
5. **Commit + push + full machine gate** — depends on 4; commit/push the coherent source/test unit, run `npm run check` on that exact SHA, and loop to 2/3 if any change is needed.
6. **Independent code review** — depends on 5; review the exact pushed SHA, audit red/green test provenance and built/package behavior. This is a hard dependency for every QA node.
7. **Exact View source/security review** — depends on 4/5 and may run in parallel with 6; review the candidate View SHA paired with the code SHA and unchanged registry SHA.
8. **Adversarial QA lanes** — depend on both 6 and 7 being approved (therefore code review is before QA): (a) parser/service/packaging/cardinality/error-correlation attacks; and (b) scratch portability/browser/trust/accessibility/live-update attacks. These two QA lanes may run in parallel and both report exact subject identities.
9. **Feature-branch handoff** — depends on 8; push any final reviewed commit, provide paste-ready PR title/body, and sync only the task/context/review records authorized for feature-branch handoff. Human opens/merges the PR.
10. **Compatible-runtime rollout + live View promotion** — depends on 8 plus an explicit compatible-host availability decision (normally merge plus bot-regenerated distribution). CAS-promote the exact approved View, verify bytes/registry, write immutable approval/QA addenda, and sync the board. Do not expose the repaired View as safe under a host version that still trims IDs.

## Open questions / explicit rollout decision

1. **Live View sequencing is the only material open decision.** The candidate View can be completely tested in a scratch bundle against branch-built bytes, but promoting it to the shared board before a compatible host is distributed leaves old installed hosts able to trim boundary-whitespace IDs. Recommended default: keep the candidate in scratch through feature-branch review/QA, then promote after merge and bot-produced compatible bytes are available. If the user wants pre-merge live promotion, that needs an explicit rollout mechanism that guarantees compatible host bytes; a View-local identity codec is forbidden.
2. Publishing the already-enforced 32-value/1,024-byte selector bounds in the shipped authoring reference would improve discoverability without changing grammar. It is useful but not necessary to the behavioral fix; include it in this coherent PR only if the repository owner treats bound documentation as part of the protocol contract and the synchronized reference copies can be updated through their existing drift workflow.

## Confidence

**High (0.94).** The two failures, owning authorities, limits, host adapters, embedded client correlation rule, exact View bytes, build/distribution path, and missing test coverage were all directly inspected and agree with two independent empirical security records. Residual uncertainty is limited to rollout timing, not the repair mechanics or acceptance oracle.
