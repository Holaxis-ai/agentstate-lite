---
type: Issue Draft
title: 'Upstream issue draft: OKF v0.2 status field collision'
description: >-
  Draft producer report asking how OKF global lifecycle metadata should coexist
  with type-specific workflow state.
actor: openai/codex
timestamp: '2026-08-05T04:14:10.871Z'
---
# Proposed title

How should producer-defined workflow state coexist with OKF v0.2's global `status` field?

# Draft issue

## Summary

OKF v0.2 gives the optional top-level `status` field a document-lifecycle meaning, with the values
`draft`, `stable`, and `deprecated`. This is clear in isolation, but it creates an extension collision
for producers whose document types already define a field named `status` for domain workflow state.

We encountered this while evaluating AgentState Lite, an OKF-based producer with user-defined
document Kinds. A Task may use `todo`, `in_progress`, or `done`; a Roadmap Item may use `queued`,
`active`, or `done`; a Review Request has its own review lifecycle. Those values are part of each
type's declared schema rather than claims about whether the underlying document is draft, stable, or
deprecated.

The question is broader than AgentState: how should an OKF producer safely add type-specific fields
when a later OKF version may assign a global meaning to the same unqualified key?

## Evidence from a real producer

In one active multi-agent bundle containing 826 documents:

- 336 documents had a top-level `status` field.
- Only 5 used one of OKF v0.2's document-lifecycle values.
- The rest used type-specific workflow values such as `todo`, `in_progress`, `done`, `queued`,
  `active`, `approved`, and `blocked`.

This is not a parsing problem. The documents remain valid YAML and ordinary OKF Markdown. It is a
semantic interoperability problem: a generic v0.2 consumer cannot know whether `status: todo` is a
producer extension, an invalid OKF lifecycle value, or a lifecycle it should interpret.

We discovered the collision before changing the bundle's declared version, so AgentState continues
to author v0.1 while reading and transporting v0.2 permissively. Renaming every established workflow
field would break existing recipes and user-authored schemas; declaring v0.2 without resolving the
meaning would mislead generic consumers.

## Why extension guidance would help

The specification intentionally leaves room for domain-specific metadata. A producer therefore
needs a durable way to distinguish:

1. OKF-defined portable metadata, such as document lifecycle; and
2. producer- or profile-defined fields, such as a Task's execution state.

Without a collision rule, independent producers can choose names safely only until a future OKF
release adopts one of those names globally.

## Possible approaches

These are options for discussion, not a preferred proposal:

1. **Namespaced extension fields.** Recommend a stable prefix or nested namespace for producer-owned
   metadata, while reserving unqualified fields for OKF.
2. **Profiles.** Let a bundle declare a profile that defines additional fields and their meanings,
   including an explicit mapping between profile workflow state and OKF document lifecycle.
3. **Nested OKF metadata.** Place format-owned lifecycle and provenance under an OKF-specific mapping,
   leaving the top-level namespace available to document-type schemas. This would be a larger future
   change.
4. **Reserved-name registry and migration guidance.** Keep the flat model, but formally enumerate
   reserved keys and specify how an existing producer-defined key is migrated when a later version
   adopts it.
5. **Separate conventional names.** Use a more specific OKF field such as `document_status` or
   `lifecycle_status`, leaving generic `status` available to type-defined schemas. This may be too
   disruptive for v0.2 but could inform future versions.

## Questions

1. Does OKF v0.2 intend unqualified `status` to be globally reserved whenever it is present?
2. Is there an intended extension or profile mechanism for producer-defined document schemas today?
3. Should a v0.2 consumer ignore an unrecognized `status` value, report it as invalid optional
   metadata, or treat it as a producer extension?
4. Would maintainers prefer namespaced extension guidance, a profile mechanism, or a narrower
   lifecycle field name in a future version?
5. Would a small cross-producer conformance fixture covering this collision be useful once the
   intended behavior is decided?

## Scope

This issue is not asking OKF to model Task, Roadmap, or Review workflows. It is asking for a stable
interoperability rule that allows those domain schemas to coexist with OKF's own portable metadata.

# Internal publication notes

- Before publishing, verify the exact section links against the current OKF v0.2 specification.
- Link the public AgentState audit only if its board-branch URL is stable and contains no private
  bundle material; otherwise retain the aggregate evidence in the issue.
- Search once more for a newly opened upstream issue covering extension namespaces or `status`.
- Keep the date-scalar and verification findings in their existing upstream discussions rather than
  expanding this issue beyond the field-collision question.

[evidence](../research/okf-v0-2-compatibility-audit.md)
