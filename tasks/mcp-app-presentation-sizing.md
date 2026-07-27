---
type: Task
title: Investigate MCP App presentation sizing controls
status: done
priority: '2'
description: >-
  COMPLETED 2026-07-27 — flexible host sizing and display-mode negotiation are
  real; AgentState still needs a bounded nested-frame height relay, and
  discovery must distinguish inline/workspace presentations.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-27T12:33:25.601Z'
---
# Question

What control does an MCP App have over its initial and subsequent presentation size, and which
parts are guaranteed by the protocol versus advisory or entirely host-controlled?

# Investigation

- Read the current official MCP Apps specification and reference implementation for resource,
  tool-result, and client APIs related to preferred size, aspect ratio, fullscreen, resize, or
  content-driven height.
- Empirically test the official reference host and the current Codex/ChatGPT conversation host
  where available.
- Distinguish iframe dimensions from the generated document's responsive layout; CSS cannot be
  described as host sizing control unless the outer host actually honors it.
- Check desktop, narrow/mobile, long-content, and action-confirmation cases.
- Record whether a View can request a size once, request changes after rendering, or only adapt to
  a host-selected viewport.

# Acceptance

- Produce a small capability table by host: supported, advisory, unsupported, or unknown.
- Recommend safe defaults and fallbacks for responsive Views without relying on a host-specific
  behavior.
- Identify any minimal metadata/API addition worth trying in the experimental adapter, but do not
  make it a product contract until it is empirically supported.

# Outcome

Completed 2026-07-27. The protocol and official reference host support flexible intrinsic sizing
and negotiated display modes, but AgentState's opaque nested durable-View iframe does not currently
relay its content height to the outer MCP App. The host can size the shell correctly while the
actual View remains a 288px internal scroller.

Keep one View identity and security/data/action contract, but allow optional presentation variants
for workspace, inline, and fullscreen compositions. Do not assume every desktop View is
conversationally compatible. The next proof is a bounded, launch-bound child-height relay; only
then should promotion/discovery define presentation-aware registry semantics.

Full evidence, measurements, capability table, and recommendation:
[MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

[evidence](../research/mcp-app-presentation-sizing.md)
