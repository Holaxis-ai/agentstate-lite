---
type: Task
title: Design durable MCP View promotion and discovery
status: todo
priority: '2'
description: >-
  Deferred pending the reviewed shared-security/bridge design in
  tasks/mcp-view-security-model-unification. The current declarative-v1-first
  recommendation is under reconsideration and must not drive implementation.
actor: openai/codex
assignee: ''
timestamp: '2026-07-26T23:24:49.284Z'
---
# Product question

How does a useful invocation-specific MCP App presentation become a durable bundle View, and how
does an agent discover and invoke the durable Views available in the current bundle?

The discovery surface must remain generic. Do not register one MCP tool per View: that would make
the model-visible tool list grow with bundle content and undermine the deliberately small MCP
surface.

# Decisions to make

- Define what promotion persists: the `type: View` registration, HTML/blob entry, access level,
  selection/query contract, description, and any authoring provenance needed to revise it later.
- Decide whether promotion reuses an existing CLI/content primitive or needs one small explicit
  command. The result must remain ordinary portable bundle content.
- Compare one generic catalog mechanism: MCP resources/resource templates, one bounded
  `list_views`/`get_views`-style tool, or another host-compatible catalog surface.
- Define how the agent invokes a discovered durable View without rewriting its HTML. Prefer one
  generic invocation path keyed by stable View ID.
- Keep discovery bundle-scoped and honest about unavailable, malformed, or access-incompatible
  registrations.
- Separate model discovery from human launcher presentation; both may read the same View registry,
  but neither should become a second registry authority.

# Evidence and acceptance

- Document the user journey: create an ephemeral View, find it repeatedly useful, promote it, and
  later ask an agent to show it by purpose or ID.
- Document the agent journey: discover the current bundle's bounded catalog, choose one View, and
  invoke it through a generic surface.
- Test the viable discovery options in at least the official MCP Apps reference host and the
  conversation host used for current dogfooding; distinguish protocol guarantees from
  host-specific behavior.
- Recommend the smallest reversible contract, including why it is preferable to tool-per-View
  registration.
- Do not implement until the discovery and invocation contract is chosen.

[depends on](mcp-view-security-model-unification.md)
