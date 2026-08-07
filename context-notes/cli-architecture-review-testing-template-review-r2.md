---
type: Context Note
title: CLI architecture review template — testing/testability review r2
actor: testing-reviewer
timestamp: '2026-08-07T14:16:27.492Z'
---
# Summary

Testing/testability re-review of exact template revision 2 `reviews/architecture-review-template` at `sha256:ae71e64c39d2fdcdf54a65ba332c0ef9723dde9fb7ae4c85191af388ecd6cf88` and domain model `research/architecture-review-domain-model` at `sha256:1c6e207c1c7a7f29daf19119e350ab6c2ca3ff20476126929cb9a25acfd62293`.

Verdict: **APPROVE**. No blocking or nonblocking testing/testability regressions were found. Both round-1 editorial points are resolved. Approval is version-specific; no `packages/cli` review or findings were started.

## Blocker and round-1 disposition

- Round 1 had no blockers; none were introduced.
- `TST-R1-N1` resolved: plan step 3, template §3, and the domain-model reuse profiles now consistently use `required`, `sampled`, `not applicable`, and `not assessed`, with explicit blocker/residual-risk semantics.
- `TST-R1-N2` resolved: template §6.6 now requires each quarantine to record the unprotected contract/risk, owner, issue, expiry, and replacement plan.
- New issues: none.

## Survived checks

1. **Evidence source versus conclusion basis:** Template §5.1 separates source/method (`static source`, `test/gate`, `runtime probe`, `measurement`, `historical record`) from conclusion basis (`reasoned`, `empirically reproduced`, `machine-enforced`, or named combination). Finding schema §5.3 requires both. The E0–E3 ladder remains actionable and exact-revision/artifact-bound; E3 still requires independent reproduction or a stable automated exact-artifact gate.
2. **Applicability, sampling, N/A, and not-assessed:** Template §3 and the domain model require status per module and artifact. Sampling records bounded population, selection method, representativeness rationale, and residual unsampled risk. N/A requires genuine absence/unreachability under frozen models. Not-assessed preserves blocker/residual risk and makes applicable material omissions incomplete.
3. **Pure/stateless operation timelines:** Template §§4.3 and 7 explicitly substitute a representative operation/error timeline for mutation/workflow timelines when the target is pure/stateless, with irrelevant state-transition fields marked N/A. The approval gate refers to the applicable failure/operation timeline.
4. **Quarantine governance:** Template §6.6 requires unprotected obligation/risk, owner, issue, expiry, and replacement plan while retaining retry, flake, duration, resource, skip, isolation, and masked-exit audits.
5. **Amendments and revision drift:** Template §2 and plan step 5 defer nonmaterial changes to the next version; material defects block the affected area, create a new version, require affected applicability/evidence reruns or explicit old-version reporting, and preserve versions plus an impact map. Target byte drift invalidates or historical-labels evidence.
6. **Required testing artifacts:** Template §6.6 still mandates the classified test inventory with gate reachability, requirement-risk-test matrix with residual gaps, architectural testability/seam assessment, and prioritized gaps/false-confidence/survived-attack record. §7 keeps the corresponding matrices mandatory or explicitly N/A.
7. **Coverage-quality rules:** Each material assurance claim still records requirement/risk/surface, level, exact test/gate, oracle, real/fake boundary, negative/fault dimensions, environment, sensitivity, coverage quality, and residual risk. `strong`, `partial`, `indirect`, `absent`, and `unknown` remain per-requirement, non-aggregated dispositions.
8. **Oracle and sensitivity rules:** Weak/assertion-free/type-only/did-not-throw/broad-status/unreviewed-snapshot/mock-copy evidence remains rejected unless it is the full contract. High-risk assurance still normally requires owning-layer, real-boundary, negative/fault, and turns-red evidence.
9. **Test-level allocation and meaningful seams:** Unit/component/integration/contract/agreement/subprocess/E2E/package/compatibility/recovery levels and risk-based allocation remain intact. Seams require real variation or material fault control and real-boundary proof; mockability alone is insufficient.
10. **Boundary and environmental breadth:** Filesystem, subprocess, network, packaging, lifecycle, concurrency, time, cleanup, deterministic isolation, fixture/golden provenance, contract-checked fakes, runtime/platform, installed artifact, and source-versus-shipped artifact checks remain present.
11. **Branch/mutation/property/flake false-confidence controls:** Branch coverage remains a decision map, mutation remains named-survivor evidence, property tests target grammars/state invariants, and no scalar assurance target was introduced.
12. **Reuse:** The graph model now explicitly supports absent adapters/orchestrators, plural authorities with owned responsibilities, pure functions, and distributed split authorities without weakening cross-boundary invariant ownership or agreement evidence.

## Confidence and limits

Confidence: high. This was a complete static comparison of the exact revision-2 documents against round-1 findings and the phase-1 testing criteria. It did not run the separate cross-project paper applications and did not inspect source, tests, package behavior, git state, or network state.

# Progress

Template revision-2 testing/testability re-review complete with exact-version approval and no issues. The specialist task remains in progress for application after the orchestrator completes the freeze gate.
