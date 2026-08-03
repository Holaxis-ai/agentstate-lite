---
type: Research
title: Precompact T3.5 launch and reaper architecture
actor: codex-precompact-v3-launch-architect
timestamp: '2026-08-03T22:45:57.366Z'
---
# Precompact T3.5 launch/reaper architecture

**Status:** architecture recommendation; planning circuit breaker remains active. **Confidence:** 0.90 in the state-machine safety argument, conditional on the named no-auth exact-host probes. This document does not revise Plan R4, authorize implementation, or claim tmux/Claude live evidence.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: define a revocable, crash-recoverable launch principal whose ability to create an auth-bearing tmux socket is durably fenced before cleanup can certify absence; this serves the ultimate goal by preventing the acceptance rail from declaring private state clean while a late launcher can still cross the boundary.

Exact inputs read in full:

- `tasks/pre-compact-multi-session` and current orientation `context-notes/precompact-v3-orientation@sha256:d2ef0e3a85356b5ca63561866da5be8e1990f3a11678de20aa358b6f803d5c58`;
- Plan R4 `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`;
- acceptance FAIL `context-notes/precompact-v3-t35-plan-accept-r4@sha256:3b8c55e0acb7e1b798364e39c15be8bc7ea9e5f84d08af2b1a7be7f1effa06ae`;
- skeptic FAIL `context-notes/precompact-v3-t35-plan-skeptic-r4@sha256:046d9eac0ff798e8b3ce64ea97b99819329536583aa84e1e9ad76779eda738a3`; and
- installed-host note `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`.

Candidate, wrapper, auth policy, npm verifier, campaign ledger/history/lock, serialized L0, R0/Q0, and lifecycle acceptance architecture are frozen. Only launch/reap and the Darwin ps grammar are reopened.

## Recommendation

Use a **no-auth, pipe-gated Node broker in its own process group**, durably identify it while its gate is closed, then commit `SPAWN_RELEASED` under the campaign lock. Only after that transition is fsynced/read back may the runner send the API key over an inherited anonymous pipe. The broker rechecks the exact released ledger revision, closes control descriptors, and uses pinned Node 25.2.1 `process.execve` to replace itself with exact pinned `tmux -D -S <socket>`. PID, process start, process group, and session identity must remain stable across exec.

Pinned tmux 3.6b forbids a command with `-D`. Therefore the broker starts only the foreground server. After the same principal is observed as the pinned tmux binary and the exact socket accepts a client, a separate exact no-auth tmux client issues `new-session` with the pinned Claude argv. This is a distinct state transition, not part of the `-D` argv.

The broker, not the socket, is the launch capability. Cleanup first commits an irreversible revocation/reap fence under the campaign lock. It then kills the exact identified broker/server process group independently of socket state, kills the exact server through the socket when available, and verifies all recorded pane/Claude identities absent. Only afterward may it write cleanup proof. A missing socket is never by itself clean.

## Domain model

- **Launch reservation:** durable one-use identity, private socket path, broker-record path, control-channel facts, exact binaries/argv digests, and release-nonce digest. It grants no spawn release.
- **Broker:** acceptance-owned no-auth Node process. It is a new session/process-group leader and cannot exec tmux until it validates a durable release.
- **Gate:** anonymous control/secret pipes plus the durable ledger state. Pipe input alone cannot release the broker.
- **Possible binder:** any live broker or its same-PID foreground-tmux replacement. Cleanup proof requires that no possible binder remains.
- **Foreground server:** exact `tmux -D -S <socket>` after `execve`; same PID/start/PGID/SID as the broker.
- **Session client:** separate exact tmux client that creates the session only after server identity.
- **Revocation fence:** irreversible ledger state forbidding runner release, client/session actions, and retry.
- **Stable absence:** every recorded possible binder and pane/Claude identity is absent, the socket is absent before and after those identity checks, and no unreconciled pre-record broker remains.

## Durable state machine

