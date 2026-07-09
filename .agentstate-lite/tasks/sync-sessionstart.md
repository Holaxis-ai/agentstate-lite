---
type: Task
title: >-
  U4 SessionStart: single in-process pull-then-render hook + home cache +
  backstop
status: done
priority: '1'
description: >-
  SHIPPED (fc52d1c, branch feat/sync-sessionstart, pending review+QA+merge). ONE
  SessionStart subcommand `session-start` (adjudication E): time-boxed
  best-effort pull (provision-if-needed loud per rider 2 -> fetch -> ff-only
  merge origin/board -> cache+cursor+marker writes) THEN the home render
  IN-PROCESS. Budget: 7s total / 5s ssh connect / under the 10s hook timeout —
  enforced by per-op spawnSync kills sliced from the remaining budget
  (empirically verified to unblock even with a hanging remote-helper grandchild
  holding the pipes) plus a command-layer race as the belt; a pull that loses
  the box is ABANDONED (killed), the render shows last-known cache + the pinned
  offline note, the NEXT session's pull refreshes (deviation from one plan
  reading: the losing pull does not keep running in background — in-process
  ruling won). DESIGN DECISIONS: (1) subcommand name session-start, registered
  in reference.ts Session group + KNOWN_COMMANDS; (2) SELF identity =
  operational — cursor.ts gains a per-clone selfActors section recorded by
  sync's commit step from the docs it commits ('unknown' never recorded:
  filtering it would hide teammates' unattributed work); (3) hook-outdated
  detection = managed-hook command lacking 'session-start' across project+global
  scopes, surfaced as a self-clearing home hook_update note (the U6-inherited
  re-run prompt); (4) hook install is now hand-rolled over the SDK's exported
  pure updaters because installSessionStartHooks cannot express a subcommand and
  its OpenCode plugin spawns argv-less — our OpenCode plugin source is
  args-aware and SDK-managed-marker compatible; (5) backstop counts are computed
  LIVE (local git) by home's board probe with cache fallback, so they stay
  honest when the network pull failed; (6) first contact is PROBE-GATED
  (origin/board or local board ref — marker NOT consulted: per-clone keying
  means a fresh clone has none, and deriving its key needs the same git calls
  anyway), and the init hint is suppressed next to ANY board block. INHERITED
  CLOSED: marker refresh added to sync's flow (item 5, test-pinned);
  provisioning run renders announcement + doc count (item 6). RELIED ON: PR#19's
  provisionAnnouncement (path-only, not persisted) is passed in-process from the
  pull step to the render — never through the cache. home.ts offline-guarantee
  tests untouched+green; board probe spawns LOCAL-ONLY git (documented in home's
  header). Tests 229 cli (28 new) all green; npm run check green; two-founder
  loop verified end-to-end on the BUILT artifact (fresh-clone provision receipt,
  up-to-date, attributed delta, offline note, hook install shape). Plugin
  1.0.22->1.0.23 both manifests. CAVEATS: (a) session-start --dir names the
  PROJECT dir (sync semantics) and bridges to home's bundle-root --dir by
  pointing the dashboard at the pulled board (documented in session-start.ts);
  (b) 'board: up to date' renders for a cache-driven clean state on plain home
  too (label honesty adjudication applied to the since-line only); (c)
  local-state swallow reasons (diverged/dirty/conflict) render 'board pull
  skipped (<reason>) — run sync to reconcile', not the offline note — builder
  wording; (d) reviewer should hand-check the resolveBundleKey call path for
  realpath (harness realpaths its roots — advisory (b)); resolveBundleKey
  realpaths internally, callers pass repo-top-derived paths. REVIEW ROUND
  (APPROVE + 3 polish fixes, applied on top): CLAUDE.md gate-1 hook bullet
  updated to the hand-rolled truth; as_of now keyed on an explicit
  pull.refreshed flag (a local-state-swallowed pull no longer reads as fresh —
  test-pinned pure + diverged e2e); the --dir bridge falls back to home's
  DISCOVERY walk when no board resolved (a boardless project with a committed
  .agentstate-lite no longer gets an init hint — test-pinned on this repo's
  shape). KNOWN NOTES: (a) home's board probe's local git spawns inherit the 30s
  LOCAL_TIMEOUT per op — realistic-case instant, but a pathological FS stall
  could blow the 10s hook window (worst-case unbudgeted by design; the budget
  slicing covers the network ops only); (b) hermeticity: tests that run
  home/session-start with DEFAULT deps read the real user HOME for the
  hook-freshness probe (this suite injects hookNeedsUpdate/swaps HOME; ad-hoc
  default-deps runs on a dev machine may see the hook_update nag).
actor: builder-u4
assignee: brian-claude
timestamp: '2026-07-09T00:28:14.726Z'
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

- Inherited from the cache-per-clone review (2026-07-08): (a) REUSE sync.ts's
  resolveBundleKey (export it) rather than re-deriving the state key in home.ts — a
  second independent derivation is the real state-split risk, not symlinks; (b) the U0
  harness realpaths its scratch roots, so harness-based tests CANNOT catch a caller
  that forgets to realpath — U4's reviewer should check that path by hand.
