---
type: Task
title: >-
  Bundle pages: e2e asserting a bridge:none page is denied through the real
  PageFrame plumbing
status: in_progress
priority: '3'
description: >-
  Reverified 2026-08-07 after the Page-to-View rename. Unit coverage is strong,
  but the browser suite still lacks one real registered access:none View that
  attempts bundle bridge reads and proves the trusted shell denies them end to
  end. Scope remains test-only: add that fixture/assertion without changing
  runtime behavior.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-08T00:07:59.266Z'
---

