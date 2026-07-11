---
type: Task
title: Evaluate Kind section descriptions and examples after dogfood
status: todo
priority: '3'
description: >-
  Evidence-gated evaluation of section descriptions and examples after the core
  semantic metadata is exercised in recipe transfer and generative Pages.
actor: openai/codex
timestamp: '2026-07-11T22:53:06.067Z'
---
# Objective

Evaluate whether section descriptions and field/section examples solve semantic failures that remain after Kind, field, relationship, and enum descriptions are dogfooded. This is evidence-gated discovery, not authorization to add every plausible metadata key.

# Wake condition

Run the founder-to-founder recipe transfer and at least one generative Page/domain-model exercise using the first three semantic-description units. Record concrete cases where an unfamiliar agent still:

- puts the wrong information in a declared body section,
- supplies structurally valid but semantically poor field values despite descriptions,
- cannot distinguish neighboring concepts without examples,
- or generates a Page that misuses body structure.

If no recurring failure remains, close this task without implementation.

# Candidate minimal shapes

Possible additions include `section_descriptions`, `fields.examples`, and section examples. The design pass must select only the smallest shape supported by evidence and must address example staleness explicitly.

# Acceptance for a build decision

- At least two concrete failures or one high-cost repeated failure are recorded.
- The failure cannot be addressed by improving an existing Kind, field, relationship, or enum description.
- Examples remain guidance, not validation or executable prompts.
- Parser and registry stay singular and conventions without the metadata remain unchanged.
- A real recipe proves the chosen shape.

# Non-goals

- Implementing metadata before the wake condition.
- Embedded few-shot prompts, UI layouts, defaults, or arbitrary validation expressions.

[design](../designs/self-describing-kinds.md)

[depends on](kind-enum-value-descriptions.md)

[depends on](kind-relationship-descriptions.md)
