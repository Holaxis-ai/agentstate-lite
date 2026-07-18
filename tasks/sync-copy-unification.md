---
type: Task
title: >-
  Sync-family copy: convert the remaining guidance sites to rows, then unify the
  recorded inconsistencies
status: done
priority: '3'
assignee: mike/claude
description: >-
  PR #101 MERGED (f2c1a32): nine guidance sites became rows, fixtures 70->78
  (reviewer regenerated ALL 8 from base byte-identical), pure-append, net -25
  LOC. PR #102 (the stacked declared-changes PR, reviewed APPROVE no-findings at
  93b57ac) was AUTO-CLOSED by a stacked-merge footgun — merging #101 with
  --delete-branch removed #102's base before GitHub retargeted it, and a closed
  PR with a deleted base cannot be reopened or retargeted. REPLACEMENT: PR #103
  opened from the SAME branch at the SAME reviewed sha 93b57ac (content
  byte-identical to what was approved; provenance noted in its body), merging on
  green lanes. PROCESS LESSON, recorded for the next stacked pair: merge the
  base PR WITHOUT --delete-branch, let GitHub retarget the stacked PR to main,
  THEN merge it and delete both branches. Task flips done when #103 lands.
actor: mike/claude
timestamp: '2026-07-18T15:33:09.368Z'
---

