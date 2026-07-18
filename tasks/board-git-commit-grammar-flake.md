---
type: Task
title: >-
  Flaky: board-git 'commit grammar: multi-actor' test — nondeterminism in test
  or product?
status: in_progress
priority: '3'
description: >-
  Observed 2026-07-18: 'not ok 67 - commit grammar: multi-actor -> board: N docs
  from M actors (subject names actor only when exactly one)' failed in PR #94's
  node-22 gate lane (run 29646586191) on a change that cannot affect it (stryker
  config + workflow comments), and PASSED on the identical tree in the main-push
  gate minutes later (run 29646598501) and on node 26/20 lanes. Classification:
  flaky. The open question that matters: is the nondeterminism in the TEST
  (setup race, ordering assumption) or in the PRODUCT (multi-actor subject
  construction depending on iteration/mtime order — which would mean
  nondeterministic commit messages in real use)? Repro pointer: the multi-actor
  arm of the commit-grammar suite in packages/board-git/test; try a tight loop
  locally (node --test with the file, 50 iterations). Same handling class as the
  ui session-rotation flake precedent: diagnose root cause, never mask with
  retries in the suite itself.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T13:50:47.193Z'
---