| State | Durable facts | Permitted next states |
|---|---|---|
| `NO_LAUNCH` | no launch id, process, pipe, or socket | `BROKER_RESERVED` |
| `BROKER_RESERVED` | launch id; exact absent private socket; expected broker self-record; Node/harness/tmux/client/Claude digests; exact `-D -S` and later client argv digests; auth variable name only; release nonce digest; gate closed | `BROKER_IDENTIFIED_GATE_CLOSED`, `REVOKE_COMMITTED`, `QUARANTINED` |
| `BROKER_IDENTIFIED_GATE_CLOSED` | create-only broker self-record digest; PID, start, uid, PPID, PGID=PID, SID, Node/harness digest, pipe dev/inode facts; ps evidence; socket absent; no auth delivered | `SPAWN_RELEASED`, `REVOKE_COMMITTED` |
| `SPAWN_RELEASED` | all prior facts plus exact release revision/digest and nonce digest; irreversible permission for the identified broker to receive the secret and exec | `TMUX_FOREGROUND_IDENTIFIED`, `REVOKE_COMMITTED` |
| `TMUX_FOREGROUND_IDENTIFIED` | same PID/start/PGID/SID now mapped to exact tmux; exact `-D -S`; socket lstat and successful identity-bound client probe; no session yet | `SESSION_RUNNING`, `REVOKE_COMMITTED` |
| `SESSION_RUNNING` | exact no-auth client receipt; tmux session id; recorded pane/Claude PID/start/PGID facts as available | `REVOKE_COMMITTED` |
| `REVOKE_COMMITTED` | prior phase, terminal revision, reason, all reserved identities; no further release/client/PTY action legal | `REAPING`, `QUARANTINED` |
| `REAPING` | signal/client actions and observations append-only; no cleanup proof | `CLEAN`, `QUARANTINED` |
| `CLEAN` | exact process/socket stable-absence proof and no secret serialization; terminal | none |
| `QUARANTINED` | unresolved identity, timeout, malformed ps, or incomplete absence; non-advancing | reaping may be retried, never launch/release |

`BROKER_RESERVED` intentionally covers the OS-spawn-before-self-record interval. It is safe because the broker has no auth and the gate is closed. It is not clean: cleanup may revoke it, but cannot reach `CLEAN` until the broker either publishes its identity and is killed, or is otherwise proven absent. A stopped broker that has not published identity causes quarantine, not an absence receipt.

## Broker protocol

1. Under the crash-safe campaign lock, the runner writes and reads back `BROKER_RESERVED`. It creates anonymous control and ready pipes; neither contains auth.
2. Holding the same lock across the final state recheck and OS spawn, the runner starts exact pinned Node with the candidate harness broker subcommand, `detached:true`, a sanitized no-auth environment, exact launch id/path facts, and inherited pipe FDs. Cleanup cannot revoke between that recheck and spawn.
3. The broker verifies it is process-group/session leader, derives its own ps identity, and atomically publishes a create-only 0600 self-record (temp write, fsync, rename, directory fsync, read-back) before writing `READY` to the pipe. It then blocks with gate closed. Control EOF before release makes it exit.
4. The runner verifies self-record, ps facts, binary digest, pipe facts, socket absence, and campaign state; under lock it commits `BROKER_IDENTIFIED_GATE_CLOSED`. If the runner crashes before this, cleanup commits revocation. A missing self-record cannot become clean merely because the socket is absent.
5. To launch, the runner and cleaner race only through the campaign lock. The runner may commit `SPAWN_RELEASED` only from the exact identified state; cleanup may instead commit `REVOKE_COMMITTED`. Whichever CAS wins is final.
6. After released revision fsync/read-back, the runner sends a bounded framed release carrying the exact revision/digest/nonce and then the API key through the anonymous pipe. No secret or secret digest enters argv, environment before release, disk, ledger, socket name, or log.
7. The broker independently reads the current ledger and requires the exact `SPAWN_RELEASED` revision before accepting the frame. It constructs the closed tmux environment, closes/CLOEXECs control descriptors, and calls `process.execve(exactTmux, [exactTmux, "-D", "-S", socket], env)`. A return is failure. Cleanup after release assumes the process may hold auth even if exec was not observed.
8. The runner proves the same PID/start/PGID/SID now identifies pinned tmux and the socket accepts the exact client. Only then does it record `TMUX_FOREGROUND_IDENTIFIED`.
9. A separate exact client, with no auth variable, issues `tmux -S <socket> new-session ...` with the pinned Claude command. Its server-environment inheritance and process identities must be established by the no-auth probe before adoption.

## Transition authority and lock scope

