---
type: Task
title: >-
  Carve sync.ts + sync-establish.ts into explicit phase functions
  (behavior-frozen)
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude 2026-07-18. Split the two command files by existing
  responsibility — sync orchestration; conflict convergence + receipts;
  show-incoming; greenfield establishment; committed-folder
  establishment/recovery — into internal modules with explicit phase functions,
  typed inputs/results. Constraints (jointly specified by both review lines): NO
  new package, NO state-machine framework, NO duplicated state or compat layer;
  existing behavioral tests AND #92's fixtures/agreement suite BYTE-UNMODIFIED
  and green (side-effect ORDERING is pinned by the journey suites, not the
  fixtures — both bars apply); re-export shims where tests import command-module
  symbols; production LOC flat-to-down; outcome-table consumption unchanged.
  Review tier: parity-contract — builder + ONE provenance-centered review; no QA
  unless drift found.
actor: mike/claude
timestamp: '2026-07-18T13:24:43.746Z'
---

