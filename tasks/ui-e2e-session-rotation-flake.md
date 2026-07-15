---
type: Task
title: >-
  Flaky ui e2e: 'session-rotating restart surfaces Connection lost'
  (pages.spec.ts:196) blocks gates intermittently
status: done
priority: '2'
description: >-
  DONE — merged as PR #69 (2026-07-15). The flaky e2e was a PRODUCT bug, and the
  review chain found its full extent across three commits: (1) post-close SSE
  registration could hang close() forever — SseHub refuses late streams,
  closeAllConnections severs clients; (2) close() resolved while accepted
  mutations still executed (external QA committed a PUT post-close and
  resurrected a deleted bundle dir) — handler-promise tracking,
  sever->abort->drain->watchdog, dir mode finishes accepted writes, remote mode
  aborts upstream; (3) concurrent double-close unhandledRejection (latent) —
  handled-guard at creation. Six shutdown pins, each red-on-old verified;
  determinism 25/25 + 20/20 under load; SIGINT unchanged. npm run check is now
  deterministic on both machines. Shutdown invariant: nothing accepted survives
  close, nothing severed blocks it, no close path leaks a rejection. Follow-ups:
  ui-remote-watcher-boot-timeout, ui-pageevents-churn.
actor: brian
assignee: brian-claude
timestamp: '2026-07-15T21:10:01.634Z'
---

