---
type: Task
title: >-
  Launcher first-run: orient a new user (the UI teaches what they can do with
  AS)
description: >-
  CURRENT FOCUS (Mike, 2026-07-21; see decisions/defer-builtin-recipes — the
  built-in recipe is deferred and this is what replaces it near-term): see what
  a lightweight in-launcher tutorial can do for onboarding. The launcher (the ui
  command shell) is the FIRST VISUAL surface a new user sees after install+init,
  so its first-run quality is part of the onboarding journey — a bare list of
  Views is not productive. Make the launcher ORIENT a newcomer: what AgentState
  is, what they can do (their agent creates/manages content; they can mark tasks
  done / edit right here — the human-agent collaboration loop), where their
  board/Views are, and a gentle EMPTY STATE when a fresh bundle has no data yet.
  Directly Mike point: the UI itself instructs the user about what they can do
  with AS. TIGHT SCOPE (release-push): onboarding orientation + empty-state on
  the EXISTING launcher — NOT a launcher redesign. The fundamental UI rethink
  (what replaces the kanban primitive) is roadmap-items/ui-rethink — separate
  and POST-window; do not fold that in. DoD: opening ui on a fresh bundle shows
  an orientation/empty-state/tutorial that tells a new user what they can do and
  where to start; the onboarding test productive assertion
  (tasks/npm-quickstart-onboarding) includes the launcher orienting, not just a
  bundle existing. Sequencing note: originally AFTER the task-board View
  (tasks/task-system-board-ui, still in_progress) so it orients toward something
  real; with the recipe deferral Mike is starting here directly.
actor: mike/claude
status: in_progress
priority: '1'
timestamp: '2026-07-21T15:57:23.644Z'
---
[the launcher IS the visual endpoint of 'productive'](npm-quickstart-onboarding.md)

[the first recipe's launcher a new user sees](../roadmap-items/personal-task-system-recipe.md)

[boundary: this is onboarding polish, NOT the ui-rethink redesign](../roadmap-items/ui-rethink.md)
