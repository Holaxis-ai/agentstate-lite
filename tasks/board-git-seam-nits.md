---
type: Task
title: 'board-git seam: altitude cleanup nits from the A1 review'
status: todo
priority: '3'
description: >-
  Non-blocking follow-ups from PR #78's review (all REASONED/cosmetic, zero
  behavior impact). (1) Duplicate vocabulary across the seam: sync-establish.ts
  speaks raw mustGit rev-parse HEAD x3 where the package exports currentHead();
  five more nameable probes: currentBranch(top), the dirty-board-paths porcelain
  parse, the interrupted-run board-branch remnant probe (establish ~704-708),
  windowNote's landed-upstream probe, sync.ts show-incoming byte read
  (readDocBytesAtRef). Consolidate as named package ops when next touching these
  files. (2) Cosmetic mis-indentation in moved git-porcelain.test.ts (~918-921,
  943-946). (3) Import gate exempts board-git test files (currently clean by
  grep; consider extending the walk). (4) Redundant isTemplateExpression check
  in the gate. Sonnet-tier sweep; ride alongside or after PR C.
actor: mike/claude
timestamp: '2026-07-16T03:57:49.293Z'
---

