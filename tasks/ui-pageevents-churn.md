---
type: Task
title: >-
  EventSource churn on page navigation: each page switch tears down and
  recreates the shared stream (rare resync flake)
status: todo
priority: '3'
description: >-
  Sibling finding from the session-rotation fix (2026-07-15): pages.spec.ts:53
  (About navigation) retains a separate rare flake — under 6-core artificial
  saturation, 2/50 runs: history navigation tears down and recreates the shared
  EventSource per page switch; a fatal-closed stream triggers the 3s reconnect +
  resync whose refetch died client-side (-1, no failure text) against a LIVE
  server. Pre-existing, absorbed by the e2e gate's retries:2. Fix direction:
  pageEvents should hold ONE durable stream across page navigations (the shell
  owns the EventSource; pages subscribe/unsubscribe) instead of churning
  connections. Evidence traces captured in the fix unit's record.
actor: brian-claude
timestamp: '2026-07-15T17:58:54.681Z'
---

