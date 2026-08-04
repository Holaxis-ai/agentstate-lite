---
type: Research
title: Revision 3 T3.5 R6 probe verification-boundary acceptance
actor: codex-precompact-v3-t35-r6-probe-boundary-acceptance
timestamp: '2026-08-04T00:31:44.371Z'
---
# Summary

**Verdict: PASS. Confidence: 0.97.**

The proposed five-question host-only probe is sufficient empirical premise for drafting a repaired Plan. It asks the real pinned host only what the Plan cannot establish by construction: whether the closed cleanup `tmux -N` actions work with exact process/group absence; whether fresh PID/group/socket facts distinguish server-live from server-absent after a result is lost; whether two requester/owner identities and owner-death takeover are physically observable; whether a declared detached/new-PGID child survives ordinary pane/server assumptions and demands separate reaping; and whether the complete harmless journey leaves process/socket/protected/worktree state clean.

The future Plan and its single real authority must still specify and later prove every reservation, self-record, release, CAS/lease, reconciliation, nonholder rejection, takeover, stopped-actor, evidence-schema, and verdict policy. A pre-Plan scratch probe cannot prove that future software policy and must not implement a competing copy of it.

I did not inspect the failed draft script/root or any parallel new boundary note. The failed draft facts below come only from the exact boundary diagnostic.

## Goal linkage and exact inputs

- Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.
- Proximate goal: establish the smallest exact-host premise needed to write a testable repair Plan, while keeping policy proof in the future one executable authority.
- Boundary diagnostic: `context-notes/precompact-v3-t35-r6-probe-boundary-diagnostic@sha256:1474f62d476371dde2f6fcda0dedeca33059a42dfa905dc920283fe698f7f902`.
- Earlier product boundary: `research/precompact-v3-t35-r6-acceptance@sha256:715a50b89616bb4e2ab784db81ca735f9497171189467671b7efae03217116bc`.
- Earlier probe rubric being corrected: `research/precompact-v3-t35-r6-probe-acceptance-contract@sha256:95f42ee3d0ebec164ce9ac144df0653f251e65d1e0b018f985bb116c113a4038`.
- R6 architecture: `research/precompact-v3-t35-r6-architecture@sha256:0ef1692cf858fada1473bb812cec6e35f65c0138ae53590b2781cf7f6b0218e4`.
- R6 skeptic repair contract: `research/precompact-v3-t35-r6-skeptic@sha256:9efad190991436412c1d516180c1c831b15ca0e808a47a8dd3d7ffa744a1edb1`.
- Failed draft result, as recorded by the diagnostic: `/private/tmp/aslite-t35-r6-repair-probe.builder/repair-probe.mjs@sha256:7399f09b59294477b5104def9c5c568a2b94b190b34fc52055565718efa5a40b`, 1,566 lines, mode 0644, syntax-valid but with no dispatcher, manifest, validator, final audit, failure cleanup, or executable contract; it was not frozen or run and proves zero cases.
- Prior hook facts: `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`.
- Prior audited launch/reap facts: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf` and `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.

## Correction to my earlier rubric

My earlier probe rubric correctly preserved the product scope, no-auth/global-isolation boundary, protected snapshots, prior-versus-fresh evidence distinction, final continuity, and the explicit non-claim about arbitrary unmarked escape. It overreached at the verification boundary.

Specifically, it required the scratch script to implement and prove the future production policy: durable control epochs, lease/CAS ownership, action/result state transitions, nonholder rejection, takeover recovery, stopped-actor resumption, parser/frame/socket mutation matrices, strict validator receipts, and terminal verdict algebra. That is not a host probe. It is a second lifecycle authority, and the unfinished 1,566-line draft is the diagnostic consequence.

The correction is a relocation of proof, not a weakening:

- **Pre-Plan host probe:** empirically establish only real OS/tool behavior and retain enough raw evidence for an independent audit.
- **Exact Plan:** specify all policy as measurable requirements of one future authority.
- **Red-first implementation:** prove policy through the authority's injected-effects fake scheduler and exact no-auth implementation smoke.
- **Immutable candidate:** prove helper effects, manual/automatic/real-subagent delivery, auth isolation, and real known-principal cleanup.

The earlier rubric's policy matrix remains valuable input to the future Plan, R35 Review, and Q0. It is retracted only as a requirement of the scratch host probe.

## The five fresh host questions

All five are mandatory and must be answered from fresh retained raw evidence on the exact pinned tuple.

### H1 — closed cleanup client actions

