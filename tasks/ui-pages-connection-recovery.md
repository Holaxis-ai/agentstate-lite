---
type: Task
title: 'Bundle Pages: recover an open local Page after session-secret rotation'
status: todo
priority: '2'
description: >-
  TRIMMED 2026-07-12 by the local-first CLI decision. The former second finding
  (`--remote` Worker 403 role denial being mistaken for a local launcher-session
  403) becomes obsolete when `ui --remote` leaves the default CLI.


  Remaining local issue only: after a stable-port local UI restart rotates the
  session secret, an already-open Page's EventSource reconnect receives 403
  before `onopen`; `EventSource.onerror` exposes no status, the Page launcher
  query may be unmounted, and the tab can remain silently stale until the user
  interacts. Cheapest candidate: a debounced client-side `/__ui/config` probe
  after persistent EventSource errors, allowing the existing local-session
  interceptor to surface the “reopen the URL” state. This remains non-blocking
  P2 local UI recovery work.
actor: codex
timestamp: '2026-07-12T20:01:58.775Z'
---

