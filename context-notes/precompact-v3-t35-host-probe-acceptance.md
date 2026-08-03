---
type: Context Note
title: Revision 3 T3.5 exact-host launch/reap acceptance
actor: codex-precompact-v3-host-acceptance
timestamp: '2026-08-03T23:29:04.646Z'
---
# Summary

Verdict: **PASS for replacement T3.5 Plan synthesis eligibility only**.

Status: complete, read-only independent acceptance review. Confidence: **0.97**.

The selected exact-host no-auth evidence closes the load-bearing host-primitives that blocked the direct gated-broker architecture: exact explicit-`argv[0]` Node-to-tmux replacement, foreground empty tmux identity, a separate `-N` no-autostart client, real Darwin PID/group observations, harmless-pane group topology and teardown, and stale-socket behavior. The remaining work is executable-authority and scheduler/state-machine construction that a replacement Plan can specify and test without assuming another unknown host primitive.

This PASS does **not** approve T3.5 implementation, an API-key/Claude run, G0 freeze, or any live acceptance lane. The planning circuit breaker may advance only to replacement-Plan synthesis; the exact replacement Plan still requires independent acceptance and skeptic PASS.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether the exact host evidence makes the direct gated-broker launch/reap mechanism sufficiently known to plan its remaining state-machine obligations; this serves the ultimate goal by preventing a late or unowned auth-bearing process from being hidden behind a cleanup receipt.

# Exact inputs audited

- Current task: `tasks/pre-compact-multi-session@sha256:13a028e5d5d38a9ab18383551cccfcf813cba27bc41976bf0113191cad744991`.
- Current orientation: `context-notes/precompact-v3-orientation@sha256:af10abacc8f43aa7d237d4dffafd21b1dd1b6a0b717e4191ffdff1f3212a4928`.
- Host-probe Research: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Product/acceptance contract: `research/precompact-v3-t35-launch-reaper-acceptance@sha256:4e05e1e5f39a1fe75d6caf5ad494092587ac490a73c61f4953f02e8d68a012ce`.
- Architect Research: `research/precompact-v3-t35-launch-reaper-architect@sha256:60018b553f55944a78f1631718e0f5c225eef4c72d85a423b76234acc4a19c43`.
- Skeptic Research: `research/precompact-v3-t35-launch-reaper-skeptic@sha256:ceba46d2a33f1d1bc4782077a546e043af8d7163ed70d807233c88e8cab07143`.
- Earlier exact five-digit Darwin row was checked in `context-notes/precompact-v3-t35-plan-skeptic-r4@sha256:046d9eac0ff798e8b3ce64ea97b99819329536583aa84e1e9ad76779eda738a3`.
- Retained evidence root: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`.
- Exact script: `launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`.
- Exact evidence: `evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`.
- Exact summary: `summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Protected snapshots: before and after both `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`.

The exact script and evidence were read, not merely their summary. Hashes matched the Research record. Root/case directories were 0700, script 0700, and retained JSON records 0600. No socket nodes remain under the retained root. No Claude, API key, tmux execution, global configuration mutation, candidate mutation, or Plan mutation was performed by this review.

# Empirical findings

