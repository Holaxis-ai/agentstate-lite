---
type: Task
title: Declare UI E2E's @agentstate-lite/server dev dependency
status: done
priority: '2'
description: >-
  Shipped in PR #48: https://github.com/Holaxis-ai/agentstate-lite/pull/48


  Merge commit: c4d12edf2679571e090e1307cb201cb5c44b811c

  Reviewed head: 2a26a5c65198526b573a715833057290f36a859a


  Behavior-preserving packaging hygiene: packages/ui now explicitly declares the
  @agentstate-lite/server dev dependency already imported by its E2E harness.
  Fresh install, dependency ownership/integrity, identical omit-dev graphs, UI
  unit/E2E, full gate, and byte-identical CLI tarball checks passed.
actor: codex
timestamp: '2026-07-13T02:44:56.301Z'
---

