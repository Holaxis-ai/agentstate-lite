---
type: Task
title: 'board-git PR C: in-tree read-side mode'
status: in_progress
priority: '4'
description: >-
  CLAIMED mike/claude 2026-07-16; B merged — detection exists, unreached. Scope
  per plans/board-git-package v3: wire detectBoardChannel into
  sync/establish/session-start/home AT THE POINT sync resolves today (act-time
  probe authoritative — B review TOCTOU note); in-tree read-side semantics:
  fetch-and-report awareness over the prefix-aware diffDocsBetween
  (prefix-stripped ids, reserved-after-strip), mode-scoped cursor tier
  git-intree, selfActors via injected post-persist hook at the command/bundle
  orchestration boundary (mutate.ts stays git-unaware; fires only on substantive
  persisted mutations, best-effort, no network), prefix-scoped backstop counts,
  upstream decision table (tracking config or report-nothing; never guess
  origin/<branch>), write verbs refuse with guidance, --pull-only degrades to
  fetch-and-report, --establish refuses under indeterminate, NO autopull v1
  (zero-spawn pre-gate invariant), home/session-start in-tree probe +
  first-contact copy. Copy work: finalize B's draft dual/indeterminate strings;
  fix the pre-share message when no origin is configured (pre-existing mislead);
  details.state discriminator handled explicitly. Rides SKILL regen
  (check:skill). Adversarial tests ship in the same unit: refusal paths,
  mode-flip cursor isolation, both ambiguity arms, no-upstream/detached
  degradation, dead-remote time-box.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T04:34:04.423Z'
---
[depends on](board-git-b-channel-detection.md)
