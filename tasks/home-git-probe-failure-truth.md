---
type: Task
title: 'Bug: report Git discovery failures as unavailable, not private'
status: in_progress
priority: high
description: >-
  PR #137 follow-up: repoTopLevel collapses every nonzero rev-parse result to
  null, allowing a broken Git probe inside a repository to fabricate a private
  state.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-21T21:49:22.227Z'
---
# Problem

No repository is legitimate evidence for the private row. A Git command failure inside a repository is indeterminate evidence and must fail closed to unavailable.

# Acceptance criteria

- Repository discovery distinguishes no enclosing Git marker from a failed probe inside an apparent repository.
- classifySharing maps the latter to unavailable with a useful reason.
- A plain non-repository folder remains private.
- Deterministic tests cover a malformed repository and the true no-repository row.
