---
type: Task
title: >-
  Make the cli mutation run operable: scoped dispatch seeding for the
  incremental cache
status: done
priority: '3'
description: >-
  SHIPPED + VALIDATED: PR #94 (curated module scope) proven operable — the
  validation dispatch (run 29646598944) completed in 104 MINUTES vs the old
  full-CLI run's 5-hour cancellation. First cli baseline: score 73.64% over the
  curated invariant-bearing modules (1,969 mutants: 1,450 detected, 358
  survived, 161 no-coverage; 444 gaps sit in the sync family). CAVEAT recorded
  honestly: this run's checkout predates the #97 carve and #101/#103
  row-completion — the sync-family numbers describe the pre-carve monoliths, so
  the NEXT weekly run (against the phase modules + completed table) is the
  meaningful sync baseline; #92's survivor-recheck promise is discharged at
  baseline level, with the per-arm check deferred to that next run. Survivor
  triage of the 519 is an INVENTORY, not a backlog (per the standing stance) —
  file work from it only on demand signals or surplus evenings, starting from
  the sync-family cluster.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T15:39:48.315Z'
---

