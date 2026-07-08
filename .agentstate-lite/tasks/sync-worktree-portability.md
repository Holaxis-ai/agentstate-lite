---
type: Task
title: >-
  Board worktrees break under path-remounted sandboxes - use relative paths +
  worktree repair self-heal
status: todo
priority: '1'
description: >-
  Field finding (2026-07-08, real sandboxed-agent deployment; reproducible:
  mount any board-branch repo at a different path - devcontainer/CI/sandbox):
  linked worktrees store ABSOLUTE paths both directions, so a remounted checkout
  reads as broken/prunable, provisionBoardWorktree fires the non-empty-dir
  refusal, and its move-it-aside hint is HARMFUL advice in this case (sidelines
  a valid worktree, then re-provisions under the sandbox path, breaking the
  host). Three-part fix: (1) provision + U5 migration create worktrees with
  RELATIVE paths (git 2.48+ worktree.useRelativePaths / --relative-paths; the
  worktree lives inside the repo, so relative = mount-portable by construction;
  verified live incl. converting an existing absolute setup via git worktree
  repair); (2) before the non-worktree refusal, if the dir carries a .git FILE,
  attempt git worktree repair as a structural self-heal, re-check, THEN refuse;
  (3) reword the refusal hint to distinguish foreign-directory from
  worktree-with-stale-pointers. Relative-gitdir READ compat is broad (submodule
  precedent); the 2.48 gate applies to WRITING - feature-detect, fall back to
  absolute + a repair hint. Affects every containerized/sandboxed agent on the
  board-branch architecture. The U3a never-touch guarantee held throughout: the
  failure is refusal + bad advice, not damage.
actor: claude
timestamp: '2026-07-08T19:22:20.623Z'
---

