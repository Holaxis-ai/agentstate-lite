---
type: Task
title: >-
  App shell must not depend on structuredContent delivery — an OPTIONAL host
  capability
status: in_progress
priority: '1'
actor: claude-main
description: >-
  CONFIRMED both paths 2026-07-27 ~18:15: generated show_view fails on Claude
  Desktop with the identical invalid-payload error, as predicted — host
  withholds structuredContent; shell depends on it exclusively. CLAIMED by
  claude-main (Brian's go): building the layered fix — (1) shell stores the
  toolinput arguments the Apps protocol delivers and, when a toolresult arrives
  without a valid payload, recovers by re-invoking show_view over the App's own
  host-proxied server channel (callServerTool) and rendering that response's
  payload; (2) when recovery is impossible (no toolinput either), an honest
  diagnostic naming the host capability gap replaces the generic message. No new
  trust surface: the App receives exactly the payload structuredContent delivery
  would have granted. Branch + tests + review gate to follow.
timestamp: '2026-07-28T00:15:44.471Z'
---
# Root cause (diagnosed 2026-07-27, claude-main + Brian field testing)

The MCP Apps protocol makes structuredContent in tool results an OPTIONAL host capability
(ext-apps 1.7.5 host-capabilities schema: 'Host supports structured content'). The shipped shell's
renderPayload path consumes ONLY result.structuredContent (view.ts renderResult), so on any host
that does not deliver it — empirically: Claude Desktop, which otherwise renders MCP Apps fine —
every launch shows 'This tool result did not contain a valid AgentState View payload.' over a blank
frame. Server, schemas, validator, and the durable approval loop are all verified correct
(full chain: context-notes/mcp-durable-view-render-field-report). Prediction logged: the generated
path fails identically on such hosts (same channel).

# Fix direction (design touchpoint with the security review)

The App has its own host-proxied JSON-RPC channel to the server (callServerTool /
readServerResource — core to the Apps spec, host support not optional). Options, roughly in order
of preference:

1. App-visible payload fetch: register a tool with visibility: ['app'] (the ext-apps tool-meta
   supports model/app visibility scoping) — e.g. resolve_launch — that returns the current launch
   payload; the shell calls it when ontoolresult arrives without a valid payload, keying off the
   toolinput notification's arguments (viewId / generated args), which the Apps protocol DOES
   deliver to the App. No trust-surface change: the App already receives this payload when
   structuredContent works; visibility 'app' keeps it out of the model's tool list.
2. Fallback: shell checks app.getHostCapabilities() and surfaces an honest diagnostic naming the
   missing capability instead of the generic message (worth doing regardless, for the next host).
3. Rejected: mirroring JSON into a text content part (pollutes the text fallback every non-App
   host shows).

# Acceptance sketch

- On a host that withholds structuredContent, both generated and durable launches render.
- On capability-declaring hosts, behavior unchanged (no double-fetch, or a cheap no-op one).
- Shell unit covers ontoolresult-without-structuredContent for both schemas; the diagnostic
  message names the real condition when recovery also fails.
- Security note: confirm with the in-flight security-model unification review that an app-visible
  resolve_launch leaks nothing beyond what structuredContent delivery already grants.

[field report with the full empirical chain](../context-notes/mcp-durable-view-render-field-report.md)
[Mike's catalog WIP this must not collide with](mcp-durable-view-catalog.md)
[security design under review](../../designs/mcp-view-security-model-unification.md)
