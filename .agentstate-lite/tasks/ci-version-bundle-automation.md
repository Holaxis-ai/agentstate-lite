---
type: Task
title: 'CI auto-bump + bundle regen at merge: delete the PR-crossing re-bump tax'
status: todo
priority: '2'
description: >-
  De-complexification (Mike-approved 2026-07-09): the committed skill bundle (a
  ~650KB build artifact) plus hand-maintained plugin versions make every
  concurrent-PR crossing cost a rebase + re-bump + bundle regen + full gate
  re-run — six version bumps and five such reconciliations on 2026-07-08 alone;
  the cost is O(n^2) in open PRs and it consumed both fleets (once duplicating
  the same rebase in parallel). Proposal: a CI job on merge to main bumps BOTH
  manifests and regenerates the committed bundle in one bot commit, so PRs stop
  carrying version bumps and bundle rebuilds entirely. Design questions to
  settle in the unit: single source of truth for the version (bot-owned counter
  vs derived); PR drift gates must still prove generated-matches-generator
  WITHOUT requiring the artifact to be current against main; guard against CI
  commit loops; plugin cache is version-keyed so the bump must precede/accompany
  the artifact change atomically; deploy human-gating unaffected. Landing this
  retires the CLAUDE.md parallel-branch re-bump convention clause (update it in
  the same unit).
actor: mike/claude
timestamp: '2026-07-09T01:19:54.635Z'
---

