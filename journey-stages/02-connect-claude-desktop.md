---
type: Journey Stage
title: Connect Claude Desktop
journey: journeys/new-user-to-recurring-value
order: 02A
lane: claude-desktop
readiness: rough
criticality: core
description: Stage 02A of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:51.695Z'
---
# Desired experience

One explicit setup action registers the local AgentState MCP server with Claude Desktop, verifies
the executable and bundle target, and explains whether a restart is required.

# Current experience

The MCP server works, but manual configuration and host-specific failure messages have required
founder debugging. A dedicated install verb remains open.

# Acceptance criteria

- Setup writes valid Claude Desktop configuration without hand-editing JSON.
- A verification command diagnoses executable, arguments, bundle, and protocol startup.
- The first conversation can list and show registered Views.

# Evidence

Claude Desktop has rendered AgentState Views, while failed setup attempts exposed install friction.

# Remaining gaps

Replace tribal setup knowledge with a verified, self-describing path and run a clean-machine proof.

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage implemented by](../tasks/mcp-install-verb.md)

[journey stage implemented by](../tasks/skill-mcp-compatibility.md)
