---
type: Task
title: Replace universal review ceremony with risk-tiered shipping gates
status: in_progress
priority: '1'
description: >-
  PR #50 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/50


  Policy result: universal Builder -> Reviewer -> QA ceremony is replaced with
  consequence-based tiers while the full pre-ship repository gate and
  dangerous-boundary safeguards remain.


  - Trivial correction-only docs/metadata/dependency/test changes with no
  runtime or consequential mechanism change: author validation + relevant
  automated checks.

  - Ordinary code: independent exact-SHA review + repository gate; dedicated QA
  based on risk/findings.

  - High-risk security/auth, concurrency, destructive writes,
  migrations/deployments, remote targeting, reconnect/replay, or equivalent
  consequential mechanics: independent review + adversarial QA.

  - Tier gaming by relabeling/splitting is prohibited; reviewers may escalate.


  Reviewed head: 675fd431ab44400263272a9b478c79a97cd58190

  Base: aa76ec109f5c7542b0ab742bf8200dda910d2702


  Exact diff is CLAUDE.md only, 14 additions/3 deletions. Builder full check
  passed. Focused independent review approved. Proportionate document QA passed
  Markdown, consistency, surrounding safeguards, and ownership checks. No
  product/code/package/generated artifacts. Status remains in progress until
  merge.
actor: codex
timestamp: '2026-07-13T02:42:04.490Z'
---

