---
type: Task
title: >-
  Design the Personal Task System kind(s) + relationships (the data model —
  FIRST)
description: >-
  First sequenced unit of roadmap-items/personal-task-system-recipe. Settle the
  DATA MODEL before any UI. Reuse/refine the work-tracking Task kind plus any
  related kinds the system needs (e.g. Project, and the status/priority enums),
  the TYPED RELATIONSHIPS between them, required/optional fields, allowed enum
  values, expected body sections, and freshness horizons — grounded in the
  founder's real reference bundle's actual usage, generalized/simplified for a
  general user (instance-free — structure only). DoD: the kind convention docs
  (conventions/*.md) for the task system, reviewed against real usage, STABLE
  enough to build the board UI on without schema churn. This is the foundation
  the board View (tasks/task-system-board-ui) renders and writes back to.
actor: openai/codex
status: in_progress
priority: '1'
timestamp: '2026-07-20T21:43:00.504Z'
---
[implements recommended design](../designs/personal-task-system-kinds.md)

# Implementation evidence

- PR: https://github.com/Holaxis-ai/agentstate-lite/pull/132
- Commit under review: `07c8e0183f2301483adb79c76841a4074a7ebb31`
- Added the definitions-only Personal Task System source with exactly two portable Convention docs:
  `Task` and `Project`. No View, adjacent kinds, private instances, or plugin artifacts were added.
- The minimal `recipe.md` exists only to make the current external definitions-only parser validate
  and install both conventions as one coherent unit. The source is not registered as a built-in or
  distributed resource; the later packaging task can add the View and register the completed package
  in place.
- Focused tests prove strict recipe parsing, exact fields/enums/value descriptions/terminal states,
  typed links and link descriptions, inbound expectation, 30d/180d horizons, no required headings,
  zero installed instances, every lifecycle value, optional Project membership, and invalid enum or
  undeclared-field rejection.
- Verification: focused tests 2/2 passed; `npm run build`, `npm run typecheck`, and full
  `npm run check` passed (including package verification and 15 browser E2E tests).

Status remains `in_progress` pending independent review of the exact commit above.
