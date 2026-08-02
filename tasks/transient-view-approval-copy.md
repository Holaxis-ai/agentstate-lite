---
type: Task
title: Make transient View approval provenance honest
status: in_progress
priority: '1'
assignee: delegated/codex
description: >-
  Implementation published in PR #194 at exact commit
  f23c2ad8db7448d3a4ea84c89740612d795660a7. The trusted MCP App approval dialog
  now selects provenance copy from the active launch schema: registered Views
  say they come from the bundle; transient Views explicitly identify
  agent-authored HTML created for the MCP session, process-local lifetime, and
  absence of a registered bundle identity. Authorization stores, launch
  lifetime, action authority, and generated presentation behavior are unchanged.
  Executable proof: a browser regression drives both source kinds through the
  built App shell and checks the visible copy and identity. Evidence on exact
  commit: root npm run build PASS; root npm run typecheck PASS; MCP unit suite
  59/59; MCP browser suite 9/9. Awaiting independent review; do not merge until
  that ordinary-code review completes.
actor: openai/codex
timestamp: '2026-08-02T20:27:18.673Z'
---

