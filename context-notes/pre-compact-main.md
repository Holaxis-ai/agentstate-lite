---
type: Context Note
title: >-
  DEPRECATED fixed pre-compact handoff; use session-scoped notes pending
  lifecycle support
actor: codex-compaction-reconciliation
description: >-
  The fixed main-session checkpoint id collides; authoritative replacement work
  is the runtime-neutral lifecycle task.
timestamp: '2026-08-08T16:39:21.341Z'
---
# Summary

DEPRECATED single-id handoff. This fixed id (`context-notes/pre-compact-main`) collides across
concurrent main sessions: the last writer can replace another session's handoff.

The authoritative product work is now the runtime-neutral
[compaction checkpoint lifecycle](../tasks/compaction-context-checkpoint-lifecycle.md). The former
[revision-3 Claude pilot](../tasks/pre-compact-multi-session.md) is retained only as historical
research evidence; it is not the implementation authority.

Until the lifecycle task ships a managed identity and freshness protocol, a resuming main session
should not treat this fixed id as current. Instead:

- read the session-scoped handoff matching the session:
  `context-notes/pre-compact-main-<session_id>`;
- if the session id is unavailable, list `pre-compact-main-*` notes with
  `aslite list --prefix context-notes/pre-compact-main`, then inspect the most recent candidates and
  verify actor, timestamp, and summary before relying on one; and
- treat this lookup rule as an interim compatibility convention, not the final architecture.

The lifecycle design must replace this heuristic with collision-safe agent/session identity,
explicit freshness, and honest degraded behavior on runtimes that cannot expose a needed boundary.
