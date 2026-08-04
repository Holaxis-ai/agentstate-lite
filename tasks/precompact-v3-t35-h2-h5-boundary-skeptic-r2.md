---
type: Task
title: Adversarially review H2-H5 host-probe boundary R2
status: done
priority: '2'
assignee: codex-t35-h2-h5-skeptic-r2
description: >-
  R2 static skeptic FAIL (0.99): major R1 repairs survived, but mandatory
  pinned-Git worktree snapshot requires a spawned Git helper while the same
  boundary requires the snapshot before the first process spawn. Preflight
  helper/baseline causality must be specified. builder_task_eligible=false.
  Deliverable
  context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2@sha256:57c2b814949cd8f8a284ad87c84f8cc37574e03cf40c9361f7516f1217498430.
actor: codex-t35-h2-h5-skeptic-r2
timestamp: '2026-08-04T18:25:28.315Z'
---
# Objective

Independently falsify exact boundary R2. Decide whether it is safe for static builder authoring only. No execution.

# Exact inputs

- decision `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`
- R2 `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:1847717b5456a3cea3325cab947543c91cc0c6cb00403d4b99d00a5971c56b51`
- R1 acceptance FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance@sha256:9ab4554b694a5f573fc53d8b22e816e834e8c3999a11136684324ed5abb768f7`
- R1 skeptic FAIL `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:22c47a846c9dbe7d22742c73babc043469b537caf62c035c2de81682f8b16717`
- retained v5 Research/audit and exact local source/evidence/manpage named by R2

# Falsification contract

Attack command-independent `-N` inference versus narrow empirical evidence; server exit between validation/contact; controller conditioning before/during H2 observation; observer filesystem/global access; pane request/record failures; marked-companion handle/PGID/reuse; abort versus final-action ordering; socket replacement; stopped/late principals; snapshot omissions/observer mutation; summary/fallback promotion; and feasibility within the line/principal bounds. Distinguish a future byte-level implementation check from a missing architecture rule. PASS only if no load-bearing conforming counterexample remains.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic-r2` with status complete, exact inputs, isolation, PASS/FAIL, confidence, adversarial traces, and `builder_task_eligible`. Mark this task done with the result. Do not inspect current acceptance output, execute host/tmux/Claude/auth/network, modify code/Plan/parent/handoff, or sync.

[tracked by](../tasks/pre-compact-multi-session.md)
