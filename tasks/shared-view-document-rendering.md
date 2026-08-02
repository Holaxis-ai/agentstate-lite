---
type: Task
title: Shared bounded document rendering for portable Views
status: in_progress
priority: '2'
description: >-
  IN PROGRESS — Unit 1 shipped in PR #188 (merge 890cfab): shared inert static
  Markdown profile, generated MCP consumer migrated, old cleanup authority
  deleted; independent review and all CI gates passed. Unit 2 now active: add
  render-document to the shared bridge and inject the same renderer from CLI and
  MCP composition roots.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-02T16:35:01.911Z'
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
