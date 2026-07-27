---
type: Roadmap Item
title: Conversational Views through MCP Apps
status: active
description: >-
  EXPERIMENTAL — active durable Views are proved. Sizing evidence found a
  bounded nested-frame height relay as the next enabler; promotion/discovery
  follows and must support optional inline/workspace/fullscreen presentations
  under one View identity.
sequence: >-
  Fixed-shell proof → shared action authority → governed action → conversation
  proof → bounded queries → shared View security design/review → durable bridge
  proof → sizing evidence → intrinsic nested-frame sizing → presentation-aware
  promotion/discovery → authoring guidance → dogfood → second host / remote
  adapter
actor: openai/codex
timestamp: '2026-07-27T12:33:25.698Z'
---
# Direction

Prove that AgentState Lite can expose a purpose-built interactive View inside an MCP-compatible
conversation without turning MCP into a second agent CRUD surface. The OSS npm artifact owns one
local STDIO server implementation; agents continue to use the CLI for general bundle work.

Architecture authority:
[Conversational Generative Views via MCP Apps](../designs/mcp-app-generative-views.md).

# Product boundary

The model-visible MCP surface should remain extremely small. A fixed, package-owned MCP App shell
receives invocation-specific presentation and authoritative bundle snapshots. App-only tools may
refresh that launch or execute a governed human action, but remain hidden from the model.

The first local process is scoped explicitly to one bundle. Remote workspaces, authentication,
multi-tenant hosting, and a broader remote-agent tool surface remain separate later decisions.

# Sequence

1. Fixed-resource/dynamic-result lifecycle and generated-content containment: proved.
2. Shared host-neutral launch/action authority: shipped as `@agentstate-lite/view-runtime`.
3. Governed scalar action through the shared core mutation service: proved.
4. Independent review, adversarial QA, and real conversation-host mutation: proved in PR #168.
5. Bounded deterministic query selection using the durable View's shared query semantics: proved
   and merged in PR #169.
6. Research and independently review ONE durable View security model across the local web UI and
   MCP App host: approved at
   `designs/mcp-view-security-model-unification`. Lifecycle, execution, provenance, local
   authorization, and requested authority remain independent; passive Views may be ephemeral or
   durable.
7. Prove one existing scriptful durable bundle View through the reviewed MCP host adapter before
   designing promotion around a new durable format.
8. Empirically establish what control MCP Apps have over iframe/presentation size across hosts:
   complete at [MCP App presentation sizing](../research/mcp-app-presentation-sizing.md). MCP hosts
   can size the outer App, but AgentState must still relay the opaque nested View's intrinsic height.
9. Prove bounded, launch-bound intrinsic sizing through the nested durable-View iframe in both the
   reference host and the conversation host.
10. Define durable promotion plus generic bundle-scoped View discovery and invocation. Keep one
   View identity while allowing optional inline/workspace/fullscreen presentation variants; never
   expose one MCP tool per View or assume every desktop View is conversationally compatible.
11. Turn the proven data, action, sizing, and promotion constraints into concise agent authoring
   guidance delivered through the lowest-token discoverable surface.
12. Dogfood promotion and discovery with a presentation that has proved repeatedly useful.
13. Verify a second host, then separately consider a remote adapter.

# Current decision gate

The shared durable View security design and mandatory private Stage 0 disposition are complete.
PRs #173/#174 proved one unchanged active View through the thin MCP adapter and pinned its exact
launch identity. Sizing research is complete and found one concrete platform gap: the outer MCP App
auto-sizes, but the opaque nested durable-View iframe has no intrinsic-height relay. The current
unit is that bounded sizing proof. Promotion/discovery follows it and must be presentation-aware:
one View identity may have optional inline/workspace/fullscreen entries, while a single genuinely
responsive entry may serve more than one surface. Authoring guidance follows the accepted
architecture and evidence.

These are still experimental follow-ons, not a supported-product declaration. Broader action
authority, remote workspaces, authentication, and a tool-per-View surface remain out of scope.

[contains](../tasks/mcp-app-fixed-shell-spike.md)

[contains](../tasks/mcp-app-markdown-rendering-proof.md)

[contains](../tasks/mcp-app-governed-action-spike.md)

[contains](../tasks/mcp-shared-markdown-renderer-main.md)

[contains](../tasks/mcp-view-runtime-extraction-main.md)

[contains](../tasks/mcp-app-query-selection.md)

[contains](../tasks/mcp-durable-view-promotion-discovery.md)

[contains](../tasks/mcp-app-presentation-sizing.md)

[contains](../tasks/mcp-view-authoring-guidance.md)

[contains](../tasks/mcp-view-security-model-unification.md)

[contains](../tasks/mcp-durable-view-unchanged-proof.md)

[contains](../tasks/mcp-install-verb.md)

[contains](../tasks/mcp-stdio-error-routing.md)

[contains](../tasks/mcp-durable-view-intrinsic-sizing.md)