1. **Gate and pre-release behavior.** The exact broker starts under an explicit sanitized environment with neither supported auth variable, writes a create-only/fsynced identity record before `READY`, then synchronously blocks on inherited FD 3. The script checks that no socket exists before delivery. Control EOF before a complete frame exits 1, leaves no socket, and the recorded PID is absent.
2. **Explicit POSIX argv0 is mandatory.** The successful direct call is `process.execve(tmuxRealpath, [tmuxRealpath, "-D", "-f", "/dev/null", "-S", socket], env)`. The executable path must be element zero. The replacement Plan may not reuse the earlier omitted-`argv[0]` form.
3. **Same-principal foreground server.** Across all three live cases, PID, PPID, PGID, and exact `lstart` bytes were unchanged from Node broker to tmux; `comm` changed from exact pinned Node to exact pinned tmux. `display-message '#{pid}'` returned the original broker PID. Exact commandless tmux remained available with zero sessions; inline `new-session` with `-D` failed with usage and no accepted server claim.
4. **`sess` is unusable.** Every retained row—PID 1, orchestrator, broker, server, and pane—reported `sess=0`. It supplies no identity discrimination on this tuple. It must be removed from durable identity, parser, acceptance, and cleanup predicates; it may not be renamed or described as a proven SID.
5. **One-way secret-shaped transfer.** A fresh 64-hex canary crossed only the release pipe into the server environment. It was absent from broker/client/pane argv by construction, absent from retained regular-file content scans, and represented in the pane record only by SHA-256. The client carried no canary/auth variable. FD 3 was explicitly closed before exec and every post-exec write returned `EPIPE`.
6. **Separate `-N` client.** Exact `tmux -N -S <socket> new-session ...` created one harmless pane on the existing server. After complete cleanup, the same `-N` shape exited 1 with `No such file or directory`, created no socket, and therefore did not start a replacement server on this pinned tuple.
7. **Pane topology is not the server group.** In every case, server `PGID=server PID` and pane `PGID=pane PID`. Exact `/bin/ps -g` selected each group while live and returned exit 1 with zero stdout/stderr after cleanup. Any Plan claim that the server PGID contains the pane is false.
8. **Termination mechanics.** Exact `kill-server`, socket-unlink plus server-group TERM, and socket-unlink plus server-group KILL all ended the harmless pane and left both recorded groups absent. The KILL case proves the dummy pane disappeared even when the server could not execute graceful teardown. This is evidence for the harmless primitive, not a universal claim about Claude descendants.
9. **Stale socket behavior.** Successful `kill-server` left the exact owned 0600 socket after server, pane, and both groups were absent. The probe validated it, then unlinked it. Thus stale-socket removal is a terminal filesystem cleanup performed only after process/group absence; socket disappearance is never process proof.
10. **Darwin process grammar.** Selected v5 rows prove padded four-digit PIDs and padded PID 1; the earlier exact installed-host row proves a five-digit PID may begin in column one: `93346 Mon Aug  3 22:23:19 2026         0 /bin/ps\n`. The parser must accept zero or more leading ASCII spaces while retaining exact decimal values, field separators, one LF row, no stderr, strict `lstart`, uid/PGID/comm, and exact exit-1 empty-stream absence. Exact `/bin/ps -g` is usable for process-group enumeration on this tuple.

# Reasoned adjudications

## Pre-record no-auth broker

The OS-spawn-before-self-record interval is not atomic and is not made atomic by this architecture. It is nevertheless safe enough to plan because the exact broker has no auth, cannot reach the pipe read or tmux exec before its ordered create-only identity write, and a missing/stopped readiness record cannot advance.

The mandatory result for `BROKER_RESERVED` with unknown OS-spawn outcome or missing identity is non-advancing `QUARANTINED`/`BLOCKED_PENDING_VERIFICATION`, never `CLEAN`, retry, or secret release. Parent/control EOF may eventually make a resumed broker record and exit, but elapsed time, missing socket, or missing record is never absence proof. This deliberately trades availability for safety and closes the product contract without inventing a host primitive.

## Separately gated client

The direct v5 client proves the host behavior needed by the architecture: `-N` targets an existing server and will not replace an absent one. Production must not spawn that client directly. It must use the already-proven no-auth Node gate pattern: reserve exact client intent, OS-spawn a no-auth gate-closed client broker, durably record PID/start/uid/PGID/Node identity, CAS `SESSION_RELEASED`, then exec exact pinned tmux with explicit executable `argv[0]` and `-N`. Cleanup fences/terminates the client principal before server termination. This is a scheduler construction over proven primitives, not an unknown host behavior.

## Pane/Claude descendants

The harmless pane's separate PGID is a mandatory correction. The evidence proves server TERM/KILL/kill-server removed that harmless pane, but it does not prove real Claude, hooks, or sub-agents can never escape or survive. Plan synthesis remains eligible because no acceptance claim may assume that behavior: the Plan must record the tmux pane PID/start/uid/PGID, discover/audit the full Claude/hook/sub-agent tree, and include exact real-Claude TERM/KILL/socket-loss cleanup as a later immutable-candidate gate. Any unknown or surviving auth-bearing descendant is `TMUX_CLEANUP_FAILED`/non-advancing FAIL, never PASS or a caveat. If the Plan cannot express that exact live gate, Plan review must fail.

## Stale socket and cleanup order

