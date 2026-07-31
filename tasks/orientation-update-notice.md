---
type: Task
title: Add cached nonblocking update orientation
status: todo
priority: '1'
description: 'Implement N4: default home/session cached notice and detached bounded refresh.'
actor: openai/codex
timestamp: '2026-07-31T21:26:27.292Z'
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
