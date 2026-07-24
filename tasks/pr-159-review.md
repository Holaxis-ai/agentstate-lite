---
type: Task
title: 'Review PR #159 at exact SHA'
status: in_progress
priority: high
assignee: codex-pr159-reviewer
actor: codex-pr159-reviewer
timestamp: '2026-07-24T23:42:02.866Z'
---
# Goal

Review PR #159 at its exact current head against current `main`, including its presently conflicting
integration state, and identify any correctness, migration-recovery, security-boundary, teaching,
or verification defects without modifying or posting to the PR.

This serves the ultimate product goal—a conflict-safe, legible shared memory system—by ensuring the
removal of legacy View names cannot silently hide bundle content, strand migration recovery, or
reintroduce conflicting concepts.

# Review protocol

- Pin exact head, current base, merge base, commit set, and CI state.
- Use a detached isolated worktree with a fresh lockfile install.
- Audit the complete diff plus the linked phase-3 task, deprecation decision, and four prior review
  rounds.
- Treat registration/access removal, diagnostics, recipe recovery, and destructive migration
  refresh as high-risk boundaries.
- Verify focused invariants empirically and distinguish branch correctness from merge-conflict
  integration risk.
- Do not edit source, post comments, approve, merge, or otherwise mutate the PR.
