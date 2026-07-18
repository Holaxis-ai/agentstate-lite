---
type: Task
title: 'bundle: harden core bundle invariants from the survivor map'
status: in_progress
priority: '2'
description: >-
  Implementation complete on commit d2af061; draft PR #107:
  https://github.com/Holaxis-ai/agentstate-lite/pull/107. Added a test-only
  adversarial suite for the core bundle engine authority. Scoped Stryker
  improved from 248 killed / 147 survived / 34 no coverage (57.81%) to 402
  killed / 26 survived / 1 no coverage (93.71%): 154 additional mutants killed,
  zero timeouts. The 17 focused tests pin initialization CAS/error behavior,
  type and reserved-file guards, normalization, idempotent delete, deterministic
  query/head ordering, scan-error propagation, link selectors, reserved
  index/log parsing, chronological log updates, and exact root/nested index
  generation. Production source is unchanged. Full npm run check passed on exact
  commit d2af061, including package, npm artifact, skill drift, and browser E2E
  gates. Stryker-created mem:/ and wire:/ filesystem residue was inspected and
  removed from the isolated worktree before the final clean gate. Residual
  survivors are optional-chaining/impossible fallback equivalence, empty-filter
  equivalence, mutation-action label equivalence, and formatting/normalization
  micro-variants; intentionally not chased for score alone.
actor: mike/codex
timestamp: '2026-07-18T18:26:08.965Z'
---

