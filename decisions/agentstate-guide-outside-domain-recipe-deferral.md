---
type: Decision
title: agentstate-guide is outside the domain-Recipe deferral
actor: codex-onboarding-scope
timestamp: '2026-08-03T23:52:58.561Z'
---
# Decision

`agentstate-guide` is **outside** the built-in domain-Recipe deferral.

The deferral in [decisions/defer-builtin-recipes](defer-builtin-recipes.md) applies to Recipes that encode a proposed user operating model before real workflow evidence exists. It does not apply to a guide whose intent is to explain AgentState Lite's own already-shipped functionality.

# Rationale

The two classes have different intent and different evidence requirements:

- Personal Task System, Product Manager, and similar Recipes make claims about how users should organize their work. Those claims must be learned from real workflows before being frozen into a built-in.
- `agentstate-guide` explains product concepts and commands AgentState Lite already owns: bundles, documents, links, Kinds, Recipes, Views, status, attribution, local-first visibility, and optional sync.

Treating both classes identically would leave a known onboarding gap open while waiting for research that answers a different question.

# Conditions

This decision permits the guide to pursue built-in status; it does not waive its acceptance gates:

- prototype the curriculum and read-only View first;
- validate the ordered curriculum with at least one fresh user/agent;
- ship the generic create-only init safety predecessor;
- prove stateless README/no-bundle-home/Agent-Skill discovery;
- prove build-time asset embedding and installed-tarball/offline behavior; and
- pass the required independent review, adversarial QA for target safety, and repository/package gates.

# Boundaries

- The guide remains data-free product education, not a domain operating model.
- Curriculum order is a revisable hypothesis, not a frozen claim about user workflows.
- This decision does **not** unblock [the Personal Task System Recipe](../tasks/recipe-personal-task-system.md), [the Product Manager Recipe](../tasks/persona-recipe-product-manager.md), or any other deferred domain Recipe.
- It does not authorize P5A, release automation, update, marketplace, deployment, MCP-install, View-create-action, notice/identity, or acknowledgement work.

# Consequence

The [onboarding plan](../plans/onboarding-surfaces.md), [guide task](../tasks/guidance-bundle-onboarding.md), [create-only safety task](../tasks/init-target-safety-guard.md), and formerly Mike-gated Journey/task record clarifications may proceed under Brian's decision authority while Michael is unavailable.

# Provenance

Decided by Brian Derfer in conversation on 2026-08-03: the deferral should not cover the guide because “It's a different intent entirely.”
