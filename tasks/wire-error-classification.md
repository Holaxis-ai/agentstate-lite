---
type: Task
title: >-
  Wire boundary: stop mapping plain server/worker errors to 400 USAGE (same
  class as the CLI boundary fix)
status: done
priority: '3'
description: >-
  Merged as PR #162 at reviewed exact head
  76df3eadace858c1dc0950a66ab2e96d70c67264. The OSS reference router now maps
  only InvalidInputError to 400 USAGE and unknown backend/server failures to
  retryable 500 RUNTIME; router-owned reserved-id, reserved-dir, malformed
  doc/blob percent-encoding, and non-string document-body inputs remain explicit
  400 caller errors. Independent follow-up review 4779354111 found both initial
  findings resolved with no new findings. Full local npm run check passed
  including 18 browser E2E tests, and exact-SHA CI passed on Node 22/26 plus the
  Node 20 built-CLI smoke.
actor: mike/codex
timestamp: '2026-07-25T13:57:07.001Z'
---

