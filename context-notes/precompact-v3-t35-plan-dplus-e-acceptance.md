---
type: Context Note
title: Revision 3 T3.5 D+E scratch Plan acceptance
actor: codex-precompact-v3-t35-plan-dplus-e-acceptance
timestamp: '2026-08-04T02:48:02.970Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.98**.

Build authorization: **NO**.

The exact scratch Plan has the right objective, scope, synchronous one-authority architecture, lifecycle/storage invariants, evidence layers, and Review-before-QA-before-live ordering. It is substantially better than the rejected host-probe plan. Four build-gate gaps remain: observer mutation is ambiguous and contradicts the synthesis nonmutation rule; the live rail omits the supported subagent journey and exact PreCompact red gates; the candidate is not manifest-frozen before Review/QA/live; and the inherited v5 evidence plus head-CAS-loser orphan lifecycle are not exact pre-build inputs. These are Plan repairs, not a request to revisit the selected architecture.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text, offline-first, and owned by the user.

Proximate goal: decide whether the exact D+E scratch Plan can govern one implementation whose synchronous authority, durable CAS journal, and layered evidence prove exact Claude compaction restoration without background-process scope; this serves the ultimate goal by making the compaction continuity harness buildable and independently auditable.

## Exact inputs and isolation

I read in full:

- scratch Plan `/private/tmp/precompact-v3-t35-plan-dplus-e-draft.md@sha256:a4b816f0d69c5b8f45261eed92a3816a484d3b6ef534070a3f692c672c9e4314`; and
- synthesis `context-notes/precompact-v3-alternatives-synthesis@sha256:6b93a5a7b96577e986123d20bc629513dc60be69ffc3bdabf3c0a5ad67b6ad1b`.

I did not edit the canonical Plan, design, task, source, code, or repository. I did not run probes, tests, child modes, tmux, Claude, auth, or network. The distinct acceptance note and required board sync are the only mutations.

## Blocking Plan defects and minimum repairs

### 1. Observation is not structurally side-effect-free

The selected architecture requires observer nonmutation. The Plan instead says “Observers may read/append bounded informational metadata” and calls Stop an “observation-only” transition. It does not distinguish content-free `status`/`diagnose`/health from Stop/SubagentStop response audit. A builder could therefore make a diagnostic read append metadata, refresh a storage version, create a missing journal, run GC, or create CAS interference while still claiming conformance.

Minimum repair:

- Define `status`, `diagnose`, and health as **pure observers**: zero journal writes, directory creation, GC/recovery calls, settings writes, service/process starts, head selection, and content output. Instrumented tests assert an empty effect ledger when state exists, is missing, or is corrupt.
- If Stop/SubagentStop response evidence remains, name it `response_audit`, not observer. It is one bounded expected-version CAS append to the exact current delivered generation, never head/delivery/expiry/GC/recovery state. Ambiguity or conflict is a no-op. Its optional metadata cannot affect restore or deletion eligibility.
- Alternatively remove response audit entirely. Do not retain the current generic “observer may append” authority.

### 2. The live supported-identity and red-rail gates are incomplete

The Plan defines exact `agent_id`, mechanical main/subagent roles, and sibling isolation, but live acceptance contains only manual and automatic compaction without an explicit subagent journey. Fake identity vectors and captured event fixtures cannot prove that installed Claude supplies a stable subagent `agent_id` across real PreCompact → compact SessionStart → PostCompact → first response → SubagentStop.

The Plan also lists helper timeout/nonzero and manual/automatic triggers, but does not explicitly require a real successfully-invoked PreCompact block under both `trigger: manual` and `trigger: auto`. A low-level timeout test plus a compact SessionStart `continue:false` test would satisfy the current wording while leaving the PreCompact rail unproved.

Minimum repair:

- Add a separate real subagent compaction gate on the exact installed host. Require stable exact `session_id`/`agent_id`, correct project/execution selection, pre-only canaries, first-response restoration/next action, PostCompact audit, SubagentStop handling, and sibling/main nonselection.
- Add exact-host negative gates for real PreCompact block under manual and automatic triggers, real compact SessionStart top-level `continue:false`, missing/moved helper, non-executable helper, and timeout. Each must prove no first post-compaction response where blocking is claimed and unchanged foreign settings/state.
- Keep manual main, automatic main, and subagent journeys separate; inability to exercise any required journey is `BLOCKED-PENDING-VERIFICATION`, not PASS.

### 3. Artifact freezing occurs after the gates that need it

