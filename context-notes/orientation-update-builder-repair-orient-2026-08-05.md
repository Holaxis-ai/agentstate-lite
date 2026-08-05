---
type: Context Note
title: Orientation update ABA repair orientation
description: >-
  Exact-SHA review finding and revised lease/worker authority model before
  repair.
actor: codex-orientation-builder
timestamp: '2026-08-05T21:37:06.801Z'
---
# Summary

Exact-SHA Review failed candidate `21a028c418bf30ecb72aa77a0b06a244aee769d0` on a literal
one-worker-start invariant violation in the lease ABA boundary.

The system has three interacting authorities: cleanup may quarantine an expired cooldown at the
fixed lease path; a parent claims that path with a new active token; and a detached worker is
started only after the parent rereads cache freshness. A cleaner can capture parent A's newly
claimed fixed-path active record during quarantine cleanup, reopening the path for parent B. Both
parents can then pass the cache-only post-claim check and spawn, although worker A later rejects
lost token authority before network/cache publication. That preserves result integrity but violates
the stronger contract that only one worker process starts.

The repair goal is to add a deterministic cleaner-C / parent-A / parent-B barrier regression and
require the parent to revalidate that the fixed lease record still contains its own matching,
unexpired active token immediately before detached spawn, after the post-claim cache reread. Lost
authority must return without spawning or touching a successor lease. Existing state semantics and
rendered output remain unchanged.

[task](../tasks/orientation-update-notice.md)

[builder candidate](orientation-update-builder-complete-2026-08-05.md)
