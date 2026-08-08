---
type: Plan
title: Repair Review portfolio bridge identity and scale
actor: codex-orchestrator
timestamp: '2026-08-08T17:53:00.070Z'
---
# Goals and decision

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** repair the owning v0 selector parser and the Review portfolio graph aggregation so 0–500 open-world Reviews produce a terminating, evidence-honest projection without identity normalization; this serves the ultimate goal by keeping bundle, core, bridge, packaged CLI, and View on one exact identity contract.

This is a compatibility and reliability repair, not a protocol expansion. The implementation will preserve current parser grammar and bounds, preserve exact nonblank `from`/`to`/`text` bytes, correlate invalid v0 requests only from a bounded client-supplied envelope, batch the project-neutral View at the documented host bound, and suppress currentness whenever any required batch is incomplete. The live shared View will not be promoted until a compatible host is available; candidate bytes will be tested and reviewed in scratch first.

# Domain model and invariants

| Term | Owning layer | Invariant |
| --- | --- | --- |
| Concept ID | OKF/core | A safe nonblank ID is opaque and exact. Validation may use trimming to detect all-whitespace input but must not return a normalized identity. |
| Edge selector | view-runtime v0 parser | `from`/`to` is an exact string or a supplied array of 1–32 exact strings; `text` is one exact string. Every supplied value is 1–1,024 raw UTF-8 bytes and not all whitespace. Only an absent `from`/`to` facet means unrestricted. Prefix, union-within-facet, cross-facet AND, and exact relation-text semantics remain owned by core. |
| Correlatable invalid request | BridgeService ingress | A rejected request may echo an id only when the raw value is a plain v0 envelope with a bounded valid client id and string type. Correlation does not admit, authorize, read, or disclose request data. |
| Complete batch | Review View | One fulfilled response whose `edges` is an array and whose `count` is a finite nonnegative safe integer exactly equal to that array length. |
| Complete graph | Review View | Review rows are complete and every required outbound/inbound batch is complete. Aggregation and deduplication never repair a bad batch. |
| Effective conclusion | Review View | May be asserted only from a complete, current, uncapped Review row set and complete bidirectional graph. |
| Compatible rollout | distribution + board | Candidate View bytes are safe to promote only when the host serving them preserves exact selectors and returns correlated invalid-v0 errors. |

# Problem and evidence

The current View queries up to 500 Reviews but emits one `from` and one `to` array. The v0 parser admits at most 32 supplied selector values, so 33–500 records are rejected. `BridgeService.handle` currently drops the valid request id on parse failure, while the embedded client settles only a matching pending id; startup can hang. Separately, the parser trims scalar/array `from`/`to` selectors and `text` before calling core. Core intentionally preserves boundary whitespace in otherwise-safe IDs and compares relation text exactly, so the bridge can query a different identity or relation while returning numerically complete evidence and enable false currentness.

The current exact subjects are:

- source base: `56b5693d9aa205d9d65d8513ca07642fcbf596dc` on `fix/review-portfolio-bridge-identity`;
- View: `pages/reviews.html@sha256:70ee30c9a5842ba8e1bb2192ede66c002ef1d5f78efe5e8d52ababc5612788ea`;
- registry: `pages-registry/reviews@sha256:62f969b707852237da17b789b51e0a45a31977e02bb1d275f80dd1d7209d2c03`;
- source/security blocker: `context-notes/architecture-review-alignment-view-source-security-review`.

The shipped authoring prose says empty/blank selectors are omitted, but the implementation rejects every supplied empty/all-whitespace scalar or array entry. Because treating a rejected facet as omitted can broaden a query to the whole graph, this repair preserves the existing executable grammar and corrects the prose. Any future blank-as-omitted behavior requires a separate protocol decision and security review.

# Acceptance criteria

## Exact selector and service behavior

