---
type: Task
title: >-
  Launcher first-run: orient a new user (the UI teaches what they can do with
  AS)
description: >-
  IN PROGRESS — PR-A MERGED to main 2026-07-21 (PR #135, merge 80ba7e9, reviewed
  SHA c62eb86; records: context-notes/pr-135-build + pr-135-review). Shipped:
  flat badged view grid (capability grouping retired; live data / can edit /
  artifact badges off the enforced bridge field), first-run orientation
  (in-tree-safe privacy promise, no-agent fallback, per-root localStorage
  dismissal), live activity feed (debounced invalidate-and-refetch over SSE,
  conventions/registry filtered), token-contract gate (red-probed), plus 3
  visual-smoke fixes (card-title cascade leak — pre-existing on main,
  back-button label, compact timestamps). Verified: CI green on exact SHA, ui
  99/99, e2e 17/17 over built CLI, independent review APPROVE with both
  red-probes fired. REMAINING for this unit: PR-B per plans/home-surface-build
  rev 2 (sharing chip + 9-row truth table, where-is-this disclosure, collapsed
  workspaces block via CLI-injection seam) + the accepted review follow-ups
  riding it (feed-poll doc sentence, remote-mode orientation comment, test
  nits). Naming still provisional pending test users.
actor: mike/claude
status: in_progress
priority: '1'
timestamp: '2026-07-21T16:33:32.119Z'
---
[the launcher IS the visual endpoint of 'productive'](npm-quickstart-onboarding.md)

[the first recipe's launcher a new user sees](../roadmap-items/personal-task-system-recipe.md)

[boundary: this is onboarding polish, NOT the ui-rethink redesign](../roadmap-items/ui-rethink.md)
