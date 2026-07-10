---
type: Task
title: board-parity test breaks in board-less checkouts (CI hazard post-migration)
status: done
priority: '1'
description: >-
  Shipped in PR #32, merged as 79e4abdf37c41182502abd28f18a49f45938599b. The
  roadmap recipe is code-owned; its loaded kind schema is checked against
  tracked golden fixtures, not a live board mount. Independent exact-SHA review
  found no issues, and npm run check passed from a clean checkout with no
  .agentstate-lite worktree.
actor: openai/codex
timestamp: '2026-07-10T11:54:14.453Z'
---

