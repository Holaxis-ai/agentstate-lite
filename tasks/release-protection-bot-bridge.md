---
type: Task
title: Make temporary marketplace bot compatible with protection
status: todo
priority: '1'
description: >-
  Implement P5B: replace direct-main marketplace bot updates with an inspectable
  PR flow.
actor: openai/codex-plan-receipt-gate
timestamp: '2026-08-08T16:52:13.819Z'
---
# Goal

Make repository protection compatible with the temporary marketplace bundle updater without broad bypass authority. This is P5B.

# Acceptance

- Direct-to-main bot behavior becomes an inspectable, idempotent bot branch/PR flow.
- Loop, no-change, permissions, failure, and bot-owned-artifact boundaries are tested.
- No feature PR hand-builds the committed marketplace executable.

# Gate

Builder → independent exact-SHA security Review → adversarial workflow loop/permission QA → repository gate → Brian-owned PR/merge.

[unit contract](../plans/version-string-channel-identity.md)

[depends on](version-build-identity.md)

[depends on](p5a-pre-live-hardening.md)
