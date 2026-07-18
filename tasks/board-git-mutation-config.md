---
type: Task
title: Extend the mutation instrument to board-git (the git-surgery package)
status: done
priority: '3'
assignee: mike/claude
description: >-
  DONE — validated end to end (2026-07-18). PR #95 (b3b074e) shipped the config;
  dispatch run 29648078542 completed SUCCESS in 70 min (well inside the 300-min
  ceiling; core's full run was ~104). First measurement: 3041 mutants — 1312
  killed + 3 timeout, 428 survived, 1298 NoCoverage → package-local score 43.2%.
  THE LOAD-BEARING CAVEAT for anyone reading that number: this measures
  board-git's OWN 110-test suite only — much of board-git's real coverage lives
  in the CLI package's sync e2e suites, which Stryker cannot see from
  board-git's context, so the huge NoCoverage mass is largely covered-elsewhere
  code and the package-local score UNDERSTATES system coverage. Cross-package
  mutation attribution would need a different harness — out of scope,
  record-only. Per-file survivors+nocoverage (inventory, NOT backlog, per the
  survivors-are-inventory stance): porcelain 879, flow 230, cursor 179, autopull
  124, engine 118, channel 62, errors 62, intree 51, diff 21. This supplies the
  survivor input the parked porcelain-decomposition candidate's trigger
  references (roadmap-items/change-surface-simplification). Report artifact:
  mutation-report-board-git-29648078542 (workflow artifact, 90-day retention).
actor: mike/claude
timestamp: '2026-07-18T18:11:13.496Z'
---

