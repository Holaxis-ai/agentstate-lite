---
type: Task
title: 'kinds: harden the self-describing domain-model authority from the survivor map'
status: in_progress
priority: '2'
description: >-
  Refresh the scoped Stryker survivor map for packages/core/src/kinds.ts on
  current main. Pin only consequential parsing, normalization, validation, and
  serialization behaviors with deterministic adversarial tests; classify
  equivalent survivors explicitly; avoid syntax-assertion churn and production
  refactors unless the evidence identifies a missing owning seam. Run the scoped
  mutation gate and full repository gate.
actor: mike/codex
timestamp: '2026-07-18T16:58:08.277Z'
---

