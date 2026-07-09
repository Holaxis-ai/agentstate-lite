---
type: Context Note
title: 'Recommendation: ordered, recoverable real-time events'
actor: openai/codex
timestamp: '2026-07-09T21:21:49.419Z'
---
# Summary

Recommendation for consideration: make ordered, recoverable real-time events a foundational
primitive of agentstate-lite. This follows the review of `feat/ui-pages` and the product framing
discussion: the core value is a shared workspace where humans can engage with agents, watch work
happen live, and multiple agents can coordinate safely across sessions and machines.

Today the UI spike infers changes by taking version snapshots, diffing them, and broadcasting an
ephemeral SSE frame. That is useful for the spike, but the review reproduced the failure modes of
an inferred, non-replayable feed: overlapping polls can regress state and emit changes out of order;
a disconnected client can miss a change permanently; shutdown does not cancel in-flight scans.

The proposed primitive is a per-bundle ordered change feed. Each durable state mutation records an
event with a monotonic cursor, actor/agent attribution, affected document or artifact, previous and
resulting version, event type, and timestamp. A client subscribes after its last cursor; reconnect
replays the missing range. If retention cannot satisfy the cursor, the server requires a fresh
snapshot. Snapshot bootstrap must return a cursor so subscribing after it cannot leave a race gap.
SSE can carry this directly through `id:` / `Last-Event-ID`; the important part is durable ordering
and replay, not the transport.

This does not require rewriting the store as a fully event-sourced database. Current markdown docs
remain the source of truth; the feed is a transactional change journal/outbox alongside them.
Remote writes should commit state and event atomically. Direct filesystem edits that bypass the
mutation path can remain supported through a watcher that emits a coarse `bundle.invalidated`
event, forcing consumers to refresh rather than pretending to reconstruct an exact history.

The feed should serve both product loops:

- human-agent collaboration: live activity, artifacts, generated pages, progress, and interaction;
- agent-agent collaboration: teammate awareness, resumable sessions, notifications, and automation.

Consider two tiers: durable state-change events with replay, and explicitly ephemeral presence or
progress signals that may be dropped. Generated pages should consume scoped, revocable grants over
the durable feed rather than owning credentials or independently polling the bundle.

This recommendation is not an argument to remove useful supporting capabilities. The CLI, CAS,
attribution, kinds/recipes, session-start, git sync, local-first filesystem, and static export all
remain valuable. It instead gives them and the generative UI a shared real-time backbone, while git
remains the ownership/offline/asynchronous tier rather than the live event transport.

Questions to resolve before implementation: ordering scope (per bundle is the likely floor), event
retention, atomicity per backend, snapshot-plus-cursor contract, event taxonomy and payload size,
and how local direct filesystem writes degrade honestly.

[informs](../tasks/ui-pages-spike.md)
