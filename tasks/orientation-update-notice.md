---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  BUILDER COMPLETE on feat/orientation-update-notice at exact SHA
  21a028c418bf30ecb72aa77a0b06a244aee769d0. Approved active/cooldown protocol
  implemented across 11 files with focused 119/119, build, typecheck, generated
  skill, npm package proof, full npm run check, and UI E2E 19/19 passing. Branch
  is pushed/clean. Gate is now independent exact-SHA Review; QA has not started.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T21:29:08.769Z'
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
