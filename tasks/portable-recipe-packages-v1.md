---
type: Task
title: 'Portable recipe packages v1: install content-free Kinds and Pages'
status: done
priority: '1'
assignee: codex
description: >-
  Extend recipe add so a definitions-only recipe can safely carry explicit Page
  registry/HTML assets alongside Kinds, proven by a content-free Review Request
  package.
actor: codex-main
timestamp: '2026-07-14T17:22:47.242Z'
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

# Implementation status

Draft PR: https://github.com/Holaxis-ai/agentstate-lite/pull/54

Exact implementation commit: `e27e231`

Implemented the strict full-package inventory, declared Page parsing and validation, idempotent
Page installation through the storage seam, collision preflight, CLI receipts/help, shipped skill
references, and a real Review Workflow package with no instances.

Validation completed:

- Full `npm run check` repository gate.
- Clean browser rerun: 14/14.
- Focused recipe suite: 68/68.
- Built-CLI clean-room install and zero-instance smoke.
- Standalone npm tarball install and execution outside the monorepo.

Status remains `in_progress` until independent review of the exact commit is complete and the PR
is merged. The bot-owned plugin bundle/version will regenerate after merge.