Step 6 reviews an exact source SHA, Step 7 runs QA, and Step 8 says to “freeze artifacts and adjudicate digests.” Freezing at live acceptance is too late. The Plan does not require Review, QA, negative host rails, and live compaction to consume one immutable candidate manifest. The general statement that changes invalidate a freeze does not identify which bytes were frozen or force control back to Review.

Minimum repair: insert a `G0 candidate freeze` after implementation and local tests, before independent Review. G0 runs targeted suites, packaging checks, and the complete repository check, then writes one manifest containing at least source commit/tree, package/tarball digest and version, exact helper path/digest, schema/adapter/fixture/harness digests, v5 evidence references, and resolved Claude realpath/digest/version/platform/architecture. Dependencies become:

`Contract freeze -> Build/tests -> G0 manifest -> exact-manifest Review -> exact-manifest QA -> negative host rails -> manual main -> automatic main -> subagent live acceptance`.

Any source, test, package, helper, schema, harness, evidence reference, or host-tuple drift invalidates the manifest and returns to G0 and independent source Review before QA or live execution. Review approval remains a hard dependency before QA.

### 4. Historical evidence and CAS-orphan cleanup are not exact work inputs

The Plan promises digest-only reuse of v5 tmux facts but names no artifact id or digest. “Freeze v5 evidence digests before implementation” is not assigned to a concrete pre-build task or acceptance receipt. A builder/reviewer could select different historical bytes or inherit a stronger claim than the evidence supports.

The Plan also covers a displaced winner but does not specify the reachable publication orphan: generation creation succeeds, head CAS loses, and the unreferenced create-only generation remains. Without an exact terminal state and GC rule, duplicate/idempotent create or recovery can be used to guess around it.

Minimum repair:

- Contract/schema task must bind the exact v5 source/evidence ids and SHA-256 values, installed host/tool tuple, and an enumerated predicate/nonclaim list before any builder task. Review and manifest carry those exact references. If an exact fact is absent or stale, remove the claim rather than rerun the rejected negative query.
- Add `orphan_unreferenced` as an explicit non-restorable generation disposition. A head-CAS loser never retries by repointing or overwriting the winner. The orphan retains its fixed prepare-derived expiry and is eligible only for sole-owner, expected-version, bounded GC. Diagnosis is content-free; recovery cannot promote it. Add interruption/fault tests at create-success/head-CAS-fail/readback boundaries.

## Requirements that survive

### Objective, product scope, and nonclaims

The Plan correctly targets cognitive durability through `SessionStart(source=compact)`, not uninterrupted computation. It excludes detached work, a daemon, launchd, tmux production authority, fresh negative-query probing, power-loss durability, PID-safe signaling, cross-machine restore, and PostCompact causal acknowledgement. This matches the product core and alternatives synthesis.

Remove `lease` from the domain term `lease/expiry` or define it explicitly as fixed, non-renewable logical expiry with no ownership/heartbeat semantics; revision 3 otherwise has no production lease.

### One executable authority

`CompactionHandoffAuthority` is the sole identity, validation, transcript, state-transition, CAS, selection, delivery, diagnosis, recovery, and GC authority. The adapter only parses documented input and maps event-valid output. Fake and filesystem adapters call the same transitions rather than implementing parallel policy. This boundary is implementable and reviewable.

### Exact identity, schema, CAS, GC, and recovery

The Plan preserves full canonical project/execution tuples, stored-byte comparison, collision and malformed-input rejection, no identity fallback, create-only generation history, mutable exact head, expected-version mutation, readback, compact delivery final-current checks, resume freshness, fixed logical expiry, sole event-driven GC, version-guarded quarantine/recovery, 0700/0600 boundaries, and process-level-only durability. These are the correct non-negotiable invariants.

### Evidence separation

Policy/fake, filesystem, exact-host, historical v5, and real-Claude evidence are separated, with explicit nonclaims and retained strict rows. The traceability matrix generally maps claims to the right authority. Fakes do not stand in for Claude; v5 does not stand in for the rail. The four repairs above make the provenance chain exact.

### Dependency ordering

Architect contract precedes authority; policy/filesystem tests precede the host adapter; independent code Review precedes QA; QA precedes live compaction; manual and automatic are separate. This satisfies the required Review-before-QA gate. Add the pre-Review manifest and subagent live dependency described above; do not move QA ahead of Review merely because QA coauthors fixtures earlier.

## Decision

**FAIL. Build authorization: NO.** Revise only the Plan-level contracts and ordering above, then repeat exact product and skeptic Plan review. The selected D+E architecture itself is accepted; no new host-primitive alternatives loop or tmux probe is warranted.

[tracked by](../tasks/pre-compact-multi-session.md)
