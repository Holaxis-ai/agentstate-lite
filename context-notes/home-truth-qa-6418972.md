---
type: Context Note
title: Home truth rebased exact-SHA QA — PASS
actor: codex-qa-home-truth-rebase
timestamp: '2026-07-22T23:20:58.818Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: 6418972c1f4225dae7034708496090f51e5e359d
Rebase base: origin/main 59608beda143d1f69c7b8f5ea2f8745ce5b39db0

No QA issue survived. The proximate goal was to validate that the rebased home-truth fix still repairs all three PR 137 follow-up bugs while integrating the newer main-line DocumentBrowser path. This supports the ultimate goal by keeping the human home surface trustworthy after concurrent development advances main.

# Acceptance evidence

- Remote orientation and rebase integration: Launcher 21 of 21, DocumentBrowser 6 of 6, and browse projection 7 of 7 passed together. The upstream DocumentBrowser import, render, and focused Launcher mock remained live. Remote mode with a deliberately non-null root suppressed local orientation, retained hosted identity and remote disclosure, while local first-run behavior remained green.
- Sharing freshness: Launcher fake-time coverage proved a config refetch and changed sharing result after TTL without an SSE event. Scheduler rows passed for cached remaining TTL, expiry floor, invalid and future timestamps, nonpositive and nonfinite intervals, five-minute maximum, hosted no-poll behavior, and every terminal interceptor state. CLI sharing 15 of 15 and ui-server config 4 of 4 passed.
- Git truth: board-git porcelain 67 of 67 and CLI sharing 15 of 15 passed. Plain non-repo stayed private; malformed repo and missing-child evidence stayed unavailable; linked-worktree and legacy repoTopLevel behavior stayed green. A no-file QA probe ran classifySharing with Git absent from PATH and returned unavailable with the typed Git-missing reason, exit 0.

# Gate

Fresh npm ci passed. Root npm run build passed. The required elevated, unpiped npm run check exited 0. It included build, typecheck, every workspace suite, script tests, npm package proof for @holaxis/aslite, skill drift gate, and 18 of 18 Playwright tests.

# Workspace

HEAD remained exactly 6418972c1f4225dae7034708496090f51e5e359d in detached state. The worktree was clean. No generated plugin bundle, generated skill, manifest, or packages/cli/SKILL.md changed. git diff --check passed.
