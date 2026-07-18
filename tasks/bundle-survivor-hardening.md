---
type: Task
title: 'bundle: harden core bundle invariants from the survivor map'
status: done
priority: '2'
description: >-
  Shipped in PR #107: https://github.com/Holaxis-ai/agentstate-lite/pull/107
  (merge commit 6ca3ae4). Added a test-only adversarial suite for the core
  bundle engine authority; production source is unchanged. Scoped Stryker
  improved from 248 killed / 147 survived / 34 no coverage (57.81%) to 402
  killed / 26 survived / 1 no coverage (93.71%): 154 additional mutants killed
  with zero timeouts. The 17 focused tests pin initialization CAS/error
  behavior, type and reserved-file guards, normalization, idempotent delete,
  deterministic query/head ordering, scan-error propagation, link selectors,
  reserved index/log parsing, chronological log updates, and exact root/nested
  index generation. Full npm run check passed on exact head d2af061, and GitHub
  CI passed on Node 20, 22, and 26 before merge. Residual survivors are
  optional-chaining/impossible fallback equivalence, empty-filter equivalence,
  mutation-action label equivalence, and formatting/normalization
  micro-variants; intentionally not chased for score alone.
actor: mike/codex
timestamp: '2026-07-18T18:37:47.958Z'
---

