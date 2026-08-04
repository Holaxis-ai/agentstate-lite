---
type: Task
title: Adversarially review H2-H5 host-probe boundary R4
status: done
priority: '2'
assignee: codex-t35-h2-h5-skeptic-r4
description: Fresh exact skeptic review of one-shot cross-attempt R4; no execution.
actor: codex-t35-h2-h5-skeptic-r4
timestamp: '2026-08-04T18:39:25.189Z'
---
# Objective

Independently falsify exact boundary R4 and decide static builder eligibility. R4 must preserve accepted R2/R3 same-attempt mechanics and close only cross-attempt authority. No execution.

# Exact inputs

- R4 boundary `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:d81f773963d65a415f3ddc6bf32caaf86e566927f14dccf61b8015122ea582f4`
- updated system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:d854a7c2b77d12afdbe477a893fa7a7bf5263f6a654afed07c977996c54d252a`
- R3 skeptic PASS `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62`
- R3 acceptance FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r3@sha256:e659417bb01b4c1a51bd3fde6b4bb748b92f3465ad359414881b7a2be9ae4730`
- decision/v5 and earlier accepted inputs inherited and named by R4

# Falsification contract

Attack replay under same/different root, forged/new authorization, task claim races, post-helper mislabeled BLOCKED, missing P0 on FAIL, automatic retry, drifted-state adoption, agent-only rebaseline, unapproved ordinal accepted by auditor, and authorization/bundle coupling that the script cannot validate. Regression-test accepted `-N`, H2, H4, fences, P0/P1, protected scope, provenance, and line bounds. Distinguish builder-byte checks from missing authority. PASS only if no load-bearing conforming trace remains.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4` with exact inputs/isolation, PASS/FAIL, confidence, adversarial traces, and `builder_task_eligible`. Mark this task done. Do not inspect current R4 acceptance output, execute host/tmux/Git-helper/Claude/auth/network/tests, modify code/Plan/parent/handoff, or sync.

[tracked by](../tasks/pre-compact-multi-session.md)

# Outcome

Closed **FAIL** with confidence **0.99**; `builder_task_eligible: false`.

R4 repairs post-helper FAIL/P0 retention, replay of the genuine root-bound authorization, automatic retry, and drifted-baseline adoption. It remains falsified because self-digested exported JSON does not prove that a claimed bundle Task authorized the process spawn, and the local bundle has no authenticated user-origin predicate for a human-approved changed-baseline Decision. Exact findings and repair requirements are in [the R4 skeptic review](../context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r4.md).
