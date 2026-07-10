---
type: Task
title: >-
  Page bridge query: limit:0 silently returns empty (diverges from CLI --limit 0
  = unlimited)
status: todo
priority: '2'
description: >-
  Cross-surface limit inconsistency (usability footgun, not security — local
  read-only bridge, same author/victim; present on main). The CLI list/query
  --limit 0 means UNLIMITED and is documented so
  (packages/cli/src/commands/list.ts:73 + :322, 'limit > 0 ? rows.slice(0,limit)
  : rows'). But the ui page bridge treats limit:0 as slice(0,0) = SILENTLY
  EMPTY: normalizeQueryParams accepts limit >= 0
  (packages/ui/src/pages/bridge.ts:87) and applyRowFilters slices
  unconditionally when limit is a number (bridge.ts:147). So a page author who
  passes {limit: 0} expecting 'unlimited' (the CLI's contract) gets a blank
  result with NO error. This is the confusing '0 tasks against a 64-task board'
  seen when trialing brian-claude's Board page (pages/board.html). Fix: gate the
  slice on params.limit > 0 so 0 = unlimited, matching the CLI; keep negatives
  dropped (already are, via the >= 0 guard at :87 — consider making a negative a
  rejected/ignored no-op explicitly). Add a bridge unit test: limit:0 -> all
  rows, limit:3 -> 3 rows, limit absent -> all. One-line fix + test; ships via
  branch + PR + review gate. Surfaced from Brian's ui trial, 2026-07-10.
actor: mike/claude
timestamp: '2026-07-10T17:01:49.238Z'
---

