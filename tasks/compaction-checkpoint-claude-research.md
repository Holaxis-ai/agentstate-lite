---
type: Task
title: Research Claude Code compaction checkpoint capabilities
status: done
priority: '1'
description: >-
  Completed Claude Code 2.1.226 lifecycle matrix, adapter boundary, and isolated
  validation gaps.
actor: codex-checkpoint-claude-researcher
assignee: codex-checkpoint-claude-researcher
timestamp: '2026-08-08T17:25:08.550Z'
---
# Goal

Establish version-scoped Claude Code lifecycle facts against the shared compaction-checkpoint
capability matrix, without reviving the canceled Claude-only architecture.

**Ultimate goal:** Make agent context durable across compaction/session boundaries without human
checkpoint reminders.

**Proximate goal:** Determine exactly which shared checkpoint invariants Claude Code can satisfy,
which thin adapter surfaces are genuinely Claude-specific, and where honest degradation remains.

# Required inputs

- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md)
- [current implementation baseline](../context-notes/compaction-checkpoint-current-architecture-2026-08-08.md)
- [canceled Claude pilot](pre-compact-multi-session.md), used selectively as historical evidence
- [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md)

# Deliverable

Write `research/compaction-checkpoint-claude-capabilities` using the domain model's research handoff
contract. Answer every capability-matrix row with `yes`, `no`, `conditional`, or `unknown`; record
version/build/platform/date, evidence class and source, event order, payload and identity fields,
timeouts/output/failure behavior, scenario coverage, relevant shared invariants, confidence, and
remaining gaps.

Use current official Anthropic/Claude Code documentation as the primary authority and inspect the
installed Claude Code surface/version. Clearly label historical pilot facts and revalidate only the
minimum facts needed; do not traverse or inherit the pilot architecture wholesale. Include exact
citations/URLs.

# Constraints and acceptance

- Load the `agentstate-lite` skill and use only primary official technical sources for web research.
- Read-only repository work. No code, branch, real host config, hook install, auth mutation, or
  external mutation.
- Any empirical check must use isolated temporary config/data and must not rely on or alter the
  user's live Claude state.
- Claude-specific mechanisms are evidence for a thin adapter only, never the shared protocol.
- Record the strongest honest degraded mode for absent capabilities.
- Write a phase-result Context Note and close this Task only when all matrix rows are addressed.
- Do not run `aslite sync`; the orchestrator owns synchronization.

[depends on](compaction-checkpoint-domain-model.md)

# Outcome

Completed 2026-08-08 against Claude Code 2.1.226 on Darwin arm64/macOS 26.6. The 17-row evidence matrix, lifecycle/failure semantics, isolated probe gaps, and runtime-neutral adapter constraints are recorded in [Claude Code compaction-checkpoint capabilities](../research/compaction-checkpoint-claude-capabilities.md). The phase handoff is [Claude Code compaction-checkpoint research result](../context-notes/compaction-checkpoint-claude-research-result.md).

Architecture-level conclusion: Claude supplies conditional lifecycle transport—not shared durability. `PreCompact` can validate/block but cannot invoke same-bearer semantic synthesis; proactive synthesis is available at successful `Stop`/`SubagentStop`; compact-sourced `SessionStart` supplies a bounded restoration gate. Concurrent resume makes `session_id` insufficient as a unique carrier key. Shared persistence, CAS, generation/freshness, ambiguity handling, and receipt levels remain runtime-neutral core concerns.

No repository code or host configuration was changed, no live Claude state/model was used, and `aslite sync` was not run.
