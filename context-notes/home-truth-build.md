---
type: Context Note
title: Home truth bugs — completed build handoff
actor: codex-main-home-truth
timestamp: '2026-07-22T23:22:56.179Z'
---
# Summary

Status: completed
Branch: fix/home-truth-followups
Exact SHA: 6418972c1f4225dae7034708496090f51e5e359d
Base: origin/main 59608beda143d1f69c7b8f5ea2f8745ce5b39db0

The proximate goal was to repair three merged Home-surface truth bugs: remote mode showing local privacy onboarding, sharing state remaining stale after Git-only changes, and failed Git discovery being reported as private. This serves the ultimate goal by keeping agentstate-lite's human-visible local-first state accurate and trustworthy.

# Outcome

- Remote onboarding is gated by runtime dir mode plus a local bundle root; hosted disclosure remains available.
- Sharing summaries publish refresh_after_ms, and the UI schedules bounded re-evaluation from as_of plus that lifetime while respecting terminal interceptor states. Hosted mode does not poll.
- Repository discovery exposes repo, not_repo, and unavailable outcomes to the truth-sensitive classifier while retaining the legacy fail-soft repoTopLevel projection for existing callers.
- The feature branch was rebased onto current main and pushed. No PR was created; the human retains the merge gate.
- tasks/home-remote-orientation-truth, tasks/home-sharing-chip-refresh, and tasks/home-git-probe-failure-truth were completed with branch, SHA, and evidence recorded.

# Verification

- Independent plan review: PASS.
- Independent exact-SHA code review after rebase: PASS, high confidence, no findings.
- Independent exact-SHA QA after rebase: PASS, high confidence, no issues.
- Elevated unpiped npm run check: exit 0, including 18 of 18 Playwright tests.
- Focused final QA: UI integration 34 of 34, CLI sharing 15 of 15, ui-server config 4 of 4, board-git porcelain 67 of 67, plus a no-file Git-missing probe.
- Final implementation worktree clean; feature diff contains exactly eight intended files and no generated plugin, skill, manifest, or CLI skill artifact changes.

# Orchestration reflection

Pattern: sequential generator-critic with Review as an explicit dependency before QA.

What worked: plan review caught an unsafe global API change, underspecified refresh arithmetic, and missing interceptor composition before implementation. Exact-SHA review and parent-red evidence made the acceptance boundary concrete. Repeating Review and QA after rebasing protected the newer DocumentBrowser integration.

What did not work: the primary session redundantly reloaded already-loaded skills, and the first QA pass spent too long on an optional probe before the full gate. The sandboxed full gate also failed on loopback EPERM and then stalled.

Next-cycle improvement: distinguish primary-session skill reuse from fresh-agent setup, time-box optional probes before required gates, and run server/Playwright gates with the already-established loopback permission from the start.
