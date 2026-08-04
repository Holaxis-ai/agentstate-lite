---
type: Task
title: Review H2-H5 host-probe boundary for acceptance
status: done
priority: '2'
assignee: codex-t35-h2-h5-acceptance
description: >-
  FAIL 0.99: H4 requires server-B kill after the single fence, while the
  construction guard bans every post-fence tmux action;
  builder_task_eligible=false. Deliverable
  context-notes/precompact-v3-t35-h2-h5-boundary-acceptance@sha256:9ab4554b694a5f573fc53d8b22e816e834e8c3999a11136684324ed5abb768f7.
actor: codex-t35-h2-h5-acceptance
timestamp: '2026-08-04T18:09:56.224Z'
---
# Objective

Independently review the exact architecture-option-1 H2-H5-only boundary for product/acceptance completeness. Return a closed PASS or FAIL with confidence and exact-version binding. Do not execute host actions or inspect any skeptic output.

# Exact inputs

- `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`
- `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`
- `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`
- `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`
- `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker`

# Acceptance questions

- Does the boundary eliminate every fresh action against an absent or unverified server while retaining no-autostart only as scoped E1 provenance?
- Are H2-H5 observable, useful for replacement-Plan synthesis, and explicitly prevented from proving lease/CAS/scheduler/schema/live-Claude policy?
- Are requester identity, discarded-result separation, marked-child ordering, late-child abort, terminal continuity, protected-state, evidence provenance, and failure/containment outcomes closed enough for a clean-room builder?
- Is the principal/action/resource model implementable and mechanically reviewable within the stated bound without hidden policy invention?
- Can any primary PASS be manufactured by fallback cleanup, summary fields, or an overbroad v5 claim?

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-acceptance` with status complete, exact reviewed versions, isolation statement, verdict PASS or FAIL, confidence, minimal counterexample for every blocker, and an explicit `builder_task_eligible: true|false`. Update this task to done with the result summary. Do not sync the board; the orchestrator owns sync.

[tracked by](../tasks/pre-compact-multi-session.md)