The accepted order is causal: commit terminal release fences; stop every identified client/delivery creator; terminate and prove broker/server identity absent; terminate/prove every recorded pane/Claude group and audited descendant absent; validate the exact private socket node; remove a remaining owned stale socket; re-run process/group/socket and late-`-N` absence checks; only then publish the cleanup ledger proof. `kill-server` is useful but never sufficient.

## Exclusive raw-signal reaper

Only one recoverable reaper lease may issue raw PID/PGID TERM or KILL. Other cleaners may request cleanup and verify observations, but cannot signal. Lease takeover requires exact proof the former reaper owner is absent and restarts identity verification from first principles; timeout alone cannot steal it. Socket `kill-server` may be idempotently retried, but the Plan must prevent two cleaners from validating once and signaling the same numeric PID after one cleaner has already caused exit/reuse.

## Sampled PID/lstart/PGID risk decision

**Accepted for this exact Claude-only pilot under the already-stated non-malicious-same-uid threat model. A stronger identity-bearing primitive is not required for Plan synthesis.**

This is a deliberate scope decision, not a claim that Darwin `/bin/ps` plus `kill` is atomic. `lstart` has one-second resolution and verify-then-signal retains an irreducible reuse TOCTOU. The replacement Plan must state that limitation and must not promise that an unrelated process can never be signaled across arbitrary PID-reuse interleavings.

Mandatory mitigation is: private attempt-owned process groups; exact PID/start/uid/PGID/state-specific comm plus pinned executable digest; immediate re-read before each raw signal; one exclusive raw-signal reaper; no second signal after identity absence/mismatch; fail-closed quarantine on any mismatch; and exact post-signal PID/group/descendant proof. Under non-malicious same-uid operation, accidental reuse of the exact PID/PGID in that immediate serialized interval is accepted as bounded pilot risk. If the product later requires atomic identity-preserving signaling or expands to a malicious same-uid model, this decision expires and a retained supervisor, kernel/job handle, or other identity-bearing primitive becomes mandatory.

Because the limitation and scoped guarantee are now explicit, this is not a pass-with-caveats over an unknown load-bearing behavior. The stronger atomic guarantee is expressly out of scope; all in-scope host behavior needed for Plan construction is either observed or fail-closed by the required state machine.

# Survived claims

- Exact-full execution identity and private attempt paths remain sound, with `sess` removed and PPID retained only as evidence rather than an immutable post-parent-crash identity.
- The frozen candidate/wrapper/ledger/auth/npm architecture, corrected jq, promote-collision behavior, sequential fault wrapper, challenge-bound R0/Q0, serialized L0, and supported `SessionStart(source=compact)` rail remain unchanged.
- A no-auth gate-only broker plus durable identity before irreversible `SPAWN_RELEASED` closes the original auth-bearing late-bind race.
- Same-PID/start/PGID Node-to-commandless foreground tmux exec is viable on the exact Node 25.2.1/tmux 3.6b/Darwin-arm64 tuple.
- A separately fenced `-N` client can create a session without auth in its own environment and cannot replace an absent server on this tuple.
- Socket loss with a live server remains recoverable through the recorded server PID/PGID, subject to the explicit bounded signal-risk decision.
- Exact process-group enumeration, harmless-pane discovery, kill-server/TERM/KILL cleanup, validated stale-socket unlink, and repeated absence checks are available primitives.
- Corrected Darwin parsing accepts full-width zero-leading-space PIDs and exact absent-PID semantics.

# Mandatory replacement-Plan constraints

