---
type: Research
title: Revision 3 T3.5 R6 architecture repair adjudication
actor: codex-precompact-v3-t35-r6-architect
timestamp: '2026-08-04T00:08:01.163Z'
---
# Revision 3 T3.5 R6 architecture repair adjudication

## Result

**Status:** complete.

**Recommendation:** adopt **Option B**, the explicitly narrower machine-controlled, non-malicious-same-uid pilot guarantee, together with the lease-owned cleanup-control protocol below. Do not adopt Option A on current evidence.

This recommendation is eligible for independent product and skeptic review without assuming a new load-bearing host primitive. It relies on the already observed Claude Code 2.1.220 synchronous-handler join contract, the existing accepted sampled-identity risk decision, exact immutable helper effects/output, and the already proven gated no-auth Node-to-`tmux -N` mechanism. It does **not** authorize implementation, Claude/API-key use, candidate freeze, or live acceptance. A replacement Plan still needs exact independent review, and the named no-auth and API-key gates below remain mandatory before PASS.

Option A remains **BLOCKED_PENDING_VERIFICATION** because PID-bearing wrappers alone do not contain a child that deliberately detaches, creates a new PGID/session, or reparents. A universal arbitrary-escape claim on this Darwin host would require a persistent identity-bearing supervisor or kernel/job containment primitive that has not been selected or proven, and it would reopen production T3.

**Confidence:** 0.94 that the cleanup-control protocol closes the first R5 blocker; 0.90 that Option B is an executable and honestly reviewable repair of the second blocker; 0.99 that Option A is not supportable from current source and evidence without new host and production work.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: replace R5's two unmodeled absence claims with one lease-owned cleanup action protocol and one host-observable, deliberately scoped descendant contract; this serves the ultimate goal by preventing the compaction-memory rail from publishing success on evidence it cannot causally observe.

## Scope, inputs, and isolation

I read the exact R5 Plan `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`, its exact FAIL synthesis, the exact acceptance PASS and skeptic FAIL, the host-probe panel synthesis, the installed-host hook-capability note, and the selected launch/reaper research and its architecture/product/skeptic precursors. I also inspected the production hook path at exact feature HEAD `36c741a8173832d75d61a7ab138b5219c4415c66` read-only. I did not inspect either parallel R6 repair note, mutate a Plan/task/code file, invoke Claude/tmux/auth, or change host/global state.

This recommendation preserves the R5 mechanisms that survived exact review:

- transactional absent-root freeze; one build and one pack; exact candidate tree/bytes/modes; factored existing-tarball verification and pre/post drift checks;
- history-before-current ledger, hard-link lock, closed predecessor consumption, serialized L0, challenge-bound R0/Q0, Review before QA, and immutable-candidate ordering;
- strict canonical schemas, one executable authority, raw pre-fallback evidence, recomputable privacy inputs, exact invocation/real-HOME/candidate binding, and closed PASS/FAIL/BLOCKED reasons;
- no-auth gated server broker and separately gated no-auth session client, exact explicit `argv[0]`, commandless foreground tmux, `-N` no-autostart, corrected Darwin `ps` grammar, separate pane PGID, and the bounded sampled-PID risk decision;
- exact sequential PreCompact wrapper causation, SessionStart(source=`compact`) as the only context-delivery surface, passive lifecycle evidence, API-key-only isolation, protected snapshots, and manual/automatic/real-subagent delivery oracles.

The repair changes only two rejected surfaces: cleanup control becomes a modeled principal/action class, and the real-tree claim becomes a narrower joined-handler plus known-principal guarantee. It also reverses descendant/server teardown order so attribution is not destroyed before descendant absence is established.

## Architecture 1: cleanup control is a reaper-owned principal and action

### Domain model and invariant

A **cleanup-control principal** is a no-auth, gate-closed pinned-Node process reserved by the current reaper lease and later replaced, at the same PID/start/uid/PGID, by one exact `tmux -N` client. A **cleanup-control action** is the one allowlisted tmux command bound to that reservation. Principal identity and action intent are inseparable ledger facts.

