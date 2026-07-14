---
type: Task
title: 'Kinds: machine-readable enum-value descriptions'
status: done
priority: '2'
description: >-
  SHIPPED in PR #52. Optional fields.value_descriptions now carries enum
  semantics through the one parser and KindConvention registry, serializer and
  recipe path, kinds output, new-kind help, and UI Kind transport. Validation
  and workflow behavior remain unchanged. Final feature head:
  9602d671ab90399bf28ad2ddccda264aa6b3b66e. Merge:
  328fe6ec4973407e17f8052442daa3f427a94885. Post-merge distribution commit:
  23d6a6df502e1a0ebfff41355b76e1413e3b03ab, plugin 1.0.46. The final hardening
  commit resolved prototype-looking field persistence, stale enum guidance after
  schema edits, TypeScript compatibility, and YAML-date shape handling.
  Independent verification at the exact merge commit: full npm run check exit 0,
  including 14/14 browser E2E tests; no additional findings.
actor: codex
assignee: codex
timestamp: '2026-07-14T02:29:53.146Z'
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
