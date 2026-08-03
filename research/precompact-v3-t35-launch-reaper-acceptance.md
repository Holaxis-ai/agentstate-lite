---
type: Research
title: T3.5 launch/reaper product and acceptance contract
actor: codex-precompact-v3-launch-acceptance
timestamp: '2026-08-03T22:34:52.482Z'
---
# Summary

Status: **acceptance contract defined; proposed architecture conditionally viable but not yet evidence-satisfied**.

Confidence: **0.97**.

This document is the product/acceptance contract for the reopened T3.5 launch/reap and Darwin `ps` subsystem. It is not a replacement Plan, implementation design, or authorization to start F0/G0. The planning circuit breaker remains active until architect, acceptance, and skeptic reconcile one architecture against this contract.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: define what must be true before an API-key-bearing Claude/tmux process can be launched and what must be proved before cleanup can certify it absent; this serves the ultimate goal by preventing an acceptance campaign from losing ownership of its live process boundary.

Product disposition: the proposed gate-only broker -> durable identity -> durable release -> one-shot secret -> foreground tmux server shape is acceptable **only if** the pinned-host primitive evidence and all causal-fence criteria below pass. Socket absence, elapsed time, or fake-host behavior cannot substitute for extinguishing every process that can still create or recreate the socket.

## Reviewed exact inputs

- Exact R4 Plan: `plans/precompact-v3-t35-candidate-acceptance@sha256:d26ed81a61f6035de04252a9d8d3dccbbb9331192e86a51ff2912feb1ed2e812`.
- Product R4 FAIL: `context-notes/precompact-v3-t35-plan-accept-r4@sha256:3b8c55e0acb7e1b798364e39c15be8bc7ea9e5f84d08af2b1a7be7f1effa06ae`.
- Skeptic R4 FAIL: `context-notes/precompact-v3-t35-plan-skeptic-r4@sha256:046d9eac0ff798e8b3ce64ea97b99819329536583aa84e1e9ad76779eda738a3`.
- Current orientation: `context-notes/precompact-v3-orientation@sha256:d2ef0e3a85356b5ca63561866da5be8e1990f3a11678de20aa358b6f803d5c58`.
- Current task: `tasks/pre-compact-multi-session@sha256:3adf22dbb1fd9c719b5ae988521890ea4f898903066acfd690a074ea67e4e570`.

No code, Plan, Claude, auth, global state, or tmux invocation was used to produce this contract.

# Product boundary and threat model

The acceptance authority may rely on the existing non-malicious-same-uid drift model, exact private 0700 attempt paths, immutable candidate/toolchain identities, and crash-atomic campaign CAS. It must tolerate runner or cleaner SIGKILL, delayed scheduling, PID reuse, socket loss, two cleaners, and any crash between adjacent durable or OS-process steps.

The security invariant is stronger than “cleanup eventually runs”:

> After a terminal cleanup proof, no process possessing the real auth value exists, and no already-live or already-OS-spawned process retains authority to create the owned tmux socket or an owned replacement server.

The hygiene invariant additionally requires every owned no-auth broker/client/control process and the exact private socket to be absent. If hygiene cannot be proved before secret release, the result is stopped-shipping BLOCKED/quarantine; if auth may already have been released, inability to prove it is FAIL, not a caveat or BLOCKED.

# Required launch/reap state model

Names may change, but the executable state distinctions and monotonic semantics may not:

1. `BROKER_RESERVED`: campaign CAS reserves attempt, broker nonce, control identity, server socket, and expected toolchain. No secret has crossed the control boundary and no spawn release exists.
2. `BROKER_IDENTIFIED`: one no-auth, gate-only broker is bound to exact PID, process start, uid, PGID, executable digest/command state, control-channel identity, and broker nonce. The gate is closed.
3. `SPAWN_RELEASED`: one irreversible, one-shot release for that exact broker identity is durable and read back **before** any secret byte is delivered. No second release, broker respawn, or retry is legal.
4. `SERVER_IDENTIFIED`: the same PID/start/PGID is now the exact foreground tmux server; the exact socket is present and private. The server has no session yet.
5. `SESSION_CLIENT_RELEASED`: one separately identified, no-auth client may create the Claude session on the already-identified server. The client must be unable to create a replacement server if the owned socket/server is gone.
6. `SESSION_RUNNING`: server/session/Claude evidence is bound to the attempt. Any auth-bearing hook descendants remain inside the already accepted R4 possession boundary.
7. `REAPING`: no new release/client/session action is legal. Cleanup owns the exact immutable process/control/socket identities.
8. `REAPED`: every launch-capable and owned process is causally fenced and absent, socket absence is revalidated, and only then is the ledger cleanup proof published.
9. `QUARANTINED`: terminal and non-advancing when identity/evidence is incomplete. It is never synonymous with process absence.

