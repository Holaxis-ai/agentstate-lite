---
type: Task
title: >-
  Bundle pages: fence the one-frame change-push to a downgrading page (Finding
  A; B closed by #40)
status: done
priority: '3'
description: >-
  Closed as already resolved on 2026-08-07 after current-tree verification.
  PageFrame now verifies the launch asynchronously before every pushed change;
  when the registry doc is removed, revoke() runs synchronously, advances
  loadSeqRef, clears the launch, and unmounts the frame. The pending
  verification callback requires the original sequence, so it cannot post the
  claimed one-frame change after revocation. No code change needed.
actor: openai/codex
timestamp: '2026-08-08T00:20:38.698Z'
---

