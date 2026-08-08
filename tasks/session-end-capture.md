---
type: Task
title: >-
  Session-END lifecycle hook: capture what happened so next session-start
  context gets richer (AXI principle 7, second half)
status: canceled
priority: '2'
description: >-
  Absorbed into the authoritative checkpoint lifecycle task as the ordinary-stop
  case; no separate capture protocol or store.
actor: codex-compaction-reconciliation
timestamp: '2026-08-08T16:39:21.140Z'
---
# Reconciled disposition (2026-08-08)

This concern is absorbed into the
[compaction checkpoint lifecycle](../tasks/compaction-context-checkpoint-lifecycle.md) as the
ordinary-stop lifecycle case. There should be one checkpoint protocol and one durable bundle store,
not a separate session-end capture feature.

The authoritative Task owns the shared checkpoint contract, the runtime-neutral stop behavior, and
any thin host adapters that are justified by an actual host constraint.
