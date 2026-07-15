---
type: Task
title: 'Workspace catalog: surface registered workspaces in home/session-start'
status: in_progress
priority: '1'
description: >-
  Implemented in draft PR #60 at independently approved SHA 9778a79. Non-empty
  catalogs now surface count plus sorted labels in home/session-start with
  explicit resolve guidance; ids and paths stay hidden. Detailed live
  availability remains on-demand in catalog list so the always-on path does not
  probe locators. Empty catalogs stay silent; malformed, non-regular, or stalled
  reads fail soft and cannot prevent the built CLI from exiting. No
  registration, crawling, removal, targeting sugar, UI, or resolution-precedence
  change. Awaiting merge.
actor: mike/codex
timestamp: '2026-07-15T03:35:20.055Z'
---
[depends on](workspace-catalog-core-loop.md)
