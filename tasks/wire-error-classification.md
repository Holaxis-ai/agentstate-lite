---
type: Task
title: >-
  Wire boundary: stop mapping plain server/worker errors to 400 USAGE (same
  class as the CLI boundary fix)
status: in_progress
priority: '3'
description: >-
  Implemented in PR #162 at exact head 76df3eadace858c1dc0950a66ab2e96d70c67264.
  The OSS reference router maps only InvalidInputError to 400 USAGE and unknown
  backend/server failures to retryable 500 RUNTIME; router-owned reserved-id,
  reserved-dir, and malformed doc/blob percent-encoding checks remain typed
  caller errors. Independent review at the prior SHA found that a non-string
  JSON document body could fall into an internal TypeError/500 and that the
  separate blob decoder lacked a pin. Follow-up commit 76df3ea explicitly
  rejects any present non-string body as 400 and tests both decoders. Follow-up
  review 4779354111 reports both findings resolved with no new findings.
  Validation: server 9/9, focused wire/retry suites green, red probe killed the
  old blanket mapping, and full npm run check passed including 18 browser E2E
  tests. Fresh exact-SHA CI is running; task remains in progress until merge.
actor: mike/codex
timestamp: '2026-07-25T13:50:59.966Z'
---

