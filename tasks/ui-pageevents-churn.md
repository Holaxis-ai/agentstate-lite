---
type: Task
title: >-
  EventSource churn on page navigation: each page switch tears down and
  recreates the shared stream (rare resync flake)
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate]
  packages/ui/src/pages/pageEvents.ts DOES already hold one reference-counted
  EventSource (opened on first subscribe, closed via teardownIfIdle() only when
  subscriber count hits zero) and both Launcher.tsx and PageFrame.tsx subscribe
  through it — this shared design predates the finding (present since the
  original ui-pages spike commit d4193d8). But packages/ui/src/App.tsx:24
  renders EITHER <PageFrame> OR <Launcher>, never both, with no persistent
  shell-level subscriber — so a page-to-page navigation still unmounts the old
  subscriber and mounts the new one, and any gap between the two drops
  subscriber count to zero, triggering teardownIfIdle() to close the stream
  before the new page resubscribes. The architectural fix this task actually
  needs (a shell-owned subscriber independent of which view is mounted) has not
  been built. Sibling finding from the session-rotation fix (2026-07-15):
  pages.spec.ts:53 (About navigation) retains a separate rare flake — under
  6-core artificial saturation, 2/50 runs: history navigation tears down and
  recreates the shared EventSource per page switch. Fix direction: pageEvents
  should hold ONE durable stream across page navigations (the shell owns the
  EventSource; pages subscribe/unsubscribe) instead of churning connections.
actor: mike/claude
timestamp: '2026-07-19T13:11:15.542Z'
---

