---
type: Context Note
title: Compaction checkpoint design v1 independent review result
description: >-
  FAIL review handoff, blocking repairs, survived architecture, and pending
  privacy activation decision.
tags: 'compaction-checkpoint,design-review,fail,handoff'
actor: codex-checkpoint-design-critic
timestamp: '2026-08-08T17:56:24.667Z'
---
# Summary

**Ultimate goal:** Make agent work durable across compaction and session boundaries without human checkpoint reminders.

**Proximate goal:** Independently determine whether lifecycle design v1 is exact enough for implementation planning; this protects the ultimate goal from untestable currentness, liveness, and restore claims.

## Outcome

The independent review is complete with verdict **FAIL**. The durable review is [compaction context checkpoint lifecycle v1 design review](../reviews/compaction-context-checkpoint-lifecycle-v1-design-review.md) at `sha256:f81c5832ca7566546e7303b8d0c23c7f6ca65f818d190338cd052c78705cb3a3`, targeting design version `sha256:c042dda8878d96ed93bfb58827395e49400d330f449e91a2bca51f24d15c4f9b`.

Blocking defects are:

1. an assessment action is not a mechanically terminal cut, so it does not prove that later generation in the same turn introduced no new semantic state;
2. deterministic attempt IDs deduplicate writes but cannot enforce at-most-one host continuation across parallel Stop handlers or crash/replay;
3. carrier ambiguity has no registration/fencing protocol capable of detecting simultaneous carriers before restore or divergent commit.

High findings cover selector/bootstrap/currentness contradictions, restore time-of-check/time-of-delivery, privacy/default activation plus disable/re-enable and retention, and OpenCode's missing exact post-loss trigger. The per-turn selector/write and fallback-continuation cost is measurable but lacks an acceptance budget.

The shared-core/thin-adapter direction, strict same-bearer rule, immutable generation plus CAS selector topology, PreCompact-as-guard boundary, delivery-versus-consumption honesty, no automatic sync, and foreign-config preservation all survived review.

## Pending one-way-door decision

Brian must decide whether hook install/upgrade may enable automatic semantic checkpoint persistence by default for a project whose bundle may be shared/public, or whether explicit per-project opt-in after visibility and Git-history irreversibility disclosure is required. No answer was assumed.

## Cognitive-ecosystem check

The design is unusually legible, but legibility does not resolve controllability: default semantic persistence can create an irreversible shared-history disclosure. Session-boundary survivability also remains incomplete until terminal assessment and carrier fencing are executable, and stale restore is a semantic-error propagation risk even when every operational call succeeds.

## Next gate

Implementation planning remains blocked. A generator should make the smallest coherent repairs in the Review, preserve the pending Brian decision, publish a new exact design version, and request independent re-review. Only after architecture passes should the named runtime probes promote any support tier.

No source code, configuration, Git state, runtime settings, or tests were changed. Automatic bundle pulls were disabled for every read, and `aslite sync` was not run.
