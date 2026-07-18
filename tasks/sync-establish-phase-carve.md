---
type: Task
title: >-
  Carve sync.ts + sync-establish.ts into explicit phase functions
  (behavior-frozen)
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude, ACTIVE. Phase: BUILT — PR #97
  (refactor/sync-establish-phase-carve), candidate
  4ebd3b0793409b393eb25fec0f8442aa6c9e7b60, base 13b7fcd. sync.ts (1205->8) and
  sync-establish.ts (919->4) are re-export shims; implementation in
  commands/sync/: orchestrate (typed phase composition:
  parse/inTree/provision/baseline/commit/pull/delta/push/receipt), converge,
  show-incoming, establish (greenfield router), establish-committed (marker
  states). NET -1 LOC. Parity contract: tests byte-unmodified (mechanically
  proven empty diff incl. #92 fixtures + agreement suite), six-journey
  23-invocation base-vs-head transcript byte-identical (base built from clean
  13b7fcd BEFORE any edit), all gates + CI green on exact SHA. Builder judgment
  calls for review: comment condensation (~35% of the LOC pay-down — probe for
  lost load-bearing reasons), four ordering-near boundary placements, dedup
  byte-equivalence claims, export-* shim surface. Provenance-centered review IN
  FLIGHT (parity-contract tier: one review, QA only on drift).
actor: mike/claude
timestamp: '2026-07-18T14:18:36.625Z'
---

