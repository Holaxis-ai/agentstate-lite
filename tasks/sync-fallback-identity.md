---
type: Task
title: Fallback git identity for sync-family commits (receipt-polish item 3)
description: >-
  DONE — PR #108 merged ea85b31 (2026-07-18), two review rounds. SHIPPED:
  identityFlags(dir, actor?) in board-git porcelain — ONE owning primitive every
  sync-family commit site consumes (stageAndCommit commit, snapshotBundleCommit
  + flow.ts createBoardRootCommit/createRemovalCommit commit-tree,
  fetchRebase/fetchRebaseResolving rebase/<ref>/--skip/--continue; merge
  --ff-only and rebase --abort correctly unguarded). Probe: git var
  GIT_AUTHOR_IDENT AND GIT_COMMITTER_IDENT both exit 0 (the conjunct was review
  round-1's MEDIUM find: author-only env exports — a real CI shape — passed the
  author probe while commit still died on committer identity). Round-1 HIGH
  find: the no-override test relied on AMBIENT identity and went red on hermetic
  CI runners — now constructs local config under full isolation; the feature
  itself behaved correctly on CI. No-override guarantee PROVEN by review: no
  reachable state where the synthetic identity displaces a working one.
  DISCOVERIES recorded: (1) cli package.json's test script injects
  GIT_AUTHOR_NAME=test-suite process-wide — the mechanism that masked this
  failure class on identity-less CI for the whole suite's life; (2) rebase
  REPLAY needs committer identity too (git preserves author, sets committer) —
  guarded; (3) ambient GIT_CONFIG_NOSYSTEM=1 defeats useConfigOnly-based test
  isolation — harness saves/deletes/restores it. Mixed-identity semantics
  accepted: author-only env → author=env, committer=synthetic (env beats -c).
  Attribution channel remains frontmatter; commit authorship stays
  non-load-bearing.
actor: mike/claude
status: done
timestamp: '2026-07-18T19:09:24.824Z'
---
Parent: tasks/sync-receipt-edge-polish item 3. Was blocked on PR #104 (same porcelain files); unblocked 2026-07-18.
