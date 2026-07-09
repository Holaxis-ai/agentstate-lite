---
type: Task
title: 'Git sharing tier: bundle-in-a-git-repo as the OSS multi-human floor'
status: in_progress
priority: '1'
description: >-
  TIER 0 SHIPPED 2026-07-06 (board in git via byte channel; worker frozen). TIER
  0.5 SHIPPED 2026-07-07 (2f90e6f): the board lives IN the public repo at
  .agentstate-lite/, discovered bare on any clone; board writes are PUBLIC on
  push (write-time scrub discipline). TIER 1 sync verb: U0-U3b, U6, per-clone
  keying, loud provisioning (PRs 16-19), U4 SessionStart pull-then-render (PR
  #24) all SHIPPED; U5 sync --migrate COMMAND SHIPPED 2026-07-09 (TEMPORARY
  founders-only flag, tasks/sync-migration) — Tier 1 completes when the founders
  EXECUTE the migration of THIS repo (human-timed: run --migrate --yes, merge
  the board-migration PR, pull + sync). This umbrella closes when that execution
  lands and the bundle-commits-on-main convention retires.
actor: builder-u5
timestamp: '2026-07-09T17:17:57.202Z'
---
[design](../plans/sync-verb.md)

[binding implementation plan](../plans/sync-verb-implementation.md)

[design review evidence](../research/sync-verb-review.md)
