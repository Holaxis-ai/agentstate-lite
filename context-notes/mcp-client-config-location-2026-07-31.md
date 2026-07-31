---
type: Context Note
title: 'Orientation: locate Codex MCP client configuration'
actor: codex-mcp-config-trace
timestamp: '2026-07-31T19:02:49.099Z'
---
# Summary

- **Ultimate goal:** Make agentstate-lite the shared, versioned, conflict-safe local-first memory for agents and humans.
- **Proximate goal:** Replace the stale PR #177 Codex MCP client with the durable production agentstate-lite MCP client; this serves the ultimate goal by restoring the supported distribution channel for conversational bundle Views.
- **Outcome:** Complete. Backed up `/Users/brian/.codex/config.toml` to `/Users/brian/.codex/config.toml.backup-before-aslite-production-20260731`.
- **Production client:** Added global Codex server `[mcp_servers.aslite-views]` with command `/opt/homebrew/bin/aslite` (installed `@holaxis/aslite@0.1.0-pre.1`) and args `mcp --dir /Users/brian/GitHub/agentstate-lite/.agentstate-lite --actor brian`.
- **Cleanup:** Removed `[mcp_servers.agentstate-lite-pr177-ca6d6aa]`, whose temporary worktree executable no longer existed.
- **Verification:** `codex mcp get aslite-views` reports the production client enabled; the executable and explicit bundle resolve; a direct JSON-RPC MCP initialize handshake succeeded with protocol `2025-03-26` and server name `AgentState Lite Conversational Views`; final config inventory contains `aslite-views` and no PR #177 entry.
- **Operational note:** Restart the Codex app or begin a fresh session so the host reloads the changed MCP configuration.
