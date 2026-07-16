---
type: Task
title: 'board-git PR A1: mechanical extraction to packages/board-git'
status: todo
priority: '2'
description: >-
  Move the A0-layered modules + their unit suites (~2.2k lines) into
  packages/board-git; adversarial command-level suites stay in the CLI.
  Import-direction test (source-specifier walk) ships here with NO allowlist in
  any merged commit. Build wiring: root build/typecheck lists, esbuild alias in
  build-bundle.mjs, package tsc ordered before cli tests. HARD-GATED on
  tasks/sync-migrate-removal landing first. CARRIED FROM A0 REVIEW (LOW):
  cursor.ts's defaultSyncStore/projections import credentials.js — split the
  factory (package) from the default instance + projections (CLI) before
  relocation. Also carve sync-establish's remaining composition edges into
  flow.ts; note errors.ts keeps bare instanceof CliError deliberately (CLI-side,
  single-copy) — the structural-guard discipline applies at the package edge.
actor: mike/claude
timestamp: '2026-07-16T01:13:59.628Z'
---
[depends on](board-git-a0-seam-prep.md)
