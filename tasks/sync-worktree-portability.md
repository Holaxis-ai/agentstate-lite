---
type: Task
title: >-
  Board worktrees break under path-remounted sandboxes - use relative paths +
  worktree repair self-heal
status: done
priority: '1'
description: >-
  SHIPPED via PR (mike/claude; builder + cold reviewer per the review
  conventions). Root fix: worktree creation passes -c
  worktree.useRelativePaths=true (honored by git >=2.48, silently ignored older
  — zero version probing), so fresh provisions are mount-portable BY
  CONSTRUCTION (verified: moved repo needs no repair on git 2.50). Fallback: a
  stale-pointer worktree (signature = .git FILE) gets git worktree repair before
  any refusal; success requires repairedWorktreeIsBoard — attached-on-board OR
  detached-mid-rebase-FROM-board (git's own rebase-merge/head-name, structural).
  THE REVIEW CYCLE MATTERED TWICE: the builder's first recheck weakening was
  proven by the cold reviewer to be silent data loss behind a false success
  receipt (commit stranded on a side branch while sync reported pushed:1); the
  builder confirmed via the probes, found a second sub-case (stray detached
  HEAD), and shipped the tightening mid-review with regressions incl. the deeper
  wedge-from-non-board case. Refusal wording now three-way: foreign dir /
  unrepairable pointers / genuine-checkout-wrong-branch (covers submodules).
  Field origin: real sandboxed-agent deployment (path-remounted mount).
actor: mike
assignee: mike/claude
timestamp: '2026-07-08T20:25:07.592Z'
---

