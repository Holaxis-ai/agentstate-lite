---
type: Task
title: Add bounded snapshot query selection to conversational MCP Views
status: in_progress
priority: '2'
assignee: openai/codex
actor: openai/codex
description: >-
  Experimental follow-on to PR #168. Extend show_view with exactly one selection
  mode: explicit objectIds OR a bounded declarative query using existing core
  type/prefix/field/open semantics. Resolve the query once into at most 20 exact
  document IDs and versions, freeze that selection for refresh/actions, report
  the pre-limit count and resolved IDs, and keep generated HTML read-only. No
  subscriptions, live re-query, edges query, broader actions, or product-support
  declaration. Verification must cover deterministic selection,
  empty/over-limit/mutually-exclusive inputs, kind-derived open filtering,
  action confinement, and exact-ID compatibility.
timestamp: '2026-07-26T22:25:54.116Z'
---
# Implementation handoff

Draft PR: https://github.com/Holaxis-ai/agentstate-lite/pull/169

Commit under review: `b6301ca`

Implemented exactly one selection mode (`objectIds` or bounded `query`), shared durable-View field/open filtering, deterministic ID ordering, pre-limit match receipts, and frozen exact IDs/versions for refresh and action authority. No subscriptions, live re-query, edge query, broader action, or support declaration.

Verification: `npm run check` passed; focused core/UI/MCP suites passed 576 tests; CLI/View query-agreement passed 7 tests; browser E2E passed 18 tests; npm artifact and generated-skill parity passed. Task remains in progress pending independent exact-SHA review.
