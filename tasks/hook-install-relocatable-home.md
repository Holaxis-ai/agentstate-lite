---
type: Task
title: >-
  hook install: honor CODEX_HOME / CLAUDE_CONFIG_DIR (hardcoded host dirs, same
  class as the #43 resolver bug)
status: done
priority: '2'
description: >-
  Completed in PR #110 (merge commit 70ce01a). Independent review approved exact
  SHA cdb6a33 with no findings. Global install, status, uninstall, onboarding
  detection, and stale-hook detection share host-aware targets:
  CLAUDE_CONFIG_DIR; CODEX_HOME for hooks and config.toml; OPENCODE_CONFIG_DIR,
  then XDG_CONFIG_HOME/opencode, then ~/.config/opencode. Full npm run check and
  all CI lanes passed; reviewer independently passed build, CLI typecheck, 35
  focused hook tests, and an additional precedence/compatibility matrix.
actor: mike/codex
timestamp: '2026-07-19T02:16:09.425Z'
---

