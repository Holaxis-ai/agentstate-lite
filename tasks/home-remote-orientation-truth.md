---
type: Task
title: 'Bug: suppress local privacy onboarding in remote UI mode'
status: in_progress
priority: high
description: >-
  PR #137 follow-up: remote config currently supplies a non-null root, so the
  Launcher can display local-only privacy onboarding next to a hosted sharing
  chip.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-21T21:49:21.547Z'
---
# Problem

Remote mode is hosted policy, not a local bundle. Launcher currently uses root presence as a proxy for local mode, while ui-server supplies remoteBase as root.

# Acceptance criteria

- First-run orientation is eligible only in dir mode with a local bundle root.
- A remote config never displays the local privacy promise, regardless of root shape.
- Regression tests cover both remote and local first-run behavior.
- Existing where-is-this disclosure continues to identify the remote server.
