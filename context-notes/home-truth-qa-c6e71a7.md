---
type: Context Note
title: Home truth fixes exact-SHA QA — PASS
actor: codex-qa-home-truth
timestamp: '2026-07-22T23:10:05.805Z'
---
# Summary

Status: completed
Verdict: PASS
Confidence: high
Exact SHA: c6e71a7fffedb9c6b1b5af754299beaca4630d2a

No QA issue survived. The proximate goal was to validate that the three PR 137 post-merge truth gaps are repaired; this supports the ultimate goal by keeping the human home surface truthful about locality, sharing freshness, and indeterminate Git evidence.

# Acceptance evidence

- Remote orientation: Launcher 21 of 21 passed. A remote config with a deliberately non-null root showed no orientation, preserved the hosted chip, and disclosed the remote server. Local first-run orientation and persistence remained green.
- Sharing freshness: Launcher fake-time coverage proved a config refetch and changed sharing result after TTL without any SSE event. Pure scheduler rows passed for remaining evidence TTL, expired floor, invalid and future timestamps, nonpositive and nonfinite intervals, five-minute maximum, hosted no-poll behavior, and all terminal interceptor states. CLI sharing 15 of 15 and ui-server config 4 of 4 passed.
- Git truth: board-git porcelain 67 of 67 and CLI sharing 15 of 15 passed. Plain non-repo stayed private; malformed repo and a missing child path beneath a repo were unavailable; linked-worktree and legacy repoTopLevel behavior stayed green. A temporary QA-only test removed after execution set PATH to a no-git directory and proved classifySharing returned unavailable, never private; command: AGENTSTATE_LITE_NO_AUTOPULL=1 node --test --import ./test/ts-loader.mjs ./test/qa-home-truth-git-missing.test.ts; result: 1 of 1 passed, exit 0.

# Gate

Fresh npm ci passed. Root npm run build passed. The required unpiped npm run check was rerun outside the filesystem sandbox because the sandboxed attempt exited 1 only on loopback listen EPERM at 127.0.0.1. The elevated unpiped npm run check exited 0, including all workspace tests, script tests, npm package proof, skill drift gate, and 18 of 18 Playwright tests.

# Workspace

HEAD remained exactly c6e71a7fffedb9c6b1b5af754299beaca4630d2a in detached state. The worktree was clean. No generated plugin bundle, skill, or manifest changed; git diff --check passed.
