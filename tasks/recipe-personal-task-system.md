---
type: Task
title: 'First shipped recipe: Personal Task System (agent-first, UI-writable)'
description: >-
  DEFERRED 2026-07-21 (Mike -> Brian; see decisions/defer-builtin-recipes): do
  NOT package the built-in yet. Mike attempted the assembly and concluded the
  productized shape should be learned first — get a few test users, understand
  their workflows, and walk through building a CUSTOM recipe per use case;
  package the built-in from what those walkthroughs converge on (that is the
  unblock condition). Near-term focus moves to the launcher tutorial
  (tasks/launcher-first-run-onboarding). ORIGINAL SPEC (unchanged, for when this
  wakes): third/final sequenced unit of
  roadmap-items/personal-task-system-recipe — ASSEMBLE + PACKAGE the
  hand-authored recipe AS A BUILT-IN. From the settled kinds
  (tasks/task-system-kind-design) + the board UI (tasks/task-system-board-ui),
  hand-author the recipe folder (recipe.md + conventions/*.md + views/),
  INSTANCE-FREE (structure only, no private data). SHIP AS A BUILT-IN: register
  it in the CLI built-in recipe source (like context-notes / work-tracking /
  roadmap) so it resolves BY NAME. DoD: (1) init --recipe personal-task-system
  on a FRESH bundle works by name and produces a usable task-system bundle
  (kinds + Views live); (2) recipes command lists it as a built-in; (3)
  round-trip clean (idempotent re-add is changed:false). This is what the
  quickstart (tasks/npm-quickstart-onboarding) calls.
actor: mike/claude
status: blocked
priority: '3'
timestamp: '2026-07-21T14:06:21.899Z'
---
[the first shipped recipe](../roadmap-items/recipe-plugins.md)

[doubles as the portability proof (bundle -> data-free recipe)](prove-recipe-plugin-sharing.md)

[working-memory layer is the next increment on top](../research/ai-power-user-patterns.md)

[export is the portable way to extract this recipe (vs hand-author)](recipe-export.md)

[depends on (packages the UI + kinds)](task-system-board-ui.md)
