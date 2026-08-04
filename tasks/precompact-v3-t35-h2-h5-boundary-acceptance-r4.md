---
type: Task
title: Review H2-H5 host-probe boundary R4 for acceptance
status: done
priority: '2'
assignee: codex-t35-h2-h5-acceptance-r4
description: Fresh exact acceptance review of one-shot cross-attempt R4; no execution.
actor: codex-t35-h2-h5-acceptance-r4
timestamp: '2026-08-04T18:38:06.844Z'
---
# Objective

Independently review exact boundary R4 for product/acceptance completeness and static builder eligibility. R4 must preserve accepted R2/R3 same-attempt mechanics and close only cross-attempt authority. No execution.

# Exact inputs

- R4 boundary `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:d81f773963d65a415f3ddc6bf32caaf86e566927f14dccf61b8015122ea582f4`
- updated system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:d854a7c2b77d12afdbe477a893fa7a7bf5263f6a654afed07c977996c54d252a`
- R3 skeptic PASS `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`
- R3 acceptance FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`
- decision/v5 and earlier accepted inputs inherited and named by R4

# Review contract

Adjudicate one-shot Task/authorization/root binding, pre-helper-only BLOCKED, post-helper terminal FAIL, authorization consumption, retained P0, evidence-auditor rejection of unapproved roots, and separately reviewed rebaseline Decision/human approval when state changed. Attempt cross-run adoption, new-root retry, agent-only rebaseline, and hidden restoration. Reconfirm R2/R3 mechanics and gate order did not regress. PASS only if a builder has no material authority choice left.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4` with exact inputs/isolation, PASS/FAIL, confidence, counterexamples, and `builder_task_eligible`. Mark this task done. Do not inspect current R4 skeptic output, execute host/tmux/Git-helper/Claude/auth/network/tests, modify code/Plan/parent/handoff, or sync.

# Outcome

Completed static acceptance review with **PASS**, confidence **0.98**, and `builder_task_eligible: true`. R4 closes same-root and fresh-root replay, post-helper reclassification, silent cross-run P0 adoption, agent-only changed-baseline approval, and hidden restoration while preserving the accepted R2/R3 mechanics. Exact review note: [R4 acceptance](../context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r4.md).

[tracked by](../tasks/pre-compact-multi-session.md)
