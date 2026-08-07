---
type: Context Note
title: 'Main one-day compare: history is harmless, plugin regeneration is stale'
description: >-
  Explains why the compare lists 13 commits, identifies the two real main
  merges, and diagnoses the recurring post-merge bundle automation failure plus
  recommended recovery sequence.
tags:
  - git-history
  - ci
  - release
actor: codex-main-audit
timestamp: '2026-08-07T14:05:32.370Z'
---
# Summary

The one-day comparison contains two real first-parent merges and harmless preserved PR ancestry, but it also reveals a P1 post-merge automation regression: the committed plugin bundle has not regenerated since PR #195 because the standalone UI build omits view-runtime.

# Purpose and goals

Ultimate goal: make agentstate-lite shared, versioned, conflict-safe Markdown memory installable and usable by a human and agent fleet without founder intervention.

Proximate goal: distinguish harmless Git history expansion from actionable post-merge automation debt in the one-day `main@{1day}...main` comparison. This serves the ultimate goal by turning a noisy history view into explicit release and maintenance decisions.

# Commit-graph interpretation

The comparison resolves from `28cbf9139ec62f2ebeaf5b4ebb230911e4e72071` (merge of PR #209) to `458f44ae8b3ed0021997fb537eca356fb47dea1a` (merge of PR #211). GitHub reports 13 commits because it walks all commits reachable in the comparison, including feature-branch ancestry. First-parent `main` contains only two changes:

1. `dc341159a6478e8e8e5b43c3e7e71e0dc44cc105` — merge PR #210, hook ownership provenance hardening.
2. `458f44ae8b3ed0021997fb537eca356fb47dea1a` — merge PR #211, canonical `user` install-scope vocabulary.

PR #210 contributes ten listed branch commits: six substantive review/fix commits, one merge of then-current `main` into the feature branch, and three tree-identical empty commits used to retrigger CI during the GitHub Actions outage. PR #211 contributes one substantive branch commit. The two PR merge commits bring the visible total to thirteen. None are unexplained direct code pushes to `main`.

# History disposition

Do not revert, squash retroactively, or rewrite published `main`. The empty commits have no file diff and are harmless. For future work, squash-merge PRs if the desired public history is one commit per product change; exact-SHA review evidence remains attached to the PR and agentstate gate notes. Add `workflow_dispatch` to `ci-tests.yml` so a missing webhook-triggered run can be launched against an explicit branch without another empty commit.

# Actionable automation regression

Normal `CI tests` passed after PRs #210 and #211. The separate `CI version + bundle automation` failed after both, and has failed after every main merge since PR #196. The last success was run `30767486317` for PR #195 at source SHA `642189bf9bf04ac90e3bae15c263fa6d1a0cee51`; it produced plugin version `1.0.147` in commit `71f0776fbe1e8219a60bdd158d8782d33ef16023`.

The committed marketplace bundle still reports npm package `0.1.0-pre.2` and source commit `642189bf...`, so the legacy plugin channel has not absorbed PRs #196-#211 even though the source and ordinary CI are healthy.

Failure is deterministic in a clean checkout: `scripts/ci-version-bundle.mjs` calls `prepareCliBundleInputs()`; `embedUiAssets()` builds core and then the UI; the UI now imports `@agentstate-lite/view-runtime/action-bridge`, whose `dist/action-bridge.js` does not exist because the standalone path never builds `@agentstate-lite/view-runtime`. Root `npm run check` passes because the root build happens to build view-runtime first. This is a missing dependency-order contract in the self-sufficient regeneration path, not a GitHub outage or permissions failure.

# Recommended sequence

1. Merge PR #212 using squash merge if a clean main history is desired.
2. Treat the regeneration defect as the next P1 infrastructure fix: make the standalone embedded-UI preparation build every package whose `dist` the UI imports, explicitly including view-runtime, and add a clean-checkout regression that fails when any required dist is absent.
3. Merge that bounded fix. Its main-push automation checks out the current `main`, so one successful run should regenerate and version the plugin from the complete current source state; do not replay every historical failed run.
4. Verify the bot commit lands, both plugin manifests agree, and the committed bundle identity names the new source commit rather than `642189bf...`.
5. Add manual dispatch to `ci-tests.yml` as a separate small resilience change; optionally disable merge commits in repository settings if squash-only history is the chosen convention.

[prior dependency-order fix](../tasks/plugin-regeneration-dependency-order.md)
[npm quickstart](../tasks/npm-quickstart-onboarding.md)
[create-only predecessor](../tasks/init-target-safety-guard.md)
