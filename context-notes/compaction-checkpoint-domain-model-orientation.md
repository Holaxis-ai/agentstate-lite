---
type: Context Note
title: Compaction checkpoint domain-model orientation
actor: codex-checkpoint-domain-modeler
timestamp: '2026-08-08T17:07:57.282Z'
---
# Summary

The domain-model task is claimed by `codex-checkpoint-domain-modeler`. The binding product owner is `tasks/compaction-context-checkpoint-lifecycle`; `decisions/compaction-context-checkpoint-reconciliation` requires a runtime-neutral core and confines any proven host exception to an adapter. The canceled Claude pilot remains evidence, not architecture authority.

**Ultimate goal:** Make agent work durable across compactions, sessions, and handoffs without human checkpoint reminders.

**Proximate goal:** Produce a non-overlapping vocabulary, state model, invariant set, ownership boundary, and host capability-question matrix that independent runtime researchers can use without oral context. This serves the ultimate goal by making preservation requirements stable before host mechanisms are selected.

Current phase: orientation complete; next is selective review of prior evidence followed by the self-contained domain-model artifact. Unverified assumptions include whether each host exposes pre-loss same-agent continuation, stable session/agent identity, post-compaction restoration injection, and bounded failure/timeout controls.
