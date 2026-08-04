---
type: Context Note
title: >-
  Revision 3 R6 host probe R2 failure — whole-system model and final repair
  contract
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T02:04:06.140Z'
---
# Summary

The frozen R6 host-probe R2 candidate is rejected before execution. Product acceptance and the independent skeptic both returned exact-digest FAIL at confidence 0.99. R2 materially repaired the original registration, Node-to-tmux transition, expected-resource teardown, Git observer, H3 concurrency, strict receipt, and terminal-evidence failures, but its controller model still permits receipt reachability and failure-created survivors. The execution command remains closed.

This is the mandatory whole-system reorientation before a third intervention. The next edit is the final bounded generator-critic revision of the host probe. It must change the controller architecture, not add local assertions to the rejected model.

# Goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: produce one final statically safe H1-H5 host probe whose observer boundary is structural and whose failure controller reaches a bounded zero-survivor fixed point, then obtain independent exact-byte product and skeptic PASS before any execution; this serves the ultimate goal by preventing unsafe premise-gathering infrastructure from entering the revision-3 compaction-memory design.

# Domain model

- **Controller**: the sole writer, event recorder, and teardown owner for one retained run root. It may summarize facts but is not an acceptance authority.
- **Observer**: a pure H2 computation over one recursively frozen fresh-facts value. It has no controller, writer, path, index, filesystem, callback, closure, or action-receipt capability.
- **Creator surface**: any live capability that can still create another test process: a server, fixture `new-session` client, pane parent, requester/control before release, or a possible negative-query autostart.
- **Resource descriptor**: pre-created controller state for one known or bounded-possible process/socket/handle, with creation anchor, allowed transition, group, owner, recovery path, and terminal disposition.
- **Creation anchor**: evidence captured before PID reuse can occur: a create-only self-record, a live controller-owned child handle plus immediate stable identity, or a unique before/after audit binding to a private socket/marker/closed command. A current PID row alone is not an anchor.
- **Quiescence**: every creator surface is closed, aborted, or reaped so no dependent resource can appear after absence classification.
- **Fixed point**: after quiescence, repeated bounded harvest, audit, cleanup, and audit finds no known PID/group, private socket owner, run-root command, or public marker for two consecutive passes; all controller handles are closed.
- **Negative-branch recovery descriptor**: a descriptor registered before an absent-server query for the bounded possibility that `tmux -N` violates its premise and creates a new server on the exact private socket.
- **Primary evidence**: raw facts used to answer H1-H5. **Controller cleanup evidence** records containment only and can never repair or promote a failed primary assertion.
- **Frozen input**: canonical source root plus exact regular source/contract files, their digests, modes, owner, type, link count, and required clean feature worktree/HEAD.

# Components and interactions

The controller preflights frozen input and the pinned host/tool tuple before H1. It creates one private retained run root, takes protected/worktree baselines, and preplans every ordinary and bounded-possible resource before opening a creator surface. Direct Node gates self-record, block on a closed release channel, and may exec only the pinned tmux vector. Fixture pane/child processes self-record under a unique public marker and must also observe a pre-created controller abort capability so a child that starts after failure fencing terminates without waiting for a late acknowledgement.

On the success path, H1 produces raw action receipts and separately derives fresh PID/group/socket facts. The controller calls the observer as `H2(deepFrozenFacts)` only; the observer returns a plain value. After return, the controller writes observer evidence and hidden-receipt evidence separately. H3 observes two live requester identities/handles before designation. H4 demonstrates the declared server-first survivor and the descendant-first happy-path order. H5 proves exact absence, no-autostart, clean protected/worktree continuity, bounded evidence, and provenance separation.

Failure containment is one finite state machine: `PRIMARY -> FENCE -> DRAIN -> CHECK_1 -> CHECK_2 -> UNLINK -> TERMINAL`. The controller records every transition and a monotonic `creator_epoch`. Any primary exception transitions directly to FENCE and permanently suppresses all remaining primary actions.

`PRIMARY` has exactly eight possible executed controls, in this closed order: server PID observation; one combined sessions-plus-panes inventory action; H1 kill-server; H1 absent-server query; H3 owner action; H3 successor action; H4 server-after-descendants action; H5 absent-server query. H4 removes its already anchored server by fresh exact group signaling after the answerability action, not by another tmux client. Each absent query pre-registers one unused contingency recovery-kill descriptor. At most one absent-query anomaly can execute its contingency because the first anomaly ends PRIMARY. FENCE may also execute one recovery-kill descriptor for each still-live original private server. Given the point at which each server can remain live, no failure trace executes more than ten controls total. Every control, including fixture `new-session` and recovery kill, is a Node self-record/release gate with an anchored handle and closed vector; unused contingency descriptors finish as `not_created` only after CHECK_2.

