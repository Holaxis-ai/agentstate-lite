---
type: Task
title: 'board-git PR A0: seam preparation in place (no file moves)'
status: done
priority: '1'
description: >-
  SHIPPED: PR #73 merged as ce70665 (reviewed candidate b4a48d4). Independent
  review APPROVE, empirically calibrated: base-vs-PR built-CLI transcripts
  byte-identical across 10 failure/receipt scenarios incl. the two-clone
  converging conflict; parity table proven compile-enforced (bogus-code probe
  fails typecheck); all gates exit 0 incl. npm run check. Delivered:
  board-git-errors.ts (BoardGitError + structural guard, zero CLI imports),
  sync-engine.ts (un-inverted engine helpers), ONE cliErrorFromBoardGit mapping,
  consolidated diffDocsBetween with prefix seam, createSyncStore factory,
  board-git-API.md acceptance bar. Forward to A1 (review LOW): cursor.ts
  default-store/projections still import credentials.js — split factory from
  projections before relocation, or the import-direction test fails.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T01:13:59.524Z'
---
[depends on](sync-migrate-removal.md)
