---
type: Context Note
title: Revision 3 T3.5 exact-R5 adversarial skeptic verdict — FAIL
actor: codex-precompact-v3-t35-r5-skeptic
timestamp: '2026-08-03T23:55:01.282Z'
---
# Summary

Status: complete.

Verdict: **FAIL** for exact Plan R5 `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`.

Confidence: **0.97**.

R5 preserves the accepted R4 candidate/freeze/verifier/campaign/wrapper/auth/lifecycle architecture and closes the prior broker/session-client late-bind race in its primary launch graph. The exact Plan still has two load-bearing executable gaps, however. First, cleanup introduces `-N` control clients after it has proved clients absent, while `REAPING` simultaneously claims to fence all later tmux actions; no state, ownership, or final-absence contract exists for those cleanup clients, and the Plan explicitly permits a second cleaner to retry them. Second, the real-tree oracle requires exact PID/start/uid/PGID binding for every managed hook, including short-lived hooks, but normal managed lanes invoke the immutable installed helper directly and provide no PID-bearing host event or self-recording wrapper. Sampled `/bin/ps` can miss such a process, and server-before-descendant teardown can destroy ancestry before a late or escaped child is attributed. The final audit therefore cannot recompute either “every attempt-owned descendant was inventoried” or “an unseen escaped descendant would have forced FAIL.”

These are Plan defects, not implementation details or later-live caveats. P35 itself says omission or ambiguity is FAIL. No T3.5 code, H0/F0, Claude/auth use, or G0 is authorized by this review.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: adversarially decide whether exact R5 makes launch, cleanup, and real descendant absence one causal executable proof before implementation; this serves the ultimate goal by preventing a late auth-capable process or an unrecomputable lifecycle claim from entering the compaction-memory acceptance rail.

## Exact inputs and isolation

Read in full and verified by `./aslite` receipt:

- current task `tasks/pre-compact-multi-session@sha256:03126c1ba1846ab43a2e45e7664d015405b63b545839aff8ea54eebe331b2caf`;
- exact R5 Plan `plans/precompact-v3-t35-candidate-acceptance@sha256:c7a9e198b6580fbc59519b5b90aa4e9a55cab9c6ded97d818ca5c0ae3977bd4c`;
- panel synthesis `context-notes/precompact-v3-t35-host-probe-panel-synthesis@sha256:bdee04f5f0d23c77cc97c6b4e0e8432377b880f0b81ab6eb093b61b4d7bf6093`;
- prior host skeptic `context-notes/precompact-v3-t35-host-probe-skeptic@sha256:3980e9bdf01f4180999a6ab47347adc33d73d2c74f54e5c84e70e97932c38f62`;
- host acceptance `context-notes/precompact-v3-t35-host-probe-acceptance@sha256:c973fd9bca6eb26cf08a659882c9e9c96f22ea7812d7ee43809873a40fe9b82f`; and
- evidence audit `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.

The three required skills and repository guide were reread in full. I did not inspect any parallel exact-R5 product/acceptance verdict or note before making this verdict immutable. I did not touch code, the feature worktree, Plan, task, orientation, Claude, auth, tmux, global configuration, candidate, or retained host evidence.

## Attacks and adjudication

### 1. Server broker reservation, OS spawn, self-record, and release

**Survived.** The campaign mutation lock covers current-state check, durable reservation, and OS spawn. The broker is exact pinned Node, no-auth, gate-closed, private-grouped, and unable to consume a frame before a create-only/fsynced/read-back identity. Server release is an irreversible CAS/read-back before one bounded frame, and the broker revalidates revision/nonce/identity. `SERVER_RELEASED` conservatively means delivery, auth possession, exec, or bind may already have occurred. Missing pre-release identity is absorbing no-auth quarantine and never CLEAN/retry/release; after release the same uncertainty is FAIL plus reaping. This closes the R4 late-bind defect for the principal described by the launch graph.

A stopped live campaign-lock owner can still prevent recovery indefinitely because lock takeover requires owner absence. That is an availability limit, not false CLEAN: no competing actor can enter `REAPING` while the owner remains live. R5 should avoid claiming every indefinitely stopped-owner trace has already reached a persisted terminal state, but this is not the reason for FAIL.

### 2. Server frame, EOF, inherited writers, exec, and bind windows

**Survived.** Durable release precedes delivery; partial, duplicate, inherited, late, and post-fence frames fail; FD 3 closes before exec; explicit POSIX `argv[0]`, commandless `-D -f /dev/null -S`, same-principal Node-to-tmux identity, zero-session state, and socket identity are exact oracles. A crash after release but before observed exec/bind cannot be reclassified BLOCKED.

### 3. Session client reservation through pane creation before evidence

**Survived for the named session-creation client.** The client repeats the gate-closed no-auth identity and CAS protocol, uses explicit `argv[0]` and `-N`, receives no auth/canary, and is ordered before server cleanup. Any client ambiguity occurs after `SERVER_RELEASED`, so it is post-release FAIL, not pre-release BLOCKED. A crash after `SESSION_RELEASED` conservatively means a pane may exist; recovery queries the verified server and may not CLEAN on missing/inconsistent evidence.

### 4. Cleanup-control-client state hole

**Blocker.** The monotone launch graph models only the server broker and session-creation client. It says `REAPING` fences every future spawn, release, delivery, and tmux action, and cleanup step 2 first terminates/proves every released or possibly released client/delivery creator absent. Cleanup step 3 then says to use an exact `-N` control client; `stage cleanup` prefers socket `kill-server`; and the reaper paragraph permits a second cleaner to retry idempotent socket control.

Those statements cannot all be executable without another authority rule. A cleanup `tmux -N` invocation is itself an OS-spawned tmux client after the claimed client-absence boundary. R5 gives it no reservation/self-record/release state, no reaper-lease ownership rule, no crash-before-record disposition, no command allowlist, no two-cleaner serialization, and no explicit PID/group inclusion in terminal proof. Direct spawn can therefore be paused or crash between OS creation and evidence, while a second cleaner can issue the same destructive control. Conversely, implementing the stated terminal fence literally forbids the control action the cleanup algorithm requires.

Minimum repair: define cleanup control as an explicit reaper-lease-owned principal/action in the same transition function. State whether it is direct or gated; pin its no-auth environment and exact `-N` argv/closed command set; reserve and durably identify it before use; define crash-before-record and post-action recovery; prove its PID/group absent; include it in raw/final audits; and either forbid every non-lease-holder from issuing `kill-server`/other control or prove a precise serialized idempotence rule. Amend the cleanup order so “clients absent” is asserted only after the last cleanup-control client is absent. Add fake traces at spawn-before-record, connect-before-action, action-before-receipt, two-cleaner control-versus-signal, server exit/PID reuse, and resume after proposed CLEAN.

### 5. Reaper takeover, signals, PID/PGID reuse, and stopped actors

**Survived within the declared pilot risk, apart from the cleanup-client hole.** One recoverable raw-signal lease, exact former-owner absence, fresh CAS, restart-from-first-principles observation, immediate PID/start/uid/PGID/state-comm/binary revalidation, and no signal on mismatch implement the accepted bounded sampled-identity decision. CLEAN is absorbing only after release/spawn/delivery fences, known principal/group absence, stale-socket handling, final audit, and post-clean no-autostart. The Plan honestly does not claim pidfd-like or atomic no-mistarget signaling.

R5 should clarify that an exact absent target is an observation to re-run/complete, not automatically an ambiguity requiring quarantine; its phrase “mismatch/absence forbids the signal and quarantines” conflicts with exact process/group absence as a successful cleanup predicate. This is repairable wording once the cleanup transition is made explicit.

### 6. Pane, Claude, hook, wrapper, and sub-agent escape

**Blocker.** “Real Claude and descendant teardown matrix” requires the immutable candidate to create-only discover and bind exact PID/start/uid/PGID identity for the pane, Claude, every managed/foreign hook and wrapper, and every sub-agent throughout L1-L3. It further says bounded process snapshots and self-records must explain every transition, including short-lived hooks, and any escaped/unknown process is FAIL.

The normal managed lanes have no mechanism that can satisfy that claim. The managed PreCompact/SessionStart/PostCompact/Stop/SubagentStop entry invokes the immutable installed helper directly. Only the foreign observer and the one corruption wrapper self-record through the acceptance harness. R5 bans opaque-id/output/order inference for silent handlers, and the pinned host records do not supply hook PID/start/PGID. T3.5 is forbidden to add a production helper receipt channel. Therefore a short-lived normal managed helper can start and exit between `/bin/ps` samples without ever yielding the exact identity the oracle requires.

The cleanup order compounds the gap: it refreshes/fixes the server-visible inventory, then kills the server before terminating the separate pane/Claude/hook/sub-agent groups. Claude or a hook remains able to create another child in that interval; server death can also reparent descendants and destroy the ancestry used for attribution. Same-pane-PGID absence covers descendants that never leave that group, but R5 explicitly claims to detect an escaped process. A final bounded all-process snapshot cannot infer that an otherwise unmarked same-uid process was spawned by the attempt after its parent exited, so it cannot recompute “no unseen escaped auth-bearing descendant” or reliably turn that case into FAIL. Fake scheduler injection proves policy only when the fake tells the authority which process escaped; it cannot make the real oracle observable. The harmless-pane/no-auth smoke is explicitly insufficient.

Minimum repair: give every load-bearing real process a causal, observable ownership/containment surface rather than sampled ancestry alone. At minimum, either (a) reopen T3/host evidence and arrange immutable PID-bearing self-recording wrappers/gates for every Claude-spawned managed hook and sub-agent boundary before payload execution, plus a persistent authority-owned containment/supervisor identity that survives parent/server death, or (b) state and independently accept a narrower group-containment guarantee, prove on the exact host that every auth-capable Claude/hook/sub-agent process remains in the recorded containment group, and remove the stronger undetectable-escape claim. Cleanup must fence/stop the descendant launcher, freeze an attributable inventory, and terminate/prove descendants before destroying the ancestry/control surface needed to identify them. Add a real exact-host test with a deliberately short-lived managed hook and a deliberately detached/new-PGID child; fake/smoke rows cannot satisfy it. If the host cannot provide this observation/containment without production change, exact R5 remains blocked and T3 must reopen as R5 itself requires.

### 7. Stale sockets, fallbacks, and final audit

**Survived conditional on closing blockers 4 and 6.** Creators/processes/groups precede exact dev/inode/path/type/uid/mode stale-socket unlink and parent fsync. Socket absence/removal, `kill-server`, timeout, and poll count are never process proof. Raw pre-fallback facts and fallback actions remain distinct, and the retained bounded final audit plus post-clean `-N` check prevent the v5 summary/fallback from manufacturing PASS. The final audit cannot repair an ownership surface that never recorded or causally contained a principal, which is why blocker 6 remains load-bearing.

### 8. Evidence authority, recomputability, privacy, and invocation binding

**Survived at Plan level.** R5 demotes v5 summaries/negative booleans to research, requires canonical standalone schemas, one validator registry, unknown-key rejection, validator identities/receipts, strict raw process/group/socket/argv/pre-fallback/final-audit records, exact candidate/manifest/invocation/real-HOME binding, and bounded recomputable nonsecret privacy inputs. It retains real secret bytes only in memory and requires strict scan scopes/commitments. Implementation review must make validation receipts nonrecursive/rooted in the pinned registry, but the Plan contains the necessary authority boundary.

### 9. R4 regression audit

**Survived.** Exact-full identity; corrected jq/promote behavior from the accepted design chain; transactional absent-root freeze; one build/pack; factored existing-tarball verifier; install-triggered npm script boundary; immutable manifest/helper/harness bytes and modes; history-before-current campaign ledger; hard-link lock; challenge-bound R0/Q0; serialized L0; sequential close-plus-EOF fresh-generation wrapper; supported SessionStart(source=compact) restore; isolated API-key-only auth; protected global snapshots; and PASS/FAIL/BLOCKED distinctions remain present. `sess` is removed, zero-leading-space Darwin PID grammar is fixed, PPID is observation-only after parent death, and pane PGID is separate.

### 10. Gate order and fake/smoke substitution

**Survived.** P35 exact dual PASS precedes F0/H0/code; red-first build precedes independent exact-SHA R35; R35 precedes G0; frozen R0 then Q0 precede L0/L1/L2/L3; Review precedes QA; any source/artifact mutation restarts the chain. Fake scheduler and harmless no-auth smoke are expressly barred from satisfying real manual, automatic, sub-agent, or real-tree acceptance. Post-PreCompact rail loss and all post-release cleanup/identity uncertainty map FAIL; later process CLEAN cannot erase FAIL.

## What survived

- Exact candidate/freeze/verify-existing/manifest/package identity and immutable post-G0 chain.
- One executable policy/codec/transition authority and strict raw evidence plan.
- Crash-atomic campaign ledger, consumption slots, serialized L0, hard-link owner lock, and challenge-bound assertions.
- No-auth gate-closed server broker and separately gated no-auth session client, each identity-before-release with explicit `argv[0]` and one-shot CAS/read-back frames.
- Commandless foreground tmux, `-N` no-autostart, removal of `sess`, corrected Darwin single/group parsing, separate pane PGID, process-first stale-socket cleanup, and honest sampled-PID risk scope.
- Sequential PreCompact wrapper with child stdin-finish, both EOFs, close, exit/no-signal, fresh-generation causation, guarded corruption, exact restoration, and no debug-id inference.
- Isolated API-key-only live boundary, no real-HOME/global-auth fallback, protected-state continuity, honest hook-tree inheritance allowance, and BLOCKED-to-FAIL override on cleanup uncertainty.
- Strict predecessor order and non-substitutability of fake/no-auth evidence for live manual/automatic/sub-agent compaction.

## Blocking issues and verdict

1. **Cleanup clients are outside the launch/reap state machine while required after the terminal fence and after client absence.** Repair the principal/state/lease/order/final-audit contract exactly as specified in attack 4.
2. **Real short-lived/escaped descendant completeness is not observable under the specified immutable direct managed-hook and sampled-ps architecture.** Add a causal identity/containment surface or narrow and explicitly re-accept the guarantee, reorder cleanup to preserve attribution, and prove the real short-lived/detached cases as specified in attack 6.

Verdict: **FAIL**. Both blockers are load-bearing. The smallest permissible next step is R5 repair and fresh exact product/acceptance plus adversarial-skeptic review. No implementation or live/auth work is authorized.

## Proximate-goal linkage

The proximate goal was to determine whether R5 turns the accepted host primitives into one causal executable proof. The principal server/session release graph now does, but cleanup creates an unmodeled client class and real descendant completeness remains stronger than the available observation surface. Rejecting this exact Plan prevents those unverified claims from propagating into an expensive frozen/live campaign and serves the ultimate goal of durable, conflict-safe fleet memory with a rail whose absence guarantees are actually attributable.
