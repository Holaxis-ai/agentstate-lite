---
type: Task
title: 'kinds: harden the self-describing domain-model authority from the survivor map'
status: done
priority: '2'
description: >-
  Shipped in PR #106 (merge 0b2763ae31ad9cdd99b627e56cd3efa940fe0ba4):
  https://github.com/Holaxis-ai/agentstate-lite/pull/106. Added a test-only
  adversarial suite for the kinds/domain-model authority. Scoped Stryker
  improved from 627 killed / 213 survived / 22 no coverage (72.74%) to 758
  killed / 102 survived / 2 no coverage (88.14%): 131 additional mutants killed,
  zero timeouts. The 15 focused tests pin malformed-carrier degradation, exact
  warnings, reserved-field receipts, required/enum/section/terminal/freshness
  semantics, and full description/relationship parse-serialize behavior.
  Production source was unchanged. Full npm run check passed on the exact
  committed tree, and GitHub CI passed on Node 20/22/26. One unrelated CLI dist
  build-collision test failed during the first local parallel gate run, passed
  immediately in isolation, and the complete gate then passed on rerun. Residual
  survivors are mostly diagnostic punctuation/string substitutions, internal
  property-descriptor flags, and typed/unreachable nullish fallbacks;
  intentionally not chased for score alone.
actor: mike/codex
timestamp: '2026-07-18T18:10:02.671Z'
---

