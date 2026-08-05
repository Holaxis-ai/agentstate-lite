---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  CLAIMED by codex-orientation-orchestrator on 2026-08-05. Proximate goal: add
  cached, nonblocking default update orientation without adding registry latency
  or destabilizing JSON/MCP output; this serves the ultimate goal by making the
  npm-installed CLI self-orienting across sessions without founder intervention.
  Team will follow domain-model/plan review, Builder, independent exact-SHA
  Review, adversarial offline/concurrency/output QA, and repository gate.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T20:34:20.998Z'
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
