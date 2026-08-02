---
type: Journey Stage
title: Connect the ChatGPT desktop app
journey: journeys/new-user-to-recurring-value
order: 02B
lane: chatgpt-app
readiness: works
criticality: core
description: Stage 02B of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:51.923Z'
---
# Desired experience

One explicit setup action registers the local AgentState MCP server with the ChatGPT desktop app and
verifies that MCP App Views can be shown inline and expanded.

# Current experience

The server and Views have worked in the ChatGPT/Codex desktop experience, but setup is still more
manual than the intended product journey.

# Acceptance criteria

- Setup requires no source checkout or plugin cache path.
- The host discovers AgentState tools after one documented restart.
- A known durable View renders inline and expanded.

# Evidence

Founder dogfood has repeatedly shown live durable and generated Views in the desktop conversation.

# Remaining gaps

Turn the working developer path into a documented and independently repeatable user path.

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage implemented by](../tasks/mcp-install-verb.md)
