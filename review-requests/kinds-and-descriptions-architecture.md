---
type: Review Request
title: 'Architecture review: Kinds, relationships, and self-describing domain models'
status: requested
reviewer: Brian Derfer
requested_by: Michael Collier
question: >-
  Does the implemented Kind architecture and shipped Kind/field-description path
  form a coherent domain-model foundation, and are relationship and enum
  descriptions the right next extensions?
actor: codex
timestamp: '2026-07-13T02:53:17.186Z'
---
# Context

AgentState now has an implemented architectural slice to review, not merely a proposal. Bundle-owned
Kind conventions define relatively stable domain vocabulary; documents, values, links, and blobs are
changing state; the generic CLI is the deterministic action boundary; and Pages are contextual,
read-only projections.

PR #42 shipped the first self-description layer through that existing path: the standard Convention
`description` communicates what a Kind represents, `fields.descriptions` communicates field meaning,
the one parser and `KindConvention` registry carry both, and ordinary CLI discovery and creation help
surface them. No second schema, parser, registry, endpoint, or domain-specific command was introduced.

This review asks whether that implemented slice validates the larger architecture and whether the
remaining roadmap extends it coherently. The linked explainer packages what exists, why the boundaries
matter, how semantic metadata flows to consumers, and what is deliberately still only planned or
hypothesized.

# Requested decision

Please judge each of the following explicitly:

1. Does the implemented architecture correctly treat Kind conventions and declared relationship
   vocabulary as the relatively stable domain model, while documents, field values, links, and blobs
   remain changing bundle state?
2. Is the authority path coherent: Convention Markdown → one parser → one `KindConvention` registry →
   generic CLI and UI discovery → agents and Pages?
3. Does the shipped Kind/field-description work demonstrate that semantic guidance can extend the
   model without creating a parallel schema, executable prose, or domain-specific command surface?
4. Are relationship descriptions the right next P1 extension and enum-value descriptions the right
   later P2 extension? Should section descriptions/examples remain evidence-gated?
5. Are Pages correctly bounded as projections and skills/plugins as procedural delivery, rather than
   competing semantic authorities?
6. Does this package explain the architecture honestly and usefully enough for another architect or
   team to evaluate it? What important boundary, failure mode, or conceptual layer is missing?

# Acceptance criteria

A complete review:

- records `approved` or `changes_requested` with a concise `decision_summary`;
- answers all six judgments, including conditions or counterexamples;
- identifies any incorrect Current, Next, Later, or Hypothesis label in the explainer;
- distinguishes a blocking architectural objection from an optional future enhancement;
- comments on whether the two diagrams communicate the authority and stable/volatile boundaries; and
- preserves this Context, Requested decision, and Acceptance criteria when filling the Reviewer response.

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
