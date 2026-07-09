---
type: Research
title: >-
  Real-time event backbone: ordered, recoverable events as a primitive (codex
  proposal)
actor: mike/claude
timestamp: '2026-07-09T21:35:14.611Z'
---
# Summary

**Proposal (codex/Brian's fleet, 2026-07-09, for founders' consideration):** make **ordered,
recoverable real-time events** a foundational primitive of agentstate-lite — a per-bundle change
feed that the generative UI, sync awareness, session-start, and notifications all consume, instead
of each inferring changes independently. Origin: the `feat/ui-pages` review (see
[[context-notes/ordered-recoverable-realtime-events]], which ages out on the 24h Context-Note
horizon — this doc is the durable home).

**Status: CANDIDATE — recognized direction, NOT yet committed or sequenced.** Adopting it as a
primitive is a joint Mike/Brian decision, pending. The UI is shipping on *tactical* fixes
(serialized polls, reconnect-with-refresh) in the meantime; this feed would later SUPERSEDE that
snapshot-diff mechanism, not bug-fix it.

## Why (the failure modes it addresses)

The UI spike infers changes by snapshot-diffing versions and broadcasting an ephemeral SSE frame.
The review reproduced the failure modes intrinsic to an inferred, non-replayable feed:
- overlapping polls regress state and emit changes out of order (the C -> B -> C regression);
- a disconnected client misses a change permanently (no replay);
- shutdown does not cancel in-flight scans.

These are not isolated bugs — they are what any inferred, ephemeral feed does by construction.

## The proposed primitive

A per-bundle **ordered change journal** (an outbox alongside the markdown, which stays the source of
truth — NOT a rewrite to a fully event-sourced store):
- each durable mutation records an event: monotonic **cursor**, actor/agent attribution, affected
  doc/artifact, **previous + resulting version**, event type, timestamp;
- a client subscribes **after its last cursor**; reconnect **replays the missing range**;
- if retention can't satisfy the cursor, the server requires a **fresh snapshot**; snapshot
  bootstrap **returns a cursor** so subscribing after it can't leave a race gap;
- SSE carries it via `id:` / `Last-Event-ID` — but durable ordering + replay is the point, not the
  transport;
- remote writes commit **state and event atomically**; direct filesystem edits that bypass the
  mutation path degrade honestly to a coarse `bundle.invalidated` event (forcing a refresh rather
  than faking exact history).

Two tiers: **durable** state-change events (replayable) and explicitly **ephemeral** presence /
progress signals (droppable). Generated pages consume **scoped, revocable grants over the durable
feed** rather than owning credentials or polling — which also subsumes
[[tasks/ui-pages-per-page-scoping]].

## What it affects (impact map — why this is foundational, not a feature)

- **Storage seam / every backend** — the journal + atomic state+event commit must be expressed per
  backend (filesystem best-effort, memory, D1R2 transactional); the hardest question here.
- **Wire protocol** — a new subscribe/replay/snapshot-cursor surface (v0 is still evolving).
- **The generative UI** — replaces snapshot-diff SSE with feed consumption + scoped grants.
- **sync awareness / session-start** — today's cursor + awareness cache become consumers of the
  same backbone rather than a separate mechanism.
- **notifications / agent-agent coordination** — teammate awareness, resumable sessions.
- Git stays the ownership / offline / async tier — NOT the live event transport.

## Open questions (codex's list — resolve before implementation)

Ordering scope (per-bundle is the likely floor); event retention; atomicity per backend; the
snapshot-plus-cursor contract; event taxonomy + payload size; how local direct-filesystem writes
degrade honestly.

## If pursued

This grows the usual constellation for a primitive here (cf. typed-links, board-branch-sync): a
**Decision** doc (ratify adoption + the resolved open questions), a **Plan** (implementation), and
Tasks under the [[roadmap-items/real-time-event-backbone]] item — which stays `queued` + unsequenced
(candidate) until that decision commits and sequences it.

[informs](../tasks/ui-pages-spike.md)
