---
type: Task
title: 'Portable recipe packages v1: install content-free Kinds and Pages'
status: in_progress
priority: '1'
assignee: codex
description: >-
  Extend recipe add so a definitions-only recipe can safely carry explicit Page
  registry/HTML assets alongside Kinds, proven by a content-free Review Request
  package.
actor: codex
timestamp: '2026-07-14T03:52:36.651Z'
---
# Objective

Implement the `definitions-only` portable recipe package described in
`designs/portable-recipe-packages`: optional manifest-declared Page registry/HTML pairs flow
through the existing recipe parser and expect-absent apply boundary.

# Behavioral claim

One external recipe folder can install a self-describing domain model and its generic human Page
into a fresh bundle without carrying any source instances, while remaining idempotent and refusing
to overwrite different existing Page assets.

# Acceptance

- One parse/validate pipeline for built-in and external recipes.
- Definitions-only inventory rejection before writes.
- Safe relative paths and symlink-escape rejection for every acquired file.
- Page HTML installed before its registry entry; identical targets are no-ops, different targets
  conflict.
- Receipt includes convention and Page outcomes.
- A real content-free Review Request recipe is the fixture.
- Clean-room install, valid/invalid instance authoring, no-data, reapply, collision, and remote
  round-trip tests.
- Generated skill/reference prose accurately describes the richer package shape.
- Ordinary-code gate: exact-SHA independent review and full `npm run check` before merge.

# Non-goals

No marketplace, automatic upgrade, composition/dependencies, seed instances, new top-level command,
or cross-bundle launcher in this unit.

