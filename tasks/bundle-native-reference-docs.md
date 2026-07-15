---
type: Task
title: Portable recipes carry bundle-native operating references
status: done
priority: '1'
assignee: mike/codex
description: >-
  Shipped in PR https://github.com/Holaxis-ai/agentstate-lite/pull/65: reviewed
  source SHA 0dcd349, merge commit 60957aa, post-merge plugin bot commit 8ec2fed
  (version 1.0.58). Definitions-only recipes can declare safe static Reference
  docs; review-workflow carries Page bridge v0 guidance. BRIDGE.md was retired
  so the bundle-native reference is the single authority consumed by recipes,
  the skill, and executable Bridge.watch contract tests. Independent exact-SHA
  subagent review APPROVED with no findings after 138 focused tests and full npm
  run check, including all 14 Page/security browser tests. Bot regeneration
  succeeded and pruned the retired skill reference. Brian
  dev-build-bundle-collision remained untouched.
actor: mike/codex
timestamp: '2026-07-15T17:35:50.046Z'
---