`SPAWN_RELEASED` is a durable fact, not a revocable fiction. Cleanup before it may CAS-revoke future release. Cleanup at or after it must assume the secret was delivered and kill the exact recorded principal even when the socket has never appeared.

# Mandatory acceptance criteria

## A. No-auth broker and release capability

1. The broker is spawned with an explicit environment containing no real auth value, no unsupported auth variables, and no parent-environment fallback. Its argv/control metadata is content-free.
2. Before release, the broker can only validate its immutable broker/control identity, report ready, block on the gate, or exit. It cannot exec tmux, bind the tmux socket, create a session, launch Claude, reconnect, retry, or read auth from disk/global state.
3. The authority must close the pre-identity broker window. `BROKER_RESERVED` may reach `REAPED` only with machine proof that no OS spawn occurred or after every possible gate-only broker is exactly identified and killed. A missing PID/control record plus elapsed time is not proof. If the chosen broker primitive cannot make this distinction, the architecture is BLOCKED before secret release.
4. Broker PID/start/uid/PGID, exact broker executable digest/command state, control-channel identity, nonce, and private path facts are durable and read back before `SPAWN_RELEASED` is possible.
5. Stage-run release and cleanup revocation serialize through one crash-recoverable CAS/lock boundary. If cleanup wins before release, a later runner cannot release. If release wins, cleanup treats the broker as potentially auth-bearing and kills it; it does not attempt to turn history back into “unreleased.”
6. `SPAWN_RELEASED` binds one exact broker identity, release nonce/digest, control protocol version, auth variable name, and one delivery allowance. Partial write, duplicate frame, stale nonce, wrong broker, EOF, oversize, or second delivery fails closed and cannot exec.
7. Secret delivery is one fixed bounded frame over an anonymous/inherited or otherwise private non-persistent channel. The secret never enters argv, files, socket names, settings, ledger, logs, receipts, errors, debug output, tmux client commands, or attestations.
8. On successful receipt the broker closes the control channel, constructs the exact allowlisted server environment with exactly one auth variable, and uses the exact pinned Node `process.execve` primitive. Best-effort buffer zeroing is hygiene, not evidence that memory never held the secret.

## B. Foreground server-first tmux identity

9. The contract is server-first. Exact tmux 3.6b `-D` forbids a tmux command and disables exit-empty; therefore the broker may exec only exact pinned `tmux -D -S <exact-private-socket>` with **no** `new-session` or Claude command.
10. Exact-host evidence must prove Node v25.2.1 `process.execve` replaces the broker with tmux while preserving PID, process-start identity, and PGID; the executable/`comm` state changes from the pinned broker to the pinned tmux identity. This claim is scoped to the exact manifest Node/tmux/Darwin tuple, not Node >=20 or another tmux.
11. Exact-host evidence must prove `tmux -D -S` remains foreground at that identity, creates only the exact private socket, stays alive with zero sessions, and does not exit merely because the server is empty.
12. `SERVER_IDENTIFIED` requires exact PID/start/PGID/uid/tmux digest, socket lstat/uid/mode/type/realpath, zero-session evidence, and a second ps/socket read-back. Socket appearance alone cannot identify the server.
13. A separate pinned, no-auth client creates the Claude session only after `SERVER_IDENTIFIED`. Its command, client identity, deadline, and result are durable. The client must use an exact-host-proven no-autostart/refuse-new-server mode; if tmux 3.6b cannot guarantee that a late client will not create a replacement server after socket loss, this architecture is BLOCKED.
14. Client/session creation must prove it targets the existing foreground server and launches the exact lane command without auth in client argv/environment. The server supplies the inherited auth environment. The client cannot be a second server authority.

## C. Reap and stable-absence proof

