---
type: Task
title: 'Bug: suppress local privacy onboarding in remote UI mode'
status: in_progress
priority: high
description: >-
  Bug: remote UI mode can render local-only privacy onboarding alongside hosted
  sharing state. Observed after merge of PR #137.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-22T23:03:59.068Z'
---
# Problem

Remote mode is hosted policy, not a local bundle. Launcher currently uses root presence as a proxy for local mode, while ui-server supplies remoteBase as root.

# Acceptance criteria

- First-run orientation is eligible only in dir mode with a local bundle root.
- A remote config never displays the local privacy promise, regardless of root shape.
- Regression tests cover both remote and local first-run behavior.
- Existing where-is-this disclosure continues to identify the remote server.
