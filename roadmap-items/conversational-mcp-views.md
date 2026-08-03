---
type: Roadmap Item
title: Conversational Views through MCP Apps
status: active
description: >-
  ACTIVE — the one-source View contract is now proven end to end. A transient
  active View queried and rendered live data, subscribed, saved exact bytes,
  reopened as a fresh durable identity in MCP, launched unchanged through the
  web host, and completed governed actions through both authorities. The
  superseded MCP-only generated-presentation contract is now ready for bounded
  deletion; navigation parity follows.
sequence: >-
  Unified foundations shipped → transient active launch shipped → exact-byte
  save shipped → bundle-propose parity shipped → cross-host acceptance passed →
  delete generated presentation contract → navigation parity
actor: openai/codex
timestamp: '2026-08-03T00:42:42.591Z'
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

The proposed [transient/durable source unification](../designs/transient-durable-view-unification.md)
narrows this model further: transient and registered Views use the same active HTML source and
runtime. Lifetime changes persistence and discoverability, not the View language or bridge.

The earlier [Conversational Generative Views](../designs/mcp-app-generative-views.md) design remains
the authority for the fixed MCP shell and transient generated preview containment. Generated HTML
is a View preview, not a separate durable MCP View format.

# Product boundary

The OSS npm artifact owns one local STDIO MCP adapter scoped explicitly to one bundle. Agents use
the CLI for general bundle work. MCP remains a small presentation surface: a bounded catalog and
generic `show_view` invocation accepting either a registered View or an exact, temporarily retained
active View source. The existing script-free generated preview remains only during the transition
and is deleted after transient launch, exact-byte save, and governed-action parity are proven.

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
- one shared bounded Markdown renderer and `render-document` bridge, consumed by durable Views
  across web and MCP as well as the remaining generated path.

Current work:

- prove a hash-identified, process-local transient source through the shared active-View authority;
- add server-owned exact-byte save into a durable registration;
- add `bundle-propose` parity for transient and durable MCP Views;
- remove the superseded generated snapshot/binding/presentation contract; and
- add MCP `open-page` navigation parity afterward.

# Sequence

1. **Shared View catalog — shipped in PR #184.** One authority is projected as CLI `view list`,
   MCP `list_views`, and the web launcher. Presentation intent is advisory, never an eligibility
   gate; bounded results report total/truncation and provide continuation.
2. **Durable foundations — shipped.** Shared bounded document rendering, authoring guidance, and
   cross-host dogfood now sit beside the catalog.
3. **Transient active-source proof — in progress.** Reuse the standard active View admission,
   authorization, bridge, and lifecycle without synthetic registry identity.
4. **Exact-byte save.** Persist the admitted transient bytes unchanged and register them durably.
5. **Governed-action parity.** Support `bundle-propose` for transient and durable MCP Views.
6. **Consolidation.** Delete the generated presentation contract once the replacement journey is
   proven.
7. **Navigation parity.** Add independently authorized MCP `open-page`.

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

[Proposed transient/durable source unification](../designs/transient-durable-view-unification.md)

[contains](../tasks/transient-active-view-launch.md)

[contains](../tasks/transient-view-exact-byte-save.md)

[contains](../tasks/transient-view-approval-copy.md)

[contains](../tasks/transient-authorization-store-isolation.md)

[contains](../tasks/mcp-active-view-bundle-propose.md)

[validated by](../context-notes/transient-durable-cross-host-acceptance-2026-08-02.md)

[contains](../tasks/retire-generated-mcp-presentations.md)