15. `REAPING` fences all future broker release, client release, respawn, reconnect, and retry actions under CAS. Every runner checks the terminal/reaping revision before each process action; a stale runner cannot create another broker, server, or client.
16. Cleanup below `SPAWN_RELEASED` closes/revokes the gate and terminates every exactly identified gate-only broker/client/control process. It may report BLOCKED/quarantine, but never clean, if the pre-identity spawn outcome is unknowable.
17. Cleanup at or after `SPAWN_RELEASED` first terminates the exact broker/server PID and private PGID even if the socket is absent. PID/start/uid/PGID/executable state must be rechecked immediately before TERM and KILL; PID reuse or mismatch fails closed without signaling an unrelated process.
18. If the exact socket is usable, cleanup also sends the exact pinned `kill-server` request. Socket control is an additional termination path, never the sole proof. If the socket is missing or unusable while the recorded PID lives, verified PID/PGID termination is mandatory.
19. Cleanup terminates every separately released client before it can connect late. Host evidence must prove a delayed client cannot recreate a server; otherwise cleanup must kill/fence the exact client principal before server/socket absence is considered stable.
20. Server/PID/PGID termination must be proved to terminate the harmless pane descendant in the no-auth primitive probe. If tmux changes process groups or server death does not kill the pane tree, the architecture must add exact descendant identities and termination; group membership may not be assumed.
21. Removing the exact private socket is allowed only after ownership facts are revalidated. Unlinking a socket does not prove the server died. A live PID with a missing socket still requires termination.
22. “Stable absence” means: all principals capable of binding/rebinding are durably revoked or proven dead; all exact PID/start and required process-group/descendant queries are absent; the socket is absent; and process/socket absence is observed again after the bounded termination/late-bind interval. Repeated sleeps or lstats without the causal process fence never qualify.
23. Cleanup publishes its ledger proof only after criterion 22. Campaign retry or another L0 case is forbidden until that proof is read back. `QUARANTINED` never unlocks retry while an auth-bearing process may remain.
24. Two cleaners are idempotent and convergent: both derive the same immutable identities; either may issue repeat TERM/KILL/kill-server operations; exactly one CAS publishes the terminal proof; the loser verifies the identical proof and absence. Neither treats the other's in-progress socket observation as terminal.

## D. Crash and concurrency matrix

The red matrix must cover at least:

- runner death before broker OS spawn, after OS spawn but before broker identity, after identity but before release CAS, after release CAS but before/within/after partial secret delivery, after full delivery but before/during/after execve;
- broker stopped/delayed before ready, after ready, while reading the frame, with a complete secret before exec, and during exec replacement;
- tmux socket before/after server ps identity, server identity before zero-session proof, socket removed while server lives, and server death while the socket remains;
- separate client reserved, OS-spawned, stopped, connecting, or completing while cleanup begins; client resuming after the server/socket was removed; attempted replacement-server creation;
- Claude/pane creation before the client result is recorded, process-group changes, hook child activity, and runner death during every PTY action;
- cleanup before release versus release under CAS, a stale runner after `REAPING`, two simultaneous cleaners, cleaner death after TERM/before KILL, after kill/before socket removal, and after absence/before ledger proof;
- PID reuse, wrong uid, changed comm/executable, changed PGID, malformed/multiple ps rows, ps digest drift, and an unrelated tmux server/socket.

Every trace must end in exactly one of: coherent `REAPED` with causal stable absence; no-auth `BLOCKED_PENDING_VERIFICATION` plus non-advancing quarantine; or FAIL with non-advancing quarantine and explicit external process audit required. No trace may end PASS merely because the socket was absent.

# Exact Darwin ps contract

The ps parser must be derived from and pinned to real exact-host bytes. At minimum the identity query must include PID, PGID, lstart, uid, and comm using manifest-pinned `/bin/ps`, exact argv, `LC_ALL=C`, and `TZ=UTC`; `/bin/ps` bytes are checked before and after.

Success accepts exactly one LF-terminated row and zero stderr. Numeric fields allow **zero or more leading ASCII spaces**—a five-digit PID may begin in column one—followed by the exact canonical decimal value and at least one ASCII-space field separator. No sign, decimal leading zero, tab, CR, NUL, extra row, suffix, or ignored field is accepted.

`lstart` is the exact C-locale Darwin form: weekday `Sun|Mon|Tue|Wed|Thu|Fri|Sat`, month `Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec`, space-padded day 1-9 or two-digit day 10-31, `HH:MM:SS`, and four-digit year, with the exact observed ASCII-space separators. The parsed value must byte-agree with the durable start identity. UID and PGID must exactly match the stored decimal identities. `comm` is a nonempty final field and must match the exact state-appropriate broker or tmux value observed by the primitive fixture; it is not inferred from basename intuition.

Exit 1 with exactly zero stdout and zero stderr is the only absent-PID result. Every other exit, stderr byte, empty success, malformed row, multiple row, field mismatch, or tool digest change is fail-closed. Parser fixtures include real pinned-host zero-leading-whitespace five-digit output, padded PID 1 output, and synthetic 1-/4-/5-digit boundary rows; the exact-host smoke must exercise its current real PID and PID 1 where permitted.

Single-PID identity does not prove process-group or descendant absence. The contract requires a separately pinned exact-host group/descendant enumeration command and strict byte grammar. If Darwin ps cannot supply an unambiguous bounded group query for the chosen process model, the reaper architecture is BLOCKED until a different exact identity mechanism is selected.

# Evidence split

## Must be proved by an exact-host, no-auth primitive probe

