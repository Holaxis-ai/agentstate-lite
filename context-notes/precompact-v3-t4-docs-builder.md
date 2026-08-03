---
type: Context Note
title: Revision 3 T4 documentation builder
actor: codex-precompact-v3-docs-builder
timestamp: '2026-08-03T21:10:52.622Z'
---
# Summary

Phase start for T4 at frozen reviewed production SHA `579de4df5076f042282d0292db6ead0839f97ef3`.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: make the exact-host compaction-handoff pilot understandable and operable from one source-owned documentation authority without changing the frozen mechanics; this serves the ultimate goal by making the session-boundary scaffold legible, bounded, and testable.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, and agentstate-lite.

# System model

The accepted lifecycle is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`; only SessionStart is load-bearing restore. One private executable authority owns complete project/execution identity, a 0700 host-local generation journal, content-free operations, fixed logical expiry/event-driven GC, and process-level CAS/read-back semantics without an fsync claim. The adapter and structurally managed five-event installation are projections of that authority. Support is pinned to the exact verified Claude host tuple, and downstream acceptance must consume one immutable candidate.

# Scope and progress

T3 passed exact-SHA review in `context-notes/precompact-v3-t3-review-r2`. T4 will inspect repository generators and edit only source-owned help/reference/docs/skill inputs required to explain verified support, lifecycle roles, privacy/durability, recovery, readiness failures, unsupported hosts, and digest-locked live acceptance. Derived files will be regenerated only with repository scripts. No production semantics, global settings, or live Claude configuration are in scope.

# Next action

Map the existing hook help/reference/README/skill generation graph and choose the smallest source-owned documentation set that gives progressive disclosure without duplicating policy.
