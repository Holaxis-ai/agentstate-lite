---
type: Task
title: >-
  Remote-mode ui: the watcher's initial fetch at boot has no timeout (a dead
  upstream hangs bootUiServer)
status: done
priority: '3'
description: >-
  DONE — PR #121 merged 1680ee5 (2026-07-19), APPROVE. Boot-time watcher
  snapshot fetch bounded (AbortSignal.timeout, ~5s, test seam); on timeout boot
  DEGRADES honestly — server serves watcherless with the pre-existing [ui
  watcher] stderr line — never hangs, never silent. The ongoing poll loop keeps
  its own abort signal (unbounded long-lived watch untouched); --dir unchanged.
  Red-proof note: the reverted state hung the whole node --test process on a
  dangling fetch — the bug demonstrating itself. Same unbounded-wait class as
  the PR #117 stdin hang, second site cured.
actor: mike/claude
timestamp: '2026-07-19T14:57:33.809Z'
---

