---
type: Task
title: Model the OKF extension-evolution problem and research contract
status: done
priority: '1'
actor: codex-standards-po
timestamp: '2026-08-05T22:35:58.935Z'
---
# Objective

Create the shared taxonomy, problem statement, acceptance criteria, and research plan that all later standards-architecture agents will consume.

# Goals

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: establish a neutral domain model and independently executable research/design contract so the team can recommend an evolution-safe OKF extension policy without silently assuming namespacing, profiles, or a migration mechanism.

# Acceptance

The artifact is specific enough that independent standards and architecture agents can work without inventing incompatible terminology or scope.

# Outcome

Completed by `codex-standards-po`.

- [Domain model](../research/okf-extension-evolution-domain-model.md): terms, ownership layers, artifact identity tuples, version/lifecycle distinctions, actors, decision boundaries, fourteen preliminary collision classes, open questions, and final-recommendation acceptance criteria.
- [Architecture review plan](../plans/okf-extension-evolution-architecture.md): independent specialist contracts, dependencies and phase transitions, synthesis matrix/method, primary-source evidence standard, and exact-artifact adversarial review rubric.
- [Phase-boundary handoff](../context-notes/okf-extension-evolution-domain-model-result.md): compact result and next dependency.

The taxonomy deliberately preserves open decisions. It does not treat profiles, namespaces, registries, qualified names, or logical-to-wire mappings as selected answers.

# Verification

Both persisted bodies were read back and byte-compared with their authored bodies. `aslite status` reports zero malformed documents and no increase in unresolved links.

# Next

Run the standards research and architecture-options tasks independently from the shared model, freeze both first artifacts, cross-review them, then synthesize and adversarially review the exact recommendation.
