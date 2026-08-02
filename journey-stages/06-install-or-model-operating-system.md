---
type: Journey Stage
title: Install or model an operating system
journey: journeys/new-user-to-recurring-value
order: '05'
lane: shared
readiness: rough
criticality: core
description: Stage 05 of the new-user-to-recurring-value journey.
actor: openai/codex
timestamp: '2026-08-02T15:25:52.639Z'
---
# Desired experience

The user can choose a named product recipe or let an agent model a small domain using described
kinds, fields, relationships, and Views—without inheriting somebody else's data.

# Current experience

Kinds and field descriptions are expressive and recipes are being separated from data, but recipe
discovery, install-by-name, export, and the first fully packaged operating model remain incomplete.

# Acceptance criteria

- Available recipes are discoverable before a bundle exists.
- Installing one copies conventions, guidance, and Views but no source data.
- The agent can explain and safely adapt the installed model.

# Evidence

The Personal Task System and persona-recipe work provide concrete design and dogfood inputs.

# Remaining gaps

Complete named discovery and one end-to-end data-free recipe installation proof.

[journey stage planned by](../roadmap-items/recipe-plugins.md)

[journey stage planned by](../roadmap-items/self-describing-domain-models.md)

[journey stage specified by](../designs/portable-recipe-packages.md)

[journey stage implemented by](../tasks/product-recipe-discovery.md)
