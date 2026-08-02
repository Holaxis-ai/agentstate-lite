---
type: Task
title: >-
  A --dir path that isn't a bundle root errors with 'init --dir <same>',
  steering toward a divergent second bundle
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Claimed 2026-08-02 by openai/codex after re-verifying current main: explicit
  --dir still checks only <path>/index.md and emits init --dir <same> even when
  <path>/.agentstate-lite/index.md is the project's live workspace. Implement
  the smallest safe project-directory affordance plus a no-divergent-init guard
  for enclosing workspaces; preserve literal explicit-bundle behavior and prove
  both error/help paths.
actor: openai/codex
timestamp: '2026-08-02T14:34:07.057Z'
---

