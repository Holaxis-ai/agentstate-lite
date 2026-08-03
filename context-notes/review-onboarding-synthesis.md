---
type: Context Note
title: Onboarding-surfaces plan review — 3-lens panel synthesis (pass-with-caveats)
actor: claude-main-onboarding-review
timestamp: '2026-08-03T23:25:21.747Z'
---
# Summary

Synthesis of the three-lens review panel (founder-intent, coherence/architecture, adversarial
skeptic) of `plans/onboarding-surfaces` — the codex team's onboarding scoping. All three returned
**pass-with-caveats**; findings CONVERGED. Lens notes: [intent](review-onboarding-intent.md),
[coherence](review-onboarding-coherence.md), [skeptic](review-onboarding-skeptic.md).

**VERDICT: pass-with-caveats. The structure is sound and approvable; the coordination discipline was
correct. Act on it WITH the punch list below — some items before the sign-off sends, some before the
guide builds.**

## Affirmed by all three lenses (empirically where checkable)
- **"One journey, not four products" holds** — the plan's strongest contribution; the four-way
  overlap resolves cleanly into two shipped primitives (discovery PR #201, launcher #135/#137/#151),
  two pending units (quickstart, guide), and one non-task Journey model. Retiring nothing is right.
- **Coordination writes were clean** — board commit `4540425` touched only Brian-owned tasks + the
  plan/review-request/notes; the THREE openai/codex records (product-recipe-discovery,
  npm-quickstart-onboarding, journeys/new-user-to-recurring-value) are untouched. Verified twice.
- **Recipe shape is right** (a built-in recipe materializing a standalone bundle, one owning
  RecipeSource primitive, no new install path); guide kept separate from `examples/sample-bundle`;
  ACKNOWLEDGEMENT correctly deferred (per-person identity infra genuinely does not exist — `actor.ts`
  has no stable key). Shipped-discovery probes reproduce.

## MUST resolve BEFORE the guide builds (v1 criteria describe behavior the code lacks)
- **F1 [HIGH, convergent: coherence M1 + skeptic S1] The "first safe action creates the first
  instance" is not buildable.** view-runtime's only write is `document.set-field` on an EXISTING
  governed doc; there is NO create action. A data-free guide's read-only View has nothing to act on.
  FIX (pick + write into the task): v1's first action is a CLI `aslite new "<Kind>" <id>` OBSERVED in
  the read-only View (no new code — cleanest; but restate plan lines 60/72 which imply the View does
  it). A View-mediated create would be a NEW high-risk mechanic (trusted-action + CAS) = a third
  build unit the plan does not surface.
- **F2 [HIGH, convergent: coherence H2 + skeptic S2] `init` has no existing-workspace guard.**
  `init --dir <existing bundle> --recipe X` additively applies a second recipe (exit 0, no warning);
  init inside a bundle creates a nested one. So guide criterion 3 + the "fail closed" row need REAL
  guard code in SHARED `init` (`bundle.ts` resolveTargetDir) — contradicting "no new machinery" and
  coupled to the quickstart's own `init --recipe work-tracking` path. FIX: name it an explicit scoped
  sub-unit ("init target-safety guard"), decide generic-vs-guide-specific up front, notify the
  quickstart owner. It is a hidden predecessor, not content copy.

## FIX BEFORE the Mike sign-off is sent (cheap; else Mike must infer)
- **F3 [skeptic S4] The sign-off does not name/gate the Journey docs it proposes to change** (the
  Review Request kind has no `reviews journey` link type, so a Mike-side query finds nothing). Name
  the exact IDs inline in `# Requested decision`: `journeys/new-user-to-recurring-value`,
  `journey-stages/04-learn-through-guidance-bundle`, `journey-stages/06-install-or-model-operating-system`.
- **F4 [skeptic S5] The built-in-recipe-deferral question is asserted away, not asked.**
  `decisions/defer-builtin-recipes` explicitly left open whether the deferral extends to other
  built-in-recipe-flavored tasks. `agentstate-guide` IS a built-in recipe. Add one sign-off item:
  "does the deferral extend to a built-in guide recipe, or is agentstate-guide outside it?" — a
  decision only Mike (who made the original) can record.
- **F5 [convergent: coherence H1 + skeptic S6] Two proposed behaviors cross into DONE codex-owned
  shipped primitives** and are not in the authorized list: (a) shipped discovery emits a CWD init
  command in the onboarding moment, the OPPOSITE of the plan's "never infer cwd" rule; (b)
  "recommend the guide to a new user" (step 3) requires editing the completed no-bundle home copy.
  FIX: either authorize these home-copy/emitted-command edits in the sign-off, or soften step 3 to
  "appears in the inventory alongside the others."

## Founder-intent fix (the requirement actually at risk of shipping as nothing)
- **F6 [intent, headline] Proactive discovery was demoted to an untestable "may."** Brian's original
  "combination" had two halves: the agent (i) tells a new user the guide exists and (ii) stops
  nagging afterward. The plan nails (ii) by construction (zero nag => no marker needed => the
  acknowledgement/identity dependency correctly evaporates). But (i) is demoted to "the optional
  Agent Skill MAY mention..." with no acceptance criterion and no owner; `reference.ts` has no guide
  mention at all. FIX (all static, zero-identity, already drift-gated by `check:skill`): add a v1
  criterion that the shipped skill surface names `agentstate-guide` + its exact command + "recommend
  when a user identifies as new," and that the no-bundle `getting_started` line names the guide.
  Record WHY the ack deferral is free (zero-nag), so it is not re-litigated — and note any future
  proactive prompting must stay STATELESS or the identity prerequisite returns.

## Scope corrections (plan completeness — not blockers)
- **F7 [skeptic S3 + coherence M2] "Only two implementation tasks remain" is overstated at
  journey scope.** Un-surfaced onboarding records: `tasks/mcp-install-verb` (P1; the guide's
  criterion 4 depends on it), `tasks/persona-recipe-product-manager` (agentstate-guide would quietly
  become the first built-in carrying References+Views, taking that slot), Journey stage 06
  (`shared`/`core`/`rough`, now owner-less). FIX: scope the claim to "two remaining within the
  discovery -> guide -> quickstart slice" and list the adjacent open records.
- **F8 [skeptic S9] The built-in packaging shape is unstated and not free.** The guide would be the
  FIRST built-in carrying References + Views; today's built-ins are conventions-only TS constants.
  The folder recipe proves parse/apply, NOT built-in-BY-NAME with refs+views. Decide: hand-encoded
  TS vs build-time embed (UI-asset precedent) vs runtime read from shipped `references/` (AXI
  phantom-invocation risk). Also: the guide's "exact installed npm artifact" criteria depend on the
  npm channel the plan says it is independent of (mitigable via the local-dev tarball gate — write
  it down).
- **F9 [skeptic S7] Do not over-gate the guide BUILD on Mike.** The plan concludes the guide touches
  no Mike-owned record, yet gates all guide design/build on the sign-off; a prior review sat 20 days.
  Gate only (a) codex-record edits and (b) the "recommended default" claim (F5). Curriculum/View
  content design can start now.

## Operational note
- **The guide task is ALREADY narrowed** — commit `4540425` rewrote `tasks/guidance-bundle-onboarding`
  in place (actor now `codex-onboarding-scope`, assignee still `brian-claude`) in the SAME commit as
  the plan. "Narrow the guide task" is DONE; do not re-narrow (a second rewrite would diverge).

## Disposition
Send the sign-off to Mike (the structure and boundary are sound) AFTER folding in F3/F4/F5 — minutes
of work, all things Mike would otherwise have to infer, and F4 is the one genuinely contested
decision. Add F6 (proactive-discovery criterion) to the guide task. Do NOT start building the guide
until F1 (first-action) and F2 (init guard) are resolved — both are code-does-not-match-plan, and F2
is a real shared-code predecessor with its own review/QA tier. F7/F8/F9 are plan edits that prevent
rework.

# Related
- [plan under review](../plans/onboarding-surfaces.md)
- [Mike sign-off request](../review-requests/onboarding-surfaces-mike-signoff.md)
- [re-scoped guide task](../tasks/guidance-bundle-onboarding.md)
- [intent lens](review-onboarding-intent.md) / [coherence lens](review-onboarding-coherence.md) / [skeptic lens](review-onboarding-skeptic.md)

[synthesizes](../plans/onboarding-surfaces.md)

[synthesizes](../review-requests/onboarding-surfaces-mike-signoff.md)

[synthesizes](review-onboarding-intent.md)

[synthesizes](review-onboarding-coherence.md)

[synthesizes](review-onboarding-skeptic.md)
