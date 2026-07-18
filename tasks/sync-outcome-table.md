---
type: Task
title: 'Sync outcome table: one enumerable authority for refusal/guidance states'
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude, ACTIVE. Phase: plan v2+edits APPROVED-FOR-PROMOTION
  (design review needs-rework -> v2 -> resolution check: all nine findings
  resolved; two required boundary edits + two nits folded). PROMOTED as
  plans/sync-outcome-table. Architecture: CLI-side table
  (packages/cli/src/sync-outcomes.ts) composing package factories as rows;
  internal per-site keys; details.state only where it exists today; rows carry
  CliErrorCode, never exit; rendered-byte per-row fixtures (fixture-FIRST:
  captured from pre-refactor code); marker-string boundary = templates in,
  record assembly out; QA mandatory scoped to routing-equivalence under
  constructed unenumerated/combination states. BUILD LAUNCHING now; cli survivor
  map consumed when run 29628092134 lands.
actor: mike/claude
timestamp: '2026-07-18T03:21:29.333Z'
---

