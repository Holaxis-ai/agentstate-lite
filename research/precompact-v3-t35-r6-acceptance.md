---
type: Research
title: Revision 3 T3.5 R6 product/acceptance repair adjudication
actor: codex-precompact-v3-t35-r6-acceptance
timestamp: '2026-08-04T00:04:45.354Z'
---
# Summary

**Decision: PASS_FOR_REPAIR_SYNTHESIS, selecting option B. Confidence: 0.95.**

For the exact pinned, non-malicious-same-uid, machine-controlled Claude-only pilot, the product needs a complete proof of compaction-memory delivery plus absence of every long-lived or cleanup-relevant principal and process group that the immutable candidate and acceptance lane are contractually allowed to create. It does **not** need—and the current host surface cannot prove—universal detection or containment of an arbitrary detached, unmarked same-uid process.

Option B is sufficient and testable if the next Plan removes the universal-descendant claim, replaces it with the exact bounded guarantee below, models every cleanup-control client as a reaper-lease-owned principal in the same transition authority, reverses server-before-descendant cleanup, and makes the real/no-auth boundary tests below mandatory. R5 itself remains FAIL and authorizes no implementation, Claude/auth use, or freeze.

I did not inspect any other new R6 repair-role note before this decision was immutable.

## Goal linkage and product boundary

- **Ultimate goal:** agentstate-lite is the shared, versioned, conflict-safe memory for a human and concurrent agent fleet, in plain text and owned by the user (`docs/core@sha256:58aacb19861269bf27bd73d1ff9abcdfe1c2eaab085e1fcdfb73b146afa2f595`).
- **Proximate goal:** select the smallest executable repair that proves the compaction-memory rail and its cleanup honestly on the pinned pilot without turning T3.5 into a general same-UID process sandbox.
- **Why B serves the goal:** the load-bearing product claims are correct handoff delivery, identity isolation, secret/global-state containment, and removal of capabilities the rail intentionally creates. Universal policing of arbitrary unmarked processes from trusted frozen components is a materially broader security product. Requiring it would reopen production and host architecture without improving the memory guarantee for the declared pilot.

## Exact inputs

- R5 review synthesis: `context-notes/precompact-v3-t35-plan-r5-review-synthesis@sha256:67cc57c003e0404619c7a757cd01883deeae548617c2be34287988e232728240`.
- Exact failed R5 Plan: `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`.
- Prior product/acceptance PASS: `context-notes/precompact-v3-t35-plan-accept-r5@sha256:ce8b51a0166f2a40ef45e5cdf8a95285cf52cd0542097f088754b46153ce601d`.
- Exact skeptic FAIL: `context-notes/precompact-v3-t35-plan-skeptic-r5@sha256:16ae6eb14cc0fcdeb962f9475eec4f9748b1c014bde880fcab47e1c207c0e09a`.
- Host panel synthesis: `context-notes/precompact-v3-t35-host-probe-panel-synthesis@sha256:bdee04f5f0d23c77cc97c6b4e0e8432377b880f0b81ab6eb093b61b4d7bf6093`.
- Host evidence audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.

All were read in full. Complete exported bytes independently matched every listed SHA-256.

## Correction to my prior model

My R5 PASS conflated **strict accounting of every observed process** with **proof that the observation set was complete**. That inference is invalid. A sampled process tree cannot prove that it saw a direct managed hook that started and exited between samples, and a bounded final snapshot cannot attribute an otherwise unmarked same-uid process after a parent detached, exited, or was reparented. Killing the tmux server before descendant launchers also destroyed useful ancestry/control before the claimed descendant proof was complete.

The corrected model separates two different obligations:

1. **Short-lived synchronous operation completion.** A direct managed hook need not have a durable PID receipt when the pinned host starts the exact configured command, synchronously joins matching hooks, the immutable helper produces its unique exact content-addressed effect/output, and a later host lifecycle event occurs only after that join. Command-specific effect plus the host barrier proves that the helper ran and completed; it does not claim its transient PID was inventoried.
2. **Long-lived cleanup capability.** Every principal or group that can remain live, spawn after the lifecycle barrier, hold auth, control tmux, or affect cleanup must have a durable exact identity or an accepted group-containment identity before PASS, and must be proven absent. Observed rows alone never establish universal completeness.

The mismatch was reasoning-based, not an environmental limitation: the skeptic used the same Plan and host evidence to show the missing completeness premise. The repair must retract the stronger claim, not add more polling.

## Option adjudication

### A — persistent self-recording/containment

