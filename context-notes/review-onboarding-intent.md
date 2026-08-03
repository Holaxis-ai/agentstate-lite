---
type: Context Note
title: 'Founder-intent review: onboarding surfaces plan'
actor: claude-ob-intent-reviewer
timestamp: '2026-08-03T23:15:52.725Z'
---
# Summary

Founder-intent / product review of [the onboarding surfaces plan](../plans/onboarding-surfaces.md)
against the ORIGINAL guidance-bundle task (board commit `d0000da`, before the re-scope).

**Verdict: pass-with-caveats.** The plan's structural work is sound and its deferral of
ACKNOWLEDGEMENT is correct and empirically justified. But it demotes the OTHER half of Brian's
"combination" — the agent proactively recommending the guide to a new user — from a requirement to
an optional "may", with no acceptance criterion and no owner. That, not the wizard, is the founder
requirement at risk of being silently discarded.

# What the original asked vs what the plan decided

Original task (`d0000da`) posed three decisions. The plan answers all three:

| Original decision | Plan's answer | Judgment |
| --- | --- | --- |
| 1. Install model: silent-auto vs explicit command + destination | Explicit destination via `init --recipe agentstate-guide --dir <path>`; no postinstall, no cwd inference | **Sound.** It is the answer the original's own risk analysis pointed at (auto-into-a-project collides with "never init over an existing workspace"). |
| 2. Skill awareness: should the skill know about the guide and recommend it | "The optional Agent Skill MAY mention the exact discovery command when a user identifies as new or asks for help" | **Lossy.** See issue 1. |
| 3. Lifecycle: always-available / one-time wizard / combination with ACKNOWLEDGEMENT | Persistent reference; wizard and "seen"/ack dropped for v1; ack deferred to the notice mechanism | **Ack deferral sound; wizard deferral sound but under-specified.** See issues 3 and 5. |

# 1. The dropped wizard / acknowledgement

## The acknowledgement deferral is SOUND (empirical)

Identity infra genuinely does not exist. Verified in code today: `packages/cli/src/actor.ts`
resolves attribution as `--actor` > `AGENTSTATE_LITE_ACTOR` > absent — no stable per-person key,
exactly as [the notice design](../designs/user-notices.md) describes. That design names
"default actor from git config" as step 1 of its build order and it is unbuilt. A cross-device,
cross-project "this person has been onboarded" marker is therefore blocked on real infrastructure,
not on will. Deferring it is correct.

## And at zero nag, the marker is not needed at all (reasoned)

Brian's requirement was an OUTCOME — "the agent stops nagging" — not a mechanism. A durable
acknowledgement marker exists only to suppress a nag. The plan's v1 has no nag, so it satisfies the
stop condition by construction rather than by state. That is a legitimate and cheaper answer, and
the plan should say so in exactly those terms rather than presenting the drop as a scope cut.

**The dependency runs one way, and it matters:** the ack deferral costs nothing ONLY while v1 stays
zero-nag. Any future proactive prompting must stay stateless-by-construction (recommend when the
user asks or self-identifies as new — never a counter, never a per-session reminder), or the
identity prerequisite comes straight back.

## What IS silently discarded: proactive discovery

The original's combination had two halves: (i) the agent tells a new user the guide exists,
(ii) it stops afterward. The plan delivers (ii) perfectly and (i) weakly:

- Bare `aslite` in an empty directory points at `recipes` — verified today (probe in an empty temp
  dir: exits 0, emits `getting_started`, creates no files). But that path is reached only by a
  human typing in an empty directory.
- `packages/cli/src/reference.ts` contains no guide/learn mention at all (grepped) — so the skill
  "may mention" is not a permission to leave existing text alone; it is unscoped, unowned work that
  can ship as nothing.
- The task's eight acceptance criteria contain **nothing** about skill awareness. Under the plan's
  own acceptance matrix, half of decision 2 is unverifiable.

This also under-delivers the Mike-owned [Journey Stage 04](../journey-stages/04-learn-through-guidance-bundle.md),
which states the requirement more strongly than the plan does: "the FIRST bundle the user
encounters" and "installation makes the guidance bundle DISCOVERABLE without polluting the user's
project."

# Issues

**1. MEDIUM — proactive recommendation demoted to an untestable "may".**
Fix, all static text with zero identity and zero hidden state, all testable by gates that already
exist: (a) add a v1 acceptance criterion that the shipped Agent Skill surface — `reference.ts`,
whose generated `SKILL.md` is already drift-gated by `check:skill` — names `agentstate-guide` and
its exact creation command, and instructs recommending it when a user identifies as new or asks how
to start; (b) add a criterion that the no-bundle `getting_started` line names the guide as a
choice. This is the lightweight non-identity behavior the plan gestures at; as written the gesture
is not enough.

