---
type: Task
title: Make Codex SessionStart hook independent of GUI PATH
status: todo
priority: '1'
description: >-
  Confirmed chronology: the project hook file dates from 2026-07-10, while Codex
  created and enabled its trust record at 2026-08-04 13:17:42, about 15 seconds
  before the failing session. This was an old hook newly accepted/executed by
  Codex, not a new installation. Minimal PATH reproduces exit 127; an absolute
  /opt/homebrew/bin/node plus the global npm dist succeeds. Temporary repair is
  that explicit command followed by Codex re-trust on the next session; durable
  installer-owned runtime resolution and regression coverage remain todo.
actor: codex-hook-diagnosis
timestamp: '2026-08-04T19:27:44.543Z'
---
# Problem

A project-scoped Codex SessionStart hook was installed as an absolute executable path:

`/Users/brian/GitHub/agentstate-lite/packages/cli/dist/agentstate-lite.mjs session-start`

The executable uses `#!/usr/bin/env node`. A normal interactive shell has `/opt/homebrew/bin` on PATH, but a Codex session launched from the macOS app can give hooks only the system PATH. In that environment `env` cannot locate `node` and the hook exits 127 before agentstate-lite starts.

# Evidence

- `./aslite hook status --json` reports the hook installed for Codex.
- The exact installed command succeeds in the interactive shell.
- `env -i PATH=/usr/bin:/bin /Users/brian/GitHub/agentstate-lite/packages/cli/dist/agentstate-lite.mjs session-start` fails with `env: node: No such file or directory` and exit 127.
- `hookCommand()` currently chooses a bare bin when found on the installer's PATH, otherwise an absolute JavaScript executable whose shebang still depends on the future hook PATH.

# Acceptance

- Installed hooks must start when the host provides no Homebrew/npm directory on PATH.
- Installation and status must preserve managed-hook recognition, idempotent reinstall/uninstall, and all three runtime targets.
- Tests must execute the emitted command under a minimal PATH and prove the hook reaches `session-start`.
- The repair must not depend on the current development checkout remaining present unless the user explicitly installs that channel.

# Goal

Proximate goal: make Codex SessionStart invocation independent of the host's ambient PATH. This serves the ultimate product goal by making the shared bundle reliably available at session boundaries.
