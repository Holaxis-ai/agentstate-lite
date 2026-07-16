---
type: Task
title: 'board-git PR A1: mechanical extraction to packages/board-git'
status: todo
priority: '2'
description: >-
  Move the A0-layered modules + their unit suites (~2.2k lines) into
  packages/board-git; adversarial command-level suites stay in the CLI. STEP 1
  (confirmed by TWO independent reviews of merged #73 — my A0 review LOW + a
  second post-merge review): split cursor.ts's neutral store/key/schema
  implementation (package-bound) from the CLI's credentials adapter +
  defaultSyncStore wiring + free-function projections (CLI-bound) — as shipped,
  cursor.ts contradicts the board-git-API.md boundary and would fail the
  import-direction test on relocation. THEN the mechanical move.
  Import-direction test (source-specifier walk) ships here with NO allowlist in
  any merged commit. Build wiring: root build/typecheck lists, esbuild alias in
  build-bundle.mjs, package tsc ordered before cli tests. HARD-GATED on
  tasks/sync-migrate-removal (PR #75 in review). Also carve sync-establish's
  remaining composition edges into flow.ts; errors.ts keeps bare instanceof
  CliError deliberately (CLI-side, single-copy) — structural-guard discipline
  applies at the package edge.
actor: mike/claude
timestamp: '2026-07-16T01:50:57.767Z'
---
[depends on](board-git-a0-seam-prep.md)
