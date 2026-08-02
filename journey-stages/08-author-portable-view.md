---
type: Journey Stage
title: Ask an agent to author one portable View
journey: journeys/new-user-to-recurring-value
order: '07'
lane: shared
readiness: rough
criticality: core
description: Stage 07 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:53.115Z'
---
# Desired experience

The user asks for a useful visualization; the agent discovers the portable View contract, authors a
durable responsive View against live bundle data, verifies it, and registers it once.

# Current experience

The portable model and bridge are real, but agents still need explicit prompting and the authoring
guidance/headless verification work is active. A gated convenience verb is intentionally undecided.

# Acceptance criteria

- A fresh agent discovers the authoring contract from installed bundle-native guidance.
- It creates one registered View without reading product source.
- Automated verification catches contract and rendering failures before the user opens it.

# Evidence

Multiple custom Views have been generated and promoted during founder dogfood.

# Remaining gaps

Finish unified authoring guidance and fresh-agent cross-bundle proof before adding more authoring
mechanics.

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage specified by](../designs/unified-portable-view-model.md)

[journey stage implemented by](../tasks/mcp-view-authoring-guidance.md)

[journey stage implemented by](../tasks/ui-view-headless-verify.md)
