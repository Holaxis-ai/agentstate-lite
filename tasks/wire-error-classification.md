---
type: Task
title: >-
  Wire boundary: stop mapping plain server/worker errors to 400 USAGE (same
  class as the CLI boundary fix)
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] packages/server/src/router.ts's
  errorFromCaught (lines 126-137) still does the blanket mapping: any err
  instanceof Error (that isn't VersionConflict or ENOENT-shaped) -> 400 USAGE,
  with the function's own doc comment (lines 119-124) still describing that as
  the design. core/src/index.ts:174 exports InvalidInputError but router.ts
  never imports or checks it. worker/envelope.ts does not exist anywhere in this
  OSS repo (the former Cloudflare worker was extracted to the private frozen
  reference per CLAUDE.md) — the worker half of this task is now entirely moot
  for this repo, exactly as the task's own NOTE anticipated; only the server
  half remains live and unfrozen. Surfaced by the error-classification-boundary
  unit (2026-07-14): server/router.ts errorFromCaught and worker/envelope.ts map
  arbitrary plain errors to 400 USAGE. Same class the CLI boundary just killed.
  Now that core exports typed InvalidInputError, the precise fix is small: wire
  boundary maps InvalidInputError->400, everything else->500. NOTE: worker is
  FROZEN per docs/core; this ships only with an otherwise-sanctioned worker
  change or an explicit decision; the server half is unfrozen and cheap.
actor: mike/claude
timestamp: '2026-07-19T13:11:57.839Z'
---

