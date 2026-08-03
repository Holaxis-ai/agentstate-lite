---
type: Context Note
title: 'Skeptic review: plans/onboarding-surfaces'
actor: claude-ob-skeptic-reviewer
timestamp: '2026-08-03T23:21:19.236Z'
---
# Summary

Adversarial review of `plans/onboarding-surfaces` (skeptic lens), 2026-08-03, actor
`claude-ob-skeptic-reviewer`. Read-only: nothing outside this note was written.

**Verdict: pass-with-caveats.** The plan's central judgment (one journey, not four competing
products) holds, and its coordination writes were clean — no openai/codex-owned record was
touched. But it materially understates what remains, two of its stated v1 behaviors are not
buildable with shipped code, and the Mike sign-off as written does not gate everything the plan
proposes to change on Mike's side.

Three cheap edits to the review request should land BEFORE it is sent (S4, S5, S6). Two findings
must be resolved before anyone starts building the guide (S1, S2). One claim needs scoping before
it is quoted as the roadmap (S3).

## Issues

### S1 — "the learner's first safe action creates the first instance" is not buildable (HIGH, empirical)

Plan lines 60/72 and task criterion 6 describe a data-free guide whose learner performs one safe
attributed action through the orientation View, creating the first instance.

The only View-mediated write that exists is `document.set-field`
(`packages/view-runtime/src/action-bridge.ts:6-12`), and `expectedVersion` is REQUIRED and
non-empty (`:57-79`, `parseDocumentSetFieldAction`). The target document must already exist and be
governed by a Kind (`packages/view-runtime/src/index.ts:832` revokes when the governing Kind
changes). There is no document-create action anywhere in view-runtime. A data-free guide bundle
therefore has nothing for its View to act on.

Fix — pick one and write it into the task:
- the first action is a CLI `aslite new "<Kind>" <id>` and the View OBSERVES it (no new code; the
  cleanest v1, but restate plan lines 60/72 which currently imply the View does it);
- the recipe seeds one governed instance for the set-field to target (contradicts "begin with no
  user-instance data" — say so explicitly if chosen); or
- build a document-create action in view-runtime. That is a NEW MECHANIC ON A HIGH-RISK BOUNDARY
  (trusted-action authority + CAS), so per CLAUDE.md it is Builder -> independent review ->
  adversarial QA, i.e. a THIRD implementation unit the plan does not surface.

### S2 — task criterion 3 requires new fail-closed behavior in a SHARED command (HIGH, empirical)

Task criterion 3: "initializing the guide at a chosen path never creates, replaces, or mutates an
existing project workspace or binding target." That is not current behavior.

Probe (temp dirs, no repo/board writes):

    aslite init --dir <tmp>/real --recipe work-tracking   -> init: ok
    aslite init --dir <tmp>/real --recipe roadmap         -> init: ok
    ls <tmp>/real/conventions -> roadmap-item.md  roadmap.md  task.md

`init` silently applied a second recipe into an existing bundle, exit 0, no warning.
`resolveTargetDir` (`packages/cli/src/bundle.ts:65-67`) resolves the path literally — no
enclosing-bundle probe, no `.agentstate.json` binding probe.

Consequences the plan does not carry:
- this is product code in `init`, a command SHARED with the quickstart's own path
  (`init --recipe work-tracking`);
- if the guard is generic, it changes the quickstart's oracle — a coupling the plan explicitly
  denies ("independent of P5A and of guidance content");
- if the guard is guide-specific, it collides with `product-recipe-discovery`'s own non-goal of
  recipe-specific CLI branching.

Fix: name it as an explicit scoped sub-unit ("init target-safety guard"), decide generic vs
guide-specific up front, and notify the quickstart owner either way. Today it hides inside the
task's "content design questions" as "collision probes needed to make the explicit path honest."

### S3 — "only two implementation tasks remain" is not true of the onboarding surface (HIGH)

Unreconciled records that are onboarding by any reading, none in the plan's disposition table:

- `tasks/mcp-install-verb` — todo, **P1**, openai/codex, created 2026-08-03 (same day as the
  scoping). Host wiring IS Journey stages 02/03, and the guidance task's own criterion 4
  ("opens through ... MCP View surfaces, where configured") depends on it. Its own recommended
  sequence is "wait for Brian's durable npm executable/compatibility unit" — a cross-lane
  dependency.
- `tasks/persona-recipe-product-manager` — todo P3, mike/claude, "data-free, views included"
  built-in whose description asserts it is NOT the first shipped recipe. `agentstate-guide` would
  become the first built-in carrying References + Views, quietly taking that slot.
- `tasks/recipe-personal-task-system` — blocked, same slot.

And the Journey's own ledger contradicts the framing: 14 stages, 6 `works`, 7 `rough`, 1 `missing`.
Stage `06-install-or-model-operating-system` is lane `shared`, criticality `core`, readiness
`rough`, remaining gap "complete named discovery and one end-to-end data-free recipe installation
proof" — and under this plan it has no owner (its natural owner, the Personal Task System recipe,
is deferred).