The controlling invariant is:

> No tmux control byte is delivered after `REAPING` unless one current reaper lease owns one durably reserved and identified cleanup-control principal, one irreversible release binds one closed action, and no raw signal or second control action is active. `CLEAN` is impossible until the last cleanup-control principal and group are proven absent and its target effect has been reconciled from current observations.

The early cleanup predicate is renamed **application clients absent**. It covers the session-creation client and delivery creators only. The phrase **all tmux clients absent** is legal only after the final cleanup-control client is absent. This removes R5's contradiction in which cleanup first proved clients absent and then spawned more unmodeled clients.

### Closed command surface

The executable authority owns four action enums and constructs every byte; callers cannot supply a tmux command, target, or format string:

| Action | Exact command tail after `[tmuxRealpath, "-N", "-S", socket]` | Effect class |
|---|---|---|
| `OBSERVE_SERVER_PID` | `["display-message", "-p", "#{pid}"]` | read-only |
| `OBSERVE_SESSIONS` | `["list-sessions", "-F", <pinned-format>]` | read-only |
| `OBSERVE_PANES` | `["list-panes", "-a", "-F", <pinned-format>]` | read-only |
| `KILL_SERVER` | `["kill-server"]` | destructive, idempotently reconcilable |

The two format strings are constants in the validator registry and expose only authority-required ids, PIDs, dead state, and controlled names. Their byte grammar, row count, separators, and bounds are strict. No `new-session`, `send-keys`, `run-shell`, attach, environment display, caller format, arbitrary target, or shell is accepted. The final no-autostart check is `OBSERVE_SERVER_PID` against the absent socket; it is the final control action. It does not risk creating a session if a late server exists.

Every vector uses explicit POSIX `argv[0]` and exact pinned tmux:

```text
[tmuxRealpath, -N, -S, exactSocket, ...closedActionTail]
```

The principal environment is a strict no-auth allowlist. It contains neither `ANTHROPIC_API_KEY`, any alternate Claude credential, the server inheritance canary, nor arbitrary tmux variables. It has one noninherited control reader and cannot connect before release.

### Per-action state machine

The attempt remains globally `REAPING`; each cleanup-control action has a create-only record with these monotone states:

1. `CONTROL_RESERVED` — under the campaign mutation lock and current reaper lease, reserve action id, cleanup epoch, lease id/revision, exact ledger revision, action enum, nonce digest, exact argv/env-name digests, expected server PID/start/uid/PGID/comm, exact socket dev/inode/path/type/uid/mode premise, expected record/control paths, and no-auth declaration. There is at most one nonterminal control record.
2. `CONTROL_IDENTIFIED_GATE_CLOSED` — the broker's create-only/fsynced/read-back record binds campaign/attempt/action/lease, PID/start/uid/PPID/PGID=PID, pinned Node realpath/digest/comm, control endpoint, nonce, argv/env digests, and current target premise. READY is emitted only after this record exists and validates; no action byte has been delivered.
3. `CONTROL_RELEASED_ACTION_POSSIBLE` — one CAS, fsync/read-back, and current-lease/current-phase/target revalidation irreversibly authorize exactly the reserved action. From here recovery assumes connect and action may already have happened even if no result was retained.
4. `CONTROL_RESULT_CAPTURED` — optional exact close+both-EOF+exit/no-signal result with bounded stdout/stderr and strict action-specific parse. A runner crash can skip this state; missing result never means the action did not happen.
5. `CONTROL_PRINCIPAL_ABSENT` — the exact Node-or-tmux PID/start/uid/PGID and whole private group are absent, every writer is closed, and no replacement action can be delivered.
6. `CONTROL_RECONCILED` — after principal absence, the authority re-observes the target from raw `ps`/socket facts or, if required, from a new later control action. It records either the exact parsed result or the conservative fact that the action may have occurred plus the current target state. Only this state permits the next cleanup action.

