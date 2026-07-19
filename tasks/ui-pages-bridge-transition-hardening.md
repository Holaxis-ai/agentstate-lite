---
type: Task
title: >-
  Bundle pages: fence the one-frame change-push to a downgrading page (Finding
  A; B closed by #40)
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — accurate, line numbers drifted] The exact
  ordering bug is still present in packages/ui/src/views/PageFrame.tsx's
  subscribeToChanges handler, now at lines 337-347 (was ~lines 203-205 at filing
  — refactor drift, not a scope change): the
  frame.contentWindow.postMessage(changeMessage(...)) push (line 341-343) still
  runs BEFORE the e.docs.removed.includes(pageId) check (line 344) that triggers
  revoke(). Original text preserved: TRIMMED after the #40 rework (page
  navigation). FINDING B (upgrade-direction race) is now CLOSED on main via
  activeFrameSeqRef. REMAINING = Finding A ONLY (LOW): the change-event handler
  still posts changeMessage reading subscribedRef.current BEFORE the
  removed.includes(pageId)/revoke and the reload, so exactly ONE metadata-only
  frame ({id,version}+removed ids, no bodies) reaches a page in the instant it
  is downgraded/removed. Sandbox-contained (connect-src none, doomed doc). Cheap
  fix: move the removed.includes(pageId)/changed(pageId) checks above the push
  and skip the push when the event touches the page's own registry doc.
actor: mike/claude
timestamp: '2026-07-19T13:11:28.590Z'
---

