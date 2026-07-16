---
type: Task
title: >-
  Establish/window journeys: pre-existing defects surfaced by PR #75 adversarial
  QA
status: todo
priority: '3'
description: >-
  Carried-over (verified pre-existing vs origin/main, NOT #75 regressions; repro
  scripts in the QA record). F2: the establisher's own receipt chain (git pull,
  then sync) fails exit 5 once a teammate advances the board in the window — the
  leftover local 'board' branch is a strict ancestor of origin/board;
  provisioning refuses instead of fast-forward-adopting (fix: delete or ff-adopt
  the ancestor branch). F3: a teammate's unpushed board commit on the code
  branch survives the cleanup merge as a partially-tracked folder — clone wedges
  with no CLI exit (needs git rm --cached); preview warning understates this.
  F4: case-insensitive fs + a folder committed as .AgentState-Lite misroutes to
  greenfield and aliases tracked paths into the live board worktree
  (case-sensitive HEAD tree probe); low likelihood, real overlay hazard. F5:
  two-hop guidance seam — home says 'run sync to set up' in the both-worlds
  window, sync then refuses. F6 (INFO): origin/board deleted mid-window leaves a
  cleanup-PR offer that would orphan the board if merged without
  re-establishing.
actor: mike/claude
timestamp: '2026-07-16T02:21:19.186Z'
---
[depends on](sync-migrate-removal.md)
