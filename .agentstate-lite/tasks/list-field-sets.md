---
type: Task
title: >-
  list --field set membership: comma = OR within a field (open tasks in one
  query)
status: todo
priority: '2'
description: >-
  Field finding from a real foreign-harness deployment (2026-07-08): an agent
  systematically probed for OPEN tasks and found the query layer is exact-match,
  single-value, AND-only — two --field status= flags AND to empty; !=negation
  parses as a literal. The minimal expressive fix: comma-separated set
  membership within one field (--field status=todo,in_progress,blocked = OR),
  AND across fields unchanged. Generic over any field; no negation, no ranges,
  no query language (client-side filtering remains the answer for those at
  current scales — the same restraint boundary as the parked graph-query). Pairs
  with tasks/status-terminal-declaration: once terminal statuses are declared,
  OPEN becomes a semantic rather than a hand-maintained OR-list.
actor: claude
timestamp: '2026-07-08T20:25:58.601Z'
---

