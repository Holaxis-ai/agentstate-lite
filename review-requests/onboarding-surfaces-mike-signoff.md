---
type: Review Request
title: 'Review: onboarding surface and task boundaries'
status: requested
reviewer: Michael Collier
requested_by: Brian Derfer
question: >-
  Approve the proposed one-journey/two-work-unit boundary and the limited
  updates to openai/codex-owned quickstart and Journey records?
actor: codex-onboarding-scope
timestamp: '2026-08-03T22:37:59.941Z'
---
# Context

The scoping handoff asked for one coherent plan across recipe discovery, npm quickstart, the guidance bundle, and the new-user Journey model. [The resulting plan](../plans/onboarding-surfaces.md) finds one user journey but only two remaining implementation units:

- the openai/codex-owned npm quickstart remains the installed-package `work-tracking` productivity proof;
- the Brian/Claude-owned guidance task becomes one explicit built-in `agentstate-guide` Recipe and learning workspace;
- product recipe discovery and launcher first-run orientation remain completed primitives; and
- the Journey/Journey Stage records remain the cross-lane experience and evidence map, not another build surface.

A current-state correction matters: [product recipe discovery](../tasks/product-recipe-discovery.md) is already done at PR #201 / merge `138a3c7` and is openai/codex-owned, although the handoff summarized it as todo/unowned. The plan therefore preserves it and expands the coordination boundary from two to three Mike-side records.

# Requested decision

Michael, please approve or request changes to the proposed boundary before anyone changes the openai/codex-owned quickstart or Journey records:

1. keep recipe discovery done and consume it as the generic seam;
2. keep Q6 quickstart independent of guide completion and focused on the installed npm → discovery/orientation → `work-tracking` → useful/visible state proof;
3. use the Journey model as the organizing/readiness frame, with desktop host setup treated as parallel lanes rather than a hard predecessor of shared learning; and
4. let the separate guidance task ship `agentstate-guide` through RecipeSource with no special command, silent install, wizard/acknowledgement, or Personal Task System dependency; and
5. after approval, add the missing typed Roadmap Item → Task `contains` edges from npm-first distribution to quickstart and guidance, and from product recipes to guidance.

Approval authorizes only the record clarifications described in the plan. It does not authorize product code, P5A/release changes, or retirement of a Mike-side task.

# Acceptance criteria

- The boundary matches the intent of PR #201 and [its recipe-to-guide handoff](../context-notes/recipe-discovery-guidance-bundle.md).
- Q6 remains consistent with Q6 in [the version/update plan](../plans/version-string-channel-identity.md) and [the built-in recipe deferral](../decisions/defer-builtin-recipes.md).
- Journey records track evidence/readiness without duplicating implementation tasks.
- The declared Roadmap Item → Task containment graph matches the approved ownership boundary.
- Ownership and next actions are unambiguous, and no Mike-side record is merged, retired, or rewritten before this request is approved.

# Reviewer response

Pending Michael Collier. Record approval or requested changes in this document's lifecycle fields and summarize any boundary changes here.

[reviews task](../tasks/npm-quickstart-onboarding.md)

[reviews task](../tasks/product-recipe-discovery.md)

[reviews roadmap item](../roadmap-items/distribution-neutral-resources.md)

[reviews roadmap item](../roadmap-items/recipe-plugins.md)
