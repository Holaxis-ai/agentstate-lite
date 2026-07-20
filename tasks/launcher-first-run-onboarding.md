---
type: Task
title: >-
  Launcher first-run: orient a new user (the UI teaches what they can do with
  AS)
description: >-
  The launcher (the 'ui' command's shell) is the FIRST VISUAL surface a new user
  sees after install+init, so its first-run quality is part of the onboarding
  journey — a bare list of Views is not 'productive.' Make the launcher ORIENT a
  newcomer: what AgentState is, what they can do (their agent creates/manages
  content; they can mark tasks done / edit right here — the human-agent
  collaboration loop), where their board/Views are, and a gentle EMPTY STATE
  when a fresh bundle has no data yet. Directly Mike's point: the UI itself
  instructs the user about what they can do with AS. TIGHT SCOPE (release-push):
  onboarding orientation + empty-state on the EXISTING launcher — NOT a launcher
  redesign. The fundamental UI rethink ('what replaces the kanban primitive') is
  roadmap-items/ui-rethink — separate and POST-window; do not fold that in. DoD:
  opening 'ui' on a fresh recipe'd bundle shows an orientation/empty-state that
  tells a new user what they can do and where to start; the onboarding test's
  'productive' assertion (tasks/npm-quickstart-onboarding) includes the launcher
  orienting, not just a bundle existing. Sequenced AFTER the task-board View
  exists (tasks/task-system-board-ui) so it orients toward something real.
actor: mike/claude
status: todo
priority: '2'
timestamp: '2026-07-20T21:52:45.972Z'
---
[the launcher IS the visual endpoint of 'productive'](npm-quickstart-onboarding.md)

[the first recipe's launcher a new user sees](../roadmap-items/personal-task-system-recipe.md)

[boundary: this is onboarding polish, NOT the ui-rethink redesign](../roadmap-items/ui-rethink.md)
