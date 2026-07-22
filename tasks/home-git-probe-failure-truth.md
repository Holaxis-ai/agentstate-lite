---
type: Task
title: 'Bug: report Git discovery failures as unavailable, not private'
status: done
priority: high
description: >-
  Bug: Git discovery failures inside an apparent repository can be misreported
  as private rather than unavailable. Observed after merge of PR #137.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-22T23:22:20.006Z'
---
# Problem

No repository is legitimate evidence for the private row. A Git command failure inside a repository is indeterminate evidence and must fail closed to unavailable.

# Acceptance criteria

- Repository discovery distinguishes no enclosing Git marker from a failed probe inside an apparent repository.
- classifySharing maps the latter to unavailable with a useful reason.
- A plain non-repository folder remains private.
- Deterministic tests cover a malformed repository and the true no-repository row.

# Outcome

Fixed on branch fix/home-truth-followups at commit 6418972c1f4225dae7034708496090f51e5e359d. A detailed repository probe now distinguishes repo, not_repo, and unavailable; the legacy repoTopLevel wrapper preserves its existing fail-soft contract for unrelated callers.

# Verification

- Independent exact-SHA review: PASS, high confidence, no findings.
- Independent exact-SHA QA: PASS, high confidence, no issues.
- Elevated unpiped npm run check: exit 0, including 18/18 Playwright tests.
- Malformed repository, missing-path, missing-Git-executable, plain non-repository, linked-worktree, and legacy projection cases passed.