1. Preserve the R4 candidate, wrapper, campaign ledger/history/lock, auth boundary, npm verifier, lifecycle lanes, and artifact-freeze architecture; reopen only launch/reap and Darwin process grammar.
2. One private executable authority owns reservation, exact broker/client protocols, state transitions, release frames, reaper lease, process parsing/signaling decisions, socket cleanup, evidence, and terminal verdict mapping. Shell/prose cannot split authority.
3. Pin exact Darwin arm64, Node v25.2.1 realpath/digest, tmux 3.6b realpath/digest, `/bin/ps` realpath/digest, exact argv, `/dev/null` tmux config, environment allowlists, schemas, limits, and private 0700/0600 paths. Any drift blocks before secret release.
4. Encode monotonic states equivalent to `BROKER_RESERVED`, `BROKER_IDENTIFIED_GATE_CLOSED`, irreversible `SPAWN_RELEASED`, `SERVER_IDENTIFIED_NO_SESSION`, `CLIENT_RESERVED`, `CLIENT_IDENTIFIED_GATE_CLOSED`, irreversible `SESSION_RELEASED`, `SESSION_RUNNING`, `REAPING`, `CLEAN`, and non-advancing `QUARANTINED`.
5. Hold the campaign mutation boundary across the final active-state check and each broker/client OS spawn. Every spawned principal is no-auth and gate-closed until its exact create-only identity record is durable/read back. An unrecorded spawn outcome quarantines and cannot clean or retry.
6. Release-versus-reap is one mutually exclusive CAS decision. Durable read-back of `SPAWN_RELEASED` precedes one bounded pipe delivery. After it, cleanup assumes the broker may possess auth regardless of socket/comm. The broker independently validates exact release identity/revision/nonce and cannot retry.
7. Exec exact `process.execve(tmuxRealpath, [tmuxRealpath, "-D", "-f", "/dev/null", "-S", socket], env)`. No inline command. Remove `sess`/SID from required identity and grammar. Do not require PPID stability after runner death.
8. Establish the same PID/start/uid/PGID as exact tmux, exact zero-session state, and exact socket identity before reserving the session client. The client is separately no-auth, identity-gated, CAS-fenced, explicit-`argv[0]`, and `-N`; cleanup kills/fences it before the server.
9. Treat pane PGID as distinct. Record pane/Claude identity and audit the full hook/sub-agent descendant boundary. The real-Claude live lane must force normal, TERM, KILL, socket-unlinked, runner-crash, and cleanup-race paths and reject any survivor or unknown descendant.
10. Use corrected strict single-PID and group `ps` grammars with zero-or-more leading PID spaces and without `sess`. Malformed, multirow, stderr, digest drift, state-comm mismatch, or identity mismatch fails closed.
11. Serialize raw signals through one recoverable reaper lease and encode the scoped PID-risk statement verbatim in substance. Immediate revalidation is mandatory; a mismatch is never permission to signal or clean.
12. Cleanup order is creators first, then server/pane/Claude descendants, then validated stale socket, then repeated structural absence, then ledger proof. Socket absence/removal and elapsed polling never substitute for a causal fence.
13. Red scheduler tests must cover every crash boundary around broker/client spawn, self-record, release CAS, partial/full delivery, exec, socket bind, session/pane creation, cleanup fence, reaper takeover, TERM/KILL, stale-socket removal, and terminal proof, including two cleaners and stopped processes.
14. Unit/fake tests own schemas, state legality, CAS interleavings, parser rejection, one-shot delivery, verdicts, and privacy scans. Exact-host no-auth tests own argv0/exec, foreground tmux, `-N`, `ps -p/-g`, group topology, all termination paths, stale sockets, and double cleanup. Real immutable-candidate lanes own Claude descendants, API/auth, lifecycle events, manual/automatic/sub-agent compaction, and protected-state continuity.
15. Before secret release, unresolved identity is closed BLOCKED/quarantine. At or after either irreversible release, unknown identity, surviving process/group/descendant, late socket, replacement server, cleanup timeout, or secret serialization is non-advancing FAIL. No retry overlaps unresolved state.

# Blocking issues and prohibited claims

Plan-synthesis blockers: **none** for the selected direct gated-broker architecture, provided every mandatory constraint above is carried into the replacement Plan. Omission of any one is a fresh Plan-review FAIL, not a caveat.

Prohibited claims include: atomic PID-safe signaling; `sess`/SID identity on this host; PPID stability after parent death; pane membership in the server PGID; universal Claude-descendant death inferred from the harmless pane; socket absence/removal as process proof; `kill-server` as sufficient cleanup; a direct/unrecorded session client; tmux `-D` with a command; omitted POSIX `argv[0]`; `-N` generalization beyond the pinned tuple; pre-record timeout as CLEAN; two raw-signal cleaners; or implementation/live-auth approval from this Plan-eligibility PASS.

Stopped-shipping conditions before implementation/live acceptance remain: replacement Plan lacks exact dual review; host/toolchain/artifact identity drifts; scheduler red matrix is incomplete; a real Claude descendant cannot be exactly discovered/reaped; a protected-state or secret scan changes; any post-clean process/socket appears; or the product demands atomic no-mistarget signaling without adding an identity-bearing primitive.
