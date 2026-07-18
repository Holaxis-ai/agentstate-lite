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
  report. PREFERRED FIX (simplest, both lines agree): stop trying to mutate the
  whole CLI — curate a small DANGEROUS-MODULE list (candidates: the sync family,
  board-git once it has a config, paths/id grammar, errors/exit mapping) and run
  only those, on demand or weekly, via the workflow's EXISTING mutate-glob
  dispatch input. No new orchestration; a seeding sequence for the full
  incremental cache is the fallback only if module selection proves
  insufficient. Record measured per-module costs. Belongs to
  plans/test-suite-confidence (item 2's operational completion); coordinate with
  tasks/mutation-testing's survivor-recheck promise.
actor: mike/claude
timestamp: '2026-07-18T13:28:48.569Z'
---

