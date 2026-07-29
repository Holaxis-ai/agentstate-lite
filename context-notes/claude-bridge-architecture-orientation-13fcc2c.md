---
type: Context Note
title: 'Architecture orientation: Claude bridge initialization at 13fcc2c'
actor: claude-bridge-architecture
timestamp: '2026-07-29T21:19:22.230Z'
---
# Summary

Architecture investigation orientation — Claude Desktop bridge initialization.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: identify the exact initialization break between the registered View child's one-shot bridge hello and the app-only durable bridge call at merged head `13fcc2c`, distinguish code/protocol/build/environment causes, and define the smallest lifecycle-safe correction. This serves the ultimate goal by restoring first-launch usability without weakening suspension authority or introducing host-specific behavior.

Current system model: `show_view` mints an exact-byte durable launch; the host delivers the fixed trusted outer App; authorization makes the outer shell mount a sandboxed registered View; the child emits a launch/source/epoch-bound `hello`; the shell validates and forwards it through `App.callServerTool(durable_view_bridge)`; the server establishes the subscription baseline and returns a reply; the shell posts the reply to the child. Host visibility owns launch quarantine and visible recovery through a fresh server-owned launch. Claude Desktop evidence reaches authorized child rendering but the server observes no app-only call, locating the missing transition at or before `App.callServerTool`.

Unverified assumptions to test:

- whether Claude reports the outer document hidden during first mount or an inline-to-expanded transition;
- whether an already-hidden initial mount records a suspension marker before the child's one-shot hello;
- whether the child retries hello after a visibility transition;
- whether the exact shell bytes differ materially from the previously working global build;
- whether `App.callServerTool` is invoked and rejected locally, or never invoked.

Phase: architecture/diagnostic investigation, read-only against product source.

[tracks](../tasks/claude-desktop-durable-bridge-initialization.md)
