---
type: Context Note
title: Revision 3 T3.5 D+E scratch Plan R2 acceptance
actor: codex-precompact-v3-t35-plan-dplus-e-acceptance-r2
timestamp: '2026-08-04T02:54:48.595Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**.

R2 repairs the top-level R0 sequence and removes pre-Review QA from the lifecycle implementation table. It also names `claimResume`/`claimWork`. It does not repair the remaining load-bearing contracts: the claim state is disconnected from injection/refresh/GC selection and has no invocation transport; observers are still simultaneously absolute zero-write and append-capable; the random rail marker still enters the semantic decision card; v5/CAS/orphan/clock/missing-state/quarantine items remain unfrozen placeholders reviewed only after Build; one exact candidate manifest is absent; and the real subagent journey is still omitted.

The synchronous D+E architecture remains accepted. This verdict does not reopen tmux or process-supervisor alternatives.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text, offline-first, and owned by the user.

Proximate goal: decide whether exact R2 closes every R1 Plan blocker and can authorize the synchronous compaction-authority build; this serves the ultimate goal by preventing unresolved claim, observer, evidence, and gate semantics from being decided inside implementation.

## Exact input and isolation

I read in full and digest-verified:

- `/private/tmp/precompact-v3-t35-plan-dplus-e-draft-r2.md@sha256:154ac4772665792aff9b792d6603861ed02f6224f946931ab46ece6985b98750`; and
- prior review `context-notes/precompact-v3-t35-plan-dplus-e-acceptance-r1@sha256:94ba83c832bd7f275e22d94292ddfc735c00b1562d6c8c45add45958969656a2`.

I did not edit the canonical Plan, design, task, source, code, or repository. I did not run probes, tests, child modes, tmux, Claude, auth, or network. The distinct acceptance note and required board sync are the only mutations.

## Prior-blocker audit

### R0 inert live rail: **substantially repaired**

R0 is now its own `Build -> Review -> QA -> positive manual -> positive automatic -> negative manual/automatic block` chain before lifecycle Build. It is inert except for a temporary receipt and proves both supported SessionStart invocation and real PreCompact block behavior. This is the correct dependency direction.

The final Plan still needs R0's exact helper/harness/settings/project roots, allowed writes, timeout, cleanup receipt, expected event outputs, and installed Claude tuple frozen before R0 Review. R0 artifacts must be digest-bound; R0 proves rail capability only, never lifecycle policy.

### At-least-once delivery plus separate CAS work claim: **not repaired**

Separating immutable at-least-once injection from work claiming is correct. The named claim contract remains incomplete and internally inconsistent:

- SessionStart does not mark delivery, yet `claimResume|claimWork` transitions `prepared|delivered -> claimed`; the source and meaning of `delivered` are undefined.
- The authority generates the 256-bit token, but the Plan does not say how the exact token/generation/version reaches the claimant or which command/event invokes the claim. Stop/PostCompact cannot causally carry it under the nonclaims.
- `claimResume` and `claimWork` share one `claimed` state without defining whether they are distinct idempotency domains or mutually exclusive.
- The Plan does not state whether a claimed generation is still injectable on compact/resume, refreshable by PreCompact, replaceable by a later prepare, protected from GC, or eligible for recovery. Therefore the claim cannot actually guarantee duplicate-work suppression.
- Retry “nonce lineage” is still undefined relative to the new 256-bit claim token.

Minimum repair: freeze an explicit state/operation table before Build. `recordInjectionAttempt` appends an attempt nonce/checkpoint/hash without changing injection eligibility or claiming acceptance. A separately named hook-safe/local command carries exact project/execution/generation, attempt nonce, work-domain key, authority-issued claim token, and expected generation version to `claimWork`. Define same-token idempotence, different-token conflict, claim-domain separation, compact/resume behavior before and after claim, later PreCompact replacement, expiry/GC/recovery, and every race. If no causal command exists, remove claim-based duplicate-work prevention and state the honest at-least-once duplicate possibility.

### Injection-only sentinel: **not repaired**

The marker is correctly absent from transcript and native summary, so it can prove SessionStart injection. It is still inserted into the semantic decision card, whose production content is evidence-derived. A random invented card value violates deterministic evidence discipline and strict schema unless test instrumentation is separated.

