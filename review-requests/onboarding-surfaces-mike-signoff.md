---
type: Review Request
title: 'Approved: onboarding guide, create-only safety, and record boundaries'
status: approved
reviewer: Brian Derfer
requested_by: Brian Derfer
question: >-
  Approve the guide/quickstart/create-only boundaries, decide whether
  agentstate-guide is outside the built-in-recipe deferral, and authorize the
  named Mike-side front-door and record updates?
actor: codex-onboarding-scope
decision_summary: >-
  Approved by Brian Derfer on 2026-08-03. agentstate-guide is outside the
  domain-Recipe deferral because it teaches existing product functionality;
  reviewed create-only, front-door, quickstart, Journey, and roadmap boundaries
  adopted. Domain Recipes remain deferred.
decided_at: '2026-08-03T23:52:46Z'
timestamp: '2026-08-03T23:53:23.652Z'
---
# Context

[The revised onboarding plan](../plans/onboarding-surfaces.md) was reviewed through founder-intent, coherence, and adversarial lenses. The panel's [synthesis](../context-notes/review-onboarding-synthesis.md) affirmed the one-journey structure and Recipe delivery shape but found two mechanics the original plan assumed incorrectly:

- a read-only View cannot create a document, so guide v1 now teaches a CLI `new` action that the View observes; and
- current `init` can mutate an existing bundle or create a nested bundle, so safe onboarding now has a separate generic [create-only target-safety task](../tasks/init-target-safety-guard.md).

The early discovery-to-first-value slice therefore has three work units: generic create-only init safety, the Brian/Claude guide unit, and the openai/codex npm quickstart. Adjacent MCP host connection, return/rediscovery, and deferred domain recipes remain outside this request.

Recipe discovery remains done at PR #201 / merge `138a3c7`. The guide task may prototype curriculum and a read-only View now, but it will not register a recommended built-in or alter Mike-side surfaces/records until this request is decided.

# Requested decision

Michael is unavailable this week. Brian assumed decision authority and asked this session to drive
the reviewed technical boundaries. The resulting disposition of each item is recorded below.

1. **One-journey framing:** keep recipe discovery and launcher orientation as shipped primitives; keep quickstart, create-only safety, and guide as distinct work units; keep Journey docs as the evidence/readiness model rather than another runtime surface.
2. **Recipe-deferral scope:** does [the built-in recipe deferral](../decisions/defer-builtin-recipes.md) extend to a built-in product guide, or is `agentstate-guide` outside it because it teaches shipped product primitives rather than guessing a user's domain operating model?
3. **Completed discovery/home follow-up:** may the guide task update the no-bundle `getting_started` copy to name the guide and its explicit safe default path while leaving generic `aslite recipes` row-command semantics unchanged? [product-recipe-discovery](../tasks/product-recipe-discovery.md) remains done; this is a narrow follow-up owned by the guide task.
4. **Generic target-safety contract:** approve a backward-compatible `init --create-only` mode, owned by the Brian/Claude guard task, that refuses existing/bound/enclosing/ambiguous/concurrent targets before writes. Existing `init` behavior without the flag and `recipe add` remain unchanged.
5. **Quickstart integration:** after the guard ships, may [npm-quickstart-onboarding](../tasks/npm-quickstart-onboarding.md) use create-only for its fresh `work-tracking` proof and consume the revised no-bundle front door without taking ownership of guide content?
6. **Exact Journey records:** approve later evidence/lane wording changes—only after implementation proof—to:
   - [journeys/new-user-to-recurring-value](../journeys/new-user-to-recurring-value.md): name terminal, skill-mediated, and existing-project entry conditions; keep desktop host setup as parallel lanes;
   - [journey-stages/04-learn-through-guidance-bundle](../journey-stages/04-learn-through-guidance-bundle.md): reflect ordered, stateless guide discovery and the CLI-write/read-only-View interaction; and
   - [journey-stages/06-install-or-model-operating-system](../journey-stages/06-install-or-model-operating-system.md): record recipe discovery as shipped while leaving the deferred end-to-end domain operating-model proof outside the guide.
7. **Typed roadmap containment after approval:** add:
   - [npm-first distribution](../roadmap-items/distribution-neutral-resources.md) `contains` [npm quickstart](../tasks/npm-quickstart-onboarding.md);
   - npm-first distribution `contains` [init target safety](../tasks/init-target-safety-guard.md);
   - npm-first distribution `contains` [guidance onboarding](../tasks/guidance-bundle-onboarding.md); and
   - [product recipes](../roadmap-items/recipe-plugins.md) `contains` guidance onboarding.
8. **Work that need not wait:** curriculum ordering, read-only View design, folder-Recipe prototype, and build-time embedding design may proceed before this decision. Built-in registration, recommended-default copy, quickstart/Journey edits, and roadmap writes wait.

Approval authorizes only the scoped records/behavior above. It does not authorize product implementation by this scoping session, P5A/release changes, MCP installation, View-create actions, notices/identity, or revival of deferred domain recipes.

# Acceptance criteria

- The decision explicitly resolves whether `agentstate-guide` is inside or outside the built-in-recipe deferral.
- The completed discovery Task stays done and generic inventory behavior remains one RecipeSource path.
- Any no-bundle home change is knowingly authorized and owned rather than smuggled through the guide.
- Create-only safety is generic, backward compatible, separately reviewed/QA'd, and its quickstart coupling is explicit.
- The exact Journey and Journey Stage IDs are discoverable through backlinks from this request.
- Roadmap containment matches the approved ownership boundary.
- The guide can design content now without silently claiming built-in/default status.
- No Mike-side Task, Journey, Journey Stage, or Roadmap Item body/state is changed before approval.

# Reviewer response

**APPROVED by Brian Derfer on 2026-08-03.**

Brian explicitly decided that the built-in Recipe deferral does **not** cover `agentstate-guide`:
the guide explains AgentState Lite's existing functionality and therefore has a different intent
from speculative domain operating models. The durable rationale and boundaries are recorded in
[the guide-deferral decision](../decisions/agentstate-guide-outside-domain-recipe-deferral.md).

Items 1 and 3–8 are adopted as the review-revised technical plan: one early slice with separate
create-only safety, guide, and quickstart units; a narrow no-bundle-home follow-up; generic
backward-compatible create-only safety; the named quickstart/Journey/roadmap record updates; and
curriculum prototyping before implementation gates. Personal Task System, Product Manager, and all
other domain Recipes remain deferred.

[reviews task](../tasks/npm-quickstart-onboarding.md)

[reviews task](../tasks/product-recipe-discovery.md)

[reviews task](../tasks/init-target-safety-guard.md)

[reviews task](../tasks/guidance-bundle-onboarding.md)

[reviews roadmap item](../roadmap-items/distribution-neutral-resources.md)

[reviews roadmap item](../roadmap-items/recipe-plugins.md)