Any unresolved reservation/identity, malformed output, target substitution, control survivor, or inability to reconcile is post-release FAIL and `FAILED_QUARANTINED`; it cannot reach `CLEAN`. Records are never removed or rewritten. `CONTROL_RELEASED_ACTION_POSSIBLE` never returns to an unreleased interpretation.

### Reservation, release, serialization, and crash recovery

- Only the current reaper lease holder may reserve, OS-spawn, release, or retry a cleanup control. A second cleaner may append a cleanup request or perform nonmutating filesystem/process observations, but it may not invoke tmux or send a raw signal.
- Reservation and OS spawn occur under the same campaign mutation boundary used by the server/session brokers. The control broker is no-auth and gate-closed. OS-spawn-before-self-record is therefore capability-safe but not absence-safe: if a durable identity never appears, `CLEAN` is unavailable.
- Release is permitted only while the same lease and cleanup epoch are current, the action is legal in the current cleanup phase, the exact server/socket premise revalidates, no other control record is active, and no raw signal is in flight. Control release and raw-signal authorization are branches of the same transition function.
- The broker independently re-reads the exact release, validates lease/action/revision/nonce/identity, accepts one complete bounded frame plus EOF, closes the control FD, and uses `process.execve` into the exact vector. Partial, duplicate, late, inherited, stale-lease, wrong-action, or post-fence frames fail.
- A reaper successor first proves the former lease owner absent and CAS-acquires a new epoch. Before any new control or signal it resolves the old active control: an identified gate-closed broker is revoked and proven absent; a released broker/client is treated as having acted, terminated if still live under exact identity, and proven absent; then the target is re-observed. A missing identity for a possibly OS-spawned reservation is absorbing FAIL/quarantine, not permission to spawn another control.
- `KILL_SERVER` may be repeated only after the prior control is `CONTROL_RECONCILED`, its principal/group are absent, and the same recorded server/socket identity revalidates. If the server is already absent, no destructive control is issued; stale-socket handling proceeds from raw identity facts. A changed/rebound server or socket is FAIL, never a retry target.

### Cleanup phase order

The executable phase order is:

1. `REAPING_FENCED`: CAS `REAPING`; fence broker/session/control release, PTY/model actions, respawn, evidence mutation, and all stale writers.
2. `APPLICATION_CLIENTS_ABSENT`: terminate and prove the server/session release writers, session-creation client, and other delivery creators absent. This does not claim cleanup-control absence.
3. `ATTRIBUTION_REFRESHED`: while the verified server still exists, use lease-owned `OBSERVE_SERVER_PID`, `OBSERVE_SESSIONS`, and `OBSERVE_PANES` actions as needed; reconcile and prove each action principal absent. Bind the exact current pane/Claude/known-long-lived descendant inventory.
4. `DESCENDANT_LAUNCH_QUIESCENT`: satisfy the joined-handler barrier defined below; no unmatched hook start, no unfinished sub-agent, no pending PTY input, and no legal actor can initiate another event/action.
5. `KNOWN_DESCENDANTS_ABSENT`: with the server still present as the attribution/control surface, TERM and, only after another exact identity check and a complete joined-handler barrier, KILL the known Claude/pane/known-descendant groups. Prove their exact identities/groups absent before server destruction. If the join barrier cannot complete, quarantine; do not manufacture absence by killing the ancestry surface first.
6. `SERVER_ABSENT`: issue lease-owned `KILL_SERVER` when its exact premise remains valid; otherwise use the accepted exclusive raw-signal path. Reconcile the control, then prove broker/server PID and group absent.
7. `SOCKET_ABSENT`: only after all creators and known groups are absent, validate exact stale socket dev/inode/path/type/uid/mode, unlink if present, fsync parent, and repeat raw absence observations.
8. `LAST_CONTROL_ABSENT`: run the final lease-owned `OBSERVE_SERVER_PID` no-autostart action; require absent-server output, reconcile it, and prove that final control PID/group absent. Now, and not earlier, all tmux clients are absent.
9. `FINAL_AUDIT`: require every control record terminal/reconciled, no active reservation/release/writer/control group, all known principal/groups absent, exact socket absent, strict final bounded process audit, no late event/action, and all resumed scheduler actors rejected by the current revision. One CAS publishes `CLEAN` and closes the lease/action surface.

