---
type: Task
title: >-
  CANDIDATE recipe: Codebase Documentation, with a live architecture-diagram
  View
description: >-
  Candidate recipe (roadmap-items/recipe-plugins), a strong contender for recipe
  #2 — NOT in the release push (the task system is recipe #1). Codebase
  documentation as an OKF recipe: kinds like Module / Component / API /
  ArchitectureDecision / Runbook, typed relationships (depends-on, belongs-to),
  and Views. STANDOUT FEATURE: a LIVE ARCHITECTURE-DIAGRAM View rendered from
  the typed relationships — the graph data is already available to Views (the
  bridge 'edges' request -> core's queryEdges, the general graph primitive), and
  Views get SSE change fan-out, so the diagram updates live as the agent
  maintains the docs. DIFFERENTIATOR: a plain-markdown wiki (OpenWiki) generates
  markdown; AS renders a live visual graph ON TOP of the same OKF data — the
  thing a static wiki can't do. CONSTRAINTS (honest): Views are self-contained
  (CSP default-src/connect-src 'none' + unsafe-inline) — the diagram must INLINE
  its rendering (hand-rolled SVG or an embedded lib, NO external CDN); and while
  the edge data is free, a LEGIBLE diagram (auto-layout, filtering so a large
  codebase isn't a hairball, grouping) is real design work (same shape as the
  task board — data easy, visual UX is the work). REUSABLE CAPABILITY: 'a View
  renders the typed-relationship graph' generalizes across recipes (a
  task-dependency graph, a knowledge graph) — build one good graph View and
  every recipe can use it (also applies to tasks/task-system-board-ui). DOGFOOD:
  build/prove on AS's own codebase — agentstate-lite has real documentation
  needs. INTEROP: can consume an OpenWiki-generated OKF bundle (same standard) —
  'OpenWiki bootstraps, AS maintains + visualizes.' STRATEGIC: plants AS in the
  OKF ecosystem's most active use case (codebase docs, where OpenWiki/OKFy
  generate) as the differentiated manage/collaborate/VISUALIZE layer.
actor: mike/claude
status: todo
priority: '3'
timestamp: '2026-07-21T01:59:11.005Z'
---
[candidate recipe #2 (post-push): codebase docs + live architecture View](../roadmap-items/recipe-plugins.md)

[shares the reusable 'View renders the typed-relationship graph' capability](task-system-board-ui.md)
