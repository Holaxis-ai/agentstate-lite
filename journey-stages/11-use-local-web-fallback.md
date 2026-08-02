---
type: Journey Stage
title: Use the same View through local web
journey: journeys/new-user-to-recurring-value
order: '10'
lane: terminal-web
readiness: works
criticality: core
description: Stage 10 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:53.832Z'
---
# Desired experience

A terminal agent can open the same registered View in local web for the human, with the same data,
queries, actions, and trust decisions as MCP presentation.

# Current experience

The local launcher and portable View registry work. Architecture now treats web and MCP as adapters,
though older guidance and some affordances still reflect their separate evolution.

# Acceptance criteria

- No View rewrite or re-registration is required for web.
- The launcher makes useful Views discoverable and clearly scoped to the current bundle.
- Unsupported host capabilities fail explicitly rather than silently degrading semantics.

# Evidence

Existing registered Views run in the local web launcher and the portable-View design is ratified.

# Remaining gaps

Finish guidance cleanup and cross-host parity dogfood as features are added.

[journey stage planned by](../roadmap-items/ui-rethink.md)

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage specified by](../designs/unified-portable-view-model.md)
