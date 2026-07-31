---
type: Context Note
title: 'Orientation: locate Codex MCP client configuration'
actor: codex-mcp-config-trace
timestamp: '2026-07-31T18:56:37.065Z'
---
# Summary

- **Ultimate goal:** Make agentstate-lite the shared, versioned, conflict-safe local-first memory for agents and humans.
- **Proximate goal:** Locate the authoritative configuration source for the Codex MCP client `agentstate-lite-pr177-ca6d6aa`; this serves the ultimate goal by making the integration legible and reproducible.
- **Outcome:** Complete. The authoritative entry is the user-level Codex file `/Users/brian/.codex/config.toml`, lines 134-136, under `[mcp_servers.agentstate-lite-pr177-ca6d6aa]`. It launches `node /private/tmp/aslite-pr177-followup/packages/cli/dist/agentstate-lite.mjs mcp --dir /Users/brian/GitHub/agentstate-lite/.agentstate-lite --actor pr177-dogfood`.
- **Layering check:** `/Users/brian/GitHub/agentstate-lite/.codex/config.toml` contains no `mcp_servers` table. Codex also supports trusted project-scoped `.codex/config.toml` entries, but none defines this client here.
- **Runtime check:** `codex mcp list` reports the client enabled, while the configured binary path is now missing. The definition is therefore persisted but stale and cannot launch successfully until updated or removed.
- **Non-authority:** `/Users/brian/.codex/.codex-global-state.json` also contains the name in saved prompt/thread history; it is not the MCP configuration source and should not be edited for server setup.
