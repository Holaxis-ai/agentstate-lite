---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  EXACT-SHA REVIEW FAILED at 21a028c. Expired-cooldown quarantine can
  ABA-capture a successor active token; because the parent rechecks cache but
  not matching active authority immediately before spawn, two detached workers
  can start even though the captured worker later exits before U3. Builder is
  adding deterministic C/A/B regression and pre-spawn active-token revalidation;
  QA remains blocked.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T21:36:56.495Z'
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
