---
type: Context Note
title: 'PR #178 cross-host code and design review'
description: >-
  Review goal, system model, invariants, and open evidence questions for PR
  #178.
tags:
  - review
  - mcp-apps
  - claude-desktop
actor: codex-pr178-review
timestamp: '2026-07-28T02:32:52Z'
---
# Summary

Ultimate goal: keep agentstate-lite a minimal, offline-first, user-owned knowledge bundle whose harness integrations add dependable operational discipline without making the core harder to reason about.

Proximate goal: independently review PR #178 at its exact head SHA, including whether its payload-recovery design is the smallest portable repair for the observed Claude Desktop interoperability defect while leaving the healthy Codex MCP Apps path unchanged. This serves the ultimate goal by making durable and generated Views render reliably across hosts without widening authority or adding host-specific machinery that the evidence does not require.

Current system model: `show_view` creates a single launch and returns its render payload through MCP Apps. Codex has rendered that path successfully, while Claude Desktop 0.1.0-pre.1 was observed to create the launch and panel frame but deliver an apparently payload-less result to the app shell. A raw stdio client saw a complete server result, so the defect is at or after the Desktop host boundary rather than in launch generation. Existing design constraints require opaque-ID-only app authority, one launch per user action, bounded one-shot recovery state, no recovery from tool errors, and no regression on healthy hosts. Before accepting recovery complexity, the implementation must be supported by Desktop probe evidence for the actual surviving correlation channel and for app-initiated result delivery; if `_meta` survives initial delivery, it is preferred over a round trip.

Unverified assumptions for this review: whether PR #178 contains or cites the required Desktop probe; whether Claude Desktop preserves `toolInfo.id`, `_meta`, or app-call `structuredContent` at the payload sizes involved; whether the recovery path preserves concurrency correctness and one-launch semantics; and whether the change remains protocol-generic rather than encoding a Codex/Claude fork.
