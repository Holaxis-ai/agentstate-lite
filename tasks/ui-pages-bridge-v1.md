---
type: Task
title: 'Bundle pages bridge v1: backlink query + optional server-rendered markdown'
status: todo
priority: '3'
description: >-
  From ui-pages-spike authoring friction (orchestrator wrote a third page) +
  review Tier C1. v0 bridge gaps that force page authors to work around them:
  (1) NO backlink query — cannot ask "what cites this" without N reads, and
  backlinks are the products signature derived feature; reserve a `backlinks
  {docId}` request shape riding link show. (2) every page author re-implements a
  markdown renderer — offer read {rendered:true} or ship a tiny md helper in the
  bridge-client snippet. (3) change events carry only {id,version} forcing a
  full refetch to decide relevance — consider including the head projection. (4)
  external https links are dead under the sandbox (no allow-popups) — decide
  allow-popups vs a shell-mediated open-external message. All v0-ACCEPTABLE;
  backlinks + md-render are the two most likely to force an additive protocol
  bump, so reserve their shapes now. Depends on ui-pages-spike.
actor: mike/claude
timestamp: '2026-07-09T19:28:42.473Z'
---
[depends on](ui-pages-spike.md)
