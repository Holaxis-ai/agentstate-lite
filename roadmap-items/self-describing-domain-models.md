---
type: Roadmap Item
title: Self-describing domain models
status: active
description: >-
  Make Kinds communicate the meaning of concepts, fields, relationships, and
  lifecycle values through the one registry and at the point of agent action.
actor: openai/codex
timestamp: '2026-07-11T22:53:06.772Z'
---
# Vision

Make AgentState's stable domain model understandable to unfamiliar humans and agents. Kinds already define valid structure; this roadmap makes them explain the meaning of their concepts, fields, relationships, and lifecycle values through the one registry and at the point of use.

The goal is not more schema machinery. It is an executable shared language: the bundle declares stable semantics, the generic CLI applies them deterministically to changing state, and Pages and skills consume the same authority.

# Why this is foundational

- Recipe transfer otherwise carries shape without reliably carrying meaning.
- Generative Pages otherwise infer labels, grouping, and relationships from names or duplicated prompts.
- Domain-model onboarding cannot ask a human to confirm a proposed model using names alone.
- Validation can reject malformed values while still permitting semantically wrong choices.
- Descriptions keep meaning in the portable bundle rather than founder memory or one agent harness.

# Sequence

1. Kind and field descriptions — P1 foundation.
2. Relationship descriptions — P1 follow-up for the model's glue.
3. Enum-value descriptions — P2 lifecycle semantics.
4. Section descriptions and examples — P3 evaluation, implemented only after dogfooding demonstrates remaining misuse.

# Success condition

An agent unfamiliar with an installed recipe can use ordinary CLI discovery to explain each relevant Kind, create correct instances, choose lifecycle values, and wire declared relationships without oral guidance or a parallel schema. The same metadata reaches Pages through the existing Kind registry.

# Constraints

- One parser, one `KindConvention`, one registry.
- Optional, non-executable metadata with graceful degradation.
- No scalar type system, rules DSL, triggers, computed fields, or UI-layout schema.
- Recipe upgrades remain separate from plugin updates and from this roadmap.

[design](../designs/self-describing-kinds.md)

[contains](../tasks/kind-field-descriptions.md)

[contains](../tasks/kind-relationship-descriptions.md)

[contains](../tasks/kind-enum-value-descriptions.md)

[contains](../tasks/kind-section-descriptions-examples.md)
