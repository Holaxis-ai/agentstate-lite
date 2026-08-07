---
type: Plan
title: 'Plan: literal installed npm quickstart'
description: >-
  Original checkpoint plan; current-main integration is superseded and refined
  by plans/npm-quickstart-main-integration-2026-08-07 after merged PR #211/#212
  reconciliation review.
actor: codex-npm-quickstart-orchestrator
timestamp: '2026-08-07T17:45:02.334Z'
---
# Goal

Prove one literal first-value journey from an exact installed npm artifact: bundle-free orientation and Recipe discovery → fail-closed creation of a `work-tracking` workspace → attributed Task creation → useful visible state → an explicit explanation that ongoing authoring is agent-driven.

# Domain model

- **Installed artifact:** the exact tarball installed into an isolated prefix, cache, home, and PATH by `scripts/verify-npm-package.mjs`.
- **Discovery directory:** an empty directory in which home and Recipe inventory must orient without creating files.
- **Create command:** a command advertised specifically for making a new workspace; it must use `init --create-only`, while `recipe add` remains the separate existing-bundle action.
- **Productive workspace:** a newly created bundle with the shipped `work-tracking` recipe and one valid `Task` carrying an explicit advisory actor.
- **Visible state:** installed-CLI `home`/list output that names the created Task and remains kind-lint clean; a browser or new View is not required to prove this quick path.
- **Authoring model:** the human supplies source material or intent through their preferred agent surface; the agent organizes, types, links, and updates the bundle through CLI primitives. The commands are plumbing, not a manual data-entry prescription.

# Acceptance criteria

1. Bundle-free `home --json` identifies the installed artifact, recommends Recipe discovery, and only advertises fail-closed `init --create-only` for a new unbound target.
2. Bundle-free and local-target `recipes --json` advertise `init --create-only --recipe <name>` as `create_bundle`; `add_to_bundle` remains `recipe add`.
3. The installed-package verifier uses one new target and runs `init --create-only --recipe work-tracking` directly rather than creating a blank bundle and retrofitting the Recipe.
4. The installed CLI creates a valid Task with `--actor quickstart-agent`; `doc read` proves attribution and `list` proves discovery.
5. Installed-CLI home/status output proves non-empty useful state and zero kind warnings.
6. Recipe discovery and failed create-only trials remain no-write/byte-preserving as already gated by the predecessor; the quickstart preserves those assertions.
7. Root and npm-package Quickstart copy contain literal current commands and explicitly explain the agent-driven authoring handoff.
8. The package verifier checks the installed README and returns a named `quickstart` workflow receipt so the contract cannot silently regress into disconnected component probes.

# Implementation units

1. Red-pin safe no-bundle home and Recipe command projections in focused unit tests.
2. Change only unbound new-workspace guidance to `--create-only`; preserve binding-recovery, remote, and existing-bundle semantics.
3. Recompose the existing installed-package workflow into the literal quickstart and add attribution/home/status/doc assertions.
4. Rewrite the bounded Quickstart sections in the root and package READMEs; avoid PR #211-owned scope vocabulary until its reviewed result is rebased.
5. Run focused tests, build, the complete installed-package proof, generated-skill drift checks if touched, and worktree integrity checks.

# Dependencies and gates

- Builder base: independently gated create-only SHA `81b3c39ff252013e318b1a714b63430a24074d70`.
- Integration dependency: create-only PR must merge before this branch can be reviewed as a standalone `main` change.
- Wording dependency: rebase/reconcile PR #211's canonical `user` vocabulary before exact-SHA review; do not edit its branch.
- Required delivery chain: Builder → independent exact-SHA Review → adversarial installed-journey QA → full `npm run check`/package/hosted CI → Brian-owned PR/merge.

[implements](../tasks/npm-quickstart-onboarding.md)
[uses create-only safety](../tasks/init-target-safety-guard.md)
[follows onboarding boundary](onboarding-surfaces.md)
