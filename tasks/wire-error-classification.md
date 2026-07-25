---
type: Task
title: >-
  Wire boundary: stop mapping plain server/worker errors to 400 USAGE (same
  class as the CLI boundary fix)
status: in_progress
priority: '3'
description: >-
  Implemented in PR #162 (commit 2592972): the OSS reference router now maps
  only InvalidInputError to 400 USAGE and maps unknown backend/server failures
  to retryable 500 RUNTIME. Router-owned reserved-id, reserved-dir, and
  malformed percent-encoding checks remain typed caller errors. Agreement
  coverage proves the exact RUNTIME envelope and a real RemoteBackend
  retry-to-success path. Validation: focused server/wire suites passed; a red
  probe restoring blanket Error->400 failed both classification tests; full npm
  run check passed, including all 18 browser E2E tests. Awaiting independent
  exact-SHA review and CI before merge; the extracted/frozen hosted
  implementation remains outside this OSS task.
actor: mike/codex
timestamp: '2026-07-25T13:39:14.904Z'
---

