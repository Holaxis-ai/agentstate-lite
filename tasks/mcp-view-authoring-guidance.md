---
type: Task
title: Portable View authoring guidance and fresh-agent dogfood
status: done
priority: '2'
description: >-
  DONE — PR #190 merged as 6c067f4. The one authoritative View-authoring
  contract now opens with a concise product model: author one durable responsive
  View for both web and MCP; use the shared bridge and render-document; let the
  host choose size/expansion; do not fork inline, expanded, web, or MCP
  implementations. The optional presentation taxonomy is no longer taught, the
  portable recipe's agent-harness independence remains explicit, and no new
  guide or runtime concept was added. The authority is five lines shorter; npm
  projections remain byte-identical and the plugin projection is bot-owned.
  Verification: exact previously failing recipe test plus complete recipes suite
  51/51, documentation/distribution suite 30/30, skill drift check, and all
  three PR CI jobs green.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-02T18:21:17.573Z'
---
# Product invariant

AgentState has one portable durable View model. A View is bundle content; the local web launcher
and MCP Apps are invocation adapters over the same registry id, HTML bytes, access declaration,
launch authority, and bridge semantics. Guidance must not teach a separate "MCP View" format.

Governing architecture:
[One portable View model](../designs/unified-portable-view-model.md).

Shared document presentation:
[Shared bounded document rendering](../designs/shared-view-document-rendering.md).

# Delivery decision

Keep the detailed contract in the one package-owned View-authoring reference already shipped with
the optional Agent Skill: `references/views/references/view-authoring-v0.md`. Keep the main skill
description short and point agents to that reference only when they need to author or revise a
View. The CLI's `view list`, `promote`, and `ui`/`mcp` help remain the executable discovery
surfaces. Do not create an MCP-only recipe, renderer, template language, or second authoring guide.

# Guidance the authority must teach

- Author one self-contained HTML/CSS/JS View and one `type: View` registry record.
- Use the shared bridge for live data: bounded `query`, `read`, `render-document`, `edges`,
  `subscribe`, and `open-page`; never call host APIs directly.
- Use `render-document` for a complete authoritative Markdown document. Compose and style the
  returned inert semantic fragment inside the View; do not bundle another Markdown parser.
- Keep object selection bounded and show empty, partial, over-limit, and unavailable states.
- Design responsively for host-controlled inline dimensions and MCP expanded/full-page mode;
  progressive disclosure is preferable to permanent nested scrolling.
- Treat local web and MCP as different containers, not different View products. Unsupported host
  capabilities must fail explicitly.
- Put mutations only behind declared governed actions and trusted-shell confirmation. Generated
  previews remain script-free and read-only; they are not a second durable View format.
- Avoid copied authoritative values, redundant metadata, oversized headings, horizontal scrolling,
  inaccessible contrast, and styling that assumes one fixed host size.

# Fresh-agent proof

Give an agent with no repository-source context a different registered bundle and only the shipped
AgentState guidance. Ask it to create a useful `Latest documents` durable View that:

1. discovers the bundle and the View contract without source-code archaeology;
2. queries a bounded set of documents and makes ordering/truncation honest;
3. lets a human select a record and renders its authoritative body through `render-document`;
4. remains useful at narrow inline width and expanded/full-page width; and
5. invokes the exact same registered View through local web and MCP.

Record every point where live coaching, source reading, guessed protocol behavior, duplicate
Markdown code, or host-specific View code was required. Turn only observed recurring friction into
product code.

# Acceptance

- The fresh agent authors and promotes the View from shipped guidance alone.
- The same source version is resolved through web and MCP.
- A selected document renders canonical headings, lists, inline code, and inert concept markers.
- No View-local Markdown parser or host-specific fork is present.
- Any code follow-up is justified by a concrete failed or awkward step from the proof.

[depends on](mcp-durable-view-promotion-discovery.md)

[depends on](mcp-app-presentation-sizing.md)

[enabled by shared rendering](shared-view-document-rendering.md)
