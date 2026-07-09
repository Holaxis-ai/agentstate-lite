---
type: Task
title: >-
  Opportunistic board freshness: stale-cache pull on read commands (real-time
  ladder rung 1, product-native)
status: todo
priority: '2'
description: >-
  Brian's demand signal (2026-07-09): regular, automatic, silent board pulls
  beyond session start. Adjudicated AGAINST cron/launchd (per-machine hand
  config, platform-variant, violates the no-daemon non-goal) and FOR the
  operational-moments pattern: board-reading commands check the awareness
  cache's age and refresh via a time-boxed ff-only pull when stale. The Homebrew
  pattern; rung 1 of the parked real-time ladder in its product-native shape.
actor: brian-claude
timestamp: '2026-07-09T16:37:11.557Z'
---
## Design sketch (carried from the adjudication; builder refines, panel-vets if judged risky)

**Trigger:** any board-reading command (`list`, `doc read`, `status`, `home`, `link show`)
on a bundle that IS a provisioned board checkout, when the awareness cache's `updatedAt`
is older than a threshold (default ~5m; the cache already carries the timestamp — U2's
`maxAgeMs` machinery reads it today).

**Action — the one open design question, inline vs detached:**
- INLINE: run the same time-boxed ff-only pull session-start uses (budget machinery
  shipped in U4; sub-second when current, bounded when something arrived), then serve
  the command. Simple, honest, adds bounded latency to a read.
- DETACHED: fire a one-shot `sync --pull-only` child and serve THIS command instantly
  from current state; the NEXT read is fresh. Zero added latency, slightly
  daemon-flavored (short-lived one-shot, not resident — arguably inside the no-daemon
  non-goal's letter and spirit, but adjudicate explicitly).

**Constraints (all standing):** ff-only only (never rebase — U3a's --pull-only
semantics); GIT_BUSY structured handling already covers racing the user's git;
detection-gated (never provisions — read commands must not materialize a board; that
stays sync/session-start's job); silent when current; an opt-out knob
(config or env, e.g. AGENTSTATE_LITE_NO_AUTOPULL) for CI and scripted contexts —
decide default-on vs default-off for non-TTY; cursor/cache writes identical to
session-start's pull step (one code path — reuse, don't fork).

**Also in scope (the installation last-mile):** `sync` (or the receipt) notices no
SessionStart hook is installed and hints `hook install` once — closing the one manual
step left in the onboarding chain.

**Explicitly out of scope:** any resident process; push on read (writes stay
unit-close/sync-triggered); rungs 2-3 of the ladder (shared head, push/SSE) stay
parked behind their own wake conditions.

**Evidence trail:** real-time ladder parked in plans/sync-verb (rung 1 wake condition);
Brian's ask 2026-07-09 is the demand signal; cron/launchd was drafted and rejected
before install (records: this task's description).
