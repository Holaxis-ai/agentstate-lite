---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  READY FOR PR at exact pushed SHA 8056f525766551556dedb31928d09e821fc4a58e.
  Independent exact-SHA review passed; adversarial QA passed filesystem/privacy
  9/9, focused 120/120, output parity 4/4, suppression/protocol/no-write 18/18,
  real multi-process authority/lease/cooldown/ABA probes, exact notice/request
  behavior, and 199 ms cached session-start. Final ASLITE_NO_UPDATE_CHECK=1 npm
  run check exited 0, including package/generated-skill gates and browser 19/19.
  Worktree is clean and local HEAD equals origin branch. Evidence:
  context-notes/orientation-update-adversarial-qa-8056f52 and
  context-notes/orientation-update-final-gate-8056f52. No source edits followed
  Review or QA; next dependency is Brian-owned PR creation and merge.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T22:49:54.755Z'
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
