---
type: Task
title: Unify durable View security across web and MCP hosts
status: in_progress
priority: '1'
assignee: research-agent
actor: openai/codex
description: >-
  Research and design one durable View security/bridge contract shared by the
  local web UI and MCP App host. Design must receive independent review before
  implementation starts.
timestamp: '2026-07-26T23:24:48.770Z'
---
# Objective

Establish whether and how durable registered Views can run unchanged across the local web UI and MCP App host using one sandbox, access-capability, bridge, query, and governed-action model. Preserve the script-free ephemeral generated-presentation tier without turning it into a second durable View system.

# Required evidence

Trace the current web View and MCP App trust boundaries end to end; identify shared authorities versus duplicated host logic; examine MCP Apps host/tool/resource constraints; evaluate exfiltration, capability revocation, subscriptions, navigation, actions, version binding, and content provenance.

# Deliverables

1. A comprehensive design at `designs/mcp-view-security-model-unification`.
2. Explicit migration/implementation sequence with the smallest proving slice.
3. Independent exact-document review recorded before implementation begins.
4. Reconcile or supersede `designs/mcp-durable-view-promotion-discovery`; do not silently leave contradictory guidance active.

# Scope gate

Research and design only. Do not modify product code or start implementation until the reviewed design is accepted.