- Node v25.2.1 exposes working `process.execve`; broker -> exact `tmux -D -S` preserves PID/start/PGID.
- Broker starts without auth, stays behind the gate, rejects partial/duplicate release frames, and closes control descriptors on exec.
- tmux 3.6b `-D` accepts no command, remains foreground/empty, binds the exact socket, and retains the expected identity.
- A separate no-auth client creates a harmless session on the existing server and is proven unable to autostart a replacement server after loss/cleanup.
- Nonsecret environment-canary inheritance from server to harmless pane; no claim of host secret scrubbing.
- Exact socket kill and socket-loss PID/PGID fallback; server termination removes the harmless pane/descendant tree; delayed client cannot revive it.
- Exact Darwin ps success/absence bytes, PID widths, comm transition, PGID behavior, group enumeration, and PID-reuse/mismatch handling available on the host.
- Cleanup repeated twice on harmless processes leaves no process, group member, control endpoint, or socket and no later bind.

The probe uses a fake secret canary, never a real API key, Claude, global config, or model request. Failure or inability to capture any load-bearing primitive is `BLOCKED_PENDING_VERIFICATION`; fake tests cannot waive it.

## May be proved by unit/fake/scheduler tests

- Strict schemas/codecs, digest/path/privacy checks, state-transition legality, one-shot CAS, and attestation mapping.
- Exhaustive ordering of the crash matrix, two-cleaner CAS convergence, stale-runner rejection, deadlines, partial frames, output bounds, and kill escalation decisions.
- Fake ps parser rejection tables after the real grammar is frozen.
- Secret/canary scans proving no serialization in modeled argv/files/logs/receipts.
- Fake tmux/Claude lifecycle orchestration and closed verdict mapping.

These tests prove the authority reacts correctly to frozen observations. They do not prove `execve`, `tmux -D`, client no-autostart, Darwin ps bytes, process groups, descendant death, or socket timing on the installed host.

# Stopped-shipping outcomes

- Missing exact-host primitive evidence before implementation/live auth: `BLOCKED_PENDING_VERIFICATION`; do not release a secret, start F0 from the architecture, or claim cleanup support.
- At stage run, missing/drifted Node/tmux/ps identity, unsafe broker/control/socket paths, missing auth, or failed pre-release broker identity: no secret release; close the attempt/campaign with the applicable closed BLOCKED reason and quarantine if absence is not proven.
- After `SPAWN_RELEASED`, any unknown broker/server/client identity, ps ambiguity, inability to kill/prove process-group or descendant absence, late socket, replacement server, secret serialization, or cleanup timeout is FAIL (`TMUX_CLEANUP_FAILED` or `AUTH_OR_CONTENT_LEAK`), never BLOCKED. No advancing attestation or retry is allowed.
- A real auth/API failure after a clean, fully reaped launch remains `BLOCKED_AUTH` and stops shipping. It does not relax reaper evidence.
- Any process or socket appearing after a cleanup proof invalidates that proof, fails the campaign, and reopens this architecture.

# Prohibited claims

- “Socket absent” or “socket removed” means server/process absent.
- A durable socket reservation identifies or revokes a process.
- A broker PID record can be written after secret delivery or after tmux spawn and still close the pre-identity window.
- `tmux -D` may carry `new-session` or Claude arguments; on pinned 3.6b it is server-first and commandless.
- A separate tmux client cannot start a replacement server without exact-host proof/enforcement.
- Killing one PID or PGID necessarily kills panes/Claude descendants without primitive evidence.
- PID alone identifies a process; start, uid, PGID, executable/comm state and digest remain mandatory.
- A leading space before PID is mandatory Darwin output; zero-leading-whitespace rows are valid when the field is full width.
- Node `process.execve` or PID-preserving behavior generalizes beyond exact Node v25.2.1/host evidence.
- Sleep/retry/polling establishes stable absence before launch capability is causally fenced.
- Fake tmux, synthetic ps rows, documentation, or unit tests establish installed-host process behavior.
- Cleanup uncertainty after secret release is a shippable caveat or BLOCKED result.

# Current blockers before a replacement Plan

1. No accepted exact-host no-auth fixture yet proves broker gate behavior, Node 25.2.1 execve PID/start/PGID preservation, commandless foreground tmux 3.6b, empty-server identity, or the separate-client/no-replacement-server contract.
2. The pre-identity no-auth broker window still needs one executable proof of “no spawn” or exact discovery/termination; timeout plus absent broker record is forbidden.
3. Exact process-group and descendant enumeration/termination on Darwin is unproven, including socket-loss/live-PID fallback and whether foreground server death reliably removes the harmless pane tree.
4. The actual Darwin ps single-PID and group-query grammars, including zero-leading-whitespace PIDs and state-specific comm values, are not yet frozen into reviewed fixtures.
5. The release/cleanup interleaving needs one reconciled mechanism that makes pre-release revocation and post-release kill semantics mutually exclusive under CAS, with no secret retry and two-cleaner convergence.

Until those five items have exact no-auth evidence and a reviewed interleaving matrix, the replacement launch/reap architecture is **BLOCKED_PENDING_VERIFICATION** and no replacement Plan is eligible for P35.
