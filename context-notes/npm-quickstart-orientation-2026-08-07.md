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
timestamp: '2026-08-07T00:23:44.737Z'
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

# Unverified assumptions to test before choosing an implementation

- Whether an existing installed-package harness can install the exact locally packed artifact into an isolated prefix/cache while exercising the same no-bundle output as a newcomer.
- Whether current bundle-free orientation already gives an actionable literal next command, or requires a bounded copy change.
- The exact literal command/output needed to create an attributed Task from the installed CLI without relying on repository-only helpers.
- Which existing headless surface is the smallest honest proof of visible productive state: home/status output, a registered View, or a browser launcher smoke.
- Whether the quickstart can remain independent of hook/skill installation and therefore avoid a semantic dependency on PR #211 beyond canonical wording.

# Working boundary and next gate

Use an isolated branch/worktree based on gated create-only SHA `81b3c39`. First inventory existing package and onboarding harnesses, then write one deterministic red acceptance journey before changing production copy or behavior. Do not touch PR #211 or the primary worktree. The builder checkpoint must later be reconciled onto merged `main`, independently reviewed, then sent to adversarial QA and the full package/repository/hosted gates before any PR handoff.

[tracks npm quickstart](../tasks/npm-quickstart-onboarding.md)
[depends on create-only safety](../tasks/init-target-safety-guard.md)
[onboarding plan](../plans/onboarding-surfaces.md)
