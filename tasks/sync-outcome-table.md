---
type: Task
title: 'Sync outcome table: one enumerable authority for refusal/guidance states'
status: done
priority: '2'
assignee: mike/claude
description: >-
  SHIPPED: PR #92 merged (reviewed 67f528a + confirmed fixup 9d317da). The
  sync-family's 59 refusal/guidance envelope constructions across
  sync.ts/sync-establish.ts/home.ts now live in ONE CLI-side table
  (cli/src/sync-outcomes.ts) composing the package factories, byte-frozen. Full
  ladder: plan v1 -> design review NEEDS-REWORK (architecture corrected:
  CLI-side placement, per-site keys, no details.state expansion) -> v2 +
  resolution check APPROVE -> build (70 pre-refactor fixtures, 48-section
  battery) -> build review APPROVE-WITH-NITS (fixture provenance PROVEN: 67/70
  regenerated from base; 41-section independent battery; red probes 3/3) ->
  fixup independently confirmed -> adversarial QA SHIP (routing equivalence: 478
  runs, ~90 states incl. combination/hostile-content/path-of-entry/environmental
  attacks, ZERO differences; harness validity red-probed). Consumers net -239
  lines; agreement-test pattern's first instance (coordinated on
  tasks/agreement-test-convention); follow-up copy-unification list filed in the
  PR. POST-MERGE PROMISE: when mutation run 29628092134's cli job lands,
  re-check survivors in sync.ts/sync-establish.ts against the new suite (rows
  make pins cheap). QA odd-but-equal observations recorded in the QA report for
  future grooming.
actor: mike/claude
timestamp: '2026-07-18T05:04:24.608Z'
---

