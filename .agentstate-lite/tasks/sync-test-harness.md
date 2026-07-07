---
type: Task
title: 'U0 sync test harness: scratch git topologies + fixtures (BLOCKS ALL)'
status: todo
priority: '1'
description: >-
  U0. Hermetic git test harness (bare origin + two clones, board worktree)
  planting every sync fixture incl. stale-rebase and held index.lock. BLOCKS ALL
  sync units. Deps: none.
timestamp: '2026-07-07T21:17:06.807Z'
---
# U0 — sync test harness (BLOCKS ALL sync units)

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U0. Design: [plans/sync-verb](../plans/sync-verb.md). Evidence (verified command shapes):
[research/sync-verb-review](../research/sync-verb-review.md).

## Definition of done

NEW `packages/cli/test/git-harness.ts`: helpers that build scratch git topologies
HERMETICALLY and plant every fixture the sync suites need. It must be consumed by ≥2
downstream suites and run under `npm test -w agentstate-lite` with no network and no
mutation of the real repo.

Topologies: bare origin + two clones; provision a `board` branch + linked worktree at
`.agentstate-lite`.

Fixtures to plant:
- dirty non-bundle (user code) tree; staged user code on any branch
- new / modified / deleted docs in the board worktree
- divergent histories between the two clones (same-doc and different-doc)
- a dangling cursor SHA (history rewritten out from under a stored token)
- a STALE mid-rebase state (a worktree wedged mid-rebase, `rebase-merge` present)
- a CONCURRENT-SYNC / held-`index.lock` fixture (a second git process holding the worktree
  lock) — adjudication B, feeds the U1 GIT_BUSY test

## Acceptance criteria

- Hermetic: builds/tears down under a temp dir; leaves the real repo untouched; no network.
- Consumed by ≥2 of the U1/U2/U3a/U3b/U4 suites.
- Each fixture above is constructible via a named helper.

## Gates

Builder → independent Reviewer → QA (`npm run check` + gate-1 AXI watch-points). Ship on its
own branch + PR. Deps: none (this unblocks all others).
