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
timestamp: '2026-07-26T22:41:26.846Z'
---
# Implementation handoff

Draft PR: https://github.com/Holaxis-ai/agentstate-lite/pull/169

Current exact head under re-review: `e8555a8`

Implemented exactly one selection mode (`objectIds` or bounded `query`), shared durable-View field/open filtering, deterministic ID ordering, pre-limit match receipts, and frozen exact IDs/versions for refresh and action authority. No subscriptions, live re-query, edge query, broader action, or support declaration.

The first independent review of `b6301ca` found one P2: direct resolver calls could silently drop malformed or unknown fields that the MCP path rejected. Remediation `e8555a8` deletes the manual validator, makes the full strict Zod object the single input authority for MCP registration and direct resolution, and adds a direct/MCP agreement table for wrong types plus unknown nested/top-level members.

Verification after remediation: focused MCP typecheck and 17-test suite passed; `npm run check` passed, including 18 browser E2E tests, npm artifact verification, and generated-skill parity. Task remains in progress pending independent exact-SHA re-review.
