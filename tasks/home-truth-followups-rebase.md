---
type: Task
title: Deliver Home truth fixes on current main
status: done
priority: high
assignee: codex-main-home-truth-rebase
actor: codex-main-home-truth-rebase
timestamp: '2026-07-23T15:26:31.479Z'
---
# Goal

Rebase the already-reviewed Home truth fixes onto current origin/main, resolve integration conflicts without behavioral drift, pass the repository gate and independent exact-SHA review, and safely update the existing remote feature branch.

This serves the product goal by moving three correctness fixes into an integration-ready state while preserving the human merge gate.

# Delivery invariants

- Remote mode never renders local-only privacy onboarding, even with a non-null root.
- Git-only sharing changes are observed through bounded server-owned refresh timing without hosted polling.
- Failed Git discovery reports unavailable while a true non-repository remains private.
- Existing current-main behavior is preserved through conflict resolution.
- Update the existing branch with force-with-lease; do not create or merge a PR.

# Outcome

Completed. Branch fix/home-truth-followups was rebased onto origin/main f15bfac1d1f5915813287b4b3738a077f7cbc4ac and safely force-updated from 6418972c1f4225dae7034708496090f51e5e359d to e9257f8e69a94d013159478809fa56244654c003 with an explicit force-with-lease.

The only textual conflict was packages/ui/src/views/Launcher.test.tsx. Its resolution retained current-main BRIDGE_BADGES coverage alongside the feature's sharing refresh exports. Range-diff showed no other adaptation, and the final diff remains the intended eight files.

# Verification

- Fresh npm ci, root build, and typecheck passed.
- Focused UI integration 35 of 35, CLI sharing 15 of 15, ui-server config 4 of 4, and board-git porcelain 67 of 67 passed.
- Elevated unpiped npm run check exited 0, including 18 of 18 Playwright tests.
- Independent exact-SHA Review: PASS, high confidence, no issues.
- Final main freshness check confirmed origin/main was still f15bfac and the rebased branch was exactly one commit ahead.
- No PR was created or merged.
