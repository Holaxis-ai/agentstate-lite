---
type: Task
title: >-
  Flaky ui e2e: 'session-rotating restart surfaces Connection lost'
  (pages.spec.ts:196) blocks gates intermittently
status: todo
priority: '2'
description: >-
  Empirical record (2026-07-15): the test is flaky ON PURE MAIN (cc4d441) —
  discriminating probe on a quiet machine: failed then passed on retry. Two
  other runs failed ALL 3 retries (blocking npm run check for the error-boundary
  branch, whose diff touches zero ui/server bytes); one run yesterday passed in
  230ms. Timing-sensitive: session-secret rotation + 'Connection lost' surfacing
  within a 30s timeout, timing out at a .page-back click; the sibling
  About-navigation test (pages.spec.ts:53) also went flaky once under load.
  Cost: coin-flip PR gates for every branch on a loaded machine. Fix direction:
  deterministic wait/event hook instead of timing assumptions, or quarantine
  with a retry budget while investigating. Traces preserved in the runs'
  test-results dirs.
actor: brian-claude
timestamp: '2026-07-15T13:11:57.632Z'
---

