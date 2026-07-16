---
type: Task
title: 'Adopt-path hardening: close the two exotic QA corners from PR #82'
status: todo
priority: '3'
description: >-
  Both LOW, ff-only, no data loss, exotic preconditions (PR #82 QA record has
  repro scripts). (1) F1: a git checkout board landed inside the ~5-20ms
  validated-but-not-moved window lets the CAS ff the ref under the user's fresh
  checkout (phantom deletions in status; reset --hard recovers). Remediation:
  perform the ff as git fetch . +refs/remotes/origin/board:refs/heads/board —
  git itself refuses updating a checked-out branch's ref at update time — or
  re-verify checkout state post-CAS. (2) F2: a hand-crafted symbolic-ref
  refs/heads/board is DEREFERENCED by update-ref, moving the symref target (a
  ref no guard named); cheap guard: refuse when git symbolic-ref -q
  refs/heads/board succeeds. Also worth folding in: F4 (pre-existing,
  base-proven) — a mid-worktree-add SIGKILL corpse needs git worktree prune,
  which no CLI guidance mentions; add it to the stale-pointers refusal help. F3
  (loser's momentarily-stale refusal copy) is accepted as ugly-but-safe.
  High-risk file, small well-specified diff: Fable build, standard review.
actor: mike/claude
timestamp: '2026-07-16T13:29:58.507Z'
---

