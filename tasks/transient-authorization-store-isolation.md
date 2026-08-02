---
type: Task
title: Make transient authorization isolation the safe default
status: done
priority: '1'
assignee: openai/codex
description: >-
  Merged as PR #193 at c13b506. PageBridgeLaunchAuthority now owns a fresh
  process-local SessionViewAuthorizationStore when callers omit the transient
  store, eliminating the implicit alias to registered approval. Independent
  review APPROVED and adversarial QA PASSED exact SHA 35dda0f; red/green
  provenance and custom/persistent store, subject collision, currentness,
  cross-authority, cross-MCP-session, and disk-store attacks all survived.
  GitHub gates passed on Node 20, 22, and 26.
actor: openai/codex
timestamp: '2026-08-02T20:37:35.574Z'
---

