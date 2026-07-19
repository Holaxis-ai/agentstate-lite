---
type: Task
title: 'Agreement test: hook and skill discovery share Claude/Codex config roots'
status: todo
priority: '3'
description: >-
  After PR #110 merges, pin one default-and-relocated root matrix across global
  hook target resolution and generated skill discovery for Claude Code and
  Codex. This invariant already drifted twice (#43 and #110). Keep OpenCode
  outside the shared matrix because it has no skill-discovery surface; its
  OPENCODE_CONFIG_DIR/XDG behavior remains hook-only.
actor: mike/codex
timestamp: '2026-07-19T01:58:25.398Z'
---
[depends on](hook-install-relocatable-home.md)
