---
type: Task
title: Review H2-H5 host-probe boundary R3 for acceptance
status: done
priority: '2'
assignee: codex-t35-h2-h5-acceptance-r3
description: >-
  FAIL 0.99: P0/Git/P1 same-attempt ordering is repaired and R2 remains
  accepted, but post-helper P0/P1/index drift is incorrectly BLOCKED rather than
  FAIL, contradicting the governing diagnostic and allowing a later attempt to
  adopt helper-caused drift as baseline. builder_task_eligible=false.
  Deliverable
  context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730.
actor: codex-t35-h2-h5-acceptance-r3
timestamp: '2026-08-04T18:31:37.926Z'
---
# Objective

Independently review exact boundary R3 for product/acceptance completeness and static builder eligibility. R3 must preserve every accepted R2 judgment and repair only preflight observer/baseline causality. No execution.

# Exact inputs

- R3 boundary `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903`
- R3 system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:5b2324df8c7af32856a55b183c1edfd605f44481b5cf4380fc05b343c5ae4305`
- R2 acceptance PASS `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`
- R2 skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`
- decision/v5 provenance inherited unchanged and named by R3

# Review contract

Check that P0 -> preregistered Git helpers -> P1 equality/index guards -> baseline freeze -> first probe-principal spawn is complete, non-circular, fail-closed, and does not accept helper mutation into the baseline. Confirm exact Git/ps pinning and that preflight BLOCKED versus post-probe FAIL semantics are closed. Reconfirm no R2 accepted scope, noninterference, ownership, fence, nonclaim, or gate regressed. PASS only if a builder has no architecture choice left.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3` with exact inputs/isolation, PASS/FAIL, confidence, counterexamples, and `builder_task_eligible`. Mark this task done. Do not inspect current R3 skeptic output, execute host/tmux/Claude/auth/network/tests, modify code/Plan/parent/handoff, or sync.

[tracked by](../tasks/pre-compact-multi-session.md)
