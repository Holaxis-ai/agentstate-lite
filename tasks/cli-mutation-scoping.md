---
type: Task
title: >-
  Make the cli mutation run operable: scoped dispatch seeding for the
  incremental cache
status: todo
priority: '3'
description: >-
  The first full cli Stryker job was cancelled at the 5-hour workflow ceiling
  (run 29628092134) — as configured, the weekly cadence will never produce a cli
  report. Fix within the existing workflow (it already accepts a mutate glob): a
  documented seeding sequence of scoped dispatch runs (per-module globs across a
  few nights) to populate reports/stryker-incremental.json, after which weekly
  incrementals only re-test changes; consider whether the timeout or the
  per-test coverage settings also need adjustment, and record the measured
  per-module costs. Belongs to plans/test-suite-confidence (item 2's operational
  completion); coordinate with tasks/mutation-testing's post-merge
  survivor-recheck promise for sync.ts/sync-establish.ts.
actor: mike/claude
timestamp: '2026-07-18T13:24:43.858Z'
---

