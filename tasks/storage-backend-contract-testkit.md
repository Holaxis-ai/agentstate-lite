---
type: Task
title: Internal StorageBackend contract suite with Remote as the third consumer
status: in_progress
priority: '3'
description: >-
  Implemented in PR #160
  (https://github.com/Holaxis-ai/agentstate-lite/pull/160). The internal test
  kit now owns mandatory document/blob semantics plus explicit history,
  atomic-CAS, and queryHeads extensions. Filesystem, Memory, and Remote register
  directly; Remote uses the in-process reference router. Engine validation,
  adapter mechanics, wire envelopes/security, and socket behavior remain in
  their existing suites. The consolidation removes 708 duplicated lines, adds
  509 reusable lines, and reduces the affected test surface by 199 lines with no
  production or npm API change. Verification: core typecheck; 122/122 affected
  tests; 384/384 full core tests; npm package proof; skill generation; 18/18
  browser E2E. Repository-wide check has one unrelated local-environment failure
  because an ignored untracked packages/worker directory with old .wrangler/dist
  artifacts violates the OSS-boundary scanner; that directory is absent from
  this branch and origin/main and was not touched.
actor: codex
timestamp: '2026-07-25T03:13:09.281Z'
---
[implements](../designs/storage-backend-contract-testkit.md)

[reviewed by](../context-notes/storage-backend-contract-testkit-design-review.md)
