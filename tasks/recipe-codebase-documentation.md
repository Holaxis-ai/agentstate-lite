---
type: Task
title: >-
  CANDIDATE recipe: Codebase Documentation, with a live architecture-diagram
  View
description: >-
  Candidate recipe (roadmap-items/recipe-plugins), strong contender for recipe
  #2 — NOT in the release push. SCOPING GROUNDED by
  research/openwiki-capability-gap (empirical, 2026-07-20): the recipe = a
  SCHEMA (Reference/Section-style kinds like
  Module/Component/API/ArchitectureDecision + typed relationships, following the
  work-tracking/roadmap pattern — small-medium, NO engine change) PLUS an
  AUTHORING SKILL that tells the coding agent already driving AS how to walk a
  repo and populate the bundle (new/doc write/link add). The GENERATION itself
  (an LLM loop reading code and writing docs) is OUT OF SCOPE and should STAY so
  — that's the consuming agent's job (Claude Code/Codex), not AS's; embedding an
  LLM harness would break AS's zero-dependency/local-first/no-secrets design
  (gate 5). STANDOUT: a live ARCHITECTURE-DIAGRAM View rendered from the typed
  relationships (queryEdges via the bridge; SSE live-update) — the reusable
  'View renders the typed-relationship graph' capability (also
  tasks/task-system-board-ui). Constraint: Views are self-contained (CSP),
  inline the rendering. INTEROP IS FREE (proven): AS opens OpenWiki output
  unmodified — 'OpenWiki bootstraps, AS maintains + visualizes.' DOGFOOD on AS's
  own codebase. STRATEGIC: AS is the differentiated manage/collaborate/visualize
  layer in the OKF ecosystem, not another generator.
actor: mike/claude
status: todo
priority: '3'
timestamp: '2026-07-21T02:06:48.207Z'
---
[candidate recipe #2 (post-push): codebase docs + live architecture View](../roadmap-items/recipe-plugins.md)

[shares the reusable 'View renders the typed-relationship graph' capability](task-system-board-ui.md)
