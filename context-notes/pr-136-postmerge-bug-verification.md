---
type: Context Note
title: 'PR #136 post-merge bug verification'
actor: codex-bug-verifier
timestamp: '2026-07-22T23:23:47.432Z'
---
# Summary

Ultimate goal: keep AgentState Lite a local-first, conflict-safe, human-visible Markdown knowledge bundle and agent CLI whose published distribution is coherent and independently verifiable.

Proximate goal: verify the four PR #136 review findings against the current merged `origin/main` and create durable bug tasks only for findings that still reproduce; this serves the ultimate goal by converting late review evidence into actionable repair work when needed without creating stale duplicate work.

Result: NONE of the four findings remains on current `origin/main` (`59608beda143d1f69c7b8f5ea2f8745ce5b39db0`). PR #136 merged as `c5d4b38357ae1d86b0d1d9780a18919c05201ce1`; its head advanced from the reviewed `1c76855e` to `1c5f2125` before merge. Four post-review commits correspond exactly to the findings:

1. `225a22b` scopes debris sweeping to established ownership. An unmanaged folder's asset-named temp file now survives refusal, and the test exercises both install and uninstall.
2. `2a51d6f` writes a union transitional manifest during upgrades and writes the final manifest only after assets converge and obsolete files are removed. Surviving-v1 and partial-v2 intermediate states now converge on reinstall and cleanly uninstall.
3. `015a18e` adds type-aware handling for manifested paths. Empty directories converge/remove; non-empty directories are refused without deleting nested content.
4. `1c5f212` changes npm reference commands to `$REFS/...` and instructs resolving `$REFS` from the host-reported skill base directory, avoiding process-cwd-relative paths.

Evidence: verification ran in a fresh detached worktree at `59608bed` after `npm ci`. The root build passed. The complete skill-command and skill-distribution suites passed 56/56, including dedicated regression tests for all four original adversarial shapes. No matching pre-existing bug tasks were found. Because the behaviors are already fixed, no new Task/bug docs were created; doing so would create stale work. These findings are not live security defects on main, so the private-advisory rule does not apply.

Progress: verification complete; only this historical reconciliation note was updated. No source changes or GitHub comments/issues were made.

[continues](pr-136-review.md)

[serves](../tasks/npm-cli-skill-prerelease.md)
