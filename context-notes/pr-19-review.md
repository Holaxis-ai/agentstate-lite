---
type: Context Note
title: 'PR #19 review'
actor: codex
timestamp: '2026-07-08T22:02:48.019Z'
---
# Summary

PR #19 review findings were fixed in `/private/tmp/agentstate-lite-pr19`.

Changes made:

- `sync` now has a path-only stale-board fallback in `retargetBoardInterior`: if Git cannot resolve a stale `.agentstate-lite` checkout after a mount/remount, but the path is inside an ancestor named `.agentstate-lite` with a `.git` file signature, sync retargets to the parent project root so `provisionBoardWorktree` can run its repair path. This fixes `sync --dir <movedRoot>/.agentstate-lite` returning `sync: nothing to sync`.
- Added a regression test for running sync from inside the stale board checkout after moving/remounting the repo.
- Fixed the false red test by moving remount fixtures to sibling paths named `moved-<oldName>` instead of `<oldPath>-moved`, avoiding string-prefix matches against the old root.
- Rebuilt the committed plugin skill bundle.

Verification:

- `node --test --import ./test/ts-loader.mjs ./test/git-porcelain.test.ts ./test/sync.test.ts` passed 89/89.
- `npm run build -w agentstate-lite` passed.
- `npm run typecheck` passed.
- `npm run check:bundle -w agentstate-lite` passed.
- `npm run check:skill -w agentstate-lite` passed.
- `npm run check:skill:bundle -w agentstate-lite` passed.
- `git diff --check` passed.
