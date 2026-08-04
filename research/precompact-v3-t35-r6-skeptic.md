---
type: Research
title: Revision 3 T3.5 R6 adversarial minimum-repair contract
actor: codex-precompact-v3-t35-r6-skeptic
timestamp: '2026-08-04T00:03:17.147Z'
---
# Summary

Status: complete.

Verdict: **PASS for minimum-repair synthesis only**. Confidence: **0.95**.

This does not reverse the exact-R5 FAIL, approve a Plan mutation, authorize F0/H0/code, or permit Claude/auth/G0. It means the two R5 blockers admit one closed executable repair contract. The next Plan may be drafted only after a small exact-host no-auth repair probe proves the newly load-bearing cleanup-control and marked-detachment primitives described below; that probe does not substitute for later fake-scheduler, exact-implementation, frozen-candidate, or live-Claude gates.

The accepted repair has two deliberate changes:

1. every tmux invocation after `REAPING`, including query, `kill-pane`, `kill-server`, and the final no-autostart check, is one no-auth, reaper-lease-owned, durably reserved/identified cleanup-control principal; non-lease cleaners may only request or observe; and
2. the real-descendant claim is narrowed under the pinned non-malicious-same-uid, machine-controlled pilot. A direct managed handler that is synchronously joined by the host needs no sampled PID only when aggregate host completion plus its exact effect/output/next-host-milestone causally proves completion. Every long-lived known principal and group must still be exactly identified and proved absent. Arbitrary detached and unmarked escape is explicitly out of scope and may not be described as detected or prevented. A marked deliberately detached/new-PGID child must be detected and force FAIL in a real exact-host test.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether the R5 cleanup and descendant findings can be replaced by one bounded, causal, executable absence contract before another Plan is published; this serves the ultimate goal by making terminal memory-rail acceptance depend on principals and capabilities the authority can actually observe.

## Exact inputs and isolation

Read in full and verified by `./aslite` receipts:

- R5 review synthesis `context-notes/precompact-v3-t35-plan-r5-review-synthesis@sha256:67cc57c003e0404619c7a757cd01883deeae548617c2be34287988e232728240`;
- exact R5 Plan `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`;
- R5 skeptic FAIL `context-notes/precompact-v3-t35-plan-skeptic-r5@sha256:16ae6eb14cc0fcdeb962f9475eec4f9748b1c014bde880fcab47e1c207c0e09a`;
- R5 acceptance PASS `context-notes/precompact-v3-t35-plan-accept-r5@sha256:ce8b51a0166f2a40ef45e5cdf8a95285cf52cd0542097f088754b46153ce601d`;
- exact selected host evidence `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`; and
- host panel synthesis `context-notes/precompact-v3-t35-host-probe-panel-synthesis@sha256:bdee04f5f0d23c77cc97c6b4e0e8432377b880f0b81ab6eb093b61b4d7bf6093`.

The repository guide and `holaxis-self-awareness`, `holaxis-cognitive-ecosystem`, and `agentstate-lite` skills were reread in full. I did not inspect any other new repair-role note before making this result immutable. I did not mutate Plan, code, task, orientation, candidate, worktree, Claude, auth, tmux, or global configuration.

## Minimum executable cleanup-control contract

### Ownership and state

There is one destructive reaper lease, and it owns **all** cleanup side effects: cleanup tmux control, raw PID/PGID signals, and stale-socket unlink. A non-holder may publish a cleanup request and record passive observations only. R5's permission for a second cleaner to retry socket control is removed.

The one authority adds repeatable, non-overlapping cleanup-control epochs:

`CONTROL_UNUSED -> CONTROL_RESERVED -> CONTROL_IDENTIFIED_GATE_CLOSED -> CONTROL_RELEASED -> CONTROL_PRINCIPAL_ABSENT -> CONTROL_OUTCOME_RESOLVED`.

Each epoch binds campaign/attempt/current revision, reaper-lease digest, control id and one-shot nonce, exact closed action id, exact socket identity/path, exact expected server identity when one is required, exact pinned Node/tmux/ps tuple, exact argv/environment-name digest, and terminal evidence. At most one epoch is nonterminal. The action id selects a Plan-enumerated argv vector; no arbitrary tmux command, shell, target, or user-supplied argument is accepted.

