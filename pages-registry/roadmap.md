---
type: View
title: Roadmap
entry: pages/roadmap.html
description: >-
  Live graph view — Roadmap Items grouped by status, each expandable to its
  contained tasks with a derived rollup bar.
actor: mike/claude
access: bundle-read
timestamp: '2026-07-10T19:58:57.858Z'
---
Roadmap Items grouped into In motion / Committed / Candidate / Done, each expandable to the tasks
it `contains` (fetched with one call to the bridge's `edges` request) with a derived done/total
rollup bar. Updates to either an item or one of its tasks stream in live, no reload.
