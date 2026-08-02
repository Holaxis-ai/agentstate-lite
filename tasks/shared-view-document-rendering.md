---
type: Task
title: Shared bounded document rendering for portable Views
status: todo
priority: '2'
description: >-
  DESIGNED + REVIEWED 2026-08-02 — implementation-ready. Add one
  document-centric read-only rendering capability so durable Views reuse
  AgentState's bounded Markdown semantics unchanged in web and MCP. Two units:
  first prove an inert static output profile through the existing generated MCP
  consumer; then add render-document through composition-root injection without
  weakening ui-server package direction.
actor: openai/codex
timestamp: '2026-08-02T16:09:27.117Z'
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
