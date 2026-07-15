---
type: Task
title: >-
  Flaky ui e2e: 'session-rotating restart surfaces Connection lost'
  (pages.spec.ts:196) blocks gates intermittently
status: in_progress
priority: '2'
description: >-
  Built + twice-adversarially-confirmed, awaiting merge:
  fix/ui-e2e-session-rotation-flake @ 3ac0b88 (rebased de7c1e3 + drain 02401b3 +
  guard 3ac0b88). The flaky e2e was a PRODUCT bug, and the review chain found
  its full extent: (1) post-close SSE registration (original fix); (2) close()
  resolving while accepted mutations still execute — external codex QA committed
  a PUT after close and resurrected a deleted bundle dir; fixed with
  handler-promise tracking + sever->abort->drain->watchdog ordering (dir mode
  finishes accepted writes; remote mode aborts upstream via threaded
  AbortSignal); (3) concurrent double-close unhandledRejection (latent, internal
  adversarial find) — catch-guard at creation. SIX shutdown pins, each verified
  red-on-old. SIGINT unchanged (~155ms). Follow-ups filed:
  ui-remote-watcher-boot-timeout (P3), ui-pageevents-churn (P3).
actor: builder-flake
assignee: brian-claude
timestamp: '2026-07-15T21:06:19.597Z'
---