Using the already audited simple gate construction, can one exact no-auth pinned-Node principal exec each closed cleanup client action with explicit tmux `argv[0]` and `-N -S <socket>`:

- exact server PID query;
- exact session query with one pinned format;
- exact pane query with one pinned format;
- exact `kill-server`; and
- final exact absent-server read-only query?

PASS requires strict bounded stdout/stderr/exit/effect evidence, the exact client PID/private group absent after every action, no auth/canary in the client, and no server/socket autostart from the final query. This proves the host action surface and terminal client absence, not reservation/CAS/lease policy.

### H2 — observation after a missing result

After a released `kill-server` client has become action-possible and its result bytes are deliberately discarded, and only **after that exact client/private group is absent**, can a later observer distinguish:

- the exact original server still live with the same PID/start/uid/PGID/comm and socket; from
- the exact original server and group absent, with current exact socket facts?

Both branches must be exercised. The receipt must preserve `result_missing:true` and `action_may_have_occurred:true`; it must not synthesize an action result. This proves that the host exposes enough fresh facts for a later authority to reconcile conservatively. It does not prove the reconciliation state machine, replay policy, or CAS transition.

### H3 — requester/owner/takeover identities

Can two independent no-auth requester processes be retained with exact PID/start/uid/PGID/comm identities while only a designated controller invokes a closed action, and—after exact designated-owner absence—can a newly designated controller invoke a later closed action and leave all requester/controller/client groups absent?

This proves physical process identities, owner-death observability, and the later action surface. The simple probe controller may enforce designation directly. It must not claim to have proven an exclusive durable lease, nonholder rejection under every race, CAS takeover, or stopped-owner fencing; those are later software-policy requirements.

### H4 — declared detached child and teardown order

Can a harmless pane create a public-marker, create-only-recorded `detached:true`/new-PGID child that:

- outlives its parent and ordinary pane-group assumptions;
- remains exactly observable from its record plus strict PID/group facts;
- survives a server-first demonstration, proving server death does not establish child absence; and
- is separately reaped in a descendant-first demonstration while the exact original server remains live until the child/pane groups are absent?

PASS requires exact separate-group absence before the descendant-first server cleanup and raw evidence that the server-first case left the child live. The controller may use a separate safety receipt for teardown. This proves the host topology/order premise and the usefulness of a declared record; it does not prove production declaration policy, missing-record verdicts, or arbitrary unmarked-escape detection.

### H5 — terminal continuity

After every case, do all exact named clients/requesters/controllers/server/pane/detached children and process groups disappear; are every exact owned socket and public marker absent from the retained bounded final process audit; does the final `-N` query avoid autostart; and do protected real-user state plus exact feature worktree HEAD/tree/status/diff remain byte-identical?

Raw primary observations must remain distinct from fallback/controller-only safe teardown. Cleanup may make the filesystem/process state clean, but it cannot repair an earlier failed empirical assertion.

## Prior facts that may bind

The probe may bind these exact prior facts with their original scope and limitations:

1. Claude Code 2.1.220 starts the complete configured synchronous handler set and joins every opaque start/response pair before the host advance point. The prior note's overall verdict remains FAIL because normal-auth use changed `~/.claude.json`; it did not prove silent-handler command mapping, a real model response, or candidate helper effects.
2. Exact Node `process.execve` requires explicit executable `argv[0]` on this tuple.
3. Exact commandless foreground tmux `-D -f /dev/null -S <socket>` can run zero-session; exact `-N` is no-autostart in the previously tested form.
4. Server and pane groups are distinct; `/bin/ps -p/-g` grammar, removal of `sess` as identity, PPID's limited role, stale-socket behavior, and bounded sampled PID-risk remain accepted background.

These prior facts are premises and regression targets, not substitutes for the fresh five answers. In particular, prior `-N` evidence does not prove each newly closed cleanup action or its fresh client absence.

## Proof that remains later

The scratch probe must explicitly disclaim and defer all of the following:

- durable reservation/self-record/readback/release frames and one-shot nonces;
- history-before-current ledger, mutation lock, CAS, exclusive destructive lease, nonholder rejection, control-versus-signal serialization, takeover rules, stopped/stale actor fencing, and action retry policy;
- formal `CONTROL_*` state machine, missing-result reconciliation policy, pending FAIL/quarantine/CLEAN transitions, and closed verdict reasons;
- exhaustive parser/frame/EOF/EPIPE/socket-rebind/PID-reuse/crash interleavings;
- production evidence schemas, validator registry/receipts, attestation, privacy authority, and scheduler completeness;
- candidate freeze/verifier/campaign/review chain;
- exact installed helper effects, SessionStart(compact) delivery, manual/automatic/real-subagent compaction, first response/action, API-key isolation, and real known-principal cleanup;
- universal arbitrary unmarked-escape detection, malicious-same-uid containment, portable-host behavior, or atomic PID-safe signaling.

