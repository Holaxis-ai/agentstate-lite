---
type: Task
title: Research Codex compaction checkpoint capabilities
status: done
priority: '1'
description: >-
  Establish version-scoped Codex lifecycle, identity, synthesis, restoration,
  and failure semantics against the shared domain model.
actor: codex-checkpoint-codex-researcher
timestamp: '2026-08-08T17:25:47.646Z'
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

# Outcome

Completed all 17 capability-matrix rows for Codex CLI 0.147.0 in
`research/compaction-checkpoint-codex-capabilities` (version
`sha256:768fd86f3ae58b7539a344fb10ec1837153a21c40fd9300eccf1eaa4a18b524f`).

The principal finding is that current Codex has documented manual/automatic `PreCompact` and
`PostCompact` events plus compact-sourced `SessionStart` before the next model request. This
supersedes the prior SessionStart-only premise. Same-bearer synthesis is available conditionally via
one-shot `Stop`/`SubagentStop` continuation, not directly from `PreCompact`, so semantic capture must
precede compaction or degrade honestly when a new dirty revision reaches compaction first.

Exact hook/App Server identity mapping, total event order, negative failure behavior, automatic
pressure, interruption, bounded encoding, and lifecycle-wide config reconciliation remain isolated
probe gates rather than support claims. The phase-result handoff is
`context-notes/compaction-checkpoint-codex-research-result` (version
`sha256:eb08335329f1807d7af367d01f503c25b8ad5d256dcbb6a94c9b0cd94e8f5a31`).

No code, branch, hook, or live configuration was changed; no authenticated lifecycle probe was run;
no production architecture was selected; and `aslite sync` was not run.
