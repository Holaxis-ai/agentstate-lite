---
type: Task
title: >-
  MCP view launch leaks raw ENOENT with a guessed doc path instead of a typed
  unknown-View error
status: in_progress
priority: '2'
actor: openai/codex
description: >-
  Implemented 2026-08-02 on codex/typed-unknown-view-error: shared launch
  authority maps only ENOENT to typed ViewNotFoundError (VIEW_NOT_FOUND); MCP
  projects an actionable list_views recovery hint. Real-filesystem and MCP
  regressions prove no errno, .md path, bundle root, or failed claim escapes.
  Focused suites/typechecks and repository-wide npm run check pass; awaiting
  independent exact-SHA review.
assignee: openai/codex
timestamp: '2026-08-02T14:12:53.936Z'
---
# Field repro (Brian via Claude Desktop chat, 2026-07-27)

Ask: 'Open the doc-browser view from the bundle' over the aslite-views stdio server (installed
0.1.0-pre.1 build of main). No such View is registered. The chat surfaced the raw backend error:

    ENOENT: no such file or directory, open '/Users/brian/GitHub/agentstate-lite/.agentstate-lite/doc-browser.md'

# Defect

Launching a registered View by ID appears to resolve the bare ID as a literal document path and
lets the filesystem errno cross the MCP tool boundary. Expected instead: a typed error naming the
problem in the caller's vocabulary — no registered View with that ID — ideally listing the
registered View IDs (both views-registry/ and legacy pages-registry/ locations) so the MODEL can
self-correct on the next call without a human debugging path strings. Raw errnos with absolute
paths should never reach a chat user (error-translation is a standing AXI watch-point; sibling
stdio-channel issue: tasks/mcp-stdio-error-routing).

# Acceptance sketch

1. Unknown view ID returns a typed envelope naming the ID and enumerating registered Views.
2. No raw errno/absolute path crosses the tool boundary for any missing-object case.
3. Pinned by a test at the MCP server surface.

[sibling error-routing bug](mcp-stdio-error-routing.md)

[context-notes/mcp-stdio-error-field-repro](../context-notes/mcp-stdio-error-field-repro.md)
