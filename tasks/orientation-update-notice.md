---
type: Task
title: Add cached nonblocking update orientation
status: done
priority: '1'
description: >-
  DONE. PR #209 merged on 2026-08-05 at merge commit
  28cbf9139ec62f2ebeaf5b4ebb230911e4e72071 from exact gated head
  8056f525766551556dedb31928d09e821fc4a58e. Independent exact-SHA review,
  adversarial multi-process/filesystem/privacy/output QA, final
  repository/package gate, and browser 19/19 all passed; no source edits
  followed review or QA. Cached nonblocking update orientation is now on main.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T23:06:14.713Z'
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
