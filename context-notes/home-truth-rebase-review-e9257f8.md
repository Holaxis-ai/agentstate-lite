---
type: Context Note
title: Home truth delivery rebase exact-SHA review — PASS
actor: codex-review-home-truth-rebase-2
timestamp: '2026-07-23T15:25:10.784Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: e9257f8e69a94d013159478809fa56244654c003
Base: f15bfac1d1f5915813287b4b3738a077f7cbc4ac
Prior reviewed patch: 6418972c1f4225dae7034708496090f51e5e359d

No blocking or non-blocking issue survived the fresh exact-SHA rebase review.

## Integration audit

The feature is one coherent commit directly atop current origin/main. origin/main...HEAD changes exactly the intended eight source and test files, with 255 insertions and 21 deletions. git range-diff shows one upstream adaptation: Launcher.test.tsx now retains current-main BRIDGE_BADGES in the same import block as the feature refresh exports. Launcher still exports BRIDGE_BADGES, so current-main badge and onboarding behavior remains intact. No plugin manifest, marketplace file, package manifest, generated bundle, skill, or unrelated artifact appears in the feature diff. git diff --check passed.

## Truth contracts and survived attacks

- Remote mode with a deliberately non-null root cannot display or persist local privacy onboarding; local first-run behavior and remote disclosure remain green.
- Dir sharing summaries publish their classifier TTL through refresh_after_ms. The TanStack interval schedules remaining evidence lifetime, terminal interceptor states stop scheduling, and hosted summaries omit polling.
- Detailed Git probing distinguishes true no-repository from failed plumbing. Plain non-repo stays private, malformed repository evidence is unavailable, linked-worktree behavior remains green through the CLI suite, and legacy repoTopLevel callers preserve null projection.
- Current-main BRIDGE_BADGES, plain-language empty state, agent-first onboarding, DocumentBrowser integration, and launcher imports all survive the textual conflict resolution.
- Package import direction remains valid.

## Sampled commands

- npm ci
- npm run build
- npm run typecheck --workspace @agentstate-lite/ui
- npm test --workspace @agentstate-lite/ui -- src/views/Launcher.test.tsx: 22 of 22 passed
- AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./packages/cli/test/ts-loader.mjs packages/cli/test/ui-sharing.test.ts: 15 of 15 passed
- node --test --import ./packages/ui-server/test/ts-loader.mjs packages/ui-server/test/config.test.ts: 4 of 4 passed
- node --test --test-name-pattern repository-discovery-distinguishes --import ./packages/board-git/test/ts-loader.mjs packages/board-git/test/git-porcelain.test.ts: 1 of 1 selected passed
- node --test --import ./packages/board-git/test/ts-loader.mjs packages/board-git/test/import-direction.test.ts: 3 of 3 passed

Builder evidence was audited from context-notes/home-truth-rebase-session: full unpiped npm run check exited 0 including Playwright 18 of 18. The reviewer did not repeat the full gate because no integration finding justified it. Detached worktree remained clean at the exact SHA.
