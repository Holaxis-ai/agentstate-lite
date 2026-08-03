---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T18:26:22.729Z'
---
# Summary

Revision 3 reorientation after context boundary.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: revise the revision-3 compaction handoff design and implementation plan until independent lifecycle, product, and adversarial reviewers accept the delivery rail; this serves the ultimate goal by preventing implementation against an internally inconsistent or unprovable lifecycle contract.

## Current system model

The pilot has five components: Claude Code emits lifecycle events; one managed `aslite hook run` adapter parses and maps event-valid JSON; a private `CompactionHandoffAuthority` owns identity, extraction, validation, state transitions, and receipts; a host-local journal stores content outside the project bundle; and isolated automated/live harnesses prove the exact packaged candidate. The observed installed-host order is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`. PreCompact may run even when compaction is declined. SessionStart is therefore the only load-bearing restore point, PreCompact is the only pre-boundary preparation point, and PostCompact is audit-only.

The journal must be exact-identity, private, bounded, and CAS guarded. Its namespace includes both canonical project identity and the complete execution identity `(runtime, session_id, agent_id|null)`. A mutable identity-local head selects generation-addressed records; their state changes only under record CAS, and selecting a new generation never overwrites older content. Storing a record's own content-addressed version inside itself is impossible. Delivery proves context was emitted, but Stop cannot causally prove that the model consumed one particular nonce, so response observation is informational and never changes delivery/redelivery policy.

Hook installation is a separate safety boundary. Managed-command recognition must be structural, never substring-based: the installed foreign SessionStart `printf` contains the words `agentstate-lite` and would otherwise be destructively misclassified. Compact and fresh-resume handoff paths run no board/network/render work, preventing that best-effort path from delaying or overflowing model context. Completed writes claim process-level atomicity and read-back verification only; no fsync crash-durability claim is made.

## Plan-gate state

The first independent plan gate failed, correctly, and its findings were closed. The second gate produced one product PASS and two narrow FAILs. The revised exact design now: gives final heads a hard seven-day logical expiry plus exact-CAS event-driven physical cleanup; refuses stale prepared/delivered cards on resume using transcript checkpoints; makes Stop observations incapable of suppressing redelivery; removes board work from load-bearing SessionStart paths; pins Claude support to executable digest/version/platform/architecture; and requires real manual and automatic PreCompact blocking tests. These corrections are awaiting the third exact-version gate.

## Unverified assumptions

- Whether the exact Claude host exposes enough sub-agent context pressure to force and observe a real sub-agent compaction journey.
- What Claude does when a hook executable is missing, killed, or exceeds timeout; a hook cannot emit fail-closed JSON if the host never invokes it.
- Whether a real PreCompact blocking result and SessionStart `continue:false` are displayed and enforced as documented on Claude Code 2.1.220.
- The exact packaged command path/digest and permissions that will be installed for the candidate.
- Physical deletion timing on a host where the authority is never invoked again; the design guarantees logical expiry and explicitly does not claim a wall-clock daemon.

No production code starts until the revised exact design and plan versions pass all three independent reviewers. Board changes remain unsynced until those reviewers finish writing.
