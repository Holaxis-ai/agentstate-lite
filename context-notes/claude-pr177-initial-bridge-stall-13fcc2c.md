---
type: Context Note
title: Claude Desktop exact-13fcc2c initial durable bridge stall
description: >-
  Claude Desktop renders the exact PR #177 App and advertises fullscreen, but
  the Roadmap remains at its initial bridge-loading state with no app-only
  server calls.
actor: codex-pr177-followup
timestamp: '2026-07-29T21:08:56.158Z'
---
# Field observation — 2026-07-29

Brian launched `pages-registry/roadmap` in Claude Desktop through the newly named server `agentstate-lite-pr177-13fcc2c`, configured directly to the reviewed build at `/private/tmp/aslite-pr177-followup` (HEAD `13fcc2c90d0f0b1f1a2ee9deab6180fc1d8f21e2`). The tool card proves the intended server handled the request. The trusted shell rendered, showed the authorized durable status, and exposed **Expand**, proving this Claude Desktop build advertises fullscreen to the App. The nested Roadmap remained indefinitely at `loading the graph...` / `reading the roadmap...`.

Claude MCP logs show successful initialize, tools/list, resources/list, resources/read, and one tools/call response. They show no later app-only `durable_view_bridge`, polling, resume, or close traffic for this server while the View is stalled. This excludes slow bundle graph loading: the registered View is waiting for its initial bridge handshake, but the server never received it.

## Current system model

The model-visible `show_view` call mints one exact-byte durable launch. Claude loads the fixed trusted outer App resource. That shell authorizes the launch, mounts the registered Roadmap in a sandboxed nested iframe, validates source/launch/epoch-bound child messages, and forwards the child bridge hello through the app-only `durable_view_bridge` tool. The server then reads the bundle graph, establishes the subscription baseline, and replies into the child. Host visibility changes quarantine the old launch; visible recovery uses app-only `resume_durable_view` to mint a fresh launch and remount the child. Claude owns the outer container and display-mode lifecycle.

The evidence currently locates the break between nested child initialization and an app-only call reaching the server. It does not yet distinguish among: the child hello was never emitted; the outer shell ignored it because Claude reports an unexpected visibility/source state on first mount; or Claude did not forward the shell call. Bundle read latency and model tool selection are not live hypotheses.

## Next discriminator

Without relaunching or invoking `show_view` again, click **Expand** once and wait about ten seconds. If the visibility transition triggers resume traffic and the fresh child loads, the defect is specific to the initial visible-mount lifecycle. If it remains stalled and no app-only calls appear, instrument the outer shell/host bridge in a throwaway build before proposing a fix.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: locate why Claude Desktop renders the exact PR #177 shell but fails to establish the first durable bridge baseline. This serves the ultimate goal by turning an apparent loading delay into a bounded cross-host lifecycle defect with a reproducible discriminator.

[tracks](../tasks/mcp-durable-view-intrinsic-sizing.md)