Each negative query has an exact before tuple: full parsed audit, exact socket generation, query descriptor, release monotonic time, and a random 96-bit socket nonce appearing in the canonical socket path. The expected branch is exact code 1, null signal, empty stdout, exact no-server stderr, both EOFs, query PID/group absence, unchanged socket generation, and zero new audit rows containing the nonce. A code-0 decimal `#{pid}` result may anchor an unexpected server only when one fresh row has that exact PID, starts after release, has current UID, pinned tmux `comm`, `PGID=PID`, contains the exact nonce/socket token, is not a known control, and the exact owned socket generation is new. Missing, multiple, stale, or contradictory rows never authorize signaling. On any negative-query anomaly, FENCE executes exactly one pre-registered recovery vector `[TMUX, "-S", socket, "kill-server"]` through its anchored Node gate; this vector intentionally may create-and-kill a zero-session server and is the last tmux action for that socket. Its close/output/EOF/group-absence receipts are mandatory. No PID-query or further tmux recovery action is permitted, so recovery is finite rather than recursive.

Every fixture predeclares `abort.json`, `pane-abort-ack.json`, and `child-abort-ack.json` paths plus one nonce. FENCE creates `abort.json` once with mode `0600` and schema `{version:1, fixture, nonce, reason:"controller-fence", creator_epoch}`. Pane-parent checks it before spawning the child and during record wait; marked-child checks it before self-record, during acknowledgement wait, and throughout its lifetime. A role that sees abort writes its own create-only ack containing role, nonce, anchored PID/start/UID/PGID, and phase, then exits. Both roles also have a hard 15-second lifetime from process start and exit nonzero if neither normal teardown nor abort occurs. Fixture `new-session` is itself a self-recording Node gate, so its creation identity is anchored before release.

`FENCE` is numeric and monotonic. Within 5 seconds it: creates every fixture abort file; closes without release every unreleased gate channel; waits for released ordinary/fixture/recovery control handles and both EOFs; runs the finite pre-registered recovery-kill controls needed for still-live original or negative-branch servers; proves those control handles closed; and seals `fence_epoch = creator_epoch`. After sealing, the controller is forbidden to spawn, release, or invoke any tmux process. A later controller action is an internal contract violation and FAIL. OS-delayed records/handles do not permit another control; they reset DRAIN.

`DRAIN` runs for at most 40 rounds and 5 seconds, polling no faster than 50 ms. Every required `/bin/ps` observation gets three attempts inside 500 ms; no failed/partial/parser-ambiguous attempt may count as clean. Each round harvests create-only identity and abort-ack records, fresh PID and group observations, direct-handle close/EOF tuples, exact socket generations, and a full audit. It may signal only an anchored identity after a fresh exact PID/start/UID/PGID/allowed-command/group match; `inspectResource` may never adopt a row for signaling when the descriptor lacks a creation anchor. A pid-null indirect role is contained only by abort plus creator quiescence plus its hard lifetime, never by guessed PID. An audit-discovered negative server is signalable only by the exact decimal-PID anchor above; otherwise the recovery-kill receipt must contain it and the run remains unproven/FAIL until clean observation succeeds.

The normalized round inventory contains every descriptor state (`not_released`, `live_anchored`, `closed_absent`, or provisional `unseen`), record/ack digests, handle close+EOF facts, anchored PID/group absence, socket dev/inode/type/mode/UID generation, exact run-root/nonce audit-hit set, observer errors, and `creator_epoch`. Any new record or ack, handle transition, signal/action, socket-generation change, audit-hit change, or observation error resets the clean streak to zero. `unseen` is never terminal during DRAIN.

`CHECK_1` is entered only when FENCE is sealed; every creator handle is closed; every created anchored resource is exact absent; every fixture is either record+ack+absence or still provisional unseen; no audit hit contains the run root or nonce; socket generations are exact owned/unchanged; and a round has zero errors or mutations. It stores the normalized inventory digest. After a 100 ms no-action gap, `CHECK_2` performs an independently fresh audit, observations, record scan, handle scan, and socket scan. CHECK_2 passes only if it is also clean, the normalized digest is identical, and `creator_epoch` is unchanged. A difference returns to DRAIN with streak zero. After the two checks, a fixture may become `not_created` only when its client and server creator surfaces were closed before CHECK_1, abort existed throughout both checks, no role record/ack/audit hit appeared, and the two inventories agree.

Persistent observation failure cannot PASS or authorize unlink. All monotonic aborts and finite recovery kills still run; the controller waits until the later of the 15-second role lifetime and all direct-handle deadlines before returning FAIL with sockets retained. Thus parser failure can prevent proof but cannot disable the independent containment paths. Contradictory identity never authorizes signal or unlink.

`UNLINK` occurs only after CHECK_2 and may remove only an unchanged exact owned socket whose associated descriptors are terminal. `TERMINAL` performs another read-only process/record/socket/protected/worktree audit and mandatory readback. Any late record, process, handle, or socket generation makes the run FAIL and leaves evidence; it cannot be promoted. Final manifest and terminal evidence also recheck the canonical frozen source-root/file facts and the clean worktree predicate. PID/start/UID/PGID/allowed-command checks immediately before a signal remain bounded sampled TOCTOU, not atomic PID-safe signaling.

# External state and timing dependencies

