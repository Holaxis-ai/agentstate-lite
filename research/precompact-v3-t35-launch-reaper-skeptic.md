---
type: Research
title: Revision 3 launch/reaper adversarial interleaving and kill-safety model
description: >-
  State-machine attack of the gated broker, foreground tmux server, separate
  session client, descendants, cleanup, and Darwin process identity.
tags:
  - precompact-v3
  - launch-reaper
  - skeptic
actor: codex-precompact-v3-launch-skeptic
timestamp: '2026-08-03T22:49:52.000Z'
---
# Status and scope

Status: complete

Assessment: the proposed no-auth gate broker is a sound direction, but the replacement launch/reap shape is not yet a closed safety architecture. It closes the original `RESERVED_NO_SERVER_RECORD` late-bind race only for the first broker-to-server transition. The mandatory separate `tmux -D` session-creation client is a second launch principal, and tmux pane/Claude descendants are not proven to remain in the broker/server process group. Exact kill safety also lacks an identity-preserving Darwin signaling primitive.

Confidence: high (0.97) about the state-machine findings; medium about the ultimate feasibility until the pinned host primitives below are probed.

This is an adversarial model, not a Plan revision. It is based on:

- current orientation `context-notes/precompact-v3-orientation@sha256:d2ef0e3a85356b5ca63561866da5be8e1990f3a11678de20aa358b6f803d5c58`;
- current task `tasks/pre-compact-multi-session@sha256:3adf22dbb1fd9c719b5ae988521890ea4f898903066acfd690a074ea67e4e570`;
- exact R4 `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`;
- product R4 review `context-notes/precompact-v3-t35-plan-accept-r4@sha256:3b8c55e0acb7e1b798364e39c15be8bc7ea9e5f84d08af2b1a7be7f1effa06ae`; and
- skeptic R4 review `context-notes/precompact-v3-t35-plan-skeptic-r4@sha256:046d9eac0ff798e8b3ce64ea97b99819329536583aa84e1e9ad76779eda738a3`.

No code or Plan was edited, and no Claude, auth, tmux, global-state, or further ps call was made.

# Actors and capabilities

- **R**: acceptance runner. It owns the campaign mutation path, the write end of a gate pipe, and initially the secret. Merely being alive gives it a future-delivery capability unless the protocol fences that capability.
- **B**: initially no-auth broker, blocked on one exact framed gate message. Before release it must be unable to exec tmux or learn the secret. After release it is auth-bearing.
- **T**: foreground tmux 3.6b server created by B using pinned Node 25.2.1 `process.execve` into exact `tmux -D -S <socket>`. B and T are intended to retain the same PID, start identity, and private process group.
- **C**: a separate exact tmux client required to create the Claude session. The pinned fact is that `tmux -D` forbids a command and disables exit-empty; therefore B/T cannot create the session as part of the foreground-server exec. C can command the auth-bearing T to spawn Claude and, if T is absent, a `new-session` client may itself create a replacement server.
- **P**: tmux pane command, Claude, and Claude descendants, including hooks/sub-agents. Their process-group/session membership is not established by the candidate shape.
- **K1/K2**: possibly concurrent cleanup callers.

The relevant capability is broader than “socket exists”: it is the ability of any live process or retained pipe endpoint to cause a future tmux server, session, Claude process, or auth-bearing descendant to exist.

# Necessary safety invariants

