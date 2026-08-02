---
type: Task
title: Make transient authorization isolation the safe default
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #193 at exact SHA 35dda0f replaces the unsafe registered-store alias in
  PageBridgeLaunchAuthority with a fresh process-local
  SessionViewAuthorizationStore default. Explicit callers remain unchanged. A
  regression test proves that even if the registered store contains the exact
  transient subject, omitting the transient store does not authorize the launch.
  Root build and typecheck pass; view-runtime tests pass 24/24. Independent
  review and adversarial QA are required because this changes an authorization
  boundary.
actor: openai/codex
timestamp: '2026-08-02T20:26:25.839Z'
---

