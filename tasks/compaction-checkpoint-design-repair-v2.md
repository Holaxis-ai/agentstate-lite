---
type: Task
title: Repair compaction checkpoint lifecycle design for v2
status: in_progress
priority: '1'
description: >-
  Close every blocker and high-severity finding from the independent v1 design
  review before implementation planning.
actor: codex-checkpoint-design-architect-v2
timestamp: '2026-08-08T17:57:24.816Z'
---
# Goal

Repair the runtime-neutral compaction checkpoint lifecycle after the independent v1 design review, producing one exact v2 design that can be implemented without inventing semantics or weakening the strict same-bearer/currentness invariants.

**Ultimate goal:** Make agent work durable across compaction and session boundaries without human checkpoint reminders.

**Proximate goal:** Close every architectural defect in the failed v1 review before implementation planning; this keeps the eventual feature safe, bounded, host-honest, and low-intervention.

# Inputs

- [failed v1 design review](../reviews/compaction-context-checkpoint-lifecycle-v1-design-review.md)
- [v1 lifecycle design](../designs/compaction-context-checkpoint-lifecycle-v1.md)
- [authoritative lifecycle task](compaction-context-checkpoint-lifecycle.md)
- [domain model](../designs/compaction-checkpoint-domain-model.md)
- [cross-runtime synthesis](../context-notes/compaction-checkpoint-cross-runtime-synthesis-2026-08-08.md)
- Runtime research for [Codex](../research/compaction-checkpoint-codex-capabilities.md), [Claude](../research/compaction-checkpoint-claude-capabilities.md), and [OpenCode](../research/compaction-checkpoint-opencode-capabilities.md).

# Required repairs

1. Replace action-time Turn Ticket assertions with a mechanically terminal assessment cut, or explicitly lower the promise where no target host can prove one. Define first-subject creation, ticket authority, replay protection, and the exact terminal evidence consumed by Stop.
2. Replace “exactly one continuation” with a CAS-owned stop-obligation state machine that proves at-most-one requested continuation under parallel handlers, replay, and crash; state liveness separately and fail visibly when a claimed request has uncertain delivery.
3. Define carrier registration/fencing, execution-nonce provenance, active-set or lease semantics, renew/end/expiry/restart behavior, and fail-closed ambiguity before restore or changed commit. Include a per-host root/child/compaction/resume/fork/duplicate-resume mapping.
4. Complete expect-absent bootstrap, baseline/no-generation semantics, derived freshness, selector conflict handling, immutable-byte replay validation, and the exact changed-confirmation/cost sequence.
5. Close the selector-v2-to-delivery race with a bounded restore fence honored by writers, or explicitly weaken the feature promise. Preserve exact-current restoration unless evidence makes it impossible.
6. Keep Brian’s default-enablement ruling as an explicit unresolved policy input until answered. Independently add policy epochs, disable/uninstall invalidation, re-enable fresh-assessment barrier, legacy activation rules, bounded retention/inspection, and public-Git irreversibility disclosure.
7. For OpenCode, require a synchronous transform-time loss/restore-obligation source with single-delivery deduplication; otherwise downgrade automatic restore to inspectable/manual.
8. Define measurable go/no-go budgets before implementation planning: extra-continuation rate, p50/p95 local and remote latency, selector bytes/history growth, sync/conflict rate, and board/awareness impact.

# Acceptance criteria

- Publish a new immutable `designs/compaction-context-checkpoint-lifecycle-v2`; do not rewrite v1.
- Provide normative state-transition tables and executable red-proof scenarios for every repaired safety/liveness claim.
- Distinguish architecture that is guaranteed by the shared core from claims that remain runtime-probe gated.
- Preserve runtime-neutral semantics and use a host-specific exception only where a measured host constraint requires it.
- Do not add a second persistence, identity, or coordination system.
- Identify any new one-way-door question; do not decide Brian’s pending privacy/default-enablement policy.
- Persist a phase Context Note, CAS-close this Task, and do not run `aslite sync`.

# Outcome

Pending.
