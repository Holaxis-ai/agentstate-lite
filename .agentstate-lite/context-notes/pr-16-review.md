---
type: Context Note
title: 'PR #16 review'
actor: codex
timestamp: '2026-07-08T17:46:28.150Z'
---
# Summary

Reviewed PR #16 against the prior PR #15 findings. Remote origin/main already includes PR #16 as merge commit db2cfc1; review worktree was /private/tmp/agentstate-lite-pr16 on commit 6b95098.

Verdict: prior blockers are substantively addressed. Byte-safe blob handling, explicit doc/raw discriminator for conflict rows, body-only conflict companions, and generated skill/bundle alignment are present. Targeted sync tests and build/type/bundle checks pass.

Follow-up finding: sync --show-incoming log.md now renders the reserved path as id: log.md rather than path: log.md because concept-first probing collapses pathFromConceptId("log.md") to the same relpath and suppresses raw fallback. One-off smoke reproduced output: id: log.md / as_of: last fetch / body. Recommended fix: when input ends in .md or is a reserved path and concept/raw relpaths are identical, classify the hit as raw unless there is an explicit canonical concept-id reason to treat it as doc; add a regression test for show-incoming log.md.

Verification run: npm ci --prefer-offline --ignore-scripts; npm run build -w agentstate-lite; npm run typecheck; node --test --import ./test/ts-loader.mjs ./test/sync.test.ts ./test/sync-conflict.test.ts (50/50); npm run check:bundle -w agentstate-lite; npm run check:skill -w agentstate-lite; npm run check:skill:bundle -w agentstate-lite; git diff --check db2cfc1^1..HEAD.
