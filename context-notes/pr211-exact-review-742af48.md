---
type: Context Note
title: PR 211 exact-SHA review at 742af48
description: >-
  PASS: no findings; exact head and the prospective merge with current main
  passed focused, adversarial, packaged, browser, and full repository gates.
actor: codex-pr211-reviewer
timestamp: '2026-08-07T00:31:11.756Z'
---
# Summary

Independent review of PR #211 at exact head `742af48ee353a7f4bd68d33e588ac23401b6fde0` found no blocking or non-blocking code defects.

The PR was originally based on `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071`. Current `main` is `dc341159a6478e8e8e5b43c3e7e71e0dc44cc105` after PR #210. Because both changes touch hook source and tests, the review also constructed and gated the clean prospective merge tree rather than relying only on the PR's older-base CI.

## Goals and outcome

- Ultimate goal: keep AgentState Lite a plain-text, local-first knowledge substrate whose CLI reduces avoidable onboarding friction without creating ambiguous behavior.
- Proximate goal: prove that `user` is the single public per-user installation vocabulary while `global` remains a behaviorally identical compatibility input across skill/hook lifecycle operations, receipts, help, and target selection.
- Outcome: achieved for the reviewed tree. The shared normalizer maps missing/project to `project`, maps user/global to `user`, rejects other values, and both command families derive targets and receipts from the normalized value.

## Verdict

PASS — no findings. PR #211 is technically merge-ready.

A rebase is not required for correctness: GitHub reports a clean merge and the exact prospective merge tree passed the full repository gate. Rebasing remains optional for cleaner hosted-CI provenance; any rebase changes the head SHA and therefore requires a short exact-SHA confirmation review.

## Evidence

- Exact PR head remained `742af48ee353a7f4bd68d33e588ac23401b6fde0` at verdict time.
- Complete base-to-head diff and public vocabulary audit reviewed.
- `git diff --check` passed.
- Exact-head focused suite: 150/150 passed.
- Prospective merge with current main completed without conflicts.
- Prospective-merge focused suite: 156/156 passed, including PR #210's hook ownership regressions.
- Independent built-CLI matrix: 18 lifecycle receipts across skill/hook, project/user/global, install/status/uninstall; all normalized correctly. Eight malformed/case/whitespace scope inputs failed with USAGE. Help surfaces teach `project|user` and identify `global` only as an alias.
- Full `npm run check` passed on the prospective merge tree, including build, typecheck, all workspace tests, script tests, local installed-package verification, generated Skill check, browser tests, and UI E2E.
- Hosted PR checks passed on Node 20, 22, and 26 against the original base.
- The committed plugin Skill/bundle still uses the old vocabulary on the PR branch by design; repository policy makes those generated artifacts bot-owned on merge, and the full gate's real regeneration/convergence proof passed.

## Next state

Keep the task in progress until Brian merges PR #211. If the branch is rebased or otherwise changes, repeat the short exact-SHA confirmation before merge.

[task](../tasks/user-scope-install-vocabulary.md)

[review start](pr211-review-start-742af48.md)
