---
type: Plan
title: Plan — targeted packages/cli architecture review
actor: codex-orchestrator
timestamp: '2026-08-07T15:07:05.865Z'
---
# Purpose
Create a reusable, evidence-oriented architecture review template, obtain cross-disciplinary approval, apply it to packages/cli, and publish the result in the bundle.

[plans task](../tasks/cli-architecture-review.md)

# Roles
- Orchestrator/product owner/integrator: owns scope, acceptance criteria, synthesis, bundle records, and final quality gate.
- Security specialist: trust boundaries, credentials/secrets, injection/path/process/network risks, authorization, unsafe defaults, supply chain, and disclosure triage.
- Testing specialist: requirement-risk coverage, test relevance, testability seams, determinism, mutation/fault evidence, and false-confidence mechanisms.
- Architecture skeptic: domain taxonomy, SOLID/dependency boundaries, reliability/fault tolerance, dead-code proof, negative-claim audit, and adversarial challenge to consensus.

# Reviewed workflow and dependencies
1. Divergent template design: specialists independently propose criteria/evidence standards; skeptic drafts the domain taxonomy. Parallel. COMPLETE.
2. Convergent synthesis: orchestrator combines proposals into an exact draft and updates this plan. Depends on step 1. COMPLETE.
3. Applicability and reuse gate: paper-apply the draft to a pure library and a stateful/distributed adapter; every module/artifact is required, sampled with population/method/residual risk, N/A only when absent or unreachable, or not assessed with blocker/residual risk. Applicable material security items not assessed force an incomplete target verdict. Depends on step 2.
4. Reviewer gate: every specialist reviews the exact template revision. Security verifies threat/boundary/disclosure controls; testing verifies coverage/testability/false-confidence controls; skeptic tests negative claims, scoring, proportionality, cross-project reuse, and stopping rules. Revise for blocking issues, maximum three cycles. Depends on steps 2-3.
5. Approved-template freeze: persist approved status/version plus domain taxonomy. Freeze the material capability/risk universe, evidence ladder, finding schema, counterevidence, and private disclosure routing. Nonmaterial template amendments defer to a future version; a material defect blocks the affected area, creates a new version, and forces affected evidence/applicability to rerun or remain explicitly version-scoped. Depends on step 4.
6. Target-freeze gate: record exact SHA, branch, clean state, runtime, owned-code/dependency boundary, build/artifact identity, and included generated assets. If target bytes drift later, re-run affected evidence or report the original revision. Depends on step 5.
7. Divergent package review: specialists apply only the frozen template to packages/cli in parallel and record proposed amendments separately rather than changing rules mid-review. Depends on step 6.
8. Cross-review/synthesis: each material symptom attaches to an owning invariant/authority; specialists challenge material findings outside their domain; duplicates merge only when owner, violated obligation/invariant, and causal mechanism materially match; dissent/counterevidence remain preserved. Depends on step 7.
9. QA gate: every published finding is E1 or better; high/critical findings reach a safe E2 probe where feasible; all negative/exclusive claims (missing, only, canonical, dead, unbounded) receive class-specific evidence and counterevidence audits; test/gate evidence uses exact exit status; disclosure triage precedes public writes. Depends on step 8.
10. Publish template and review under reviews/, complete tasks/context note, run aslite sync, and record a post-use template retrospective. Depends on step 9.

# Acceptance criteria
The parent task remains authoritative. Additionally: no aggregate architecture score; consequence, confidence, and action priority remain independent. Every applicable material capability/risk in the frozen purpose/system/threat/requirement universe traces to surfaces, plural authorities and owned responsibilities, state/dependencies, contracts, failure behavior, and verification. Every rubric item traces back to a product obligation, applicable risk, or demonstrated carrying cost. No finding quota. No source changes, commits, pushes, PRs, or public technical disclosure of an exploitable released-revision vulnerability (including main where main is the release channel).

# Completion

All ten workflow stages completed. The reusable template and its approval record are under `reviews/`; the frozen CLI review and exact-version approval record are under `reviews/`; Reviewer and QA gates passed; private security routes remain redacted; the parent and specialist tasks record their outcomes. Board sync and orchestration reflection are the final session-close operations.

[final report](../reviews/cli-package-architecture-review.md)

[report approval](../reviews/cli-package-architecture-review-approval.md)