1. Parser request keys, v0 fields, 32 supplied-value bound, 1,024-byte raw UTF-8 bound, and core prefix/union/AND/exact-text semantics are unchanged. This unit claims v0 edge-selector parity only; known `query.prefix` and Markdown-link whitespace behavior are separate follow-ups, not silently bundled here.
2. Every admitted nonblank `from`, `to`, and `text` value reaches core byte-for-byte, including boundary/internal whitespace, quotes, newlines, UTF-8, and option-like strings. Byte bounds apply to the exact raw value. An exact `to: "reviews/ "` regression proves a boundary-space id is not reinterpreted as the `reviews/` prefix selector.
3. Supplied empty/all-whitespace scalars, empty arrays, arrays containing an invalid entry, non-string entries, and 33-value arrays remain invalid. Thirty-two duplicate values remain valid and are not used to bypass the supplied-cardinality bound.
4. Core and bridge fixtures distinguish ordinary, leading-space, and trailing-space IDs and return only their exact edges. Duplicate/overlapping selectors do not multiply literal core edges.
5. A full-parse failure with a plain `bridge:"v0"` envelope, a string `type`, and an id accepted by the existing 1–128-byte `requestId` primitive returns the generic v0 `USAGE` error with that exact id. Wrong/missing protocols, every v1 envelope, malformed records, or missing/non-string/oversize ids remain uncorrelated. Correlation performs no launch lookup or bundle work and does not echo payload/type/details or create a second id parser.
6. Valid v0/v1 requests, action-protocol denial, launch authorization/revalidation, reply limits, and read-only behavior remain unchanged.

## Review View behavior

7. Before graph requests, every Review row id must be a distinct exact string satisfying the v0 nonblank/raw-1,024-byte transport contract. A malformed or exact-duplicate id makes graph evidence incomplete and emits no broad/invalid request; safe Review rows may still render without currentness.
8. Exact Review IDs are partitioned deterministically into sequential batches of at most 32 for each direction. Counts for successful complete graphs are: 0 Reviews → 0 edge requests; 1 → 2; 32 → 2; 33 → 4; 500 → 32. No empty array is emitted. Maximum graph-request concurrency is one, and later batches stop after the first rejected, malformed, contradictory, or over-budget response.
9. Sequential execution bounds instantaneous CPU/memory/reply pressure. Each direction has a cumulative accepted budget of 1,000 rows, preserving the pre-batching host exposure bound rather than multiplying it by 16; exceeding it marks the graph incomplete and stops further batches. Every emitted request parses through the branch-built real parser. Refresh generation/watch serialization remains intact.
10. Every batch is validated independently before any rows from it are retained. Rejection, `TOO_LARGE`, missing/non-array edges, missing/negative/fractional/infinite/unsafe count, undercount, or overcount terminates the refresh with graph incompleteness, visible batch/direction recovery text, and no effective/standalone currentness.
11. Rows from already validated batches may remain visible. Aggregation happens only after validation and treats each direction as an exact tuple multiset: for every `(from,to,text)`, retain the maximum outbound/inbound multiplicity, not the sum and not a Set. This removes cross-direction overlap while preserving repeated identical literal links; different text remains distinct. Tests prove aggregation cannot hide incomplete/contradictory counts or erase multiplicity.
12. Whitespace-bearing IDs and exact relation text remain distinct from trimmed spellings through batching, graph matching, detail selection, and succession. Zero rows synthesize a complete empty graph without a broad edge query.
13. Existing selected-record relation fetching, generation guard, shared renderer sink, caps, open-valued metadata/relations, arbitrary paths/types, ambiguity handling, CSP/sandbox, and read-only registry grant are unchanged.

## Feedback, artifacts, and delivery