1. **Monotone capability accounting.** Durable state must conservatively over-approximate what may already have happened. Once `SPAWN_RELEASED` is durable, recovery must assume the pipe may have been delivered and B may have execed, even when the socket is absent.
2. **No secret before durable identity.** An unrecorded B must receive neither secret nor release token and must be incapable of launching T. The same applies to every later launch principal, including C and any pane/Claude gate wrapper.
3. **Terminal spawn fence.** Before cleanup can certify anything, one durable transition must prevent R and every other live actor from authorizing a new broker/client/session. Every release action must lose a CAS race against that fence or become covered by an already-recorded process identity that cleanup kills.
4. **One release, one recorded principal.** Every executable release is challenge-bound, one-shot, length-delimited, and addressed to a previously durable PID/start/uid/executable/PGID identity. EOF, partial frames, duplicate frames, wrong nonce, overflow, or extra bytes are terminal refusal, never release.
5. **Identity-preserving server exec.** After release, B may become T only if exec preserves the recorded PID/start/PGID and changes the expected executable/`comm` through a closed state-specific transition. Seeing Node or tmux in `SPAWN_RELEASED` must be expected; seeing anything else quarantines.
6. **The separate client is a launch principal.** No unrecorded or unfenced C may execute `new-session`. C must be included in capability accounting because it can create a session on T and may create a new server when T is gone.
7. **Kill creators before creations.** Cleanup first fences all future releases, then kills/proves gone R-side delivery capability and every B/C/pane launcher that can still create a server/session/child, then kills T/P, then validates the socket. Killing T before a released C is gone is unsafe.
8. **Socket absence is last, not first.** An absent socket is meaningful only after every possible binder is durably fenced and proven gone. “Stable” means structurally no creator remains, not two polls or an elapsed interval.
9. **Descendant closure.** PASS requires an exact containment or identity rule for P. The T process group is insufficient unless pinned-host evidence proves every tmux pane, Claude process, hook, and sub-agent remains killable through it under normal exit, TERM, KILL, and socket-unlinked cases.
10. **No check-then-signal identity gap.** A signal must target the same process identity that was verified, not merely the same numeric PID/PGID observed moments earlier. A post-signal ps check detects failure but cannot undo signaling a reused foreign PID.
11. **One destructive reaper.** K1 and K2 may both request cleanup, but only one identity-bound reaper lease may issue PID/PGID signals. Socket `kill-server` may be idempotently retried, but duplicate raw signals after the first process exits create PID-reuse risk.
12. **Crash restarts evidence, never assumes it.** A cleanup crash before terminal proof leaves `REAPING` or quarantine. A successor repeats identity and absence proofs; it never trusts “signal sent,” “socket previously absent,” or another cleaner's in-memory result.
13. **Terminal proof is closed.** `CLEAN` requires: no delivery/release endpoint capable of future action; every recorded B/T/C/P identity absent; no unrecorded auth-capable spawn window; socket absent under unchanged private-root ownership/type/path; and an atomic terminal ledger transition. If any premise is unprovable, the only honest state is non-advancing quarantine.
14. **Pinned-host scope.** `process.execve` is a Node 25.2.1 host capability, not a generic Node >=20 contract. The manifest and readiness gate must pin the exact Node executable/digest/version/platform for this path.

# State × event matrix

The OS substates are explicit because collapsing them into one ledger label is how R4 lost the late-spawn race.

