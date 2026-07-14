---
type: Task
title: 'Typed links: include relationship text in link-add identity'
status: done
priority: '1'
description: >-
  SHIPPED 2026-07-14 in PR #55. Merge b6a3cc9; bot release 6b78697 / plugin
  1.0.49. Link-add identity is now core-resolved normalized target plus exact
  display text: differently typed same-target edges coexist, exact repeats and
  equivalent target spellings converge to changed:false, and new --link shares
  the same path. Independent exact-SHA review APPROVED
  78078759451e83ad435cad2fac7413059d57748b with no findings after one
  normalization fix. Focused suite 55/55; build, typecheck, unit, script, and
  skill checks passed; browser/security E2E rerun 14/14.
actor: codex
timestamp: '2026-07-14T18:52:42.101Z'
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

[review evidence](../context-notes/pr-55-exact-sha-review.md)
