---
type: Task
title: 'board-git PR A0: seam preparation in place (no file moves)'
status: in_progress
priority: '1'
description: >-
  Builder complete: PR #73 (feat/board-git-a0-seam-prep), reviewed candidate
  b4a48d4f0a65549dfd9afc8f24afe79c8149696d, cut from origin/main e7c8ab7. All
  gates exit 0 (build/typecheck/test/check + built-CLI smoke incl. dual-load
  envelope parity). New modules: board-git-errors.ts (BoardGitError, 7 codes,
  structural guard), sync-engine.ts (carved engine helpers), board-git-API.md
  (package acceptance bar); diffDocsBetween consolidated into git.ts;
  createSyncStore factory in cursor.ts; ONE cliErrorFromBoardGit mapping; no
  engine imports from commands/sync.ts remain. Builder caveats for review:
  originDocsBetween tolerance-adapter equivalence, cursor free-function
  projections retained until A1, remaining command->command composition edges
  deferred to A1 flow.ts. Independent review IN FLIGHT on the exact sha.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T00:57:06.456Z'
---
[depends on](sync-migrate-removal.md)