Minimum repair: put it in a frozen isolated-test-only `rail_probe` envelope or explicitly nonsemantic optional field outside card slots. Bind enablement to the exact test manifest/root, reject it in ordinary production, include it in payload digests/privacy limits, and require the response to reproduce both the marker and evidence-backed card values/next action.

### Pure observers: **not repaired**

Lifecycle/CAS says observers are “absolute zero-write”; the failure section still grants observers append permission. These statements cannot both govern the builder.

Minimum repair: make `status`, `diagnose`, and health structurally zero-effect, including no directory creation, GC/recovery, settings/process starts, selection, or content. Rename optional Stop/SubagentStop metadata to a distinct `response_audit` CAS transition with no effect on injection, claim, head, expiry, GC, recovery, or restore. Remove every generic “observer may append” statement and test the pure observer with an empty effect ledger.

### Frozen v5/CAS/orphan/clock/missing-state/quarantine semantics: **not repaired**

R2 again lists the right topics in the final freeze paragraph, but the evidence layer still uses the placeholder `accepted-host-evidence-v5` without an exact OKF id or SHA-256 and allows it to be frozen only before post-Build Review. No task produces independently reviewed pre-Build contracts, and no acceptance/traceability rows define orphan, clock rollback, legitimate missing state, or unsafe-root quarantine.

Minimum repair: insert `D0 contract freeze -> product review -> skeptic review` after R0 and before Policy Build. D0 must bind exact v5 evidence ids/digests/host tuple/predicates/nonclaims; interprocess lock/CAS/publication rules; create-success/head-CAS-loser `orphan_unreferenced` treatment; wall-clock forward/rollback/equality behavior; event-specific expected/legitimate/error missing-state matrix; and unsafe-root/quarantine address, permissions, version, collision, expiry, GC and never-promote rules. Each has exact fake/filesystem tests and traceability. “Attach these contracts to Review” after Build is too late.

### Dependency ordering and exact artifact continuity: **partially repaired**

The lifecycle table now correctly orders Build -> independent Review -> QA -> live and no longer assigns QA to pre-Review test construction. R0 has its own Review-before-QA chain.

There is still no `G0` candidate manifest between Build and Review. Exact-SHA Review alone does not force QA and live gates to use the same package/helper/schema/harness/host bytes. Add:

`R0 exact PASS -> D0 exact PASS -> Builder + tests -> G0 full checks and manifest -> exact-manifest Review -> exact-manifest QA -> exact-manifest negative rails -> manual main -> automatic main -> subagent`.

G0 binds source/tree, package/tarball/version, helper, D0 contracts/schemas, adapters, fixtures/harness, v5 evidence, and Claude host tuple. Any drift returns to G0 and Review. No artifact is first frozen during or after live acceptance.

### Supported subagent live rail: **not repaired**

The Plan retains exact `agent_id` and main/subagent role claims but still runs only manual and automatic live cases. Add a separate installed-Claude subagent journey through PreCompact, `SessionStart(source=compact)`, first response, optional response audit, and SubagentStop. Require stable exact session/agent identity, sibling/main nonselection, injection-only probe, evidence-backed card values, and next-action behavior. Inability is `BLOCKED-PENDING-VERIFICATION`.

## Requirements that survive

- Cognitive durability, synchronous invocation, one authority, private CAS journal, and `SessionStart(source=compact)` remain the correct product boundary.
- Detached work, daemon/launchd/tmux authority, fresh negative tmux query, power-loss durability, PID-safe signaling, and PostCompact acknowledgement remain excluded.
- Full exact identities, no fallback, strict schemas, create-only generations, mutable head, expected-version CAS, fixed logical expiry, sole GC owner, versioned recovery/quarantine, filesystem privacy, and evidence-layer separation remain correct intentions.
- R0 before lifecycle Build and Review before QA are now explicit.

Remove the stale `Status: R1 draft` label and remove `lease` from `lease/expiry`, or define it only as non-renewable fixed logical expiry; the selected production architecture has no ownership/heartbeat lease.

## Decision

**FAIL. Build authorization: NO.** R2 does not yet freeze the policy needed to implement claims, observers, historical evidence, CAS failure recovery, or exact gate continuity. Revise the D+E Plan only; do not resume the rejected tmux-probe loop.

[tracked by](../tasks/pre-compact-multi-session.md)
