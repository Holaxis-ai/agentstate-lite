---
type: Task
title: 'Git sharing tier: bundle-in-a-git-repo as the OSS multi-human floor'
status: in_progress
priority: '1'
description: >-
  TIER 0 SHIPPED 2026-07-06 (board in git via byte channel; worker frozen). TIER
  0.5 SHIPPED 2026-07-07 (2f90e6f): the board lives IN the public repo at
  .agentstate-lite/, discovered bare on any clone; board writes are PUBLIC on
  push (write-time scrub discipline). TIER 1 sync verb SHIPPED 2026-07-08: U0
  porcelain foundation, U2 cursor/state store, U3a sync command, U3b converging
  conflicts + byte-exact exports (PR #16), U6 skill/docs (PR #17), per-clone
  state keying (PR #18), mount-portable worktrees + loud provisioning + remount
  self-heal (PR #19 + codex fix). Field-hardened same-week by a real
  private-tracker deployment (sandboxed agents, path remounts). REMAINING: U4
  SessionStart pull-then-render (in review, brian-claude,
  tasks/sync-sessionstart) and U5 migration of THIS repo to the board branch
  (Mike-gated, tasks/sync-migration). This umbrella closes when U5 lands and the
  bundle-commits-on-main convention retires.
actor: mike/claude
timestamp: '2026-07-09T15:13:42.267Z'
---
[design](../plans/sync-verb.md)

[binding implementation plan](../plans/sync-verb-implementation.md)

[design review evidence](../research/sync-verb-review.md)
