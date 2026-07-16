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
  tasks/sync-migrate-removal landing first.
actor: mike/claude
timestamp: '2026-07-16T00:17:44.333Z'
---
[depends on](board-git-a0-seam-prep.md)
