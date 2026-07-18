---
type: Task
title: Implement one local human-confirmed scalar field action
status: done
priority: '1'
description: >-
  Shipped in PR #109 (https://github.com/Holaxis-ai/agentstate-lite/pull/109),
  squash commit ae1dd32784ed5fa59dc563721ad4ae815bec43f6. The bounded local v1
  path includes bundle-propose, immutable source/HTML launch binding, versioned
  read, one governed scalar proposal, trusted-shell confirmation, actor
  requirement, one-shot approval, hard CAS/no retry, typed final receipt, and
  revocation on source/Kind/target drift. Independent review found a
  timing-based accidental-confirmation gap and misleading handling of existing
  structured values; follow-up 88ba95a added a 500 ms shell arming delay with a
  real Chromium lure test and made non-scalar replacement fail closed. Existing
  none/bundle-read behavior remains unchanged;
  remote/body/link/create/delete/persistent grants remain excluded. CI passed on
  Node 20/22/26. Optional future hardening remains direct negative HTTP probes
  and a separate empirical post-click concurrent-writer race.
actor: mike/codex
timestamp: '2026-07-18T20:21:50.522Z'
---
[depends on](rename-page-kind-to-view.md)

[design](../designs/trusted-page-actions-and-shared-mutation-boundary.md)
