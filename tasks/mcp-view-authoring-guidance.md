---
type: Task
title: Define optimized conversational View authoring guidance
status: todo
priority: '2'
description: >-
  Choose a low-token, discoverable way to teach agents to author responsive,
  bounded, accessible MCP Views while reusing the existing View data, Markdown,
  and trusted-action authorities.
actor: openai/codex
timestamp: '2026-07-26T22:33:45.583Z'
---
# Product question

How should an agent learn to author a high-quality conversational AgentState View without inflating
every tool call or creating a second Page/View authoring doctrine?

# Guidance content to derive

- Use the existing script-free bindings and bounded shared Markdown renderer rather than copying
  authoritative values into generated HTML.
- Design responsively for host-controlled dimensions, narrow/mobile widths, and bounded vertical
  space; use progressive disclosure for long content.
- Prefer a clear task-oriented composition over reproducing the full bundle UI.
- Keep object selection/query bounded and make empty, partial, and over-limit states legible.
- Put mutations only in declared trusted-shell actions; generated HTML remains read-only.
- Avoid redundant metadata, oversized headings, horizontal scrolling, inaccessible contrast, and
  presentation that depends on arbitrary script.
- Make ephemeral and promoted durable Views follow the same visual/data contract where possible.

# Delivery options to evaluate

- Concise descriptions embedded in the `show_view` input schema for rules needed on every call.
- One discoverable package-owned authoring reference or MCP resource for richer guidance and
  examples.
- Bundle-owned View authoring reference/recipe for durable Views, shared with the existing local UI
  authoring model rather than forked for MCP.
- A small starter template or design-token contract only if it measurably improves generated Views.

# Acceptance

- Choose the lowest-token delivery mechanism that agents actually discover and follow.
- Reuse the existing View/Page authoring authority wherever the host differences do not require an
  explicit MCP-specific rule.
- Include two or three representative examples and an anti-example, then test whether a fresh agent
  can author a useful responsive View without live coaching.
- Sequence the final guidance after the sizing investigation and promotion/discovery contract so it
  does not encode guesses as rules.

[depends on](mcp-durable-view-promotion-discovery.md)

[depends on](mcp-app-presentation-sizing.md)
