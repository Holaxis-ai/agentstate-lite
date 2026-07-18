---
type: Task
title: 'Sync outcome table: one enumerable authority for refusal/guidance states'
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude 2026-07-18, ACTIVE. Phase: plan v1 reviewed NEEDS-REWORK
  (excellent catch set: details.state absent from most in-scope states — v1's
  acceptance criteria self-contradicted; package-side table cannot express
  USAGE-coded states without taxonomy surgery; mutation run does not cover
  porcelain.ts; QA waiver was tier-inconsistent). Plan v2 drafted with the
  reviewer's architecture: table lives CLI-SIDE
  (packages/cli/src/sync-outcomes.ts) composing the package factories as rows;
  internal per-site row keys, details.state emitted only where it exists today;
  rows carry code but never exit (CODE_EXIT stays the one mapping);
  rendered-byte per-row fixtures as the parity bar (construction-order hazard);
  scope corrected (foreign/foreign_checkout arms in, alreadyShared
  receipt-records and nonexistent establish-under-indeterminate out); QA
  mandatory, scoped to state-construction/routing attacks; porcelain arms
  hand-audited in lieu of survivor data. v2 sent back for resolution check;
  build starts after it passes + cli survivor map lands (run 29628092134).
actor: mike/claude
timestamp: '2026-07-18T03:18:47.858Z'
---

