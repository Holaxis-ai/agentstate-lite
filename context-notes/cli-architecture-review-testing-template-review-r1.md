---
type: Context Note
title: CLI architecture review template — testing/testability review r1
actor: testing-reviewer
timestamp: '2026-08-07T14:10:27.978Z'
---
# Summary

Testing/testability review of exact template `reviews/architecture-review-template` at `sha256:99ca713faaa4439830c548d83c37dcd2c07d44ca9bd82d8b9e377c50b3bc226c` and domain model `research/architecture-review-domain-model` at `sha256:78016770fdd8fd481de46a8dd121de3859e981e3207f7033514a80dc90b0eeb4`.

Verdict: **APPROVE** for testing/testability completeness and cross-project reuse. No blocking findings. This approval is version-specific and does not approve any later edit by implication. No `packages/cli` findings were started.

## Version checks

- Template head version matched the requested `sha256:99ca713faaa4439830c548d83c37dcd2c07d44ca9bd82d8b9e377c50b3bc226c`.
- Domain-model head version matched the requested `sha256:78016770fdd8fd481de46a8dd121de3859e981e3207f7033514a80dc90b0eeb4`.
- Comparison included the phase-1 proposal `context-notes/cli-architecture-review-testing-template` and updated plan `plans/cli-architecture-review` at `sha256:fdcbb74afef0f4a66f1fe5bdb23d64614ed3b972f9ece15d7d5192f089d928fa`.

## Survived checks

1. **Required testing artifacts:** Template §6.6 mandates the classified inventory, requirement-risk-test matrix, architectural testability/seam assessment, and prioritized gaps/false-confidence/survived-attack records. These are reinforced as required cross-cutting matrices in §7.
2. **Requirements-risk traceability:** §§4.2, 6.6, and 7 trace obligations to sources, surfaces, owning authorities, state/dependencies, contracts, tests/oracles, failure behavior, verification, and residual gaps. The domain model defines invariant, contract, authority, evidence unit, finding, counterevidence, and residual risk consistently.
3. **Gate reachability:** §6.6 requires exact gate references and discovery/glob/build-prerequisite/skip verification, and explicitly rejects inferring reachability from a matching test file or green command. §§1, 4.1, 5.1, and 6.9 bind evidence to exact revisions, runtimes, build channels, and installed/built artifacts.
4. **Oracle relevance and sensitivity:** §6.6 rejects assertion-free, weak boolean/type, did-not-throw, broad-status, unreviewed-snapshot, and mock-copy evidence unless it is the entire contract. It requires sensitivity evidence and, for high-risk contracts, proof that the test turns red when the contract breaks. §§5.1 and 7 define targeted red probes without making mutation or coverage scores the objective.
5. **Test-level allocation:** §6.6 distinguishes unit, component, adapter integration, contract, agreement/parity, subprocess, E2E, install/package, compatibility, and recovery tests, then allocates them by owning risk and boundary. §§6.2–6.3 require one owning primitive plus irreducible projection/agreement evidence.
6. **Meaningful testability seams:** The domain model defines a seam by real variation or material fault/test boundary. §§6.2 and 6.6 require controllable inputs/faults, observable outcomes, cleanup, and real-boundary proof while rejecting dependency injection justified only by mockability.
7. **Boundary, fault, concurrency, and time behavior:** §§3, 6.4–6.6, and 7 cover filesystem, process, environment, network, package/install, lifecycle, mutation windows, partial failure, CAS/locks, ordering, retries/timeouts, cancellation, cleanup, and post-failure state. Applicability profiles prevent forcing irrelevant probes onto simple targets.
8. **Fixtures and doubles:** §6.6 requires fixture/golden provenance, contract-checked fakes, explicit real/fake boundary recording, and interaction-versus-outcome scrutiny. Mock copies are called out as false confidence.
9. **Flakes, skips, masked exits, and isolation:** §6.6 explicitly audits flakes, retries, quarantine, durations/resource outliers, omitted globs/skips, stale artifacts, masked exit statuses, shared globals, deterministic temp/ports/env/cwd/clock/randomness, parallel safety, and cleanup.
10. **Artifact/runtime/environment coverage:** §§1, 4.1, 6.9, and the published-package profile require exact artifact identity, clean/offline installed-artifact execution, supported runtime/platform environments, entry points, package contents, workspace leakage checks, and portability assumptions.
11. **N/A/deferred and amendment handling:** §§2–3 require every module to be required, sampled, not applicable with rationale, or not assessed with blocker/residual risk. The amendment rule forbids silent rule changes after freeze. Plan steps 3, 5, and 7 preserve paper-testing, freeze, and separate amendment recording.
12. **Cross-project reuse and proportionality:** §§3 and 9 plus the domain-model reuse profiles separate a universal core from composable library, CLI, stateful, distributed, security, package, and UI/server profiles. The pure-library/stateful-adapter paper test and orphan-item removal rule guard checklist accretion.
13. **Evidence quality:** §5 separates evidence mode, grade, severity, confidence, and action priority; requires exact command/cwd/runtime/revision/result for empirical evidence; scopes absence searches; preserves counterevidence, refutations, limitations, dissent, and survived attacks; and states that a green gate proves only the exercised states/artifact.

## Issues

### TST-R1-N1 — Applicability-status wording differs between plan and frozen vocabulary

- Severity: low.
- Blocking: no.
- Location: plan step 3 versus template §3/domain-model “Reuse profiles.”
- Description: the plan uses `deferred with blocker`, while the template/domain model use `not assessed with blocker/residual risk`. The semantics are equivalent in context, but a reviewer could reproduce the plan’s label rather than the template’s frozen vocabulary.
- Required change: none for approval. Optional editorial follow-up before final freeze: change plan step 3 to `not assessed with blocker/residual risk`, or explicitly state that `deferred` maps to `not assessed`.

### TST-R1-N2 — Quarantine is audited but its minimum disposition is not frozen

- Severity: low.
- Blocking: no.
- Location: template §6.6 flakes/retries/quarantine bullet.
- Description: the template requires quarantine audit but does not specify the minimum record needed to prevent indefinite silent loss of assurance. This does not impair the current review because quarantine can still be reported as a gap under the required residual-risk schema.
- Required change: none for approval. Optional next-version clarification: a quarantine record should name the unprotected obligation/risk, owner, issue, expiry/review date, replacement plan, and whether retries mask first-attempt failure.

## Confidence and limitations

Confidence: high. The review was a complete static comparison of the exact template/domain text against the phase-1 criteria and updated plan. It did not paper-apply the whole template itself; that is a separate plan gate owned by the orchestrator/skeptic. No source, tests, package behavior, git state, or network state were inspected in this review round.

# Progress

Exact-draft testing/testability review r1 complete with version-specific approval and no blockers. The specialist task remains in progress for application of the approved template after the orchestrator completes the remaining approval/freeze gates.
