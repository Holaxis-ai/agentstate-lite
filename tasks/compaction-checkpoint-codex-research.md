---
type: Task
title: Research Codex compaction checkpoint capabilities
status: todo
priority: '1'
description: >-
  Establish version-scoped Codex lifecycle, identity, synthesis, restoration,
  and failure semantics against the shared domain model.
actor: codex-compaction-orchestrator
timestamp: '2026-08-08T17:14:31.401Z'
---
# Goal

Establish version-scoped Codex lifecycle facts against the shared compaction-checkpoint capability
matrix, without selecting a production design.

**Ultimate goal:** Make agent context durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Determine exactly which shared checkpoint invariants Codex can satisfy, through
which evidenced adapter surfaces, and where honest degradation remains necessary.

# Required inputs

- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md)
- [current implementation baseline](../context-notes/compaction-checkpoint-current-architecture-2026-08-08.md)
- [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md)

# Deliverable

Write `research/compaction-checkpoint-codex-capabilities` using the domain model's research handoff
contract. Answer every capability-matrix row with `yes`, `no`, `conditional`, or `unknown`; record
version/build/platform/date, evidence class and source, event order, payload and identity fields,
timeouts/output/failure behavior, scenario coverage, relevant shared invariants, confidence, and
remaining gaps.

Use current official OpenAI documentation as the primary authority and inspect the installed Codex
surface/version. Clearly separate documented behavior, inspected implementation/config behavior,
and empirical observation. Include exact citations/URLs. Treat transcript formats as unstable unless
officially guaranteed.

# Constraints and acceptance

- Load the `openai-docs` and `agentstate-lite` skills and follow their source order.
- Read-only repository work. No code, branch, real host config, hook install, or external mutation.
- Any empirical check must use isolated temporary config/data and must not rely on or alter the
  user's live Codex state.
- Do not let Codex event names replace shared concepts and do not propose production architecture.
- Record the strongest honest degraded mode for absent capabilities.
- Write a phase-result Context Note and close this Task only when all matrix rows are addressed.
- Do not run `aslite sync`; the orchestrator owns synchronization.

[depends on](compaction-checkpoint-domain-model.md)
