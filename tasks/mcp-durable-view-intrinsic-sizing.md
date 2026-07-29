---
type: Task
title: Prove intrinsic sizing through the nested MCP View frame
status: in_progress
priority: '2'
actor: codex-pr177-followup
description: >-
  REVISED 2026-07-29 — Codex declares a fixed-height MCP container, so the host
  owns outer card height. Make fixed cards fill-and-scroll, preserve intrinsic
  sizing only for flexible hosts, and offer host-capability-gated fullscreen.
  Close only after real Codex usability dogfood.
assignee: codex-pr177-followup
timestamp: '2026-07-29T16:32:42.982Z'
---
# Corrected problem

Live Codex acceptance disproved the original target. Codex supplies the MCP App with a fixed
`containerDimensions.height`; under the MCP Apps contract, the host owns that dimension. The app
sent both an initial intrinsic-height notification and a distinct delayed notification, but Codex
kept the card short until its own conversation virtualization remounted the content. More retries
inside AgentState cannot make that host-controlled behavior reliable.

The non-scrollable yellow diagnostic was intentionally authored with `overflow: hidden` to make
clipping obvious. It was not proof that fixed MCP App cards cannot scroll.

# Revised unit

Make the one MCP shell adapt to the host's declared height mode:

- **Fixed height (`height`)** — fill the exact host allocation, keep the trusted shell from
  creating a second outer scrollbar, and let the nested View scroll its own content.
- **Flexible height (`maxHeight` or omitted)** — retain the authenticated nested-frame
  intrinsic-height relay and let the SDK report outer size normally.
- Declare `inline` and `fullscreen` support, and show an **Expand** / **Return inline** action only
  when the host advertises the target display mode. The request remains host-mediated and the host
  may decline it.
- Keep the nested measurement read-only (`scrollHeight` / bounds); never mutate an observed
  document merely to measure it.

This changes presentation policy only. Sandbox, CSP, exact-byte authorization, bridge authority,
query selection, polling, action confirmation, and CAS mutation semantics remain unchanged.

# Required proof

- Fixed-host layout has no outer shell scroll, gives the nested iframe the remaining allocation,
  and leaves taller child content internally scrollable.
- Flexible-host content still grows and shrinks from the nonce/launch/epoch-bound child signal.
- Wrong-source, stale-session, malformed, negative, non-finite, and excessive size messages remain
  rejected or bounded.
- Expand is absent unless the host advertises fullscreen, and uses the standard
  `ui/request-display-mode` path.
- The focused MCP suite, repository gate, exact-SHA review, and one real Codex fixed-card dogfood
  pass before merge.

# Current handoff and proximate goal

Mike handed the remaining empirical verification to Brian in
`context-notes/pr-177-current-head-chromium-handoff`; Brian handed it to
`codex-pr177-followup` on 2026-07-29.

Ultimate goal: keep agentstate-lite a dependable, conflict-safe, user-owned shared-memory system
whose conversational Views are immediately usable in real MCP hosts.

Proximate goal: make exact PR #177 head prove correct real-browser behavior when a flexible parent
applies each child height report, including shrink after growth and first visible mount without user
interaction, while preserving fixed-card internal scrolling. This serves the ultimate goal by
turning the remaining host-dependent assumption into reproducible acceptance evidence.

The first implementation step is a committed Chromium regression matching production feedback:
initial content around 150px, growth to around 900px, parent application of the reported iframe
height, then shrink back to 150–200px. The test must also cover hidden/remounted visibility and the
288px fixed-host contract. A patch is accepted only after those tests fail before and pass after the
correction.

# Progress

- Exact PR head `5f36f0e` was pinned in an isolated worktree.
- Commit `69b2383` adds the required Playwright feedback-loop, hidden/remount, and fixed-card tests
  and makes the browser suite part of root `npm run check`.
- The unchanged implementation produced one intentional failure: after the parent applied 900px,
  body scroll/bounds and root bounds shrank to 180px while root `scrollHeight` stayed at the 900px
  viewport floor, suppressing the shrink report. The other two browser tests passed.
- Commit `ca6d6aa` ignores root scroll height only when it equals root client height, while retaining
  genuine root overflow beyond the viewport. The focused MCP suite passes 54/54 and the committed
  Chromium suite passes 3/3.
- Independent exact-SHA review is in progress. Full repository QA is gated on that review.

# Boundary

Do not add View-registry presentation fields, promotion/discovery behavior, retry loops, or
host-specific Codex APIs. Do not claim AgentState controls a fixed host's outer conversation
layout.

Evidence: [MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

[depends on](mcp-app-presentation-sizing.md)

[verification handoff](../context-notes/pr-177-current-head-chromium-handoff.md)
