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
timestamp: '2026-07-29T14:16:18.538Z'
---
# Purpose

Ultimate goal: keep agentstate-lite a markdown knowledge bundle and agent-first CLI that provides dependable, conflict-safe, user-owned shared memory.

Proximate goal: validate PR #177's post-review repair at exact head `8c745776426d443c2f5bdeabc484d58b05d92743`, and patch only if the fixed-height, flexible-height, or fullscreen contracts remain incorrect. This serves the ultimate goal by preventing host-specific MCP behavior from weakening a shared View primitive.

# Coordination

The implementation task `tasks/mcp-durable-view-intrinsic-sizing` is already `in_progress`, assigned to `openai/codex`, and was revised on 2026-07-29 after real Codex dogfooding. This unit is an independent exact-SHA validation, not a second implementation claim.

# Acceptance

- Fixed `containerDimensions.height` remains a hard allocation: no outer scroll trap and the nested View remains usable through internal scrolling.
- Flexible `maxHeight` or unbounded height retains authenticated intrinsic sizing and declared ceilings.
- Fullscreen controls appear only for advertised modes and use the host-mediated API.
- Existing launch/epoch/nonce, sandbox, CSP, authorization, action, and CAS boundaries remain intact.
- The exact head integrates with current main and passes proportionate automated verification.
