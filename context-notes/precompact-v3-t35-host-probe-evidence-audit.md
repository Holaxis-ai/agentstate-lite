---
type: Context Note
title: Revision 3 T3.5 selected host-probe evidence audit
actor: codex-precompact-v3-probe-auditor
timestamp: '2026-08-03T23:24:22Z'
---
# Summary

Status: **complete**.

Verdict: **PASS** for the deliberately narrow question: the selected v5 no-auth host campaign is sufficiently attributable and internally consistent to feed replacement-Plan synthesis. It does **not** approve the replacement architecture, authorize implementation, release auth, or satisfy the later immutable-candidate/live-compaction gates.

Confidence: **0.94** in the empirical host-mechanics findings and **0.90** in this scope-calibrated PASS. Confidence is lower than the probe author's because several useful claims are construction-reviewed or externally asserted rather than independently recomputable from retained raw bytes.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether a third party can distinguish a genuine selected v5 host-mechanics receipt from a summary-only assertion and safely use only the survived facts in a replacement Plan; this serves the ultimate goal by containing unverified process-lifecycle claims before they can become premises for auth-bearing acceptance work.

## Exact audited inputs

- Host-probe Research: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Selected private root: `/private/tmp/aslite-t35-launch-probe.6p0HMoqJ`.
- Probe script: `launch-probe.mjs@sha256:c78ee01ee720c6c5e9b3a7fc943233d601c91634b12908e5705cebc420eb2448`.
- Evidence: `evidence.json@sha256:063280001ce146eec5f3a8f6ba83b5edec45076199ef7df6115726a7215424d9`.
- Summary: `summary.json@sha256:39058982be79a6795a3091d7cc6e21b525a02019d2d4570f7eeba64f1a9f39cc`.
- Protected snapshots: before and after each `sha256:567112cd902f09bdd45a3ef8f3ae100a4683e67d212e6256472546f5a30e8a95`; byte comparison passed.
- Architecture: `research/precompact-v3-t35-launch-reaper-architect@sha256:60018b553f55944a78f1631718e0f5c225eef4c72d85a423b76234acc4a19c43`.
- Acceptance contract: `research/precompact-v3-t35-launch-reaper-acceptance@sha256:4e05e1e5f39a1fe75d6caf5ad494092587ac490a73c61f4953f02e8d68a012ce`.
- Skeptic model: `research/precompact-v3-t35-launch-reaper-skeptic@sha256:ceba46d2a33f1d1bc4782077a546e043af8d7163ed70d807233c88e8cab07143`.
- Feature worktree: exact HEAD `36c741a8173832d75d61a7ab138b5219c4415c66`; a current read-only check found that exact worktree clean. Cleanliness at campaign time is asserted by the Research record, not retained inside the selected evidence JSON.

The selected root is 0700, all retained subdirectories are 0700, the script is 0700, every retained JSON file is 0600, no symlink or socket remains, JSON parsing passed, and `node --check` passed. File birth/modification ordering places the immutable script before the case records and the evidence/summary after them.

## Empirically survived

1. **Exact exec transition.** In all three live cases, independently parsing the retained `/bin/ps` bytes showed the same PID, PPID, PGID, one-second `lstart`, and uid before release, after exec, and after bind. `comm` changed only from the pinned Node realpath to the pinned tmux realpath. The server's own `#{pid}` equaled the broker PID. The script source uses the corrected complete argv vector: `process.execve(tmuxBin, [tmuxBin, "-D", "-f", "/dev/null", "-S", socket], env)`. This is strong exact-tuple evidence for the argv0 correction, though it is source-plus-outcome evidence rather than an independent kernel argv capture.
2. **`sess=0` is unusable.** PID 1, the orchestrator, all brokers/servers, and all panes retained `sess=0`; removing `sess` from durable identity is supported. PID/start/PGID/uid/state-specific comm remain the observed discriminators.
3. **Gate/control behavior.** The no-auth detached broker was `PGID=PID`, recorded itself before READY, had no owned socket before release, exited on control EOF with no socket, closed FD 3 before exec, and produced `EPIPE` for every recorded late write.
4. **`-D` and empty foreground server.** Exact inline `-D ... new-session` exited 1 with tmux usage. Exact commandless `-D -f /dev/null -S <socket>` bound a private 0600 socket, stayed at the broker identity, answered its PID, and returned an empty successful session listing. The inline case does not retain a time-local socket stat, but the source contains no inline-socket cleanup and the retained root has no such socket.
5. **Separate `-N` client.** An exact no-auth `-N -S <live-socket> new-session` created the harmless pane in every case. After primary cleanup and socket absence, the same `-N ... new-session` exited 1 with `No such file or directory`, created no socket, and was followed by another harmless failing `-N ... kill-server`. This is exact-tuple evidence that the selected late client does not autostart a replacement server.
6. **Process topology and group selection.** While live, exact `ps -g` selected a one-row server group with `PGID=server PID` and a distinct one-row pane group with `PGID=pane PID`. The evidence therefore rejects the false server-group-contains-pane assumption. Both exact group queries exited 1 with empty stdout/stderr after cleanup.
7. **Primary pane teardown, not fallback cleanup.** `kill-server`, socket-unlink then server-group TERM, and socket-unlink then server-group KILL each removed the server and the separate-group pane before any fallback PID signal. All three `broker_survived_initial_cleanup`, `server_survived_initial_cleanup`, and `pane_survived_initial_cleanup` flags are false, and the retained exact PID/group absence receipts pass. The result is not circularly manufactured by the fallback blocks.
8. **Stale-socket rule.** `kill-server` removed server and pane but left a validated owned 0600 socket. The script checked process absence first, validated type/uid/mode, then unlinked it. The unlink-before-TERM/KILL cases separately prove that socket absence while PID/pane are live is not process proof.
9. **Protected-state continuity.** The selected before/after snapshots are byte-identical and include metadata/digests for the enumerated Claude, Codex, OpenCode, AgentState credential, hook, and handoff locations. Fresh per-case HOME/TMP roots and explicit sanitized environments are visible in source; broker and pane records contain no supported auth variable.
10. **Residual-process check.** Exact per-case PID and group absence is retained. A fresh independent read-only `/bin/ps -axo pid=,ppid=,pgid=,sess=,stat=,etime=,command=` audit found zero current rows matching the selected root or `tmux -D`.

