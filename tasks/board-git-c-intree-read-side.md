---
type: Task
title: 'board-git PR C: in-tree read-side mode'
status: in_progress
priority: '4'
description: >-
  Builder complete: PR #80 (feat/board-git-c-intree-read-side), reviewed
  candidate b468e2459a58c9b0c0bd4b8a6abfb5f58107d1b3, base 9d9a415. Shipped:
  detection wired act-time in sync (in-tree verdict only leaves today's flow;
  establish deliberately NOT detection-routed — its live-fetch gates already
  fail closed, both arms pinned); intree.ts upstream decision table (tracking
  config or no-comparison-basis, fetch only the tracked remote, time-boxed,
  tree-untouched); cursor tier git-intree with mode-flip isolation pinned both
  ways; selfActors via generic onPersisted in mutate.ts + board-attribution.ts
  binding (BOTH modes per plan); --show-incoming = upstream-scoped viewer;
  refusals USAGE exit 2 with details.state in-tree; preShareWindowError
  no-origin copy fixed; home local-evidence probe (offline-safe, ordered after
  board-ref probes); autopull exclusion pinned; SKILL regenerated. Smoke: branch
  battery unchanged; in-tree e2e clean. FOR REVIEW (disclosed): two sanctioned
  tracked-folder behavior changes (remoteless committed: local-only exit 0 ->
  in-tree refusal exit 2; verified-dual: pre-share -> dual arm) + intended
  branch-mode attribution delta (direct doc writes now self-recorded).
  Independent review IN FLIGHT; focused QA to follow.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-16T05:27:28.403Z'
---
[depends on](board-git-b-channel-detection.md)
