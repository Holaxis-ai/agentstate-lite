---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  REPAIR COMPLETE at exact SHA 8056f525766551556dedb31928d09e821fc4a58e. Parent
  now revalidates matching unexpired active-token authority immediately before
  spawn after cache reread; authority loss returns zero-spawn without
  cleanup/successor touch. Deterministic C/A/B ABA regression passes (B=1, A=0,
  B token preserved), owner 22/22, focused 120/120,
  build/typecheck/generated/package/full check all pass. Gate returned to
  mandatory fresh exact-SHA re-review; QA remains blocked.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T21:52:17.327Z'
---
# Goal

Add default home/session-start cached update orientation without registry latency or protocol-output instability. This is N4.

# Acceptance

- Exact cache/lease schemas/paths, 24h TTL, 30s lease, safe atomic writes, and private detached worker.
- Default TOON-only actionable notice; JSON/ordinary/MCP output remains byte-stable.
- Exact flag/env/CI suppression and no bundle/usage data in requests.
- Fake-time/process/cache tests cover corruption, links, permissions, concurrency, interruption, hung network, child failure, and render budget.

# Gate

Builder → independent exact-SHA Review → adversarial offline/concurrency/output QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[normative protocol](../designs/version-update-protocols.md)

[depends on](supported-release-check.md)
