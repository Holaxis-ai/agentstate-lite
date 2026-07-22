---
type: Task
title: 'Bug: report Git discovery failures as unavailable, not private'
status: in_progress
priority: high
description: >-
  Bug: Git discovery failures inside an apparent repository can be misreported
  as private rather than unavailable. Observed after merge of PR #137.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-22T23:03:59.432Z'
---
# Problem

No repository is legitimate evidence for the private row. A Git command failure inside a repository is indeterminate evidence and must fail closed to unavailable.

# Acceptance criteria

- Repository discovery distinguishes no enclosing Git marker from a failed probe inside an apparent repository.
- classifySharing maps the latter to unavailable with a useful reason.
- A plain non-repository folder remains private.
- Deterministic tests cover a malformed repository and the true no-repository row.
