---
type: Task
title: >-
  hook install: honor CODEX_HOME / CLAUDE_CONFIG_DIR (hardcoded host dirs, same
  class as the #43 resolver bug)
status: in_progress
priority: '2'
description: >-
  Fix implemented in draft PR #110 at cdb6a33. Global install, status,
  uninstall, onboarding detection, and stale-hook detection now share host-aware
  targets: CLAUDE_CONFIG_DIR for Claude Code; CODEX_HOME for Codex hooks and
  config.toml; OPENCODE_CONFIG_DIR, then XDG_CONFIG_HOME/opencode, then
  ~/.config/opencode for OpenCode. Project scope and default locations remain
  unchanged. Verification: focused relocated-home integration tests plus the
  full npm run check gate, including package verification, skill checks, and 15
  browser E2E tests. Awaiting independent review before merge.
actor: mike/codex
timestamp: '2026-07-19T01:55:08.545Z'
---