`REAPING` is refined to fence every stale or non-lease-holder tmux action. It permits a new cleanup-control reservation only through the current reaper lease and the current ledger revision. The phrase “all clients absent” moves to after the last cleanup-control epoch, including the final absent-server/no-autostart epoch.

### Principal construction

Every cleanup tmux client repeats the accepted no-auth gate pattern:

- under the campaign mutation lock and current reaper lease, durably CAS `CONTROL_RESERVED` before OS spawn;
- spawn exact pinned Node, no supported auth/canary, gate closed, private `PGID=PID`, one noninherited control reader;
- create-only/fsync/read back its exact PID/start/uid/PGID/PPID/Node/argv/env/control/lease identity before READY;
- CAS/read back `CONTROL_IDENTIFIED_GATE_CLOSED`, then irreversible `CONTROL_RELEASED` with one-shot nonce and exact frame/action digest before delivery;
- broker re-reads current ledger and lease, accepts one bounded frame+EOF, closes the control FD, and execs exact pinned tmux with explicit executable `argv[0]`, `-N -S <exact-socket>`, and only the selected closed action; and
- retain raw PID/group/stdout/stderr/exit/action/server/socket observations, prove the control PID and private group absent as `CONTROL_PRINCIPAL_ABSENT`, then resolve the outcome from fresh server/group/socket facts.

There is no auth value in the broker, frame, tmux client, argv, environment, or receipt. Durable `CONTROL_RELEASED` conservatively means connect/action may already have occurred even when no action receipt exists.

### Recovery and action resolution

After `CONTROL_RELEASED`, a crash before connect, between connect and action, or after action before receipt is never resolved from the missing receipt. The reaper or successor first proves the exact control principal/group absent, then re-observes the exact server PID/group/socket from first principles. If the server is exact-live, a new epoch may be reserved; if the original server PID and group are exact-absent, cleanup advances without another signal; if identity/group/socket facts conflict, terminal state is `FAILED_QUARANTINED`. No control action is retried concurrently.

The closed cleanup actions are state-specific. At minimum they include exact read-only server/pane inventory, exact `kill-pane` for the recorded pane target while the server is still verified, exact `kill-server`, and an exact post-server `-N` query that cannot autostart. The final check should use a read-only query, not `new-session`, so discovering an unexpected live server cannot create another pane. Its exact no-autostart behavior must be part of the new host probe.

Exact absent PID/group observations are successful absence predicates; they forbid a now-unneeded signal but do not themselves quarantine. A live row with mismatched start/uid/PGID/comm/binary, a nonempty reused target group, malformed evidence, or contradictory socket/server facts forbids signaling and yields FAIL quarantine. This replaces R5's ambiguous “mismatch/absence ... quarantines” wording.

## Cleanup-control interleaving attacks

### OS spawn before record

**Closed.** Reservation precedes OS spawn under the mutation lock. Because cleanup occurs after `SERVER_RELEASED`, an unknown control spawn is post-release pending FAIL and `FAILED_QUARANTINED`; it can never CLEAN. A stopped live lock/lease owner may block progress indefinitely, but no takeover or CLEAN occurs while it remains live. Once absent, takeover restarts observations. A resumed stale gate broker cannot pass the current lease/revision check.

### Connect/action/receipt gaps

**Closed.** `CONTROL_RELEASED` means the exact action may have happened. Recovery waits for the known client/group to be absent, then adjudicates server/group/socket facts rather than replaying from a missing receipt. One-shot nonce/frame rules prevent a stale broker from accepting a second action.

### Two cleaners and control-versus-signal

**Closed.** Only the destructive lease holder can reserve/release a cleanup client, signal, or unlink. One nonterminal control epoch excludes a raw signal or second control action against the same server. Lease takeover requires exact former-owner absence, a fresh CAS, disposition of every prior control epoch, and full identity re-observation. The former R5 allowance for another cleaner's idempotent `kill-server` retry is prohibited.

### Server exit and PID/PGID reuse

