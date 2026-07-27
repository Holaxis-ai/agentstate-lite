---
type: Task
title: Prove one unchanged durable View through the MCP host
status: done
priority: '1'
assignee: openai/codex
description: >-
  Merged as PR #173 at merge commit f091808 after exact-head CI passed on Node
  20/22/26. The shipped MCP adapter can launch an unchanged registered View by
  exact ID through the shared launch and read-only bridge authorities. Human
  approval explicitly trusts the exact executable bytes; static/child CSP and
  sandboxing are defense-in-depth; unexpected navigation retires the launch;
  hidden state invalidates in-flight work; UTF-8 BOM identity is preserved;
  package tests run without prebuilt dist. Final evidence before merge: npm run
  check green, MCP 23/23 including clean-package proof, browser E2E 19/19. The
  user explicitly waived another review after the first review's three findings
  were fixed.
actor: openai/codex
timestamp: '2026-07-27T03:17:20.128Z'
---

