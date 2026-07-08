---
type: Task
title: >-
  sync's self-provisioning is silent — violates the detection-gated-and-LOUD
  rider
status: done
priority: '2'
description: >-
  SHIPPED via PR (same unit as worktree-portability — repair is a git mutation
  too, announcing one without the other would be incoherent).
  provisionAnnouncement wires {provisioned: <path> — materialized from
  origin/board} and {repaired: <path> — worktree pointers repaired} into EVERY
  output path: full receipt, already-up-to-date shortcut, push-fail partial,
  CONFLICT details, --pull-only ff-swallow errors. Steady-state carries neither
  key (byte-exact pinned). Rider 2 of decisions/board-branch-sync now fully
  satisfied: detection-gated AND loud. Field origin: first real fresh-clone
  deployment printed only already-up-to-date after materializing a worktree.
actor: mike
assignee: mike/claude
timestamp: '2026-07-08T20:25:07.697Z'
---

