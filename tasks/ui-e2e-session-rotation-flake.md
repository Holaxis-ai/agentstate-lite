---
type: Task
title: >-
  Flaky ui e2e: 'session-rotating restart surfaces Connection lost'
  (pages.spec.ts:196) blocks gates intermittently
status: in_progress
priority: '2'
description: >-
  Built + APPROVED (adversarial tier), awaiting merge:
  fix/ui-e2e-session-rotation-flake @ 6b5077c. Root-caused to a PRODUCT bug the
  test was faithfully reporting: bootUiServer.close() could hang forever
  (mid-drain EventSource reconnect registered a fresh SSE stream after
  sse.close(); server.close() waited on the client-held socket). Fix: SseHub
  refuses post-close streams; close() severs all connections; 500 fallback
  hardened. THREE differential pins (SseHub unit pin; the reviewer's mid-flight
  tick-sweep; a timing-independent held-body construction) — each verified RED
  on unfixed code. Baseline 11/15 failing -> 25/25 + 20/20 under 6-core load;
  adversarial review survived shutdown storms, port cycles, SIGINT-on-built-CLI
  (155ms). Zero e2e-spec changes. Sibling :53 churn flake filed as
  tasks/ui-pageevents-churn.
actor: builder-flake
assignee: brian-claude
timestamp: '2026-07-15T18:27:07.157Z'
---

