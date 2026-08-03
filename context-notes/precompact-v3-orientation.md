---
type: Context Note
title: 'Revision 3 orientation and domain model: compaction handoffs'
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T23:18:09.628Z'
---
# Summary

Revision 3 reorientation/current phase after the exact-host T3.5 launch/reap primitive campaign on 2026-08-03.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently adjudicate the exact-host-proven T3.5 launch/reap mechanism, then synthesize and exact-review one replacement candidate/live-acceptance Plan before implementation; this serves the ultimate goal by keeping unsupported lifecycle assumptions and unowned late processes out of the compaction-memory rail.

Loaded skills: holaxis-self-awareness, holaxis-cognitive-ecosystem, agentstate-lite, and holaxis-orchestrator. Active orchestration is a Dynamic-DAG circuit breaker with differentiated acceptance and adversarial-skeptic review, followed by Generator-Critic Plan review. No T3.5 code starts before exact Plan PASS.

## Current whole-system model

The production pilot has five interacting components: Claude Code emits lifecycle events; one managed `aslite hook run` adapter parses and maps event-valid JSON; a private `CompactionHandoffAuthority` owns exact execution identity, extraction, validation, state transitions, and receipts; a host-local 0700 journal stores content outside the project bundle; and isolated automated/live harnesses prove one immutable packed candidate. The installed-host order is `PreCompact -> SessionStart(source=compact) -> PostCompact -> first model response -> Stop`. SessionStart is the only load-bearing restore point, PreCompact prepares the handoff, and PostCompact is audit-only.

T0-T4 are accepted at clean feature HEAD `36c741a8173832d75d61a7ab138b5219c4415c66` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`. The implementation provides canonical project identity plus full `(runtime, session_id, agent_id|null)` identity, generation-addressed journal records selected by a CAS head, strict schemas, bounded evidence cards, logical expiry with event-driven GC, structural managed-hook ownership, authority-owned journal readiness, and source-owned documentation.

The unimplemented T3.5 layer must build one packed candidate exactly once, bind exact artifact/toolchain/harness identities through isolated acceptance lanes, and carry one immutable candidate through Review, QA, negative rail, manual main, automatic main, and real sub-agent acceptance without global auth/config fallback. One executable candidate authority must own freeze, validation, campaign ledger, challenge-bound attestations, and postflight continuity.

Plans R1-R4 failed independent review. The candidate, deterministic sequential PreCompact fault wrapper, CAS campaign ledger, R0/Q0 assertions, serial L0, auth-tree possession, npm validator, and fresh-generation checks survived. The reopened subsystem was launch/reap: R4 could publish cleanup while an already-spawned launcher later bound the tmux socket, and its Darwin ps grammar rejected valid full-width PID rows.

## Exact host evidence now available

Research disposition: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.

Selected retained root: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`.

- Script `sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`.
- Evidence `sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`.
- Summary `sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Protected before/after snapshots byte-identical at `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`.

The final no-auth v5 campaign proved on Darwin arm64 / Node v25.2.1 / tmux 3.6b:

- `process.execve` needs an explicit executable `argv[0]`; with it, Node broker PID, PPID, PGID, and `lstart` survive direct replacement by commandless foreground tmux.
- Exact `tmux -D -f /dev/null -S <socket>` starts an empty foreground server without a terminal, and rejects an inline command.
- A separate exact `tmux -N` client creates the harmless pane on the existing server and cannot create a replacement after cleanup.
- Random secret-shaped canaries travel only through the release pipe and server environment; they are absent from broker/pane argv, process-list captures, and disk, while the pane records the correct digest.
- FD3 closes before exec (`EPIPE` on every late write); EOF before a complete frame exits without socket creation.
- Server and pane own distinct PGIDs. Exact `ps -g` enumerates each live group and returns exact absence after cleanup.
- `kill-server`, socket-unlink + server TERM, and socket-unlink + server KILL all removed the harmless pane and both owned groups. No fallback pane signal was needed.
- `kill-server` can leave an exact owned 0600 stale socket node; it was explicitly unlinked only after creator/PID/group absence. Socket absence is not process proof.
- Post-campaign exact process audit found no owned process or late binder; feature worktree stayed clean; no Claude/API key/global-auth path ran.

Earlier terminal/config/PTy conclusions were corrected, not buried. Their root cause was an omitted POSIX executable `argv[0]`, so `-D` had been consumed as the program name rather than parsed as an option. Failed and superseded roots remain retained and are catalogued in the Research record.

## Remaining limits and non-negotiable Plan corrections

- The OS-spawn-before-self-record interval is not atomic. A broker there is no-auth and gate-closed, but missing readiness must quarantine; timeout plus absent socket/record is never CLEAN.
- The separate `-N` client must itself be durably identified and CAS-released/fenced before it can act. The primitive proved no-autostart, not the full crash scheduler.
- The pane has a separate PGID. The harmless dummy died under all tested server terminations, but real Claude hooks/sub-agents require later exact identity/tree evidence and fail-closed cleanup.
- Darwin `sess` reported `0` for every sampled process, including PID 1. It is not an usable identity field here and must not be required or claimed.
- PID/PGID + one-second `lstart` + `kill` is sampled check-then-act, not a pidfd-like atomic handle. Independent review must explicitly accept bounded accidental-reuse risk under the non-malicious-same-uid model or require an identity-bearing supervisor/control primitive.
- The accepted terminal sequence is: fence every future broker/client release; terminate/reap exact creators; verify PID and both server/pane groups absent; validate and remove any exact owned stale socket; recheck no-autostart and stable absence; then publish CLEAN. Any ambiguity quarantines/fails according to whether secret release was possible.
- No API-key Claude, G0 freeze, replacement Plan, or T3.5 implementation is authorized by the primitive result alone.

## Next gate

Independent acceptance and skeptic roles inspect the exact v5 script/evidence plus this model. They must issue PASS or FAIL on replacement-Plan eligibility and the honest PID-signal guarantee. Only dual PASS permits one planner to synthesize the replacement T3.5 Plan from the survived R4 architecture and host corrections; that exact Plan then needs another dual review before test-first implementation.

[tracked by](../tasks/pre-compact-multi-session.md)
