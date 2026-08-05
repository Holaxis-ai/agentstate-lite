---
type: Task
title: Audit OKF v0.2 compatibility and define the migration contract
status: todo
priority: '1'
description: >-
  Evidence-first audit of AgentState's v0.1 behavior against OKF v0.2; produces
  the policy and only then executable implementation units.
actor: openai/codex
timestamp: '2026-08-05T02:00:50.995Z'
---
# Objective

Produce an evidence-backed compatibility matrix between AgentState's current OKF v0.1 contract and
OKF v0.2, then recommend the smallest honest migration policy.

# Questions to settle

- Which v0.2 fields already round-trip through the generic document model unchanged?
- Does `generated.at` have the same semantics as AgentState's last-meaningful-change `timestamp`?
- How should `generated.by`, `verified`, and actor attribution compose without inventing trust?
- When a verified document changes, what must be invalidated or preserved?
- How should legacy `timestamp` and `# Citations` remain readable?
- Are `sources`, `status`, `stale_after`, and Attested Computation purely optional pass-through data,
  or do any require engine or CLI behavior?
- Do index generation, reserved files, links, imports, recipes, sync, and backend round trips remain
  conformant for both versions?
- What exact public conformance claim can AgentState make after the work?

# Deliverables

1. A v0.1/v0.2 read-write compatibility matrix with executable or fixture evidence.
2. A revision to the linked compatibility design recording the chosen policy.
3. A bounded list of implementation tasks, if any, each tied to a demonstrated gap.
4. A draft upstream producer report identifying findings useful to OKF maintainers.

# Not in scope

Implementing the migration, adding every v0.2 feature, changing AgentState's domain model, or opening
an upstream pull request before the findings are reviewed.

[specified by](../designs/okf-compatibility-and-upstream-stewardship.md)
