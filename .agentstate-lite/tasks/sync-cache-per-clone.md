---
type: Task
title: >-
  Awareness cache keyed per remote overwrites across clones (PR#13 review, item
  4)
status: todo
priority: '1'
description: >-
  MEDIUM-HIGH, blocks U4's backstop honesty: two clones of one origin on one
  machine share one cache file — a clean sync in clone A erases clone B's
  'unpushed work' state.
timestamp: '2026-07-08T15:03:34.425Z'
---
Driven evidence (PR#13 panel, empirical): clone B had 2 stranded unpushed commits
(cache unpushed: 2); a clean sync in clone A reset the SHARED cache to unpushed: 0 —
the backstop fails exactly on its target case. The founders' agent-worktree pattern
makes same-machine multi-clone the NORM, not an edge.

DoD: cache/cursor/marker keying includes the checkout identity (bundle root path, or
remote + checkout path — decide with U2's canonicalization caveats in mind: the
ssh-vs-https false-split and .git-strip false-merge recorded on tasks/sync-cursor-store).
Cross-clone isolation test: B's stranded state survives A's clean sync. Coordinate with
tasks/sync-sessionstart (reads these keys) and note the cursor migration story for any
existing state files.
