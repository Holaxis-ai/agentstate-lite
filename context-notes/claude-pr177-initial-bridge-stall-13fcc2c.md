---
type: Context Note
title: Claude Desktop exact-13fcc2c initial durable bridge stall
description: >-
  Claude Desktop renders the exact PR #177 App and advertises fullscreen, but
  the Roadmap remains at its initial bridge-loading state with no app-only
  server calls.
actor: codex-pr177-followup
timestamp: '2026-07-29T21:20:35.860Z'
---
# Summary

Claude Desktop renders and authorizes exact merged PR #177 head `13fcc2c`, advertises fullscreen, and completes the Expand transition, but the registered Roadmap stays indefinitely at its static loading placeholders inline and fullscreen. Claude MCP logs show no app-only durable bridge or resume calls after the initial tool response. The break is before any durable request reaches the server.

# Field evidence — 2026-07-29

Brian launched `pages-registry/roadmap` through the uniquely named server `agentstate-lite-pr177-13fcc2c`, configured directly to `/private/tmp/aslite-pr177-followup` at `13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2`. The tool card proves the intended server handled the request. The trusted shell rendered the authorized durable status and exposed **Expand**, proving Claude advertises fullscreen.

The nested Roadmap remained at `loading the graph...` / `reading the roadmap...`. Clicking **Expand** succeeded and changed the control to **Return inline**, but the graph remained stalled. Before and after expansion, the server log contains initialize, discovery, resource read, and one tool call response only. It contains no `durable_view_bridge`, polling, `resume_durable_view`, or close traffic. Expansion did not produce a visible hidden/visible resume sequence at the server boundary.

# System model

The model-visible `show_view` call mints one exact-byte durable launch. Claude loads the fixed trusted outer App resource. That shell authorizes the launch, mounts the registered Roadmap in a sandboxed nested iframe, validates source/launch/epoch-bound child messages, and forwards the child bridge hello through app-only `durable_view_bridge`. The server then reads the bundle graph, establishes the subscription baseline, and replies into the child. Host visibility changes quarantine the old launch; visible recovery uses app-only `resume_durable_view` to mint a fresh launch and remount the child. Claude owns the outer container and display-mode lifecycle.

The evidence locates the break between nested child initialization and an app-only call reaching the server. It does not yet distinguish: the registered child script never executed; its one-shot hello was emitted while the outer App considered itself hidden and was discarded; source/launch/epoch validation rejected it; or Claude failed to forward `App.callServerTool`. The same host previously carried app-only bridge/poll calls from the older shell, so a blanket absence of Claude app-tool support is not a live hypothesis. Bundle latency and model tool selection are excluded.

# Next proof

Use a throwaway diagnostic build, never merged, that makes four boundaries visible without exposing bundle data: child script execution; every outer message with source/visibility classification; entry into `forwardDurableBridgeMessage`; and App tool resolution/rejection. Reproduce once in Claude, then write a host-shaped failing regression before changing production behavior.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: locate why Claude Desktop renders the exact PR #177 shell but fails to establish the first durable bridge baseline. This serves the ultimate goal by turning an apparent loading delay into a bounded cross-host lifecycle defect with a reproducible diagnostic boundary.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)

[follow-up task](../tasks/claude-desktop-durable-bridge-initialization.md)
