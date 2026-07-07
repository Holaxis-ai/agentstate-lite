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
timestamp: '2026-07-07T21:20:03.280Z'
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
