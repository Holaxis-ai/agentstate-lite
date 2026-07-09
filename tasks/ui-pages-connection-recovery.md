---
type: Task
title: >-
  Bundle pages: two connection-recovery edge cases (SSE dead-end + --remote 403
  advice)
status: todo
priority: '2'
description: >-
  Two non-blocking residuals from the launcher-branding review (2026-07-09),
  both in the shell's session-recovery UX; ship the UI without them, fix after.
  (1) SSE reconnect dead-end: after a stable-port restart that ROTATES the
  secret, an open page's /events reconnect 403s before onopen and
  EventSource.onerror carries no status, so the shell JS can't observe it — with
  the page open the launcher pagesQuery is unmounted so nothing polls, and the
  tab stays SILENTLY stale until the user touches the shell (which then lands on
  the correct 'reopen the URL' screen). Cheaper fix than the
  server-force-close-SSE protocol change: a debounced client-side probe fetch to
  /__ui/config on persistent EventSource error, which surfaces the status and
  trips the existing interceptor. (2) interceptor.ts assumes a /v0 403 is ALWAYS
  the local session gate — false in --remote mode: proxy.ts relays the worker's
  403 verbatim, and the worker 403s for insufficient ROLE
  (role-revoked-but-valid key), so an admin-scenario user sees 'reopen the URL'
  (wrong advice; stopping polling is still right). Fix: a distinct envelope code
  for the local session gate so the interceptor distinguishes it. Rare, not
  merge-blocking.
actor: mike/claude
timestamp: '2026-07-09T22:53:33.093Z'
---

