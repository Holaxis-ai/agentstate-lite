---
type: Plan
title: Repair Review portfolio bridge identity and scale
actor: codex-orchestrator
timestamp: '2026-08-08T17:46:09.800Z'
---
# Goals and decision

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** repair the owning v0 selector parser and the Review portfolio graph aggregation so 0–500 open-world Reviews produce a terminating, evidence-honest projection without identity normalization; this serves the ultimate goal by keeping bundle, core, bridge, packaged CLI, and View on one exact identity contract.

This is a compatibility and reliability repair, not a protocol expansion. The implementation will preserve current parser grammar and bounds, preserve exact nonblank selector bytes, correlate invalid v0 requests only from a bounded client-supplied envelope, batch the project-neutral View at the documented host bound, and suppress currentness whenever any required batch is incomplete. The live shared View will not be promoted until a compatible host is available; candidate bytes will be tested and reviewed in scratch first.

# Domain model and invariants

| Term | Owning layer | Invariant |
| --- | --- | --- |
| Concept ID | OKF/core | A safe nonblank ID is opaque and exact. Validation may use trimming to detect all-whitespace input but must not return a normalized identity. |
| Edge selector | view-runtime v0 parser | `from`/`to` is an exact string or a supplied array of 1–32 exact strings; each supplied value is 1–1,024 UTF-8 bytes and not all whitespace. Absent means unrestricted. Prefix, union-within-facet, cross-facet AND, and exact `text` semantics remain owned by core. |
| Correlatable invalid request | BridgeService ingress | A rejected request may echo an id only when the raw value is a plain v0 envelope with a bounded valid client id and string type. Correlation does not admit, authorize, read, or disclose request data. |
| Complete batch | Review View | One fulfilled response whose `edges` is an array and whose `count` is a finite nonnegative safe integer exactly equal to that array length. |
| Complete graph | Review View | Review rows are complete and every required outbound/inbound batch is complete. Aggregation and deduplication never repair a bad batch. |
| Effective conclusion | Review View | May be asserted only from a complete, current, uncapped Review row set and complete bidirectional graph. |
| Compatible rollout | distribution + board | Candidate View bytes are safe to promote only when the host serving them preserves exact selectors and returns correlated invalid-v0 errors. |

# Problem and evidence

The current View queries up to 500 Reviews but emits one `from` and one `to` array. The v0 parser admits at most 32 supplied selector values, so 33–500 records are rejected. `BridgeService.handle` currently drops the valid request id on parse failure, while the embedded client settles only a matching pending id; startup can hang. Separately, the parser trims scalar and array selectors before calling core. Core intentionally preserves boundary whitespace in otherwise-safe IDs, so the bridge can query a different identity while returning numerically complete evidence and enable false currentness.

The current exact subjects are:

- source base: `56b5693d9aa205d9d65d8513ca07642fcbf596dc` on `fix/review-portfolio-bridge-identity`;
- View: `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`;
- registry: `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`;
- source/security blocker: `context-notes/architecture-review-alignment-view-source-security-review`.

The shipped authoring prose says empty/blank selectors are omitted, but the implementation rejects every supplied empty/all-whitespace scalar or array entry. Because treating a rejected facet as omitted can broaden a query to the whole graph, this repair preserves the existing executable grammar and corrects the prose. Any future blank-as-omitted behavior requires a separate protocol decision and security review.

# Acceptance criteria

## Exact selector and service behavior

1. Parser request keys, v0 fields, 32 supplied-value bound, 1,024-byte raw UTF-8 bound, and core prefix/union/AND/text semantics are unchanged.
2. Every admitted nonblank scalar/array selector reaches core byte-for-byte, including boundary/internal whitespace, quotes, newlines, UTF-8, and option-like strings. Byte bounds apply to the exact raw value.
3. Supplied empty/all-whitespace scalars, empty arrays, arrays containing an invalid entry, non-string entries, and 33-value arrays remain invalid. Thirty-two duplicate values remain valid and are not used to bypass the supplied-cardinality bound.
4. Core and bridge fixtures distinguish ordinary, leading-space, and trailing-space IDs and return only their exact edges. Duplicate/overlapping selectors do not multiply literal core edges.
5. A full-parse failure with a plain `bridge:"v0"` envelope, a string `type`, and a valid 1–128-byte id returns the generic `USAGE` error with that exact id. Wrong/missing protocols, malformed records, or missing/non-string/oversize ids remain uncorrelated. Correlation performs no launch lookup or bundle work and does not echo payload/type/details.
6. Valid v0/v1 requests, action-protocol denial, launch authorization/revalidation, reply limits, and read-only behavior remain unchanged.

