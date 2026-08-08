---
type: Task
title: Research OpenCode compaction checkpoint capabilities
status: done
priority: '1'
description: >-
  Establish OpenCode lifecycle and identity capabilities and the strongest
  honest degraded behavior.
actor: codex-checkpoint-opencode-researcher
timestamp: '2026-08-08T17:27:33.925Z'
---
# Goal

Establish version-scoped OpenCode lifecycle facts against the shared compaction-checkpoint
capability matrix, including whether the existing system-transform plugin can do more than startup
orientation.

**Ultimate goal:** Make agent context durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Determine exactly which shared checkpoint invariants OpenCode can satisfy and
define the strongest honest fallback when lifecycle surfaces are missing.

# Required inputs

- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md)
- [current implementation baseline](../context-notes/compaction-checkpoint-current-architecture-2026-08-08.md)
- [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md)

# Deliverable

Write `research/compaction-checkpoint-opencode-capabilities` using the domain model's research
handoff contract. Answer every capability-matrix row with `yes`, `no`, `conditional`, or `unknown`;
record version/build/platform/date, evidence class and source, event order, payload and identity
fields, timeouts/output/failure behavior, scenario coverage, relevant shared invariants, confidence,
and remaining gaps.

Use current official OpenCode documentation and upstream source as primary technical authorities,
then inspect the installed OpenCode surface/version and the existing generated adapter. Include
exact citations/URLs and distinguish documented, source-inspected, and empirical facts.

# Constraints and acceptance

- Load the `agentstate-lite` skill and use primary official/upstream sources for technical claims.
- Read-only repository work. No code, branch, real host config, plugin install, auth mutation, or
  external mutation.
- Any empirical check must use isolated temporary config/data and must not rely on or alter the
  user's live OpenCode state.
- Do not treat a plugin `sessionID` cache key as stable checkpoint identity without evidence.
- Record the strongest honest degraded mode for absent capabilities.
- Write a phase-result Context Note and close this Task only when all matrix rows are addressed.
- Do not run `aslite sync`; the orchestrator owns synchronization.

[depends on](compaction-checkpoint-domain-model.md)

# Outcome

Completed 2026-08-08 by `codex-checkpoint-opencode-researcher`.

- Deliverable: `research/compaction-checkpoint-opencode-capabilities` version `sha256:42bae79aa4e990cc6c7bb714648d487d67500ba56392aca0c8fdb4d70b793744`.
- Phase result: `context-notes/compaction-checkpoint-opencode-research-result` version `sha256:7f3fd033036eb3cf8ef94b4421eff3b00315acdfe4c187ea895047086cd3f0da`.
- All 17 domain-model capability questions are answered with target version/build/platform/date, evidence class and primary source, ordering/payload/identity/failure facts, scenario and invariant impact, confidence, and deterministic gaps.
- Strongest honest classification: full automated lifecycle and strict-S2 capture-only are unsupported; restore-only is conditional; inspectable/manual is supported. The current adapter remains startup-orientation injection, not compaction checkpointing.
- Repository code and live OpenCode state were left unchanged. No `aslite sync` was run.