Option A could support a stronger guarantee only if every Claude-spawned managed hook and subagent boundary is wrapped or supervised before payload execution, emits a durable PID/start/uid/PGID identity, and remains inside a persistent authority-owned containment surface that survives tmux/server/parent death. That requires a production receipt or wrapper boundary, renewed T3 review, and exact host evidence that the boundary cannot be bypassed. No current evidence proves such a surface.

**Disposition:** sufficient in principle, but not selected and presently BLOCKED on a broader production/host architecture. It becomes mandatory if the threat model includes malicious or unreviewed same-uid code, arbitrary plugins/hooks, a hostile Claude binary, portable hosts, or a guarantee that no possible attempt descendant can escape.

### B — bounded synchronous-completion plus known-principal guarantee

**Disposition: selected and acceptable for the ultimate goal.** It is smaller, matches the accepted pinned-host evidence, preserves the real delivery rail, and is falsifiable. It must be stated as a product boundary, not a caveat hidden under a claim of “full tree” cleanup.

## Exact B guarantee

The next Plan may claim PASS only for this closed scope:

1. Exact pinned Darwin/Node/tmux/`/bin/ps` and exact pinned Claude Code version/binary; one immutable candidate and one machine-authored campaign.
2. Non-malicious same uid. No competing same-uid actor deliberately races PID reuse, forges lane evidence, or hides processes.
3. Machine-controlled Claude-only lane: exact prompts/actions, no user timing, no arbitrary tool action, no unreviewed plugin, MCP server, hook, shell wrapper, or global configuration. The only hooks are the immutable installed candidate helper and exact manifest/lane-pinned acceptance observer/wrapper fixtures. Unexpected action or configuration is FAIL.
4. Direct managed hooks are synchronous ephemeral operations. Their completion proof is exact configured command/args start evidence where supported, a fresh nonce/generation-bound helper-specific effect and exact output, and a subsequent host event/return after the supported join barrier. No exact transient hook PID or “every short-lived process was sampled” claim is made.
5. The closed long-lived inventory includes server broker/foreground server, normal session-creation clients, every cleanup-control client, tmux pane and Claude launcher group, every explicitly declared separate/new-PGID child, and any acceptance hook/wrapper/subagent process that is allowed to outlive the synchronous host barrier. Each has durable PID/start/uid/PGID/state-comm/binary or declared group identity before it can be relied on.
6. A configured component that may detach or create a new PGID must be declared in the lane schema and must self-record its child identity before its parent returns. Missing, duplicate, conflicting, late, or unverifiable expected identity is post-release FAIL. The immutable production helper must be reviewed and tested not to detach or launch a long-lived child.
7. CLEAN means: every contract-required/recorded principal and group is absent; every normal and cleanup client is absent; no row in the bounded final audit matches the lane/candidate/known identities; the exact socket is absent; the final `-N` probe did not autostart; and protected/leak evidence is clean. CLEAN does **not** mean “no arbitrary unmarked process in the operating system could have descended from this attempt.”
8. An observed unknown inside a known group, with a lane/candidate marker, from a declared spawner, or otherwise attributable to the attempt is FAIL. An unrelated same-uid process outside all declared identities/groups/markers is outside the oracle and does not become evidence for or against PASS.

Any future text using “full Claude/managed-hook/subagent tree,” “every attempt-owned descendant,” “escaped process detection,” or equivalent must be replaced by this closed inventory and explicit non-goal.

## Required real/no-auth tests

These are executable gates, not fixture-only substitutes. Their raw rows, exact commands, candidate/host binding, and final audits must use the same strict authority and schemas as later live lanes.

### NH1 — pinned-host deliberately short-lived direct hook

- Use the exact pinned Claude binary with a relocated no-auth configuration and an event available before model auth (SessionStart is preferred); no real HOME/global auth fallback.
- Configure only exact immutable exec-form hook bytes plus the minimum passive recorder. The direct hook carries a single-use nonce, performs one create-only/fsynced helper-specific effect, emits exact bounded response bytes, and exits quickly enough that PID sampling is intentionally not an oracle.
- Require exact settings/command/args identity, exact hook-start evidence where the host supplies it, effect bytes/digest, response/exit outcome, and a host next-event/return record that cannot occur until the synchronous join finishes.
- PASS requires the effect before the join boundary and no live process afterward. Missing effect/output/barrier, host advancement before completion, or a survivor is FAIL. Failure to exercise the pinned host pre-auth event is BLOCKED_PENDING_VERIFICATION, not PASS.
- Separately run the exact installed candidate helper directly with exact hook stdin in a fresh no-auth lane and require its real journal effect, stdout/stderr, close/EOF, exit, and bytes. The combination proves real helper semantics plus real host join; it does not fabricate a PID-completeness claim.

