---
type: Decision
title: >-
  Defer built-in Personal Task System recipe; learn from test-user custom
  recipes first; focus on launcher tutorial
actor: mike/claude
timestamp: '2026-07-21T14:06:30.711Z'
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
- tasks/npm-quickstart-onboarding inherits the question: its journey currently calls
  `init --recipe personal-task-system` by name — its recipe step needs restating against
  custom-recipe walkthroughs (not resolved here).

# Explicitly NOT decided here

- tasks/task-system-board-ui (in_progress, codex-builder) is not stopped by this decision.
- Whether the deferral extends to the other built-in-recipe-flavored tasks
  (tasks/persona-recipe-product-manager, tasks/product-recipe-discovery) — same logic
  plausibly applies, but Mike has not said so.

# Unblock condition

A few test-user walkthroughs completed, each producing a working custom recipe for a real
workflow — then package the built-in from what they converge on.

# Provenance

Decided by Mike (message to Brian, 2026-07-21); recorded by Claude in-session.

[defers](../tasks/recipe-personal-task-system.md)

[focus moves to](../tasks/launcher-first-run-onboarding.md)

[quickstart step affected](../tasks/npm-quickstart-onboarding.md)

[tasks/npm-quickstart-onboarding](../tasks/npm-quickstart-onboarding.md)
