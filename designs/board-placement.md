---
type: Design
title: 'Configurable board placement: board-on-main vs board-on-branch'
description: >-
  Decouple sync's collaboration niceties (converging conflicts, cursor,
  awareness, session-start) from the board-branch placement via a committed
  placement: main|branch config + a thin placement seam over git.ts. The first
  concrete sync-strategy seam; makes the main-vs-branch positioning question
  configurable. Sync domain — coordinate with Brian.
actor: mike/claude
timestamp: '2026-07-12T01:36:34.917Z'
---
# Configurable board placement: board-on-main vs board-on-branch

**Status:** Proposed design (2026-07-11). Directional — establishes the shape, not a committed
build. Sits in the sync/board-sharing domain Brian has been driving (git-sharing, --migrate/
--establish, local-only degradation, board-parity); coordinate there. Under
[local-first-loop](../roadmap-items/local-first-loop.md); part of the
[radical-simplification](../roadmap-items/radical-simplification.md) arc.

## Motivation

The board migrated from **on-main** (the original "bundle-commit convention" — small `board:`
commits pushed straight to main) to a **`board` branch** (gitignored on main, managed by `sync`).
The branch model buys separation but adds real friction — the heavy provisioning machinery, and
it fights GitHub's UI (every board push offers a forbidden "Compare & pull request"). Some teams
will want the board **back on main**: simpler, in-tree, no branch dance.

The problem is that today **placement and sync's value are welded together**:

- **board-on-branch** → you get ALL of `sync`'s niceties: the converging conflict resolution
  (teammate-wins, yours-exported-to-a-file, exit 5), the cursor, teammate awareness, the
  SessionStart freshness block.
- **board-on-main** → you get NONE of them. You're back to plain `git add/commit/push` on the
  bundle files. `git.ts` is hardcoded to a `board` branch (`provisionBoardWorktree`,
  `pushBoardUpstream`, the board worktree), so `sync` simply doesn't serve a main-placement board.

So a team that wants the *simplicity* of on-main has to give up the *collaboration niceties* that
make sync worth having. **The real goal isn't "let the board sit on main" (you can already do that
by not running sync) — it's to decouple sync's collaboration value from the branch placement**, so
an on-main board gets the same converging conflicts, awareness, and session-start freshness.

This is also the first *concrete* second strategy that justifies a placement seam — the gate-3
discipline (prove a seam with a real second implementation, don't abstract for a hypothetical) now
applies, where it did not when git was the only strategy.

## The two placements

| | **`main`** (in-tree) | **`branch`** (current) |
|---|---|---|
| Where the bundle lives | `.agentstate-lite/` committed on the working branch, alongside code | `.agentstate-lite/` gitignored on main, on a `board` branch |
| Provisioning | none — it's already in the tree | provision a board worktree |
| Which ref sync targets | the current branch | the `board` branch |
| gitignore of `.agentstate-lite/` | NOT ignored (it's committed) | ignored on main |
| Fresh-clone discovery | trivial — the bundle is right there (folder walk) | needs a committed marker so a clone knows to provision |

## Design: a thin placement seam

Introduce a committed `placement: "main" | "branch"` config and factor `sync` into two layers:

1. **Shared collaboration logic (placement-agnostic):** staging the bundle diff, the converging
   conflict resolution, the cursor, teammate awareness, and the session-start freshness block. This
   operates on the bundle's doc-level diff and does not care which ref carries it.
2. **A thin placement adapter (the seam):** just the placement-specific parts —
   - `provision()` — branch: create/repair the board worktree; main: no-op.
   - the target ref for commit / fetch / push — branch: the board branch; main: the current branch.
   - the gitignore treatment on init/establish.

Two adapters (`main`, `branch`) prove the seam. Keep it MINIMAL — this is a factoring of the
existing `git.ts`, not a rewrite, and NOT a general multi-backend framework.

## Subtleties / decisions to make

- **Discovery on a fresh clone.** `main` is trivial (the bundle is in-tree). `branch` needs a
  committed marker *on main* (the bundle is gitignored there, so a clone must be told "the board
  lives on branch X") — likely the placement config itself, committed somewhere visible (e.g. a
  committed `.agentstate.json` / board-config, NOT gitignored for this purpose).
- **Commits on main.** Does sync make its own `board:`-prefixed commits on the current branch
  (mirroring the branch model's behavior, just on main), or does the bundle ride normal dev
  commits? Leaning: sync still authors `board:` commits — its value (attribution, the activity
  feed, converging pulls) depends on owning the commit.
- **Conflict flow on main.** The converging resolution is placement-agnostic (it works on the
  bundle diff), so it reuses directly. The one difference: on main the bundle shares history with
  code, so a sync pull is a fetch+rebase of the current branch scoped to the bundle path — needs
  care not to touch non-bundle files.
- **`--migrate` / `--establish` become placement transitions.** `--establish` gains a placement
  choice (default likely `main` — the simpler one). The existing `--migrate` (main→branch) is one
  transition; the **reverse (branch→main)** becomes a supported walk-back. "Stay on main, never
  migrate" is just the `main` default.
- **CI / parity interaction.** The board-parity test already breaks in board-less checkouts
  (Brian's `board-parity-test-post-migration`); placement changes when the board is present
  (`main` = always in-tree; `branch` = absent on main). The hermetic-fixture approach should key
  off placement.

## Non-goals

- An abstract multi-strategy framework. Two placements behind a minimal seam — that's it.
- Conflating this with the STORAGE backend seam (`StorageBackend`) — that's a separate axis
  (*where docs persist*), already pluggable + config-selectable via `.agentstate.json`. This seam
  is about *how a local bundle is shared over git*.
- Rewriting `git.ts`. This is a factoring: pull the placement-specific bits behind the adapter,
  leave the git plumbing intact.

## Sequencing

1. **Design lock** — config schema + home (this doc → agree the `placement` key + where it's
   committed), the placement-adapter interface, and the discovery story.
2. **Extract the seam** — factor shared collaboration logic from the branch-specific provisioning /
   ref-targeting in `git.ts`; implement the `main` and `branch` adapters; wire config selection
   through the resolution layer.
3. **Transitions** — `--establish` gains a placement choice; add the reverse (branch→main) migrate.

## Open questions

1. Config home + schema: extend `.agentstate.json` with a `placement` key, or a dedicated
   committed board-config doc? (Lean: `.agentstate.json` — it already carries bundle resolution.)
2. Default placement for `init`/`establish` — is `main` the new default (simpler), with `branch`
   opt-in for teams that want separation?
3. The discovery marker for `branch` placement — exact form + where it's committed so a fresh clone
   resolves it before its first `sync`.

## Relationships

- Realizes part of [local-first-loop](../roadmap-items/local-first-loop.md) (board in git).
- Part of the [radical-simplification](../roadmap-items/radical-simplification.md) arc (stop forcing
  the branch model).
- Resolves the lingering main-vs-branch *positioning* unease by making placement **configurable**
  rather than a single baked-in choice ([positioning](../tasks/positioning.md) settled the tier
  boundary but not this).
- Coordinate with the sync-domain work: [git-sharing](../tasks/git-sharing.md),
  [sync-local-only-degradation](../tasks/sync-local-only-degradation.md),
  [sync-migration](../tasks/sync-migration.md).
