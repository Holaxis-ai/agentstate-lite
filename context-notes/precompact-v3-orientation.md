---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T21:28:38.356Z'
---
# Summary

Revision 3 reorientation after a Codex context boundary on 2026-08-03.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: close the newly identified T3.5 candidate-binding gap, review the complete rail, freeze one immutable candidate, and prove it on the pinned Claude host; this serves the ultimate goal by making concurrent-session compaction recovery conflict-safe and empirically trustworthy.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, agentstate-lite, holaxis-orchestrator, and holaxis-agent-launcher.

## Current system model

The pilot has five components: Claude Code emits lifecycle events; one managed `aslite hook run` adapter parses and maps event-valid JSON; a private `CompactionHandoffAuthority` owns identity, extraction, validation, state transitions, and receipts; a host-local journal stores content outside the project bundle; and isolated automated/live harnesses prove the exact packaged candidate. The observed installed-host order is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`. PreCompact may run even when compaction is declined. SessionStart is therefore the only load-bearing restore point, PreCompact is the only pre-boundary preparation point, and PostCompact is audit-only.

The journal is exact-identity, private, bounded, and CAS guarded. Its namespace includes canonical project identity and complete execution identity `(runtime, session_id, agent_id|null)`. A mutable identity-local head selects generation-addressed records; state changes use record CAS, and selecting a new generation never overwrites older content. Delivery proves context was emitted, but Stop cannot causally prove that the model consumed one particular nonce, so response observation is informational and never changes delivery/redelivery policy.

Hook installation is a separate safety boundary. Managed-command recognition is structural, never substring-based. Compact and fresh-resume handoff paths run no board/network/render work. Completed writes claim process-level atomicity and read-back verification only; no fsync crash-durability claim is made. The authority owns journal-root readiness, so install/status, the helper, and actual PreCompact execution cannot disagree about a symlinked, over-permissive, or inaccessible root.

## Progress and exact gates

The exact design and implementation plan passed independent lifecycle, product/acceptance, and adversarial plan review. T0 supplied process-level fixtures and boundary-driven tests. T1's private authority passed exact-SHA independent review at `a77ef92fa009ee424497317c129c6a6f88f122ef`, including interrupted-fence recovery. T2's five-event adapter and structural installer passed exact-SHA independent review at `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854`.

Those reviewed chains are integrated on `feat/precompact-handoff-v3` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`. T3's first cross-boundary review found two real defects: helper health bypassed journal-root initialization, and the helper/live harness used a second root override. The repair delegated readiness to `HandoffStore.initialize()` and retained only `AGENTSTATE_LITE_HANDOFF_ROOT`; exact-SHA T3 re-review passed at 0.99 confidence. T4 documentation was rebased onto current `origin/main` and package identity `0.1.0-pre.3`. Its first review caught one stale universal SessionStart claim; the regression-tested repair passed exact-SHA re-review at `36c741a8173832d75d61a7ab138b5219c4415c66` with 0.99 confidence. T0-T4 are now accepted.

A pre-G0 audit correctly blocked candidate freeze. The committed live harness still declares `phase: T0-isolation-only`; it does not bind an expected candidate manifest digest, install the already-frozen tarball, verify helper/harness/host identities, or carry a lane binding through L0-L3. The existing package verifier also always rebuilds and deletes its scratch artifact. `context-notes/precompact-v3-g0-readiness` therefore prescribes a test-first T3.5 `freeze`/`verify-existing` seam with strict manifest/path/digest schemas, exactly one build and pack, zero downstream rebuilds, lane-bound sanitized receipts, byte-drift attacks, and clean offline install proof. Independent adversarial and acceptance reviews of that prescription are running. No G0 freeze starts until T3.5 is implemented and exact-SHA reviewed.

## Unverified assumptions and remaining risks

- Whether the exact pinned Claude host exposes enough sub-agent context pressure to force and observe a real sub-agent compaction journey.
- Whether real PreCompact blocking and SessionStart fail-closed results are enforced as expected for missing/killed/timed-out helper cases.
- Whether the reviewed T3.5 design completely binds real Claude invocation, first-response canaries, event-sequence evidence, and outside/candidate inventories without operator-only convention.
- Whether the eventual packed artifact's installed command path, helper digest, harness digest, manifest digest, and permissions remain identical through every acceptance gate.
- Physical deletion timing when the authority is never invoked again; the design guarantees logical expiry and explicitly does not claim a wall-clock daemon.
- The first T3.5 plan failed both acceptance and skeptic review; the revised plan must name executable owners and red tests for the entire freeze-to-live-verdict chain before code begins.

The deprecated fixed `context-notes/pre-compact-main` remains unsafe by design and points to session-scoped history. Revision 3 replaces that convention with the exact private authority; it does not revive the fixed-id rail.

[tracked by](../tasks/pre-compact-multi-session.md)
