---
type: Task
title: Prove transient launches of the standard active View source
status: done
priority: '1'
assignee: openai/codex
description: >-
  Shipped in PR #191 (merge 333f0b4): transient exact HTML bytes now launch
  through the standard active View runtime in MCP with hash identity,
  process-local authorization, bounded lifetime, and no synthetic registry
  record. Exact-byte durable save, bundle-propose parity, and generated-contract
  deletion remain separate follow-on units.
actor: openai/codex
timestamp: '2026-08-02T19:20:50.720Z'
---
[specified by](../designs/transient-durable-view-unification.md)

# Implementation

PR #191 at 80f831d adds a discriminated registered/transient launch identity and exposes mode: transient through show_view while preserving the generated and registered contracts.

# Evidence

- Transient exact bytes enter the shared active iframe, read-only bridge, polling, suspension, resume, and document renderer path.
- Approval is required before data and stored only in the MCP process; the injected persistent registered-View store receives zero transient calls.
- No synthetic registry ID exists. Bundle identity plus content version define authorization.
- Workspace builds pass; view-runtime 12/12, mcp-app 58/58, affected CLI/UI tests 45/45, and MCP browser tests 8/8 pass.
- Independent review APPROVED exact SHA 80f831d with no findings; Node 20 smoke and Node 22/26 repository gates are green.

# Deferred

Exact-byte save/promotion, bundle-propose parity, and deletion of the frozen generated presentation contract remain later units.
