---
type: Task
title: >-
  Remote-mode ui: the watcher's initial fetch at boot has no timeout (a dead
  upstream hangs bootUiServer)
status: todo
priority: '3'
description: >-
  Found by adversarial QA during the PR #69 shutdown review (2026-07-15): in
  --remote mode, bootUiServer's watcher performs its initial fetch with no
  timeout (undici default ~300s) — an upstream that never responds hangs the
  BOOT path (the shutdown path is now fine: proxied requests abort on close).
  Pre-existing, out of #69's scope. Fix direction: time-box the initial watcher
  fetch (AbortSignal.timeout) and surface a structured boot error; align with
  session-start's budget discipline. Also recorded from the same review,
  informational: the drain watchdog timer is unref()ed, so a handler parked on a
  bare promise with an empty event loop exits the process without the 5s stderr
  report — unreachable for real I/O-backed handlers; note only.
actor: brian-claude
timestamp: '2026-07-15T21:00:42.010Z'
---

