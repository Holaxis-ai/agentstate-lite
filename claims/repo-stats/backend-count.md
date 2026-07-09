---
type: Claim
title: >-
  Four StorageBackend implementations share one contract (Filesystem, Memory,
  Remote, D1R2)
status: active
reason: >-
  The four adapter files; quad parity tests pin byte-identical version tokens
  across them
evidence_command: >-
  ls packages/core/src/backend.ts packages/core/src/memory-backend.ts
  packages/core/src/remote-backend.ts packages/worker/src/d1r2-backend.ts | wc
  -l
evidence_commit: 1463bbd
timestamp: '2026-07-06T20:23:48.962Z'
---

