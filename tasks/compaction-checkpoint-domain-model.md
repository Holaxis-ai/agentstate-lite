---
type: Task
title: Define runtime-neutral compaction checkpoint domain model
status: done
priority: '1'
description: >-
  Establish the shared vocabulary, state model, invariants, and host-adapter
  boundaries before cross-runtime research and design.
actor: codex-checkpoint-domain-modeler
timestamp: '2026-08-08T17:12:37.188Z'
---
# Goal

Create the shared vocabulary and system model that all later compaction-checkpoint research,
design, implementation, review, and QA will use.

**Ultimate goal:** Make agent work durable across compactions and session boundaries without human
checkpoint reminders.

**Proximate goal:** Define runtime-neutral entities, identities, states, events, transitions,
invariants, failure classes, and host-adapter boundaries before selecting implementation mechanics.

This serves the ultimate goal by preventing one runtime's hook vocabulary from silently becoming
the product architecture.

# Scope

- Read the [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md) and
  [reconciliation decision](../decisions/compaction-context-checkpoint-reconciliation.md).
- Treat the canceled [Claude pilot](pre-compact-multi-session.md) and its linked artifacts as
  evidence only.
- Distinguish product concepts from Codex, Claude Code, and OpenCode adapter concepts.
- Model agent/session identity, substantive-work dirtiness, checkpoint freshness, synthesis,
  persistence, restoration, lifecycle boundaries, retries/loop prevention, and degraded behavior.
- Record unknowns as research questions rather than filling them with host assumptions.

# Deliverable and acceptance criteria

Write `designs/compaction-checkpoint-domain-model` with:

1. a concise taxonomy with non-overlapping definitions;
2. entities and ownership boundaries;
3. state machines or transition tables for checkpoint freshness and restoration;
4. safety, liveness, privacy, durability, and concurrency invariants;
5. explicit shared-core versus host-adapter boundaries;
6. a capability-question matrix for Codex, Claude Code, and OpenCode research; and
7. unresolved questions whose answers could materially alter the design.

The artifact must be usable by independent researchers without additional oral context. No code,
hook installation, host mutation, or production design selection is in scope.

# Workflow

The assigned modeler claims this Task with its own actor, loads the agentstate-lite skill, reads
repository instructions, uses the bundle at `/Users/brian/GitHub/agentstate-lite/.agentstate-lite`,
and writes a phase-boundary Context Note summarizing its result. The orchestrator will review and
sync the bundle.

[depends on](compaction-context-checkpoint-lifecycle.md)

# Outcome

Completed by `codex-checkpoint-domain-modeler` on 2026-08-08. The durable deliverable is
[the runtime-neutral domain model](../designs/compaction-checkpoint-domain-model.md), version
`sha256:51ef57197ba2aec56959ef6f45392008daec130905830e2b4f5c20e9148f34fe`.

The model supplies the required non-overlapping taxonomy; exact checkpoint-subject identity and
ownership boundaries; subject-obligation, derived freshness, and restoration state machines;
safety, liveness, privacy, durability, and concurrency invariants; shared-core versus host-adapter
responsibilities; a cross-runtime capability-question matrix; and material unresolved questions.
It selects no production implementation and treats all unverified host facts as research work.

# Current status

Domain-model phase complete. The next gate is independent Codex, Claude Code, and OpenCode
capability research using the artifact's research handoff contract. The orchestrator owns bundle
review and sync.