Fix: scope the claim — "two remaining units within the discovery -> guide -> quickstart slice" —
and list the adjacent onboarding records that stay open and why. As written, "only two
implementation tasks remain" will be quoted as journey-wide and is false at that scope.

### S4 — the sign-off does not gate the Journey it proposes to change (MEDIUM, empirical)

`review-requests/onboarding-surfaces-mike-signoff` typed-links only: npm-quickstart,
product-recipe-discovery, distribution-neutral-resources, recipe-plugins.
`aslite link list --to journeys/new-user-to-recurring-value` returns 3 edges — from the plan and the
scoping task, NONE from the review request. Yet requested-decision item 3 and the plan's disposition
table both propose Mike-side Journey/Journey Stage edits.

Root cause is structural: the Review Request kind declares no journey link type
(`reviews design` | `reviews task` | `reviews roadmap item` | `explained by`). So a Mike-side agent
asking "what review requests touch my Journey docs?" finds nothing.

Fix (before sending): name the exact IDs inline in `# Requested decision`
(`journeys/new-user-to-recurring-value`, `journey-stages/04-learn-through-guidance-bundle`,
`journey-stages/06-install-or-model-operating-system`), and consider adding a `reviews journey`
link type to `conventions/review-request`.

### S5 — the built-in-recipe deferral tension is asserted away, not asked (MEDIUM, reasoned)

`decisions/defer-builtin-recipes` objects to "freezing today's guess into the CLI's built-in recipe
source", and explicitly states it is NOT decided whether the deferral extends to the other
built-in-recipe-flavored tasks (naming `persona-recipe-product-manager` and
`product-recipe-discovery`). `agentstate-guide` is a built-in recipe whose curriculum is today's
guess about what a newcomer needs — the same MECHANISM the decision objected to, even though the
plan's content distinction (teaches shipped primitives, not a guessed domain model) is defensible.

The plan settles this by its own inference about someone else's decision, and the sign-off never
asks the question. Sign-off item 4 only says "no Personal Task System dependency."

Fix (before sending): add one explicit item — "does the built-in-recipe deferral extend to a
built-in guide recipe, or is `agentstate-guide` outside it?" One line converts an assumption into a
recorded decision by the person who made the original one.

### S6 — "recommend agentstate-guide to a genuinely new user" requires editing a DONE Mike-owned surface (MEDIUM, empirical)

Probed bare `aslite` in an empty directory today (built CLI, 0.1.0-pre.3):

    getting_started: "no OKF bundle found in this directory — run `... init --recipe none` to
    create a blank bundle, or `... recipes` to compare available workspace setups"

Listing the guide as one more `recipes` row is automatic and needs no CLI branching (survived
probe). RECOMMENDING it, per plan step 3, means changing that no-bundle home copy — a behavioral
copy change on the completed, openai/codex-owned discovery deliverable the plan says to "keep done.
Do not reopen." The sign-off does not request it.

Fix: either soften step 3 to "appears in the inventory alongside the others", or add the home-copy
change to the sign-off's authorized list.

### S7 — the guide's BUILD is gated on a sign-off the plan's own logic does not require (MEDIUM, reasoned)

