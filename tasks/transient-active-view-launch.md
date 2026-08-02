---
type: Task
title: Prove transient launches of the standard active View source
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  First executable unit of designs/transient-durable-view-unification: add a
  real hash-identified, process-local transient source to the shared active-View
  launch authority and expose it through MCP without removing the existing
  generated presentation path. Prove authorization-before-data, standard bridge
  behavior, bounded lifecycle, and no synthetic registry identity. Exact-byte
  save, bundle-propose parity, and deletion remain separate follow-on units.
actor: openai/codex
timestamp: '2026-08-02T19:07:07.375Z'
---
[specified by](../designs/transient-durable-view-unification.md)

# Implementation

PR #191 at 6f18dbc adds a discriminated registered/transient launch identity and exposes mode: transient through show_view while preserving the generated and registered contracts.

# Evidence

- Transient exact bytes enter the shared active iframe, read-only bridge, polling, suspension, resume, and document renderer path.
- Approval is required before data and stored only in the MCP process; the injected persistent registered-View store receives zero transient calls.
- No synthetic registry ID exists. Bundle identity plus content version define authorization.
- Workspace builds pass; view-runtime 12/12, mcp-app 58/58, and affected CLI/UI tests 45/45 pass.

# Deferred

Exact-byte save/promotion, bundle-propose parity, and deletion of the frozen generated presentation contract remain later units.
