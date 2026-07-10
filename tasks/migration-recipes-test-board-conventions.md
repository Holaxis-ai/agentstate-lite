---
type: Task
title: >-
  recipes.test.ts board-parity fails on a fresh clone: reads conventions moved
  to the board branch by PR #27
status: done
priority: '2'
description: >-
  Resolved by PR #32, merged as 79e4abdf37c41182502abd28f18a49f45938599b.
  packages/cli/test/recipes.test.ts now reads tracked fixtures and states the
  actual contract: the built-in roadmap recipe is authoritative; the board is an
  applied instance that may diverge. Clean-checkout npm run check passed at
  reviewed head ce264eb.
actor: openai/codex
timestamp: '2026-07-10T11:54:14.572Z'
---

