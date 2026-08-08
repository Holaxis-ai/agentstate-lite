---
type: Task
title: Design runtime-neutral compaction checkpoint lifecycle v1
status: done
priority: '1'
description: >-
  Completed runtime-neutral v1 design; ready for independent design review
  before implementation planning.
actor: codex-checkpoint-design-architect
timestamp: '2026-08-08T17:43:54.259Z'
---
# Goal

Produce the reviewed runtime-neutral v1 design for lifecycle-driven semantic checkpoints, using the
completed domain model and runtime research without importing a host-specific architecture.

**Ultimate goal:** Make agent work durable across compactions, sessions, and handoffs without human
checkpoint reminders.

**Proximate goal:** Select the smallest architecture that satisfies the shared invariants on Codex
and Claude Code, provides honest degraded behavior on OpenCode and ungraceful loss, and is concrete
enough for an implementation plan and test strategy.

# Required inputs

- [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md)
- [runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md)
- [cross-runtime synthesis](../context-notes/compaction-checkpoint-cross-runtime-synthesis-2026-08-08.md)
- [Codex research](../research/compaction-checkpoint-codex-capabilities.md)
- [Claude research](../research/compaction-checkpoint-claude-capabilities.md)
- [OpenCode research](../research/compaction-checkpoint-opencode-capabilities.md)
- [reconciliation decision](../decisions/compaction-context-checkpoint-reconciliation.md)

# Required design content

Write `designs/compaction-context-checkpoint-lifecycle-v1` with:

1. problem statement, product promise, non-goals, and explicit per-runtime support tiers;
2. credible alternatives and rejection rationale, including per-host architectures, transcript or
   host-summary capture, every-turn/full-note checkpointing, purely last-moment capture, and the
   selected proactive/boundary protocol;
3. component boundaries for shared core, bundle/storage seam, lifecycle dispatcher, host adapters,
   hook configuration management, status/receipts, and operator controls;
4. exact logical schemas and identity/provenance rules for subject, carrier, context revision,
   immutable synthesis generation, mutable/current selector if any, attempt, and receipts;
5. state transitions and event sequences for successful root/subagent stop, trivial unchanged turn,
   forgotten checkpoint enforcement, manual/automatic compaction, compact restoration, resume,
   fork, simultaneous carriers, interruption/API failure/crash, and missing/stale helper;
6. a concrete solution to dirty detection versus low churn, including which event or agent action
   establishes a revision, how “unchanged” is confirmed, and which bundle documents mutate;
7. bounded same-bearer synthesis and loop prevention, with explicit proof that the protocol cannot
   continue or block forever;
8. CAS/concurrency, durability scope, migration from fixed/session-scoped notes, retention, privacy,
   redaction, payload sizing, delivery-versus-use semantics, and failure visibility;
9. install/upgrade/status/uninstall behavior that extends the current exact-ownership seam and
   preserves foreign configuration;
10. test seams and acceptance mapping, including the minimum deterministic host probes needed before
    each support claim; and
11. an exception ledger naming every host-specific mechanism, the invariant it serves, why the
    portable mechanism is insufficient, and why the exception remains adapter-local.

# Constraints and gate

- No code, branch, host mutation, or implementation plan yet.
- Keep strict same-bearer synthesis; do not weaken S2 merely to call OpenCode fully supported.
- Prefer reversible choices and ordinary bundle documents. No hidden journal, daemon, tmux broker,
  transcript database, or second knowledge/task store.
- Do not claim exact lifecycle behavior beyond the research evidence; use explicit probe gates.
- Identify any genuine one-way-door decision requiring Brian. Do not elevate reversible technical
  choices into questions.
- Write a phase-result Context Note and close this Task only when the artifact is ready for an
  independent design critic. Do not run `aslite sync`.

[depends on](compaction-checkpoint-codex-research.md)
[depends on](compaction-checkpoint-claude-research.md)
[depends on](compaction-checkpoint-opencode-research.md)

# Outcome

Completed 2026-08-08. The implementation-ready, code-free shared design is
[compaction-context-checkpoint-lifecycle-v1](../designs/compaction-context-checkpoint-lifecycle-v1.md)
at version `sha256:c042dda8878d96ed93bfb58827395e49400d330f449e91a2bca51f24d15c4f9b`.
The phase result is
[compaction-checkpoint-design-v1-result](../context-notes/compaction-checkpoint-design-v1-result.md)
at version `sha256:362297e2a0af8fae675d310fa92fd8e6fadabcce30302251698fec869473f474`.

Selected: one mutable exact-subject selector, immutable same-bearer semantic generations, material
receipts, proactive Turn Ticket fast path when proven, exactly-one Stop enforcement otherwise,
bounded PreCompact guard, and exact fail-closed restore. Unchanged turns perform one small selector
CAS and no generation/receipt document; lifecycle hooks never sync or push. Codex/Claude remain
conditional pending named probes. OpenCode is restore-only/manual and cannot claim semantic capture
without a same-original-bearer primitive. No one-way-door decision requires Brian. Ready for an
independent design critic; implementation planning remains a later phase.
