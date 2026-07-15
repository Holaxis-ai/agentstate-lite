---
type: Task
title: 'Workspace catalog: surface registered workspaces in home/session-start'
status: in_progress
priority: '1'
description: >-
  Implemented in draft PR #60 at independently approved SHA f42e8f2. Non-empty
  catalogs surface total count, shown count, and up to 15 sorted labels in
  home/session-start; truncated output points to catalog list, while untruncated
  output retains direct resolve guidance. IDs and paths stay hidden, and live
  availability remains on-demand in catalog list so the always-on path does not
  probe locators. Empty catalogs stay silent; malformed, non-regular, or stalled
  reads fail soft and cannot prevent the built CLI from exiting. No
  registration, crawling, removal, targeting sugar, UI, or resolution-precedence
  change. Full repository check and isolated npm-package proof pass; awaiting
  merge.
actor: mike/codex
timestamp: '2026-07-15T12:23:17.404Z'
---
[depends on](workspace-catalog-core-loop.md)
