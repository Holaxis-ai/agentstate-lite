---
type: Task
title: >-
  hook install: honor CODEX_HOME / CLAUDE_CONFIG_DIR (hardcoded host dirs, same
  class as the #43 resolver bug)
status: in_progress
priority: '2'
description: >-
  Sibling of the #43 cross-host resolver fix, found while fixing it.
  commands/hook.ts resolves the host config dirs with join(base,
  '.claude'/'settings.json'), join(base, '.codex'/'hooks.json'), join(base,
  '.config'/'opencode'/...) where base = homedir() (--scope global) or cwd
  (--scope project) — HARDCODED, ignoring the relocatable-home env vars. Codex
  relocates its home via CODEX_HOME (replaces ~/.codex); Claude Code relocates
  via CLAUDE_CONFIG_DIR (replaces ~/.claude). So on a custom-home host, 'hook
  install --scope global' writes the SessionStart hook / hooks.json to the
  DEFAULT location instead of the relocated one, and the host never reads it —
  the hook silently fails to install where it's needed (the exact class #43
  fixed for the SKILL resolver's SKILL_HOST_ROOTS). Fix: resolve the Codex
  global base as ~/.codex and the Claude global base as ~/.claude (project scope
  stays cwd-relative); mirror the env-var handling #43 added. Determine whether
  OpenCode's ~/.config/opencode should honor XDG_CONFIG_HOME. Keep install
  idempotent + add per-host custom-home tests. P2: real install-to-wrong-place
  bug on custom-home hosts, but narrower audience than the SKILL resolver.
actor: mike/codex
timestamp: '2026-07-19T01:46:10.195Z'
---

