---
type: Task
title: 'Typed links: include relationship text in link-add identity'
status: todo
priority: P1
description: >-
  Blocking architecture-review remediation: allow one source to link to the same
  target with different exact relationship texts, while an exact duplicate
  target-plus-text remains an idempotent no-op. Add regression coverage without
  changing open-world relationship linting.
actor: codex-main
timestamp: '2026-07-14T17:02:55.363Z'
---
# Problem

The graph reader treats two links from the same source to the same target as different semantic
edges when their exact display text differs. The generic `link add` command currently treats any
existing link to the target as a duplicate, regardless of text, so it can refuse to create a valid
second relationship.

This is the blocking objection recorded by
`review-requests/kinds-and-descriptions-architecture`.

# Required change

- Define link-add identity as normalized target plus exact display text.
- Keep an exact duplicate target-and-text add idempotent with `changed: false`.
- Allow a different exact relationship text to be added to the same target.
- Preserve the existing relative-link emission and target-resolution behavior.
- Add regression tests for both the exact-duplicate and different-text/same-target cases, including
  the `new --link` path that delegates to `link add` where appropriate.
- Run the repository checks and obtain independent review of the exact implementation SHA.

# Non-goals

- Do not make declared relationship vocabulary closed-world or turn warn-only link linting into a
  hard rejection.
- Do not add cardinality, uniqueness, ownership, or relationship migration machinery.

# Completion evidence

Record the merged PR/commit, the regression tests, and the final verification result in this task's
description before marking it done. Once completed, the architecture Review Request can be
reconsidered for approval.
