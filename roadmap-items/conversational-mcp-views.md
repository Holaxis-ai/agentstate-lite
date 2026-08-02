---
type: Roadmap Item
title: Conversational Views through MCP Apps
status: active
description: >-
  ACTIVE — one portable durable View across web and MCP. Shared discovery
  shipped in PR #184 and shared bounded document rendering in PRs #188/#189.
  Active unit: unify authoring guidance and run fresh-agent cross-bundle dogfood
  before adding navigation or action mechanics.
sequence: >-
  Shared View catalog shipped → shared document rendering shipped → unified
  authoring guidance + fresh-agent dogfood → explicit view-create decision →
  navigation parity → later action parity → fresh-agent cross-host proof
actor: openai/codex
timestamp: '2026-08-02T17:30:20.510Z'
---
# Direction

AgentState has one portable durable View model. The web launcher, MCP Apps, View-to-View
navigation, and future hosts are invocation adapters over the same registered View identity,
source bytes, requested access, admission policy, bridge semantics, and authorization subject.
Authorization decisions remain local. Unsupported host capabilities fail explicitly rather than
creating host-specific View kinds.

Governing architecture:
[One portable View model](../designs/unified-portable-view-model.md).

Supporting security authority:
[MCP and web View security-model unification](../designs/mcp-view-security-model-unification.md).

The earlier [Conversational Generative Views](../designs/mcp-app-generative-views.md) design remains
the authority for the fixed MCP shell and transient generated preview containment. Generated HTML
is a View preview, not a separate durable MCP View format.

# Product boundary

The OSS npm artifact owns one local STDIO MCP adapter scoped explicitly to one bundle. Agents use
the CLI for general bundle work. MCP remains a small presentation surface: a bounded catalog and
generic `show_view` invocation for durable Views, plus the existing transient preview path.

Remote workspaces, authentication, multi-tenant hosting, and a broader remote-agent CRUD surface
remain separate decisions.

# Current state

Shipped and proved:

- fixed MCP App shell and generated preview containment;
- bounded exact-snapshot selection and governed preview actions;
- shared active-View registration, launch, exact-byte trust, and bridge authority;
- unchanged durable View execution in web and MCP;
- one shared durable View catalog projected through CLI `view list`, MCP `list_views`, and the
  web launcher, with bounded continuation and fail-closed admission;
- intrinsic sizing and automatic suspension recovery; and
- one shared bounded Markdown renderer, currently consumed by trusted web document pages and
  generated MCP bindings.

Current parity gaps:

- durable authoring remains a hand-coordinated blob/registry sequence;
- standard Markdown/document rendering is not exposed to registered Views;
- MCP rejects the shared runtime's validated `open-page` outcome; and
- durable MCP currently supports `bundle-read`, not `bundle-propose`.

# Sequence

1. **Shared View catalog — shipped in PR #184.** One authority is projected as CLI `view list`,
   MCP `list_views`, and the web launcher. Presentation intent is advisory, never an eligibility
   gate; bounded results report total/truncation and provide continuation.
2. **Unified authoring guidance and dogfood — active next unit.** Teach one durable View workflow
   plus transient previews, then repeat the fresh-agent cross-bundle journey before adding more
   mechanics.
3. **Create ergonomics decision and unit.** If explicitly accepted as the mechanism-level
   framework exception, update and implement the create-only `aslite view create` design using
   `access` and current admission checks.
4. **Shared document rendering.** Specify and security-review a bounded `render-document` bridge
   row while keeping rendering in `markdown-renderer`.
5. **Navigation parity.** Handle `open-page` in MCP with independent target launch authorization
   and add cross-host agreement tests.
6. **Later capability parity.** Consider durable governed actions only after read/render/navigation
   semantics stabilize.
7. **End-to-end proof.** A fresh agent creates one durable View ID, discovers it, invokes that exact
   ID in conversation, and opens the same ID in the web launcher without source-code archaeology.

[contains](../tasks/mcp-durable-view-catalog.md)

[related authoring](../tasks/mcp-view-authoring-guidance.md)

[related create ergonomics](../tasks/cli-view-create-verb.md)

[related bridge work](../tasks/ui-pages-bridge-v1.md)

# Delivered units and supporting records

[MCP App presentation sizing](../research/mcp-app-presentation-sizing.md)

[Prior durable promotion/discovery design](../designs/mcp-durable-view-promotion-discovery.md)

[contains](../tasks/mcp-app-fixed-shell-spike.md)

[contains](../tasks/mcp-app-markdown-rendering-proof.md)

[contains](../tasks/mcp-app-governed-action-spike.md)

[contains](../tasks/mcp-shared-markdown-renderer-main.md)

[contains](../tasks/mcp-view-runtime-extraction-main.md)

[contains](../tasks/mcp-app-query-selection.md)

[contains](../tasks/mcp-durable-view-promotion-discovery.md)

[contains](../tasks/mcp-app-presentation-sizing.md)

[contains](../tasks/mcp-view-security-model-unification.md)

[contains](../tasks/mcp-durable-view-unchanged-proof.md)

[contains](../tasks/mcp-install-verb.md)

[contains](../tasks/mcp-stdio-error-routing.md)

[contains](../tasks/mcp-durable-view-intrinsic-sizing.md)

[simple-prompt unlock: bundle self-description for generated views](../tasks/mcp-generated-view-type-discovery.md)

[contains](../tasks/pr-177-review.md)

[contains](../tasks/pr-177-fix-validation.md)

[contains](../tasks/shared-view-document-rendering.md)
