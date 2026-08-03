---
type: Research
title: Revision 3 exact-host no-auth launch/reap primitive campaign
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T23:16:52.817Z'
---
# Disposition

Status: **exact-host no-auth primitive campaign observed PASS for the named broker/tmux/process-group claims; replacement architecture remains pending independent acceptance and skeptic review**.

Confidence: 0.99 in the recorded host observations and protected-state continuity; 0.88 that the resulting launch/reap architecture is plan-eligible because the sampled-PID signaling limit, pre-record broker quarantine, separately fenced client, and real Claude descendant tree still require explicit adjudication.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether the pinned host can provide a causally fenceable no-auth broker -> foreground tmux -> harmless pane rail whose creators, processes, groups, socket, control channel, and private canary can all be accounted for before any API-key Claude run; this serves the ultimate goal by keeping the context-loss acceptance rail empirical and stopped-shipping when process ownership is ambiguous.

This Research record is evidence for Plan synthesis. It does not revise Plan R4, authorize T3.5 implementation, use Claude or an API key, or waive exact Plan review.

## Exact successful campaign

Private retained root: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`.

- Probe script: `launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`.
- Evidence: `evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`.
- Summary: `summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Protected before/after snapshots are byte-identical at `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`.
- Root/case directories are 0700; script is 0700; every evidence/config record is 0600; sockets were 0600 while live.
- Post-campaign `/bin/ps -axo pid=,ppid=,pgid=,sess=,stat=,etime=,command=` returned zero rows matching the exact root, socket, probe script, or `tmux -D` patterns.
- Feature worktree remained clean at exact HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`; this probe changed no repository source.

Pinned toolchain:

- Darwin arm64.
- Node v25.2.1 realpath `/opt/homebrew/Cellar/node/25.2.1/bin/node`, sha256 `a885ecbb600fb6f651eed75c6d44010cc8033cc952ee88b6ee850a793e345794`.
- tmux 3.6b realpath `/opt/homebrew/Cellar/tmux/3.6b/bin/tmux`, sha256 `e0c40b227b8d7283c4ace45056c70cf0fe371bd00b62e52b6e14fadae5d69f70`.
- `/bin/ps`, sha256 `472992c470606d28f577590decfecd7f4a20f832fd92c671bebc6d44790b5d02`.

The campaign used a fresh private HOME/TMP per case, an explicit environment containing neither `ANTHROPIC_API_KEY` nor `CLAUDE_CODE_OAUTH_TOKEN`, and a new random 32-byte hex canary per live case. No Claude process, model call, candidate hook, real API key, or global-auth fallback was used.

## Critical argv correction

Node's experimental `process.execve(file, args, env)` passes `args` as the complete POSIX argv vector for this host. It does not synthesize the executable as `argv[0]`.

Two exact harmless microprobes establish the boundary:

- `process.execve("/bin/sleep", ["1"], ...)` exited immediately with sleep usage because `"1"` became `argv[0]` and there was no duration argument.
- `process.execve("/bin/sleep", ["/bin/sleep", "1"], ...)` exited 0 after approximately one second.

Therefore the accepted host form is `process.execve(tmuxRealpath, [tmuxRealpath, "-D", "-f", "/dev/null", "-S", socket], env)`. Earlier attempts that used `["-D", ...]` did not actually pass `-D` as an option; their `open terminal failed` results did **not** test the proposed foreground-server mechanism. The final campaign corrects that model error. Node's official documentation establishes that only standard descriptors survive exec, but does not make the `argv[0]` convention explicit enough to replace this host proof: <https://nodejs.org/api/process.html#processexecvefile-args-env>.

## What passed on the pinned host

### Gate and exec

- A detached no-auth Node broker had `PGID=PID`, wrote its exact identity before READY, bound no socket before release, and exited without a socket when the control writer closed before a complete frame.
- The only dynamic canary bytes crossed the framed anonymous control pipe after release. The broker received no canary through argv or disk, closed FD 3 before exec, and every post-exec late write failed with `EPIPE`.
- Exact `process.execve` replaced Node with tmux while preserving PID, PPID, PGID, and the one-second `lstart` bytes in all three cases. `comm` changed from the pinned Node realpath to the pinned tmux realpath.

### Foreground tmux and separate client

- Exact commandless `tmux -D -f /dev/null -S <private socket>` started a zero-session foreground server without a terminal. `display-message -p '#{pid}'` returned the original broker PID in every case.
- Supplying an inline `new-session` command with `-D` exited 1 with tmux usage and created no owned socket.
- A separate exact `tmux -N -S <socket> new-session -d ...` client created one harmless Node pane on the already-live server.
- The pane inherited the exact random canary from the server environment even though the client environment and argv held no canary/auth variable. The pane record stored only a digest; all dynamic canary bytes were absent from every regular file and from the before/after process-list captures.
- After complete cleanup, repeating `tmux -N -S <socket> new-session ...` exited 1, reported no such socket, and did not create a socket. The exact `-N` client is therefore a no-autostart client on this tuple.

### Process groups, descendants, socket, and cleanup

- Server and pane were in distinct process groups: server `PGID=server PID`; pane `PGID=pane PID`. A server-group-only membership claim is false and is prohibited.
- Exact `/bin/ps -g <pgid> ...` selected each owned group while live and exited 1 with zero stdout/stderr for both groups after cleanup.
- Three cases passed: exact socket `kill-server`; socket unlink followed by server-group TERM; and socket unlink followed by server-group KILL. In all three, the harmless pane PID and its separate process group were absent at the first post-server cleanup observation. No fallback pane signal was needed.
- `kill-server` left the exact owned 0600 socket node behind after the server and pane/group were absent. The campaign validated type/uid/mode, then explicitly unlinked it. TERM and KILL cases had already unlinked the socket. This changes the terminal rule: explicit socket removal is legal only **after** creator, PID, and group absence; socket disappearance is never process proof.
- Repeated cleanup was harmless and the final independent process audit found no owned process or late binder.

## Darwin process grammar learned

The exact single-PID and group commands used:

`/bin/ps -p <pid> -o pid= -o ppid= -o pgid= -o sess= -o lstart= -o uid= -o comm=`

`/bin/ps -g <pgid> -o pid= -o ppid= -o pgid= -o sess= -o lstart= -o uid= -o comm=`

Live probe rows had four-digit PIDs with leading spaces; PID 1 was `    1 ...`; the prior skeptic host row proves a full-width five-digit PID may begin in column one. The parser must therefore accept zero or more leading ASCII spaces before the exact canonical decimal PID and must retain strict single-LF/no-stderr/field separators and state-specific comm.

The `sess` field was `0` for PID 1, the orchestrator, brokers, tmux servers, and panes even though the local ps manual labels it session ID. It is not an usable execution-identity discriminator on this host and must be removed from required durable identity/acceptance claims. PID, PPID, PGID, exact `lstart`, uid, executable/comm state, binary digest, client/socket control, and closed state transitions remain enforceable.

## Failed-attempt lineage retained

No failed root was deleted. They are evidence of model refinement, not acceptance fixtures:

- `/private/tmp/aslite-t35-launch-probe.tVxMlMAn`: early exec/argv attempt; retrospective audit shows the executable was missing from `argv[0]`.
- `/private/tmp/aslite-t35-launch-probe.C0EXzb5y`: the gate correctly rejected a pretty-printed multi-line frame as extra bytes.
- `/private/tmp/aslite-t35-launch-probe.ejEELPqK`: working-copy lineage; an omitted executable `argv[0]` produced a terminal error that was initially misread as a tmux `-D` limitation.
- `/private/tmp/aslite-t35-launch-probe.WFHdMjHW`: alternate-config attempt repeated the same omitted-`argv[0]` error and therefore did not test `-D`.
- `/private/tmp/aslite-t35-launch-probe.KPz73eRb`: PTY-wrapper experiment reached `kill-server` but refused terminal proof when a stale socket remained; protected state was unchanged and no process remained.
- `/private/tmp/aslite-t35-launch-probe.eOWCua6Y`: PTY-wrapper campaign completed, but `comm=-q` exposed the argv model error; it is not the selected architecture.
- `/private/tmp/aslite-t35-launch-probe.RieAFcKs`: corrected direct same-PID v4 campaign passed before group/canary hardening.
- `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`: selected v5 evidence above.

## What remains unproved or bounded

1. The ordinary user-space OS-spawn-before-self-record interval is not atomic. The broker is no-auth and gate-closed, so missing/stopped readiness must quarantine rather than certify CLEAN. The replacement Plan must not turn a timeout plus absent record/socket into absence.
2. The primitive spawned the separate `-N` client directly and awaited it. The replacement state machine must give that client the same durable identity-before-release and terminal CAS fence so a delayed client cannot act after cleanup begins.
3. The harmless pane died under all tested server terminations despite owning a separate process group. This is encouraging host evidence, not proof that real Claude hooks/sub-agents can never escape. The live candidate rail must record the tmux pane/Claude identity and audit the full hook tree; unknown descendants quarantine/fail according to pre/post secret release.
4. `/bin/ps` plus `kill` remains a sampled check-then-act pair, and `lstart` has one-second resolution. Exact PID/start/uid/PGID checks, one destructive reaper, immediate revalidation, private paths/groups, and the non-malicious-same-uid model can bound accidental reuse risk; they cannot honestly claim pidfd-like atomic signaling. Independent review must either accept that bounded operational risk explicitly or require an identity-bearing supervisor/control primitive.
5. This no-auth campaign proves host mechanics only. API-key possession, real Claude response, hook event order, manual/automatic compaction, and real sub-agent acceptance remain later immutable-candidate gates; they cannot be inferred from this result.

## Plan-synthesis eligibility question

The exact primitive evidence now supports the architect's original no-auth gated broker and direct same-PID foreground tmux design, with these mandatory corrections: explicit executable `argv[0]`; no required SID/`sess`; separately fenced `-N` client; exact pane/group discovery; explicit validated stale-socket unlink only after process/group absence; one destructive reaper; and an honest bounded PID-reuse statement.

Acceptance and skeptic roles must inspect the exact v5 script/evidence and return PASS or FAIL on whether these corrections close the late-bind architecture enough to synthesize a replacement Plan. No T3.5 implementation, API-key Claude run, or G0 freeze is authorized by this Research record.

[tracked by](../tasks/pre-compact-multi-session.md)