| Transition/action | Authority and serialization |
|---|---|
| reserve | runner under campaign lock; history-before-current CAS |
| OS-spawn broker | runner holds the same lock from fresh reservation check through spawn return; broker remains no-auth/gated |
| publish self-record | broker alone, create-only outside current ledger; READY only after durability |
| identify broker | runner under lock after independent ps/self-record verification |
| release or revoke | mutually exclusive CAS under the same lock; no optimistic action before read-back |
| send secret/exec | runner and broker only after released read-back; broker rechecks current ledger |
| identify tmux/create session | runner under active-state checks; re-read terminal revision before every client/PTY action |
| begin cleanup | cleaner under lock commits `REVOKE_COMMITTED`; this is a fence, not cleanup proof |
| signal/kill/reap | cleaners may operate concurrently after the same fence; exact identities only, no campaign lock required while killing |
| publish CLEAN | one cleaner under lock after stable absence; second cleaner verifies same proof and converges no-op |

## Kill, revoke, and stable-absence procedure

1. Acquire/recover the campaign lock and commit `REVOKE_COMMITTED` from the current launch phase. A stale runner's later release/client/action CAS must fail. Release the lock.
2. If a broker self-record exists, verify its immutable digest and current ps PID/start/uid/PGID/SID. If the socket responds, invoke exact `kill-server`. Independently send TERM to the exact verified process group; after a bound, send KILL. Reverify identity before every signal. Never signal a PID/PGID whose start identity changed.
3. In `SESSION_RUNNING`, also verify and reap recorded pane/Claude identities. Socket-driven `kill-server` is evidence, not a substitute for process checks.
4. If `BROKER_RESERVED` lacks a self-record, wait boundedly for either the no-auth broker record or proof the broker never became live. Socket absence is insufficient. Timeout is `QUARANTINED`; no cleanup proof and no new campaign.
5. If the socket disappears while the broker/tmux PID is live, kill the exact process group. If PID/start is absent but the socket remains, use only the exact reserved socket client, then require socket absence. Any identity ambiguity quarantines.
6. Stable absence is: socket absent; broker/tmux PID/start absent; recorded process group and pane/Claude identities absent; socket absent again after those checks; no unreconciled broker self-record or reservation; leak scans clean. Then and only then CAS `CLEAN` and publish cleanup proof.

The process group is the fallback for the bind gap; the socket is not. PID reuse is safe only if every signal is preceded by exact start/PGID verification. Two cleaners converge because the revocation fence is idempotent, signals target the same verified identity, and one CLEAN CAS wins.

## Required red interleavings

| Interleaving | Required result |
|---|---|
| cleanup vs live runner before broker spawn | lock/CAS chooses spawn or revoke; never both |
| runner OS-spawns broker, crashes before self-record | no auth; broker exits on EOF or publishes identity; cleanup waits/kills or quarantines, never CLEAN on socket absence |
| broker self-record durable, runner crashes before ledger identification | cleanup verifies record, revokes, kills exact group |
| cleanup wins revoke while runner holds stale READY | runner release CAS fails; broker cannot validate release |
| release durable, runner crashes before secret | cleanup treats launch as committed and kills exact broker group |
| secret delivered, broker paused before exec | known PID/group may hold auth; cleanup kills it without socket |
| exec occurs, socket bind delayed | same PID/start/PGID identifies possible binder; cleanup kills group; no late bind |
| socket appears after first absent poll | no proof existed; process kill plus final double absence catches it |
| socket removed while exact tmux PID remains | kill exact group; absence alone cannot advance |
| tmux execs/binds, runner crashes before tmux record | broker identity persists across exec; cleanup verifies phase and kills |
| tmux ready, runner crashes before `new-session` | kill foreground server; no pane exists |
| session created, runner crashes before pane record | exact-host probe must provide deterministic discovery; otherwise quarantine, not CLEAN |
| cleaner starts during PTY/fault action | revocation CAS makes runner predicates stop; reap all recorded identities |
| two cleaners race TERM/KILL/CLEAN | idempotent same-target actions; exact identity recheck; one CLEAN CAS, one no-op |
| PID reused before signal | start mismatch means do not signal; original considered absent only after other identities/socket are resolved |
| broker record malformed/missing indefinitely | quarantine and stop shipping |
| `process.execve` returns/fails | broker exits failure; no session; cleanup reaps and campaign fails |

Fake scheduler tests must force every row. The exact-host probe supplies only primitive facts; it cannot replace the interleaving tests.

## Corrected Darwin ps contract

