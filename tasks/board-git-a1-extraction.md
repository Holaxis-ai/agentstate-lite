---
type: Task
title: 'board-git PR A1: mechanical extraction to packages/board-git'
status: done
priority: '2'
description: >-
  SHIPPED: PR #78 merged (reviewed candidate 769a3cb). packages/board-git
  exists: errors/porcelain/diff/cursor/engine/flow(step library)/autopull behind
  injected deps; deps = node + core only, manifest-pinned; import-direction gate
  with NO allowlist (TS-AST walk, 9 adversarial red probes verified by review);
  CLI keeps command shells + ONE cliErrorFromBoardGit + cursor wiring +
  sync-cli.ts. Independent review APPROVE-WITH-NITS, empirically calibrated:
  base-vs-head built-CLI transcripts BYTE-IDENTICAL across the full battery
  (bundle ops, establish/join/converging-conflict, committed preview+--yes with
  real-history message inspection, planted lost-race both arms, stale-vs-fresh
  autopull); all 4 acceptance criteria pass incl. verify:npm-package
  one-artifact proof; flow boundary adjudicated correct (state machines are
  envelope-selection UX, ~30 branch points). Nits recorded on
  tasks/board-git-seam-nits. UNBLOCKS B.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T03:57:49.187Z'
---
[depends on](board-git-a0-seam-prep.md)
