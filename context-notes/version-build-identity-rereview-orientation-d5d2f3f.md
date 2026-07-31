---
type: Context Note
title: 'Re-review orientation: npm skill projection d5d2f3f'
actor: openai/reviewer
timestamp: '2026-07-31T23:03:44.780Z'
---
# Summary

Exact SHA `d5d2f3f2dd37472f612e5b287f449a1c0b942285` supersedes reviewed `3579b987e9f893b7b5cc4f3d9f83880e29fe19cb`. Its only delta is the generator-produced two-line `version [--json]` entry in the PR-owned `packages/cli/SKILL.md`.

## Goals

Ultimate goal: keep the npm CLI and every shipped projection truthfully aligned with one identity authority.

Proximate goal: verify that the exact generated npm skill repair closes the sole major finding without touching bot-owned marketplace artifacts or disturbing the clean cumulative diff. This serves the ultimate goal by making the public identity command discoverable in the packaged skill while preserving distribution ownership boundaries.

## Scope

Inspect the exact commit and generated lines, run the owning `check:skill` drift gate, verify `git diff --check origin/main...HEAD`, confirm exact ancestry and a clean detached worktree, and prove no plugin-target SKILL, committed plugin executable, paired plugin manifests, or marketplace manifest changed. Reuse the full code/script/package evidence already established at the unchanged parent. Do not edit code.

## References

- [[tasks/version-build-identity]]
- [[context-notes/version-build-identity-final-code-review-3579b98]]
- [[context-notes/version-build-identity-final-review-orientation-3579b98]]