Later L1-L3 must apply the same conjunction to the actual direct PreCompact/SessionStart rail: exact pinned settings; exact event start; fresh helper-specific content-addressed generation/effect; expected output; and the next lifecycle event only after host join. A missing effect or join is FAIL even if process cleanup is green.

### NH2 — declared detached/new-PGID child

- In a real no-auth private tmux pane, run an immutable declared test hook that spawns exact pinned Node with `detached:true`/a new PGID, self-records nonce-bound PID/start/uid/PGID/PPID observation/comm/binary before the parent returns, and remains live.
- Prove killing or stopping the ordinary pane group does not establish this separate group's absence. The authority must ingest the declared record, classify the child as a known cleanup-relevant principal, stop/reap its separate group before server destruction, and retain exact absence rows.
- Repeat with the expected self-record deliberately suppressed. The lane spec still declares the detacher, so `EXPECTED_PRINCIPAL_RECORD_MISSING` is FAIL and CLEAN/PASS is forbidden. An independent test controller may retain the child identity solely for safe test teardown; that controller's knowledge is not promoted into the product oracle.
- Mutate PID/start/uid/PGID/comm/binary, delay the record until after parent return, create two children for one reservation, and resume the child after proposed CLEAN; every case must fail.

This test proves the declared-detacher contract and demonstrates why pane-group absence is insufficient. It does not claim arbitrary unmarked detachment is detectable.

### NH3 — cleanup-control-client lifecycle and races

- On the exact no-auth pinned Node/tmux host, exercise each allowed cleanup action through the modeled client lifecycle below, including the final absent-socket `-N` no-autostart probe.
- Pause/crash at reservation, OS spawn before self-record, identity readback, release CAS/readback, connect, action before receipt, receipt before exit, and absence proof.
- Exercise two cleaners, control-versus-raw-signal, lease-owner death/takeover, server exit/reuse, a stale client resuming after proposed CLEAN, and retry after an uncertain action.
- PASS requires one lease holder, one recorded client per action, exact action/receipt or explicit uncertainty, absence of every client/group, no autostart, and no terminal CLEAN before the final probe client is absent. Every missing identity, nonholder action, ambiguous action/receipt, stale resume, or survivor after server release is FAIL/FAILED_QUARANTINED.

### NH4 — cleanup ordering on the real harmless lane

- Keep the verified tmux server/control surface alive while the pane/Claude-launcher group and every declared separate group are fenced, re-observed, terminated, and proven absent.
- Use a manifest-pinned stop/fence operation under the same raw-signal lease (for example group STOP followed by exact re-observation and kill) so the launcher cannot create a new known child after the final inventory. The exact chosen sequence must be proven on the pinned host and retain the accepted sampled-TOCTOU limitation.
- Deliberately reorder server destruction before known descendant absence; the oracle must go red. Deliberately omit the separate detached group; the oracle must go red.

## Cleanup-control ownership, lease, and state

Every cleanup tmux invocation is an explicit no-auth principal owned by the **same exclusive destructive reaper lease** that owns raw signals. Observers and a second cleaner may request or inspect cleanup but may not spawn, release, retry, or signal. No “idempotent second-cleaner control” exception remains.

The one transition authority must persist, per control ordinal and action digest:

`CCTL_RESERVED -> CCTL_IDENTIFIED_GATE_CLOSED -> CCTL_RELEASED -> CCTL_ACTION_OBSERVED -> CCTL_EXITED_ABSENT`

with fail branch `CCTL_ACTION_UNCERTAIN -> CCTL_EXITED_ABSENT` that sets/retains pending FAIL. Requirements:

- reservation and OS spawn occur under the campaign mutation boundary and current reaper lease;
- exact pinned Node broker, private PGID, no auth/canary, create-only/fsynced/read-back PID/start/uid/PGID/PPID observation/comm/binary identity before release;
- irreversible CAS/read-back release before one exact command frame; explicit tmux `argv[0]`, `-N -S <socket>`, minimal environment, and a closed action allowlist;
- allowlist limited to exact read-only inventory actions, exact `kill-server`, and the final absent-socket no-autostart probe. No `new-session`, `send-keys`, shell, or arbitrary command after `REAPING`;
- exact bounded stdout/stderr/exit/action receipt, raw process/group observations, and final absence. Action uncertainty never becomes success merely because later state looks clean;
- takeover only after exact former lease-owner absence and fresh CAS. The successor first resolves/reaps every pending control principal and re-observes server/groups/socket; it never trusts `signal_sent` or an unbound action receipt. A retry, if still legal, is a new ordinal/reservation after the prior client is absent and remains under the sole lease;
- `all clients absent` is asserted only after the last cleanup-control client—including the final no-autostart probe—is proven absent.

