---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T21:07:56.973Z'
---
# Summary

Revision 3 reorientation after a Codex context boundary on 2026-08-03.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: finish the reviewed revision-3 implementation, freeze one immutable candidate, and prove its delivery rail on the pinned Claude host; this serves the ultimate goal by making concurrent-session compaction recovery conflict-safe and empirically trustworthy.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, agentstate-lite, holaxis-orchestrator, and holaxis-agent-launcher.

## Current system model

The pilot has five components: Claude Code emits lifecycle events; one managed `aslite hook run` adapter parses and maps event-valid JSON; a private `CompactionHandoffAuthority` owns identity, extraction, validation, state transitions, and receipts; a host-local journal stores content outside the project bundle; and isolated automated/live harnesses prove the exact packaged candidate. The observed installed-host order is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`. PreCompact may run even when compaction is declined. SessionStart is therefore the only load-bearing restore point, PreCompact is the only pre-boundary preparation point, and PostCompact is audit-only.

The journal is exact-identity, private, bounded, and CAS guarded. Its namespace includes canonical project identity and complete execution identity `(runtime, session_id, agent_id|null)`. A mutable identity-local head selects generation-addressed records; state changes use record CAS, and selecting a new generation never overwrites older content. Delivery proves context was emitted, but Stop cannot causally prove that the model consumed one particular nonce, so response observation is informational and never changes delivery/redelivery policy.

Hook installation is a separate safety boundary. Managed-command recognition is structural, never substring-based. Compact and fresh-resume handoff paths run no board/network/render work. Completed writes claim process-level atomicity and read-back verification only; no fsync crash-durability claim is made. The authority owns journal-root readiness, so install/status, the helper, and actual PreCompact execution cannot disagree about a symlinked, over-permissive, or inaccessible root.

## Progress and exact gates

The exact design and implementation plan passed independent lifecycle, product/acceptance, and adversarial plan review. T0 supplied process-level fixtures and boundary-driven tests. T1's private authority passed exact-SHA independent review at `a77ef92fa009ee424497317c129c6a6f88f122ef`, including interrupted-fence recovery. T2's five-event adapter and structural installer passed exact-SHA independent review at `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854`.

Those reviewed chains are integrated on `feat/precompact-handoff-v3` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`. T3's first cross-boundary review found two real defects: helper health bypassed journal-root initialization, and the helper/live harness used a second root override. Commit `579de4df5076f042282d0292db6ead0839f97ef3` repairs both by delegating readiness to `HandoffStore.initialize()` and using only `AGENTSTATE_LITE_HANDOFF_ROOT`. Focused integration, frozen contracts, the combined relevant suite, the full CLI suite, typecheck, and build are green. An independent exact-SHA T3 re-review is running now.

No T4 documentation, candidate freeze, QA, or live acceptance starts until that T3 review passes. After T4, the full check gate freezes one packed digest and manifest; Review, QA, negative-host tests, real manual/automatic main compaction, and real subagent acceptance must all consume that same artifact. Any code repair creates a new SHA and restarts downstream review.

## Unverified assumptions and remaining risks

- Whether the exact pinned Claude host exposes enough sub-agent context pressure to force and observe a real sub-agent compaction journey.
- Whether real PreCompact blocking and SessionStart fail-closed results are enforced as expected for missing/killed/timed-out helper cases.
- Whether the eventual packed artifact's installed command path, helper digest, and permissions remain identical through every acceptance gate.
- Physical deletion timing when the authority is never invoked again; the design guarantees logical expiry and explicitly does not claim a wall-clock daemon.
- T3 is not accepted until the independent reviewer attacks the repaired journal-root boundary at exact SHA `579de4d` and records PASS.

The deprecated fixed `context-notes/pre-compact-main` remains unsafe by design and points to session-scoped history. Revision 3 replaces that convention with the exact private authority; it does not revive the fixed-id rail.

[tracked by](../tasks/pre-compact-multi-session.md)
