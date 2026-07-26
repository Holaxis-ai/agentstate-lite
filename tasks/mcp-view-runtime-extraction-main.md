---
type: Task
title: Extract the host-neutral trusted View action authority
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Draft PR #165 at exact SHA c8d7d9dd8c3fe05705e1d10979f778549847491e.
  Independent COMMENT review posted at
  https://github.com/Holaxis-ai/agentstate-lite/pull/165#pullrequestreview-4782369865
  with no findings; ready once draft is intentionally cleared. Reviewer
  confirmed exact-SHA Node 20/22/26 CI, fresh npm ci/build, identical 35
  ui-server tests on main and PR plus 2 view-runtime tests, a red-probed import
  boundary, byte-identical UI dist and ui --help, preserved ui-server exports,
  clean lock round-trip, unchanged 30-file zero-runtime-dependency npm tarball,
  and no MCP leakage. Residual risk belongs to future host adapters, not this
  local behavior-preserving move.
actor: openai/codex
timestamp: '2026-07-26T18:50:03.347Z'
---

