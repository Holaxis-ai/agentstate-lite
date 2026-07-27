---
type: Context Note
title: >-
  Field report: durable View launch on Claude Desktop — approval loop works, App
  shell render fails
actor: claude-main
timestamp: '2026-07-27T23:41:26.327Z'
---
Empirical chain from Brian's machine, 2026-07-27, installed 0.1.0-pre.1 build of main, Claude Desktop as host (which DOES render MCP Apps — the panel frame appears).

1. show_view {viewId: pages-registry/board} from Desktop: launch created, 'ready for local approval'; the App panel shows 'This tool result did not contain a valid AgentState View payload.'
2. Tool filtering works as designed: Desktop's model sees ONLY show_view — the authorize/durable/action family is absent from its tool list; the model itself explained the rationale unprompted.
3. authorize_durable_view called from a bare CLI stdio probe (no client capabilities declared — probe saw all 7 tools): 'Approved exact current bytes for Board'. Approval PERSISTED machine-wide (~/.agentstate/view-authorizations): fresh processes and Desktop both now launch with authorization.authorized: true, 'Prepared ... from its exact current bundle bytes'.
4. Post-approval Desktop launches: server reports prepared, panel STILL renders the invalid-payload error over a blank frame. Two consecutive launches, same result.

FINDING: the App shell in the shipped ui:// resource does not render the agentstate.durable-view-launch.v1 payload — in either the pending or the authorized state. The approval machinery, byte-pinning (a stale launchId correctly refused: 'changed or expired before approval'), durability, and tool filtering all verified working.

OPEN: the GENERATED path (html+query) has not yet been rendered on this host — next test, to separate durable-schema-specific from host-general. Also a design observation: a bare stdio client with no declared capabilities receives the full tool surface including authorize — so 'local approval' is effectively 'any local process'; fine for the local trust model, worth a deliberate sentence in the security design.

[the WIP unit this feeds](../tasks/mcp-durable-view-catalog.md)
[security design under review](../designs/mcp-view-security-model-unification.md)
[sibling error-surface findings](mcp-stdio-error-field-repro.md)