R4's required leading PID whitespace is false. The parser must accept **zero or more** leading ASCII spaces followed by the exact stored decimal PID, then at least one required field-separator space. It must retain one LF-terminated row, no stderr, exact English day/month/time/year fields, exact uid/command, and no extra rows. Pin `/bin/ps` digest and exact fields sufficient for PID, PPID, PGID, SID, lstart, uid, and comm. Fixtures must include 1-, 4-, and 5-digit PID widths; absent PID is exact exit 1 with zero stdout. Any schema/digest/platform mismatch is fail-closed.

## No-auth isolated host probe required before adoption

On exact Darwin arm64, Node 25.2.1, and tmux 3.6b, with a fresh `/private/tmp` root and a nonsecret environment canary only, prove and persist:

1. `process.execve` exists and preserves PID, lstart, PGID, and SID across Node broker to tmux;
2. Node `spawn(..., {detached:true})` makes the broker PID the new PGID/SID, and pipe EOF/gating behaves as specified;
3. `tmux -D -S <socket>` remains the foreground server, does not daemonize/reparent to an untracked principal, turns off exit-empty, binds only the named socket, and rejects an inline command;
4. a separate exact client can create a session, and the pane receives the foreground server's nonsecret environment canary without the client carrying it;
5. exact PID/PPID/PGID/SID and descendant topology before exec, after bind, after `new-session`, after `kill-server`, TERM, and KILL;
6. socket behavior when bind is delayed, the socket is unlinked while the server PID is live, and cleanup races server startup;
7. `kill-server` and exact process-group TERM/KILL leave no server, pane, or dummy command, and repeated cleanup is harmless;
8. actual `/bin/ps` grammar for 1-, 4-, and 5-digit PIDs and absent PID under pinned locale/timezone;
9. release/control FDs are closed across exec, the nonsecret canary never appears in argv/disk/logs, and no global user configuration changes.

Any failure or ambiguous process topology blocks this architecture. The probe must not use Claude, auth, real HOME/global config, or candidate lifecycle semantics.

## Alternatives considered

- **R4 socket-first cleanup:** rejected. It cannot extinguish an already OS-spawned late binder.
- **Direct auth-bearing tmux spawn plus later PID capture:** rejected. The exact reviewed race remains.
- **Hold the campaign lock until socket bind:** rejected. Runner death still leaves an unidentified auth process, and lock ownership is not process identity.
- **Revocation file without an enforcing broker:** rejected. A stale runner can spawn after revocation.
- **Pattern scan/kill by command or socket name:** rejected. It can target unrelated processes and is PID-reuse unsafe.
- **Permanent Node supervisor that spawns tmux as a child:** viable fallback only if `process.execve` is unavailable. It keeps a durable PGID but adds a second live principal and more descendant/reaping states; it is not the primary recommendation.
- **Shell `exec` broker:** rejected. It adds quoting/interpreter/env semantics and weakens the one executable authority.
- **Compiled native broker:** rejected unless the pinned Node `execve` probe fails; it adds compiler, architecture, packaging, and artifact identity surfaces.
- **launchd or another global service:** rejected. It expands privileged/global state and violates lane isolation.

## Remaining epistemic limits and blockers

- Pinned Node's `process.execve`, detached process-group behavior, and descriptor semantics are host-specific and unproven here.
- Pinned tmux `-D` foreground identity, separate-client session creation, environment inheritance, pane process groups, and termination behavior require the no-auth probe.
- A broker stopped before publishing its identity is fail-safe but may prevent liveness indefinitely; the correct disposition is quarantine, not guessed cleanup.
- Exact descendant discovery after `new-session` must be proven; if tmux can leave an unrecorded pane/Claude process, CLEAN is unavailable.
- Same-uid malicious process/file substitution remains outside R4's non-malicious same-user drift model; all specified owner/path/digest checks still apply.
- Valid isolated auth and a real model response remain separately `BLOCKED_AUTH`; this architecture does not change that frozen gate.

## Synthesis handoff

The recommended architecture is eligible for Plan synthesis only after the no-auth primitive probe passes and independent acceptance/skeptic roles agree that `BROKER_RESERVED -> BROKER_IDENTIFIED_GATE_CLOSED -> SPAWN_RELEASED -> TMUX_FOREGROUND_IDENTIFIED` plus terminal revocation closes every late-bind trace. Until then, F0, G0, auth, and live candidate work remain blocked.
