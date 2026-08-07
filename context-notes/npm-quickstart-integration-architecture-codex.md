---
type: Context Note
title: npm quickstart integration architecture review
description: >-
  Exact nine-file reconciliation plan preserving PR #211 user scope and PR #212
  production-lock/no-delete/source-identity proof.
actor: codex-quickstart-integration-architect
timestamp: '2026-08-07T17:44:13.966Z'
---
# Summary

APPROVE_REVISED_PLAN. The acceptance critique identifies four real contract defects in checkpoint `6e2cfaa`, not optional copy refinements. Source inspection confirms that `init --create-only` defaults to the current directory and explicitly rejects a non-empty target, while the checkpoint advertises that command from ordinary bundle-free project roots. It also emits `create_bundle` for an already-open local bundle, where the same target is guaranteed to fail. Builder should rebase the checkpoint, add the corrections below within the same nine-file boundary, then enter exact-SHA Review and adversarial QA.

# Goal alignment

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: integrate a truthful installed npm first-value journey that works in a normal non-empty project while retaining the merged install-vocabulary and create-only safety contracts. This serves the ultimate goal by making the front door executable without target, version-channel, or attribution traps.

# Revised behavior contract

1. Both public READMEs use the supported default package, unqualified: `npm install -g @holaxis/aslite`. A one-command trial may use unqualified `npx -y @holaxis/aslite`, but the productive journey installs once and then runs one `aslite` chain. No multi-command `@next` workflow survives.
2. Every public and installed-proof integration command uses canonical `--scope user`. The package verifier's relocated-home skill block must exercise `user`, not the compatibility spelling `global`; alias coverage remains in its owning command tests.
3. Bundle-free home and Recipe inventory advertise a genuinely new conventional target: `--dir .agentstate-lite`. For an explicit no-bundle project directory, home appends the conventional child (`<selected>/.agentstate-lite`) rather than proposing adoption of the project root. Reuse exported `CONVENTIONAL_BUNDLE_DIR_NAME`; do not fork the literal policy.
4. Recipe command projection is state-aware: `applied === null` (bundle-free local inventory) gets `create_bundle` plus `add_to_bundle`, both explicitly targeting `.agentstate-lite`; `applied !== null` (existing local bundle) gets only actionable `add_to_bundle`; remote remains add-only. The top-level help follows the same table.
5. The deterministic example may retain `--actor quickstart-agent`, but both READMEs explicitly label it an advisory tutorial value to replace with the actual agent identity.
6. The installed proof executes the exact emitted `work-tracking.commands.create_bundle` string from a non-empty bundle-free project containing an unrelated marker. Home/recipes must leave the marker/tree unchanged; the emitted command creates only `.agentstate-lite`; its retry exits 5 and byte-preserves the whole project tree. The same exact installed entrypoint then creates/reads/lists the attributed Task and proves productive home/kind-clean status.
7. The quickstart composes with, and never replaces, PR #212's installed real-lock holder/contender barrier, pre-release no-publication assertion, no-delete refusal snapshot, retained-tarball route, source/artifact identity, package allowlist, and plugin/marketplace integrity checks.

# File-level reconciliation

- `README.md`: retain PR #211's `--scope user`; switch default install and one-command trial from `@next` to unqualified package; keep the direct create-only Task journey; explain the actor label.
- `packages/cli/README.md`: remove the repeated mutable-tag `npx` chain. Install the unqualified package once, run the same `aslite` chain, retain `--scope user`, and explain the actor label. An optional single unqualified npx orientation command may remain.
- `packages/cli/src/commands/home.ts`: for the no-binding/no-board/no-bundle branch, always project a conventional child target using `CONVENTIONAL_BUNDLE_DIR_NAME`; preserve broken-binding recovery and first-contact suppression unchanged.
- `packages/cli/test/home.test.ts`: pin the bare `.agentstate-lite` target, explicit project-directory child target, Recipe discovery, and binding/board non-regressions.
- `packages/cli/src/commands/recipes.ts`: implement the three-state projection table (bundle-free local / existing local / remote) and conventional target; no second recipe or target-selection authority.
- `packages/cli/test/recipes.test.ts`: red-pin no-bundle conventional commands/help, omission of `create_bundle` for existing bundles regardless of applied true/false, and remote add-only behavior.
- `packages/cli/test/update-orientation.test.ts`: update exact current home bytes and baseline naming while retaining PR #211's `--scope user` expectations and update-notice placement contract.
- `scripts/verify-npm-package.mjs`: start from current main, not the checkpoint file. Preserve every PR #212 block; add a non-empty discovery marker, execute the emitted create string character-for-character, verify target/retry/tree integrity, continue the Task/home/status journey, use `--scope user` in relocated-home integration proof, inspect installed README, and emit the named quickstart receipt.
- `scripts/verify-npm-package.test.mjs`: retain the production-lock static contract; add the README/default-package/actor contract. It should reject default `@next` and public `--scope global` without banning explanatory preview/compatibility prose outside commands.

No tenth file is justified. Generated Skill/reference content, install mechanics, release workflows/tags, guide curriculum, marketplace retirement, and unrelated product surfaces remain out of scope.

# Red/green and delivery gate

1. Rebase the one checkpoint commit onto exact `531c9df8ac7299f662d87862d270c7eb63f7dfab`; transplant quickstart hunks onto current-main verifier files rather than accepting stale whole files.
2. Before implementation, prove checkpoint-red cases: emitted bare create fails in a non-empty project; existing local rows contain dead `create_bundle`; READMEs default to `@next`; public copy leaves `quickstart-agent` unexplained.
3. Focused green: home/recipes projection tests, exact update-orientation home bytes, README/static script contracts.
4. Build/typecheck and exact installed `npm run verify:npm-package` pass; its receipt names the continuous quickstart and its existing production-lock markers prove the real installed lock was exercised.
5. Full `npm run check`, `git diff --check`, and clean exact-SHA worktree.
6. Independent Review audits the five semantic-overlap files and samples the emitted-command regression red against `6e2cfaa`.
7. Adversarial QA executes the documented chain from the installed tarball in a non-empty project, verifies no-write discovery, conventional-only creation, exact retry preservation, existing/remote omission, actual-agent-label guidance, installed identity, and production-lock behavior. Live registry installation remains a later post-publication proof.

# Risks and guardrails

- Whole-file conflict resolution can silently delete PR #212's production-lock or identity proof; the retained static test plus hunk-wise review is mandatory.
- Merely adding `--create-only` without a new target makes the common project-root command less useful, not safer; `.agentstate-lite` is part of the executable contract.
- Omitting dead `create_bundle` based on `applied` must distinguish `null` (no bundle) from both booleans (bundle exists); truthiness would incorrectly treat `false` as bundle-free.
- Regex-only documentation checks do not prove the journey. The package verifier must execute the emitted command string from the installed artifact.

[acceptance critique](npm-quickstart-integration-acceptance-codex.md)
[task](../tasks/npm-quickstart-onboarding.md)
[integration reorientation](npm-quickstart-integration-reorientation-2026-08-07.md)
[implementation plan](../plans/npm-quickstart-implementation-2026-08-07.md)
[create-only predecessor](../tasks/init-target-safety-guard.md)
