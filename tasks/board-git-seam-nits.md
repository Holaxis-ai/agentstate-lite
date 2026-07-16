---
type: Task
title: 'board-git seam: altitude cleanup nits from the A1 review'
status: in_progress
priority: '3'
description: >-
  Non-blocking follow-ups from the A1 + C reviews (all cosmetic/copy/perf; zero
  behavior risk). FROM A1 (#78): (1) nameable probes duplicated across the seam
  (currentHead x3 in sync-establish, currentBranch, dirty-board-paths parse,
  remnant probe, windowNote landed probe, show-incoming byte read); (2)
  mis-indentation in moved git-porcelain.test.ts (~918-921, 943-946); (3) import
  gate exempts board-git test files; (4) redundant isTemplateExpression check.
  FROM C (#80): (N1) remoteless in-tree refusal + establish no-origin error both
  dead-end without the 'git remote add origin <url>' remedy — model on the
  pre-share no-origin arm shipped in #80; (N3) REANCHOR_NOTE '(history
  rewritten)' parenthetical inaccurate for the branch-switch reposition arm;
  (N4) in-tree diffDocsBetween filters in JS rather than passing the pathspec —
  cost-only on large repos; (N5) PR body suite-count label swap (cosmetic,
  record only). Sonnet-tier sweep, one PR.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T10:21:36.765Z'
---

