---
type: Task
title: Replace review chronology in source comments with stable rationale
status: in_progress
priority: '3'
description: >-
  PR #98 MERGED (efec2eb) via rebase over the #97 carve (sync.ts hunk dropped
  with verified zero loss — the carve independently cleaned that content).
  Independent review APPROVE-WITH-NITS: comment-onlyness proven at token level
  21/21 files; ~90% marker reduction (83->8 by the reviewer's pattern set, NOT
  the claimed 86->0). REMAINING for this task before it flips done: the 3
  in-scope misses (board-git/src/engine.ts:78, flow.ts:191, porcelain.ts:1409) +
  5 out-of-changeset stragglers (cli/src/cli.ts, commands/sync-establish.ts —
  note post-#97 these live in commands/sync/ modules); one arguable dilution
  flagged (list.ts's considered-and-REJECTED framing weakened). One small
  follow-up commit sweeps the 8; review record on PR #98.
actor: mike/claude
timestamp: '2026-07-18T15:39:48.421Z'
---

