---
type: Task
title: >-
  sync's self-provisioning is silent — violates the detection-gated-and-LOUD
  rider
status: in_progress
priority: '2'
description: >-
  Found on the first real fresh-clone deployment (2026-07-08, reproducible on
  any clone of a repo with an origin/board branch): first sync correctly
  self-provisions the worktree, but the receipt prints only 'sync: already up to
  date' — the provisioning itself is unannounced. decisions/board-branch-sync
  rider 2 (Mike, binding): provisioning 'says so in structured output — never a
  silent git mutation.' Fix: the provision outcome {kind:'provisioned',
  boardPath} should surface a line/field in the envelope on every path incl.
  both empty states (e.g. provisioned: <path> or a help line). Small; natural
  rider on U4 or the sync-receipt-edge-polish task.
actor: mike
assignee: mike/claude
timestamp: '2026-07-08T19:26:21.369Z'
---

