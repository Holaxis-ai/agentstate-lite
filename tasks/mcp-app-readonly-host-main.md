---
type: Task
title: Land the experimental read-only MCP View host on main
status: done
priority: '1'
assignee: openai/codex
actor: openai/codex
description: >-
  Merged as PR #166 at merge commit a64f2297974c707b0e79f5a7430f3562e578c394
  from exact reviewed head 4003e5e. Shipped the private experimental local stdio
  MCP host with exactly one read-only show_view tool and one fixed trusted
  resource; explicit document IDs resolve to current versioned snapshots, agent
  HTML/CSS is contained, and bounded Markdown reuses the shared renderer. No
  action tools, actor/CAS/mutation path, remote transport, or saved generated
  Views are present. Full npm run check passed and exact-SHA CI was green on
  Node 20/22/26. Independent review at
  https://github.com/Holaxis-ai/agentstate-lite/pull/166#pullrequestreview-4782417124
  found no actionable issues after targeted package/stdio tests, MCP surface
  inventory, Chromium CSP/srcdoc proof, a deliberate red probe of href
  stripping, dependency/tree-shaking inspection, and source audit. Accepted
  tradeoffs: npm tarball grows about 383 KB to 761 KB; latest MCP SDK introduces
  three moderate lockfile advisory nodes through @hono/node-server, whose
  HTTP/static-serving path is absent from the built stdio artifact.
timestamp: '2026-07-26T19:24:19.328Z'
---
[implements read-only slice of](../designs/mcp-app-generative-views.md)
