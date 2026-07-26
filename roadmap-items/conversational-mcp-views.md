---
type: Roadmap Item
title: Conversational Views through MCP Apps
status: active
description: >-
  EXPERIMENTAL — prove one minimal local MCP View loop before extracting shared
  runtime architecture.
sequence: >-
  Fixed-shell host proof → shared runtime extraction → bounded queries →
  governed action → durable promotion → second host / remote adapter
actor: openai/codex
timestamp: '2026-07-26T16:22:46.631Z'
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
2. Extract only the launch/action authorities that a second real host actually needs.
3. Add bounded deterministic queries after explicit-ID rendering works.
4. Reuse the existing trusted scalar action and shared mutation service.
5. Promote useful ephemeral presentations into durable bundle Views.
6. Verify a second host, then consider a remote adapter.

# Current decision gate

Independent review of the experimental implementation is next. Do not widen the MCP tool surface or
extract the write/action runtime in the same unit. If review passes, verify the same fixed-shell and
containment behavior in one actual conversation host before deciding whether the experiment should
become a supported npm surface.

[contains](../tasks/mcp-app-fixed-shell-spike.md)

[contains](../tasks/mcp-app-markdown-rendering-proof.md)

[contains](../tasks/mcp-app-governed-action-spike.md)
