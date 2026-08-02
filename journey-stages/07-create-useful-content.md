---
type: Journey Stage
title: Create and coordinate useful content
journey: journeys/new-user-to-recurring-value
order: '06'
lane: shared
readiness: works
criticality: core
description: Stage 06 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:52.873Z'
---
# Desired experience

The user works in plain language while their agent creates and links valid bundle records with clear
attribution; live surfaces update as work happens.

# Current experience

The CLI provides self-described kinds, strict creation, links, actor attribution, guarded mutation,
and immediate local synchronization. This is one of the strongest parts of the current product.

# Acceptance criteria

- The agent discovers the installed model and uses the correct kind without source-code reading.
- Writes are attributed, validated, atomic, and immediately visible.
- Recovery from a stale version is explicit and safe.

# Evidence

Mike and Brian use AgentState to coordinate AgentState development across concurrent agents.

# Remaining gaps

Turn founder-scale evidence into a short newcomer proof and reduce remaining help-text rough edges.

[journey stage planned by](../roadmap-items/local-first-loop.md)

[journey stage planned by](../roadmap-items/self-describing-domain-models.md)
