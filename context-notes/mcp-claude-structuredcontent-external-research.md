---
type: Context Note
title: >-
  External research: Claude Desktop structuredContent stripping and safe MCP
  payload recovery
actor: openai/codex
timestamp: '2026-07-28T01:06:58.633Z'
---
# Summary

Does external MCP Apps evidence explain the Claude Desktop field failure where the AgentState App
shell receives a tool result but rejects it as lacking a valid View payload? Yes: independent
upstream evidence reports the same `structuredContent` stripping, while the official SDK supports
the App-only and chunked recovery primitives under consideration. The evidence narrows but does not
replace the planned Desktop instrumentation probe.

# Findings

## Exact upstream field match

An open `modelcontextprotocol/ext-apps` issue reports the same observable behavior on Claude
Desktop: `ui/notifications/tool-result` arrives at the App, but the host has removed
`structuredContent` even though the server returned it. The reporter verified the identical App in
an emulated/reference host and also reproduced the regression with a second, smaller Mermaid App.
That second reproduction weakens the claim that AgentState's approximately 1 MB generated payload
is the sole cause, although size limits remain worth measuring.

- Issue: https://github.com/modelcontextprotocol/ext-apps/issues/696
- Status as researched 2026-07-27: open, no maintainer resolution.
- Treat this as strong independent field evidence, not an official root-cause confirmation.

## Protocol contract

The stable MCP Apps specification defines `ui/notifications/tool-result.params` as the complete
standard `CallToolResult`. Its worked example forwards `content`, `structuredContent`, and `_meta`
to the View. Therefore there is no negotiated host capability whose absence explains stripping the
field; the earlier AgentState task framing around an “optional structuredContent capability” was
incorrect.

- Specification:
  https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx

## Recovery primitives supported by the official SDK

The current AgentState dependency remains the current published ext-apps version (`1.7.5` at
research time). Its official patterns recommend:

1. App-only tools (`visibility: ["app"]`) for UI-originated data retrieval without exposing those
   tools to the model.
2. Chunked App-only retrieval when host tool-response limits make one large response unreliable;
   the worked example uses 500 KiB chunks.

- Patterns: https://github.com/modelcontextprotocol/ext-apps/blob/main/docs/patterns.md

This supports an App-only payload-recovery path and gives a standard fallback if payload size is an
independent second problem.

## `toolInfo.id` cannot be the sole recovery key

`hostContext.toolInfo` and its request ID are optional in the specification. An existing open issue
asks for them to become mandatory precisely because Apps cannot currently rely on them across
hosts. The adopted `toolCallId -> launchId` design therefore needs a fallback and must not make
`toolInfo.id` its only correlation authority.

- Issue: https://github.com/modelcontextprotocol/ext-apps/issues/492

## `_meta` is a promising minimal carrier

The specification forwards result `_meta` to the View. A separate open issue reports the inverse
interop defect in the reference host and specifically states that Claude does forward `_meta` to
Apps. That is not sufficient proof for Brian's current Desktop version, but it makes a tiny opaque
launch ID in `_meta` the highest-value zero-copy probe.

- Issue: https://github.com/modelcontextprotocol/ext-apps/issues/646

# Consequence for the instrumentation probe

Test small and approximately 1 MB values independently through:

1. Initial model-visible tool-result `structuredContent`.
2. Initial result `_meta` containing only an opaque launch ID.
3. App-only `callServerTool` response `structuredContent`.
4. If necessary, an App-only result's bounded text content, verifying that it remains App-only and
   never enters model context.

Also record whether `hostContext.toolInfo.id` arrives, but treat it as an optimization rather than
a portable invariant.

# Recommended recovery shape if the probe succeeds

- `show_view` creates exactly one launch and may include its opaque launch ID in `_meta`.
- The trusted shell invokes an App-only, one-shot `resolve_launch`.
- `resolve_launch` accepts only an opaque existing-launch identity; it never accepts or replays
  `viewId`, object IDs, queries, HTML, or other View-selection authority.
- The server re-derives the payload from current bounded launch state.
- Large payloads use bounded chunks if the host demonstrates a response-size limit.
- Never mirror the full payload into the initial model-visible `content`; doing so could put roughly
  1 MB of View data into conversation context.

# Status

This research narrows the probe; it does not supersede it. Claude Desktop's exact forwarding of
`_meta`, App-only responses, and large results still requires empirical verification on Brian's
host before implementation.

[informs active payload-recovery task](../tasks/mcp-shell-payload-without-structuredcontent.md)

[external evidence for reviewed design](design-review-mcp-payload-recovery.md)
