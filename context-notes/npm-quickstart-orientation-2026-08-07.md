---
type: Context Note
title: npm quickstart orientation and dependency boundary
description: >-
  Claims the literal installed-package first-value journey while isolating gated
  create-only safety from PR #211's independent vocabulary review.
tags:
  - npm
  - installation
  - onboarding
actor: codex-npm-quickstart
timestamp: '2026-08-07T01:00:32.849Z'
---
# Summary

The literal installed npm quickstart has reached a pushed builder checkpoint on `feat/npm-quickstart-onboarding` at exact SHA `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef`. The bounded nine-file change and the full local repository gate are green. It is not yet review-ready because the create-only predecessor must merge and PR #211's reviewed install-scope vocabulary must be reconciled first.

# Purpose and current goal

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: make a clean npm install lead deterministically from bundle-free orientation through Recipe discovery and safe `work-tracking` initialization to one attributed Task and visible productive state. This serves the ultimate goal by turning package availability into first value without founder explanation.

# Current system model

The quickstart is an end-to-end contract across existing components, not a new onboarding subsystem:

1. The exact packed npm artifact supplies the self-contained `aslite` executable.
2. Bare `home` outside a bundle supplies no-bundle orientation and routes to Recipe discovery.
3. `recipes` distinguishes safe new-bundle creation (`init --create-only`) from existing-bundle modification (`recipe add`).
4. `init --create-only --recipe work-tracking` owns fail-closed creation of a genuinely new workspace.
5. The shipped `work-tracking` Kind makes an attributed Task deterministic, and home/status expose that Task as useful state.
6. Root and npm README copy explain the contribution model: the human supplies intent/source material; an agent organizes, types, links, and updates the bundle through CLI primitives.

# Builder outcome

- Branch: `feat/npm-quickstart-onboarding`
- Exact SHA: `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef`
- Base: gated create-only SHA `81b3c39ff252013e318b1a714b63430a24074d70`
- Scope: nine files; home/recipes guidance, their focused/golden tests, both Quickstart sections, and the existing package verifier plus its static README contract test.
- The installed verifier now executes one continuous journey: no-bundle home → Recipe inventory → safe work-tracking initialization → attributed Task → doc/list/home/status proof. Failed create-only retry remains byte-preserving.
- No hook/skill install behavior, release mechanics, browser onboarding subsystem, PR #211 branch, or marketplace code is included.

# Test evidence

- Focused `home.test.ts` + `recipes.test.ts`: 80/80 pass.
- Exact home-output regression: 1/1 pass after updating the intentional safe command.
- CLI workspace: 1,299/1,299 pass.
- `npm run typecheck`, `npm run test:scripts`, and `npm run verify:npm-package`: pass.
- Final `npm run check` outside the network-restricted sandbox: exit 0, including package, browser, and 19/19 E2E tests.
- `git diff --check`: pass; post-gate worktree contained only the intended nine files before commit and is clean after commit.

# Runner diagnostic retained for future sessions

The composite CLI stage starts many ephemeral localhost servers across remote, web, MCP, and UI tests. Running that gate inside a network-disabled command sandbox produces a broad fast-failing server cluster and may leave a UI test child holding an open handle. The invariant is to run the full gate where loopback bind/connect is permitted and judge its terminal exit code. That environmental failure did not reproduce outside the sandbox.

# Dependency and ownership boundary

- `tasks/init-target-safety-guard` is fully gated at `81b3c39ff252013e318b1a714b63430a24074d70`, but its branch `feat/init-create-only` still needs Brian's PR/merge. This quickstart cannot rebase onto `main` until that lands.
- PR #211 independently owns canonical `user` install-scope vocabulary and has a user-assigned review team. Do not touch or duplicate that work. Reconcile its merged result before independent review of this branch.
- Release staging, old-to-new upgrades, marketplace retirement, and guide curriculum remain outside this task.

# Next gate

Wait for the two integration dependencies, rebase/reconcile onto their merged `main`, rerun the focused/package/full gates if the SHA changes, then hand the exact SHA to an independent reviewer. Adversarial installed-journey QA remains a required gate after Review and before Brian opens or merges a PR.

[tracks npm quickstart](../tasks/npm-quickstart-onboarding.md)
[depends on create-only safety](../tasks/init-target-safety-guard.md)
[onboarding plan](../plans/onboarding-surfaces.md)
[implementation plan](../plans/npm-quickstart-implementation-2026-08-07.md)
