---
type: Task
title: 'Kinds: machine-readable field descriptions in discovery and creation help'
status: todo
priority: '1'
description: >-
  Make shared Kinds self-teaching by carrying field meaning through the one
  registry into kinds, per-Kind creation help, recipes, and Pages.
actor: openai/codex
timestamp: '2026-07-11T02:59:45.687Z'
---
# Objective

Make bundle-declared Kinds self-teaching by adding machine-readable descriptions for their declared fields. A receiving agent should be able to install an unfamiliar recipe, inspect the Kind through the normal CLI, and understand what each field means at the moment it creates an instance.

# Why P1

This is small foundational work with leverage across every major product loop: recipe portability, agent correctness, generated Pages, and future community sharing. Today a convention can say that `reason` is required or `priority` is optional, but the field's domain meaning remains distributed across prose, skills, and tribal knowledge. That lets a recipe transfer its shape without reliably transferring its operating model.

Descriptions should become part of the one Kind authority before recipe plugins proliferate, rather than being retrofitted across many independently authored recipes later.

# Convention contract

Add one optional map to the existing `fields` block:

```yaml
fields:
  required: [title, status]
  optional: [assignee]
  values:
    status: [todo, in_progress, done]
  descriptions:
    title: A concise statement of the work to complete.
    status: The lifecycle state, not a prose activity update.
    assignee: The person or agent responsible for moving the task.
```

- Extend the existing `KindFields`/`KindConvention` representation; do not add another parser or registry.
- `parseConventionDoc` accepts `fields.descriptions` as an optional map and defaults absent descriptions to `{}`.
- Description values must be non-empty strings. Malformed values warn and are skipped, never thrown or silently stringified.
- A description naming a field absent from both `fields.required` and `fields.optional` produces a collected coherence warning.
- `kindConventionDoc` serializes descriptions so built-in and external recipes round-trip through the same path.
- Descriptions are guidance only: they do not alter instance validity or field values.

# CLI wiring

- `kinds` includes the descriptions map when non-empty.
- `new "<Kind>" --help` renders each description beside its required/optional field and keeps enum values visible at the same point of use.
- Ordinary `new`, `list`, `doc read`, and mutation receipts remain unchanged.
- Update the `kinds --help` convention reference and the generated skill/reference prose from their existing authorities.
- The existing UI kinds endpoint serializes the enriched `KindConvention`; verify descriptions cross it without adding a new endpoint or browser-side registry.

# Proof and acceptance evidence

- Core parser tests cover absent, valid, non-map, empty, non-string, reserved, and undeclared-field description cases.
- Serializer/parser round-trip preserves valid descriptions.
- `kinds` output and `new "<Kind>" --help` are pinned with focused CLI tests.
- At least one real recipe convention carries useful descriptions, proving both built-in/external recipe paths rather than only a synthetic fixture.
- A conventions-free bundle and a convention without descriptions behave exactly as before.
- The recipe-plugin founder handoff demonstrates that the receiving agent can understand and correctly populate an unfamiliar Kind from CLI discovery alone.
- Full repository gates pass from a clean root build.

# Non-goals

- Scalar field types or coercion.
- Frontmatter reference fields.
- Examples, defaults, computed fields, or arbitrary validation expressions.
- Changing required/optional/enum validation semantics.
- A second YAML/schema system.
- A `kind field describe` mutation verb in this first unit; recipes and the existing convention pull/edit/promote path are sufficient for authoring the metadata.