## Review View behavior

7. Exact Review IDs are partitioned deterministically into sequential batches of at most 32 for each direction. Counts are: 0 Reviews → 0 edge requests; 1 → 2; 32 → 2; 33 → 4; 500 → 32. No empty array is emitted.
8. Sequential execution bounds instantaneous CPU/memory/reply pressure and stops issuing later graph batches after a failed/invalid batch. Every emitted request parses through the branch-built real parser. Refresh generation/watch serialization remains intact.
9. Every batch is validated independently before aggregation. Rejection, `TOO_LARGE`, missing/non-array edges, missing/negative/fractional/infinite/unsafe count, undercount, or overcount terminates the refresh with graph incompleteness, visible batch/direction recovery text, and no effective/standalone currentness.
10. Rows from validated batches may remain visible. Aggregate deduplication happens only after validation and removes only an exact `(from,to,text)` collision observed from overlapping outbound/inbound coverage; different text remains a distinct literal edge. Tests must prove deduplication cannot hide incomplete or contradictory counts.
11. Whitespace-bearing IDs remain distinct from trimmed spellings through batching, graph matching, detail selection, and succession. Zero rows synthesize a complete empty graph without a broad edge query.
12. Existing selected-record relation fetching, generation guard, shared renderer sink, caps, open-valued metadata/relations, arbitrary paths/types, ambiguity handling, CSP/sandbox, and read-only registry grant are unchanged.

## Feedback, artifacts, and delivery

13. Red-before/green-after evidence pins core exact identity, parser raw-byte/cardinality behavior, service/core agreement, and same-id invalid-request correlation before production edits.
14. A durable exact-View harness runs the pulled candidate bytes with the real built parser/service/core for 0/1/32/33/500 and a parser-validating fault broker for every degraded batch shape. Every asynchronous case has a deadline so liveness failures are observable.
15. One actual sandboxed host/browser regression proves a valid-id invalid v0 request settles with a correlated error; scratch browser QA proves exact-byte approval, CSP/sandbox, hostile metadata inertness, live add/update/delete, selection removal, retry/watch serialization, keyboard/narrow layout, and reapproval on byte change.
16. Authoring reference sources explicitly document the existing 1–32/raw-1,024/nonblank contract. All authoritative example copies remain byte-identical and only the npm projection is regenerated. No committed plugin bundle, plugin skill tree, manifest/version, or ignored `dist` output is included.
17. Targeted tests, root build/typecheck/test, npm packaging proof, skill drift check, UI/MCP gates, and final `npm run check` pass on the exact committed SHA.
18. Independent exact-SHA code review and exact View source/security review both approve before QA. Any repair changes the SHA and restarts those reviews. Immutable records bind code SHA, candidate View SHA, unchanged registry SHA, commands, and verdicts.
19. The feature branch is pushed with no AI attribution and delivered with paste-ready PR title/body. No PR or main merge is created by the agent.
20. Live View promotion is a separate CAS rollout gate after compatible host availability is proven. Until then the current View remains explicitly known-limited; candidate bytes and review evidence persist without claiming deployment.

# Implementation DAG

