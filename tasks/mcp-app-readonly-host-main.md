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
  present. Full npm run check passes; exact-SHA CI is green on Node 20/22/26.
  Independent review at
  https://github.com/Holaxis-ai/agentstate-lite/pull/166#pullrequestreview-4782417124
  found no actionable issues after targeted package/stdio tests, MCP surface
  inventory, Chromium CSP/srcdoc proof, a deliberate red probe of href
  stripping, dependency/tree-shaking inspection, and source audit. Reviewer
  recommends clearing draft and merging. Disclosed tradeoffs remain: npm tarball
  grows about 383 KB to 761 KB; latest MCP SDK introduces three moderate
  lockfile advisory nodes through @hono/node-server, whose HTTP/static-serving
  path is absent from the built stdio artifact. Status remains in_progress until
  merge.
timestamp: '2026-07-26T19:20:19.563Z'
---
[implements read-only slice of](../designs/mcp-app-generative-views.md)
