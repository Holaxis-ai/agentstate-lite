---
type: Task
title: Unify durable View security across web and MCP hosts
status: in_progress
priority: '1'
assignee: research-agent
actor: openai/research-agent
description: >-
  Revise and re-review the shared launch-bound View authority design;
  implementation remains blocked on private Stage 0 disposition and exact-design
  approval.
timestamp: '2026-07-26T23:58:41.308Z'
---
# Objective

Establish how durable registered Views can run with unchanged source and the same bridge contract
across the local web UI and supported MCP App hosts. Authority must live in one server-side,
launch-bound `BridgeService` consumed by `ui-server` and `mcp-app`; browsers and presentations
forward only an opaque launch plus a bounded request. Preserve the passive generated-presentation
mode without turning it into a second durable View system.

# Required evidence

Trace the current web View and MCP App trust boundaries end to end; identify shared authorities
versus duplicated host logic; examine MCP Apps host/tool/resource constraints; evaluate active
content confidentiality, capability revocation, subscriptions, navigation, actions, version
binding, source provenance, local authorization, server-side linearization/currentness, protocol
bounds, host compatibility, and teardown.

# Deliverables

1. A comprehensive design at `designs/mcp-view-security-model-unification`.
2. Explicit migration/implementation sequence with the smallest proving slice.
3. Independent exact-document review recorded before implementation begins.
4. Reconcile or supersede `designs/mcp-durable-view-promotion-discovery`; do not silently leave contradictory guidance active.
5. Address every blocking finding in
   [the first exact-document review](../reviews/mcp-view-security-model-unification.md), then
   independently re-review the revised exact version.

# Mandatory Stage 0 gate

Before any implementation or public concrete-mechanics discussion:

1. Complete the private current-main security disposition under the repository disclosure policy.
2. Record private clearance for public implementation.
3. Approve the revised exact design.
4. Freeze the session-only authorization scope, `active-view-v1` admission profile, bounded broker
   contract, and adversarial-QA plan.

This public task must not contain concrete current-main failure mechanics.

# Scope gate

Research and design only. Do not modify product code or start implementation until the mandatory
Stage 0 gate is complete. The first proof remains read-only; v1 actions wait until the durable read
proof and its adversarial QA pass.
