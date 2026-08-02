---
type: Task
title: Make transient View approval provenance honest
status: in_progress
priority: '1'
assignee: delegated/codex
description: >-
  PR #194 at exact SHA f23c2ad independently reviewed with no findings. The
  trusted MCP App dialog chooses provenance copy from the active launch schema:
  registered Views say they come from the bundle; transient Views identify
  agent-authored HTML created for the MCP session, process-local lifetime, and
  absence of a registered bundle identity. The browser regression drives both
  source kinds through the built shell and asserts the visible copy and
  identity. Authorization stores, launch lifetime, action authority, and
  generated presentation behavior are unchanged. Builder evidence: root build
  and typecheck pass; MCP unit suite 59/59; browser suite 9/9. Awaiting GitHub
  gates.
actor: openai/codex
timestamp: '2026-08-02T20:28:15.606Z'
---

