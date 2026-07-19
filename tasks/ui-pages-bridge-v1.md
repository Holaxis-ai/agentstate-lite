---
type: Task
title: 'Bundle pages bridge v1: backlink query + optional server-rendered markdown'
status: todo
priority: '3'
description: >-
  [RE-SCOPED 2026-07-19] Re-checked all four v0-gap items against current
  packages/ui/src/pages/bridge.ts (BRIDGE_PROTOCOL is still 'v0', not bumped to
  v1): (1) BACKLINKS — RESOLVED: an edges bridge request type now exists
  (BridgeDeps.edges / EdgeParams with from/to/text, backed by core's
  queryEdges), explicitly documented as 'the general graph primitive backing
  backlinks ({to: docId})' — shipped inside v0, no protocol bump needed. (2)
  markdown rendering — STILL OPEN: no 'rendered' flag on the read
  request/ReadDocResponse anywhere; grepped
  .agentstate-lite/pages/{board,memory,roadmap}.html and confirmed all three
  still carry their own hand-rolled mdLite copy (patched in lockstep, per the
  body's own account) — the candidate shell-provided doc-drawer replacement (see
  body) has not been adopted. (3) change-event payload — STILL OPEN: ChangeEvent
  (packages/ui/src/pages/pageEvents.ts:22-25, mirrored in
  ui-server/src/watch.ts:24-26) still carries only {id, version} for changed
  docs/blobs, no head projection — a full refetch is still required to decide
  relevance. (4) external links under sandbox — STILL OPEN: PageFrame.tsx:413
  iframe is still sandbox='allow-scripts' with no allow-popups; grepped for
  'open-external'/'openExternal' — no shell-mediated open-external message
  exists. REMAINING SCOPE: items 2-4 plus the doc-drawer candidate addition
  (three page-local mdLite/drawer copies now confirmed still live and
  un-consolidated) are the live work; item 1 (backlinks) is done and can be
  dropped from scope. Original text preserved: From ui-pages-spike authoring
  friction + review Tier C1. v0 bridge gaps that force page authors to work
  around them: (1) NO backlink query. (2) every page author re-implements a
  markdown renderer. (3) change events carry only {id,version} forcing a full
  refetch. (4) external https links are dead under the sandbox. All
  v0-ACCEPTABLE; backlinks + md-render were flagged as the two most likely to
  force an additive protocol bump — backlinks landed inside v0 instead. Depends
  on ui-pages-spike. Candidate addition: shell-provided doc drawer
  (Brian-approved line, 2026-07-14) — a doc-detail drawer copy-pasted into three
  bundle pages, patched in lockstep four times in one day; if adopted, must
  respect per-page bridge:none capability and compose with the
  markdown-rendering bullet.
actor: mike/claude
timestamp: '2026-07-19T13:12:29.380Z'
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
