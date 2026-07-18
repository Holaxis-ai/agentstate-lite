---
type: Task
title: >-
  Carve sync.ts + sync-establish.ts into explicit phase functions
  (behavior-frozen)
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude — ACTIVE (relaunched 2026-07-18 after a decision wobble
  worth recording honestly: built->stopped->relaunched in one evening.
  Adjudication: this unit is an OPTIONALITY PURCHASE, not demand-driven work —
  safe, fully specified, mechanically harnessed (#92's fixtures + the journey
  suites), executed because surplus/expiring capacity on the claude line makes
  its marginal cost near zero. Both prior verdicts were correct under their
  unstated assumptions: 'churn' under scarce budget, 'free option' under
  expiring budget — the budget fact decides, and it is now stated.) Spec: split
  sync.ts + sync-establish.ts by existing responsibility (orchestration;
  conflict convergence + receipts; show-incoming; greenfield establishment;
  committed-folder establishment/recovery) into internal modules with explicit
  typed phase functions. Constraints (both review lines): NO new
  package/framework/dup-state/compat layer; ALL existing tests AND #92 fixtures
  BYTE-UNMODIFIED and green (fixtures pin rendered outcomes; journey suites pin
  side-effect ORDERING — both bars); re-export shims; production LOC
  flat-to-down; outcome table untouched. Review: parity-contract tier — one
  provenance-centered review, no QA unless drift.
actor: mike/claude
timestamp: '2026-07-18T13:31:59.236Z'
---

