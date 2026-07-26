---
type: Roadmap Item
title: 'Personal Task System recipe: human-agent collaborative, hand-authored'
description: >-
  Architecture and UX foundations are complete; built-in packaging is parked
  until custom-recipe walkthroughs with test users reveal a reusable product
  shape. It is no longer a release blocker.
actor: openai/codex
status: queued
timestamp: '2026-07-26T22:08:13.101Z'
---
# Current state

The architecture and UX foundations are complete, but built-in packaging is deliberately parked.
The release path does not wait for this recipe. Per `decisions/defer-builtin-recipes`, a few
test-user walkthroughs should first produce custom recipes for real workflows; package the
Personal Task System only from the structure those sessions show to be reusable.

# Sequence (data first, then UI, then evidence, then package)

1. tasks/task-system-kind-design — data model. Done.
2. tasks/task-system-board-ui — collaborative board View and human write-back. Done.
3. Test-user walkthroughs — build custom recipes for actual workflows and record convergence.
4. tasks/recipe-personal-task-system — unblock only after that evidence; hand-author and package
   the reusable recipe by name.

[sequenced unit 1 (data model)](../tasks/task-system-kind-design.md)

[sequenced unit 2 (board UI + write-back)](../tasks/task-system-board-ui.md)

[sequenced unit 3 (package)](../tasks/recipe-personal-task-system.md)

[data-model decision](../designs/personal-task-system-kinds.md)

[deferral and unblock condition](../decisions/defer-builtin-recipes.md)
