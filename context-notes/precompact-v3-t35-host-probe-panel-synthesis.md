---
type: Context Note
title: Revision 3 T3.5 host-probe panel synthesis
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T23:30:53.535Z'
---
# Summary

## Revision 3 T3.5 host-evidence panel synthesis

Status: complete. Verdict: **unanimous PASS for replacement-Plan synthesis only**. This does not authorize implementation, F0/H0, Claude or API-key use, G0 freeze, or any live acceptance stage.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: synthesize one exact replacement T3.5 candidate/live-acceptance Plan from the survived R4 architecture and the independently accepted host corrections, then obtain independent acceptance and skeptic PASS on that exact Plan; this serves the ultimate goal by turning compaction-memory delivery into one executable, replay-resistant and empirically gated rail rather than a convention or an unowned process assumption.

## Independent inputs

- Evidence audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01` — PASS for attributable research input, confidence 0.90 scope / 0.94 empirical.
- Product/acceptance: `context-notes/precompact-v3-t35-host-probe-acceptance@sha256:c973fd9bca6eb26cf08a659882c9e9c96f22ea7812d7ee43809873a40fe9b82f` — PASS for Plan-synthesis eligibility, confidence 0.97.
- Adversarial skeptic: `context-notes/precompact-v3-t35-host-probe-skeptic@sha256:3980e9bdf01f4180999a6ab47347adc33d73d2c74f54e5c84e70e97932c38f62` — PASS for Plan-synthesis eligibility, confidence 0.96.
- Exact selected host research: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf` with retained root `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`.
- Survived base Plan: `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812` (R4, rejected only on launch/reap and Darwin ps grammar).

The roles were isolated until verdict completion. None inspected another role's conclusion before deciding. All three scopes explicitly stop before implementation or live/auth work.

## Agreements

All three reviewers agree that the selected v5 campaign is strong enough to plan against and that its exact host scope must remain narrow:

1. Preserve R4's candidate freeze, factored existing-tarball verifier, challenge-bound R0/Q0, campaign history/lock, serialized L0, sequential PreCompact corruption wrapper, auth boundary, protected snapshots, lifecycle lanes, and immutable-candidate chain.
2. Use one executable authority with a validated strict evidence schema. It owns broker/client reservation, release frames, state transitions, process parsing and signaling decisions, reaper lease, socket cleanup, raw evidence, and terminal verdicts.
3. Pin the exact Darwin arm64 / Node v25.2.1 / tmux 3.6b / `/bin/ps` tuple. `process.execve` must include the executable as POSIX `argv[0]` and exec exact commandless `tmux -D -f /dev/null -S <socket>`.
4. Remove `sess`/SID entirely. Do not require PPID stability after parent death. Correct the Darwin parser to allow zero or more leading PID spaces and add strict exact `/bin/ps -g` group parsing.
5. The server broker and the separate `tmux -N` session client are no-auth, gate-closed principals that must each be durably identified and read back before an irreversible CAS release. The client is fenced and terminated before the server.
6. OS spawn before durable self-record is not atomic. A missing broker/client identity is non-advancing no-auth quarantine/`BLOCKED_PENDING_VERIFICATION`; timeout, absent socket, or absent record can never establish CLEAN or permit retry/secret release.
7. Pane PGID is distinct from server PGID. The harmless pane died on kill-server, server-group TERM, and server-group KILL, but real Claude, hooks, and sub-agents still require exact later immutable-candidate process-tree discovery and teardown gates. Any unknown or survivor after release is non-advancing FAIL.
8. Only one recoverable destructive-reaper lease may send raw signals. Takeover requires exact prior-owner absence and restarts identity verification; a second cleaner may request or observe but cannot signal.
9. Cleanup is causal: fence every future release; stop every released client/delivery creator; terminate and prove server, pane and Claude descendants/groups absent; validate and remove only an exact owned stale socket; repeat no-autostart/process/group/socket checks; persist the bounded final process audit; then and only then publish terminal proof.
10. Fake-scheduler tests must cover every crash and resume boundary, two-cleaner races, partial/duplicate frames and inherited FDs, release-versus-reap, exec/bind/session/pane windows, stale sockets, PID/comm/PGID drift, and actors resuming after proposed CLEAN.

## Deliberate scoped risk decision

Acceptance and skeptic independently reach the same product judgment: sampled PID/start/PGID verification followed by `kill` is accepted only as a bounded operational risk for this pinned pilot under the existing non-malicious-same-uid threat model. It is not pidfd-like, is not atomic identity-safe signaling, and must never be described as preventing all mistargeting. The mitigation is one exclusive reaper, private process groups, exact immediate PID/start/uid/PGID/state-specific-comm and pinned-binary revalidation before each signal, no signal after mismatch/absence, quarantine on ambiguity, and exact post-signal proof. If the threat model broadens or atomic no-mistarget behavior becomes a requirement, this decision expires and an identity-bearing supervisor/kernel primitive is mandatory.

The evidence auditor did not independently adjudicate product acceptance of this risk; it correctly classified the sampled TOCTOU as a limitation requiring this explicit decision. There is no disagreement once scopes are separated.

## Evidence-audit constraints that must enter the replacement authority

The exact raw rows, not the generated v5 summary substring check, are authoritative. The replacement Plan must require:

- a standalone strict schema/validator identity and validation receipt for every retained record;
- a strict raw ps parser and explicit pre-fallback observations so fallback cleanup cannot manufacture a primitive result;
- bounded retained argv/process captures or an equivalent recomputable oracle for any privacy claim, rather than unrecomputable canary-negative booleans;
- a retained bounded final process audit, exact invocation/real-HOME binding, and exact feature/candidate identity in campaign receipts; and
- no promotion of this harmless probe into proof of the CAS state machine, auth possession, real descendant containment, or live compaction.

## Minority positions and disagreements

There is no minority FAIL and no unresolved architectural disagreement. The evidence auditor alone assigns lower confidence because several privacy/final-audit claims are construction-reviewed or external rather than recomputable from retained bytes. That is not a Plan-synthesis blocker; it becomes a mandatory stronger-evidence requirement for the executable candidate authority.

## Emerged synthesis and next gate

The replacement Plan may retain the direct gated-broker architecture without another host primitive. Its core safety invariant is causal capability elimination, not polling: no CLEAN while any broker/client can still release, resume, exec, connect, create a session, or bind the socket. Pre-release uncertainty quarantines without auth; post-release uncertainty fails and stops shipping.

One planner now produces R5 from exact R4 plus this synthesis. R5 receives a new digest and must be independently reviewed by product/acceptance and adversarial-skeptic roles. Only dual exact-R5 PASS opens red-first T3.5 implementation. No API-key Claude, G0 freeze, or live acceptance is authorized before the later gates.

[tracked by](../tasks/pre-compact-multi-session.md)
