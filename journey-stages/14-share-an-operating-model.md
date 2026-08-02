---
type: Journey Stage
title: Share an operating model without data
journey: journeys/new-user-to-recurring-value
order: '13'
lane: shared
readiness: rough
criticality: supporting
description: Stage 13 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:54.557Z'
---
# Desired experience

A user can export a useful operating model without data, publish it in a simple recipe repository,
and another user can discover and install it by name.

# Current experience

The architecture and first recipe candidates exist, but packaging, manifests, discovery, and
founder-to-founder installation proof are incomplete.

# Acceptance criteria

- Export produces deterministic conventions, guidance, and Views with no user records.
- The package can live outside the core npm distribution.
- Another user installs and successfully uses it without a live explanation.

# Evidence

Founder discussion has identified a public recipe repository and a concrete existing recipe as the
lowest-lift sharing trial.

# Remaining gaps

Run the actual sharing proof before expanding the recipe ecosystem or registry design.

[journey stage planned by](../roadmap-items/recipe-plugins.md)

[journey stage specified by](../designs/portable-recipe-packages.md)

[journey stage implemented by](../tasks/recipe-export.md)

[journey stage implemented by](../tasks/prove-recipe-plugin-sharing.md)
