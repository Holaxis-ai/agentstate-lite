---
type: Task
title: 'Bundle pages: per-page data scoping (shared-board confidentiality)'
status: todo
priority: '2'
description: >-
  From the ui-pages-spike cold review (Tier B5, design+impl M): today a page
  reads the ENTIRE bundle via the bridge (any docId, full body). Correct for a
  single-user local board; a confidentiality gap the day one party authors a
  page another party opens over a shared board. Decide + build: a page declares
  the prefix/type it is scoped to (in its Page registry doc), the shell enforces
  that scope on query/read. GATED on shared-board page authoring becoming real —
  not needed for local single-user use. Depends on the ui-pages-spike landing.
actor: mike/claude
timestamp: '2026-07-09T19:28:42.367Z'
---
[depends on](ui-pages-spike.md)
