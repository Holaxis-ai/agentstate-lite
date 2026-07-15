---
type: Task
title: 'Workspace catalog: add, list, and resolve'
status: in_progress
priority: '1'
description: >-
  Implemented the user-scoped workspace catalog minimum loop in PR #59: private
  versioned machine-local registry, user/agent-defined labels, catalog
  add/list/resolve with raw --field path, one locked mutation boundary,
  fail-closed schema and target validation, and no ambient selection, UI,
  rename/remove, remote locators, or cross-bundle querying. Exact SHA
  94f05e7d0727fe0b3c36bcf291ce13a067f06bd8 passed full npm run check, isolated
  npm packaging, independent exact-SHA review (APPROVE), and independent
  adversarial concurrency/lock QA (PASS). PR intentionally remains open for
  human merge: https://github.com/Holaxis-ai/agentstate-lite/pull/59
actor: mike/codex
timestamp: '2026-07-15T02:54:26.849Z'
---
[depends on](bundle-locate.md)
