---
type: Context Note
title: Home truth rebased exact-SHA code review — PASS
actor: codex-review-home-truth-rebase
timestamp: '2026-07-22T23:15:51.358Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: 6418972c1f4225dae7034708496090f51e5e359d
Rebase base: origin/main 59608beda143d1f69c7b8f5ea2f8745ce5b39db0

No blocking or non-blocking issue survived the fresh rebase integration review.

## Integration audit

origin/main advanced by 17 commits after the original review and QA of c6e71a7. The feature range remains exactly one commit and the feature diff remains the same intended eight source and test files. git range-diff shows no behavioral change to the reviewed patch. The only Launcher context movement is the upstream DocumentBrowser import and render path. The rebased Launcher retains that component and its focused test mock while preserving the remote-orientation and fake-time sharing refresh regressions. No manifest, generated plugin bundle, or unrelated file is part of origin/main...HEAD.

## Truth contracts

- Remote mode with a deliberately non-null root cannot render or persist local privacy onboarding; local first-run behavior and remote location disclosure remain intact.
- Dir-mode classifier TTL still flows through refresh_after_ms to the TanStack v5 dynamic interval. Cached evidence schedules from as_of, hosted mode omits polling, bounded timing rows remain total, and every terminal interceptor state disables scheduling.
- Detailed repository discovery still separates not_repo from unavailable, malformed Git evidence maps to unavailable, plain folders remain private, linked worktrees remain supported, and legacy repoTopLevel callers keep fail-soft null behavior.
- ui-server owns the public sharing shape, CLI owns classification and TTL, and package import boundaries remain valid.

## Evidence

Fresh npm ci passed.
Root npm run build passed.
Root npm run typecheck passed.
Exact-SHA samples: board-git git-porcelain 67 of 67; CLI ui-sharing 15 of 15; UI Launcher 21 of 21; ui-server config and import direction 7 of 7; board-git import direction 3 of 3.
git diff --check passed. Detached worktree remained clean at the exact SHA.
Prior review and QA records read: context-notes/home-truth-code-review-c6e71a7 and context-notes/home-truth-qa-c6e71a7.
