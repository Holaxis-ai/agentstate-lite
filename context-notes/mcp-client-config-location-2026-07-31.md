---
type: Context Note
title: 'Orientation: locate Codex MCP client configuration'
actor: codex-mcp-config-trace
timestamp: '2026-07-31T18:55:28.988Z'
---
# Summary

- **Ultimate goal:** Make agentstate-lite the shared, versioned, conflict-safe local-first memory for agents and humans.
- **Proximate goal:** Locate the authoritative configuration source for the Codex MCP client `agentstate-lite-pr177-ca6d6aa`; this serves the ultimate goal by making the integration legible and reproducible.
- **Current evidence:** The session-start board is available. The prior PR #177 checkpoint describes Claude Desktop client configuration at exact candidate SHAs, but does not yet establish where this Codex-visible client name is configured.
- **Next action:** Trace the exact name through Codex global/project configuration and distinguish persistent file configuration from runtime/session injection.
