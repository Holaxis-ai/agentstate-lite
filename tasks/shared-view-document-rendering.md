---
type: Task
title: Shared bounded document rendering for portable Views
status: done
priority: '2'
description: >-
  DONE — Unit 1 shipped the shared inert Markdown output profile in PR #188.
  Unit 2 shipped the read-only render-document bridge with cross-host agreement
  tests in PR #189 (merge af30e83), after independent approval and green CI.
  Unit 3 dogfooded the capability in views-registry/core-user-journey at source
  sha256:d637d202a05b9820646d893bff03389dc5a5259860b4d4c8d558dc235c5f1cdc: the
  same durable View rendered roadmap-items/conversational-mcp-views through both
  the local web host and real MCP transport, preserving canonical headings,
  lists, inline code, safe concept markers, and authoritative document
  versioning without a View-local Markdown parser.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-02T17:12:39.253Z'
---
# Outcome

An authorized durable View can ask either shipped host to render one canonical bundle document
with AgentState's standard bounded Markdown semantics, then compose and style that safe semantic
fragment inside its own UI.

Governing design: [shared bounded document rendering](../designs/shared-view-document-rendering.md).

# Scope

- Add one document-centric, read-only `render-document` request to the shared View bridge.
- Reuse the existing `@agentstate-lite/markdown-renderer`; do not add another parser.
- Preserve `view-runtime` package direction through an injected static-rendering function.
- Provide the same capability and agreement tests in the web and MCP hosts.
- Keep normalized concept references inert; following a syntactically valid id may still return
  `NOT_FOUND` when the target does not exist.
- Update authoring guidance and dogfood one durable View across both hosts.

# Not in scope

Arbitrary Markdown strings, external navigation, a shell-owned document drawer, mutations,
editing, or a separate MCP View model.

# Evidence required to close

- Cross-host agreement tests over success and fail-closed cases.
- Existing generated MCP Markdown binding uses the same static helper.
- One durable bundle View removes its local Markdown approximation and works unchanged in web and
  MCP expanded mode.
- Fresh-agent authoring proof does not require reading product source.