Cleanup success never follows from `kill-server`, action exit, socket absence, a timeout, or poll count alone.

### Required scheduler and exact-host tests for cleanup control

The same transition implementation must be paused at, at minimum:

- reservation before/after history/current CAS; OS spawn before self-record; self-record before READY; lease loss before release;
- release CAS before read-back, frame byte, EOF, exec, connect, command delivery, server action, stdout/stderr EOF, close, result record, absence record, and reconciliation;
- control versus raw-signal authorization; two cleaner requests; former owner death with gate-closed or released control; new owner attempting action before old principal absence;
- server exit, PID/start/comm/PGID drift, socket unlink/rebind/dev-inode change, stale socket, and a replacement server between premise and retry;
- malformed/oversize/multirow control output, timeout, EPIPE, partial/duplicate frame, inherited writer, and a stopped control client;
- final no-autostart control before/after absence and every old actor resuming after proposed `CLEAN`.

Every trace ends in exact causal `CLEAN` or post-release FAIL/quarantine. A non-lease holder's tmux/raw-signal attempt always rejects.

The pinned no-auth host test must execute every closed argv against a harmless foreground server and against an absent socket; prove same-PID Node-to-tmux client identity where exec is used, no auth/canary possession, strict outputs, action-specific target effect, no-autostart, all control PIDs/groups absent, two-cleaner takeover, and final protected-state continuity. This extends the existing proven `-N` primitive; it does not substitute for the scheduler.

## Architecture 2: descendant observability and containment choice

### Option A — stronger persistent identity/containment wrappers

**What would be observable:** a production-installed wrapper could self-record PID/start/uid/PGID before payload and `execve` the helper at the same identity. A retained supervisor could additionally record child fork/exec/exit events. This would make the direct wrapper/helper identity observable.

**What it does not prove:** a wrapper/process group does not contain an arbitrary helper or descendant that calls `setsid`, creates a new PGID, double-forks/reparents, or otherwise escapes before the supervisor records it. Sampled ancestry after the parent exits cannot recover an unmarked same-uid child. To retain the universal R5 claim, Option A needs an identity-bearing containment/control primitive that survives parent, Claude, and tmux-server death and that makes escape impossible or durably observable before payload execution.

**Exact-host proof required:** first select the primitive (for example a reviewed private supervisor plus a proven Darwin job/containment surface; a wrapper alone is insufficient). In a no-auth test, prove record-before-payload, same-identity exec, fork/exec/exit capture, supervisor crash/takeover, and containment across a deliberately detached/new-PGID/double-fork child. In an isolated API-key Claude test, prove the exact installed managed hook and real sub-agent path enter that containment before receiving auth-capable environment, survive all normal lifecycle events, and are fully terminated after runner/server KILL without an unrecorded interval. Re-run the entire production T3 exact-SHA review and host capability evidence.

**Production T3 impact:** yes. Current install writes the direct shell-string `AGENTSTATE_LITE_MANAGED_HOOK=claude-v1 <helper> hook run`; the helper emits no PID/PGID receipt and has no containment wrapper/supervisor. Acceptance-only substitution would test the wrapper, not the shipped direct registration, so it cannot preserve the stronger production claim.

**Current source/helper support:** no. The exact source supports direct lifecycle semantics, not persistent process identity or arbitrary descendant containment.

**Residual claim if only a wrapper is added:** exact wrapper/helper PID identity, but still no arbitrary-escape completeness. Therefore a wrapper-only Option A does not close blocker 2.

**Disposition:** `BLOCKED_PENDING_VERIFICATION`. Do not use Option A in R6 unless a concrete containment primitive passes the tests above and T3 is reopened.

### Option B — narrow joined direct-hook plus known-principal pilot

