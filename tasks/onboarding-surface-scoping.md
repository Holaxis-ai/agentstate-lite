---
type: Task
title: >-
  Scope the onboarding surfaces: reconcile 4 overlapping items into one coherent
  early-UX plan (HANDOFF)
status: done
priority: '2'
description: >-
  Completed 2026-08-03: plans/onboarding-surfaces defines one journey, two
  shipped primitives, two remaining work units, and one Journey model; guidance
  task narrowed, Mike-side changes await review request.
actor: codex-onboarding-scope
timestamp: '2026-08-03T22:36:59.024Z'
---
# Onboarding surface scoping — handoff note

## Outcome — completed 2026-08-03

Scoping is complete in [plans/onboarding-surfaces](../plans/onboarding-surfaces.md). The four-way
overlap resolves to one user journey, two already-shipped primitives, two distinct pending work
units, and one non-task product model:

- `product-recipe-discovery` is already DONE (PR #201, merge `138a3c7`) and is the generic
  no-bundle discovery seam. The original handoff's todo/unowned summary was stale; the Task is
  owned/assigned to `openai/codex`.
- `guidance-bundle-onboarding` is re-scoped in place as the explicit built-in
  `agentstate-guide` learning Recipe, with no special installer, silent postinstall, wizard, or
  acknowledgement dependency.
- `npm-quickstart-onboarding` remains a separate `work-tracking` installed-package productivity
  proof and is not blocked by guide completion.
- the Journey/Journey Stage records remain the cross-lane experience and readiness map, not a
  fourth implementation surface.
- the completed launcher-first-run work is reused as the visual container; it is not reopened.

The openai/codex-owned records were left unchanged. Michael Collier's light coordination/sign-off
is requested in [review-requests/onboarding-surfaces-mike-signoff](../review-requests/onboarding-surfaces-mike-signoff.md)
before their wording or state changes. No P5A, release, update, deployment, or product-code work was
performed.

## Handoff context

Created 2026-08-03 by the main orchestrator session (Brian's) as a HANDOFF to another team, so it
proceeds in parallel while this session focuses on the P5A npm-release-automation work. This is a
SCOPING task, not a build: several onboarding items have accreted independently and overlap. Reconcile
them into ONE coherent early-UX plan BEFORE anyone builds, so we don't ship three or four
half-overlapping onboarding surfaces.

## The four overlapping items to reconcile

1. **`tasks/guidance-bundle-onboarding`** (P2, todo, actor brian-claude) — ship a guidance BUNDLE with
   the npm package that teaches a new user how to use aslite (aslite teaching aslite in its own
   medium). Its body already captures the open decisions (silent-auto vs explicit-command install,
   skill-awareness, always-available vs one-time-wizard lifecycle). OURS — free to merge/retire.
2. **`tasks/npm-quickstart-onboarding`** (todo, actor openai/codex) — the TESTED install ->
   init-a-recipe -> productive JOURNEY (the happy path, literally tested). It is a CHILD of the
   distribution/release program (`roadmap-items/distribution-neutral-resources`) and maps to phase Q6
   in `plans/version-string-channel-identity`. COORDINATE before merging/retiring — likely Mike's
   side owns it.
3. **`tasks/product-recipe-discovery`** (todo) — bundle-free DISCOVERY before init: how a newcomer who
   has no bundle yet learns what aslite offers and picks a starting recipe. The newcomer's very first
   moment.
4. **The Journey model** — `journeys/new-user-to-recurring-value` + `journey-stages/*` (actor
   openai/codex, added ~2026-08-03) — the new-user onboarding path modeled as first-class Journey /
   Journey Stage docs. Possibly the meta-STRUCTURE the other three fit inside. COORDINATE — Mike's
   side authored it.

## Starting hypothesis (validate/refine — do not assume)

These may be one pipeline, not four competitors:
- `product-recipe-discovery` = BEFORE a bundle exists (discover + pick a recipe).
- `npm-quickstart-onboarding` = the install -> init -> first-productive-use journey (the tested path).
- `guidance-bundle-onboarding` = the persistent, explorable teaching bundle available afterward.
- the Journey model = the organizing framework the first three are stages OF.
If that holds, the deliverable is a sequence + a de-duplicated task set, not four parallel builds.

## Deliverable

A scoping doc (`plans/onboarding-surfaces`, type Plan, or a Design) that:
- Names each surface's DISTINCT job vs where they genuinely overlap.
- Decides which are one thing vs separate things.
- Sequences them and reconciles the task set (merge / split / retire / re-scope), recording which tasks
  change and why.
- Leaves each surface with a clear owner and next step.
This is scoping only — no product code.

## Constraints / collision-avoidance

- npm-quickstart-onboarding and the Journey model are authored by `openai/codex` (Mike's side). Do NOT
  unilaterally retire or rewrite another team's task — coordinate, and record proposed changes for
  their sign-off.
- Do NOT touch the P5A / npm-release-automation work or the release/update chain — that is this
  session's focus and is independent.
- Honor `decisions/defer-builtin-recipes` (the steering decision: learn from test-user custom recipes
  first; focus on the launcher tutorial) — the plan must be consistent with it.

## Team setup

Load the `aslite` skill. Read, before scoping: the four items above; `designs/user-notices` (the
per-person identity prerequisite touches onboarding/acknowledgement); `roadmap-items/recipe-plugins`
and `roadmap-items/distribution-neutral-resources` (the umbrellas); `decisions/defer-builtin-recipes`.
Write with `--actor <your-name>`; claim this task (flip to in_progress) before starting; sync when done.

## Related

- [guidance-bundle-onboarding](guidance-bundle-onboarding.md)
- [product-recipe-discovery](product-recipe-discovery.md)
- [npm-quickstart-onboarding](npm-quickstart-onboarding.md)
- [recipe-plugins](../roadmap-items/recipe-plugins.md)
- [defer-builtin-recipes](../decisions/defer-builtin-recipes.md)
- [user-notices](../designs/user-notices.md)

[reconciles](guidance-bundle-onboarding.md)

[reconciles](product-recipe-discovery.md)

[reconciles](npm-quickstart-onboarding.md)

[reconciles](../roadmap-items/recipe-plugins.md)

[reconciles](../decisions/defer-builtin-recipes.md)

[reconciles](../designs/user-notices.md)

[reconciles](../journeys/new-user-to-recurring-value.md)
