---
type: Context Note
title: 'PR #177 fullscreen lifecycle semantics research'
actor: pr177-fullscreen-research
timestamp: '2026-07-29T17:47:12.064Z'
---
# Summary

Research phase opened for PR #177 at exact head `ca6d6aaf9894aae55c1ca0221be1ff6cacec6d1a`.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: derive a deterministic lifecycle model that distinguishes host-mediated
inline/fullscreen transitions from genuine durable-View suspension without weakening fail-closed
subscription safety. This serves the ultimate goal by preserving an authorized live View through
supported host presentation changes while refusing stale or identity-breaking resumptions.

Current verified boundary: the real Codex host hides the App document during inline-to-fullscreen,
and the current implementation retires every authorized hidden-to-visible cycle. Unverified:
the permitted order among `requestDisplayMode()` settlement, `visibilitychange`, and host-context
updates, and whether the SDK exposes teardown/visibility events sufficient to classify the
transition without timing guesses.

Next phase: inspect the MCP Apps SDK contract, current shell implementation, and existing lifecycle
tests; enumerate event orderings and derive the smallest deterministic state-machine correction.
