---
type: Task
title: 'Kinds: machine-readable Kind and field descriptions'
status: in_progress
priority: '1'
description: >-
  Make shared Kinds self-teaching by carrying concept and field meaning through
  the one registry into discovery, creation help, recipes, and Pages.
  Implementation: https://github.com/Holaxis-ai/agentstate-lite/pull/42
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-12T12:12:09.403Z'
---
# Objective

Make bundle-declared Kinds self-teaching at the first decision point: which Kind should exist, and what do its fields mean? Reuse the Convention document's standard `description` as the machine-readable Kind description and add field descriptions through the existing registry.

An unfamiliar agent should be able to inspect a Kind through the normal CLI, understand when to create it, and correctly populate its fields without founder explanation or duplicated skill prose.

# Why P1

This is small foundational work with leverage across recipe portability, agent correctness, generated Pages, domain-model onboarding, and community sharing. Today a convention can say that `reason` is required or `priority` is optional, but not what the Kind represents or what those fields mean. A recipe can therefore transfer its shape without reliably transferring its domain semantics.

# Convention contract

Reuse the existing top-level description field:

```yaml
type: Convention
governs: Task
description: >-
  A discrete unit of work with a verifiable outcome. Create one when progress
  and ownership should be tracked independently.
```

Add one optional map to the existing `fields` block:

```yaml
fields:
  required: [title, status]
  optional: [assignee]
  values:
    status: [todo, in_progress, done]
  descriptions:
    title: A concise statement of the outcome to complete.
    status: The lifecycle state, not a prose activity update.
    assignee: The person or agent responsible for moving the task.
```

- Extend the existing `KindFields`/`KindConvention`; do not add another parser or registry.
- `parseConventionDoc` carries the Convention's non-empty `description` onto `KindConvention` and defaults absence cleanly.
- It accepts `fields.descriptions` as an optional map and defaults absence to `{}`.
- Description values must be non-empty strings. Malformed values warn and are skipped, never thrown or silently stringified.
- A field description naming a field absent from required and optional produces a coherence warning.
- `kindConventionDoc` round-trips both Kind and field descriptions.
- Descriptions are guidance only and do not alter instance validity.

# CLI and UI wiring

- `kinds` includes the Kind description and field descriptions when present.
- `new "<Kind>" --help` shows the Kind description before the field list and each field description beside its required/optional flag and enum values.
- Ordinary creation, list, read, and mutation receipts remain compact and unchanged unless existing help rendering derives the metadata.
- Update the convention reference and generated skill/reference prose from existing authorities.
- Verify the existing UI Kinds endpoint transports the enriched `KindConvention` without another endpoint or browser-side registry.

# Proof and acceptance evidence

- Parser tests cover absent, valid, empty, non-string, and malformed Kind descriptions.
- Field tests cover absent, valid, non-map, empty, non-string, reserved, and undeclared-field cases.
- Serializer/parser round-trip preserves valid metadata.
- `kinds` and `new "<Kind>" --help` outputs are pinned.
- At least one real recipe carries useful Kind and field descriptions.
- A conventions-free bundle and conventions without descriptions behave as before.
- The founder recipe-plugin handoff demonstrates that the receiver can choose and populate an unfamiliar Kind from discovery alone.
- Full repository gates pass from a clean root build.

# Non-goals

- Relationship or enum-value descriptions; those are separate reviewed units.
- Scalar types, coercion, defaults, examples, computed fields, or arbitrary expressions.
- Changing required/optional/enum validation semantics.
- A second YAML/schema system.
- A first-unit mutation verb for authoring descriptions; recipes and the existing convention editing path are sufficient.

[design](../designs/self-describing-kinds.md)
