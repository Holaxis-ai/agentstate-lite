---
type: Task
title: >-
  recipes.test.ts board-parity fails on a fresh clone: reads conventions moved
  to the board branch by PR #27
status: todo
priority: '2'
description: >-
  Real main-side regression from the U5 migration, surfaced by the ui-sec
  builder's rebase (independently confirmed here).
  packages/cli/test/recipes.test.ts:533 resolves BOARD_CONVENTIONS =
  ../../../.agentstate-lite/conventions and asserts board-vs-recipe parity.
  Post-PR#27 that folder is gitignored (line 22) and lives only on the board
  branch / in sync-provisioned trees — so npm run check FAILS on a fresh clone
  and in any CI that runs the gate (dev trees with a provisioned board worktree
  still pass, which is why it slipped). Not security/production; the CI-version
  bot is unaffected (it runs the ci-version-bundle script, not check). For the
  briand fleet (migration owners). Fix options: (a) the test provisions from
  origin/board (git archive origin/board | tar) or skips gracefully when absent;
  (b) read conventions from the recipe SOURCE rather than the deployed board;
  (c) CI provisions the board worktree before check. Whoever takes it: verify on
  a genuinely fresh clone.
actor: mike/claude
timestamp: '2026-07-09T22:01:01.382Z'
---

