---
type: Task
title: Design durable MCP View promotion and discovery
status: done
priority: '2'
description: >-
  Design accepted: reuse one active View identity and canonical entry, add
  explicit presentation intent plus one bounded list_views tool, and defer
  one-step promotion until dogfooding proves it.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-07-27T15:18:34.912Z'
---
# Outcome

Design completed at
[Durable conversational Views: promotion, discovery, and invocation](../designs/mcp-durable-view-promotion-discovery.md).

The earlier draft's `declarative-v1` durable format is retired because the shared-security and
unchanged-byte proofs now let the MCP adapter run the existing active View format through the same
registry, exact-byte launch identity, and bridge authority as the web UI.

# Chosen contract

- Keep one `type: View` identity and one canonical `entry`.
- Add optional author-declared `presentation: workspace | inline | adaptive`; absence is
  workspace/default.
- Add one bounded, model-visible `list_views` tool that returns only valid, currently invokable
  inline/adaptive Views.
- Continue invoking through the already-shipped generic `show_view({viewId})`.
- Keep the fixed MCP App shell as the only UI resource; do not use resources as the model catalog.
- Reuse `promote` plus `new "View"` for durable authoring. Do not add a compound promotion command
  until dogfooding proves repeated ergonomic value.
- Defer multiple presentation entries. Responsive source plus the intrinsic sizing relay is the
  demonstrated default; fullscreen remains a runtime host mode.

# Evidence

- Core MCP makes tools model-controlled and resources application-controlled.
- The stable MCP Apps specification permits UI-only resources to be omitted from resource listing.
- The official `ext-apps` v1.7.5 reference host lists tools and resources for host behavior, but
  that does not guarantee resource metadata is presented to the model.
- The current conversation host exposes the server's model-visible tool surface to the agent; it
  does not expose an equivalent callable resource catalog.
- Current `origin/main` already contains generic durable invocation, shared launch/bridge
  authority, and bounded nested-frame sizing.

# Next executable unit

Implement the presentation field plus bounded catalog as
[MCP durable View catalog](mcp-durable-view-catalog.md). Then update authoring guidance and dogfood
one real adaptive View before deciding whether a one-step promotion command is warranted.

[depends on](mcp-view-security-model-unification.md)

[depends on](mcp-app-presentation-sizing.md)

Sizing evidence:
[MCP App presentation sizing](../research/mcp-app-presentation-sizing.md).

[depends on](mcp-durable-view-intrinsic-sizing.md)
