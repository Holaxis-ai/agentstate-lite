---
type: Convention
title: Review
governs: Review
path: reviews/
description: >-
  A durable verdict-bearing review record linked to its exact target, evidence,
  and resulting work; sparse and externally authored Reviews remain valid.
fields:
  required:
    - title
  optional:
    - status
    - role
    - verdict
    - verdict_subject
    - family
    - target
    - target_version
    - evidence_cutoff
    - template_version
    - owner
actor: review-method-builder
timestamp: '2026-08-08T14:47:00.000Z'
---
# Review

A `Review` is a durable verdict-bearing assessment of an exact target or an explicit later
approval, addendum, or re-review. It is ordinary OKF content: Markdown frontmatter, body, and plain
relative links. This convention improves creation and discovery without creating a closed review
registry or a second relationship system.

## Minimum contract

Only `title` is required. `reviews/` is the preferred path used by `new "Review"`; it is not an OKF
validity boundary. A sparse `type: Review` document elsewhere remains readable and discoverable.
No body heading is required.

Optional fields are open-valued interoperability hints:

- `status` describes the record lifecycle, not the judgment;
- `role` describes synthesis, specialist, approval, addendum, rereview, or another author-defined
  role;
- `verdict` records the judgment and `verdict_subject` names what was judged;
- `family` is an optional routing hint for a multi-record family, never a registry key or authority;
- `target`, `target_version`, and `evidence_cutoff` identify the primary evidence line;
- `template_version` identifies the method used; and
- `owner` identifies the record/family steward, not an authenticated principal or authorization
  grant.

The convention intentionally declares no enum values. Unknown fields and values remain ordinary OKF
content and must be preserved by consumers.

## Relationships and families

Relationships are plain relative Markdown links. Authors may use readable labels such as `part of
review`, `amends review`, `rereviews`, `approves report`, `has finding`, or `produces task`, but these
are guidance rather than a closed vocabulary. Unknown labels and target types remain first-class
edges.

For a multi-record family, one synthesis Review is the stable root. A supporting Review should link
that root directly when one exists. Addenda and re-reviews form an immutable forward graph; frozen
predecessors are not rewritten to say “superseded.” The effective conclusion is the unique
applicable leaf for a named target/evidence line. Branches, cycles, conflicting `family` hints,
multiple parents, and missing targets are surfaced as ambiguity or incompleteness rather than
silently resolved from a title, filename, folder, or timestamp.

A standalone Review needs no `family`. A `Review Request` remains a separate named-human decision
workflow and does not become a Review merely because its title says “review.”

## Interoperability and authority

Consumers query live documents and graph edges. A migration inventory may document historical
classification, but it is audit evidence only and must never become runtime configuration. Missing
metadata or a missing convention degrades to a sparse Review, not an invalid record. Views preserve
raw unknown values and relation labels and must not hardcode project ids or known families.

The richer architecture-review method, recommended vocabulary, wrapper test, disclosure rules, and
QA matrix live in the versioned reusable template. They are guidance over flexible OKF content, not
engine validation semantics.
