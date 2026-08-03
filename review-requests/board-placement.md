---
type: Review Request
title: 'Review: configurable board placement (main vs branch)'
status: changes_requested
reviewer: Brian Derfer
requested_by: Michael Collier
question: >-
  Is the placement-seam approach right — decoupling sync's collaboration
  niceties from the branch placement via a committed placement: main|branch
  config plus a thin adapter over git.ts — and are the config-home, discovery,
  and commit-on-main decisions sound enough to schedule the build?
actor: brian-claude
decided_at: '2026-08-03T20:02:03Z'
decision_summary: >-
  changes_requested (Brian Derfer, 2026-08-03). Framing A ACCEPTED — decoupling
  sync's niceties from where the board lives is the right goal (provisional; see
  how it plays out). But do NOT schedule the build without real user demand for
  board-on-main: the branch-model friction (GitHub 'Compare & pull request'
  prompt) is real yet only the deferred on-main option fixes it, so it is
  evidence for eventual value, not an urgent build. Deferring incurs ZERO
  one-way doors, satisfying the limit-one-way-doors priority. Mechanism
  decisions (config home, discovery marker, commits-on-main rebase risk,
  transitions) deferred to build time with the design as the ready blueprint.
  Moves to approved on real user demand for board-on-main with the niceties.
timestamp: '2026-08-03T20:02:03.685Z'
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

The full design + subtleties are in the design doc this request
[reviews design](../designs/board-placement.md) (`designs/board-placement`). It is the sync domain
Brian has been driving (git-sharing, `--migrate`/`--establish`, local-only degradation,
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

**Verdict: changes_requested** (Brian Derfer, 2026-08-03) — NOT because the design is unsound, but
because the specific ask ("sound enough to SCHEDULE THE BUILD?") is answered "not yet: get real user
feedback first." The strategic frame: limit one-way doors and friction, but do not expend build
effort ahead of real user demand.

1. **Framing (decouple value from placement): ACCEPTED (Framing A), provisional.** Right goal in
   principle — sync's collaboration niceties should not be welded to where the board lives. We want
   to see how it plays out in practice. The board branch is genuinely inelegant; the constant GitHub
   "Compare & pull request" prompt is exhibit A.
2. **Thin placement seam over git.ts / right first extraction: SOUND SHAPE, WRONG TIME.** The
   factoring-plus-a-switch is sensibly sized, but do NOT schedule the build without real user demand
   for board-on-main. Building the switch before a real second need is the premature-abstraction
   risk. The named friction (GitHub PR banner) is intrinsic to the branch model — only the on-main
   option removes it — so it is evidence FOR the eventual build, not a cheap independent win.
3. **Config home (.agentstate.json vs board-config doc): DEFERRED to build time.** Only becomes a
   lock-in surface if/when on-main ships; additive and reversible either way.
4. **Fresh-clone discovery marker: DEFERRED to build time.** A compatibility surface only once
   on-main ships; no lock-in incurred by waiting.
5. **Commits on main: DEFERRED, flagged as the riskiest mechanism to scrutinize at build time.** An
   on-main sync pull becomes a fetch+rebase of the current (code) branch scoped to the bundle path,
   which must never touch non-bundle files.
6. **Transitions (--establish placement choice + reverse branch->main migrate): DEFERRED with the
   build.** "Stay on main" as the default is acceptable framing when we do build.
7. **Missing/mis-scoped:** the key point is strategic — this is a get-user-feedback-first decision.
   Deferring incurs ZERO one-way doors now, satisfying the "limit one-way doors" priority. The design
   stands as the ready blueprint for when demand justifies scheduling the build.

**What would move this to `approved`:** real user demand for board-on-main — users actually hitting
the board-branch friction and wanting main placement WITH the niceties — at which point the design is
build-ready and the deferred mechanism decisions (3-6) get settled at build time.
