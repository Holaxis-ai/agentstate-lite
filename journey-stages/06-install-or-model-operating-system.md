---
type: Journey Stage
title: Install or model an operating system
journey: journeys/new-user-to-recurring-value
order: '05'
lane: shared
readiness: rough
criticality: core
description: Stage 05 of the new-user-to-recurring-value journey.
actor: codex-onboarding-scope
timestamp: '2026-08-03T23:56:06.903Z'
---
# Desired experience

The user can choose a named product Recipe or let an agent model a small domain using described Kinds, fields, relationships, and Views—without inheriting somebody else's data.

# Current experience

Bundle-free built-in Recipe discovery shipped in PR #201, and current convention-only built-ins install by name through the shared RecipeSource path. A folder Recipe proves References+Views can parse and apply. What remains unproven is a real, data-free **domain operating model** selected and used successfully by a newcomer. The product guide is educational infrastructure and does not satisfy or own that domain proof.

# Acceptance criteria

- Available Recipes are discoverable before a bundle exists.
- Installing a domain operating model copies conventions, guidance, and Views but no source data.
- The agent can explain and safely adapt the installed model.
- The model's shape comes from real custom-Recipe walkthrough evidence rather than a guessed workflow.

# Evidence

[Product Recipe discovery](../tasks/product-recipe-discovery.md) is done at PR #201 / merge `138a3c7`. The shared parser/apply path is exercised by existing portable folder Recipes. [Brian's guide decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md) explicitly keeps the guide distinct from domain operating models.

# Remaining gaps

Complete test-user custom-Recipe walkthroughs, identify convergence, and prove one resulting data-free domain Recipe end to end before changing this stage's `rough` readiness. The deferred Personal Task System and Product Manager records remain the relevant product lane.

[journey stage planned by](../roadmap-items/recipe-plugins.md)

[journey stage planned by](../roadmap-items/self-describing-domain-models.md)

[journey stage specified by](../designs/portable-recipe-packages.md)

[journey stage implemented by](../tasks/product-recipe-discovery.md)

[domain Recipe deferral](../decisions/defer-builtin-recipes.md)
