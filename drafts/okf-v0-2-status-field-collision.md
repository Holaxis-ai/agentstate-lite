---
type: Issue Draft
title: 'Upstream issue draft: forward compatibility for adopted extension keys'
description: >-
  Narrow draft asking how an OKF minor version should handle a key previously
  used as a producer extension, using status as the concrete case.
actor: openai/codex
timestamp: '2026-08-05T04:22:56.427Z'
---
# Proposed title

Clarify forward compatibility when a minor version adopts a producer extension key (`status`)

# Draft issue

## Summary

Could the specification clarify how producers and consumers should handle a frontmatter key that
began as a legal producer extension and was later given a core meaning by a minor OKF version?

`status` makes this concrete. An OKF v0.1 producer may already use `status` for type-specific
workflow state. OKF v0.2 gives the same optional key a document-lifecycle meaning with the values
`draft`, `stable`, and `deprecated`.

This does not appear to make the older producer document strictly nonconformant under v0.2's minimal
conformance rules. It does create semantic ambiguity: a v0.2 consumer recognizes the key but not its
producer-defined value, while the producer cannot adopt v0.2 honestly without deciding whether to
rename or alias established data.

## Specification tension

The ambiguity seems to sit between four useful parts of the specification:

- §4.1 permits producer-specific frontmatter extensions.
- §5.4 gives `status` its optional v0.2 document-lifecycle meaning.
- §11 deliberately keeps strict conformance minimal and treats most optional semantics softly.
- §12 describes a minor version as introducing backward-compatible additions.

Each rule is reasonable independently. Together, they do not say what happens when an additive
minor release assigns meaning to an unqualified key already used through the extension mechanism.

## Minimal example

Consider an existing v0.1 concept:

```yaml
---
type: Task
status: todo
---
```

Here `status` is defined by the producer's Task schema. It means execution state, not whether the
document is draft, stable, or deprecated. After the bundle declares v0.2, a generic consumer sees a
core-known field carrying an unrecognized core value. The bytes parse and the required `type` is
present, but the consumer lacks a rule for interpreting or reporting the field.

## Producer evidence

We encountered this while auditing AgentState Lite, an OKF-based producer with user-defined document
Kinds. In a reproducible snapshot on 2026-08-04 (AgentState commit
`8d0253a40bc00f9c7997e177a70b21f829769e8e`), one active v0.1 bundle contained 826 documents:

- 336 documents had a nonempty top-level `status` field.
- 331 used values outside the v0.2 lifecycle vocabulary.
- 5 happened to use `deprecated`.

The other values included Task states such as `todo`, `in_progress`, `blocked`, and `done`, plus
type-specific Roadmap, Review, and Claim states. This is migration evidence, not a claim that the
bundle is presently an invalid v0.2 producer: AgentState continues to declare and author v0.1 while
the v0.2 write contract is evaluated.

Renaming those fields would require a migration or alias policy across established schemas and
recipes. Leaving them unchanged under a v0.2 declaration would give generic consumers an ambiguous
field.

## Requested clarification

1. When a minor OKF version assigns core semantics to a previously unreserved key, is that key then
   globally claimed whenever it appears, or may a producer profile retain a different meaning?
2. How should a v0.2 consumer treat a core-known key with a value outside its conventional
   vocabulary: ignore the optional semantic, warn, or interpret it as a producer extension?
3. What migration pattern should an existing producer use when a previously legal extension key is
   adopted by core?

Issue #212 proposes an opt-in `okf_profile` declaration and may provide part of the eventual answer,
but a profile declaration alone does not specify how an already-colliding core key should behave.
Issue #239 separately asks how consumers should understand minor-version compatibility when v0.2
retires earlier conventions. This question appears to sit at the intersection of those discussions.

Once the intended behavior is settled, we would be happy to contribute a small cross-producer
fixture covering the example above.

# Internal publication notes

- Internal source record: [evidence](../research/okf-v0-2-compatibility-audit.md).
- Replace `#212` and `#239` with links if the GitHub editor does not autolink them in the final form.
- Recheck the section numbers against the current specification immediately before publication.
- Search for a newer issue that already settles extension-key collisions.
- Publish only the `# Draft issue` contents; omit this proposed-title wrapper and internal notes.
- Keep date-scalar and verification findings in their existing upstream discussions.