| State | Durable facts | Possible live capability | Permitted forward event | Cleanup obligation; terminal proof forbidden when… |
|---|---|---|---|---|
| `S0 EMPTY` | no reservation | R only | reserve exact socket and one broker intent | no live attempt exists; ordinary absence is safe |
| `S1 RESERVED_NO_BROKER` | socket/id/path and absent premise | R may still spawn B | spawn one no-auth B while holding the mutation lock | cleanup must win a terminal CAS before spawn or treat a concurrent spawn as possible; absence alone is not enough |
| `S1u BROKER_OS_SPAWNED_UNRECORDED` | ledger still S1; B exists only in OS | B has no auth and waits on pipe | durable B identity, or EOF/refusal exit | cannot claim zero process. Parent crash makes EOF a safety fence only if no writer FD escaped; a stopped B is otherwise unkillable by exact identity |
| `S2 BROKER_IDENTIFIED_GATED` | B PID/start/uid/Node digest/PGID and gate nonce durable | R owns only release capability; B cannot launch | CAS `SPAWN_RELEASED` | cleanup CASes `REAPING` before release or kills exact B/group. Socket absence is irrelevant |
| `S3 SPAWN_RELEASED` | release durable; delivery status intentionally unknown | B may be Node waiting, may hold secret, may be execing T; R may still hold pipe writer | one exact pipe delivery; B validates and execves | cleanup assumes the strongest case, revokes/fences R, kills B/T identity/group, and handles a possible socket. It may not downgrade because pipe was believed unwritten |
| `S4 TMUX_EXEC_SOCKET_ABSENT` | still S3 unless observed; same PID/start intended | auth-bearing T can bind later | T binds exact socket | this is the original R4 gap. Cleanup must kill/prove exact B/T identity gone before absence can count |
| `S5 SOCKET_BOUND_SERVER_UNIDENTIFIED` | S3 plus observed private socket; no server record yet | T is auth-bearing; no session yet | query exact server and record same PID/start/PGID/socket identity | kill through verified socket and recorded B identity. If socket vanishes, PID/group proof remains mandatory |
| `S6 SERVER_IDENTIFIED_NO_SESSION` | exact T and socket durable | auth-bearing T lives indefinitely because `-D` disables exit-empty | create and durably identify separate gated C | cleanup can kill T, but cannot certify until all possible C launch capability is fenced; no session does not mean no secret process |
| `S6u CLIENT_OS_SPAWNED_UNRECORDED` | ledger still S6 | no-auth C broker may exist; R may later release it | durable C identity or EOF/refusal exit | same unrecorded-process limitation as S1u. A direct unrecorded tmux client is unacceptable because it can launch work before identity exists |
| `S7 CLIENT_IDENTIFIED_GATED` | C PID/start/uid/Node digest/PGID and exact command intent durable | C cannot yet contact T | CAS `SESSION_RELEASED` | cleanup CAS-fences release or kills exact C before T. T-first cleanup is forbidden |
| `S8 SESSION_RELEASED` | C release durable; delivery/exec/result unknown | C may contact T, create session, or start replacement T if original is absent | exact pipe delivery; C execves exact tmux client | cleanup assumes all cases, kills/proves C gone first, then reaps every resulting T/socket/P identity |
| `S9 SESSION_CREATE_IN_FLIGHT` | S8, perhaps client exit; no complete P record | T may fork pane/Claude; auth may enter P | durably record session and all required child/containment identities | cannot certify from C exit or T/socket absence. This is a second spawn-before-record gap at the pane boundary |
| `S10 LIVE_IDENTIFIED` | T, C disposition, session and required P containment/identities durable | Claude/hook/sub-agent tree may spawn descendants | normal protocol or cleanup | cleanup must revoke future actions, terminate through proven containment, and verify every exact identity plus socket absent |
| `SX REAPING` | one exclusive reaper owner; all future releases terminally fenced | only already-released B/T/C/P can act | revoke/TERM/KILL/kill-server in closed order; revalidate | no new broker/client/session release is legal. Cleaner crash leaves SX recoverable, never CLEAN |
| `ST CLEAN` | terminal proof and history/current durable | none | no transition back; retry uses new attempt/campaign | invalid if any gate writer, released principal, process identity, descendant containment, or socket premise is unresolved |
| `SQ QUARANTINED` | inconsistency or unprovable identity | process may remain; no advancement | reaper-only/manual host intervention | must not be represented as clean or permit retry that could overlap auth-bearing state |

## Event obligations

