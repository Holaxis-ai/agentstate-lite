---
type: Task
title: 'Bundle pages bridge v1: backlink query + optional server-rendered markdown'
status: canceled
priority: '3'
description: >-
  CANCELED 2026-08-02 as a mixed Page-era bucket. Backlinks already shipped;
  shared document rendering moved to tasks/shared-view-document-rendering under
  the portable View roadmap. Change-event enrichment, external-link mediation,
  and a shell-owned drawer remain unprioritized candidates that require separate
  demand evidence rather than riding this obsolete task.
actor: openai/codex
timestamp: '2026-08-02T16:03:27.694Z'
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
