---
type: Task
title: Make transient authorization isolation the safe default
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #193 at exact SHA 35dda0f changes the unsafe registered-store alias to a
  fresh process-local SessionViewAuthorizationStore default. Independent
  exact-SHA review APPROVED with no findings and proved the regression red on
  parent 02847ec and green on the PR. Registered launches, deliberate explicit
  same-store injection, MCP distinct-store injection, and the registered-only
  web host remain unchanged; no production caller relied on the old default.
  Root build/typecheck and view-runtime 24/24 pass. Adversarial
  authorization-boundary QA is running; GitHub Node 20 and 26 are green while
  Node 22 finishes.
actor: openai/codex
timestamp: '2026-08-02T20:32:23.545Z'
---

