---
type: Convention
title: Roadmap Item
governs: Roadmap Item
path: roadmap-items/
links:
  contains: Task
fields:
  required:
    - title
    - status
  optional:
    - description
    - sequence
  values:
    status:
      - queued
      - active
      - done
timestamp: '2026-07-06T21:19:50.296Z'
---

# Roadmap Item

A durable line of work spanning multiple tasks — the granular form of the single
`roadmap` spine doc. An item CONTAINS its tasks via links carrying the text `contains`
(a prose convention: the engine's links are untyped today — this recipe is the live test
of where that hurts). Backlinks from a task answer "which item owns this"; an item's
progress is DERIVED, never stored: list its contained tasks and read their statuses (the
rollup). `status` tracks the item itself: `queued` (not started) → `active` (any
contained task moving) → `done` (all contained tasks done or canceled).
