---
type: Decision
title: >-
  Board branch + linked worktree for sync (Brian approved 2026-07-07; Mike to
  confirm before migration)
timestamp: '2026-07-07T19:39:02.318Z'
---
# Decision: sync operates on a dedicated `board` branch via linked worktree

**Context.** sync-verb v1 assumed the bundle syncs on the shared code branch. The design
review panel ([research/sync-verb-review](../research/sync-verb-review.md)) showed git's
pull/push are branch-atomic — folder-scoped sync is impossible there, and the shared-
branch porcelain corrupts or refuses in the common case. Brian then set the requirement
directly: sync must touch ONLY `.agentstate-lite/`.

**Decision.** The bundle lives on a dedicated `board` branch (branch root = bundle root),
checked out as a linked git worktree at `.agentstate-lite/`; the folder is gitignored on
main. `aslite sync` operates exclusively inside that worktree.

**Relation to the 2026-07-07 call decision.** REFINES, does not reverse, "bundle
committed IN the project repo": same repository, same remote, same access and auth. What
changes: board updates travel via `aslite sync` (or the SessionStart pull step), not via
`git pull` of main; and a fresh clone materializes the folder on first aslite contact
(self-provisioning) rather than by checkout.

**Consequences.** (+) sync structurally cannot touch user code; conflicts only ever in
docs; the worktree's own index removes lock contention with the user's git; main's log
carries no `board:` commits; `git log board` IS the activity feed. (−) one-time worktree
provision per clone (automated, self-healing); a one-time migration of the currently
main-committed bundle ([plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
U5); worktree `.git`-file handling becomes mandatory throughout (`rev-parse --git-path`).

**Status.** Brian approved in-session 2026-07-07. PENDING Mike's confirmation before the
migration unit (U5) executes on this repo. Build of U0–U4/U6 is not gated on it.
