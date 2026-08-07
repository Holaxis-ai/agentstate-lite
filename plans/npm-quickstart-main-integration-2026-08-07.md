---
type: Plan
title: 'Plan: integrate the installed npm quickstart onto current main'
description: >-
  Reviewed current-main reconciliation plan: executable .agentstate-lite
  targeting, default npm channel, Recipe state matrix, and preserved PR
  #211/#212 contracts.
actor: codex-npm-quickstart-orchestrator
timestamp: '2026-08-07T17:45:02.327Z'
---
# Goal

Ultimate goal: make agentstate-lite the shared, versioned, conflict-safe Markdown memory that a human and agent fleet can install and use without founder intervention.

Proximate goal: integrate the installed npm first-value journey onto current `main` so a normal non-empty project can follow emitted guidance into a safe conventional bundle, create one honestly attributed Task, and see useful state. This serves the ultimate goal by making first value executable without founder explanation.

## Frozen product contract

One installed artifact owns the journey:

1. Install the supported default once with `npm install -g @holaxis/aslite`.
2. From a bundle-free, non-empty project, run `aslite` and `aslite recipes`; neither command writes project state.
3. New-bundle guidance targets the genuinely new conventional path `.agentstate-lite` and uses `init --create-only --recipe <name>`.
4. `work-tracking` initialization creates that bundle directly; it does not create a blank bundle and retrofit the Recipe.
5. Create a Task with `--actor quickstart-agent`; public copy labels that value as an advisory example to replace with the actual agent identity.
6. `doc read`, `list`, home, and status prove attribution, discoverability, visible useful state, and zero kind warnings.

The default quickstart does not teach `@next`. `latest` and `next` currently resolve the same prerelease, but the ratified contract gives `latest` supported-default meaning and reserves `next` for preview meaning. An unqualified one-command `npx -y @holaxis/aslite ...` may be mentioned only as a labeled trial, not used as a multi-command workflow.

## Recipe command state matrix

| Selection state | `create_bundle` | `add_to_bundle` |
|---|---|---|
| Local, no bundle | `init --create-only --recipe <name> --dir '.agentstate-lite'` | present for later use |
| Local existing bundle, applied false/true | omitted | present, targeting the selected/discovered bundle |
| Remote existing bundle | omitted | present with `--remote` |

Only `applied === null` means bundle-free. Both boolean states mean an existing bundle and must never advertise a same-target create-only command guaranteed to fail.

Home follows the same targeting rule: without an explicit target, its no-bundle hint names `.agentstate-lite`; an explicit advanced target remains explicit. Binding-recovery and board-first-contact behavior remain unchanged.

## Integration constraints

- Replay checkpoint `6e2cfaa239458dbaffe2ba87f6e30d5211b67eef` onto exact current main `531c9df8ac7299f662d87862d270c7eb63f7dfab` hunk-wise; current main is authoritative.
- Preserve PR #211's canonical public `--scope user` vocabulary. `global` remains only deliberate compatibility coverage.
- Preserve PR #212's installed-entrypoint identity, no-delete/refusal snapshot, real production-lock preload/barrier, same-lock-path `EEXIST`, loser exit 5, pre-release non-publication, and nested-publication exclusion.
- Remain within the existing nine-file quickstart boundary: both READMEs; home/recipes source and tests; update-orientation golden test; package verifier and static verifier test.
- Do not add guide curriculum, release automation, live publishing, update-selection, marketplace retirement, hook/skill behavior, or new product surfaces.

## Builder units and red/green evidence

1. Rebase the branch in its isolated worktree and verify the nine-file diff/range-diff.
2. Red-pin checkpoint defects before green implementation:
   - a non-empty, bundle-free project receives a cwd-target create-only command that refuses;
   - an existing local bundle row exposes a dead same-target `create_bundle` command;
   - public quickstarts use `@next` and do not explain the tutorial actor.
3. Implement the frozen home/Recipe state table and README corrections.
4. Compose the quickstart into the current-main installed verifier without replacing any PR #212 oracle. Use a non-empty quickstart project and its `.agentstate-lite` child; preserve unrelated bytes across discovery and refused retry.
5. Run focused home/Recipe/update-output tests, script contract tests, build/typecheck, exact installed-package proof, and `git diff --check`; commit one current-main integration correction after the rebased checkpoint.

## Roles and hard gates

1. Architecture and acceptance review: complete; revised plan approved after one refinement cycle.
2. Builder: rebase and implement in `/private/tmp/aslite-npm-quickstart.20260807`; no push or PR until later gates.
3. Independent Reviewer: inspect the exact clean Builder SHA, audit all five semantic overlaps, probe at least one checkpoint defect red, and return APPROVE or findings. No edits.
4. Adversarial QA: only after Review approval, use a fresh detached worktree and execute the emitted/documented chain from the exact installed tarball in a non-empty project. Attack discovery writes, retry preservation, recipe row state, attribution, productive state, production-lock ordering, package identity, and default/scope wording. No edits.
5. Orchestrator: run/confirm unrestricted full `npm run check`, push with lease to the feature branch, open the PR, verify hosted Node 20/22/26 on the exact SHA, and post evidence. Do not merge.

Any code change after Review or QA restarts the exact-SHA gate.

## Merge-ready definition

- The branch is rebased onto current main and contains only the nine-file quickstart unit.
- Emitted no-bundle commands work from a non-empty project and target `.agentstate-lite`.
- Existing local and remote Recipe rows are add-only; only bundle-free local rows expose creation.
- Both READMEs use unqualified default installation, preserve `--scope user`, and explain the advisory actor example and agent-driven authoring handoff.
- The exact installed artifact completes the literal journey while all PR #212 package/safety proofs remain green.
- Independent Review and subsequent adversarial QA approve the exact SHA; full local and hosted gates pass.

[governing task](../tasks/npm-quickstart-onboarding.md)
[integration reorientation](../context-notes/npm-quickstart-integration-reorientation-2026-08-07.md)
[architecture review](../context-notes/npm-quickstart-integration-architecture-codex.md)
[acceptance critique](../context-notes/npm-quickstart-integration-acceptance-codex.md)
[create-only predecessor](../tasks/init-target-safety-guard.md)
