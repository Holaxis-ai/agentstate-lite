---
type: Task
title: Prune unused high-level log.md API while preserving OKF interoperability
status: todo
priority: '2'
description: >-
  Remove the unused readLog/appendLog convenience API and its helper-specific
  tests and claims, while preserving log.md reservation, generic reserved-file
  CAS/wire/sync support, and a future deterministic projection path.
actor: openai/codex
timestamp: '2026-07-20T00:41:38.969Z'
---
# Problem

`readLog` and `appendLog` are exported from `@agentstate-lite/core`, but neither has a production caller. The product does not automatically maintain `log.md`; normal document, link, blob, delete, sync, and UI mutation paths do not invoke these helpers. Their presence therefore implies an active provenance feature that does not exist.

The helpers are also the wrong abstraction for a future event-backbone projection:

- `appendLog` incrementally parses and splices prose into one mutable Markdown file. It has no event identity, cursor, ordering contract, deduplication, replay semantics, or atomic coupling to the mutation being described.
- `readLog` is a thin convenience wrapper over `readReserved` that discards the version token a safe generated projection would need.
- A future portable OKF activity projection should be reconstructible from structured events or semantic Activity concepts, for example a pure `renderOkfLog(events) -> markdown` followed by the existing generic versioned `writeReserved` seam.

This is a source/API truthfulness cleanup, not removal of OKF `log.md` support.

# Recommended scope

1. Remove `readLog`, `appendLog`, and the private `dateHeading` formatter from `packages/core/src/bundle.ts`.
2. Remove their exports from `packages/core/src/index.ts` and any generated declaration surface.
3. Delete only tests and fixtures whose sole purpose is the high-level helpers:
   - chronological grouping/prose formatting;
   - `appendLog` retry and create-race behavior;
   - `appendLog`-through-`RemoteBackend` integration.
4. Preserve tests of the generic reserved-file seam, including `readReserved`/`writeReserved`, expect-absent and token CAS, unsafe-directory rejection, remote version transport, and backend agreement. Those tests may continue using `log.md` as the reserved-file example.
5. Audit source comments and current-state documentation for claims that AgentState automatically records provenance in `log.md`. Reword them to the precise contract: AgentState recognizes and transports optional conformant OKF `log.md` files, but does not automatically emit them from mutations.
6. Remove stale comments that name `appendLog`/`readLog` as live consumers of the mutation or wire layers. Do not remove explanations that remain true for `regenerateIndex` or generic reserved-file CAS.

# Explicitly retained

- `log.md` in `RESERVED_FILENAMES` and `ReservedFilename`.
- Reserved-file exclusion from concept discovery, document commands, links, graph edges, recipes, and status analysis.
- `StorageBackend.readReserved` / `writeReserved` in filesystem, memory, and remote backends.
- Reference-server reserved-file routes and their security/CAS behavior.
- Git sync, conflict export, and `--show-incoming` handling for raw/reserved `log.md` files.
- The sample bundle's conformant `log.md` interoperability fixture.
- `versionedMutation` and reserved-file CAS behavior used by `index.md` initialization/regeneration.
- The possibility of a future deterministic `log.md` projection from a durable event journal or semantic Activity concepts.

# Non-goals

- Do not implement an event journal, event cursor, replay, retention, notifications, or a new activity Kind.
- Do not wire logging into document or link mutations.
- Do not change OKF conformance rules or the wire protocol.
- Do not delete generic reserved-file code merely because `appendLog` used it.
- Do not add a replacement abstraction speculatively.

# Acceptance criteria

- Production and public core source no longer export or reference `appendLog` or `readLog`.
- No user-facing CLI behavior or output changes.
- A conformant existing `log.md` remains reserved, transportable over the generic backend/wire seam, and safely handled by sync conflicts.
- `index.md` initialization and regeneration retain their existing versioned/CAS behavior.
- Documentation clearly distinguishes optional OKF log interoperability from automatic provenance or the future event backbone.
- The installed npm artifact proof and repository gate remain green.
- An independent reviewer confirms that deleted tests covered only the removed helpers and that generic reserved-file/CAS coverage did not regress.

# Evidence and architectural context

The helpers originated with the initial OKF scaffold, before the event-backbone proposal. Their later migration onto `versionedMutation` consolidated a general CAS/retry invariant; it did not make `log.md` an event stream. See [the shared change-observation design](../designs/shared-change-observation-boundary.md) and [the event-backbone research](../research/real-time-event-backbone.md) for the intentionally separate future direction.
