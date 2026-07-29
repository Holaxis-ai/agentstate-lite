---
type: Context Note
title: 'PR #177 MCP sizing system model'
description: >-
  Domain model, timing dependencies, and invariants for host-controlled MCP View
  sizing after PR #179.
actor: codex-pr177-validator
timestamp: '2026-07-29T14:30:43.017Z'
---
# Summary

PR #177 adapts the trusted MCP View shell to host-owned outer dimensions. The remaining integration
work is to preserve fixed-height internal scrolling while ensuring flexible Views report
overflow-only content changes after current `main` is merged.

## Goals

- Ultimate goal: make agentstate-lite a dependable, conflict-safe shared-memory system whose
  conversational Views remain usable in real MCP hosts.
- Proximate goal: make PR #177 preserve the host's sizing contract after the merged PR #179 changes,
  including live intrinsic growth and shrink.

## Domain model

- **Host card**: the MCP client's outer allocation. A `height` value is a hard allocation; a
  `maxHeight` value is only a ceiling for intrinsic sizing.
- **Trusted shell**: `view.html` plus `view.ts`. It owns the host-facing MCP App connection,
  capability negotiation, authorization, and the nested generated-View frame.
- **Generated View**: opaque registered or generated HTML inside the sandboxed nested iframe. It
  cannot call the MCP host directly.
- **Sizing session**: `{launchId, epoch, nonce}` identity that binds a nested frame's height reports
  to the currently mounted launch and prevents stale or foreign frames from resizing the shell.
- **Intrinsic measurement**: the maximum of root/body scroll heights and root/body bounding-box
  heights, rounded upward.
- **Fixed mode**: the shell fills the host's exact height, suppresses outer overflow, and gives the
  nested frame the remaining flex space; long generated content scrolls inside that frame.
- **Flexible mode**: the nested frame reports intrinsic height; the shell clamps it against the
  host's `maxHeight` and the product ceiling after subtracting shell chrome.
- **Display mode**: inline/fullscreen host capability. The shell advertises both but exposes a
  transition only when the host reports that the target is available.

## Components and interaction

1. The MCP host supplies context and dimensions to the trusted shell.
2. The shell selects fixed or flexible behavior from the presence of `height`, never by treating
   `maxHeight` as a fixed size.
3. Before mounting opaque HTML, the shell injects a read-only sizing script carrying the sizing
   session identity.
4. The nested document measures after initial mount, box resize, DOM mutation, viewport resize, and
   font readiness. Animation-frame scheduling coalesces bursts.
5. The nested document posts only its measurement and session identity. The shell accepts it only
   from the current iframe window and exact current session.
6. Fixed mode ignores intrinsic frame-height requests; flexible mode clamps and applies them.
7. PR #179 changes empty-selection description in the same MCP package but different source files;
   merging current `main` is required so the final verification covers both behaviors together.

## Timing and ordering dependencies

- A sizing report is valid only after the current iframe mount and before its epoch is retired.
- `ResizeObserver` detects box-size changes but does not necessarily fire when a fixed-height,
  overflow-constrained body changes only its `scrollHeight`.
- `MutationObserver` schedules a measurement for those overflow-only content changes. It must remain
  read-only and share the existing animation-frame debounce to avoid feedback loops.
- The source-window and session checks must occur before any accepted height affects the mounted
  iframe.

## External state

- GitHub PR #177 currently targets branch `codex/fix-mcp-intrinsic-height`.
- `main` advanced to `cb396e4` after the prior review via PR #179 and plugin regeneration.
- Real MCP hosts control the outer card and may differ in supported display modes.

## Invariants

- Measurement never mutates generated document layout.
- A fixed host height never creates an outer shell scrollbar.
- A flexible host receives both growth and shrink reports, including overflow-only DOM changes.
- Height is finite, positive, rounded upward, and clamped by host and product ceilings.
- Stale, spoofed, or wrong-window reports cannot resize the current View.
- Generated HTML remains sandboxed and cannot gain host or bundle authority through sizing.
