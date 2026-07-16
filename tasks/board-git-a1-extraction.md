---
type: Task
title: 'board-git PR A1: mechanical extraction to packages/board-git'
status: in_progress
priority: '2'
description: >-
  CLAIMED mike/claude 2026-07-16; prerequisite CLEARED (PR #75 merged 82f4b26)
  and STEP 1 DONE via PR #76 (merged: cursor-store.ts neutral module +
  package-clean-imports seed test, Sonnet build + Sonnet review APPROVE).
  Remaining: create packages/board-git and relocate the A0/#76-prepared modules
  (board-git-errors, cursor-store, porcelain/diff from git.ts, sync-engine,
  autopull mechanic; carve sync-establish/sync flow into flow.ts per the plan's
  module map); unit suites move, command-level adversarial suites stay in CLI;
  FULL import-direction test with NO allowlist, closing the seed test's known
  gaps (bare side-effect imports, require/createRequire, template-literal
  dynamic imports — PR #76 review finding); build wiring (root
  workspaces/build/typecheck lists, esbuild alias in build-bundle.mjs, package
  tsc ordered before cli tests, verify:npm-package stays green); legal reverse
  edge: CLI consumes the package's BUNDLE_DIR. Zero behavior change; errors.ts
  keeps CliError + cliErrorFromBoardGit importing from the package.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T03:05:37.683Z'
---
[depends on](board-git-a0-seam-prep.md)
