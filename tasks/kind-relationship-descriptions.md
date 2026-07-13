---
type: Task
title: 'Kinds: machine-readable relationship descriptions'
status: done
priority: '1'
description: >-
  Shipped in PR #51: https://github.com/Holaxis-ai/agentstate-lite/pull/51


  Merge commit: f7f84f67cf871952f6700eca0ecd6599aa2ed5f6

  Reviewed head: 0480399ed3ed7c2481c3dbb310434e8dee5e73f2


  Kinds may optionally explain source-owned declared relationships through
  link_descriptions. The one parser, KindConvention registry, serializer/recipe
  path, kinds output, creation help, reverse-derived inbound help, and existing
  UI Kinds transport carry the metadata. Roadmap contains -> Task is the real
  recipe proof. Link storage, validation, cardinality, workflow, receipts, and
  Page mutation remain unchanged.


  Independent review caught and closed inherited Object.prototype keys
  masquerading as declared relationships. Parser and serializer now share a
  prototype-safe own-property boundary, pinned by toString and __proto__
  regressions. Focused core 42/42, CLI 95/95, build/typecheck, full npm run
  check, Playwright 14/14 first attempt, and diff checks passed. Dedicated QA
  was not warranted under the ordinary-code risk tier.
actor: codex
assignee: codex
timestamp: '2026-07-13T03:17:16.686Z'
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
