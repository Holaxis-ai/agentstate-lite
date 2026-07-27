---
type: Task
title: Implement the durable MCP View catalog
status: todo
priority: '2'
assignee: ''
description: >-
  Add presentation intent plus one bounded list_views tool over the existing
  generic durable show_view invocation; no new promotion or persistence path.
actor: openai/codex
timestamp: '2026-07-27T15:18:18.164Z'
---
# Behavioral claim

An agent can discover the current bundle's durable conversational Views through one bounded,
model-visible catalog and immediately invoke any returned ID through the existing generic
`show_view({viewId})` path.

# Scope

- Add optional `presentation` to the shipped View convention with the scalar values
  `workspace | inline | adaptive`; absent means workspace/default.
- Register one read-only `list_views` MCP tool with no App UI resource.
- Query `type: View` heads, then reuse core's `parseRegistration` and
  `resolveDeclaredAccess`.
- Return at most 20 ID-sorted rows with pre-limit count, stable View ID, title, optional
  description, access, and presentation.
- Return only `inline`/`adaptive` registrations whose access is accepted by durable
  `show_view` in this unit (`bundle-read`).
- Report bounded omission counts for invalid, unsupported-access, and not-inline-declared
  registrations; never return entry keys, HTML, registry bodies, nonces, or trust state.
- Provide a concise text fallback for non-App hosts.
- Keep all lifecycle/action tools app-only and keep the fixed shell as the only MCP UI resource.

# Acceptance

- Every listed View is accepted by the shared registration/access authorities and is invokable by
  exact ID through durable `show_view`.
- Workspace-only, absent-presentation, malformed, and unsupported-access registrations are not
  advertised as conversationally available.
- Catalog order and cap are deterministic; the response states the compatible pre-limit count.
- Tool-list tests prove there are exactly two model-visible tools (`list_views`, `show_view`);
  lifecycle/action tools remain app-only.
- The official reference host and current conversation host can discover the generic tool without
  adding one tool or resource per View.
- Repository gates pass and the exact implementation SHA receives the ordinary-code review
  required by the repository ladder.

# Non-goals

- One-click promotion or an MCP write path.
- Multiple View entries or fullscreen variants.
- Supporting `bundle-propose` durable Views in MCP.
- Remote bundles, authentication, or a second host.

[design](../designs/mcp-durable-view-promotion-discovery.md)
