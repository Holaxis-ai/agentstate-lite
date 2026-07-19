---
type: Task
title: >-
  Remote-mode ui: the watcher's initial fetch at boot has no timeout (a dead
  upstream hangs bootUiServer)
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate] Grepped for 'AbortSignal.timeout'
  in packages/ui-server/src and packages/cli/src — no matches.
  packages/ui-server/src/watch.ts:141 ('let last = await takeSnapshot(opts,
  aborter.signal)') is still the untimed initial fetch; aborter.signal only
  fires on stop() (server shutdown), never on a boot deadline. server.ts's
  bootWatcher (line 525) is awaited directly by bootUiServer, and its own
  comment ('a watcher that cannot start ... leaves the UI fully usable') only
  covers a watcher that THROWS, not one that hangs — a dead --remote upstream
  still hangs the boot path exactly as described. Found by adversarial QA during
  the PR #69 shutdown review (2026-07-15): in --remote mode, bootUiServer's
  watcher performs its initial fetch with no timeout (undici default ~300s) — an
  upstream that never responds hangs the BOOT path (the shutdown path is now
  fine: proxied requests abort on close). Fix direction: time-box the initial
  watcher fetch (AbortSignal.timeout) and surface a structured boot error; align
  with session-start's budget discipline.
actor: mike/claude
timestamp: '2026-07-19T13:11:57.732Z'
---

