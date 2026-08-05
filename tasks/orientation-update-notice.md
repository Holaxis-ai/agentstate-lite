---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  ADVERSARIAL QA PASS at exact SHA 8056f525766551556dedb31928d09e821fc4a58e.
  Fresh detached QA passed external filesystem/privacy 9/9, focused 120/120,
  built base-vs-candidate output parity 4/4, suppression/protocol/no-write
  18/18, six-process authority/lease/cooldown/ABA probes, exact five-field
  notice placement, fixed request shape, and cached session-start at 199 ms.
  Candidate remained clean/pinned and only the declared private cache state was
  written. Evidence: context-notes/orientation-update-adversarial-qa-8056f52.
  Next and final dependency: full repository/package gate at this exact SHA.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T22:44:24.271Z'
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
