---
type: Context Note
title: Revision 3 adversarial plan-gate review (fast skeptic)
actor: codex-precompact-v3-plan-skeptic-fast
timestamp: '2026-08-03T18:12:19.695Z'
---
# Summary

**FAIL** — confidence **0.94**. Revision 3 fixes the rejected revision-2 rail and is close to implementable, but six load-bearing contradictions or unproved claims must be resolved before production code starts.

## Blocking findings

1. **The persisted schema requires an impossible self-version.** The design requires the record to contain its “current record version.” The filesystem backend’s version token is the SHA-256 of the serialized document bytes, so putting the current token inside those same bytes has no implementable stable value. Remove that field from persisted content. Carry the head version only as read/write receipt metadata and pass it separately to validation/CAS.

2. **Project identity is promised but absent from the key and comparison contract.** The prose says project/bundle identity is hashed into the local namespace, but the specified slot is `handoffs/v1/claude-code/<execution-key>`, and `execution-key` hashes only runtime, session id, and agent id. A resumed session invoked while a different bundle resolves can therefore hit a record whose execution tuple matches. Define a canonical project key, include it in the physical namespace, and byte-compare stored versus currently resolved project identity on every transition.

3. **Single-slot overwrite contradicts acknowledged retention and GC.** The same document is single-occupancy, yet a new PreCompact over an acknowledged slot creates a new generation immediately while acknowledged records are said to remain auditable and GC-eligible after 24 hours. On the local filesystem backend, overwritten document history is not retained. Use a CAS head/slot plus generation-addressed records (or another explicit archive shape) so acknowledgement retention and physical GC are real; otherwise delete the retention/GC claim and acceptance criteria.

4. **A Stop event cannot prove the delivery nonce it acknowledges.** The nonce is minted and stored by SessionStart, but no specified Stop/SubagentStop input carries it. Reading the current nonce only proves what is in storage, not that this Stop’s model response consumed that delivery. A late Stop from an older process can acknowledge a newer `source:resume` redelivery for the same host identity, allowing a later PreCompact to replace it. Add a host/process-attempt binding or transcript checkpoint that makes acknowledgement causal, prove concurrent resume is impossible on the supported host, or weaken acknowledgement so it cannot authorize replacement/collection.

5. **The stated sub-agent product claim has no installed-host acceptance gate.** The live probe proves a main-session rail. The plan’s manual and automatic live journeys do not require a real sub-agent to compact and reach SessionStart(compact) plus SubagentStop with stable `agent_id`; its “subagent identity” concurrency supplement can be satisfied by fixtures. Either add a real installed sub-agent compaction journey or narrow the pilot/status claim to main sessions.

6. **The fail-closed SessionStart behavior remains assumed rather than live-proved.** The probe proves valid `additionalContext`, but not that top-level `continue:false` on `source:compact` is accepted and actually halts continuation after a missing/corrupt/stale record. That is the load-bearing negative path, especially because exit-code gating was already disproved. Add an isolated installed-host fault-injection journey and require no post-compaction model response/no unverified premise before calling the rail safe.

## Attacks that survived

- The installed-host evidence establishes the real order `PreCompact -> SessionStart(compact) -> PostCompact`; the design no longer waits for or trusts PostCompact.
- Declined manual compaction is handled by CAS-refreshing a still-prepared generation, while delivered state is protected from overwrite.
- Full 64-hex execution keys, byte-for-byte stored identity checks, no prefix/singleton fallback, structured unknown decision slots, a named GC owner, and a private `~/.agentstate` placement are sound directions.
- The plan correctly places independent exact-SHA Review before adversarial QA and live manual/automatic acceptance.

## Required plan revision

Resolve findings 1–6 in the design and add explicit T0 interface fixtures for persisted schema, project namespace, acknowledgement evidence, and the SessionStart negative response. Then rerun the plan gate. Do not begin T1/T2 on the current draft.

## Goal state

Ultimate goal: preserve agentstate-lite as shared, versioned, conflict-safe memory. Proximate review goal: prevent revision 3 from implementing an internally contradictory or unverified compaction authority. Progress: blocker review complete; next action is design/plan correction followed by a new independent gate.
