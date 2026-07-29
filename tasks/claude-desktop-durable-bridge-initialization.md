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
timestamp: '2026-07-29T21:10:37.862Z'
---
# Problem

Claude Desktop, configured directly to exact merged PR #177 head `13fcc2c`, renders and authorizes `pages-registry/roadmap` and advertises fullscreen. The registered View remains indefinitely at `loading the graph...` / `reading the roadmap...` both inline and after a successful Expand transition.

Server evidence shows initialize, discovery, resource read, and the initial tool response, but no subsequent app-only `durable_view_bridge`, `resume_durable_view`, polling, or close call. This is a bridge-initialization failure, not bundle latency.

# System model

The model-visible `show_view` call mints one exact-byte durable launch. Claude loads the trusted outer App shell, which mounts the registered Roadmap in a sandboxed child iframe. The child emits a source/launch/epoch-bound bridge hello; the shell forwards it through app-only `durable_view_bridge`; the server reads the graph, establishes the subscription baseline, and replies into the child. Claude owns outer sizing, visibility, and inline/fullscreen presentation. A hidden interval quarantines the launch and visible recovery rotates through app-only `resume_durable_view`.

The failure lies between child initialization and an app-only call reaching the server. Current evidence does not yet distinguish a missing child hello, an outer-shell visibility/source rejection, or a Claude forwarding failure. The working pre-PR shell on the same host establishes that Claude can normally carry app-only tool calls.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: make an exact merged registered View establish its first durable bridge baseline in Claude Desktop while preserving PR #177 sizing, fullscreen, suspension safety, and ChatGPT behavior. This serves the ultimate goal by closing the newly demonstrated cross-host lifecycle gap.

# Acceptance criteria

- A throwaway diagnostic build locates the first missing event without weakening authority or relying on timing guesses.
- A committed host-shaped regression fails before and passes after the correction.
- Exact current build renders the Roadmap data on its first Claude Desktop launch.
- Expand and Return inline work repeatedly when Claude advertises fullscreen.
- A real background hidden/visible transition resumes through a fresh server-owned launch.
- ChatGPT fixed-card scrolling and display transitions remain green.
- Independent code review precedes QA; focused MCP tests and the repository gate pass before any merge.

[depends on](mcp-durable-view-intrinsic-sizing.md)

[diagnostic evidence](../context-notes/claude-pr177-initial-bridge-stall-13fcc2c.md)
