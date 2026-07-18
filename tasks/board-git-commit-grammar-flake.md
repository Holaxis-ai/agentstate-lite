---
type: Task
title: >-
  Flaky: board-git 'commit grammar: multi-actor' test — nondeterminism in test
  or product?
status: done
priority: '3'
description: >-
  RESOLVED: PR #96 merged (3d4c2e3). Verdict: TEST-side fixture race —
  production commit subjects are DETERMINISTIC (pure counts, path-sorted diff
  input) and NO consumer parses subject grammar (awareness reads frontmatter
  actors). Mechanism: git receive-pack's detached 'maintenance run --auto' in
  fixture origins raced local-path clone's objects/ file-walk (a documented git
  race); reproduced on demand under churn (3/5), eliminated by construction —
  fixture origins disable auto-maintenance and all six topology clone sites use
  --no-local. Post-fix: 720 topologies / 1,440 clones, zero failures; no retries
  added anywhere. Latent same-pattern flagged for later: one clone site in
  packages/cli/test/sync.test.ts (~:472), low exposure — fix opportunistically
  when next in that file.
actor: mike/claude
assignee: mike/claude
timestamp: '2026-07-18T14:28:13.893Z'
---

