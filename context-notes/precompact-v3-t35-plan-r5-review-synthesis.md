---
type: Context Note
title: Revision 3 T3.5 exact-R5 review synthesis — FAIL
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T23:57:16.474Z'
---
# Summary

Exact Plan R5 `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c` is **FAIL** at the required dual-review gate. Product/acceptance returned unqualified PASS, while the independent adversarial skeptic found two load-bearing executability gaps. A split verdict is FAIL; no F0/H0/code, Claude/auth use, live acceptance, or G0 is authorized.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: select and exact-host-ground the smallest causal cleanup/descendant-observability repair, then publish and dual-review a new Plan digest before implementation; this serves the ultimate goal by ensuring terminal absence is attributable to executable ownership/containment rather than an unobservable ancestry assumption.

## Exact independent reviews

- Product/acceptance PASS: `context-notes/precompact-v3-t35-plan-accept-r5@sha256:ce8b51a0166f2a40ef45e5cdf8a95285cf52cd0542097f088754b46153ce601d` (confidence 0.98).
- Adversarial-skeptic FAIL: `context-notes/precompact-v3-t35-plan-skeptic-r5@sha256:16ae6eb14cc0fcdeb962f9475eec4f9748b1c014bde880fcab47e1c207c0e09a` (confidence 0.97).

Both reviews verified and read the same exact Plan digest in full and remained isolated until their verdicts were immutable.

## What survived

R5 retains the accepted R4 candidate/freeze/verifier/campaign/wrapper/auth/lifecycle rail and closes the primary server/session-client late-bind race. Surviving contracts include one executable codec/transition authority; strict raw schemas; transactional one-build/one-pack freeze; factored existing-tarball verification; history-before-current ledger and crash-atomic lock; challenge-bound R0/Q0; serialized L0; deterministic close+EOF/fresh-generation corruption wrapper; API-key-only isolated auth; supported SessionStart(compact) restoration; pre-release secret-free quarantine; post-release FAIL; explicit argv0; commandless foreground tmux; separately gated no-auth `-N` session client; no `sess`; corrected Darwin ps grammar; separate pane PGID; exclusive raw-signal reaper; bounded PID TOCTOU; process-first stale-socket cleanup; Review-before-QA; and non-substitutability of fake/smoke evidence for live compaction.

## Blocker 1: unmodeled cleanup-control clients

R5 says `REAPING` fences future tmux actions and first proves clients absent, yet later spawns/retries `tmux -N` control/kill-server clients. Those clients have no reservation, durable identity, lease ownership, crash disposition, command allowlist, or final-absence record; a second cleaner is allowed to retry them. The cleanup algorithm therefore either violates its own fence or can leave an unowned late control principal.

Minimum repair: make every cleanup control invocation an explicit no-auth reaper-lease-owned principal/action in the same transition function. Pin its exact `-N` argv and closed command set, reserve/identify before use, serialize it under the destructive lease, define crash/recovery, prove PID/group absence, retain raw/final audit rows, forbid non-lease-holder control, and assert “all clients absent” only after the last cleanup-control principal is absent. Scheduler coverage must include spawn-before-record, connect/action/receipt gaps, control-versus-signal/two-cleaner races, server exit/reuse, and resume after proposed CLEAN.

## Blocker 2: unobservable universal descendant/escape claim

R5 requires exact PID/start/uid/PGID records for every short-lived direct managed hook and any escaped descendant. Normal managed lanes invoke the immutable installed helper directly; they do not self-record through the acceptance harness, the supported host evidence does not expose hook PID/start/PGID, and T3.5 forbids a production receipt channel. Sampled ps can miss a short-lived hook. Killing the server before descendant groups also destroys ancestry while Claude/hooks may still create or reparent a child. A final snapshot cannot attribute an otherwise unmarked same-uid escaped process.

The next architecture must choose explicitly between:

1. a stronger causal identity/containment surface, which may reopen T3/host evidence and needs real proof before Plan PASS; or
2. an honestly narrower guarantee under the non-malicious-same-uid, machine-controlled pilot: direct managed hook completion is proven by the supported synchronous host join plus exact effect/output; long-lived auth-capable principals are contained in and proven absent from recorded process groups/known identities; arbitrary detached/unmarked escape is not claimed. Cleanup must stop/fence the descendant launcher and prove known descendant/group absence before destroying the ancestry/control surface. Product/acceptance and skeptic must explicitly agree on this scope, and exact host tests must exercise a short-lived direct managed hook plus a deliberately detached/new-PGID child to establish the chosen rejection/containment boundary.

## Disagreement and lesson

Acceptance judged the refreshed tree and final audit sufficient; the skeptic showed that completeness was not observable for short-lived direct hooks or an unseen detached process. This is a genuine model correction, not a wording issue. The next review must ask what real observation or containment makes each terminal claim recomputable; no summary, fake scheduler, or harmless pane can fill an absent host surface.

## Next gate

Before another Plan mutation, independent architecture, product/acceptance, and skeptic roles will adjudicate the minimum executable repair and exact host proof needed. If they converge, one planner publishes a new Plan digest by CAS and it receives fresh dual exact review. If they do not, implementation remains blocked and the unresolved product/host decision returns to the user.

[tracked by](../tasks/pre-compact-multi-session.md)
