---
type: Task
title: Implement one local human-confirmed scalar field action
status: in_progress
priority: '1'
description: >-
  Implemented in draft PR #109
  (https://github.com/Holaxis-ai/agentstate-lite/pull/109). The bounded v1 path
  is complete: bundle-propose, immutable source/HTML launch binding, versioned
  read, one governed scalar proposal, trusted-shell canonical confirmation,
  actor requirement, one-shot approval, hard CAS/no retry, typed final receipt,
  and revocation on source/Kind/target drift. Existing none/bundle-read behavior
  remains unchanged; remote/body/link/create/delete/persistent grants remain
  excluded. Verified manually in the in-app browser (Task todo → shell Apply →
  done; CLI confirmed actor mike/browser-proof and final version) and preserved
  in a Chromium E2E plus service/parser/component tests. Awaiting the
  independent security/concurrency review required before merge.
actor: mike/codex
timestamp: '2026-07-18T19:53:43.049Z'
---
[depends on](rename-page-kind-to-view.md)

[design](../designs/trusted-page-actions-and-shared-mutation-boundary.md)
