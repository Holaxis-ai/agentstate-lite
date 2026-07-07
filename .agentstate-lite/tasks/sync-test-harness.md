---
type: Task
title: 'U0 sync test harness: scratch git topologies + fixtures (BLOCKS ALL)'
status: done
priority: '1'
description: >-
  SHIPPED (this PR): packages/cli/test/git-harness.ts (hermetic fixture library
  — two-clone topologies, board worktree provisioning incl. --no-track
  migration-machine state, same/different-doc divergence, dangling cursor via
  real gc, wedged mid-rebase, O_EXCL index.lock/GIT_BUSY, staged/dirty user-code
  planters, frontmatter-actor vs git-author divergence) + git-harness.test.ts
  (12 state-asserting self-tests). CLI suite 406->418, npm run check green.
  Builder builder-u0; independent review APPROVE (safety: single wrapped spawn
  site, sandbox escape impossible by construction; both deviations ruled
  accept). Caveats for U1/U2 builders: build ff-only-matrix/push-fail/two-origin
  fixtures in-suite (reviewer's downstream_gaps list); deprovisionBoard is
  exported but uncovered until U1 uses it.
assignee: builder-u0
timestamp: '2026-07-07T22:02:31.038Z'
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
