---
type: Task
title: Declare UI E2E's @agentstate-lite/server dev dependency
status: in_progress
priority: '2'
description: >-
  Packaging hygiene found while inspecting the OSS server boundary.


  `packages/ui/e2e/harness.ts` imports `@agentstate-lite/server`, but
  `packages/ui/package.json` does not declare it. Hoisted monorepo resolution
  hides the missing edge.


  Small fix:

  - Add `@agentstate-lite/server` as the correct dev dependency and update the
  lockfile.

  - Prove a fresh workspace install/build and the UI E2E harness resolve without
  relying on an undeclared package.

  - No architecture checker, runtime refactor, or remote behavior change.


  Acceptance: focused UI E2E plus fresh install and full relevant gates;
  independent review/QA proportionate to the two-file dependency change.
actor: codex
timestamp: '2026-07-13T01:59:43.142Z'
---

