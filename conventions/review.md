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
timestamp: '2026-08-08T15:00:13.922Z'
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

- `status` describes only the record lifecycle (for example `draft`, `in_review`, or `final`), not
  judgment, authorization, remediation, or currentness;
- `role` describes synthesis, specialist, approval, addendum, rereview, or another author-defined
  role;
- `verdict` records the judgment and `verdict_subject` names what was judged;
- `family` is an optional routing hint for a multi-record family, never a registry key or authority;
- `target`, `target_version`, and `evidence_cutoff` identify the primary evidence line;
- `template_version` identifies the method used; and
- `owner` identifies the record/family steward, not an authenticated principal or authorization
  grant.

The convention intentionally declares no enum values. Imported or external values—including an
unknown status such as `superseded`—remain visible and preserved but never establish approval or a
current verdict. `actor`, `owner`, reviewer, assignee, and similar identity metadata are attribution
or coordination hints only; they never authenticate a person or grant authority.

Unknown imported fields are valid ordinary OKF content and consumers preserve them on unrelated
updates. Kind-aware `doc update` accepts declared fields and rejects authoring an undeclared field
name. To author a new structured field, evolve the local convention or use the raw-document
promote/CAS import-edit path; permissive consumption does not imply that every kind-aware authoring
command accepts arbitrary flags.

## Relationships and families

Relationships are plain relative Markdown links. Authors may use readable labels such as `part of
review`, `amends review`, `rereviews`, `approves report`, `has finding`, or `produces task`, but these
are guidance rather than a closed vocabulary. Unknown labels and target types remain first-class
edges.

The generic Review Kind defines no family topology or current-verdict algorithm. Arbitrary links,
`family`, path, title, `status`, and timestamps never authorize an actor or establish membership,
succession, approval, or the current verdict by themselves. Generic consumers display unfamiliar
graphs without declaring them malformed and do not infer a winner from those hints.

Architecture-review succession, stable-root, effective-terminus, and wrapper semantics belong to
the versioned architecture-review template. Other Review methods may legitimately use peer panels,
quorum decisions, multiple scoped roots, or no synthesis record.

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
