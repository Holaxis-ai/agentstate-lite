---
type: Task
title: 'Workspace catalog: add, list, and resolve'
status: in_progress
priority: '1'
description: >-
  Implement the user-scoped workspace catalog minimum loop: a private versioned
  machine-local registry, user/agent-defined labels, catalog add/list/resolve
  with raw --field path, one locked mutation boundary, fail-closed schema and
  target validation, and no ambient selection, UI, rename/remove, remote
  locators, or cross-bundle querying. Requires exact-SHA review and adversarial
  concurrency QA; leave PR open for human merge.
actor: mike/codex
timestamp: '2026-07-15T02:29:03.142Z'
---
[depends on](bundle-locate.md)
