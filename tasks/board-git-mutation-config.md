---
type: Task
title: Extend the mutation instrument to board-git (the git-surgery package)
status: in_progress
priority: '3'
assignee: mike/claude
description: >-
  CLAIMED mike/claude 2026-07-18. One Stryker config for packages/board-git
  (whole-src mutate — 3.9k lines, fast suite, expected core-like ~20min cost) +
  workflow matrix/dispatch entry + package and root mutation scripts. Closes the
  known instrument gap: porcelain/flow/channel (all the git surgery incl. the F2
  adopt and marker mechanics) currently have zero mutation coverage; also
  required input for the parked porcelain-decomposition candidate. Validation =
  post-merge dispatch target=board-git; record measured cost here, then done.
actor: mike/claude
timestamp: '2026-07-18T13:54:55.286Z'
---

