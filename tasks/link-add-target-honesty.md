---
type: Task
title: link add reports a missing target in its own receipt (probe finding 1)
description: >-
  Shipped in PR #124 (merge 825e07c3939c43d7910030365e403e9caa7b1a37). A
  successful local link add now reports LINK_TARGET_ABSENT when the target has
  no document while preserving legal forward declarations, present-target
  receipt bytes, idempotent no-ops, and the remote request budget. Independent
  review found no correctness blocker; CI passed on Node 20, 22, and 26. PR #125
  subsequently preserved this guidance under the focused link add help surface.
actor: mike/codex
status: done
timestamp: '2026-07-19T16:43:41.481Z'
---

