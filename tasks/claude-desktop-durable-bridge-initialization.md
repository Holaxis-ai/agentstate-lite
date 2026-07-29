---
type: Task
title: Fix Claude Desktop registered View bridge initialization
status: in_progress
priority: '1'
assignee: codex-pr177-followup
description: >-
  Exact merged PR #177 renders and enters fullscreen in Claude Desktop, but the
  registered Roadmap never sends an app-only durable bridge call and remains in
  its initial loading state.
actor: codex-pr177-followup
timestamp: '2026-07-29T23:18:01.940Z'
---
# Problem

Claude Desktop, configured directly to exact merged PR #177 head `13fcc2c`, rendered and authorized `pages-registry/roadmap` and advertised fullscreen, but the registered View remained indefinitely at `loading the graph...` / `reading the roadmap...`. Server evidence showed initialize, discovery, resource read, and the initial tool response, but no subsequent app-only bridge or polling call.

# Root cause and system model

The model-visible `show_view` tool advertises one MCP App shell through `_meta.ui.resourceUri`. Hosts may preload and cache that resource before invocation. Since the App shell was introduced, byte-distinct revisions all advertised `ui://agentstate/view-host/v1.html`.

That mutable identity made an exact server build insufficient to select exact outer-shell bytes: the server could return a new tool implementation while Claude or ChatGPT reused older executable HTML for the same resource identifier. An earlier ChatGPT run visibly executed an old suspension string. In Claude, the reused identity produced no app-only bridge calls.

A diagnostic build based on current main used a unique resource URI plus an on-card fingerprint. Claude reported the outer App visible from shell boot, loaded the live Roadmap on the first invocation, and immediately emitted the expected app-only bridge burst followed by sustained polling. The final production rule is therefore structural: derive the resource URI deterministically from the full SHA-256 of `MCP_VIEW_HTML`, and feed that one value to tool metadata, resource registration, and returned content. Identical bytes keep one identity; any byte change creates a new identity.

The diagnosis also exposed a separate initially-hidden activation defect. It is tracked independently as `tasks/mcp-app-hidden-authorized-first-mount` and must not be described as this incident's cause.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: give every exact MCP App shell byte sequence an immutable discoverable identity across Claude Desktop and ChatGPT. This serves the ultimate goal by preventing supported hosts from silently executing stale trusted-shell code.

# Progress

- Unique-resource Claude diagnostic passed: outer visible from boot, live graph rendered, app-only bridge and polling traffic present.
- Content-derived URI implementation and regression are present in `/private/tmp/aslite-claude-bridge-fix` on `fix/claude-desktop-durable-bridge-init`.
- The URI regression failed against the parent static URI and passes after the repair.
- Focused suites, repository-wide typecheck, and full `npm run check` pass.
- Next gates: exact-SHA independent review, adversarial QA, uninstrumented content-derived Claude acceptance, commit/push, then task completion.

# Acceptance criteria

- A unique-resource diagnostic build loads the live Roadmap in Claude and records app-only bridge/poll traffic.
- The App shell resource URI is the deterministic full-content hash of exact generated HTML.
- Tool metadata, registered resource URI, and returned content URI use the identical derived value.
- A one-byte HTML change produces a different resource identity.
- The reviewed uninstrumented exact fixed SHA loads the Roadmap on its first Claude Desktop invocation.
- Expand and Return inline continue to work when Claude advertises fullscreen.
- ChatGPT sizing/display lifecycle tests and the full repository gate remain green.
- Independent review precedes adversarial QA; no merge occurs here.

[depends on](mcp-durable-view-intrinsic-sizing.md)

[diagnostic result](../context-notes/claude-bridge-probe-result-77c84e4.md)

[diagnostic provenance](../context-notes/claude-bridge-probe-provenance-77c84e4.md)

[initial failure evidence](../context-notes/claude-pr177-initial-bridge-stall-13fcc2c.md)

[architecture review](../context-notes/claude-bridge-architecture-diagnosis-13fcc2c.md)

[test-model review](../context-notes/claude-bridge-test-model-13fcc2c.md)

[separate lifecycle finding](mcp-app-hidden-authorized-first-mount.md)
