---
type: Journey Stage
title: Show the durable View in conversation
journey: journeys/new-user-to-recurring-value
order: 08
lane: shared
readiness: works
criticality: core
description: Stage 08 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:53.349Z'
---
# Desired experience

The user asks to see a named or purpose-matched View and the agent invokes the registered View in the
conversation; the View reads current bundle objects rather than copied prompt data.

# Current experience

Registered durable Views can be discovered and shown through the local MCP server. The unified
catalog and invocation model have shipped, with some host lifecycle roughness still being hardened.

# Acceptance criteria

- The agent lists or selects an appropriate registered View without one tool per View.
- Inline presentation loads the exact registered source and live data.
- Unknown or unauthorized Views fail with an actionable error.

# Evidence

Founder tests have displayed permanent AgentState Views inside the ChatGPT desktop conversation.

# Remaining gaps

Prove the same clean invocation journey in both primary desktop hosts and keep recovery errors
human-readable.

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage specified by](../designs/unified-portable-view-model.md)
