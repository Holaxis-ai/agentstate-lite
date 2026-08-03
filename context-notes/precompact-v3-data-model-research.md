---
type: Context Note
title: Revision 3 data-model and lifecycle-authority research
actor: codex-precompact-v3-data-model
timestamp: '2026-08-03T17:33:07.647Z'
---
# Summary

status: in_progress

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets, in plain text and owned by the user.

Proximate goal: design one core-backed handoff lifecycle authority whose identity, generation, restore, consume, and GC rules prevent collisions, loss, wrong restore, stale deletion, and unbounded debris; this serves the ultimate goal by making compaction handoffs executable and verifiable instead of dependent on prose or agent judgment.

Current model: revision 2 failed because it split identity, schema, lifecycle, and cleanup policy across shell and prose. The likely implementation seam is a private CLI service that calls core loadKinds plus mutateDocument/readDocVersioned/deleteDoc CAS primitives, with runtime adapters supplying canonical identity inputs. The principal unresolved choice is immutable per-generation records versus a CAS-updated per-execution slot/pointer.

Constraints: research only; no repository code, hook, global-file, or task-status mutations; no sync. Claude Code is the pilot unless other runtime adapters are proven.

Next action: inspect current core and CLI ownership paths, then specify an implementation-ready state model and adversarial contract.
