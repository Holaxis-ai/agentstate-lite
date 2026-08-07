---
type: Task
title: 'CLI architecture review: security specialist'
status: in_progress
priority: high
assignee: security-reviewer
description: >-
  Define security and trust-boundary review criteria, vet the shared template,
  then apply the approved template to packages/cli.
actor: security-reviewer
timestamp: '2026-08-07T14:02:23.773Z'
---
# Goal

Provide an independent security analysis of packages/cli and the reusable review rubric.

# Ultimate alignment

The proximate goal is to make the security review complete, reproducible, and safe to hand off; this strengthens the ultimate product goal by protecting the local-first, conflict-safe CLI boundary with reusable scaffolding.

# Dependencies

Template criteria draft precedes template vetting; template approval precedes package findings.

# Required output

Evidence-backed findings, survived attacks, uncertainties, confidence, and recommendations; read-only code review.

# Progress

Phase 1 template design is complete. The proposed security rubric, evidence ladder, severity/confidence conventions, plan critique, and phase-2 probe hypotheses are recorded in [the security template note](../context-notes/cli-architecture-review-security-template.md).

No packages/cli findings were produced in this phase. Task remains in progress pending convergent template synthesis, exact-draft security vetting, and approved-template freeze before phase 2.
