---
type: Plan
title: Plan — targeted packages/cli architecture review
actor: codex-orchestrator
timestamp: '2026-08-07T13:58:41.760Z'
---
# Purpose
Create a reusable, evidence-oriented architecture review template, obtain cross-disciplinary approval, apply it to packages/cli, and publish the result in the bundle.

# Roles
- Orchestrator/product owner/integrator: owns scope, acceptance criteria, synthesis, bundle records, and final quality gate.
- Security specialist: trust boundaries, credentials/secrets, injection/path/process/network risks, authorization, unsafe defaults, supply-chain/package concerns.
- Testing specialist: unit/integration coverage, behavioral relevance, testability seams, determinism, mutation/fault-injection value, and missing feedback loops.
- Architecture skeptic: domain taxonomy, SOLID/dependency boundaries, reliability/fault tolerance, dead code/elegance, and adversarial challenge to consensus.

# Workflow and dependencies
1. Divergent template design: all specialists independently propose criteria and evidence standards; architecture skeptic drafts the domain taxonomy. Parallel.
2. Convergent template synthesis: orchestrator combines proposals into a draft. Depends on step 1.
3. Reviewer gate: every specialist reviews the exact draft; skeptic must explicitly challenge scope, scoring, evidence quality, and reuse across projects. Revise until no blocking findings or three cycles. Depends on step 2.
4. Approved-template freeze: persist the approved template and taxonomy under reviews/ and research/. Depends on step 3.
5. Divergent package review: specialists apply only the approved template to packages/cli, using independent scopes and evidence. Parallel. Depends on step 4.
6. Cross-review and synthesis: specialists challenge material findings outside their primary domain; orchestrator deduplicates and preserves disagreements. Depends on step 5.
7. QA gate: verify every high/medium finding against code or a bounded empirical probe, label reasoned vs empirical, and ensure report/template completeness. Depends on step 6.
8. Publish final review under reviews/, update all tasks and context note, then aslite sync. Depends on step 7.

# Acceptance criteria
The parent task acceptance criteria are authoritative. No source changes, commits, pushes, PRs, or disclosures of exploitable main-branch vulnerabilities in the public board.

[plans task](../tasks/cli-architecture-review.md)
