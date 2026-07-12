---
type: Review Request
title: 'Review: configurable board placement (main vs branch)'
status: requested
reviewer: Brian Derfer
requested_by: Michael Collier
question: >-
  Is the placement-seam approach right — decoupling sync's collaboration
  niceties from the branch placement via a committed placement: main|branch
  config plus a thin adapter over git.ts — and are the config-home, discovery,
  and commit-on-main decisions sound enough to schedule the build?
actor: mike/claude
timestamp: '2026-07-12T02:55:16.666Z'
---
# Context

The board migrated from on-main to a `board` branch, which **welds sync's collaboration value to
the branch placement**: on-branch you get the converging conflict resolution, cursor, teammate
awareness, and the session-start freshness block; on-main you get none of them (plain
`git add/commit/push`). Some teams will want the board back on main for simplicity — no branch
dance, no GitHub "Compare & pull request" friction. The design proposes **decoupling sync's
niceties from the placement** via a committed `placement: main | branch` config plus a thin
placement adapter over `git.ts` (shared collaboration logic + placement-specific provisioning /
ref-targeting) — a factoring, not a rewrite, and the first concrete sync-strategy seam.

Full design + subtleties: [designs/board-placement](../designs/board-placement.md). This is the
sync domain Brian has been driving (git-sharing, `--migrate`/`--establish`, local-only degradation,
board-parity), which is why the judgment is routed here.

# Requested decision

Please judge each explicitly:

1. Is **decoupling sync's collaboration value from the branch placement** the right framing (vs
   keeping placement and machinery welded)?
2. Is a **thin `placement: main | branch` seam over `git.ts`** the right shape — a factoring, not a
   rewrite — and is this the right FIRST sync-strategy extraction, or premature?
3. **Config home:** extend `.agentstate.json` with a `placement` key, or a dedicated committed
   board-config doc?
4. **Fresh-clone discovery** for the `branch` case (the bundle is gitignored on main): is a
   committed marker the right mechanism, and where should it live?
5. **Commits on main:** should sync still author its own `board:`-prefixed commits (for attribution
   + the activity feed), or let the bundle ride normal dev commits?
6. **Transitions:** are `--establish` gaining a placement choice and a reverse branch→main migrate
   worth building, or scope creep?
7. Anything **missing or mis-scoped** for the value it unlocks.

# Acceptance criteria

A complete review:

- records `approved` or `changes_requested` with a concise `decision_summary`;
- answers all seven judgments, including conditions or counterexamples;
- if `changes_requested`, names what would move it to `approved`.

# Reviewer response

_(Brian to complete.)_
