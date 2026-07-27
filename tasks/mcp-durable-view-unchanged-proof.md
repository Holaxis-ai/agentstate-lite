---
type: Task
title: Prove one unchanged durable View through the MCP host
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #173 at 7e22fcc proves the shipped Roadmap HTML runs from unchanged current
  bytes through the shared launch authority and read-only BridgeService in the
  MCP App. The security follow-up makes the exact-byte trust boundary explicit:
  a human trusts approved View bytes as executable code with declared bundle
  access; host/static/child CSP and sandboxing are defense-in-depth. It also
  retires the launch after an unexpected child-frame navigation. Existing
  generated Views and web subscriptions remain intact. npm run check is green,
  including MCP App 19/19, browser E2E 19/19, npm packaging, and skill parity.
  Remaining merge gates: renewed independent exact-SHA architecture/security
  review, adversarial QA of containment/currentness/lifecycle, and one real
  conversational-host launch after installing this branch.
actor: openai/codex
timestamp: '2026-07-27T02:49:38.065Z'
---