**Accepted threat/scope:** exact Darwin arm64 / Claude Code 2.1.220 / immutable candidate, isolated machine-generated settings, non-malicious same UID, and only the exact production managed helper plus named acceptance observer/wrapper fixtures. Those binaries are trusted not to daemonize, call `setsid`, create detached work, or intentionally hide an auth-bearing process. Crashes, stopped known principals, runner/reaper death, PID reuse, socket loss, and two-cleaner races remain in scope. Arbitrary or malicious foreign hooks and unmarked same-uid detached processes are outside the pilot claim and must never be described as detected or contained.

If isolated settings contain an unreviewed foreign handler, or source review finds a reachable detach/daemon/spawn path in a compact lifecycle handler, the live lane is not eligible under Option B; production T3/host evidence reopens instead of silently expanding trust.

**What is observable:** short-lived direct handlers are observed as synchronous protocol executions, not PID inventory rows.

1. The pinned host evidence already proves every matching synchronous handler receives its own full stdin, handlers start in parallel, each start has a correlated response, and Claude does not advance past the event until all responses complete. The absence of command/args on an opaque response prevents identifying one silent handler, but it does not prevent proving that the complete configured handler set has no unmatched start.
2. A **joined-handler barrier** requires an exact frozen settings digest and handler count for each observed event; a bijection of all bounded `hook_started` ids to terminal `hook_response` ids for that event/session; no unmatched or duplicate start/response; the host advance point only after all responses; and exact candidate effect/output for the managed handler. It never maps an opaque id to settings order or recognizes a silent handler by output alone.
3. Managed semantics are bound independently: PreCompact requires its exact fresh head/generation effect plus exact `{}` or block output; SessionStart(source=`compact`) requires exact selected-generation context/halt output and the existing first-response/action oracle; PostCompact requires the exact audit mutation plus `{}`; Stop/SubagentStop require exact response-observation effect when the payload supplies it plus `{}`. The foreign observer has its own create-only record before return. The sequential wrapper retains its R5 child close+both-EOF+exit/output and guarded-generation proof.
4. Short-lived handler PIDs/PGIDs are intentionally not asserted or inventoried. A complete barrier proves the synchronous invocation returned; the immutable trusted-handler contract excludes a spawned detached remainder. If any start lacks a response, expected effect/output is missing, or a new event appears after the barrier, the attempt is FAIL/quarantined and cleanup cannot claim descendant closure.
5. Long-lived attempt principals remain exact identity/group objects: server broker/tmux, session and cleanup-control clients, tmux pane, Claude process/group, any separately observed long-lived sub-agent process, release writers, and the reaper. Each must be contained in a recorded known group or have its own exact identity and must be absent before `CLEAN`.

**Cleanup attribution:** after required lifecycle evidence, the authority fences all PTY/model input and future event-producing actions, requires joined `Stop` and (for L3) `SubagentStop`, requires no unmatched handler response, and leaves tmux server/control alive. It then terminates/proves the exact Claude/pane/known-long-lived descendant groups absent. Only afterward does it terminate the server. A termination-triggered hook adds another start/response pair and must join before descendant absence; if it does not, cleanup quarantines. KILL escalation is legal only after a current complete barrier shows no handler in flight. Server-before-descendant teardown is forbidden.

**Exact-host proof required:** 

