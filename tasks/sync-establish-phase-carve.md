---
type: Task
title: >-
  Carve sync.ts + sync-establish.ts into explicit phase functions
  (behavior-frozen)
status: done
priority: '2'
assignee: mike/claude
description: >-
  SHIPPED: PR #97 merged as cadcae7 (candidate 4ebd3b0). sync.ts (1205->8) and
  sync-establish.ts (919->4) are re-export shims over five phase modules in
  commands/sync/ (orchestrate: typed phase composition
  parse/inTree/provision/baseline/commit/pull/delta/push/receipt; converge;
  show-incoming; establish greenfield router; establish-committed marker
  states). NET -1 production LOC; real dedups (pushAndConfirmRemote byte-dup,
  writeAwarenessCache x3). Parity-contract ladder closed by ONE
  provenance-centered review (the tier's first full exercise): APPROVE NO-DRIFT
  — independently rebuilt base, 30 channels byte-identical, 26/26 load-bearing
  invariants retained through comment condensation (audited against the
  reviewer's own #92 catalog), not-carved zones token-identical, red probe
  proved frozen suites guard moved strings, blob-hash-verified test
  immutability. UNBLOCKED: the #92 copy-unification list (11+4 items) and
  test-file splits, in that order. Origin story recorded honestly: this unit was
  launched as an optionality purchase on expiring capacity after a
  churn-vs-value adjudication (see roadmap-items/change-surface-simplification
  for the standing restraint stance).
actor: mike/claude
timestamp: '2026-07-18T14:28:13.786Z'
---