14. Red-before/green-after evidence pins core exact identity/text, parser raw-byte/cardinality behavior, service/core agreement, same-id v0 invalid-request correlation, malformed/duplicate Review ids, request concurrency/budget, and multiset aggregation before production edits.
15. A durable exact-View harness is retained as the unregistered bundle blob `artifacts/review-portfolio-bridge-harness.mjs`; candidate bytes are retained separately and inertly as `artifacts/review-portfolio-bridge-candidate.html`. The harness runs those exact candidate bytes with the real built parser/service/core for 0/1/32/33/500 and a parser-validating fault broker for every degraded batch shape. Ordinary Node and browser settlement has a 5-second per-case deadline; the 500-Review real-authority case has a 15-second deadline. Timeout receipts name every pending request id with direction and batch index.
16. One actual sandboxed host/browser regression proves a valid-id invalid v0 request settles with a correlated error; scratch browser QA proves exact-byte approval, CSP/sandbox, hostile metadata inertness, live add/update/delete, selection removal, retry/watch serialization, keyboard/narrow layout, and reapproval on byte change.
17. Authoring reference sources explicitly document the existing 1–32/raw-1,024/nonblank/exact-text contract. All authoritative example copies remain byte-identical and only the npm projection is regenerated. No committed plugin bundle, plugin skill tree, manifest/version, or ignored `dist` output is included.
18. Targeted tests, root build/typecheck/test, npm packaging proof, skill drift check, UI/MCP gates, and final `npm run check` pass on the exact committed SHA.
19. Independent exact-SHA code review and exact View source/security review both approve before QA. Any repair changes the SHA and restarts those reviews. Immutable records bind code SHA, candidate View SHA, unchanged registry SHA, commands, and verdicts.
20. The feature branch is pushed with no AI attribution and delivered with paste-ready PR title/body. No PR or main merge is created by the agent.
21. At integration, the harness and candidate are promoted to those inert blob keys, read back, hash-verified, linked from the implementation evidence, and retained through board sync. Their literal replay is:

    ```sh
    ./aslite pull --doc-key artifacts/review-portfolio-bridge-harness.mjs --out /private/tmp/review-portfolio-bridge-harness.test.mjs
    ./aslite pull --doc-key artifacts/review-portfolio-bridge-candidate.html --out /private/tmp/review-portfolio-bridge-candidate.html
    REVIEW_PORTFOLIO_VIEW_HTML=/private/tmp/review-portfolio-bridge-candidate.html node --test /private/tmp/review-portfolio-bridge-harness.test.mjs
    ```

22. Live View promotion is a separate host-first, View-second CAS rollout gate after the released/installed host identity and behavior are verified. Until then the current View remains explicitly known-limited; candidate bytes and review evidence persist without claiming deployment. Promotion changes the exact bytes and therefore requires the normal exact-byte reapproval before live smoke.

# Implementation DAG

| Step | Deliverable | Role | Depends on | Parallelism |
| --- | --- | --- | --- | --- |
| A. Contract approval | This Plan plus specialist/skeptic approvals, including blank-selector and rollout decisions. | Orchestrator, product, testing, security skeptic | research notes | Fan-out review, then one synthesis. |
| B1. Host red gates | Add and run failing core identity/exact-text, view-runtime parser/service/v0-correlation, and actual-host projection regressions, including `to:"reviews/ "`. Preserve the failing receipts before production edits. | Host Test Builder | A | Parallel with C1. |
| B2. Host repair | Implement exact `from`/`to`/`text` preservation and bounded invalid-v0 correlation; update authoritative reference sources and npm projection until B1 is green. | Host Builder | B1 | Parallel with C2. |
| C1. View red harness | Pull exact View; create the exact-blob harness at the declared durable key and reproduce 33/500 liveness/cardinality, exact-ID/text, malformed/duplicate row-id, 1,000-row budget, multiset, and fault-currentness failures before changing candidate bytes. Preserve failing receipts. | View Test Builder | A | Parallel with B1. |
| C2. View repair | Make one-in-flight sequential ≤32 bidirectional batching, row-id validation, strict per-batch validation, cumulative per-direction budget/failure short-circuit, and exact multiset-max aggregation. Produce inert candidate bytes until C1 is green. | View Builder | C1 | Parallel with B2; consumes no private host constant other than the documented v0 contract. |
| D. Integration | Build branch host; run candidate through real parser/service/core at all thresholds and fault cases with declared deadlines; promote/readback/hash-verify the inert harness and candidate blobs; reconcile source/reference/harness; verify tracked diff and candidate/registry hashes. | Integrator | B2, C2 | None. |
| E. Commit, push, machine gate | Descriptive feature commit and push; full `npm run check` on exact SHA; bounded logs retained. | Orchestrator | D | None. Any change loops to B/C. |
| F. Independent review | Exact-SHA code/architecture review and exact-byte View security review. | Reviewer + security reviewer, neither Builder | E | Two reviews in parallel. Both are hard gates. |
| G. Adversarial QA | Clean-worktree parser/service/package tests plus scratch-bundle in-app browser/portability/accessibility/trust tests. | QA roles, neither Builder nor Reviewer | F approvals | QA lanes may run in parallel. |
| H. Handoff and state closure | Immutable implementation Review/addendum, Task outcomes, branch push, board sync, paste-ready PR material, and explicit deferred-rollout record. | Orchestrator | G | None. |
| I. Compatible-runtime rollout | After human merge/distribution confirmation, CAS-promote exact approved candidate over the known View hash, verify readback/registry, browser-smoke live bytes, and sync rollout addendum. | Release owner + QA | H and compatible host | Separate future gate; not inferred from source completion. |

