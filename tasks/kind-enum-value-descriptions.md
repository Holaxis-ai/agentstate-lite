---
type: Task
title: 'Kinds: machine-readable enum-value descriptions'
status: in_progress
priority: '2'
description: >-
  Implement optional enum-value descriptions through the existing Kind
  authority. Add fields.value_descriptions keyed by a declared fields.values
  field and one of its allowed values; malformed/undeclared entries warn and
  skip. Carry through the one parser, KindConvention registry,
  serializer/recipes, kinds output, per-Kind creation help, and existing UI
  transport. Prove real value on the Claim status lifecycle
  (active/challenged/locked/deprecated); do not populate obvious enums for
  completeness. No transitions, guards, side effects, aliases, migrations,
  localization, schema-authoring CLI, or workflow behavior. Ordinary code tier:
  builder + exact-SHA independent review + full repository gate; dedicated QA
  only if review escalates.
actor: codex
assignee: codex
timestamp: '2026-07-13T03:23:01.051Z'
---
# Objective

Explain the domain meaning of allowed enum values so agents select lifecycle, confidence, approval, and evidence states by semantics rather than label similarity.

# Contract

Add an optional nested map under `fields`:

```yaml
fields:
  values:
    status: [active, challenged, locked, deprecated]
  value_descriptions:
    status:
      active: Supported, but still open to revision.
      challenged: Contrary evidence or reasoning requires resolution.
      locked: Verified at the required standard for downstream reliance.
      deprecated: Retained for history but not for new reliance.
```

- Field keys must exist in `fields.values`.
- Value keys must be allowed values for that field.
- Values must be non-empty strings.
- Malformed or undeclared entries produce collected warnings and are skipped.
- Round-trip through the existing `KindConvention` serializer and recipe paths.
- Descriptions do not add transition rules or alter enum validation.

# Operational surfaces

- `kinds` includes non-empty value descriptions.
- `new "<Kind>" --help` renders each description with its allowed value.
- UI Kind discovery transports the same map.
- Prove the feature on a real lifecycle whose labels alone are insufficient.

# Acceptance evidence

- Parser, warning, and round-trip coverage.
- CLI help output pinned for described and undescribed enum values.
- Conventions without value descriptions behave as before.
- An unfamiliar agent chooses the correct state in a recipe dogfood scenario without prose outside the convention.
- Full repository gates pass.

# Non-goals

- State-transition graphs, guards, side effects, or workflow automation.
- Value aliases, deprecation migrations, or localization.

[design](../designs/self-describing-kinds.md)

[depends on](kind-field-descriptions.md)
