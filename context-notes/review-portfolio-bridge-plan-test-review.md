---
type: Context Note
title: Review portfolio bridge Plan testing review
actor: bridge-test-research
timestamp: '2026-08-08T17:54:11.964Z'
---
# Summary

**Final verdict: APPROVED.** The revised Plan closes every testing/reliability change required by the prior review. Durable exact-subject locations and a literal replay chain are named; liveness has fixed per-case deadlines and diagnostic timeout receipts; and feedback construction/red evidence is separated from production repair by explicit DAG dependencies. The added security boundaries are expressed as observable assertions in acceptance criteria, assigned to red-gate roles, repeated in the test matrix, and included in exact-SHA integration/review/QA gates.

This approval supersedes the prior `CHANGES_REQUIRED` verdict on Plan version `sha256:1129defbc12d67d0e8670f0864113f64e26cae57aebabe7672ba2f54b4f33d98`.

## Goals

**Ultimate goal:** agentstate-lite remains human-visible, conflict-safe, local-first shared memory whose durable conclusions and graph relationships preserve exact OKF identity across every supported surface.

**Proximate goal:** verify that the revised implementation Plan makes identity, correlation, scale, security-budget, aggregation, and liveness failures observable before production edits and replayable through independent review and QA; this serves the ultimate goal by giving every source and View claim a durable executable oracle.

## Exact approved subject

- Plan: `plans/review-portfolio-bridge-identity-repair`
- Version: `sha256:624ea79a22241cbd53e0bea26ca100d7afd1572b5e4f5ca8a238228f16d4c35b`
- Actor/timestamp: `codex-orchestrator`, `2026-08-08T17:53:00.070Z`

## Prior required changes — verified closed

### 1. Durable locations and exact replay — closed

Acceptance 15 names the unregistered inert harness blob `artifacts/review-portfolio-bridge-harness.mjs` and separate inert candidate `artifacts/review-portfolio-bridge-candidate.html`. Acceptance 21 requires promotion, readback, hash verification, evidence linking, retention through board sync, and gives the literal three-command pull/run chain. Integration D owns those operations before review. The harness consumes exact candidate bytes through `REVIEW_PORTFOLIO_VIEW_HTML`; neither artifact is a live registered View or a second View source authority.

### 2. Numeric liveness deadlines — closed

Acceptance 15 declares a 5-second deadline for ordinary Node/browser settlement and 15 seconds for the real-authority 500-Review case. Timeout receipts must identify every pending request id with direction and batch index. The scale matrix repeats 5 seconds for 0/1/32/33 and 15 seconds for 500, along with max-in-flight one and stop-first-failure assertions. These are executable hang detectors rather than retrospective timing judgments.

### 3. Red nodes before production repair — closed

The DAG now has structural dependencies:

- B1 Host red gates → B2 Host repair.
- C1 View red harness → C2 View repair.
- B1 and C1 run independently after A; B2 and C2 may run in parallel only after their respective red receipts.
- Integration D depends on both green repairs.

B1 explicitly includes the actual-host correlated-error regression. C1 explicitly reproduces scale/liveness, identity/text, malformed/duplicate IDs, budget, multiset, and fault/currentness failures before candidate edits. This satisfies feedback-first ordering without relying on Builder self-report.

## Security additions — executable coverage verified

1. **Exact relation text:** invariants and criteria require raw 1–1,024-byte `text` preservation alongside `from`/`to`; parser, core/service, View, and test-matrix rows all name exact-text fixtures.
2. **Prefix-confusion boundary:** `to: "reviews/ "` must stay an exact boundary-space ID rather than become prefix selector `reviews/`; this is named in acceptance and B1.
3. **Correlation containment:** every v1 envelope stays uncorrelated; invalid v0 correlation reuses the existing request-id primitive, echoes only a generic error/id, and performs zero launch or bundle calls. Service matrix names valid and invalid envelope cases.
4. **Malformed/duplicate Review IDs:** before graph requests, every row id must be distinct and satisfy the transport contract; failure emits no broad/invalid request, leaves safe rows visible, and suppresses currentness. C1 and the fault matrix own these cases.
5. **One-in-flight and exposure budget:** graph-request concurrency is exactly one; each direction accepts at most 1,000 validated rows cumulatively; crossing 1,000 stops later batches and marks evidence incomplete. Acceptance and matrix cover the 1,000 boundary plus cumulative over-budget failure.
6. **Literal-edge multiplicity:** aggregation validates batches first, then keeps the maximum outbound/inbound multiplicity for each exact `(from,to,text)` tuple. It removes cross-direction overlap without erasing repeated identical literal links; different text stays distinct. Acceptance 11, C1/C2, and the fault matrix all require executable multiplicity assertions.
7. **Currentness/liveness:** every rejection, malformed shape, invalid count, budget failure, or stale refresh finishes within its deadline, exposes batch/direction recovery, and prevents effective/standalone currentness.

## Remaining risks correctly assigned, not Plan blockers

- The harness must resolve branch-built dependencies correctly after being pulled to `/private/tmp`; the literal replay command itself is an acceptance gate, so any path/import defect fails Integration D before review.
- JSDOM/in-process evidence does not prove opaque origin, CSP, exact-byte approval, or real source checks; acceptance 16 and QA G retain the sandboxed browser/scratch oracle.
- Live View deployment remains host-first/View-second after merge/distribution confirmation, with exact-byte reapproval and CAS smoke; source completion cannot claim rollout.

## Gate conclusion

The Plan now supplies a complete, proportional feedback stack: core/parser/service red tests, a durable exact-View real-authority/fault harness, a real browser projection regression, full package/repository gates, two independent reviews, and only then adversarial QA. No further testing/reliability Plan changes are required.

Confidence: **high**.
