---
type: Task
title: Repair Review portfolio batching and aggregation
status: in_progress
priority: '1'
assignee: review-view-builder
actor: review-view-builder
timestamp: '2026-08-08T18:04:48.822Z'
---
# Objective

Produce inert candidate Review portfolio bytes that satisfy the accepted batching and aggregation contract.

# Acceptance

Implement exact-id transport checks, deterministic sequential batches of at most 32, maximum one request in flight, first-failure stop, 1,000 accepted rows per direction, independent strict validation, multiset-max cross-direction reconciliation, visible recovery, and fail-closed currentness. Promote only the inert candidate/harness blobs after green integration; do not replace the live registered View.

[governed by](../plans/review-portfolio-bridge-identity-repair.md)

[depends on](review-portfolio-view-red-harness.md)
