---
type: Task
title: Prove MCP-host reuse of the governed View action authority
status: done
priority: '1'
assignee: openai/codex
description: >-
  PR #168 now points to exact SHA 6552c71. Independent review found one real P1:
  after a successful action, refreshing a multi-object View could throw if an
  unrelated selected sibling vanished, obscuring the authoritative commit
  receipt. The fix preserves committed/conflict receipts, revokes the incomplete
  launch, and retires the shell View; deterministic commit and CAS-conflict
  regressions cover the exact attack. Fresh full npm run check is green,
  including MCP, package, and browser E2E gates. Empirical re-review is
  replaying the finding now; after it clears, this task itself will be completed
  through the trusted MCP App control as the first real dogfood mutation.
actor: mike
timestamp: '2026-07-26T20:52:56.335Z'
---

