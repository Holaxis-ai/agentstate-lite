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
timestamp: '2026-07-26T22:12:32.999Z'
---

