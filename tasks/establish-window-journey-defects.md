---
type: Task
title: >-
  Establish/window journeys: pre-existing defects surfaced by PR #75 adversarial
  QA
status: todo
priority: '3'
description: >-
  Carried-over defects (verified pre-existing vs origin/main; repro scripts in
  the QA record) + non-blocking nits from the #75 ladder. PRE-EXISTING: F2
  establisher's receipt chain fails exit 5 once a teammate advances the board in
  the window (leftover local board branch is a strict ancestor — ff-adopt or
  delete it); F3 teammate's unpushed board commit wedges their clone after
  cleanup merge (needs git rm --cached; preview understates); F4
  case-insensitive fs + .AgentState-Lite committed misroutes to greenfield
  (case-sensitive HEAD probe) — overlay hazard, low likelihood; F5 home says
  'run sync' in the both-worlds window, sync refuses (two-hop seam); F6 INFO
  origin/board deleted mid-window leaves a cleanup-PR offer that would orphan
  the board. NITS (review + delta): CONFLICT wording inaccurate for invalid
  marker sha; stale committed-case marker debris never cleared on fully-shared
  clones; internal migration-framing comments (git.ts:18,425,619,
  session-start.ts:250); F-D1 immutable marker file -> 'cleared' receipt without
  post-unlink check; F-D3 'never published' overclaims in crash-then-force-push
  corner.
actor: mike/claude
timestamp: '2026-07-16T02:48:09.325Z'
---
[depends on](sync-migrate-removal.md)
