---
type: Task
title: Extract Roadmap + Roadmap Item conventions into a reusable recipe
status: todo
priority: '2'
description: >-
  Package the Roadmap and Roadmap Item conventions as a recipe-add-able recipe.
  Carries two named open design questions (distribution; how the Task
  expects_inbound pairing travels). Requested by Brian. Deps: none.
timestamp: '2026-07-07T21:17:07.707Z'
---
# Roadmap recipe — extract Roadmap + Roadmap Item conventions into a reusable recipe

Builder brief. Requested by Brian. Independent of the sync-verb work (no sync deps).
Recipe pipeline: this board's `recipes` / `recipe add` + the `RecipeSource` /
`parseRecipeFiles` machinery; a recipe is a folder (`type: Recipe` manifest +
`conventions/*.md`) applied via expect-absent CAS.

## Definition of done

A `recipe add`-able recipe that packages THIS board's `Roadmap` and `Roadmap Item`
conventions (the kind convention docs under `conventions/`), so a fresh bundle can adopt
roadmap-items-as-docs without hand-authoring the conventions. Idempotent apply
(expect-absent CAS; never clobbers a hand-edited convention). A conventions-free bundle is
unaffected until it opts in.

## Two NAMED open design questions (decide AT BUILD, record the call in this task)

1. DISTRIBUTION: built-in recipe (a third built-in alongside `context-notes` and
   `work-tracking`) vs external-folder recipe. Weigh against the roadmap's stance that a
   recipe is never defined SOLELY as a plugin, and the "prove-the-need" gate on the Roadmap
   kind.
2. expects_inbound TRAVEL: the Task kind's `expects_inbound: contains` (from a Roadmap Item)
   is what the graph lint checks. Recipes apply via expect-absent CAS and CANNOT patch an
   EXISTING task convention. So how does the Roadmap Item ↔ Task `contains` expectation
   travel with this recipe? Options to adjudicate: a work-tracking v2 that co-declares the
   pairing, vs a documented manual `kind field` step the adopter runs. Decide at build;
   do not silently drop the expectation.

## Acceptance criteria

- `recipe add` installs the Roadmap + Roadmap Item conventions; idempotent re-apply is a
  no-op; conventions-free bundle byte-identical until opt-in
- both open design questions are resolved with a recorded rationale in this task's
  description/body before close
- tests: apply → `kinds` shows Roadmap + Roadmap Item; re-apply idempotent

## Gates

Builder → independent Reviewer → QA. Deps: none (independent of sync-verb).