**2. MEDIUM — the journey has one entry point; the product has three.**
Steps 1-3 assume a human in an empty terminal. The dominant real channel for this product is
agent-mediated: an agent already working in an existing project, or a host with the skill/hook
installed. Neither reaches the empty-directory probe. Relatedly, no journey step covers
`hook install` / `skill install`, which is the durable non-identity mechanism that makes "the agent
no longer needs to recommend anything" true by construction — the closest stage (12, return and
rediscover) is marked `rough`. Fix: name the entry points explicitly at steps 2-3 and add the
hook/skill step to the sequence.

**3. LOW-MEDIUM — "persistent reference, not a one-time wizard" risks dropping SEQUENCE with STATE.**
A wizard's value is order plus a safe first action; only its completion marker needs state. Fix:
state that v1 ships an ORDERED curriculum (numbered References, next-links, one safe attributed
action, a graduation step) and that what is excluded is completion/acknowledgement state, not
guidance order. As written a builder can reasonably read "reference" as "unordered pile of docs".

**4. LOW — "user-chosen destination" may leave the newcomer an unanswered question.**
The original floated a fixed per-user home (`~/.aslite/guide`) as the non-polluting automatic
target; the plan drops it without discussion, and its non-goal only rules out inferring the CWD.
Asking a first-time user to invent a path is friction. Fix: emit a suggested default INSIDE the
explicit command (still explicit, still overrideable, still never the cwd by inference).

**5. LOW — record why the ack deferral is free, not just that it is deferred.**
One line in the plan: "with no nag there is nothing to suppress, so v1 needs no marker; any future
prompting must stay stateless or it re-acquires the identity prerequisite." This keeps a future
session from re-litigating a decision that was already made correctly.

# 2. Is the standalone built-in Recipe the right product shape?

**Yes.** It answers the original's own open question ("is it a RECIPE or a STANDALONE bundle?")
with the union — a recipe that materializes a standalone bundle — and does so through one owning
primitive (`RecipeSource` plus the shipped bundle-free discovery) rather than a second install path.
No special `guide`/`learn` command, no postinstall, no marketplace. Keeping the guide separate from
`examples/sample-bundle` is also right: an interop/round-trip fixture and maintained curriculum have
different oracles and would fight each other. The only thing narrowed away without discussion is the
fixed per-user home (issue 4).

# 3. Is "one journey, not four products" the right story?

**Yes — this is the plan's strongest contribution.** Resolving an apparent four-way overlap into two
completed primitives, two pending units, and one non-task product model is exactly the right
disposition, and retiring nothing is the right conservatism. Step 6 ("graduate rather than convert")
is a notably good call: it keeps the guide from becoming the user's real workspace and honors the
standing never-init-over-an-existing-workspace rule. The sequence is otherwise faithful to how a
newcomer moves; its gap is entry-point coverage (issue 2).

# 4. Does it honor the built-in-recipe deferral?

**Yes, and the argument is sound.** [The deferral](../decisions/defer-builtin-recipes.md) turns on
not GUESSING a user's domain operating model — its unblock condition is test-user walkthroughs
producing real custom recipes. The guide's subject matter is the vendor's own shipped primitives,
where no user research is needed to know what a bundle or a link is. Supporting precedent, which the
plan does not cite but should: the deferral explicitly left `product-recipe-discovery` ambiguous
("same logic plausibly applies, but Mike has not said so") and it shipped anyway at PR #201 — so the
deferral has not in practice been extended to product-shape recipes.

Two honest caveats:

- CURRICULUM ORDER is a guess about users, and it is precisely what test-user walkthroughs would
  inform. Treat the curriculum as a revisable hypothesis, not frozen built-in content. Cost of being
  wrong is low (no real workspace depends on it), which is why this does not block.
- The guide plausibly ACCELERATES the deferral's unblock condition by making test users productive
  enough to do custom-recipe walkthroughs. Worth stating in the plan as a positive rather than
  leaving the relationship purely defensive.

# Labeling

- **Empirical:** original task text from board commit `d0000da`; `actor.ts` has no stable identity;
  `reference.ts` has no guide mention; three built-in recipes (`context-notes`, `work-tracking`,
  `roadmap`); bare `aslite` in an empty temp directory exits 0, points at `recipes`, and creates no
  files; Journey Stage 04 readiness is `missing`; 14 Journey Stages with no hook/skill-install stage.
- **Reasoned:** the acknowledgement-vs-nag dependency argument; entry-point analysis; curriculum
  order as a hypothesis; the recipe-shape judgment.

# Related

- [plan under review](../plans/onboarding-surfaces.md)
- [re-scoped task](../tasks/guidance-bundle-onboarding.md)
- [Mike sign-off request](../review-requests/onboarding-surfaces-mike-signoff.md)
- [notice/identity design](../designs/user-notices.md)
- [built-in recipe deferral](../decisions/defer-builtin-recipes.md)
