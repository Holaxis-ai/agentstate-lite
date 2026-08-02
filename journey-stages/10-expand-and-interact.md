---
type: Journey Stage
title: Expand and interact with the same View
journey: journeys/new-user-to-recurring-value
order: 09
lane: shared
readiness: rough
criticality: core
description: Stage 09 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:53.593Z'
---
# Desired experience

The user expands the same View into a spacious full-page MCP App, navigates its data, and performs
explicitly authorized actions without switching to a different artifact or security model.

# Current experience

Expansion, responsive sizing, live bridge reads, and human-confirmed actions exist, but host
suspension and initial-height behavior have exposed integration roughness.

# Acceptance criteria

- Inline and expanded modes use the same View identity and source.
- Expansion immediately requests a useful intrinsic height and survives ordinary host lifecycle.
- Mutations require declared capability, current versions, and explicit human authority.

# Evidence

Expanded MCP App Views and action-authority proofs have run in founder dogfood.

# Remaining gaps

Close host lifecycle defects and validate an ordinary interactive workflow rather than acceptance
fixtures alone.

[journey stage planned by](../roadmap-items/conversational-mcp-views.md)

[journey stage planned by](../roadmap-items/safe-human-interactive-pages.md)

[journey stage specified by](../designs/unified-portable-view-model.md)

[journey stage implemented by](../tasks/mcp-app-hidden-authorized-first-mount.md)
