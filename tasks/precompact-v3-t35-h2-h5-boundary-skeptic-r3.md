---
type: Task
title: Adversarially review H2-H5 host-probe boundary R3
status: done
priority: '2'
assignee: codex-t35-h2-h5-skeptic-r3
description: >-
  R3 exact static skeptic PASS (0.97): P0/preregistered-Git-helper/P1 causality
  is closed and accepted R2 contracts regress cleanly. No load-bearing
  counterexample; builder_task_eligible=true for static authoring only, not
  execution. Deliverable
  context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3@sha256:9d5d105fbd31fc1a68ae8b7fc33d0c44612a57f89422ce83ed84557b88386f62.
actor: codex-t35-h2-h5-skeptic-r3
timestamp: '2026-08-04T18:31:21.258Z'
---
# Objective

Independently falsify exact boundary R3 and decide static builder eligibility. R3 must preserve every accepted R2 judgment and repair only preflight observer/baseline causality. No execution.

# Exact inputs

- R3 boundary `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:630e5588c9ef16bba29c5caae018391eb94734a11f194d0f710e0d32c195e903`
- R3 system diagnostic `designs/precompact-v3-t35-h2-h5-probe-system-diagnostic-r3@sha256:5b2324df8c7af32856a55b183c1edfd605f44481b5cf4380fc05b343c5ae4305`
- R2 acceptance PASS `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance-r2@sha256:a53fb774f83817c303bf41c6444fc2813d7eebbbead67d4a06e4132e1229c0e0`
- R2 skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430`
- decision/v5 provenance inherited unchanged and named by R3

# Falsification contract

Attack any pre-P0 spawn, unregistered/helper-induced child, P0/P1 scope difference, Git/index mutation accepted into P1, incomplete helper close/EOF/absence, dirty receipts frozen as clean, BLOCKED/FAIL ambiguity, and terminal comparison to the wrong baseline. Also regression-test the accepted R2 `-N`, H2 dataflow, direct-companion H4, two-fence, socket/provenance, and nonclaim contracts. Distinguish byte-level implementation review from missing architecture. PASS only if no load-bearing conforming trace remains.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r3` with exact inputs/isolation, PASS/FAIL, confidence, adversarial traces, and `builder_task_eligible`. Mark this task done. Do not inspect current R3 acceptance output, execute host/tmux/Claude/auth/network/tests, modify code/Plan/parent/handoff, or sync.

[tracked by](../tasks/pre-compact-multi-session.md)