The repaired Plan must nevertheless specify the full policy list as measurable acceptance. F0/H0 must first make it red; the one `scripts/handoff-candidate.mjs` transition authority implements it; the injected-effects fake scheduler proves every pure-policy gap; the reviewed-SHA no-auth smoke proves the integrated host adapter; R35 makes a scheduler/reaper oracle red; and R0/Q0/L0-L3 later prove the immutable artifact and real product rail.

## Whole-probe verdict algebra

Verdicts remain exactly `PASS`, `FAIL`, or `BLOCKED_PENDING_VERIFICATION`.

### PASS

Whole-probe PASS requires all H1-H5 to answer yes on one immutable script/toolchain/probe-root binding; strict raw action/process/group/socket/protected/worktree evidence; final safe cleanup; and explicit non-claims about policy, candidate semantics, and arbitrary unmarked escape. A simple digest manifest and bounded per-case raw records are sufficient; a production validator/attestation framework is not required.

The optional fresh no-auth Claude mapping component may be absent or `BLOCKED_PENDING_VERIFICATION` without blocking H1-H5 PASS only when the exact prior hook-join evidence is bound and no fresh mapping/helper-effect claim is made. The whole scope must read `PASS for R6 host premises only`.

### FAIL

FAIL applies if any H1-H5 fact is false, ambiguous, missing, or inferred only from cleanup/fallback; raw evidence cannot reproduce it; a named process/group/socket survives; protected/worktree state drifts; the final query autostarts; auth/global/network fallback occurs; optional Claude execution mutates protected state; the probe claims software policy it did not test; or evidence/script bytes are not exact-bound.

### BLOCKED_PENDING_VERIFICATION

BLOCKED applies when any mandatory H1-H5 question cannot be exercised safely on the pinned tuple before a forbidden mutation and no false fact was observed. Mandatory BLOCKED forbids whole-probe PASS. There is no retry through normal/global auth, another host tuple, or a more permissive command.

## Complexity limit

The replacement is a construction-independent host probe, not a small version of the future authority:

- one self-contained immutable script and one single-process controller;
- exactly five top-level empirical questions, with bounded branch subcases only for H2 live/absent and H4 server-first/descendant-first;
- reuse the audited v5 gate and strict raw `ps`/group/socket helpers; do not generalize them into a campaign engine;
- controller memory plus append-only raw records and one simple digest manifest; no durable policy ledger, CAS store, lease implementation, attestation chain, challenge system, fake scheduler, generic verdict engine, or production validator registry;
- no exhaustive mutation matrix: retain exact outputs and test the named host questions only;
- no more concurrency than H3's two requesters/controllers and H4's one declared detached child;
- one cleanup path that always removes safety-known processes but never changes a failed observation into PASS.

As an operational tripwire, the script should remain at or below **1,000 physical lines** including comments. Exceeding that bound is `BLOCKED_PENDING_VERIFICATION` and requires a fresh boundary review before execution. Staying below it is not sufficient: any duplicate-authority capability above is script FAIL regardless of line count.

## Conditions for Plan-drafting eligibility

Evidence PASS on H1-H5 is sufficient to publish a repaired Plan for fresh exact dual review if and only if the Plan:

1. uses the exact bounded Option B product claim and does not restore universal descendant language;
2. cites fresh H1-H5 only for host premises and cites prior hook evidence only for aggregate join;
3. places every policy item deferred above into the future one authority's red-first acceptance graph;
4. makes fake scheduler + exact implementation smoke + Review-before-QA mandatory before freeze;
5. preserves one immutable candidate's later manual, automatic, and real-subagent rail; and
6. never treats host-probe PASS as implementation, candidate, auth, or live-compaction PASS.

## Verdict

**PASS** — the five-question host-only probe is sufficient and proportionate empirical premise for repaired-Plan drafting. Confidence: **0.97**.

This verdict authorizes only the small probe to be drafted and exact-reviewed under the corrected boundary. It does not authorize execution, Plan mutation, implementation, Claude/auth use, G0, or live acceptance.
