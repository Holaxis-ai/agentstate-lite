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
timestamp: '2026-08-07T00:49:20.590Z'
---
# Summary

The next npm/installation/UX unit is the literal npm quickstart. It can begin on the independently gated create-only SHA while its integration and PR #211's vocabulary review remain explicit pre-review dependencies.

# Purpose and current goal

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: make a clean npm install lead deterministically from bundle-free orientation through Recipe discovery and safe `work-tracking` initialization to one attributed Task and visible productive state. This serves the ultimate goal by turning package availability into first value without founder explanation.

# Current system model

The quickstart is an end-to-end product contract across six existing components rather than a new onboarding subsystem:

1. The exact npm artifact supplies the self-contained `aslite` executable.
2. Bare invocation/home outside a bundle supplies bundle-free orientation and Recipe inventory.
3. `init --create-only --recipe work-tracking` owns fail-closed creation of a genuinely new workspace.
4. The shipped `work-tracking` Kind makes attributed Task creation deterministic.
5. Status/home and the existing launcher expose non-empty, useful state.
6. User-facing copy must explicitly explain the contribution model: the human supplies intent/source material; an agent organizes, types, links, and updates the bundle through CLI primitives.

The feedback loop must therefore exercise the packed/installed CLI as one literal journey, not substitute source-level unit tests or separate component probes for the user contract.

# Dependency and ownership boundary

- `tasks/init-target-safety-guard` completed builder, five-round exact-SHA review, adversarial QA, installed-package proof, and full `npm run check` at `81b3c39ff252013e318b1a714b63430a24074d70`. Its branch `feat/init-create-only` is pushed and clean but has no PR and is not merged. The quickstart may build from this gated SHA, but final integration must follow its Brian-owned PR/merge.
- PR #211 owns canonical `user` install-scope vocabulary at `742af48ee353a7f4bd68d33e588ac23401b6fde0` and has a separate assigned review team. This work must not modify that branch or duplicate its review. Final quickstart wording and fixtures must reconcile the merged outcome before independent review.
- `@holaxis/aslite@0.1.0-pre.3` is currently both `latest` and `next`; a clean unqualified registry install has already been verified. Release staging, upgrade selection, marketplace retirement, and guide curriculum remain outside this task.

# Assumptions resolved by the builder

- The existing installed-package verifier can own the literal clean-directory journey; no second onboarding harness is needed.
- Bundle-free `home` and `recipes` need only bounded command-copy changes to teach fail-closed creation.
- The installed CLI can initialize `work-tracking`, create an attributed Task, and expose it through `home` without hook or skill installation.
- The npm package README is the correct place to explain the human-intent/agent-authoring model; browser UI work is outside this unit.

# Full-suite runner boundary diagnosed 2026-08-07

`npm run check` is a composite runner. Its CLI stage starts many ephemeral localhost HTTP servers across remote, web, MCP, and UI test files using Node's process-isolated test runner and default parallelism. A run launched inside the command sandbox had local networking disabled. Server-dependent assertions therefore failed almost immediately, while local CLI, quickstart, package, script, and typecheck paths passed. One `ui.test.ts` child retained an open server handle, preventing the parent from emitting the final TAP summary until the captured run was interrupted.

The invariant is: the full repository gate must run in an environment that permits loopback bind/connect and must be judged by its terminal exit code, not partial TAP output. The next action is one full rerun outside the network-restricted sandbox. Product code must not be changed in response to the sandbox-only cluster unless a failing test reproduces there.

# Working boundary and next gate

The bounded builder diff remains limited to the existing home/recipes guidance, both READMEs, focused assertions, and the existing installed-package verifier. Do not touch PR #211 or the primary worktree. After the full gate, commit and push the builder checkpoint from the isolated branch. Final integration still depends on the create-only predecessor and PR #211 outcome, followed by independent exact-SHA review and adversarial QA.

[tracks npm quickstart](../tasks/npm-quickstart-onboarding.md)
[depends on create-only safety](../tasks/init-target-safety-guard.md)
[onboarding plan](../plans/onboarding-surfaces.md)