- **No-auth join gate:** on exact Claude Code 2.1.220 and isolated settings, run the exact direct installed helper (not a wrapper) plus named observer fixtures; retain the settings digest, all start/response pairs, join/advance point, exact output/effect, helper/candidate identity, and zero unmatched handlers. Existing host evidence supports the primitive; the candidate implementation must repeat it without global-state drift.
- **API-key short-hook gate:** L1 manual, L2 automatic, and L3 real-subagent compaction on the same immutable candidate must exercise normal direct managed PreCompact, SessionStart(compact), PostCompact, Stop, and SubagentStop. Each event needs the joined-handler barrier and exact effect/output. A deliberately short normal managed hook must be allowed to start and exit between `ps` samples without being misclassified; its protocol/effect proof, not a fabricated PID, is authoritative.
- **Known escape-boundary gate:** a test-only, named foreign handler self-records a child and deliberately creates a new PGID/session/detached child before returning. The authority must classify the known survivor `KNOWN_PRINCIPAL_ESCAPED`/`DESCENDANT_CLEANUP_FAILED`, fence new actions, reap that recorded child under the exclusive lease, and refuse PASS. This test establishes the rejection boundary; it does not justify a claim about an identical unmarked process. Run it no-auth if startup hooks suffice; otherwise run it in the isolated API-key lane without changing the production helper.
- **Ordering gate:** keep the real server alive while a delayed synchronous test handler is in flight; cleanup may not cross `DESCENDANT_LAUNCH_QUIESCENT` until its response joins. Then prove known Claude/pane/sub-agent groups absent before `KILL_SERVER`, followed by server/socket/control absence. Exercise normal server control, socket-unlinked server TERM, and recovered server KILL only after descendants are absent.
- **Crash gate:** kill the runner at every event start/response/effect boundary. Recovery uses the retained all-handler start/response set and exact effect records. An unmatched start remains FAIL/quarantine; elapsed time or a clean final `ps` sample cannot repair it.

**Production T3 impact:** no production change is required if the narrower scope is accepted. T3 remains the exact direct registration and authority behavior. R6 changes acceptance infrastructure, product wording, and cleanup order. Any request for PID receipts/wrappers/containment or any discovered reachable detach behavior reopens T3.

**Current source/helper support:** yes for the narrowed semantic boundary, no for the future R6 harness. At exact HEAD `36c741a...`:

- `claudeLifecycleHookCommand` constructs the anchored direct `<helper> hook run` command, and install writes the same one command to all five lifecycle events;
- `hook run` parses one stdin payload, awaits `runClaudeHookPayload`, and writes one JSON result;
- compact lifecycle routing awaits the one handoff authority operation; SessionStart is the only context surface;
- the handoff authority, hook-authority adapter, and hook-lifecycle modules have no child-process/detach/`setsid` launch surface. `hook.ts` contains child-process code for separate health/status behavior and generated OpenCode support, so the required review is closed entrypoint reachability, not a misleading whole-bundle substring claim.

The existing helper does not self-record PID/PGID and the current live-harness skeleton does not implement the R5/R6 reaper. Those are exactly why Option B uses joined semantics for hooks and still requires the new acceptance authority for long-lived principals and cleanup controls.

**Residual product claim:**

> On the exact machine-controlled pilot tuple, with the immutable reviewed helper and only named trusted handlers, every configured synchronous lifecycle invocation either has complete host-join plus exact effect/output evidence or the attempt fails; every recorded long-lived attempt principal and process group is causally fenced and absent before CLEAN; and a known deliberately detached fixture cannot pass. The pilot does not claim to discover or contain an arbitrary unmarked same-uid process, a malicious/unreviewed foreign hook, or every possible daemonization escape.

This residual claim preserves real manual, automatic, and sub-agent compaction proof while removing only the unobservable universal descendant-completeness assertion.

## Comparison and decision

| Question | Option A: persistent identity/containment | Option B: narrow joined/known-principal pilot |
|---|---|---|
| Short direct hook observable? | Yes only after production wrapper; wrapper PID is observable | Yes now as complete synchronous handler set plus exact managed effect/output; PID intentionally not claimed |
| Arbitrary detached/new-PGID child covered? | Only with a new proven containment primitive; wrapper/group alone is insufficient | No universal claim; named fixture is detected/rejected/reaped, unmarked malicious escape is out of scope |
| New load-bearing host primitive? | Yes | No; uses already observed join, gated `-N`, `ps`, tmux, and bounded signaling surfaces |
| Production T3 reopened? | Yes | No, unless source reachability reveals daemon/detach behavior or scope is rejected |
| Current helper support? | No PID receipt, wrapper, supervisor, or containment | Direct five-event hook, exact effects/output, and no compact-path child launch support the scoped contract |
| Exact API-key work | Full wrapper/containment entry and escape proof before Plan confidence | Existing L1-L3 direct rail plus join/effect and reordered cleanup gates |
| Honest residual | Strong only after unproved containment exists | Exact machine-controlled trusted-handler/known-principal absence; no arbitrary escape claim |

