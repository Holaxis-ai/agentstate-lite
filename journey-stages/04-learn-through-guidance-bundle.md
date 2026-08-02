---
type: Journey Stage
title: Learn AgentState through its guidance bundle
journey: journeys/new-user-to-recurring-value
order: '03'
lane: shared
readiness: missing
criticality: core
description: Stage 03 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:52.154Z'
---
# Desired experience

The first bundle the user encounters teaches AgentState by being an AgentState bundle: it explains
the mental model, exposes a useful orientation View, and invites a safe first action.

# Current experience

Product knowledge is split across CLI help, skills, repository guidance, and the live development
bundle. A dedicated newcomer guidance bundle has been proposed but is not yet the default journey.

# Acceptance criteria

- Installation makes the guidance bundle discoverable without polluting the user's project.
- Its home View demonstrates kinds, relationships, live data, and portable Views.
- The user can move from learning to creating their own bundle without founder explanation.

# Evidence

Founder discussion identified the guidance bundle as the best way to teach the product through its
own primitives.

# Remaining gaps

Package the guidance content, decide its install/open path, and validate the transition to a user's
first real workspace.

[journey stage planned by](../roadmap-items/distribution-neutral-resources.md)

[journey stage planned by](../roadmap-items/launcher-home-surface.md)
