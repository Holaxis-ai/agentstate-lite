---
type: Task
title: Prove intrinsic sizing through the nested MCP View frame
status: in_progress
priority: '2'
actor: openai/codex
description: >-
  REOPENED 2026-07-28 — real Codex dogfooding showed the inline View remains
  substantially shorter than Codex can display. The prior relay was
  unit/Chromium-proven but lacked the required host acceptance proof. Fix the
  current-height feedback lock, pin initial-short-to-tall growth, and close only
  after a real Codex View expands without nested scrolling.
assignee: openai/codex
timestamp: '2026-07-28T01:22:17.830Z'
---
# Problem

The MCP SDK auto-sizes the outer App document, but AgentState mounts active durable View bytes in a
second opaque-origin iframe whose height is fixed at a minimum of 18rem. The shell cannot inspect
the child DOM, so long or dynamically growing Views can produce nested scrolling even when the
host correctly honors intrinsic App sizing.

Evidence and host measurements:
[MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

# Small proof

Add one narrow, shell-owned layout signal from the current generated/durable View frame to the
trusted MCP App shell. It is a layout hint, never data or authority.

The shell must:

- accept it only from the current iframe `contentWindow`;
- bind acceptance to the active launch ID and frame epoch so stale/replaced documents cannot resize
  the current launch;
- parse a finite positive height and clamp it to a conservative, host-aware maximum;
- update only the child iframe height;
- preserve the existing sandbox, CSP, source authorization, bridge authority, and action model;
- let the MCP SDK's existing outer auto-resize propagate the changed shell height to the host.

Prefer one reusable View-runtime helper or injected bootstrap over asking every View author to
invent resize observation and message shapes.

# Proof cases

- short content does not retain an arbitrary 18rem blank floor;
- long content grows without an inner scrollbar up to the declared cap;
- narrow/mobile-like reflow updates height;
- live content growth and shrink update height;
- stale-launch and wrong-source messages are ignored;
- malformed, negative, non-finite, and excessive sizes fail closed or clamp;
- the trusted action/authorization confirmation remains usable without a second scroll trap;
- official reference host and current Codex conversation host are both exercised where host access
  permits, with any measurement gap recorded rather than inferred.

# Boundary

Do not add View-registry presentation fields or promotion/discovery behavior in this unit. Do not
declare fullscreen/PiP support yet. This proof only makes the existing nested-frame composition
behave correctly under the protocol's already-present flexible sizing.

[depends on](mcp-app-presentation-sizing.md)
