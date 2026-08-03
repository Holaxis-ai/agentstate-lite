---
type: Task
title: >-
  No 'aslite mcp install' verb: the one surface built for host wiring makes
  users hand-author JSON
status: todo
priority: '1'
description: >-
  Scoped 2026-08-03 after current-host research; no source code changed.
  Recommended sequence: wait for Brian's durable npm executable/compatibility
  unit, then add a narrow mcp install|status|uninstall wrapper around host-owned
  Codex and Claude Code registration. Do not build a generic vendor-config
  subsystem; Claude Desktop packaging/configuration remains a separate
  evidence-driven decision. The worktree codex/mcp-install contains no
  implementation.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-03T03:17:12.984Z'
---
# Problem

`aslite mcp` runs the stdio server and nothing else. There is no verb that writes the host
configuration a user needs in order to reach it — `aslite mcp install` fails with
`unexpected positional argument: install`.

This is asymmetric with the rest of the Session command group, which exists precisely to write host
config on the user's behalf:

- `hook install|status|uninstall` — writes a real `session-start` hook across Claude Code, Codex,
  and OpenCode, resolving each host's config root.
- `skill install|status|uninstall` — installs the Agent Skill per host, with project/global scope.
- `mcp` — run-only. The user hand-authors JSON.

The MCP adapter is the surface whose entire purpose is being wired into a host, so it is the one
place where run-only is least defensible.

# Evidence from wiring it by hand (2026-07-26)

Attaching the experimental server to Claude Code on a founder machine took:

1. A first attempt using `${workspaceFolder}` in `.mcp.json` — a VS Code variable that Claude Code
   does not expand, so the entry would have silently failed to resolve.
2. A project-scoped `.mcp.json` at the repo root, which is NOT covered by `.gitignore` and carried
   both an absolute `/Users/<name>/...` path and an `--actor` value. In a public repository that is
   a leak waiting to happen.
3. Discovering that user scope means the top-level `mcpServers` key in `~/.claude.json` — a 241KB
   file of unrelated session state that should not be hand-edited.
4. Two `claude mcp add` round-trips to settle whether `--dir` should be pinned.

None of that is knowledge a user should need. `hook install` already owns the host-config-root
authority (including `CODEX_HOME` and `CLAUDE_CONFIG_DIR`) that this would reuse.

# Scope

Add `mcp install|status|uninstall` on the existing installer pattern:

1. Write a correct stdio server entry for supported MCP hosts, reusing the host-config-root
   authority rather than a second resolver.
2. Support project and user scope explicitly, and state which one it wrote.
3. Resolve the command base the way `hook install` does — the bare bin name when on `PATH`, else
   the absolute executable — instead of leaving the user to hardcode a path into their tree.
4. Decide and document the `--dir` default. Pinning a bundle makes the server deterministic but
   single-project; omitting it follows the cwd and fails in bundle-less projects (see the stdout
   error-routing defect filed separately). User scope makes this choice load-bearing, because the
   entry loads in every project.
5. Keep it explicit and reversible, consistent with the existing installers. No lifecycle scripts.

# Gate

The MCP adapter is experimental and unpublished as a standalone package. This work should follow,
not precede, the security-model unification that `tasks/mcp-view-security-model-unification` gates
— shipping an easy install path for a surface whose trust boundary is still under private
disposition would be backwards. File now, sequence later.

[depends on](mcp-view-security-model-unification.md)

[depends on](mcp-stdio-error-routing.md)
