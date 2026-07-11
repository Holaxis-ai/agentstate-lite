---
type: Design
title: 'Self-describing Kinds: a semantic contract for agent-managed domains'
actor: openai/codex
timestamp: '2026-07-11T22:53:04.980Z'
---
# Self-describing Kinds: a semantic contract for agent-managed domains

**Status:** Plan of record for semantic description metadata on Kind conventions. This design extends the existing one-registry Kind architecture; it does not introduce a second schema system, ontology engine, or executable rule language.

## Decision

AgentState Kinds are the relatively stable domain model governing rapidly changing bundle state. A Kind convention must therefore be able to communicate not only what structures are valid, but what those structures mean.

Add optional, machine-readable descriptions for the model's main semantic layers:

1. the Kind itself,
2. its fields,
3. its declared relationships,
4. its enumerated values,
5. later, only when dogfooding proves the need, its body sections and examples.

All metadata flows through `parseConventionDoc`, `KindConvention`, and the existing Kind registry. It is guidance, not new validation behavior. Conventions without descriptions and bundles without conventions behave as before.

## Product thesis

The stable/volatile separation is:

```text
Kind conventions and relationship vocabulary
        relatively stable domain model
                       |
                       v
Generic deterministic CLI operations
                       |
                       v
Documents, values, links, and artifacts
           continuously changing state
                       |
                       v
Pages and agent responses
              live projections
```

Validation tells an agent what it may write. Descriptions tell it what the write means.

Without descriptions, an unfamiliar agent can learn that `status` is required and accepts `active`, `challenged`, or `locked`, but it cannot know whether status describes publication, confidence, workflow progress, or epistemic standing. It can learn that `contains` targets `Task`, but not whether that edge means ownership, grouping, decomposition, or display membership. The result can be structurally valid and semantically wrong.

Self-description moves that meaning out of founder memory, duplicated skill prose, and model inference into the same durable authority that defines the structure.

## Goals

- Let an unfamiliar agent discover what a Kind represents and when to create an instance.
- Let it understand each field at the point it supplies a value.
- Let it understand what a declared relationship asserts, including its direction.
- Let it choose enum values by domain meaning rather than label similarity.
- Give Pages, recipe plugins, skills, and future domain-onboarding agents one semantic source.
- Preserve graceful degradation: every convention remains ordinary OKF Markdown.
- Keep descriptions optional and non-executable.
- Preserve one parser, one registry, and one serialization path.

## Non-goals

- A general ontology language.
- Scalar type coercion, cardinality, uniqueness, or cross-document transactions.
- Computed fields, defaults, triggers, arbitrary validation expressions, or embedded prompts.
- UI layout declarations.
- Automatic recipe upgrades or migrations.
- Requiring descriptions before a Kind is valid.
- Treating prose as an executable invariant.

## Semantic layers and proposed contract

### 1. Kind description

Reuse the Convention document's standard top-level `description` frontmatter field. Do not add `kind_description` or place another description inside a nested schema.

```yaml
type: Convention
title: Claim
governs: Claim
description: >-
  A falsifiable assertion whose reliability matters to downstream work. Create
  one when a statement may be cited, challenged, or independently verified;
  do not use it for ordinary notes or opinions.
```

A good Kind description answers two questions:

- What does an instance represent?
- When should an agent create this Kind rather than a neighboring Kind?

The convention body may continue to carry longer teaching prose. The machine-readable description is the compact discovery surface consumed by the registry.

### 2. Field descriptions

Add an optional `fields.descriptions` map keyed by fields declared in `fields.required` or `fields.optional`.

```yaml
fields:
  required: [title, status]
  optional: [assignee]
  values:
    status: [todo, in_progress, done]
  descriptions:
    title: A concise statement of the outcome to complete.
    status: The task lifecycle state, not a prose activity update.
    assignee: The person or agent responsible for moving the task.
```

Descriptions do not alter field validity or values.

### 3. Relationship descriptions

Add an optional top-level `link_descriptions` map keyed by relationship names already declared in `links`.

```yaml
links:
  contains: Task
link_descriptions:
  contains: Work whose delivery is governed by this roadmap commitment.
```

Keep `links` itself as the current relationship-to-target-Kind map. Do not replace its string values with richer objects, because that would complicate the established parser and every existing convention.

The description belongs to the outbound declaration: the source Kind defines what its outgoing edge asserts. Reverse/inbound help derives it from that same source declaration. `expects_inbound` remains a lint expectation and does not become a second description authority.

### 4. Enum-value descriptions

Add an optional `fields.value_descriptions` nested map keyed first by an enum field and then by a value already declared in `fields.values`.

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

This is especially valuable for lifecycle, confidence, approval, evidence-quality, and publication enums. It does not add transition rules.

### 5. Section descriptions and examples

The likely shapes are optional `section_descriptions` and field/section example maps, but they are deliberately not ratified in this design's first implementation sequence.

