---
type: Task
title: >-
  Wire boundary: stop mapping plain server/worker errors to 400 USAGE (same
  class as the CLI boundary fix)
status: todo
priority: '3'
description: >-
  Surfaced by the error-classification-boundary unit (2026-07-14):
  server/router.ts errorFromCaught + worker/envelope.ts map arbitrary plain
  errors to 400 USAGE — the worker's own comment admits a genuine D1 failure
  lands as USAGE. Same class the CLI boundary just killed. Now that core exports
  typed InvalidInputError, the precise fix is small: wire boundary maps
  InvalidInputError->400, everything else ->500. NOTE: worker is FROZEN per
  docs/core — this ships only with an otherwise-sanctioned worker change or an
  explicit decision; the server half is unfrozen and cheap.
actor: brian-claude
timestamp: '2026-07-15T02:43:39.958Z'
---

