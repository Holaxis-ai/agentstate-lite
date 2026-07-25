---
type: Task
title: Internal StorageBackend contract suite with Remote as the third consumer
status: in_progress
priority: '3'
description: >-
  GO decision after assertion-ownership matrix. Direct seam owner: document
  CRUD/version/CAS/create-if-absent/readMany/list/reserved/version-history plus
  explicit blob semantics; run against Filesystem, Memory, and Remote.
  Engine-agreement owner remains: scenario parity, writeDoc/deleteDoc guards,
  query re-filtering, malformed-doc behavior. Adapter-mechanic owner remains:
  filesystem locking/path/rename behavior, Memory copy/attribution details,
  future Postgres schema and transactions. Wire-mechanic owner remains: HTTP
  status/envelopes/headers, request shapes, pagination, retry, auth, security
  rejection, and transfer thinness. Meaningful consolidation exists because
  Remote currently repeats document CAS/create/delete/readMany/reserved/history
  and blob semantic assertions; those can move intact to one direct-seam
  authority. Capability declarations will not select hidden skips; stronger
  contracts are registered explicitly.
actor: codex
timestamp: '2026-07-25T02:58:24.848Z'
---
[implements](../designs/storage-backend-contract-testkit.md)

[reviewed by](../context-notes/storage-backend-contract-testkit-design-review.md)
