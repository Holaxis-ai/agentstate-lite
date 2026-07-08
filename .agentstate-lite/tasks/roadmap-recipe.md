---
type: Task
title: Extract Roadmap + Roadmap Item conventions into a reusable recipe
status: done
priority: '2'
description: >-
  Shipped as the third BUILT-IN recipe ('recipe add roadmap'): Roadmap + Roadmap
  Item conventions extracted faithfully from this board (contains vocabulary,
  queued/active/done enum, roadmap-items/ path). Decision 1: built-in
  (portability to other workspaces; work-tracking's companion; prove-the-need
  gate satisfied by this board's own dogfooding). Decision 2: expects_inbound
  pairing travels as a DOCUMENTED one-step opt-in (pull->edit->promote) pinned
  by a test that executes the documented chain literally — both named options
  fail on the machinery (no versioned recipe re-application exists; kind field
  edits fields only). +8 tests, npm run check green. Commit 3fc74cd, branch
  feat/roadmap-recipe. See body Record.
actor: builder-recipe
assignee: brian-claude
timestamp: '2026-07-08T19:55:28.926Z'
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

## Two NAMED open design questions — RESOLVED at build (record below)

1. DISTRIBUTION: built-in recipe (a third built-in alongside `context-notes` and
   `work-tracking`) vs external-folder recipe.
2. expects_inbound TRAVEL: how the Roadmap Item ↔ Task `contains` expectation travels.

## Record (closed 2026-07-08, commit 3fc74cd, branch feat/roadmap-recipe)

**Shipped:** built-in `roadmap` recipe (`recipe add roadmap`) — `conventions/roadmap` +
`conventions/roadmap-item`, faithful to this board's hand-authored source conventions
(the `contains` link vocabulary on both kinds, the queued/active/done item status enum,
the `roadmap-items/` scaffold path, no path/horizon on the spine). First MULTI-doc
built-in; same `kindConventionDoc` → `stringifyDoc` → `parseRecipeFiles` pipeline, zero
core changes, `initBundle` still seeds nothing, `init`'s default stays context-notes.
Plugin 1.0.18 → 1.0.19 (both manifests). README quickstart/recipes updated.

**Decision 1 — DISTRIBUTION: built-in.** The unit's goal is tasks+roadmaps traveling to
OTHER workspaces; built-ins travel inside the single-file CLI/plugin bundle, while an
`examples/` folder recipe requires a checkout of THIS repo (claims stays the worked
example of that external path — its role is demonstrative). Roadmap is built-in
work-tracking's natural companion (this board's Task expects inbound `contains` FROM
Roadmap Item; the queued work-management cookbook composes the two), so same tier. The
roadmap's prove-the-need gate ("deferred until granular roadmap items are actually
felt") is satisfied: this board runs roadmap-items-as-docs, and Brian requested the
extraction. Cost is contained: a built-in grows the built-in LIST only, never a bundle's
default surface (recipes apply only on explicit `recipe add`). The "never solely a
plugin" guardrail is trivially preserved.

**Decision 2 — expects_inbound travel: documented one-step opt-in (the third shape).
Both named options fail on the actual machinery, investigated:**
(a) *work-tracking v2*: the recipe pipeline has NO versioned re-application — `applyRecipe`
is expect-absent CAS per doc, the manifest `version` is receipt metadata only, and
`isRecipeApplied` checks doc-id presence only — so a v2 could never patch any bundle that
already applied v1 (including this board). Also semantically wrong: baking
`expects_inbound` into work-tracking itself would fire `missing_expected_links` on every
Task in every bundle that adopts tasks WITHOUT roadmaps.
(b) *manual `kind field` step*: `kind field` mutates ONLY `fields.{required,optional,values}`
— it cannot declare `expects_inbound` (or `links`). `doc update` refuses kind-field
patches on Convention docs and `doc write` refuses overwriting a convention (schema-loss
guard); the ONE sanctioned schema-edit route beyond fields is pull → edit frontmatter →
promote (the exact route the CLI's own error messages signpost).
**Chosen shape:** the recipe carries the OUTBOUND half mechanically (both conventions
declare `contains`, so the vocabulary + `link add`'s type validation travel with the
recipe) and its manifest body documents the Task-side opt-in as the exact pull → edit →
promote chain. Not silently dropped: a test EXTRACTS that documented chain from the
manifest body and executes it literally (per the review convention on documented command
chains), asserting `Task.expectsInbound` arms, the lint fires for an unowned task, and
clears once an item `contains` it. Also verified empirically against the built binary.

**Tests:** +8 new in `packages/cli/test/recipes.test.ts` (34 total in the file, all
green): apply-with-faithful-frontmatter, kinds registry, idempotent re-add (bytes
unchanged), hand-edit never clobbered (partial apply: absent sibling still created),
applied-means-ALL-docs-present, board-parity drift gate (recipe kinds deep-equal the
board's hand-authored conventions as loaded), the documented pairing chain end-to-end,
and init-default-stays-roadmap-free. Full `npm run check` green (build + typecheck + all
workspace suites + SKILL/bundle drift gates).

**Honest caveats:** (1) `recipes` reports `applied` by doc-id presence, not content — a
bundle with hand-authored conventions at the same ids reports applied:true (pre-existing
semantics, unchanged). (2) The recipe-serialized `conventions/roadmap.md` carries
`optional: []` where the board's hand-authored file omits the key — byte-level divergence,
semantically identical after parse (the board-parity test compares loaded kinds, which is
the contract). (3) Plugin version 1.0.19 may collide with the parallel cache-per-clone
branch — whichever merges second re-bumps (flagged to the orchestrator).

## Gates

Builder → independent Reviewer → QA. Deps: none (independent of sync-verb).
