---
type: Task
title: Remove --migrate after the founders' migration executes (ship-use-delete)
status: todo
priority: '2'
description: >-
  Brian's scope ruling (2026-07-09): --migrate is a temporary feature with an
  audience of two — it ships for the founders' one-time board migration and is
  REMOVED afterward. GATE: executes only after the migration has actually run on
  this repo AND the folder-removal PR has merged. Scope: delete the flag, its
  handlers, and its tests together; keep sync's provisioning path (that part is
  permanent product); bump plugin version. Wake condition for ever re-adding: a
  real external team asks to move a committed .agentstate-lite folder to
  branch-sharing — the reviewed implementation stays one git revert away.
actor: brian-claude
timestamp: '2026-07-09T17:16:46.796Z'
---
[depends on](sync-migration.md)
