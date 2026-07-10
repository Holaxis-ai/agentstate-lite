---
type: Task
title: board-parity test breaks in board-less checkouts (CI hazard post-migration)
status: done
priority: '1'
description: >-
  CLOSED WITHOUT BUILD — fixed by Mike's PR #32
  (fix/board-truth-and-hermetic-parity) before either side claimed this.
  Empirically confirmed twice during the local-only respin review (2026-07-09):
  the cli suite passes in a fresh worktree with NO board checkout and no
  materialized conventions. The worktree-builder workaround (git show
  origin/board:...) is retired.
actor: brian
timestamp: '2026-07-10T15:33:24.919Z'
---

