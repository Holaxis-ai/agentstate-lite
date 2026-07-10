---
type: Task
title: >-
  Bundle pages: harden bridge capability transition boundaries (upgrade race +
  one-frame change push)
status: todo
priority: '2'
description: >-
  Two LOW residual findings from the PR #39 re-review (the P1 downgrade race +
  reply mis-delivery are FIXED and merged in #39; these are the remaining
  transition-boundary edges, both sandbox-contained). (A) change-push ordering:
  the subscribeToChanges handler posts changeMessage (metadata-only
  {id,version}+removed) reading subscribedRef.current BEFORE loadPage()'s
  pre-revoke, so exactly ONE boundary frame reaches a page in the instant it is
  downgraded/removed. Fix: move the removed.includes(pageId)/changed(pageId)
  checks above the push and skip when the event touches the page's own registry
  doc. (B) UPGRADE-direction mirror (PRE-EXISTING since da093e2, not a #39
  regression): loadPage installs the NEW capability + swaps src before the new
  document commits in the reused iframe element; in a real browser contentWindow
  is a stable WindowProxy across navigation, so during the navigate window the
  OLD document still runs, passes the ev.source check, and its requests are
  answered under the NEW grant — a none->bundle-read live edit lets a content
  page briefly read. Non-exploitable in practice (connect-src 'none', no popups,
  doomed document = no exfil), but a real fail-closed edge. Fix: defer
  bridgeCapabilityRef.current=capability to the iframe 'load' event
  (pending-capability keyed by seq), so a grant activates only once its document
  is actually in the frame. Ship as one unit WITH a component test for the
  upgrade race (the existing bite-tested harness covers the downgrade direction;
  note jsdom mints a fresh contentWindow per navigation, so the test must model
  the WindowProxy-stability the real bug depends on).
actor: mike/claude
timestamp: '2026-07-10T20:56:59.436Z'
---

