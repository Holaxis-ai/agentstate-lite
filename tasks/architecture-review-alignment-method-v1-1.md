---
type: Task
title: Implement the open-world Review convention and template v1.1
status: in_progress
priority: '2'
assignee: review-method-builder
actor: codex-orchestrator
timestamp: '2026-08-08T14:49:55.805Z'
---
# Objective

Implement the reusable open-world Review convention and architecture-review template v1.1 without changing v1.0 or invalidating sparse/legacy OKF documents.

# Acceptance

The convention requires only title, provides the preferred reviews path, declares optional open-valued metadata including verdict subject, and has no mandatory headings or closed enums. Template v1.1 adds the reviewed record graph, verdict-subject and immutable succession rules, disclosure preflight, multi-target provenance, wrapper test, portability requirements, and exact reviewer gate. It receives its own exact-version approval after independent specialist/skeptic review.

[governed by](../plans/architecture-review-record-alignment.md)

[depends on](architecture-review-alignment-inventory.md)

# Builder draft

Draft artifacts:

- `conventions/review` at `sha256:cd91040314f5feca01a11e53f7784e4435d22780e816f23d5fe9c0c56844100f`
- `reviews/architecture-review-template-v1.1` at `sha256:91bf042022c1da49021ae9d8a20272941c0452f85c5f187274920a39f94ba48d`
- frozen predecessor `reviews/architecture-review-template` remains exactly `sha256:02e263f4e78d8fd9e9c6d63a634e82d8ce968b5c54f5e8bb01d224a2279abd09`

Builder validation:

- Live kind discovery reports ten kinds and a `Review` kind requiring only `title`, with ten optional fields and no enumerated values, link declarations, or required sections.
- Live compatibility stayed at `malformed: 0`, `kind_warnings: 9`, `unresolved_links: 6`, `registry_warnings: 0`, `link_type_violations: 18`, and `missing_expected_links: 35`; the draft introduced no new conformance or relationship debt.
- Disposable copy: `/private/tmp/aslite-review-method.ZgCC78/bundle`.
- In that copy, `new 'Review' scratch-minimal --title 'Scratch minimal Review'` created `reviews/scratch-minimal` at `sha256:c71ba791a255a0b13d183c86dd081db4ea75c957c3f9d1a95eec3fd99601115d` with only the ordinary system metadata plus title and an empty body.
- Scratch status stayed at `malformed: 0` and `kind_warnings: 9`; the only expected count change was one additional orphan for the deliberately unlinked fixture.

The method remains `in_progress`. No approval Review, wrapper, View, migration, or sync was created; exact-version specialist, skeptic, and independent QA review remain the next gates.

[depends on](architecture-review-template-v1-1-security-review.md)

[depends on](architecture-review-template-v1-1-testing-review.md)

[depends on](architecture-review-template-v1-1-design-skeptic-review.md)
