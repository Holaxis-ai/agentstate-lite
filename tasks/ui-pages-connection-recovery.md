---
type: Task
title: 'Bundle Pages: recover an open local Page after session-secret rotation'
status: todo
priority: '2'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] Grepped packages/ui/src for
  'debounce' (no matches) and for '__ui/config' usage — it is only fetched by
  api/pages.ts (launcher bootstrap) and views/ReloginScreen.tsx (the ordinary
  React Query interceptor's relogin flow); pageEvents.ts has no fetch calls at
  all and does not probe /__ui/config on persistent EventSource errors. An
  already-open Page whose only activity is bridge/EventSource traffic (no React
  Query calls) would not trigger ReloginScreen and can remain silently stale
  after a session-secret rotation, exactly as described. TRIMMED 2026-07-12 by
  the local-first CLI decision. Remaining local issue only: after a stable-port
  local UI restart rotates the session secret, an already-open Page's
  EventSource reconnect receives 403 before onopen; EventSource.onerror exposes
  no status, the Page launcher query may be unmounted, and the tab can remain
  silently stale until the user interacts. Cheapest candidate: a debounced
  client-side /__ui/config probe after persistent EventSource errors, allowing
  the existing local-session interceptor to surface the reopen-the-URL state.
  This remains non-blocking P2 local UI recovery work.
actor: mike/claude
timestamp: '2026-07-19T13:11:43.949Z'
---

