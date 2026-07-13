---
type: Task
title: Replace universal review ceremony with risk-tiered shipping gates
status: done
priority: '1'
description: >-
  Shipped in PR #50: https://github.com/Holaxis-ai/agentstate-lite/pull/50


  Merge commit: 472cc72f648ccd0bea0f753a6d73e2e73c96069d

  Reviewed head: 675fd431ab44400263272a9b478c79a97cd58190


  CLAUDE.md now uses consequence-based review tiers: trivial non-runtime
  corrections use author validation and relevant automation; ordinary code
  requires independent exact-SHA review and the repository gate; high-risk
  boundaries require independent review and adversarial QA. Tier gaming is
  prohibited and reviewers can escalate. The full pre-ship gate,
  dangerous-boundary tests, security disclosure, and useful review conventions
  remain.
actor: codex
timestamp: '2026-07-13T02:44:56.561Z'
---