| Event | Must be durable before event | Crash interpretation |
|---|---|---|
| OS-spawn B | reservation and private paths | B is no-auth/gated. Until identity is durable, crash recovery cannot prove zero process; pipe EOF must make launch impossible |
| record B | exact PID/start/uid/Node digest/PGID plus broker readiness nonce | only after read-back may release be considered |
| persist `SPAWN_RELEASED` | B identity and active campaign CAS | crash means “secret/release may have been delivered,” never “probably not” |
| deliver pipe frame | durable `SPAWN_RELEASED`; no terminal fence | partial/EOF rejects; full valid frame may cause exec even if R dies immediately |
| B `execve` T | full frame; exact Node 25.2.1 host | must preserve PID/start/PGID; exec failure leaves auth-bearing B in S3 and requires reap |
| T bind | same B/T identity | absence before bind never proves termination |
| record T | verified socket and same PID/start/PGID | record failure leaves S3/S5 safely reapable through B identity/socket |
| OS-spawn C broker | T identified and exact session intent | direct tmux-client spawn without a gate reintroduces OS-spawn-before-record |
| persist/deliver session release | durable C identity and active campaign CAS | after persistence, assume C may already have sent `new-session` or started a replacement server |
| create session/P | released C and live T | until containment/child identity is durable, T cleanup semantics are the only possible closure and must be host-proven |
| enter `REAPING` | exclusive reaper identity and terminal release fence | successor may recover lease; all run paths reject future releases/spawns |
| signal/kill-server | exact live identity or verified private socket | crash after signal carries no proof; successor rechecks from first principles |
| publish CLEAN | all creators, processes, descendants, and socket structurally absent | no later legal event can recreate them |

# Concrete adversarial counterexamples

1. **Parent crash before B record.** R forks B and dies before ledger identity. B is SIGSTOPped before reading EOF. The gate prevents auth/tmux, but no durable PID exists, so cleanup cannot kill or prove zero process. Ordinary user-space spawn plus ledger publication is not atomic.
2. **Pipe EOF is accidentally retained.** R creates the gate without close-on-exec or lets another child inherit the writer. R dies; B never receives EOF and remains indefinitely gated. A timeout may make B exit, but that behavior and all FD inheritance must be exact and tested.
3. **Record-versus-release race.** R persists `SPAWN_RELEASED`; K enters `REAPING`; R writes the pipe anyway. This is safe only if K's terminal fence prevents every replacement spawn and K kills the already-recorded B/T identity after the race. A pre-write ledger recheck alone is insufficient because K can win immediately after it.
4. **Exec identity ambiguity.** Cleanup samples S3 while B has execed: PID/start/PGID match, but `comm` changed from Node to tmux. A parser that expects only Node quarantines a legitimate process; one that accepts arbitrary commands can kill foreign state. The allowed Node→exact-tmux identity transition must be closed and host-proven.
5. **Pre-session foreground server leak.** B execs `tmux -D -S socket`, T binds, and R dies before launching C. Because `-D` turns off exit-empty, T remains alive with auth and no session. Cleanup must treat `SERVER_IDENTIFIED_NO_SESSION` as secret-bearing, not harmless.
6. **Late separate client recreates the server.** C is released but stalled. K kills T and sees the socket disappear. C resumes and executes `tmux -S socket new-session …`; the client may create a replacement server/socket after CLEAN. Killing/fencing C before T is mandatory.
7. **Client contacted T before its record.** An ordinary direct tmux client is forked and sends `new-session` before R records it. K cannot distinguish no client from a client that already caused T to fork Claude. C needs the same record-before-release discipline as B.
8. **Socket unlinked while T lives.** The private socket is deleted by crash/fault while exact T remains live. Any absence-only rule passes incorrectly. Cleanup needs exact T signaling even without a socket and must prove T/P gone.
9. **Server process group does not contain panes.** T starts a PTY command in a new session/process group, as terminal job control commonly requires. `killpg(T_PGID)` removes B/T but leaves Claude and hooks alive with inherited auth. “Private process group” is not descendant containment without exact host evidence.
10. **SIGKILL prevents tmux child cleanup.** `kill-server`/TERM is unavailable or T is stuck, so K sends KILL to T. The kernel cannot let T run its normal pane teardown; pane/Claude descendants may survive. The Plan cannot equate server death with tree death unless their identities/containment are independently closed.
11. **Pane child exists before durable identity.** C successfully creates the session; T forks an auth-bearing pane wrapper/Claude; R dies before querying/recording pane PID. This is the same spawn-before-record class one level lower. A server-level containment proof or a second no-auth child gate is required.
12. **PID/start check-to-kill reuse.** K verifies PID/start with `/bin/ps`; the process exits and is reaped; the PID is reused before `kill(pid)`; K signals an unrelated same-uid process. A second ps check narrows but does not remove this TOCTOU. Post-kill verification cannot repair the wrongful signal.
13. **Two cleaners amplify reuse.** K1 and K2 both validate T. K1 kills and the PID is reused; K2 then signals the numeric PID based on stale validation. An exclusive reaper lease is necessary for raw signals.
14. **Cleanup crashes after kill.** K kills T/socket and dies before ledger CAS. A successor must reacquire exclusive reaper authority and re-prove all creators/processes/socket absent. It may not turn the prior action log into proof.
15. **Stuck broker.** B is stopped after durable identity and before release, or after receiving the secret but before exec. TERM/pipe revoke may not run. K needs a safe KILL route to the exact identity; otherwise the attempt remains quarantined with a possibly secret-bearing process.
16. **Query client changes state.** A supposed server-identification command or client invocation starts a server when none exists. Every tmux query command needs an exact “does not create server” host probe; command-family intuition is not evidence.
17. **Valid ps row rejected.** The actual pinned Darwin command has already produced `93346 Mon Aug  3 22:23:19 2026         0 /bin/ps\n`, with zero leading PID spaces. A grammar requiring a leading space rejects a valid five-digit identity and disables recovery.