**Decision:** Option B is the minimum repair that closes both exact R5 blockers without weakening the survived delivery, freeze, evidence, auth, or lifecycle contracts and without resting the Plan on an unverified host primitive. Product and skeptic reviewers must explicitly accept the residual claim verbatim or reject the architecture. They may not restore R5's “every unmarked escaped descendant is discoverable” wording through a final audit or fake scheduler.

## Replacement-Plan acceptance conditions

A future R6 Plan is reviewable only if it incorporates all of these as executable, closed criteria:

1. every cleanup tmux invocation is one gated no-auth reaper-lease-owned principal/action under the per-action state machine and allowlist above;
2. the second cleaner has no socket-control exception; controls and raw signals serialize through one lease/transition function;
3. application-client absence and final all-client absence are distinct; final all-client absence follows the last no-autostart control principal's group absence;
4. crash recovery conservatively treats every released control as action-possible and every unidentified possibly spawned control as FAIL/quarantine;
5. scheduler and no-auth host rows cover every named control gap, takeover, reuse/rebind, and post-CLEAN resumption;
6. the product claim uses Option B's exact scope and residual wording, with no arbitrary unmarked escape claim;
7. short-lived direct managed hooks are proved through the frozen-settings all-handler join barrier plus exact managed effect/output, never a fabricated PID or settings-order/output identity inference;
8. only named trusted handlers are allowed in live lanes; unknown foreign handlers or reachable daemon/detach code reopen T3;
9. cleanup fences new actions, completes the joined-handler barrier, and proves known descendant groups absent while server attribution/control still exists; server-before-descendant teardown fails;
10. exact no-auth, API-key short-hook, known detached/new-PGID rejection, ordering, and crash tests are mandatory and cannot be substituted by fake scheduling or the harmless tmux pane smoke;
11. every survived R5 candidate, verifier, campaign, schema, privacy, auth, wrapper, lifecycle, review-order, immutable-candidate, and closed-verdict contract remains unchanged unless this document explicitly repairs it.

If independent product and skeptic roles do not accept the narrow threat model, or if the exact host cannot reproduce the join barrier and descendant-before-server ordering, the correct result is `BLOCKED_PENDING_VERIFICATION` and the precise missing proof is Option A's identity-bearing containment primitive plus renewed T3/host review. It is not a caveated PASS.

## Result Envelope

```yaml
result:
  status: complete
  recommendation: OPTION_B_NARROW_MACHINE_CONTROLLED_PILOT
  plan_synthesis_eligibility: eligible_for_independent_review_only
  implementation_authorized: false
  live_or_auth_authorized: false
blockers_closed:
  - cleanup_control_clients_become_reaper_lease_owned_gated_principals_and_actions
  - direct_short_hook_completion_uses_host_join_plus_effect_not_unobservable_pid_inventory
  - cleanup_proves_known_descendants_absent_before_destroying_server_attribution
blocked_alternative:
  option: OPTION_A_STRONG_CONTAINMENT
  reason: no_selected_or_proven_identity_bearing_containment_primitive_and_current_T3_has_direct_hooks
required_exact_tests:
  - cleanup_control_fake_scheduler_full_gap_matrix
  - cleanup_control_exact_host_no_auth_closed_argv_and_takeover
  - exact_host_no_auth_direct_hook_join_without_global_drift
  - immutable_candidate_API_key_manual_auto_and_real_subagent_short_hook_join_effect
  - named_detached_new_PGID_child_forces_FAIL_and_is_reaped
  - delayed_hook_join_then_descendant_before_server_cleanup_order
  - runner_crash_at_each_hook_start_response_effect_boundary
residual_claim:
  - exact_pinned_machine_controlled_non_malicious_same_uid_trusted_handler_pilot_only
  - no_universal_arbitrary_unmarked_escape_or_atomic_PID_signal_claim
confidence:
  cleanup_control_repair: 0.94
  option_b_executability: 0.90
  option_a_currently_blocked: 0.99
```
