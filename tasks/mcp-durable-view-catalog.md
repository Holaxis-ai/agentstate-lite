---
type: Task
title: 'Implement the shared durable View catalog across CLI, MCP, and web'
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  One shared catalog authority projected as CLI view list, MCP list_views, and
  the web launcher; presentation is advisory, results are bounded and
  continuable, and host access support fails honestly.
actor: openai/codex
timestamp: '2026-08-01T20:10:04.642Z'
---
# Behavioral claim

One shared catalog authority describes the bundle's valid durable Views, and the CLI, MCP adapter,
and web launcher project that authority without inventing different View eligibility rules.

An agent can list durable Views, choose one by stable ID, and immediately invoke that exact ID via
the existing generic `show_view({viewId})` path. A human sees the same valid View set in the web
launcher.

# Governing design

[One portable View model](../designs/unified-portable-view-model.md).

This task supersedes its earlier MCP-only `inline|adaptive` catalog scope. Presentation is advisory,
not a compatibility or security gate.

[Prior catalog design being refined](../designs/mcp-durable-view-promotion-discovery.md).

# Scope

- Add one host-neutral catalog service using the existing View registration and access authorities;
  do not add a second registry parser.
- Project it through a coherent CLI `view list` command, one model-visible read-only MCP
  `list_views` tool with no App resource, and the existing web launcher.
- Return stable View ID, title, optional description, requested access, and optional advisory
  presentation preference. Never return entry keys, HTML, registry bodies, credentials, nonces,
  approval state, or authorization-store details.
- Keep `presentation: workspace | inline | adaptive` optional and advisory. It may influence ranking,
  warnings, or initial display mode; it must never decide whether a valid access-supported View is
  listed or invokable.
- Reuse the current registration grammar and declared-access resolution. Invalid registrations are
  not represented as invokable.
- Each adapter filters only access levels it actually supports and reports unsupported-access and
  invalid counts honestly. Durable MCP supports `bundle-read` in this unit.
- Order deterministically by stable View ID. MCP output is bounded to 20 rows per page, reports the
  compatible total and truncation, and accepts an opaque continuation cursor for later rows.
- Keep the web launcher behavior and visual design otherwise unchanged; this is authority
  consolidation and discovery, not a UI redesign.
- Add agreement tests proving all three surfaces derive their rows from the shared authority and
  that every MCP-listed ID is accepted by durable `show_view` under the same support policy.
- Do not add View creation, generated-preview persistence, Markdown rendering, navigation parity,
  new access levels, or remote hosting in this unit.

# Done when

- `aslite view list` gives an agent the bounded, truthful durable View catalog;
- MCP `list_views` discovers the same access-supported IDs and can continue past the first page;
- the web launcher consumes the shared catalog authority rather than maintaining an independent
  registration mapping path;
- presentation metadata cannot hide an otherwise supported View;
- invalid and unsupported registrations are excluded with honest bounded counts; and
- focused agreement tests plus the full repository gate pass.
