---
type: Task
title: Audit OKF v0.2 compatibility and define the migration contract
status: done
priority: '1'
description: >-
  Evidence-first audit of AgentState's v0.1 behavior against OKF v0.2; produces
  the policy and only then executable implementation units.
actor: openai/codex
assignee: openai/codex
timestamp: '2026-08-05T02:15:57.224Z'
---
# Objective

Produce an evidence-backed compatibility matrix between AgentState's current OKF v0.1 contract and
OKF v0.2, then recommend the smallest honest migration policy.

# Result

Complete. AgentState is a sound v0.1 writer and a useful permissive v0.2 reader/transporter, but it
must not yet claim v0.2 authoring or mutation conformance.

The audit demonstrated two blocking semantic gaps:

1. v0.2 meaningful writes must update `generated.at` without inventing `generated.by` provenance or
   allowing old verification to appear current.
2. v0.2's global document-lifecycle `status` collides with AgentState's established type-specific
   workflow statuses.

It also demonstrated a smaller scalar-preservation issue: YAML date-only fields can be rewritten as
datetimes. The upstream specification has the same ambiguity recorded in issue #240.

# Deliverables

- [Compatibility audit](../research/okf-v0-2-compatibility-audit.md)
- [Adopted migration design](../designs/okf-compatibility-and-upstream-stewardship.md)
- [Guard unsupported version claims](./okf-version-claim-guard.md)
- [Publish the producer report](./okf-upstream-producer-report.md)
- [Implement the v0.2 write contract after adjudication](./okf-v0-2-write-contract.md)

# Evidence boundary

Probes used upstream commit `599a24029400b32436bc58c425d722e8ad8d221f` and AgentState Lite commit
`8d0253a40bc00f9c7997e177a70b21f829769e8e`. The repository build passed. No production code was
changed by this audit.
