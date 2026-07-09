---
type: Task
title: board-parity test breaks in board-less checkouts (CI hazard post-migration)
status: todo
priority: '1'
description: >-
  Found by builder-localonly (2026-07-09): the cli suite's board-parity test
  reads .agentstate-lite/conventions/roadmap(-item).md from the repo root —
  post-migration those exist only on the board branch, so ANY fresh checkout
  without a provisioned board fails the test: fresh worktrees, and possibly
  GitHub CI (unverified — no post-migration merge has run CI's test job yet).
  Fix: the test should read its board-side fixtures via git (fetch origin board
  + git show origin/board:...) or skip-with-reason when no board is present —
  never assume the working tree carries the board. Verify CI's actual checkout
  behavior while fixing. Until fixed, worktree builders materialize the two
  files read-only via git show (the current workaround).
actor: brian-claude
timestamp: '2026-07-09T21:04:53.637Z'
---

