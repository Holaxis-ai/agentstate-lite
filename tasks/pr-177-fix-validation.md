---
type: Task
title: 'Validate PR #177 fixed-host repair'
status: in_progress
priority: high
assignee: codex-pr177-validator
description: >-
  Independent exact-SHA validation of the post-review fixed/flexible height
  correction; patch only if a gap survives.
actor: codex-pr177-validator
timestamp: '2026-07-29T14:31:50.523Z'
---
# Purpose

Ultimate goal: keep agentstate-lite a markdown knowledge bundle and agent-first CLI that provides
dependable, conflict-safe, user-owned shared memory.

Proximate goal: deliver a reviewed, post-merge correction for PR #177 at exact combined commit
`5f36f0e37425630f57d8720b49554863ca37834b`. This serves the ultimate goal by preventing
host-specific MCP behavior from weakening a shared View primitive.

# Coordination

The implementation task `tasks/mcp-durable-view-intrinsic-sizing` remains `in_progress`, assigned to
`openai/codex`, and requires real Codex dogfooding before closure. This unit is an independent
exact-SHA validation and narrowly scoped follow-up, not a second claim on that task.

The whole-system sizing model and invariants are recorded in
`context-notes/pr-177-sizing-system-model`.

# Acceptance

- Fixed `containerDimensions.height` remains a hard allocation: no outer scroll trap and the nested
  View remains usable through internal scrolling.
- Flexible `maxHeight` or unbounded height retains authenticated intrinsic sizing and declared
  ceilings, including overflow-only DOM growth and shrink.
- Fullscreen controls appear only for advertised modes and use the host-mediated API.
- Existing launch/epoch/nonce, sandbox, CSP, authorization, action, and CAS boundaries remain
  intact.
- The exact head integrates with current main and passes independent review plus the full automated
  gate.

# Progress

- Re-fetched current `main` at `cb396e4`, which includes merged PR #179 and plugin regeneration.
- Verified the prior PR head combines with current `main` without textual conflicts.
- Reproduced a surviving browser bug: a fixed-box document's body changed from 150px to 900px and
  back while `ResizeObserver` emitted no live report.
- Added a read-only, animation-frame-debounced `MutationObserver` trigger and a regression test in
  commit `5cf8055`.
- Chromium now reports `150 -> 900 -> 150`; fixed-height outer scrolling remains absent and nested
  scrolling remains functional.
- Merged current `main`; combined commit is `5f36f0e`.
- Independent code review is in progress. Full repository QA is gated on that review.