**Closed within the accepted sampled-identity risk.** After control release the original server may disappear. Exact absent original PID plus empty original PGID can advance; a reused/mismatched numeric identity is never signaled or called the original server. A nonempty reused PGID or inconsistent process/socket row quarantines. The accepted immediate-ps-to-signal TOCTOU remains bounded, not eliminated.

### Post-CLEAN resume

**Closed.** CLEAN requires every control epoch `CONTROL_OUTCOME_RESOLVED`, every control writer closed, every control PID/group absent, all earlier broker/session/reaper capabilities absent or fenced, the post-server no-autostart control epoch resolved, final process/group/socket audit, and the absorbing ledger revision. A runner paused before reservation cannot pass the final current-revision check; one paused after reservation keeps the mutation lock/current epoch nonterminal and prevents CLEAN; an unknown post-spawn principal prevents CLEAN; an identified/released principal must be killed/proved absent. Fake scheduling must resume each paused actor after the proposed CLEAN and observe only stale-revision/closed-FD/absent-process failure.

## Minimum executable descendant contract

### Explicit pilot scope

The next Plan must delete every universal claim that all descendants or arbitrary escapes are discoverable. The accepted guarantee is limited to the exact pinned host/candidate/settings, machine-authored inputs, private lane, and non-malicious-same-uid operation. Arbitrary detached **and unmarked** Claude/hook/sub-agent escape is outside the guarantee. The Plan may neither call it detected nor claim final snapshots prove it absent. This scope decision must be repeated in product/acceptance and skeptic exact-Plan review and expires on host/toolchain drift, a production helper that gains background-spawn behavior, an observed unmarked escape, a malicious-same-uid threat model, or a product requirement for universal containment.

### Short-lived direct managed hooks

A normal direct managed hook does not need an exact sampled PID only if all of the following are retained and validated:

1. exact settings bytes/digest and closed matching-handler set at the event;
2. exact observer event input and host event/session/agent identity;
3. the already evidenced pinned-host rule that the host synchronously joins every matching handler before the named next host milestone;
4. an event-specific managed effect/output oracle—generation/head bytes and versions, exact block/halt schema, audit state, or other exact candidate consequence—where the lifecycle contract requires one;
5. the exact next host milestone that cannot occur before aggregate handler join, such as compact SessionStart, PostCompact, first response/prompt readiness, Stop completion, main continuation after SubagentStop, or the exact deliberate halt; and
6. no timeout, missing effect, missing milestone, settings drift, unexpected handler, or host parser ambiguity.

The receipt must say only that **all handlers in the exact configured set completed before the milestone** and that the candidate effect matched. It must not map a silent debug row to the managed command or invent a hook PID. Host-joined completion proves that short-lived handler process is no longer running; it does not prove arbitrary children absent. R35 must inspect the exact installed managed helper/harness code and dependency-free artifact for background/detached spawn behavior. Any such behavior reopens this scope rather than being covered by the aggregate join.

Foreign observers and the sequential wrapper already have authority-controlled code and may self-record exact identity while live. A hook that stalls or loses the aggregate join/effect evidence is pending FAIL; cleanup relies on the recorded pane/known groups and never assumes the missing hook completed.

### Long-lived known principals

Exact durable PID/start/uid/PGID/state-comm/binary identity and final PID/group absence remain mandatory for every principal whose lifetime can cross a lifecycle/action boundary or that can retain auth, a release/control writer, a tmux/server/session capability, or a long-lived task: runner/reaper; server broker/server; session client; every cleanup-control broker/client; tmux pane; Claude main; real sub-agent Claude; any recorded long-lived wrapper/observer; and every marked test descendant. Expected identities are create-only; unexpected marked principals or surviving known groups are FAIL.

The final bounded audit applies exact known-identity/group, lane-root, candidate/harness, socket, session, and public-marker predicates. It is evidence for those predicates only, not an oracle for arbitrary unmarked same-uid processes.

### Required cleanup reordering

Server-before-descendant cleanup is removed. The causal order becomes:

