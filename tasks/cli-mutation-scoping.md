---
type: Task
title: >-
  Make the cli mutation run operable: scoped dispatch seeding for the
  incremental cache
status: in_progress
priority: '3'
description: >-
  FIX MERGED (PR #94): the cli Stryker config's default mutate list is now a
  curated set of invariant-bearing modules (errors, mutate/board-attribution,
  bundle resolution, actor, sync family, outcome table) — the whole-CLI default
  was proven inoperable (first run cancelled at the 300-min ceiling, zero
  report). Anything else stays measurable via the workflow's existing mutate
  dispatch input, which overrides the config. Also fixed the stale cache-key
  header comment. VALIDATION IN FLIGHT: dispatch run 29646598944 (target=cli) is
  the empirical proof — it must complete within the ceiling and produce the
  first-ever cli survivor report; record its actual cost here when it finishes,
  then flip this task done. That report also discharges tasks/mutation-testing's
  survivor-recheck promise for sync.ts/sync-establish.ts (every in-scope arm is
  row+fixture-pinned since #92 — expected outcome: few or no actionable
  survivors in converted arms).
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T13:41:12.077Z'
---

