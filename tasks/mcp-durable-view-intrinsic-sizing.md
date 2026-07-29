---
type: Task
title: Prove intrinsic sizing through the nested MCP View frame
status: in_progress
priority: '2'
actor: openai/codex
description: >-
  REVISED 2026-07-29 — Codex declares a fixed-height MCP container, so the host
  owns outer card height. Make fixed cards fill-and-scroll, preserve intrinsic
  sizing only for flexible hosts, and offer host-capability-gated fullscreen.
  Close only after real Codex usability dogfood.
assignee: openai/codex
timestamp: '2026-07-29T12:44:48.533Z'
---
# Corrected problem

Live Codex acceptance disproved the original target. Codex supplies the MCP App with a fixed
`containerDimensions.height`; under the MCP Apps contract, the host owns that dimension. The app
sent both an initial intrinsic-height notification and a distinct delayed notification, but Codex
kept the card short until its own conversation virtualization remounted the content. More retries
inside AgentState cannot make that host-controlled behavior reliable.

The non-scrollable yellow diagnostic was intentionally authored with `overflow: hidden` to make
clipping obvious. It was not proof that fixed MCP App cards cannot scroll.

# Revised unit

Make the one MCP shell adapt to the host's declared height mode:

- **Fixed height (`height`)** — fill the exact host allocation, keep the trusted shell from
  creating a second outer scrollbar, and let the nested View scroll its own content.
- **Flexible height (`maxHeight` or omitted)** — retain the authenticated nested-frame
  intrinsic-height relay and let the SDK report outer size normally.
- Declare `inline` and `fullscreen` support, and show an **Expand** / **Return inline** action only
  when the host advertises the target display mode. The request remains host-mediated and the host
  may decline it.
- Keep the nested measurement read-only (`scrollHeight` / bounds); never mutate an observed
  document merely to measure it.

This changes presentation policy only. Sandbox, CSP, exact-byte authorization, bridge authority,
query selection, polling, action confirmation, and CAS mutation semantics remain unchanged.

# Required proof

- Fixed-host layout has no outer shell scroll, gives the nested iframe the remaining allocation,
  and leaves taller child content internally scrollable.
- Flexible-host content still grows and shrinks from the nonce/launch/epoch-bound child signal.
- Wrong-source, stale-session, malformed, negative, non-finite, and excessive size messages remain
  rejected or bounded.
- Expand is absent unless the host advertises fullscreen, and uses the standard
  `ui/request-display-mode` path.
- The focused MCP suite, repository gate, exact-SHA review, and one real Codex fixed-card dogfood
  pass before merge.

# Boundary

Do not add View-registry presentation fields, promotion/discovery behavior, retry loops, or
host-specific Codex APIs. Do not claim AgentState controls a fixed host's outer conversation
layout.

Evidence: [MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

[depends on](mcp-app-presentation-sizing.md)
