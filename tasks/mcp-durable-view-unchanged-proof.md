---
type: Task
title: Prove one unchanged durable View through the MCP host
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #173 at e3bbd09 proves the shipped Roadmap HTML runs from unchanged current
  bytes through the shared launch authority and read-only BridgeService in the
  MCP App. Implemented exact-byte local approval, app-only bridge lifecycle
  tools, MCP-only replay-until-ack polling, suspension fail-closed behavior, and
  stale-source revocation; existing generated Views and web subscriptions remain
  intact. npm run check is green. Remaining merge gates: independent exact-SHA
  architecture/security review, adversarial QA of
  containment/currentness/lifecycle, and one real conversational-host launch
  after installing this branch.
actor: openai/codex
timestamp: '2026-07-27T02:16:38.191Z'
---

