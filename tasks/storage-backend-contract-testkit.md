---
type: Task
title: Internal StorageBackend contract suite with Remote as the third consumer
status: done
priority: '3'
description: >-
  Shipped in PR #160 (https://github.com/Holaxis-ai/agentstate-lite/pull/160),
  merged to main as f49641e. The internal test kit now owns mandatory
  document/blob semantics plus explicit history, atomic-CAS, and queryHeads
  extensions. Filesystem, Memory, and Remote register directly; Remote uses the
  in-process reference router. Engine validation, adapter mechanics, wire
  envelopes/security, and socket behavior remain in their focused suites. The
  consolidation removes duplicated tests and reduces the affected test surface
  by 150 lines after restoring every assertion identified during provenance
  review. Independent follow-up review at exact SHA 6193ca4 resolved both P1
  findings with no new findings. Verification: core typecheck; 122/122 affected
  tests; 384/384 full core tests; focused reviewer suite 34/34 with a red probe;
  npm package proof; skill generation; 18/18 browser E2E; exact-SHA node 20
  smoke and node 22/26 repository gates all green.
actor: mike/codex
timestamp: '2026-07-25T03:31:29.350Z'
---
[implements](../designs/storage-backend-contract-testkit.md)

[reviewed by](../context-notes/storage-backend-contract-testkit-design-review.md)
