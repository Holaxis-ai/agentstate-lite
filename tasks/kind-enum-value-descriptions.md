---
type: Task
title: 'Kinds: machine-readable enum-value descriptions'
status: in_progress
priority: '2'
description: >-
  PR #52 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/52


  Behavioral result: Kinds may optionally explain allowed enum values through
  fields.value_descriptions. The one parser, KindConvention registry,
  serializer/recipe path, kinds output, creation help, and existing UI Kinds
  transport carry the metadata. Undescribed enums retain compact help; described
  enums render structured value/description rows. A test-only Claim lifecycle
  proves active/challenged/locked/deprecated through ordinary recipe
  application. Enum validation and all workflow behavior remain unchanged; no
  schema-authoring CLI or plugin-reference content is included.


  Reviewed head: 6e4c7bf07b6f918aae4cae48c585d71782ad98b8

  Base: c92497ae9d9761752a34f9dad9966666f73b5d93


  Independent review rejected the first candidate because inherited prototype
  field names could crash help and raw multiline/pipe-bearing descriptions were
  ambiguous inline. The amendment own-checks adjacent maps and uses structured
  JSON-quoted rows with help-only whitespace normalization. Reviewer approved
  exact SHA after special-key, partial-description, punctuation,
  stored-metadata, serialization, UI, and recipe probes; dedicated QA was not
  warranted under the ordinary-code risk tier.


  Evidence: core 44/44, focused CLI 98/98, UI bridge 34/34, build/typecheck
  green, built smoke including view 4 nodes/7 edges, full unpiped npm run check
  exit 0 with two unrelated configured Playwright retries, diff check clean, no
  bot artifacts. Status remains in progress until merge.
actor: codex
assignee: codex
timestamp: '2026-07-13T03:52:45.981Z'
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
