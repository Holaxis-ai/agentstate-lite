---
type: Task
title: Add bounded snapshot query selection to conversational MCP Views
status: done
priority: '2'
assignee: openai/codex
actor: openai/codex
description: >-
  Shipped in PR #169 (merge 23d69da): show_view accepts exact IDs or one bounded
  launch-time query using shared durable-View semantics, freezes exact
  IDs/versions for actions, and uses one strict parser across MCP/direct entry
  paths. Independent exact-SHA re-review approved e8555a8; Node 20/22/26 CI
  green.
timestamp: '2026-07-26T22:53:47.065Z'
---
# Implementation handoff

Draft PR: https://github.com/Holaxis-ai/agentstate-lite/pull/169

Current exact head under re-review: `e8555a8`

Implemented exactly one selection mode (`objectIds` or bounded `query`), shared durable-View field/open filtering, deterministic ID ordering, pre-limit match receipts, and frozen exact IDs/versions for refresh and action authority. No subscriptions, live re-query, edge query, broader action, or support declaration.

The first independent review of `b6301ca` found one P2: direct resolver calls could silently drop malformed or unknown fields that the MCP path rejected. Remediation `e8555a8` deletes the manual validator, makes the full strict Zod object the single input authority for MCP registration and direct resolution, and adds a direct/MCP agreement table for wrong types plus unknown nested/top-level members.

Verification after remediation: focused MCP typecheck and 17-test suite passed; `npm run check` passed, including 18 browser E2E tests, npm artifact verification, and generated-skill parity. Task remains in progress pending independent exact-SHA re-review.