## Reasoned or construction-reviewed, not independently empirical

- The exact argv0 correction is evidenced by the immutable call site plus successful option behavior and identity transition; the selected v5 JSON does not retain a kernel-level argv vector. The two sleep microprobes are described in the Research record but are not artifacts in the selected root.
- Canary transport and non-serialization are principally construction-reviewed. The dynamic plaintext canaries and raw before/after `psAll` bytes were intentionally not retained; only digests, topology hashes, and booleans remain. The `psAll` command also captures `comm`, not full argv, so `all_canaries_absent_from_process_lists` is not an argv-leak oracle. The source does show canary generation, anonymous-pipe framing, post-frame server environment insertion, digest-only pane recording, and a recursive regular-file scan of the selected root.
- Protected snapshots prove equality for the listed metadata targets, not every possible global path. The evidence schema omits the resolved `realHome` argument and the exact invocation receipt, so binding those snapshots to the actual home relies on the Research record and their recognizable target set.
- The Research record's post-campaign independent process audit is not retained as raw evidence. The current independent audit is useful residual-state evidence but cannot recreate the historical instant. Per-case PID/group absence remains the load-bearing retained oracle.
- The feature-worktree clean claim is external to the selected evidence JSON. The exact worktree is still present at the named SHA and was clean when checked during this audit, but that later check does not prove campaign-time state.

## Issues and required Plan treatment

1. **Weak generated summary oracle, survived by raw evidence.** `all_same_pid_after_exec` uses substring inclusion and does not itself parse/compare PPID, PGID, `lstart`, uid, or exact comm. An independent strict parse of the retained raw rows passed all those comparisons. A replacement authority must use a validated strict parser rather than copy this summary expression.
2. **No standalone validated evidence schema.** The `/v5` strings are version labels; no JSON Schema, validator identity, or validation receipt is retained. The replacement Plan may consume the named raw fields as research evidence but must specify one executable schema/authority before these shapes become acceptance records.
3. **Canary-absence booleans are not recomputable.** Because plaintext canaries and raw topology captures are absent, a third party can audit the code path but cannot recompute the negative scan from the selected files. A future harmless probe should retain a public nonsecret marker or a verifier-issued commitment plus raw bounded captures, and should inspect exact argv separately if argv privacy is claimed.
4. **No retained all-process final transcript.** Do not cite the Research record's historical post-campaign scan as if it were inside `evidence.json`; cite exact per-case PID/group absence, and require the future campaign authority to persist its final bounded all-process audit.
5. **Scope must remain narrow.** This campaign does not prove the durable broker/client CAS state machine, separately gated client identity-before-release, delayed-bind/startup races, one exclusive recoverable destructive reaper, PID-reuse-safe signaling, real Claude/hook/sub-agent containment, auth possession, or live manual/automatic compaction. Those remain mandatory design/implementation/acceptance gates. `ps` plus `kill` remains sampled check-then-act with one-second `lstart`; the Plan must state the bounded non-malicious-same-uid risk or choose a stronger primitive.

## Blockers

No load-bearing blocker was found for using this exact v5 artifact as **research input to replacement-Plan synthesis**. The five issues above are blockers to promoting it into a production acceptance oracle or treating it as architecture approval. In particular, any replacement Plan that converts the canary booleans, external final scan, or sampled PID signaling into stronger empirical guarantees than described here should fail review.

## Conclusion

The selected root is distinguishable from a summary-only claim: exact immutable code, case-local self-records, full single-PID/group receipts, termination receipts, socket facts, toolchain identities, protected snapshots, and creation ordering survive independent inspection. The honest boundary is equally clear: some negative/privacy and post-campaign claims are construction-reviewed or external, not reproducible from retained raw bytes. On that boundary, verdict **PASS for Plan input; not approved for implementation or live acceptance**.

[tracked by](../tasks/pre-compact-multi-session.md)
