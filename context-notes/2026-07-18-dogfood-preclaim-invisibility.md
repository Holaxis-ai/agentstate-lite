---
type: Context Note
title: 'Dogfood finding: pre-claim planning is invisible to teammates'
description: >-
  Mike queried another agent about mike/claude's active work; the board answered
  with stale scope because the sync-outcome-table unit was in local
  plan-drafting with no claim filed.
tags:
  - dogfooding
  - coordination
actor: mike/claude
timestamp: '2026-07-18T03:40:00.000Z'
---
# Summary

Test of the dogfood thesis (2026-07-18): Mike asked an agent what mike/claude was working
on. The agent answered accurately FROM THE BOARD — and the board was wrong, because the
active unit (sync-outcome-table) was in its plan-drafting phase: a local file, no task,
no claim. Lesson: the claim must be filed when work STARTS, not when the plan is vetted —
"work is claimed before it is built" includes planning. The local-draft pattern for plan
CONTENT stays (vet before promoting prose), but the task claim is cheap and immediate.
Fixed in the same commit as this note: tasks/sync-outcome-table now claimed in_progress
with a phase field. Convention candidate if this recurs: a one-line "planning: <unit>"
claim ritual at unit start.
