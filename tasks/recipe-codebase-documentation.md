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
timestamp: '2026-07-21T02:26:42.048Z'
---
[candidate recipe #2 (post-push): codebase docs + live architecture View](../roadmap-items/recipe-plugins.md)

[shares the reusable 'View renders the typed-relationship graph' capability](task-system-board-ui.md)

## The authoring methodology is open — adapt, don't invent (2026-07-20)

OpenWiki's generation methodology is public: `src/agent/prompt.ts` in langchain-ai/openwiki (MIT). Reading the ACTUAL prompt (not a paraphrase) reframes the authoring-skill work as SMALLER than "build a methodology from scratch" — it's "adapt this specific open prompt," and roughly HALF of what their prompt asks the model to self-police is already an AS engine invariant, enforced rather than requested:

- index.md — their prompt: "generated deterministically after the run; do not create or edit them yourself." That IS AS's `index generate` (marker-owned, CAS, refuse-to-clobber). Enforced, not hoped-for.
- cross-links — their prompt: "each substantive concept connects to at least two others; put the link in the sentence that explains the relationship; name it (dispatches to / depends on / is secured by)." That is AS's typed-edge model + relative-link-in-prose convention verbatim. AS DERIVES backlinks and lets you QUERY the graph (queryEdges / link show); OpenWiki maintains reciprocity by hand.
- frontmatter — their required block is OKF frontmatter (identical to AS); "existing extension fields must survive round trips" is behavior the interop test already confirmed AS honors (it preserved openwiki_generated). AS VALIDATES via kinds — a strict superset of their fixed field set.

The genuinely agent-behavior half is copyable editorial guidance, not research — it drops straight into the AS authoring skill unchanged: selective `git log` / `git show` / `git blame` on high-signal files; a soft diff budget ("if fewer than ~5 source files changed, update at most 1-2 pages"; don't touch quickstart unless top-level behavior changed); avoid thin pages / at most ~8 pages on the first run / merge stubs into broader pages; record deferred areas in a `## Backlog` section with area name + source anchor + one-line reason.

PITCH FRAMING for the recipe: "enforced, not requested" — AS makes the invariants OpenWiki's prompt can only ask a model to remember. Plus the no-separate-key friction advantage: the coding agent already driving AS (Claude Code / Codex) does the generation, so there is NO provider-API-key/config setup that OpenWiki requires — lower friction for someone already in an agent, and a capability-equal-or-better generator. License: derive the methodology (the ideas) freely; attribute if any skill prose ends up close to their prompt text.
