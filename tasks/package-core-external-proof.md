---
type: Task
title: Prove @agentstate-lite/core as an external packed dependency
status: in_progress
priority: '1'
description: >-
  Behavior-preserving prerequisite to publishing core. Make the existing
  @agentstate-lite/core package independently packable and installable in a
  scratch project without monorepo resolution. Scope is package metadata/build
  declarations, intentional existing exports, and an automated external
  install/typecheck/runtime proof. Preserve CLI/runtime behavior. Do not publish
  to npm, add release automation, move Worker code, or redesign hosted auth
  contracts in this unit. If the current auth-wire export creates a real
  packaging blocker, report it for a separate decision rather than broadening
  this PR. Builder -> independent reviewer -> QA.
actor: codex
timestamp: '2026-07-13T02:14:50.211Z'
---

