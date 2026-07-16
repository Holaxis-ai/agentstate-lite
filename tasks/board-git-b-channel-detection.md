---
type: Task
title: >-
  board-git PR B: BoardChannel detection (branch/local-only wired; in-tree
  recognized)
status: in_progress
priority: '3'
description: >-
  Builder complete: PR #79 (feat/board-git-b-channel-detection), reviewed
  candidate 1f95f5080a59a3c2714c2078c7fc4f489ef3230f, base 3529650 (post #78 +
  bot bump). channel.ts ships the BoardChannel union (branch defaults
  board/origin), detectBoardChannel with injected remote probe, three-valued
  probeRemoteBoardState, three-armed ChannelDetection (channel | unsupported
  in-tree | indeterminate with probe+reason). 21 deterministic
  constructed-git-state tests covering the full plan matrix + 2 out-of-matrix
  rows; wedged-mid-rebase -> branch pinned with probe-never-consulted proof;
  both fail-closed indeterminate rows pinned; detection-mutates-nothing pinned.
  NOTHING wired into the CLI (per plan fallback — PR C wires consumers);
  preShareWindowError extracted to one shared factory with byte-identical parity
  test. All gates exit 0. Review judgment calls: error arms THROW BoardGitError;
  dual-board demands local-object proof (unverifiable -> pull-first arm);
  stale-pointer arm keys on own worktree registration; exists accepts
  previously-fetched evidence under a dead probe (offline-join parity), only
  ABSENT demands a live probe. Independent review IN FLIGHT.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T04:23:02.607Z'
---
[depends on](board-git-a1-extraction.md)
