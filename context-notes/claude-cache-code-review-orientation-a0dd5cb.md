---
type: Context Note
title: Cache-only review orientation for a0dd5cb
description: Reviewer goal and evidence model for the separated cache-identity candidate.
tags:
  - review
  - claude-desktop
  - mcp-app
actor: claude-cache-code-review
timestamp: '2026-07-30T00:22:27.193Z'
---
# Summary

Independent Reviewer gate is starting for exact cache-only candidate `a0dd5cb0ef5ecd3f4e59ee35b75060ec764932ea` against exact parent `77c84e4827f332cd8a84079d239dc76398b88959`, using detached worktree `/private/tmp/aslite-cache-review-a0dd5cb`.

Ultimate goal: make agentstate-lite a reliable local-first collaboration substrate whose conversational MCP Views behave correctly across supported hosts and whose work state survives agent/session boundaries.

Proximate goal: determine whether this separated candidate gives the exact MCP App shell bytes one immutable, consistent resource identity without changing bridge authority or lifecycle behavior. This serves the ultimate goal by preventing host cache reuse of stale executable shell bytes while preserving the already-reviewed security boundary.

The field evidence in [[context-notes/claude-bridge-probe-result-77c84e4]] establishes stale reuse under the mutable URI as the Claude failure cause. The prior review in [[context-notes/claude-bridge-code-review-91a0cbe]] approved the content-addressed identity in isolation but rejected the combined lifecycle scope. This review will verify the separated exact diff, full-hash and one-byte-sensitive construction, metadata/registration/response identity consistency, parent-red provenance, contract invariants, and focused tests for [[tasks/claude-desktop-durable-bridge-initialization]].