Descriptions define meaning; examples demonstrate application. Examples also create a stronger sedimentation and maintenance risk: an outdated example can become more persuasive than the declared contract. Implement these only after real agents misuse body sections or fields despite Kind, field, relationship, and enum descriptions.

## Parser and coherence behavior

Each implemented description layer follows the existing permissive convention contract:

- Absent metadata defaults to an empty value and produces no warning.
- Description values must be non-empty strings.
- Malformed maps or values are skipped with collected warnings, never thrown or silently stringified.
- A description naming an undeclared field, relationship, enum field, or enum value produces a coherence warning.
- Duplicate `governs` behavior remains unchanged.
- `kindConventionDoc` round-trips all supported metadata through the same representation used by built-in and external recipes.
- Description metadata does not make ordinary document instances invalid.

Warnings should name the convention id and exact semantic key so recipe authors can repair the source.

## Consumption and operational moments

A structure without a moment of use does not improve agent behavior. Description metadata must appear where an agent makes decisions:

### Discovery

`kinds` includes the Kind description and non-empty semantic maps. This is the complete machine-readable registry view for agents and Pages.

### Creation

`new "<Kind>" --help` displays:

- the Kind description before flags,
- field descriptions beside required and optional fields,
- enum value descriptions beside their allowed values,
- outbound and derived inbound relationship descriptions in the Links block.

This is the most important fire moment: meaning appears when the agent chooses the Kind, values, and relationships.

### Creation receipts

Receipts should stay compact. Existing link follow-up hints may include relationship descriptions only when doing so remains scannable; do not turn every successful mutation into a schema dump.

### UI and Pages

The existing UI Kinds endpoint serializes `KindConvention`. New metadata should cross that boundary without a second endpoint or browser-side registry. Generative Page agents can inspect it to choose fields, grouping, labels, and graph semantics.

### Recipes and skills

Recipes carry the descriptions in their convention docs. Skills may teach procedures and judgment, but should link to or query the Kind authority rather than duplicate field and relationship definitions. The founder-to-founder recipe transfer is the first empirical test that the receiving agent can inherit meaning without oral explanation.

### Domain-model onboarding

A future orientation agent may propose Kinds and relationships from user documents or interviews. The proposed model is not ready for human confirmation until it includes descriptions: names alone are insufficient for a user to verify that agent and human mean the same thing.

## Authority and drift

The Convention document is the authority for structural and compact semantic metadata. Longer workflow instructions remain in skills or recipe prose. Pages are consumers, never authorities.

After a recipe is applied, the bundle owns its adopted convention. A plugin update must not silently mutate descriptions any more than it may silently mutate required fields or relationships. Recipe upgrade semantics remain a separate future design.

Generated skill/reference prose continues to derive from its current code authorities. Adding a description to a convention should not require manually editing multiple consumer explanations.

## Implementation sequence

### Unit A — Kind and field descriptions (P1)

Reuse the Convention's `description`; add `fields.descriptions`; wire parser, serializer, `kinds`, per-Kind help, UI transport, real recipe content, and focused tests. This is one coherent foundation because both surfaces answer the first creation decision: which Kind and what fields?

### Unit B — Relationship descriptions (P1 follow-up)

Add `link_descriptions`, reverse-lookup consumption, point-of-use link help, UI transport, recipe content, and warnings. Do not change link storage, cardinality, or validation semantics.

### Unit C — Enum-value descriptions (P2)

Add `fields.value_descriptions` and render them with allowed values. Prove a lifecycle enum where labels alone are ambiguous.

### Unit D — Section descriptions/examples evaluation (P3, evidence-gated)

Dogfood the first three units through recipe transfer and Page generation. Record concrete misuse that remains. Ratify and implement only the smallest metadata shape that addresses observed failure.

## Acceptance across the program

- A conventions-free external bundle behaves as before.
- Existing conventions without descriptions parse and serialize without new failures.
- An unfamiliar agent can explain a Kind, populate its fields, select lifecycle values, and create declared relationships using CLI discovery alone.
- A Page generator can use the same registry metadata without another schema or prompt copy.
- Malformed external conventions degrade with precise warnings.
- Built-in and external recipe paths exercise the same parser and serializer.
- No implementation unit introduces executable semantics under a description key.
- Full repository gates and generated-reference gates appropriate to each change pass from the root.

## Stopping rule

Stop when an unfamiliar agent can correctly choose Kinds, fields, relationships, and enum values from the one discovery surface. Do not add metadata merely because another schema language supports it. A new description layer must answer an observed semantic failure at an operational moment.

## Related records

- [Roadmap item](../roadmap-items/self-describing-domain-models.md)
- [Kind and field descriptions](../tasks/kind-field-descriptions.md)
- [Relationship descriptions](../tasks/kind-relationship-descriptions.md)
- [Enum-value descriptions](../tasks/kind-enum-value-descriptions.md)
- [Section descriptions and examples evaluation](../tasks/kind-section-descriptions-examples.md)
- [Portable cognitive ecosystem](portable-cognitive-ecosystems.md)
- [Recipe-plugin transfer proof](../tasks/prove-recipe-plugin-sharing.md)
