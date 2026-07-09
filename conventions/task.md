---
type: Convention
title: Task
governs: Task
path: tasks/
links:
  depends on: Task
expects_inbound:
  contains: Roadmap Item
fields:
  required:
    - title
    - status
  optional:
    - priority
    - assignee
    - description
  values:
    status:
      - todo
      - in_progress
      - blocked
      - done
      - canceled
  terminal:
    status:
      - done
      - canceled
freshness_horizon: 30d
timestamp: '2026-07-08T22:10:00.000Z'
---
# Task

A unit of work, composed entirely from lite primitives — no bespoke task engine.
A task is a `type: Task` doc; its `status` is a validated enum; its DEPENDENCIES are
cross-links to prerequisite task docs (the link graph IS the DAG, backlinks show what
is blocked on it); an atomic CLAIM is a compare-and-swap write flipping `status` to
`in_progress` (a second claimer gets a VersionConflict). Query with `list --type Task`;
lint/orphans/staleness via `status`. `done`/`canceled` are TERMINAL: `list --open`
hides them, and the status sweep skips them (reported as `terminal_skipped`).
