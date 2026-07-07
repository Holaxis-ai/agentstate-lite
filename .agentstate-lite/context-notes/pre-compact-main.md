---
type: Context Note
title: 'pre-compact-main: sync-verb planning arc closed 2026-07-07'
timestamp: '2026-07-07T21:29:25.228Z'
---
# Summary

Session 2026-07-07 (Brian + orchestrator + agent team) closed the sync-verb planning arc.
State at this note: design v2.2 FINAL (two-round 4-reviewer panel + DevX pass; all
verdicts CONFIRM after adjudication); canonical implementation plan is
[plans/sync-verb-implementation](../plans/sync-verb-implementation.md) (vetted Phase B —
read THAT, not the conversation, to build); 9 task docs created under tasks/sync-* +
tasks/roadmap-recipe, all todo, contains-linked from roadmap-items/local-first-loop
(roadmap-recipe from claims-provenance), depends-on edges carry the build order.

Load-bearing adjudications a future session must not re-litigate casually:
- Conflict staging: U3a ships DETECT+clean-abort+CONFLICT(5) interim guard (zero data
  movement); U3b ships the converging keep-upstream mechanic with the EXACT explicit-ref
  sequence (rebase INVERTS ours/theirs — export `git show :3:` first, then
  `checkout origin/board --`) + the 3-assert byte-level convergence test. Evidence:
  [research/sync-verb-review](../research/sync-verb-review.md).
- Explicit origin/board refs everywhere, never @{u}. One in-process pull-then-render
  SessionStart subcommand (≤7s budget, guaranteed fall-through).
- tasks/git-sharing stays in_progress; U5 (Mike-gated: decisions/board-branch-sync)
  closes it and updates docs/core.

Next actions: (1) Brian opens the PR for branch board/sync-verb-tasks (description
delivered in-session); (2) Mike confirms decisions/board-branch-sync; (3) first build
unit = tasks/sync-test-harness (no deps, no gates). Session-restart orientation: read
this note, then `list --type Task --field status=todo`, then the canonical plan.
