---
type: Context Note
title: Compaction checkpoint design v1 result
actor: codex-checkpoint-design-architect
timestamp: '2026-08-08T17:43:33.907Z'
---
# Summary

Completed the runtime-neutral v1 lifecycle design and persisted it as
[designs/compaction-context-checkpoint-lifecycle-v1](../designs/compaction-context-checkpoint-lifecycle-v1.md),
version `sha256:c042dda8878d96ed93bfb58827395e49400d330f449e91a2bca51f24d15c4f9b`.

The selected contract uses one mutable exact-subject selector, immutable same-bearer semantic
generations, and material lifecycle receipts over the existing agentstate-lite storage/CAS seam.
Every successful root/subagent turn must receive a same-bearer `changed` or `unchanged` verdict.
A proven pre-model Turn Ticket permits a no-extra-model-request fast path; otherwise or when the
bearer forgets, Stop enforces exactly one continuation and then fails open visibly. Unchanged turns
perform one small selector CAS but create no generation or receipt document. Changed turns create
one immutable generation plus selector CAS. Lifecycle hooks never sync or push the board.

`PreCompact` is only a bounded freshness guard. Post-loss restore performs exact
selector-generation-selector validation and fails closed on lineage/carrier ambiguity. Codex
0.147.0 and Claude Code 2.1.226 are conditional capture+restore pending named empirical gates.
OpenCode 1.2.15/1.18.15 is restore-only plus inspectable/manual; semantic capture is unsupported
while it lacks an original-bearer primitive. Ungraceful loss retains only the last confirmed
checkpoint and reports the gap.

# Alternatives rejected

Rejected per-host architectures, transcript/host-summary promotion, full semantic notes every
turn, purely last-moment capture, a mutable-only latest note, immutable generations without an
authoritative selector, zero-write unchanged inference, latest-wins restore, and every private
journal/daemon/broker/tmux/transcript-database variant. These either violate same-bearer meaning,
concurrency, single-store ownership, or bounded liveness, or create unacceptable churn.

# Empirical probe gates

- Codex and Claude: prove a pre-model Turn Ticket channel or accept the one-continuation fallback;
  trace manual/automatic compact event ordering and failure modes; prove root/two-sibling one-shot
  Stop behavior; resolve continuity/carrier/fork/resume/concurrent-resume identity; sweep payload
  limits; compare ordinary stop, interrupt, API failure, and kill; and verify configuration
  preservation/readiness.
- OpenCode: prove awaited system-transform ordering, bounded adapter-local failure, exact
  session/project/parent/fork/restart/concurrent identity, event-race independence, payload bounds,
  and V2 compatibility before any new claim. Do not probe toward full capture without a new
  same-original-bearer capability.

# Cost and caveats

The deliberate low-churn cost is one mutable selector CAS per successfully assessed turn. On a
filesystem board, repeated unchanged turns overwrite the same locally dirty file before later
user-directed sync; no lifecycle callback commits/pushes. A missed assessment costs at most one
extra model continuation. These costs, fail-closed carrier ambiguity, and no automatic v1 retention
deletion are explicit independent-review targets.

No genuine one-way-door product/security/compatibility question requires Brian at this phase. The
next action is independent review of the design before implementation planning.
