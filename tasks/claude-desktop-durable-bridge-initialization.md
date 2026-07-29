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
timestamp: '2026-07-29T21:37:11.247Z'
---
# Problem

Claude Desktop, configured directly to exact merged PR #177 head `13fcc2c`, renders and authorizes `pages-registry/roadmap` and advertises fullscreen. The registered View remains indefinitely at `loading the graph...` / `reading the roadmap...` both inline and after a successful Expand transition.

Server evidence shows initialize, discovery, resource read, and the initial tool response, but no subsequent app-only `durable_view_bridge`, `resume_durable_view`, polling, or close call. This is a bridge-initialization failure, not bundle latency.

# System model

The model-visible `show_view` call mints one exact-byte durable launch. Claude loads the trusted outer App shell, which mounts the registered Roadmap in a sandboxed child iframe. The child emits one-shot `hello` and `subscribe` messages; the shell forwards them through app-only `durable_view_bridge`; the server reads the graph, establishes the subscription baseline, and replies into the child. Claude owns outer sizing, visibility, and inline/fullscreen presentation. A hidden interval quarantines the launch and visible recovery rotates through app-only `resume_durable_view`.

Exact `13fcc2c` has an initialization gap: an already-authorized result received while the outer document is already hidden is mounted without recording suspension. The child's one-shot messages are then rejected by the shell's hidden gate, and a later visible state has no suspension marker from which to resume. An independent SDK-backed browser probe reproduced the exact loading placeholders, successful display-mode changes, and zero app-only bridge calls with this ordering; the unique-URI Claude diagnostic is the remaining field-causality check.

A separate deterministic verification defect aliases byte-distinct App shells under the unchanged cacheable URI `ui://agentstate/view-host/v1.html`. The production repair must make shell resource identity content-derived so exact-build host tests cannot silently execute stale bytes.

# Goals

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: make first registered-View activation lifecycle-safe across Claude Desktop and ChatGPT while giving each exact shell byte sequence an immutable resource identity. This serves the ultimate goal by closing the demonstrated cross-host initialization gap and making future verification trustworthy.

# Progress

- Architecture review completed and synced in `context-notes/claude-bridge-architecture-diagnosis-13fcc2c`.
- QA test-model review completed and synced in `context-notes/claude-bridge-test-model-13fcc2c`.
- A throwaway diagnostic build now has a unique resource URI, visible build fingerprint, and ordered child/outer/SDK boundary trace.
- A feature worktree is ready at `/private/tmp/aslite-claude-bridge-fix` on `fix/claude-desktop-durable-bridge-init`.
- Next gate: capture the diagnostic ordering in Claude, then execute the unchanged host-shaped regression red on parent before implementing.

# Acceptance criteria

- A unique-resource diagnostic build records the first missing event and its ordering without weakening authority or relying on timing guesses.
- A committed host-shaped regression fails before and passes after the correction.
- App shell resource identity is a deterministic full-content hash shared by tool metadata, registration, and returned resource content.
- Exact current build renders the Roadmap data on its first Claude Desktop launch.
- Expand and Return inline work repeatedly when Claude advertises fullscreen.
- A real background hidden/visible transition resumes through a fresh server-owned launch.
- ChatGPT fixed-card scrolling and display transitions remain green.
- Independent code review precedes QA; focused MCP tests and the repository gate pass before any merge.

[depends on](mcp-durable-view-intrinsic-sizing.md)

[diagnostic evidence](../context-notes/claude-pr177-initial-bridge-stall-13fcc2c.md)

[architecture review](../context-notes/claude-bridge-architecture-diagnosis-13fcc2c.md)

[test-model review](../context-notes/claude-bridge-test-model-13fcc2c.md)
