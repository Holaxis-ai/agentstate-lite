---
type: Task
title: 'First shipped recipe: Personal Task System (agent-first, UI-writable)'
description: >-
  Third/final sequenced unit of roadmap-items/personal-task-system-recipe —
  ASSEMBLE + PACKAGE the hand-authored recipe AS A BUILT-IN. From the settled
  kinds (tasks/task-system-kind-design) + the board UI
  (tasks/task-system-board-ui), hand-author the recipe folder (recipe.md +
  conventions/*.md + views/), INSTANCE-FREE (structure only, no private data).
  SHIP AS A BUILT-IN: register it in the CLI's built-in recipe source (like
  context-notes / work-tracking / roadmap) so it resolves BY NAME — 'init
  --recipe personal-task-system' and 'recipe add personal-task-system' work
  WITHOUT a folder path. DoD: (1) init --recipe personal-task-system on a FRESH
  bundle works by name and produces a usable task-system bundle (kinds + Views
  live); (2) recipes command lists it as a built-in; (3) round-trip clean
  (idempotent re-add is changed:false). This is what the quickstart
  (tasks/npm-quickstart-onboarding) calls.
actor: mike/claude
status: todo
priority: '3'
timestamp: '2026-07-20T21:44:46.583Z'
---
[the first shipped recipe](../roadmap-items/recipe-plugins.md)

[doubles as the portability proof (bundle -> data-free recipe)](prove-recipe-plugin-sharing.md)

[working-memory layer is the next increment on top](../research/ai-power-user-patterns.md)

[export is the portable way to extract this recipe (vs hand-author)](recipe-export.md)

[depends on (packages the UI + kinds)](task-system-board-ui.md)
