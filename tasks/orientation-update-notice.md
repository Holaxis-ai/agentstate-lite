---
type: Task
title: Add cached nonblocking update orientation
status: in_progress
priority: '1'
description: >-
  PR #209 OPEN at exact reviewed, QA-passed, and final-gated SHA
  8056f525766551556dedb31928d09e821fc4a58e:
  https://github.com/Holaxis-ai/agentstate-lite/pull/209. Independent review,
  adversarial multi-process/filesystem/privacy/output QA, and final
  ASLITE_NO_UPDATE_CHECK=1 npm run check all passed without later source edits.
  Feature worktree is clean and remote head matches the pinned SHA. Next
  dependency: GitHub CI/review and Brian-owned merge.
actor: codex-orientation-orchestrator
assignee: codex-orientation-orchestrator
timestamp: '2026-08-05T22:51:59.340Z'
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
