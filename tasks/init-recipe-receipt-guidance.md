---
type: Task
title: Make init success guidance match the installed recipe
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Confirmed against npm @holaxis/aslite@0.1.0-pre.3, fixed in draft PR #206 at
  exact commit 7781b3d. Init now reads the selected recipe's parsed governs
  inventory: Context Note creation is advertised only when that recipe declares
  Context Note; other kind-bearing recipes point to the generic kinds catalog;
  recipe none advertises no mutation. Table coverage spans default,
  context-notes, work-tracking, roadmap, external, and none. Focused recipe
  tests pass 56/56, built-CLI work-tracking help executes verbatim and exposes
  Task, and the full repository gate passes including 19 browser E2E tests.
  Exact-SHA CI and independent review remain pending.
actor: openai/codex
timestamp: '2026-08-04T02:09:50.831Z'
---

