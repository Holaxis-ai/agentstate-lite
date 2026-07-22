---
type: Task
title: 'Bug: suppress local privacy onboarding in remote UI mode'
status: done
priority: high
description: >-
  Bug: remote UI mode can render local-only privacy onboarding alongside hosted
  sharing state. Observed after merge of PR #137.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-22T23:22:19.641Z'
---
# Problem

Remote mode is hosted policy, not a local bundle. Launcher used root presence as a proxy for local mode, while ui-server supplies remoteBase as root.

# Acceptance criteria

- First-run orientation is eligible only in dir mode with a local bundle root.
- A remote config never displays the local privacy promise, regardless of root shape.
- Regression tests cover both remote and local first-run behavior.
- Existing where-is-this disclosure continues to identify the remote server.

# Outcome

Fixed on branch fix/home-truth-followups at commit 6418972c1f4225dae7034708496090f51e5e359d. Launcher now gates local privacy onboarding on runtime dir mode as well as a local root, while remote disclosure remains available.

# Verification

- Independent exact-SHA review: PASS, high confidence, no findings.
- Independent exact-SHA QA: PASS, high confidence, no issues.
- Elevated unpiped npm run check: exit 0, including 18/18 Playwright tests.
- Focused Launcher and DocumentBrowser integration tests: 34/34.
