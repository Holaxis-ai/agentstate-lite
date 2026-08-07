---
type: Task
title: Targeted architecture review of packages/cli
status: in_progress
priority: high
assignee: codex-orchestrator
description: >-
  Create and team-vet a reusable architecture review template, apply it to
  packages/cli, and publish the evidence-backed findings under reviews/.
actor: codex-orchestrator
timestamp: '2026-08-07T13:58:40.556Z'
---
# Ultimate goal
A markdown knowledge bundle in the repo plus an agent-oriented CLI that gives humans visible, conflict-safe, local-first shared memory.

# Proximate goal
Produce a vetted, reusable architecture-review rubric and use it to identify prioritized, evidence-backed improvements to packages/cli; this strengthens the reliability and maintainability of the product CLI boundary.

# Acceptance criteria
- A reusable template covers security; unit/integration coverage and test relevance; testability; SOLID/design quality; reliability/fault tolerance; dead code/elegance; dependency and boundary integrity; performance/operability; documentation/maintainability; and prioritized remediation.
- Security, testing, architecture/design, reliability, and skeptical perspectives independently review the template.
- The team approves the template before applying it.
- The actual review cites concrete source/test locations and distinguishes empirical evidence from reasoned findings.
- Findings include severity, confidence, impact, evidence, recommendation, and validation strategy; false positives and survived attacks are recorded.
- Final template and review are stored in the bundle under reviews/.

# Progress
Orientation complete; specialist template tasks are being prepared.
