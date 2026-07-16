---
type: Task
title: 'board-git PR A1: mechanical extraction to packages/board-git'
status: in_progress
priority: '2'
description: >-
  Builder complete: PR #78 (feat/board-git-a1-extraction), reviewed candidate
  769a3cb4e16d7b994ccc64b692045600ebd53c83, base aaca60d (post #75+#76).
  packages/board-git created (errors/porcelain/diff/cursor/engine/flow/autopull;
  barrel index; deps = node + core ONLY, manifest-pinned); import-direction test
  with NO allowlist (TS-AST walk; every seed-gap closed and proven red:
  bare/multi-line/export-from/require/createRequire/dynamic-non-literal); seed
  test retired as superseded. KEY JUDGMENT for review: flow.ts = step library
  (refCommit/treeOf/isAncestor/markers/createBoardRootCommit/createRemovalCommit
  message-parameterized/...); the sync/establish STATE MACHINES stayed CLI (they
  interleave envelopes/receipts — extraction would force behavior-visible
  redesign). autopull moved behind injected deps, CLI wrapper keeps call sites
  unchanged; new sync-cli.ts resolves the establish->sync edge; reverse edge
  explicit (CONVENTIONAL_BUNDLE_DIR_NAME = package BUNDLE_DIR). Tests:
  porcelain/harness moved (exit-asserts -> code-asserts, compensated by CLI
  parity table); adversarial suites + parity table + cursor.test.ts stay CLI.
  All gates exit 0 incl. verify:npm-package. Independent review IN FLIGHT on the
  exact sha.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T03:42:00.518Z'
---
[depends on](board-git-a0-seam-prep.md)
