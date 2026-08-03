---
type: Context Note
title: >-
  DEPRECATED single-id pre-compact handoff -> see session-scoped notes
  (tasks/pre-compact-multi-session)
actor: brian-claude
description: >-
  Post-compaction recovery checkpoint for the cache-identity follow-up and
  separately reviewed hidden-lifecycle defect.
timestamp: '2026-08-03T15:08:16.470Z'
---
# Summary

DEPRECATED single-id handoff. This fixed id (`context-notes/pre-compact-main`) COLLIDES across
concurrent main sessions — whoever writes last clobbers the rest. The fix is tracked at
`tasks/pre-compact-multi-session` (a design team is on it as of 2026-08-03).

Until that lands, a resuming MAIN session should NOT trust this id. Instead:

- Read the session-scoped handoff matching your session: `context-notes/pre-compact-main-<session_id>`.
- If you do not know your session id, list `pre-compact-main-*` notes
  (`aslite list --prefix context-notes/pre-compact-main`) and read the MOST RECENT one, checking its
  actor/timestamp/summary to confirm it is yours.

The authoritative handoff for the most recent orchestrator session is
`context-notes/pre-compact-main-6cc651d1` (session `6cc651d1-a193-4944-9520-a14f2234d0cf`).

[tracked by](../tasks/pre-compact-multi-session.md)
