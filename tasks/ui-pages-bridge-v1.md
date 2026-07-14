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
actor: brian-claude
timestamp: '2026-07-14T18:27:28.113Z'
---
[depends on](ui-pages-spike.md)

## Candidate addition: shell-provided doc drawer (Brian-approved line, 2026-07-14)

Evidence of demand: a doc-detail drawer (click any doc id -> slide-in detail with
frontmatter chips, rendered body, clickable doc-to-doc links, back-navigation history)
is now COPY-PASTED into three bundle pages (pages/board.html, pages/roadmap.html,
pages/memory.html) and was patched in lockstep four times in one day — the classic
signal that the invariant wants one owning primitive. Working prototype + usage trail
live on this bundle.

If adopted, two design constraints discovered by the prototype:
- The drawer must respect per-page capability: a bridge:none page must NOT gain data
  access through a shell-owned drawer (would bypass the #39 fail-closed model).
- It composes with this task's existing server-rendered-markdown bullet — a shell
  drawer wants real markdown rendering, replacing the pages' hand-rolled mdLite.

On landing, retire the three page-local copies (consolidation convention: superseded
implementations go in the same unit).
