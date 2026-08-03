---
type: Context Note
title: Revision 3 T3.5 product and acceptance plan review R4
actor: codex-precompact-v3-t35-accept-r4
timestamp: '2026-08-03T22:24:57.751Z'
---
# Summary

P35 product/acceptance review complete for the immutable exact Plan version `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`.

Verdict: **FAIL**  
Confidence: **0.98**

F0 remains blocked. This verdict does not authorize implementation or G0.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether exact Plan R4 is a complete executable acceptance authority for one reviewed candidate; this serves the ultimate goal by preventing a crash-surviving auth process from escaping the evidence and cleanup chain.

# Exact review basis

Read through the raw-byte channel and reviewed in full:

- this exact R4 Plan at `sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`;
- `context-notes/precompact-v3-t35-plan-accept-r3@sha256:1632c52273ab9a4aafb6d7bd342dee6f8bfc82ca14b77097381763c1e4a2c934`;
- `context-notes/precompact-v3-t35-plan-skeptic-r3@sha256:a348bf7f680bb089a48a919dbcbf6ebaf865d876198b105dfa18ebdcdd27507dd`;
- accepted design `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`;
- accepted implementation plan `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`;
- installed-host note/addendum `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`; and
- current orientation `context-notes/precompact-v3-orientation@sha256:f6315314629204b35fa0cd8bc3b5890ae5995a82b7e84c0ac204ff3c9b45375b`.

