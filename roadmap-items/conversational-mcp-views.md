---
type: Roadmap Item
title: Conversational Views through MCP Apps
status: active
description: >-
  EXPERIMENTAL — fixed-shell rendering and one shared-authority governed action
  are proved; independent review/QA remains before product adoption.
sequence: >-
  Fixed-shell proof → shared authority extraction → governed action proof →
  independent review/QA → real conversation host → bounded queries if needed →
  durable promotion → second host / remote adapter
actor: openai/codex
timestamp: '2026-07-26T18:00:26.466Z'
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

1. Empirically prove the fixed-resource/dynamic-result lifecycle and generated-content containment.
   Implemented on `codex/experiment-mcp-apps`: fixed resource, dynamic explicit-ID snapshots, clean
   STDIO, and sanitized script-free `srcdoc` rendering with declarative text bindings all pass in
   the official reference host. Arbitrary script was rejected after self-navigation proved to be an
   exfiltration path.
2. Extract only the launch/action authorities that a second real host actually needs. Implemented
   experimentally as `@agentstate-lite/view-runtime`; the local UI and MCP adapter now depend on the
   same `TrustedActionService`, which still delegates final writes to core's `mutateDocument`.
3. Reuse the existing trusted scalar action and shared mutation service. Implemented and
   empirically proved in the official MCP Apps reference host for one selected Task status change:
   prepare did not write, the fixed trusted shell displayed document/kind/field/before/after/actor,
   explicit Apply committed with CAS and attribution, and the same View refreshed from the final
   authoritative version. The generated nested document remained script-free and read-only.
4. Complete independent review, adversarial QA, and one real conversation-host proof.
5. Add bounded deterministic queries only if explicit-ID dogfooding proves they are needed.
6. Promote useful ephemeral presentations into durable bundle Views.
7. Verify a second host, then consider a remote adapter.

# Current decision gate

Independent review and adversarial QA of the exact governed-action commit are next. The empirical
reference-host proof is builder evidence, not a substitute for that high-risk review tier. Do not
widen beyond one selection-bound, kind-validated scalar action or merge the experiment into the
supported product surface until that review closes. Afterward, prove the same contract in one real
conversation host; bounded queries are the next product capability only if explicit-ID dogfooding
shows that selection friction is real.

[contains](../tasks/mcp-app-fixed-shell-spike.md)

[contains](../tasks/mcp-app-markdown-rendering-proof.md)

[contains](../tasks/mcp-app-governed-action-spike.md)

[contains](../tasks/mcp-shared-markdown-renderer-main.md)

[contains](../tasks/mcp-view-runtime-extraction-main.md)
