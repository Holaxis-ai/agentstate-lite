---
type: Task
title: 'Bundle pages: per-page data scoping (shared-board confidentiality)'
status: todo
priority: '2'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate; FLAG for human attention] Grepped
  packages/ui/src/pages/registry.ts and bridge.ts for 'scope'/'scoped' — no
  matches; no prefix/type scoping mechanism exists, a page still reads the
  entire bundle via the bridge exactly as described. FLAG (not a grooming
  decision): this task is 'GATED on shared-board page authoring becoming real',
  and per CLAUDE.md the project's own board has in fact been shared via aslite
  sync since 2026-07-09, with real Pages (board.html, roadmap.html, memory.html,
  etc.) reading the whole bundle over that now-shared board — the gate condition
  may already be satisfied in practice (mitigated somewhat by this repo's board
  being intentionally PUBLIC, but a future private shared board would not have
  that mitigation). Worth a human look at whether this should be un-gated. From
  the ui-pages-spike cold review (Tier B5, design+impl M): today a page reads
  the ENTIRE bundle via the bridge (any docId, full body). Correct for a
  single-user local board; a confidentiality gap the day one party authors a
  page another party opens over a shared board. Decide + build: a page declares
  the prefix/type it is scoped to (in its Page registry doc), the shell enforces
  that scope on query/read. Depends on the ui-pages-spike landing.
actor: mike/claude
timestamp: '2026-07-19T13:11:44.059Z'
---
[depends on](ui-pages-spike.md)
