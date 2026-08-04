---
type: Task
title: Adversarially review H2-H5 host-probe boundary
status: done
priority: '2'
assignee: codex-t35-h2-h5-skeptic
description: >-
  Static skeptic FAIL (0.98): absent-target check/action race exceeds narrow E1,
  H2 lacks controller-level noninterference, late child can be detected without
  legal containment, and protected scope is unpinned.
  builder_task_eligible=false. Deliverable
  context-notes/precompact-v3-t35-h2-h5-boundary-skeptic@sha256:22c47a846c9dbe7d22742c73babc043469b537caf62c035c2de81682f8b16717.
actor: codex-t35-h2-h5-skeptic
timestamp: '2026-08-04T18:10:59.960Z'
---
# Objective

Independently falsify the exact architecture-option-1 H2-H5-only boundary. Return a closed PASS or FAIL with confidence and exact-version binding. Do not execute host actions or inspect any product/acceptance output.

# Exact inputs

- `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`
- `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`
- `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`
- `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`
- `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker`

# Falsification targets

Try to construct a conforming trace where a target becomes absent between validation and action, a direct control or fixture client creates an unowned server, a server/pane/marked child survives while H5 passes, H2 observes the withheld result indirectly, requester B acts before A is terminal, a late marked child escapes the fence, socket replacement is unlinked/adopted, observation-helper failure becomes absence, cleanup overwrites a failed primary oracle, v5 is promoted beyond its audit, or the <=800-line model forces silent policy invention.

Distinguish a genuine boundary blocker from future implementation details already required to fail closed. PASS only if no load-bearing counterexample remains and the exact boundary is safe to hand to a builder for static authoring only.

# Deliverable

Write `context-notes/precompact-v3-t35-h2-h5-boundary-skeptic` with status complete, exact reviewed versions, isolation statement, verdict PASS or FAIL, confidence, explicit adversarial traces, and `builder_task_eligible: true|false`. Update this task to done with the result summary. Do not sync the board; the orchestrator owns sync.

[tracked by](../tasks/pre-compact-multi-session.md)
