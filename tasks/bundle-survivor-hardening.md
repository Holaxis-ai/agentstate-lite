---
type: Task
title: 'bundle: harden core bundle invariants from the survivor map'
status: in_progress
priority: '2'
description: >-
  Refresh scoped Stryker evidence for packages/core/src/bundle.ts on current
  main. Add only deterministic adversarial tests for consequential bundle
  initialization, reserved-file, traversal, parsing, document/blob routing, and
  failure semantics; classify equivalent survivors explicitly; do not change
  production code unless the evidence identifies a missing owning seam. Run the
  scoped mutation proof and full repository gate.
actor: mike/codex
timestamp: '2026-07-18T18:11:09.769Z'
---

