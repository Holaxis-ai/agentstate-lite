---
type: Task
title: Land the experimental read-only MCP View host on main
status: in_progress
priority: '1'
assignee: openai/codex
actor: openai/codex
description: >-
  Implemented on codex/mcp-app-readonly-host-main at exact commit 4003e5e and
  opened draft PR #166. Adds one private experimental stdio MCP host with
  exactly one read-only show_view tool and one fixed trusted resource; explicit
  document IDs resolve to current versioned snapshots, agent HTML/CSS is
  contained, and bounded Markdown reuses the shared renderer. No action tools,
  actor/CAS/mutation path, remote transport, or saved generated Views are
  present. Full npm run check passes; MCP package tests 7/7 and CLI MCP/stdio
  tests 4/4 pass; installed tarball remains zero-runtime-dependency. Disclosed
  tradeoffs: npm tarball grows about 383 KB to 761 KB; latest MCP SDK introduces
  three moderate audit nodes through @hono/node-server, unreachable in this
  stdio-only adapter. Status remains in_progress pending independent review of
  PR #166.
timestamp: '2026-07-26T19:03:39.761Z'
---
[implements read-only slice of](../designs/mcp-app-generative-views.md)