# Test matrix and gates

- Core identity: ordinary/internal/leading/trailing/UTF-8/quote/option-like accepted exactly; `reviews/ ` remains exact rather than prefix; empty/all-whitespace rejected; exact and prefix selectors remain distinct; duplicates do not multiply edges; exact relation text is preserved.
- Parser: both facets plus text, scalar/array, raw UTF-8 at 1,024/1,025 bytes, 1/32/33 values, duplicates, invalid entries, exact round trip.
- Service: exact whitespace IDs/text; valid request agreement; invalid extra key/unknown type/33 values/oversize selector with correlated v0 id; malformed/wrong-protocol/v1/oversize-id uncorrelated; zero launch calls for parse failures.
- View scale: 0/1/32/33 with a 5-second per-case deadline, 500 with a 15-second deadline, exact batch composition, max in-flight one, stop-first-failure, 1,000 accepted rows per direction, pending-id/direction/batch timeout diagnostics, and whitespace IDs.
- View faults: malformed/duplicate row ids, rejection, host `TOO_LARGE`, cumulative over-budget, non-array, every invalid count class, under/overreport, repeated identical literal edges, cross-direction overlap, distinct text, successor chain spanning batches, later-refresh failure, stale detail generation.
- Trust and portability: minimal/open-valued Review records, arbitrary relation text and paths, cycles/dangling targets, HTML-like metadata, CSP/sandbox, shared renderer only, live mutation, keyboard and narrow layout.

Focused commands precede full gates; final commands run from a clean exact-SHA worktree after `npm ci`:

```sh
npm run build
node --test --import ./packages/core/test/ts-loader.mjs ./packages/core/test/pure.test.ts ./packages/core/test/query-edges.test.ts
npm test -w @agentstate-lite/view-runtime
./aslite pull --doc-key artifacts/review-portfolio-bridge-harness.mjs --out /private/tmp/review-portfolio-bridge-harness.test.mjs
./aslite pull --doc-key artifacts/review-portfolio-bridge-candidate.html --out /private/tmp/review-portfolio-bridge-candidate.html
REVIEW_PORTFOLIO_VIEW_HTML=/private/tmp/review-portfolio-bridge-candidate.html node --test /private/tmp/review-portfolio-bridge-harness.test.mjs
npm run e2e:gate -w @agentstate-lite/ui
npm run check
```

# Security, reliability, flexibility, and rollback

- No grammar/limit expansion, ID/text normalization, View-local identity codec, pagination protocol, write capability, network path, HTML sink, closed Review schema, or project-specific identifier is introduced. Lightweight row-id transport checks prevent invalid requests but do not redefine core ID validity.
- Sequential batching trades some latency for bounded load and deterministic failure. The 500-row cap yields at most 32 edge requests, never more than one in flight; each host reply remains capped at 1,000 edges and 2 MiB, and each direction retains at most 1,000 validated rows cumulatively. A future protocol may offer paging, but this View does not invent it.
- Correlated parse errors echo only an already supplied bounded id and one generic constant message; malformed requests never reach launch authorization or bundle access.
- Open OKF content stays visible: unknown metadata, relation labels, record paths, and graph ambiguity are preserved; only effective-currentness inference fails closed.
- Rollback for source is branch reversion before merge or a normal revert after merge. Rollback for candidate View is non-promotion; after live promotion, CAS restore the exact prior View bytes only with an explicit compatibility/security assessment. Registry identity/access is unchanged.

# Stopping rule

Stop this feature-branch unit when the exact code SHA and candidate View SHA pass both independent reviews and all QA gates, immutable evidence is synchronized, and the human has a pushed branch plus PR text. Do not claim the live View repaired until the compatible-runtime rollout gate completes.
