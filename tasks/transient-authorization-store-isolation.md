---
type: Task
title: Make transient authorization isolation the safe default
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Follow up the medium-priority API footgun in
  context-notes/transient-view-pr191-implementation-review.
  PageBridgeLaunchAuthority currently defaults transient authorization to the
  registered authorization store. Make omission fail safe by owning a fresh
  process-local SessionViewAuthorizationStore (or a comparably small
  compile-enforced design), so a future host cannot accidentally persist
  transient approval merely by omitting the fourth constructor argument. Add a
  regression test proving authorization in the registered store does not
  authorize a transient launch when no transient store is supplied. Keep this
  separate from approval copy, launch immutability, and bundle-propose.
actor: openai/codex
timestamp: '2026-08-02T20:23:39.562Z'
---

