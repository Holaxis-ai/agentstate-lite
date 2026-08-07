---
type: Context Note
title: npm quickstart integration reorientation
description: >-
  PR #211/#212 dependencies are merged; freeze current-main reconciliation
  invariants before resuming the parked quickstart checkpoint.
actor: codex-npm-quickstart-orchestrator
timestamp: '2026-08-07T17:35:14.640Z'
---
# Summary

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: integrate the tested npm first-value journey onto current `main`, preserving the now-merged install-vocabulary and create-only safety contracts, then pass independent Review and adversarial QA before opening its PR. This serves the ultimate goal by converting a clean package install into productive, correctly attributed bundle state without founder explanation.

## Current state

- Remote branch `feat/npm-quickstart-onboarding` is clean at builder checkpoint `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef` (`feat(cli): prove the installed npm quickstart`).
- The commit is one unique commit based on `81b3c39ff252013e318b1a714b63430a24074d70`; the branch is now 18 commits behind `main` and GitHub reports it as diverged.
- The checkpoint changes nine files (150 additions, 54 deletions): root/npm README quickstarts, no-bundle home/Recipe projections and tests, and the installed-package verifier/static contract.
- The original gates were green on the old base, but they are not integration evidence for a rebased SHA.

## Dependency transition

Both deliberate blockers are now satisfied:

- PR #211 merged as `458f44ae8b3ed0021997fb537eca356fb47dea1a`, establishing canonical public `--scope user` vocabulary with `global` only as a compatibility alias.
- PR #212 merged as `531c9df8ac7299f662d87862d270c7eb63f7dfab`, carrying final reviewed create-only arbitration/safety through head `aec2dadbe186fe284c3e64a2a568269ef4bacd12`.

## Integration model and invariants

The branch is not a new onboarding subsystem. It composes existing surfaces into one installed-artifact journey: bundle-free home -> Recipe inventory -> `init --create-only --recipe work-tracking` -> attributed Task -> doc/list/home/status proof.

The rebase must preserve:

1. PR #211's `user` scope in every install command and expectation.
2. PR #212's final no-delete, strict observation, production-lock barrier, source identity, and installed-package verification coverage.
3. The quickstart's separation of safe new-bundle creation (`init --create-only`) from modification (`recipe add`).
4. One literal README/verifier command chain and explicit agent-driven authoring handoff.
5. No guide curriculum, release automation, update-selection, marketplace retirement, hook/skill behavior, or unrelated product change.

Likely semantic overlap is concentrated in both READMEs, `packages/cli/test/update-orientation.test.ts`, and the two package-verifier files. Home/Recipe source and focused tests appear mechanically additive but still require exact post-rebase proof.

## Unverified assumptions before implementation

- Whether rebasing the single checkpoint commit produces textual conflicts or only semantic overlap.
- Whether the package verifier can retain PR #212's deterministic production-lock barrier while composing the quickstart without duplicating or weakening coverage.
- Whether the current public install/quickstart tag wording remains coherent after the temporary npm `latest`/`next` alignment; this is a copy decision only if the rebased diff already owns the relevant lines.
- Whether the nine-file boundary remains sufficient after reconciliation.

## Required delivery gate

Plan/acceptance review -> isolated Builder rebase/reconciliation with red/green evidence -> independent exact-SHA Review -> fresh adversarial installed-journey QA -> full repository/package gates -> push and open PR. Any code change after Review restarts the exact-SHA gate.

[governing task](../tasks/npm-quickstart-onboarding.md)
[implementation plan](../plans/npm-quickstart-implementation-2026-08-07.md)
[create-only predecessor](../tasks/init-target-safety-guard.md)