Plan line 99 gates design/build on approval, and the task repeats it ("Waits for Michael Collier's
sign-off"). But the plan concludes the guide touches no Mike-owned record. Stall risk is not
hypothetical: `review-requests/personal-bundle-catalog-product` has sat at `status: requested`,
reviewer Michael Collier, since 2026-07-14 — 20 days.

Fix: gate only (a) edits to openai/codex-owned records and (b) any claim that the guide is the
recommended default path (S6). Curriculum/View design can start now.

### S8 — the guide task was already narrowed in the same commit as the plan (LOW, empirical)

Board commit `4540425` rewrote `tasks/guidance-bundle-onboarding` in place (title, description,
whole body; `actor` -> codex-onboarding-scope, `assignee: brian-claude`) at the same time the plan
was written, though the plan reads as if narrowing is a subsequent step ("may be narrowed
immediately"). If the next action on the lead's list is "narrow the guide task", it is DONE —
re-narrowing risks a second, divergent rewrite.

### S9 — the built-in packaging shape is unstated and is not free (MEDIUM, empirical)

All three current built-ins are TypeScript string constants with conventions only
(`packages/cli/src/recipe-source-builtin.ts`; `references: []`, `views: []` in every `recipes` row).
A curriculum plus an HTML View as a NAMED built-in (`init --recipe agentstate-guide`) needs a
decision the plan skips: hand-encoded TS strings, build-time embed (precedent: gzip-embedded UI
assets), or runtime read from the shipped `references/` folder (present in both the npm tarball
allowlist and the plugin bundle, but resolving its path from the executing single-file bundle under
npx/global/plugin-cache is new machinery with AXI phantom-invocation risk).

`packages/cli/references/recipes/review-workflow` proves the PARSE/APPLY path for
references + views. It does NOT prove the built-in-BY-NAME path. "Delivery uses the existing
built-in RecipeSource" understates this.

Related, unstated: the guide's acceptance criteria all say "using the exact installed npm artifact",
which depends on the npm channel (`tasks/npm-cli-skill-prerelease`, in_progress) that the plan says
the guide is independent of. Mitigable via the local-dev tarball gate, but it should be written down.

## Survived probes — where the plan correctly held

- **Coordination writes were clean.** Board commit `4540425` touched only `plans/`,
  `review-requests/`, `context-notes/`, and the two Brian-owned tasks. No openai/codex-owned record
  was modified. The claim "the openai/codex-owned records were left unchanged" is true.
- **The graph repairs are correctly deferred.** Adding `contains` edges writes on Mike-owned
  roadmap items, so gating them behind approval is right, not over-cautious.
- **The plan's live probe reproduces.** Bare `aslite` in an empty dir points at `recipes`;
  `recipes` lists 3 built-ins offline; the directory stays bundle-free (`ls -a` shows nothing).
- **Assets are already describable with no recipe-specific branching.**
  `packages/cli/src/commands/recipes.ts:95-96` already renders `references` and `views` per row, so
  a guide with both is discoverable through the generic inventory exactly as claimed.
- **"One journey, not four" holds for the four records examined.** The handoff's starting hypothesis
  is confirmed against the records rather than assumed, and the stale "discovery is todo/unowned"
  summary was caught and corrected against the authoritative Task.
- **Explicit destination over silent materialization is the right call** — and S2 shows it was more
  than a preference: with no existing-bundle guard in `init`, an automatic/postinstall guide would
  have been actively destructive.
- **Correctly refuses two tempting merges**: guide vs `examples/sample-bundle` stay separate, and
  notices/identity/acknowledgement stay out of v1.

## Bottom line

Act on it, with edits. The plan is structurally sound and its coordination discipline was correct,
so the sign-off should go to Mike — but add S4 (name the Journey docs it gates), S5 (ask the
deferral-scope question outright) and S6 (authorize or drop the home-copy recommendation) first;
all three are minutes of work and all three are things Mike would otherwise have to infer.

Do not treat "only two implementation tasks remain" (S3) as the operating claim, and do not start
building the guide until S1 (there is no create action for the "first safe action") and S2 (`init`
has no existing-bundle guard) are resolved — both are places where a v1 acceptance criterion
currently describes behavior the codebase does not have.

[reviews plan](../plans/onboarding-surfaces.md)