The implementation worktree was inspected read-only at clean HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`; `origin/main` is an ancestor, package version is `0.1.0-pre.3`, npm is `11.6.2`, the package retains the intentional publish-only `prepublishOnly`, and `scripts/handoff-candidate.mjs` is not yet present. Current production surfaces confirm the pinned managed command, generic wrapper-substitution status, diagnose identity/version fields, physical journal layout, and byte versions as `sha256:<raw-byte-digest>`.

No repository code was edited and no Claude, tmux, live auth, or lifecycle journey was run. A sandbox refusal to execute `/bin/ps` during optional read-only inspection is not treated as product evidence; the Plan correctly makes pinned-ps behavior a red-first and R35 exact-host gate.

# Blocking finding

## `RESERVED_NO_SERVER_RECORD` can certify absence before a late tmux socket appears

R4 correctly durably reserves the exact private socket before spawn and permits cleanup to kill by that socket before PID/server-record bookkeeping. That closes the former “server exists but PID record is missing” case **when the socket already exists**.

It does not close the adjacent crash/race:

1. the ledger durably enters `RESERVED_NO_SERVER_RECORD`;
2. the runner spawns the tmux client/server with the API key in its inherited environment;
3. before the tmux server creates/binds the socket, the runner dies or a concurrent cleanup starts;
4. cleanup observes the socket absent and, per R4, treats termination as already satisfied and CAS-records cleanup; and
5. the already-spawned tmux client/server later creates the reserved socket and survives with auth after the campaign is certified clean.

Socket absence is a state observation, not proof that no already-launched process can bind that path later. The red-test list names “tmux spawn before socket,” but the specified algorithm has no durable launcher identity, process group, gate/handshake, or stable-absence condition that makes this test pass for the right reason. A fake fixture could simply omit the late appearance and conceal the gap.

The same issue exists if a reserved-state cleanup races a live runner rather than a crashed one. The campaign mutation lock is deliberately not acquired before process termination, so it does not serialize spawn against the first absent-socket observation. In `IDENTIFIED_SERVER`, R4 correctly requires the recorded PID/start to be gone; however, if the socket disappears while that exact PID remains live, the Plan names no verified-PID/process-group termination fallback.

This is load-bearing: the tmux server and Claude descendants are explicitly allowed to possess the real API key. A cleanup proof that can precede process creation violates the privacy boundary, retry premise, and measurable criterion 17.

### Minimal executable repair

Add a crash-safe launch principal and a closed spawn/cleanup state machine:

- Before any auth-bearing tmux exec is permitted, start an authority-owned launch broker in a gated state and durably record its PID/start/uid/executable digest and process-group identity under the campaign CAS. The broker must not receive/release auth or exec tmux until that identity is durable.
- Transition through explicit `LAUNCHER_IDENTIFIED -> SPAWN_RELEASED -> IDENTIFIED_SERVER` states. Cleanup first revokes the gate and terminates the exact recorded launcher/process group; only after that principal is proven gone may initial socket absence count as stable.
- If spawn was released, cleanup must poll the exact socket through the bounded launch/termination interval, kill it whenever it appears, and prove both launcher/process-group absence and stable socket absence. A single absent observation is never sufficient.
- In `IDENTIFIED_SERVER`, if the socket is absent but the exact recorded PID/start remains live, terminate that exact verified PID/process group with a bounded TERM/KILL policy and re-prove absence; never pattern-kill.
- Only after all possible binders and the socket are absent may cleanup acquire/recover the campaign lock and publish its proof or permit a new campaign.

Add adversarial red traces for: cleanup immediately after OS spawn but before socket bind; delayed/stopped launcher resuming after an initial absent check; live runner versus cleanup; socket appearing after cleanup's first poll; socket removed while identified PID remains; runner/launcher death before and after auth inheritance; and two cleanup callers. Each must leave no process/socket and no ability to create one after the terminal proof.

# What survived attack

- **Fresh-generation causation:** pre-child `HANDOFF_NOT_FOUND` plus empty physical inventory, exact child stdin finish/both EOFs/close/exit/no-signal/output predicates, post-child `OK`, exactly one byte-validated head/generation, diagnose-version agreement, guarded corrupt replacement, and honest wrapper attestation close the R3 causation gap.
- **Production seam honesty:** R4 pins the current shell-string managed entry, the deliberate exec wrapper, exact generic unready status, cwd/environment/managed marker, installed helper bytes, direct pinned Node choice, and `direct_managed_precompact_registration:false`; other lanes prove direct registration.
- **Opaque-host evidence discipline:** the wrapper uses no debug/opaque/order identity inference. Passive observers prove occurrence only; nonempty managed results and state/canary consequences carry the effect claims.
- **Auth boundary:** the Plan now honestly permits transient possession throughout the exact Claude-spawned hook tree, removes auth from the wrapper child, bans all global/normal/OAuth fallback, leak-scans persistent/output surfaces, and maps pre-tmux missing/invalid auth or later API failure to stopped-shipping `BLOCKED_AUTH`.
- **Serialized L0:** one `live_l0_attempt` makes the six Q0 fan-out slots sequential; each case finalizes and reaps before the next opens, so campaign closure has no live sibling cancellation ambiguity.
- **Replay and predecessor authority:** immutable complete owner files plus hard-link acquisition, strict pinned-ps recovery, history-before-current publication, authority-generated ids/challenges/lanes, one-use slots, exact aggregate, and cross-campaign/stale/duplicate rejection are executable and measurable.
- **R0/Q0 trust claim:** strict authority-written rubric assertions bind challenge, attempt, candidate, source, prefix, actor/declaration, evidence and red action; attestations claim only that the reviewer/QA asserted PASS. Human semantic truth and role independence remain explicitly orchestration-owned rather than hidden.
- **Freeze and package boundary:** absent-leaf atomic freeze is observable. The shared npm-11.6.2 rule rejects the seven install-triggered scripts and implicit `binding.gyp`, permits publish-only `prepublishOnly`, and claims only successful offline empty-cache install with no network dependency—not unseen network/descendant behavior.
- **Live acceptance:** L0-L3 have closed event, identity, first-response, exact action, truncation, privacy, timeout and failure oracles. Required inability remains `BLOCKED_PENDING_VERIFICATION` and stops shipping; post-PreCompact rail loss is FAIL.
- **Fault disposition:** settings/prefix mutations use expected-digest restoration, corrupt journals are honestly tainted/closed, and cleanup failure cannot produce an advancing sidecar.

# Verdict

**FAIL** this exact R4 Plan. Preserve all other R4 repairs. Replace the first-absence tmux cleanup rule with a durably identified, gated launch principal/process group whose ability to create the socket is revoked and proven gone before terminal cleanup. Re-run both exact-version P35 reviewers after that narrow repair. F0 and G0 remain blocked.
