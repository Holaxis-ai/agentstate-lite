---
type: Context Note
title: Home truth fixes exact-SHA code review — PASS
actor: codex-code-reviewer-home-truth
timestamp: '2026-07-21T22:14:24.622Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: c6e71a7fffedb9c6b1b5af754299beaca4630d2a

No blocking or non-blocking code issue survived review.

## Scope and package boundaries

The commit changes exactly eight intended source and test files across board-git, CLI sharing, ui-server config, and the Launcher. No manifests, plugin bundles, generated artifacts, or unrelated files changed. Board-git import-direction tests passed.

## Survived attacks

- Remote orientation is gated by mode dir plus a non-null local root at state load, render, and dismiss. A contradictory remote config with a non-null root cannot show or persist local onboarding, while the remote disclosure remains intact.
- Dir sharing summaries publish the positive classifier cache TTL. Cached evidence schedules only its remaining lifetime from as_of; invalid, missing, nonpositive, future, expired, and oversized timing rows are bounded as planned. Hosted summaries omit the interval.
- The TanStack Query v5 callback receives the current Query object, reads query.state.data, recomputes after each result, and stops after every terminal interceptor state. The fake-time Launcher test observes a Git-only classification change after TTL without SSE.
- probeRepoTopLevel distinguishes repo, not_repo, and unavailable. Missing child paths under a repository, malformed repository config, Git missing, and linked worktree classification all fail honestly. repoTopLevel retains its legacy null projection. Probe failure reasons sampled as bounded.
- Public types stay owned by ui-server, CLI imports board-git through its package barrel, and the SPA uses type-only ui-server imports.

## Evidence

Fresh setup: npm ci passed.
Build: root npm run build passed.
Exact-SHA samples: board-git git-porcelain 67 of 67; CLI ui-sharing 15 of 15; UI Launcher 21 of 21; ui-server config 4 of 4; board-git import-direction 3 of 3. git diff --check passed.
Additional Git-missing probe: detailed probe threw typed GIT_MISSING and classifySharing returned unavailable with a 53-character reason.
Parent-red probe against c6e71a7 parent using the new CLI contract tests: both targeted tests failed as required. Broken repository evidence was incorrectly private on the parent, and refresh_after_ms was absent on the parent.
