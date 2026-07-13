---
type: Task
title: 'Kinds: machine-readable relationship descriptions'
status: in_progress
priority: '1'
description: >-
  Implement machine-readable relationship descriptions through the existing Kind
  authority. Add optional link_descriptions keyed by declared links; preserve
  links storage and validation. Carry descriptions through the one parser,
  KindConvention registry, serializer/recipes, kinds output, per-Kind creation
  help, reverse-derived inbound help, and existing UI transport. Prove a real
  ambiguous relationship such as contains. No cardinality, required-link,
  workflow, Page mutation, or second-schema behavior. Ordinary code tier:
  builder + exact-SHA independent review + full repository gate; dedicated
  adversarial QA only if review finds or escalates a consequential boundary.
actor: codex
assignee: codex
timestamp: '2026-07-13T02:57:17.932Z'
---
# Objective

Make the relationship vocabulary of each Kind self-describing. A declared edge must communicate not only its target Kind, but the assertion made by the edge and why its direction matters.

# Contract

Add an optional map alongside the existing `links` map:

```yaml
links:
  contains: Task
link_descriptions:
  contains: Work whose delivery is governed by this roadmap commitment.
```

- Keep `links` unchanged as relationship name to target Kind.
- `link_descriptions` keys must name relationships declared in `links`; unknown keys warn and are skipped.
- Values must be non-empty strings; malformed values warn and are skipped.
- `expects_inbound` does not become a second semantic authority. Inbound help derives the relationship description from the source Kind through the registry's existing reverse lookup.
- Round-trip through `kindConventionDoc` and the same built-in/external recipe parser.
- No change to Markdown link storage, target resolution, graph validation, or cardinality.

# Operational surfaces

- `kinds` includes relationship descriptions.
- Per-Kind `new --help` shows descriptions for outbound and derived inbound relationships.
- Point-of-use creation/link hints consume the same metadata when this remains concise.
- The existing UI Kinds endpoint carries the metadata to Page generators.
- At least one real relationship with ambiguous semantics, such as `contains`, proves the feature.

# Acceptance evidence

- Parser and serializer tests cover absent, valid, malformed, and undeclared relationship descriptions.
- Reverse lookup returns the source declaration's description without copying it onto the target convention.
- CLI tests pin outbound and inbound help.
- Existing conventions and undeclared ordinary Markdown links behave as before.
- A generated Page or recipe-transfer exercise interprets a cross-Kind relationship correctly from discovery.
- Full repository gates pass.

# Non-goals

- Required links, cardinality, uniqueness, ownership enforcement, or new relationship storage.
- Descriptions for arbitrary undeclared link text.
- Cookbooks or cross-recipe dependency resolution.

[design](../designs/self-describing-kinds.md)

[depends on](kind-field-descriptions.md)