1. CAS `REAPING`; stop new PTY actions; close/fence release writers and stale actors.
2. Terminate/prove the released session-creation client absent.
3. While the verified server and ancestry/control surface still exist, establish the final joined-handler milestones that are available, record/freeze the pane/Claude/sub-agent/known-group inventory, and set pending FAIL for any missing required join/effect.
4. Through the sole lease and serialized control/signal actions, terminate/fence the pane/Claude/sub-agent descendant launcher and every known descendant group first; prove their exact PID/groups absent. No later hook/sub-agent launch is permitted.
5. Only then use the lease-owned cleanup-control principal or exact raw signal to terminate the server; prove original server PID/group absent.
6. Validate/remove the exact stale socket after all creators/groups are absent.
7. Run the lease-owned absent-server `-N` read-only check, prove that client absent and no socket/server appeared, retain the final bounded audit, then publish CLEAN.

L1 may still exercise `kill-server`, L2 server-group TERM, and L3 recovered server-group KILL, but only after the real descendant launcher/groups are absent. The harmless host probe remains evidence that server death removes its dummy pane; live acceptance no longer depends on real Claude following that dummy teardown model.

## Required exact-host proof and later gates

The newly load-bearing host facts can and should be proven **no-auth before another Plan digest is published**. A private scratch campaign, with protected-state snapshots and retained strict raw evidence, must demonstrate:

1. a gate-closed reaper-lease-bound cleanup-control broker/client with explicit `argv[0]`, exact `-N` query/`kill-pane`/`kill-server` actions, process/group identity and absence;
2. released-control action with missing receipt resolved only by client absence plus fresh server/group/socket observation;
3. exact absent-server read-only `-N` query exits without starting a server or creating a socket;
4. two cleanup requesters where only the lease holder controls/signals and takeover waits for former-owner absence;
5. a harmless pane that creates a public-marker, self-recorded `detached:true`/new-PGID child; the server/pane can disappear while the child remains, and the bounded marker/identity audit detects it and refuses CLEAN until the exact child/group is reaped; and
6. protected real-user state and final process/socket absence.

This proof does not need Claude or an API key. The prior exact host hook-capability evidence already supplies synchronous all-handler start/join semantics; the new proof must not infer silent command identity from debug rows. If the no-auth probe cannot produce these exact results, repair synthesis fails and a stronger supervisor/host surface is required before Plan work.

After that research proof, a new Plan must still require: exhaustive fake-scheduler coverage of every cleanup-control state/interleaving; exact no-auth implementation smoke on the reviewed SHA; R0/Q0 mutation of raw control/descendant evidence; and frozen-candidate L1-L3 live manual/automatic/sub-agent delivery plus the narrowed known-principal cleanup proof. A fake marked escape or the pre-Plan scratch probe cannot satisfy the final immutable-candidate lanes.

## Remaining unobservable boundary

One gap remains inherently unobservable in this architecture: an arbitrary process that detaches from known groups, sheds every exact lane/candidate/session/public marker, and outlives its observable parent cannot be attributed later from a bounded `ps` snapshot. This is not repaired; it is expressly removed from the pilot guarantee. The product decision is acceptable only under non-malicious-same-uid, exact machine-controlled code/settings and the exact source/artifact audit that the known helper does not background-spawn. If that narrower scope is not acceptable, this repair verdict becomes FAIL and an identity-bearing supervisor/kernel containment primitive is mandatory.

Within that explicit scope, I find no other unobservable load-bearing gap. Host-joined ephemeral completion, exact long-lived known identities/groups, lease-owned cleanup clients, descendant-before-server ordering, and marked-escape detection form a closed executable contract.

## Verdict and next gate

Verdict: **PASS for repair synthesis only**.

Minimum next gate: run and independently audit the exact no-auth repair probe above. Only a PASS on those retained bytes permits a planner to publish a new Plan digest. That Plan must encode this contract without restoring universal descendant claims and must receive fresh independent exact product/acceptance and adversarial-skeptic PASS. No implementation, Claude/auth use, candidate freeze, or live acceptance is authorized by this research verdict.

## Proximate-goal linkage

The repair succeeds conceptually because it stops asking sampled process ancestry to prove an unobservable universal. It models every cleanup capability as a durable principal and limits descendant claims to host-joined ephemeral completion plus exact long-lived known identities/groups, with an explicit marked-escape oracle and an explicit unmarked-escape exclusion. This serves the ultimate goal by ensuring the memory handoff rail can only be accepted on evidence the executable authority can actually reproduce.