# Pinned ps grammar and identity limits

The parser must accept zero through the field-width maximum of leading ASCII spaces before the exact stored decimal PID, then require the actual fixed `lstart`, uid, and final `comm` separators. It must keep the strict single LF-terminated row, exact weekday/month vocabulary, two-column day, `HH:MM:SS YYYY`, decimal uid, nonempty final command, exact exit/stderr rules, and duplicate/multiple-row rejection. Fixtures need at least 1-, 4-, and 5-digit PIDs, single- and double-digit days, zero-leading-space success, wrong PID/uid/start/comm, tabs or unexpected whitespace according to the pinned grammar, extra LF/row, stderr, and digest drift. A valid absent in-range PID remains exit 1 with zero stdout/stderr; out-of-range PID diagnostics are malformed input, not absence.

This parser still supplies only a sampled identity. Darwin `lstart` has one-second resolution, and `/bin/ps` plus `kill(2)` is a check-then-act pair. Apple process-event guidance explicitly warns that PIDs can go stale/recycle, while `EVFILT_PROC`/kqueue reports PID events such as EXIT/FORK/EXEC/SIGNAL/REAP but does not itself expose a pidfd-like atomic signal handle. The architecture must not claim atomic PID-reuse-safe signaling from these pieces.

There are two distinct judgments:

- Under the stated non-malicious-same-uid threat model, exact PID/start/PGID checks, a private group, an exclusive reaper, immediate pre/post checks, and fail-closed mismatches may be accepted as a bounded operational risk. Accidental rapid reuse is unlikely, and no same-uid attacker is deliberately forcing it. That is a risk decision, not a proof that the signal cannot hit an unrelated process.
- If the acceptance claim remains exact—no unrelated process can be signaled and cleanup is safe across arbitrary exit/reuse interleavings—verify-then-`kill` is a blocker. Termination must use an identity-bearing control channel/private socket, a retained non-reaping supervisor or kernel/job primitive, or else the socket-unlinked/stuck case must be acknowledged as a host limitation and quarantined. Socket/control-only termination is identity-safe but cannot by itself solve a live server whose socket has vanished.

# Architectural limits and required host probes

