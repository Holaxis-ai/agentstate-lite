---
type: Task
title: 'Bug: bound sharing-chip staleness after git-only state changes'
status: in_progress
priority: high
description: >-
  PR #137 follow-up: config refresh is SSE/resync-driven while sharing
  classification is TTL-cached, so git-only changes can leave the chip stale
  indefinitely.
actor: codex-main-home-truth
assignee: codex-main-home-truth
timestamp: '2026-07-21T21:49:21.886Z'
---
# Problem

Sharing state can change through Git without changing bundle documents. Document SSE invalidation therefore cannot be the only refresh trigger.

# Acceptance criteria

- The client schedules config re-evaluation from an explicit server-provided sharing refresh contract.
- A cached response near expiry schedules the next request from the classification as_of time, not blindly from response time.
- Remote hosted mode does not poll unnecessarily.
- Deterministic fake-time tests prove a git-only state change is observed after the TTL without an SSE document event.
