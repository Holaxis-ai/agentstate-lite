---
type: Decision
title: >-
  Defer built-in Personal Task System recipe; learn from test-user custom
  recipes first; focus on launcher tutorial
actor: openai/codex
timestamp: '2026-07-26T22:08:26.698Z'
---
# Decision

Defer shipping the Personal Task System recipe as a BUILT-IN
(tasks/recipe-personal-task-system stays specced but blocked). Near-term focus moves to the
launcher: what a lightweight in-launcher tutorial / first-run orientation can do for
onboarding (tasks/launcher-first-run-onboarding).

# Rationale

Mike attempted the built-in recipe assembly and concluded the productized shape should be
LEARNED, not guessed: get a few test users, understand their actual workflows, and walk
through building a CUSTOM recipe for each of their use cases. The built-in gets packaged
from what those walkthroughs teach, instead of freezing today's guess into the CLI's
built-in recipe source.

# What changes now

- tasks/recipe-personal-task-system → blocked, unblock condition below. The spec (kinds +
  board UI → instance-free recipe folder → built-in registration) stays valid.
- tasks/launcher-first-run-onboarding → priority 1; the "lightweight tutorial" is this
  task's scope.
- tasks/npm-quickstart-onboarding no longer waits for this built-in: its deterministic release
  proof uses the already-shipped `work-tracking` recipe by name. Custom-recipe walkthroughs are
  the separate product-learning loop.

# Explicitly NOT decided here

- tasks/task-system-board-ui (in_progress, codex-builder) is not stopped by this decision.
- Whether the deferral extends to the other built-in-recipe-flavored tasks
  (tasks/persona-recipe-product-manager, tasks/product-recipe-discovery) — same logic
  plausibly applies, but Mike has not said so.

# Unblock condition

A few test-user walkthroughs completed, each producing a working custom recipe for a real
workflow — then package the built-in from what they converge on.

# Release-path reconciliation (2026-07-26)

Mike approved reconciling the roadmap with this decision. Personal Task System packaging is not a
release-push non-negotiable. The npm quickstart proves today's real install-to-productive path with
`work-tracking`; test-user custom-recipe sessions provide the evidence for any richer built-in.

# Provenance

Decided by Mike (message to Brian, 2026-07-21); recorded by Claude in-session.

[defers](../tasks/recipe-personal-task-system.md)

[focus moves to](../tasks/launcher-first-run-onboarding.md)

[quickstart step affected](../tasks/npm-quickstart-onboarding.md)

[tasks/npm-quickstart-onboarding](../tasks/npm-quickstart-onboarding.md)
