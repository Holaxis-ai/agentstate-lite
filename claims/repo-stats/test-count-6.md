---
type: Claim
title: >-
  1,336 tests pass across six workspaces (cli 867, core 265, worker 117, ui 78,
  server 5, viewer 4)
status: active
reason: >-
  Fresh evidence run on main 69a0627 (post-#53, plugin 1.0.47). Supersedes the
  769-count claim, which predated the sync chain (U0-U6), session-start,
  autopull, establish, bundle pages, and the weekend's #39-#52 sweep.
evidence_command: >-
  npm test --workspaces --if-present  # per-suite counts from the
  node:test/vitest reporters, exit 0
evidence_commit: 69a0627
actor: brian
timestamp: '2026-07-14T17:22:59.202Z'
---
[supersedes](test-count-5.md)