- Installed Darwin arm64 host with exact pinned Node, tmux, ps, and git bytes; `process.execve` is required.
- Two private tmux sockets and one unpredictable private run root under `/private/tmp`.
- The exact feature worktree must be at HEAD `36c741a8173832d75d61a7ab138b5219c4415c66` with empty porcelain status, worktree diff, and cached diff before H1 and at all terminal checks.
- Real-user protected paths are read-only bounded snapshots; no Claude, auth, normal/global-home fallback, network, bundle, task, Plan, or repository mutation is permitted.
- Creation and cleanup are ordered. Absence before creator quiescence is provisional only. A late child/negative server is a reachable host outcome that the controller must contain before exit.
- Numeric containment bounds are part of the evidence: FENCE 5 seconds; DRAIN 40 rounds/5 seconds; three observation attempts/500 ms; 50 ms minimum drain poll; 100 ms between independent clean checks; fixture-role hard lifetime 15 seconds. Bound exhaustion is FAIL, never a weaker clean pass.
- The closed control budget is eight primary controls plus at most two actually executed FENCE recovery-kill controls; the first primary failure suppresses later primary actions. Combined session/pane inventory and direct anchored H4 server signaling keep every trace at or below ten controls.
- Process identity checks are sampled and same-UID/non-malicious-host scoped. Arbitrary unmarked same-UID escape and atomic signaling remain explicit nonclaims.

# Accepted R2 invariants to preserve

R2's pre-registration for expected resources, child create-only record/acknowledgement, exact same-stable Node-to-tmux transition, group-aware cleanup after leader exit, Git no-lock/nonmutating observer, simultaneous H3 rows/handles, closed action vocabulary, strict code/signal/stdout/stderr/EOF/absence receipts, dual source/contract digest gate, mandatory terminal/index/teardown readback, evidence bound, verdict algebra, scope, and nonclaims all survived both reviews.

# Rejected R2 model and exact repair requirements

1. **Pure H2 boundary.** Replace `H2(facts, events)` with a pure one-argument observer returning a plain result. The controller persists all events after return. No writer or file capability crosses the call.
2. **Frozen-root/file binding.** Preflight and terminal checks require canonical non-symlink source root mode `0700`, current UID, exact directory type; source/contract exact regular type, modes `0500`/`0400`, current UID, link count 1, exact paths and digests. Manifest records these facts.
3. **Clean worktree as a machine precondition.** Before H1 require empty status/diff/cached-diff receipts and bind their stable empty digests; H5 and terminal teardown recheck both clean state and continuity.
4. **Finite negative-query recovery.** Pre-register one exact recovery-kill descriptor per absent query, use the decimal-PID/socket-nonce tuple as the only unexpected-server signal anchor, execute at most one closed create-and-kill vector on anomaly, and permit no tmux action after FENCE seals. Recovery receipts, server/group absence, audit set, and socket generation are mandatory; audit-only detection cannot PASS.
5. **Monotonic abort and creator quiescence.** Every fixture has the exact abort/ack schema and lifetime above. Fixture client, pane parent, and child are an explicit creator DAG. A dependent role remains provisional unseen until abort is active, every upstream creator surface is closed, and both fresh clean checks agree.
6. **Bounded stable fixed point.** Implement the numeric FENCE/DRAIN/CHECK rules and normalized inventory exactly. New actions, records, acks, handle changes, socket generations, audit-hit changes, or observer errors reset the streak. No tmux control runs during DRAIN or checks.
7. **Observer-failure-independent containment.** Apply exact retries, anchored direct handles, finite recovery kills, monotonic abort, hard role lifetimes, and controller wait deadlines. Persistent failure retains sockets and FAILs after containment deadlines; it never counts clean or enables PASS.
8. **No unanchored PID adoption.** All direct clients, including fixture and recovery controls, self-record as Node before release. A current PID row alone never authorizes signaling. Indirect roles require their create-only identity; an unexpected server requires the exact decimal-PID query anchor. Exited handles and pid-null descriptors cannot be rebound.

All eight changes remain controller/host safety. They must not add lifecycle states, CAS, leases, scheduler matrices, reconciliation policy, schema/attestation/verdict authority, Claude, auth, network, or production acceptance. The script remains exactly H1-H5 and at most 800 effective nonblank/non-`//` lines. If the repaired architecture cannot meet that bound without weakening an invariant, the builder returns FAIL unfrozen.

# Evidence and gate

- Product R2 FAIL: `context-notes/precompact-v3-t35-r6-host-probe-script-acceptance-r2@sha256:aeb48a911249d9342ea7043c8900fcadb7f3fc1b4562e59e97e55e29790a56ec`.
- Skeptic R2 FAIL: `context-notes/precompact-v3-t35-r6-host-probe-script-skeptic-r2@sha256:bf0ef260b52a04e20a76cb59006e0fe4a184d07b2a6a2f91fe2f34921662a891`.
- Rejected source: `host-probe.mjs@sha256:757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c`.
- Rejected contract: `contract.md@sha256:784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a`.

The R2 bytes remain frozen rejected evidence and must never run. A new digest must repeat both exact independent static reviews. Only dual PASS opens one exact no-auth H1-H5 execution, followed by independent retained-evidence audit before any repaired Plan or production implementation.