1. **Unrecorded-spawn limit.** User-space cannot make OS process creation and a filesystem ledger CAS atomic. A no-auth, unreleased gate converts the unrecorded window from secret/spawn risk into a process-leak risk, which is valuable, but an arbitrarily stopped B before self/parent record still prevents a proof of zero processes. Closing the strict claim requires a kernel/job/supervisor identity known before child creation, or a narrower claim that quarantines rather than certifies when the readiness record never appears.
2. **Darwin signal-handle limit.** Current Apple documentation supports the absence concern: XPC guidance warns of stale/recycled PIDs, and EVFILT_PROC monitors process events without supplying a pidfd-like atomic signal target. Confirm the exact callable surface from pinned Node. If no stronger primitive exists, sampled PID/start/PGID plus `kill` cannot mathematically eliminate reuse TOCTOU. A dedicated non-reaping supervisor can reduce this: while it remains the parent and retains an exited child as a zombie, that child PID cannot be reused before `waitpid`; but supervisor crash/reparenting must then be modeled too. The eventual decision must explicitly choose bounded non-malicious-same-uid risk or narrow/quarantine the exact guarantee; it must not silently promote sampled identity into atomic kill safety.
3. **Node execve probe.** On exact Node 25.2.1/Darwin, prove `process.execve` availability and status, exact argv/env behavior, PID/start/PGID preservation, inherited-FD closure, signal disposition, exception/failure behavior, and that no intermediate child is created. This path must be host-pinned and readiness-rejected elsewhere.
4. **Gate pipe probe.** Prove close-on-exec and non-inheritance of every writer copy; exact EOF on runner SIGKILL; complete-frame-versus-partial-frame behavior; duplicate/late write behavior; EPIPE after broker death; and bounded stuck-reader cleanup.
5. **Foreground tmux probe.** Prove exact `tmux -D -S <socket>` PID/start/PGID, socket timing/mode/type/owner, no daemon child, exit-empty behavior, exec `comm`, TERM/KILL behavior, and whether it ever changes session/group after exec.
6. **Separate client probe.** Pin the exact client argv needed to create Claude, whether it automatically starts a server when the foreground server is absent, whether any flag/command can require an existing server, its PID/group/daemon behavior, and which read-only query commands never create a server. The client must not inherit auth if the existing server already holds it.
7. **Pane/Claude containment probe.** Record T, pane wrapper, Claude, hooks, and sub-agent PID/PPID/PGID/SID/start transitions. Test `kill-server`, socket unlink then TERM, server TERM, server KILL, client crash, runner crash, and stopped processes. Determine which descendants survive or escape the T group. Without this, process-group cleanup is an assertion, not a proof.
8. **Secret-transfer/child-gate probe.** Establish whether T must hold the secret before pane creation and whether a no-auth pane wrapper can be durably identified before receiving the secret over a private in-memory channel. This may be necessary if server KILL can orphan unrecorded auth-bearing pane children.
9. **Exclusive reaper probe/construction.** Demonstrate a recoverable one-cleaner lease that prevents duplicate raw signals but does not let a dead cleaner block socket/process kill indefinitely. Cleanup-proof bookkeeping remains after termination; the lease merely serializes destructive authority.
10. **Stable-absence oracle.** Demonstrate that after every release-capable principal is fenced/gone, no tested transition can recreate T/C/P/socket. Two cleanup passes should test idempotence, not substitute for this structural predicate.

# Bottom line

The first no-auth broker plus durable `SPAWN_RELEASED` is necessary and correctly converts the R4 socket-absence race into a killable recorded-principal problem after B is identified. It is not sufficient by itself.

Before synthesis, the architecture must account for two additional facts: foreground `tmux -D` requires a separately fenced session client, and server PGID death does not yet prove tmux pane/Claude descendant death. The strictest outstanding risks are the unrecorded process window, the separate client's ability to create a replacement server after cleanup, unrecorded auth-bearing pane creation, and Darwin PID/PGID check-to-kill reuse. If the pinned host cannot supply an identity-preserving signal/containment primitive, the acceptance claim must quarantine those cases rather than certify exact no-process cleanup.

Proximate goal outcome: supply an interleaving model that prevents another Plan from treating a transient observation as a durable safety fact. This serves the ultimate goal by making the live compaction rail prove that no auth-bearing launch capability survives a failed or completed campaign.
