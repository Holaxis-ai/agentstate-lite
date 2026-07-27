---
type: Task
title: Design durable MCP View promotion and discovery
status: todo
priority: '2'
description: >-
  Deferred until intrinsic nested-frame sizing is proved. Preserve one View
  identity while allowing optional inline/workspace/fullscreen presentations;
  discovery must report only compatible presentations honestly.
actor: openai/codex
assignee: ''
timestamp: '2026-07-27T12:33:25.894Z'
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
- Preserve one semantic View identity—purpose, access, query/data selection, actions, and
  provenance—while allowing optional host-aware presentation entries. Keep the existing `entry` as
  the workspace/default entry unless a later migration proves necessary.
- Make catalog results presentation-aware. A desktop-only View must not be represented as inline
  compatible merely because the MCP shell can technically mount its bytes; a responsive single
  entry may serve multiple modes when it has actually been tested there.
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

[depends on](mcp-app-presentation-sizing.md)

Sizing and variant evidence:
[MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

[depends on](mcp-durable-view-intrinsic-sizing.md)
