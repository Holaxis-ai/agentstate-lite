---
type: Task
title: >-
  U4 SessionStart: single in-process pull-then-render hook + home cache +
  backstop
status: todo
priority: '1'
description: >-
  U4. One in-process pull-then-render SessionStart subcommand (time-boxed,
  guaranteed fall-through) plus home cache render and the both-count backstop.
  Deps: sync-command-core.
actor: brian-claude
timestamp: '2026-07-08T19:57:42.928Z'
---
# U4 — SessionStart integration

Builder brief. Plan: [plans/sync-verb-implementation](../plans/sync-verb-implementation.md)
§U4. String contract:
[research/sync-verb-ux-review](../research/sync-verb-ux-review.md) moment (e).

## Definition of done

ONE SessionStart hook command (adjudication E — unconditional, architect's ruling).
`hook install` wires ONE new bin SUBCOMMAND that does pull-then-render IN-PROCESS, portable
across Claude Code, Codex, AND OpenCode (gate-1 three-runtime requirement; name the
subcommand consistent with `reference.ts` conventions).

The command: time-boxed best-effort pull (provision if needed → fetch → ff-only merge
`origin/board` → write awareness cache + timestamped marker + advance cursor) THEN render
home. Pull budget ≤ 7s total, connect ≤ 5s, under the 10s hook timeout. GUARANTEED
fall-through to the home render — home ALWAYS renders last-known cache INSTANTLY
(stale-instant fallback explicit) and NEVER blocks on the network; the pull refreshes the
cache for the NEXT render when it loses the time box.

`home.ts` stays fs-only/offline/instant; its structural offline-guarantee test must stay
green UNTOUCHED.

Renders (moment (e), strings test-pinned):
- "since your last session: N docs changed — <actor>: <ids>"
- BACKSTOP counts BOTH unpushed board commits AND uncommitted board changes: "M local board
  commits not yet pushed — run sync when online"
- human face: one line per doc `mike · updated Task "…"`; clean → `board: up to date`;
  offline → "board sync offline — showing last known state"
- CURSOR HONESTY: since-line labeled by MACHINE reality ("since this machine last synced");
  self-authored changes FILTERED from the human count; actor phrase built from ACTUAL actors
  (never assumes one teammate).
- FIRST-CONTACT no-bundle fallback is board-aware via the fs-only marker: `origin/board`
  exists → "board not yet provisioned — run `aslite sync`", NEVER "run init".

## Acceptance criteria (tests, deps: U3a)

- home offline-guarantee test unchanged + green
- time-box fall-through: a slow/hung pull still renders home within budget
- cache render (moment (e), strings pinned)
- backstop both-count (unpushed commits AND uncommitted changes)
- divergent-second-bundle footgun: board-on-origin → "run sync" never "init"
- machine-honest since-line + self-authored filtering; actor phrase from actual actors

## Gates

Builder → independent Reviewer → QA. Deps: sync-command-core (U3a).

[depends on](sync-command-core.md)

## Inherited from the PR#13 three-lane review (2026-07-08)

- **Marker refresh (review item 5):** U3a's pull step never calls `refreshMarker` —
  plan §U2 says "refreshed by every pull step", and THIS unit's first-contact logic
  ("run sync, never init") reads it. Add the call (in sync's pull step or this unit's
  wiring) and test that a synced repo presents the marker.
- **Provisioning receipt (review item 6):** a first-ever sync that PROVISIONS the
  worktree prints "already up to date" with an empty awareness delta — the run that
  materialized the whole board announces nothing (`outcome.kind === "provisioned"` is
  computed and unused). Give it a distinct receipt ("board provisioned" + doc count)
  and make the first-contact render honest; test-pinned.
- Dependencies note: tasks/sync-actor-attribution and tasks/sync-cache-per-clone must
  land before this unit's human face renders, or it will say "unknown did everything"
  and the unpushed backstop will lie across clones.

## Inherited from U6 close (2026-07-08)

- U6 deliberately omitted the hook-install re-run prompt (its dependency is THIS unit's
  pull-then-render subcommand). This unit delivers it: when the new hook command ships,
  prompt founders to re-run `hook install` so their machines pick up the loop (U5's
  rollout note is the backstop).

- Inherited from sync-cache-per-clone (2026-07-08): state keying is now per-CLONE
  (remote + subpath + checkout root). A brand-new clone has NO marker until its first
  pull, so first-contact board detection must stay PROBE-GATED (origin/board existence),
  never marker-only — consistent with the detection-gated provisioning rider on
  decisions/board-branch-sync. Read that task record before building the home render.