Spawn-before-record ambiguity occurs after server release and is therefore pending FAIL/`FAILED_QUARANTINED`, not pre-release BLOCKED.

## Required cleanup order under B

1. Capture the required compaction/first-response/action evidence and the final supported host join/effect proof for every direct synchronous hook.
2. CAS `REAPING`, acquire/confirm the exclusive reaper/control lease, fence all normal releases, PTY actions, tmux actions, deliveries, and evidence writers, and close all normal control writers.
3. Resolve and prove all normal session-creation clients and any inherited pending cleanup-control clients absent. This is “normal clients absent,” not the final all-clients assertion.
4. While the verified server still answers, use a lease-owned modeled read-only control client to refresh the exact pane/session inventory. Fence/stop the pane/Claude launcher group and every declared separate/new-PGID launcher group under the raw-signal lease, then refresh the closed known-principal inventory.
5. Terminate and prove the pane/Claude group, every declared detached group, and every other known long-lived hook/wrapper/subagent principal/group absent. Direct ephemeral hooks are discharged by the join/effect proof, not invented PID rows. Re-observe the still-live server after descendant absence.
6. Only now use a lease-owned modeled cleanup client for exact `kill-server`; prove that client absent, then use identity-revalidated raw fallback if needed and prove broker/server PID/group absent.
7. Validate exact socket device/inode/path/type/uid/mode only after all creators/groups are absent; unlink/fsync if stale.
8. Run the final modeled `-N` no-autostart probe, prove that control client absent, repeat strict known PID/group/socket/lane-marker audits, retain the bounded final audit, and test stopped actors resumed against the terminal fence.
9. Publish CLEAN only after every preceding proof and final all-clients absence. A pending FAIL remains FAIL even if cleanup reaches CLEAN; unresolved cleanup is `FAILED_QUARANTINED`.

## Closed acceptance criteria for the repaired Plan

The repair earns future Plan PASS only if it states all of the following without a stronger implied claim:

1. Option B scope/threat boundary and arbitrary-unmarked-escape non-goal are prominent and machine-reflected in schemas/verdict text.
2. Direct ephemeral helper completion uses the host join + exact helper effect/output oracle; no transient PID completeness is required or claimed.
3. A closed long-lived principal/group inventory exists per case; every configured detacher is declared/self-recording; the immutable production helper has no detach/long-lived-child path.
4. Cleanup-control clients have the exact lease, reservation, release, action, recovery, absence, and audit lifecycle above. Only the lease holder controls or signals.
5. Cleanup eliminates/fences descendants before destroying server/ancestry/control, and final all-client absence occurs after the final `-N` probe.
6. NH1-NH4 and fake crash/race analogues are mandatory before G0; fake rows cannot substitute for the real no-auth cases.
7. One immutable candidate later proves manual main, automatic main, and real-subagent compaction with the original R4 delivery/canary/action oracles. Green cleanup cannot substitute for delivery.
8. PASS is impossible on missing join/effect, expected principal record, known identity/group, cleanup-control record/receipt/absence, descendant-before-server order, final audit, or protected/leak evidence.
9. Any observed attributable unknown/survivor, declared but unrecorded detacher, unexpected action/configuration, post-release uncertainty, or late actor is FAIL. Pinned host/PTY inability before exercise is BLOCKED; it is never PASS.
10. Any requirement for arbitrary unmarked-escape detection, malicious-same-uid containment, non-pinned portability, or production helper receipts selects option A and reopens T3/host evidence before implementation.

## Issues and blockers

- R5's cleanup-control hole and universal-descendant claim remain load-bearing blockers to R5; this adjudication does not cure that digest.
- No blocker remains to **repair synthesis** if the planner selects B exactly as bounded above. A Plan that retains “full tree/every descendant/escaped process” language, leaves cleanup control outside the lease/state machine, or destroys the server before known descendants are absent must receive FAIL.
- Option A remains blocked pending a deliberate scope expansion, production boundary, and new host evidence; it is not needed for this pilot.

## Verdict

**PASS_FOR_REPAIR_SYNTHESIS — option B.** Confidence: **0.95**.

This is permission to synthesize and exact-review a repaired Plan only. It is not Plan PASS and does not authorize F0/H0 implementation, Claude/auth use, G0, or live acceptance.
