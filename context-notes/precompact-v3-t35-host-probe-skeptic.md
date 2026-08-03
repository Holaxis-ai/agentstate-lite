---
type: Context Note
title: Revision 3 T3.5 v5 host-probe adversarial skeptic verdict — PASS
tags:
  - review
  - precompact-v3
  - skeptic
  - host-probe
actor: codex-precompact-v3-host-skeptic
timestamp: '2026-08-03T23:26:55.000Z'
---
# Summary

Status: complete

Verdict: **PASS** for replacement T3.5 Plan-synthesis eligibility. This does not authorize F0, implementation, G0, auth, Claude, or candidate acceptance. The replacement Plan still requires independent exact-version PASS before code.

Confidence: **0.96**.

The selected v5 evidence supplies every host primitive that must be known before the replacement Plan can be written. The remaining gaps are state-machine and oracle obligations that can be made executable with fake scheduler/unit tests and later exact-candidate/Claude gates. I found no further host primitive or product decision that must precede synthesis.

I explicitly accept sampled PID/PGID signaling as a bounded risk for this exact pinned pilot under the already stated non-malicious-same-uid model. This is not pidfd-like atomic identity and the Plan must not describe it as such.

## Exact inputs

Read in full:

- task `tasks/pre-compact-multi-session@sha256:13a028e5d5d38a9ab18383551cccfcf813cba27bc41976bf0113191cad744991`;
- orientation `context-notes/precompact-v3-orientation@sha256:af10abacc8f43aa7d237d4dffafd21b1dd1b6a0b717e4191ffdff1f3212a4928`;
- host Research `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`;
- prior architect Research `research/precompact-v3-t35-launch-reaper-architect@sha256:60018b553f55944a78f1631718e0f5c225eef4c72d85a423b76234acc4a19c43`;
- prior acceptance Research `research/precompact-v3-t35-launch-reaper-acceptance@sha256:4e05e1e5f39a1fe75d6caf5ad494092587ac490a73c61f4953f02e8d68a012ce`;
- prior skeptic Research `research/precompact-v3-t35-launch-reaper-skeptic@sha256:ceba46d2a33f1d1bc4782077a546e043af8d7163ed70d807233c88e8cab07143`;
- selected script `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ/launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`;
- selected evidence `evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`; and
- selected summary `summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.

The script/evidence/summary hashes were independently recomputed and matched. Protected before/after files were byte-identical. I did not inspect any new acceptance or evidence-auditor conclusion before deciding. No Plan, code, task, orientation, evidence, candidate, Claude, auth, global configuration, tmux process, or further ps process was modified or invoked.

## Attacks and findings

Labels: **Empirical** means directly established from the exact selected script/raw bytes; **Reasoned** means an interleaving conclusion from those primitives and the proposed state machine.

### 1. Fallback cleanup hiding primitive failure

**Empirical — survived.** The script contains fallback TERM/KILL cleanup, so the summary alone would not prove causality. I asserted the raw pre-fallback fields instead. For all `kill-server`, socket-unlink+TERM, and socket-unlink+KILL cases:

- `broker_survived_initial_cleanup:false`;
- `server_survived_initial_cleanup:false`; and
- `pane_survived_initial_cleanup:false`.

Those flags are captured before the fallback branches. All final PID/group absence rows were exact exit 1 with zero stdout/stderr. Therefore fallback cleanup did not manufacture the selected run's primitive result. The replacement Plan must bind/review the raw fields, not only the summary booleans.

### 2. Direct session-client timing and late replacement

**Empirical — primitive survived; scheduler remains mandatory.** Exact `tmux -N -S <absent socket> new-session ...` exited 1, left the socket absent, and had no owned process in the final audit. This establishes the needed no-autostart host primitive. The selected probe intentionally spawned the working client directly and awaited it; it did not prove the durable client state machine.

**Reasoned — Plan-closeable.** The replacement authority must give the session client its own no-auth gate broker, durable PID/start/uid/PGID/comm identity, one-shot `SESSION_CLIENT_RELEASED` CAS, and the same terminal fence. Cleanup kills/proves every released client principal gone before terminating the server. Because `-N` cannot create a replacement, a client that loses the race or resumes after server removal cannot become a late binder. This reuses the already proven broker/exec/group primitives; it needs scheduler and exact-candidate tests, not a new host primitive.

### 3. Broker OS-spawn before durable record

**Empirical — bounded primitive.** The broker starts no-auth, writes its identity before READY, binds no socket before release, and exits with no socket on control EOF. The probe did not make OS spawn and record atomic and did not claim to.

**Reasoned — Plan-closeable only by quarantine.** If the runner dies and the broker is stopped before record/EOF handling, exact absence is unknowable. `BROKER_RESERVED` with missing readiness may never reach CLEAN or enable another campaign. It must remain no-auth, gate-closed, terminally fenced, and non-advancing quarantine pending exact discovery/manual process audit. Timeout plus absent record/socket is never absence. This is a deliberate stopped-shipping outcome, not an unverified primitive.

### 4. Pipe writer inheritance, EOF, and late delivery

**Empirical — survived for the selected construction.** Closing the writer before a complete frame made the broker exit 1, leave no socket, and become absent. After broker-to-tmux exec, every late write returned `EPIPE`, proving the broker read endpoint was closed across exec. The broker accepted one LF-terminated bounded frame, closed FD 3, and used no auth variable before release.

**Reasoned — mandatory boundary.** The implementation must create exactly one writer owner, make every unrelated child/exec unable to inherit it, spawn no other process between broker creation and durable identity except the exact ps/record path, and test runner SIGKILL, inherited-FD attacks, partial/duplicate frames, and post-fence writes. A retained writer means quarantine, never CLEAN. Node pipe EOF/close semantics shown here are sufficient; no new transport primitive is needed.

### 5. `execve` argv0, PID/comm, and host scope

**Empirical — survived.** The selected script uses `[tmuxRealpath, "-D", "-f", "/dev/null", "-S", socket]`, with the executable explicitly present as POSIX `argv[0]`. Raw rows show the same PID, PPID, PGID, and `lstart` before and after exec, while `comm` changes exactly from pinned Node to pinned tmux. The server PID query equals the broker PID in all cases. Inline command use with `-D` exits 1 and creates no accepted server.

The Plan must pin exact Node v25.2.1/Darwin arm64/tmux 3.6b bytes and must not generalize `process.execve` to Node >=20 or omit explicit argv0.

### 6. `sess=0`

**Empirical — corrected, not survived as identity.** `sess` was `0` for PID 1, orchestrator, broker/server, and pane. It contributes no identity on this tuple and must be removed from schemas, parser requirements, and claims. PID/PPID/PGID/start/uid/state-specific comm plus pinned executable digest remain.

### 7. Process-group selection

**Empirical — survived.** Server PGID equals server PID; pane PGID equals pane PID and differs from the server group. Exact `/bin/ps -g <pgid>` returned the one expected group row while live and exact exit-1/zero-output absence for both groups after termination. The Plan must never claim the pane belongs to the server group and must use separately recorded/enumerated server and pane groups.

### 8. Pane spawn before durable record

**Empirical — partial.** The harmless pane was queried and self-recorded before termination in the selected run. This does not directly exercise a runner crash after `new-session` reaches the server but before pane record publication.

**Reasoned — Plan-closeable with a hard non-CLEAN rule and later gate.** `SESSION_CLIENT_RELEASED` must conservatively mean the server may already have spawned a pane. Recovery must query every existing pane through the still-verified server/socket before termination, bind exact PID/start/PPID/PGID/comm facts when available, and treat missing or inconsistent descendant identity after release as FAIL plus non-advancing quarantine, never CLEAN. The later exact candidate/Claude gate must kill at this boundary and audit the real Claude/hook/sub-agent tree. The dummy evidence establishes the server-termination primitive; real descendant behavior remains an explicit later acceptance oracle rather than an assumption.

### 9. Server SIGKILL and pane disappearance

**Empirical — survived for the harmless pane.** In the socket-unlink+SIGKILL case the raw pre-fallback pane-survival flag is false; the pane PID and its separate PGID were absent before any fallback pane signal. TERM and `kill-server` show the same result. This is adequate host-mechanism evidence for Plan synthesis. It does not prove real Claude will behave identically; the replacement Plan must retain an exact real-tree red gate and forbid PASS if any descendant survives or becomes unidentifiable.

### 10. Stale socket

**Empirical — survived with a changed terminal rule.** `kill-server` returned 0 and left an owned 0600 socket after server/pane/group absence. The harness validated type/uid/mode, then unlinked it. The Plan must bind socket device/inode/path/type/uid/mode, prove every creator and owned group absent first, revalidate immediately before unlink, fsync the parent, and then prove absence. Socket unlink or disappearance is never process proof.

### 11. `-N` replacement behavior

**Empirical — survived.** Each post-cleanup exact `-N` `new-session` attempt exited 1 with no such socket; the socket stayed absent and the later full process audit found no owned process. Since the client process had exited before the observation, there was no remaining actor that could bind later. The Plan must use `-N` on every query/control/session client and reject any client surface not proved no-autostart.

### 12. Two cleaners

**Empirical — limited.** Repeated cleanup was harmless, but the probe was sequential, not two concurrent raw signalers.

**Reasoned — Plan-closeable.** Only one recoverable destructive-reaper lease may issue PID/PGID TERM/KILL. A second cleaner can request/recover cleanup and verify the terminal proof, but may not race duplicate raw signals. Cleaner death leaves `REAPING`; the successor revalidates immutable identities and starts observations again. One history/current CAS publishes CLEAN. This is ledger/scheduler logic already supported by the R4 crash-atomic lock machinery, not a missing host primitive.

### 13. PID/PGID reuse between ps and signal

**Reasoned — accepted bounded pilot risk.** `/bin/ps` plus `kill` is sampled check-then-act; one-second `lstart` and a private PGID do not make it pidfd-like. Even two immediate checks cannot mathematically prevent an unrelated PID/PGID from being reused between the final check and signal.

For this exact pilot I accept the residual risk because the threat model excludes malicious same-uid churn; paths/groups are unique and private; one destructive reaper acts; it requires exact PID/start/uid/PGID/state-specific comm and binary tuple immediately before every signal; socket/control termination is preferred when available; any observable mismatch quarantines; and retry remains forbidden until stable absence. Accidental reuse of the exact group id inside that narrow interval is possible but remote. The Plan must state that honestly as bounded operational risk and may not claim “PID reuse cannot target another process.” A malicious-same-uid or generalized product threat model would reopen the architecture and require an identity-bearing supervisor/kernel primitive.

### 14. Live or stopped actor resuming after CLEAN

**Reasoned — Plan-closeable.** CLEAN is illegal until: irreversible `REAPING` fences all future broker/client release and respawn; every release-capable broker/client PID and group is absent; the broker control reader is closed; all session/pane/Claude identities and groups required by the active phase are absent; stale socket removal is complete; and final no-autostart/process/socket observations pass. A stopped pre-record actor forces quarantine. A stopped released actor is recorded and killed before server teardown. A stale runner's CAS and every later process action fail. Scheduler tests must pause each actor immediately before record, release, pipe delivery, exec, connect, session creation, and cleanup proof, then resume it after the proposed CLEAN and prove it cannot act.

### 15. Proof that no late binder remains

**Empirical — primitive survived.** After terminal cleanup, server/pane PIDs and groups were absent, the socket was absent, exact `-N` could not autostart, repeated cleanup was harmless, and the final root/socket/script/tmux process audit found no owned process. The worktree and selected protected snapshots were unchanged.

**Reasoned — causal Plan rule.** Polling or two passes are not the proof. The proof is the terminal release fence plus absence of every durable release principal; `-N` then removes the remaining replacement-server capability. Only after that causal state may final socket/process observations and CLEAN publication occur.

## Mandatory replacement-Plan constraints

1. Preserve all survived R4 candidate, freeze, npm, ledger/history/lock, wrapper, auth, privacy, serialized-L0, R0/Q0, and lifecycle acceptance contracts unchanged except where the reopened launch/ps schema explicitly supersedes them.
2. Add distinct monotone states for broker reservation/identity/release, foreground server identity, session-client reservation/identity/release, session/descendant evidence, one destructive `REAPING` owner, `CLEAN`, and non-advancing quarantine.
3. Spawn broker and client as no-auth gate-only Node principals; durably identify each before release. Persist/read back the one-shot release before delivering any release frame. A release state conservatively means delivery/exec may already have happened.
4. Use exact `process.execve` with explicit executable argv0 and exact `tmux -D -f /dev/null -S <socket>`. `-D` carries no command. Use exact `-N` for every separate client.
5. Remove `sess` from durable identity. Freeze strict single-PID and `-g` parsers from exact bytes, including zero-leading-space full-width PIDs, exact absence, state-specific Node/tmux comm, PPID/PGID/start/uid, no stderr/extra rows, and ps digest checks.
6. Fence and terminate all released clients before the server; then terminate server/pane/Claude identities and groups; only afterward validate/unlink an exact stale socket. No socket observation advances state while a possible creator remains.
7. Make missing pre-record broker/client identity terminal no-auth quarantine, never CLEAN. After any release, unknown server/client/pane/Claude identity or inability to prove absence is FAIL plus quarantine and forbids retry.
8. Use one recoverable destructive-reaper lease. No concurrent raw signals. Cleaner recovery repeats observations and never trusts “signal sent.”
9. Make every fallback action and its pre-fallback observation explicit in raw evidence. Summary booleans may not erase whether the named primitive itself succeeded.
10. Add exhaustive fake scheduler red traces for both brokers, frame/EOF/FD inheritance, release-vs-reap, exec/bind, direct client/connect/session creation, two cleaners, PID/comm/PGID drift, stale socket, stopped actors resuming after proposed CLEAN, and crash at every ledger/history/sidecar step.
11. Add exact-candidate no-auth process tests for the gated `-N` client and pane-record crash window; later API-key Claude gates must record/audit the real pane, hooks and sub-agents and reject any survivor/unknown descendant. Fake dummy death cannot satisfy the real-tree gate.
12. State sampled-PID risk as the bounded decision above. Do not claim atomic identity-safe signaling or portability beyond the exact pinned tuple.

## Survived attacks

- Exact script/evidence/summary identity and protected snapshot continuity.
- Correct explicit executable argv0 and same-PID/start/PGID Node-to-tmux exec with exact comm transition.
- Commandless zero-session foreground tmux.
- No-auth broker gate, pre-release socket absence, EOF refusal, FD3 closure, and late-write `EPIPE`.
- Pipe-only canary transfer into server environment and harmless pane without client argv/environment possession or persistent raw canary bytes.
- Exact `-N` no-autostart after server/socket loss.
- Exact server/pane distinct-group discovery and group absence.
- `kill-server`, socket-unlink+TERM, and socket-unlink+KILL pane death before fallback.
- Owned stale-socket detection and process-first explicit cleanup.
- Final no-owned-process/no-late-binder audit and sequential cleanup idempotence.
- Actual Darwin zero-session and PID-padding corrections, including removal of unusable `sess`.

## Residual risks, not synthesis blockers

- Real Claude, hooks, and sub-agent descendants may not die like the harmless pane. This remains a hard later immutable-candidate gate; failure stops shipping and reopens launch/reap.
- A stopped broker/client before self-record can prevent liveness indefinitely. It is no-auth and cannot become CLEAN; quarantine is the accepted disposition.
- Sampled PID/PGID signaling retains the explicitly accepted accidental-reuse risk for this pilot.
- Valid isolated auth and a first model response remain independently `BLOCKED_AUTH`; this verdict does not infer either.

## Proximate-goal linkage

The proximate goal was to decide whether v5 supplies a causally fenceable launch/reap substrate without allowing another transient observation to become cleanup proof. It does: the exact host now supplies same-principal foreground exec, separate no-autostart clients, process/group observations, and process-first socket cleanup. The replacement Plan must turn those facts into executable state and later real-tree gates. This serves the ultimate goal by allowing compaction-memory acceptance to proceed without leaving an unowned auth-capable late binder or hiding an unsupported host assumption.
