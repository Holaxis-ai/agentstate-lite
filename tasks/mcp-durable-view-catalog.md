---
type: Task
title: 'Implement the shared durable View catalog across CLI, MCP, and web'
status: done
priority: '1'
assignee: openai/codex
description: >-
  Shipped in PR #184 (merge 187036f): one shared durable View catalog authority
  projected through CLI view list, MCP list_views, and the web launcher;
  presentation remains advisory, invalid entries fail closed, and MCP discovery
  is bounded and continuable. Exact-SHA review approved and CI passed on Node
  20/22/26.
actor: openai/codex
timestamp: '2026-08-02T03:06:45.351Z'
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
- Order deterministically by stable View ID. MCP output is bounded to 20 rows per page and active
  admission work to 40 registrations per call. Report the exact access-compatible registration
  total from heads, the page-local examined/unavailable counts, and truncation; accept an opaque
  continuation cursor that advances by the last examined registration, including broken entries.
  Never claim an exact launchable total without reading every blob. Deduplicate shared entry probes
  within one catalog operation.
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

# Implementation evidence

Draft PR [#184](https://github.com/Holaxis-ai/agentstate-lite/pull/184) implements the first unit on
commit `2c26af5`: one shared catalog authority; CLI, MCP, and web projections; advisory
presentation; entry-key confinement; active-HTML admission; and hard-bounded MCP admission work.
The full repository gate passed, including package/skill proofs, 8 MCP browser tests, and 19 web UI
acceptance tests. Independent exact-SHA review approved the final commit with no findings after an
adversarial read-count test proved the 40-registration work bound and broken-entry continuation.
