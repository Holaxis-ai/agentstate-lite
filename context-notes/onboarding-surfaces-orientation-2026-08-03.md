---
type: Context Note
title: Onboarding surfaces scoping orientation and system model
actor: codex-onboarding-scope
timestamp: '2026-08-03T22:38:13.079Z'
---
# Summary

## Ultimate goal

Make agentstate-lite the shared, versioned, conflict-safe markdown memory for one human and their agent fleet: plain text, local-first, human-readable, with operational discipline encoded in the harness.

## Proximate goal and result

Reconcile the overlapping onboarding records into one sequenced, de-duplicated surface plan so newcomers reach recurring value without parallel or contradictory mechanisms. This goal is complete: [plans/onboarding-surfaces](../plans/onboarding-surfaces.md) records one user journey, two shipped primitives, two distinct pending work units, and one non-task Journey model.

## Validated system model

- Bundle-free discovery is already shipped in tasks/product-recipe-discovery (PR #201, merge 138a3c7), owned/assigned to openai/codex. The original handoff's todo/unowned summary was stale.
- A direct empty-directory probe of the current built CLI confirmed bare aslite points to recipes and blank init, aslite recipes lists actionable built-ins with applied:null, and neither command creates a bundle.
- The missing teaching artifact should be agentstate-guide, a built-in data-free Recipe materialized explicitly as a standalone learning workspace. It reuses the existing RecipeSource, launcher, and View model.
- The npm quickstart remains a separate installed-package work-tracking productivity proof and is not blocked by guide completion.
- Journey/Journey Stage docs are the cross-lane experience/evidence map, not another runtime surface or implementation task. Desktop setup lanes do not need to block the terminal/local-web learning path.
- The one-time wizard/acknowledgement idea is excluded from v1 because designs/user-notices shows stable per-person identity is its real prerequisite. The guide remains persistent and reopenable without hidden state.
- The built-in domain-recipe deferral remains intact: a product guide teaches shipped primitives and does not guess a user's operating model.

## Records written

- Created plans/onboarding-surfaces.
- Re-scoped the Brian-owned tasks/guidance-bundle-onboarding in place; status todo P2, assignee brian-claude.
- Created review-requests/onboarding-surfaces-mike-signoff for Michael Collier and linked it to both Mike-side tasks and both roadmap umbrellas.
- Marked tasks/onboarding-surface-scoping done with a completion summary.
- Left openai/codex-owned quickstart, recipe-discovery, Journey, Journey Stage, and Roadmap Item bodies/states unchanged.

## Validation

Bundle status reports the new Plan, Review Request, Task update, and Context Note with no new unresolved links, malformed docs, kind warnings, or link-type violations. The existing lint also reveals missing Roadmap Item → Task contains edges for both pending onboarding tasks; the plan and review request record those as post-approval graph repairs. The code worktree is clean. No product code, P5A, release, update, deployment, or marketplace work was touched.

## Next action

Michael Collier reviews review-requests/onboarding-surfaces-mike-signoff. If approved, update the openai/codex-owned quickstart/Journey wording and add the three typed roadmap containment edges described in the plan. Then the quickstart and guide work units may proceed independently under their own plans and review gates.
