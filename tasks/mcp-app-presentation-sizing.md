---
type: Task
title: Investigate MCP App presentation sizing controls
status: in_progress
priority: '2'
description: >-
  CLAIMED 2026-07-27 by openai/codex. Researching protocol guarantees, official
  reference-host behavior, and current Codex/ChatGPT host behavior before
  deciding whether desktop and conversational Views share one entry, use
  variants, or remain separate presentations.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-27T12:22:00.785Z'
---
# Question

What control does an MCP App have over its initial and subsequent presentation size, and which
parts are guaranteed by the protocol versus advisory or entirely host-controlled?

# Investigation

- Read the current official MCP Apps specification and reference implementation for resource,
  tool-result, and client APIs related to preferred size, aspect ratio, fullscreen, resize, or
  content-driven height.
- Empirically test the official reference host and the current Codex/ChatGPT conversation host
  where available.
- Distinguish iframe dimensions from the generated document's responsive layout; CSS cannot be
  described as host sizing control unless the outer host actually honors it.
- Check desktop, narrow/mobile, long-content, and action-confirmation cases.
- Record whether a View can request a size once, request changes after rendering, or only adapt to
  a host-selected viewport.

# Acceptance

- Produce a small capability table by host: supported, advisory, unsupported, or unknown.
- Recommend safe defaults and fallbacks for responsive Views without relying on a host-specific
  behavior.
- Identify any minimal metadata/API addition worth trying in the experimental adapter, but do not
  make it a product contract until it is empirically supported.
