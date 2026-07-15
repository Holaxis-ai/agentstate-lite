---
type: Task
title: 'Workspace catalog: surface registered workspaces in home/session-start'
status: in_progress
priority: '1'
description: >-
  Claimed for implementation. Add one fail-soft workspace-catalog projection to
  the existing home render so session-start inherits it automatically: non-empty
  catalogs show count, label, and availability plus explicit resolve guidance;
  paths and ids stay out of orientation output; empty catalogs add no noise;
  malformed catalogs never prevent home/session-start. No registration,
  crawling, removal, targeting sugar, UI, or resolution-precedence change.
actor: mike/codex
timestamp: '2026-07-15T03:14:46.205Z'
---
[depends on](workspace-catalog-core-loop.md)