| Step | Deliverable | Role | Depends on | Parallelism |
| --- | --- | --- | --- | --- |
| A. Contract approval | This Plan plus specialist/skeptic approvals, including blank-selector and rollout decisions. | Orchestrator, product, testing, security skeptic | research notes | Fan-out review, then one synthesis. |
| B. Feedback-first host repair | Add failing core and view-runtime tests; implement exact selector preservation and bounded invalid-v0 correlation; update authoritative reference sources and npm projection. | Host Builder | A | Parallel with C after shared contract is frozen. |
| C. Feedback-first View repair | Pull exact View; add a durable task-scoped exact-byte harness; make sequential ≤32 bidirectional batching, strict per-batch validation, failure short-circuit, and exact post-validation aggregation. Produce candidate bytes only. | View Builder | A | Parallel with B; must consume no private host constant other than documented v0 contract. |
| D. Integration | Build branch host; run candidate through real parser/service/core at all thresholds and fault cases; reconcile source/reference/harness; verify tracked diff and candidate/registry hashes. | Integrator | B, C | None. |
| E. Commit, push, machine gate | Descriptive feature commit and push; full `npm run check` on exact SHA; bounded logs retained. | Orchestrator | D | None. Any change loops to B/C. |
| F. Independent review | Exact-SHA code/architecture review and exact-byte View security review. | Reviewer + security reviewer, neither Builder | E | Two reviews in parallel. Both are hard gates. |
| G. Adversarial QA | Clean-worktree parser/service/package tests plus scratch-bundle in-app browser/portability/accessibility/trust tests. | QA roles, neither Builder nor Reviewer | F approvals | QA lanes may run in parallel. |
| H. Handoff and state closure | Immutable implementation Review/addendum, Task outcomes, branch push, board sync, paste-ready PR material, and explicit deferred-rollout record. | Orchestrator | G | None. |
| I. Compatible-runtime rollout | After human merge/distribution confirmation, CAS-promote exact approved candidate over the known View hash, verify readback/registry, browser-smoke live bytes, and sync rollout addendum. | Release owner + QA | H and compatible host | Separate future gate; not inferred from source completion. |

# Test matrix and gates

- Core identity: ordinary/internal/leading/trailing/UTF-8/quote/option-like accepted exactly; empty/all-whitespace rejected; exact and prefix selectors remain distinct; duplicates do not multiply edges.
- Parser: both facets, scalar/array, raw UTF-8 at 1,024/1,025 bytes, 1/32/33 values, duplicates, invalid entries, exact round trip.
- Service: exact whitespace IDs; valid request agreement; invalid extra key/unknown type/33 values/oversize selector with correlated v0 id; malformed/wrong-protocol/oversize-id uncorrelated; zero launch calls for parse failures.
- View scale: 0/1/32/33/500 with exact batch composition, bounded completion, and whitespace IDs.
- View faults: rejection, host `TOO_LARGE`, non-array, every invalid count class, under/overreport, cross-direction duplicate, distinct text, successor chain spanning batches, later-refresh failure, stale detail generation.
- Trust and portability: minimal/open-valued Review records, arbitrary relation text and paths, cycles/dangling targets, HTML-like metadata, CSP/sandbox, shared renderer only, live mutation, keyboard and narrow layout.

Focused commands precede full gates; final commands run from a clean exact-SHA worktree after `npm ci`:

```sh
npm run build
node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/pure.test.ts ./packages/core/test/query-edges.test.ts
npm test -w @agentstate-lite/view-runtime
REVIEW_PORTFOLIO_VIEW_HTML=<candidate> node --test <durable-view-harness>
npm run e2e:gate -w @agentstate-lite/ui
npm run check
```

# Security, reliability, flexibility, and rollback

- No grammar/limit expansion, ID normalization, View-local codec, pagination protocol, write capability, network path, HTML sink, closed Review schema, or project-specific identifier is introduced.
- Sequential batching trades some latency for bounded load and deterministic failure. The 500-row cap yields at most 32 edge requests; each host reply remains capped at 1,000 edges and 2 MiB. A future protocol may offer paging, but this View does not invent it.
- Correlated parse errors echo only an already supplied bounded id and one generic constant message; malformed requests never reach launch authorization or bundle access.
- Open OKF content stays visible: unknown metadata, relation labels, record paths, and graph ambiguity are preserved; only effective-currentness inference fails closed.
- Rollback for source is branch reversion before merge or a normal revert after merge. Rollback for candidate View is non-promotion; after live promotion, CAS restore the exact prior View bytes only with an explicit compatibility/security assessment. Registry identity/access is unchanged.

# Stopping rule

Stop this feature-branch unit when the exact code SHA and candidate View SHA pass both independent reviews and all QA gates, immutable evidence is synchronized, and the human has a pushed branch plus PR text. Do not claim the live View repaired until the compatible-runtime rollout gate completes.
