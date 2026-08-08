---
type: Context Note
title: Runtime-neutral compaction checkpoint domain model result
actor: codex-checkpoint-domain-modeler
timestamp: '2026-08-08T17:13:04.226Z'
---
# Summary

The runtime-neutral compaction-checkpoint domain-model phase is complete. The deliverable is
[designs/compaction-checkpoint-domain-model](../designs/compaction-checkpoint-domain-model.md) at
`sha256:51ef57197ba2aec56959ef6f45392008daec130905830e2b4f5c20e9148f34fe`; the owning
[Task](../tasks/compaction-checkpoint-domain-model.md) is `done`.

**Ultimate goal:** Make agent work durable across compactions, sessions, and handoffs without human
checkpoint reminders.

**Proximate goal achieved:** Independent runtime researchers now have one non-overlapping vocabulary,
identity/ownership model, freshness and restoration state machines, invariant set, adapter boundary,
capability-question matrix, and research handoff contract. This prevents Claude-specific hook and
pilot vocabulary from becoming the product architecture by accident.

Stable conclusions: freshness is a derived relation rather than timestamp recency; meaningful
preservation requires same-context-bearer semantic synthesis rather than external-state copying;
automatic restoration requires exact project/continuity/context-bearer identity; `DELIVERED` is not
model consumption; dirty checkpoint attempts and boundary delays must be bounded; checkpoints remain
ordinary bundle documents; and runtimes missing capabilities must expose an honest degraded mode.

No production implementation, document topology, hook, journal, transcript mechanism, broker, or
retention policy was selected. Material gaps intentionally remain research questions, especially
host-specific pre-loss continuation, identity stability across compaction/resume, pre-model restore
injection, timeout/block semantics, subagent coverage, ungraceful-loss fallback, and privacy-safe
dirty detection. Historical Claude pilot findings were used only for stable hazards and scoped
starting evidence.

Next action: run isolated capability research for Codex, Claude Code, and OpenCode against the matrix,
then synthesize a design that justifies every host-specific exception against the shared invariants.
The orchestrator owns review and bundle sync; this agent did not run `aslite sync`.
