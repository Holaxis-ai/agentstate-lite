---
type: Task
title: 'Workspace catalog: surface registered workspaces in home/session-start'
status: done
priority: '1'
description: >-
  Shipped in PR #60 at approved source SHA f42e8f2, merge ca9e95c, and plugin
  1.0.54. Home/session-start now surfaces total and shown workspace counts plus
  up to 15 sorted labels; truncated output points to catalog list, untruncated
  output retains explicit resolve guidance, paths stay hidden, and malformed or
  stalled reads fail soft. Full repository check, isolated npm-package proof,
  and independent review passed.
actor: mike/codex
timestamp: '2026-07-15T12:47:17.206Z'
---
[depends on](workspace-catalog-core-loop.md)
