---
type: Review Request
title: 'Review: Kinds, relationships, and self-describing domain models'
status: requested
reviewer: Brian Derfer
requested_by: Michael Collier
question: >-
  Does this architecture correctly treat Kinds and relationship vocabulary as
  the stable domain model, documents and links as changing state, the CLI as the
  deterministic boundary, and descriptions as the right next semantic extension?
actor: openai/codex
timestamp: '2026-07-12T02:19:26.416Z'
---
# Context

AgentState already lets a bundle define Kinds as ordinary Convention documents, create and validate
instances through one generic CLI, connect documents with typed relationship vocabulary, and render
live read-only Pages over the resulting state. The proposed self-describing Kinds work would add
optional machine-readable descriptions to that existing authority rather than introduce a second
schema or ontology system.

This review is meant to test whether the architecture is coherent and accurately described before
description metadata is implemented. The linked designs distinguish implemented behavior, planned
extensions, and longer-term hypotheses. The visual explainer is an orientation aid; the designs and
the durable Review Request remain the evidence and workflow authority.

# Requested decision

Please judge each of the following explicitly:

1. Does the model correctly treat Kind conventions and their relationship vocabulary as the
   relatively stable domain model, while documents, field values, links, and blobs are the changing
   state?
2. Is the generic CLI the right deterministic action boundary for discovering Kinds, creating and
   validating instances, querying state, and traversing relationships?
3. Are Pages correctly bounded as contextual, read-only projections rather than authorities or a
   second domain model?
4. Is the proposed description sequence right: Kind description, field descriptions, relationship
   descriptions, enum-value descriptions, then body-section descriptions/examples only if observed
   misuse justifies them?
5. Are important semantic layers missing, or are any planned layers too elaborate for the value
   they unlock?
6. Does the explainer accurately label every material claim as Current, Planned, or Hypothesis?

# Acceptance criteria

A complete review:

- records `approved` or `changes_requested` with a concise `decision_summary`;
- answers all six requested judgments, including conditions or counterexamples;
- identifies any incorrect Current/Planned/Hypothesis label;
- distinguishes a blocking architectural objection from an optional future enhancement; and
- preserves this Context, Requested decision, and Acceptance criteria when filling the Reviewer
  response.

# Reviewer response

Pending Brian Derfer's review.

[reviews design](../designs/self-describing-kinds.md)

[reviews design](../designs/portable-cognitive-ecosystems.md)

[reviews roadmap item](../roadmap-items/self-describing-domain-models.md)

[reviews task](../tasks/kind-field-descriptions.md)

[reviews task](../tasks/kind-relationship-descriptions.md)

[reviews task](../tasks/kind-enum-value-descriptions.md)

[reviews task](../tasks/kind-section-descriptions-examples.md)

[explained by](../pages-registry/architecture-kinds.md)
