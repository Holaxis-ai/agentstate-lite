---
type: Task
title: Render authoritative Markdown inside conversational MCP Views
status: done
priority: '1'
assignee: openai/codex
description: >-
  Shipped on codex/experiment-mcp-apps: moved the existing bounded
  Markdown-to-React renderer into @agentstate-lite/markdown-renderer so the web
  DocPage and MCP App consume one parser/security boundary. Added
  data-aslite-markdown=objects.<index>.body, static rendering into the
  scriptless child, stripped navigation attributes, and containment tests for
  structure, raw-HTML inertness, envelope scoping, and link stripping. npm run
  check passed. Final live proof passed after restarting Codex Desktop:
  show_view rendered a custom two-object HTML/CSS composition whose docs/core
  body appeared as structured Markdown from its authoritative snapshot; the same
  fixed MCP resource remained invocation-specific.
actor: openai/codex
timestamp: '2026-07-26T16:19:15.308Z'
---

