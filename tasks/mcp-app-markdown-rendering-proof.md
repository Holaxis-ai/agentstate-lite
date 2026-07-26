---
type: Task
title: Render authoritative Markdown inside conversational MCP Views
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Implemented locally on codex/experiment-mcp-apps: moved the existing bounded
  Markdown-to-React renderer into @agentstate-lite/markdown-renderer; both the
  web DocPage and MCP App consume that one parser/security boundary. Added
  data-aslite-markdown=objects.<index>.body, static rendering into the
  scriptless child, stripped navigation attributes, and MCP containment tests
  for structure, raw-HTML inertness, envelope scoping, and link stripping. npm
  run check passes. Final Codex-host visual proof awaits one desktop restart
  because recycling the pre-change stdio child closed this task's negotiated
  transport and Codex does not hot-reconnect it.
actor: openai/codex
timestamp: '2026-07-26T15:53:31.561Z'
---

