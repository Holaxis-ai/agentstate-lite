---
type: Task
title: >-
  Bundle pages: fence the one-frame change-push to a downgrading page (Finding
  A; B closed by #40)
status: todo
priority: '3'
description: >-
  TRIMMED after the #40 rework (page navigation). FINDING B (upgrade-direction
  race) is now CLOSED on main: #40 added activeFrameSeqRef — the bridge
  generation OWNED by the keyed iframe DOM node, invalidated the instant loadSeq
  advances — so a still-mounted old document's requests are dropped (PageFrame
  onMessage ~line 164). That is the structural fix the re-review proposed; my
  #39 fail-closed enforcement + both P1 race tests were preserved. REMAINING =
  Finding A ONLY (LOW): the change-event handler (PageFrame subscribeToChanges,
  ~lines 203-205) still posts changeMessage reading subscribedRef.current BEFORE
  the removed.includes(pageId)/revoke and the reload, so exactly ONE
  metadata-only frame ({id,version}+removed ids, no bodies) reaches a page in
  the instant it is downgraded/removed. Sandbox-contained (connect-src none,
  doomed doc). Cheap fix: move the removed.includes(pageId)/changed(pageId)
  checks above the push and skip the push when the event touches the page's own
  registry doc.
actor: mike/claude
timestamp: '2026-07-12T11:44:28.325Z'
---

