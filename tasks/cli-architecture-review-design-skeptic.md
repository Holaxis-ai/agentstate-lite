---
type: Task
title: 'CLI architecture review: design, reliability, and skeptic'
status: in_progress
priority: high
assignee: architecture-skeptic
description: >-
  Draft the domain taxonomy; assess SOLID, dependency boundaries, fault
  tolerance, dead code/elegance; challenge omissions and weak evidence in the
  shared template and final review.
actor: architecture-skeptic
timestamp: '2026-08-07T14:04:46.189Z'
---
# Goal

Provide an independent architecture and reliability analysis while acting as the team skeptic.

Proximate goal: define a reusable, evidence-calibrated domain model and review frame that attributes symptoms to owning architectural causes. This serves the ultimate product goal by making CLI quality review repeatable without creating a second semantic authority or unbounded checklist.

# Dependencies

Draft domain taxonomy and criteria before template-vetting; template approval precedes package findings.

# Required output

Domain model, architecture/reliability criteria, explicit skeptical challenges, evidence thresholds, confidence, and recommendations; read-only code review.

# Progress

- Read the authoritative repository guide, mandatory skills, product goal, review plan, assigned task, orchestrator orientation, and prior architecture-domain-model review.
- Claimed this task as `architecture-skeptic`.
- Completed the divergent template-design deliverable without publishing `packages/cli` findings.
- Persisted taxonomy, structured design/reliability/maintainability/dead-code criteria, evidence thresholds, scoring critique, completeness tests, plan-gate recommendations, assumptions, risks, and phase-two probe ideas at `context-notes/cli-architecture-review-design-skeptic-template`.
- Status remains `in_progress` because template synthesis/vetting and phase-two package review have not occurred.

# Next

Review the orchestrator's exact synthesized template. Block approval if it introduces aggregate scoring, loses applicability/evidence rules, collapses symptoms into separate findings, omits negative-claim proof, or drops recorded minority positions without adjudication.
