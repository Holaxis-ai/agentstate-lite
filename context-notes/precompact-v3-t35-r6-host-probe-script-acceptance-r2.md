---
type: Context Note
title: Revision 3 T3.5 R6 repaired host-probe static acceptance R2
actor: codex-precompact-v3-r6-acceptance-r2
timestamp: '2026-08-04T01:45:53.764Z'
---
# Summary

Status: complete.

Verdict: **FAIL — EXECUTION NOT ELIGIBLE**. Confidence: **0.99**.

The repaired candidate closes the concrete R1 preregistration, expected-resource teardown, Node-to-tmux transition, group-absence, Git-observer, simultaneous-requester, strict-action, and terminal-file defects. It still cannot be approved for execution. The H2 “observer” receives a mutable EventWriter whose root and index make prior action-receipt files reachable while the evidence asserts the opposite; preflight does not validate the frozen source-root mode/type/owner promised by the contract; and a failed absent-socket/no-autostart assertion can create an unplanned tmux server that the final audit reports but never adopts or reaps. The source also does not require the feature worktree's initial status/diffs to be clean, so a dirty-but-unchanged worktree can machine-PASS despite the frozen execution precondition supplied for this review.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently decide whether the exact repaired R6 H1-H5 host-probe bytes are safe and evidentially sufficient to execute; this serves the ultimate goal by preventing a premise-gathering rail from manufacturing isolation evidence, accepting frozen-input drift, or leaving a capability alive on the negative branch it is meant to test.

## Exact reviewed inputs and isolation

I read in full and verified the single-version histories of:

- strict boundary synthesis `context-notes/precompact-v3-t35-r6-host-probe-boundary-synthesis@sha256:61ccbe83a2ce74e859ee18e714d04edf8297edf1db9f7cc9e2947897b1e24c5e`; and
- prior R1 acceptance `context-notes/precompact-v3-t35-r6-host-probe-script-acceptance@sha256:d5309ef9c566fcbddfd48ca07a5a12af86657c3330ff12bfc51ea6f8d9d193fe`.

I did not inspect or communicate with the skeptic. I did not invoke the candidate's `--run` or any child mode, tmux, Claude, auth, network, or tests. I did not edit the candidate, source root, repository, feature worktree, task, Plan, or implementation.

Frozen static facts:

- `/private/tmp/aslite-t35-r6-host-probe.v2/host-probe.mjs` = `sha256:757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c`, mode `0500`, 62,133 bytes, 851 physical lines, exactly 789 nonblank/non-`//`-comment lines;
- `/private/tmp/aslite-t35-r6-host-probe.v2/contract.md` = `sha256:784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a`, mode `0400`, 8,201 bytes, 58 physical lines;
- source root mode `0700`; and
- `node --check` exits 0.

Using explicit `git --no-optional-locks -c core.fsmonitor=false` observations, the feature worktree was clean at `36c741a8173832d75d61a7ab138b5219c4415c66`: porcelain status, worktree diff, and cached diff were empty. Those reviewer observations did not execute candidate code.

The source has exactly five named `H1`-`H5` functions, stays below the 800-effective-line guard, contains no lifecycle/CAS/lease/scheduler duplicate authority, and contains no direct network or Claude invocation.

## Blocking issues

### 1. H2's action results remain reachable from its parameters

H1 correctly creates a recursively frozen narrow fact object at line 521 and keeps the explicit hidden receipts in `ctx.controllerHidden` at line 519. But `H2` is declared as `H2(facts, events)` at line 527 and is called with the controller's live `ctx.events` object at line 806. EventWriter exposes both `root` and `index` (lines 194-209); after H1, that index contains the action-receipt filenames and the root locates their retained JSON bytes. H2 therefore receives mutable controller state from which `observe-server-receipt` and `kill-server-receipt` are reachable through its parameters.

The event written at line 534 says `action_receipt_reachable_from_parameters:false`. That assertion is false by construction. The current H2 body happens not to read the files, but the contract requires structural discarded-result separation, not an audited convention that a function with access did not use it.

Minimum repair: make H2 a pure observer with exactly one parameter, the deeply frozen fresh-facts object, and have it return a plain verdict/evidence value. The controller must write all `controller_hidden` and observer events only after H2 returns. No EventWriter, path, root, index, closure over controller state, or filesystem capability may cross the observer boundary.

### 2. Frozen source-root drift is neither rejected nor evidenced

The contract freezes the source root at mode `0700` and says the controller refuses frozen-mode drift. `preflight` hashes both files and checks only source and contract file modes at lines 659-665. It never `lstat`s `SOURCE_ROOT`, verifies it is a real directory owned by the expected UID, checks mode `0700`, or records that stat in the manifest at lines 789-798.

The exact source and contract files can therefore retain their reviewed digests and `0500`/`0400` modes while the source root changes to `0755`; the machine can still PASS. This directly fails the requested root/source/contract mode-drift gate and the contract's own frozen-mode claim.

Minimum repair: in preflight, use `lstat` plus `realpath` to require `SOURCE_ROOT` is the exact non-symlink directory, mode `0700`, owned by the executing UID, and contains the two exact reviewed regular files. Record its complete stat in the manifest and recheck it in the terminal gate before PASS.

### 3. The no-autostart negative branch has no recovery descriptor

The two absent-server queries are the behavior under test: H1 releases one at lines 513-518 and H5 releases another at lines 632-637. `action()` preregisters only the query client's original Node/tmux PID/group. If `tmux -N` violates the premise and forks or daemonizes a new server into a separate PID/PGID, that server is not one of `ctx.resources`.

Teardown harvests and signals only `ctx.resources` at lines 680-745. Its final process audit at lines 747-750 can report an extra run-root/marker process, but after recording `final process audit survivors` it does not adopt or signal the hit; it proceeds only to guarded socket disposition. Thus the exact negative outcome H1/H5 is meant to detect can leave a live private tmux server after the run. If the daemon's rendered command omits the run-root string, the final audit predicate may not even select it; a rebound socket is rejected but the process is still not reaped.

The prior pinned `-N` fact cannot discharge this safety obligation: the boundary explicitly requires a fresh regression of this action, and a probe must remain safe when the answer is no.

Minimum repair: preregister a bounded possible-autostart recovery descriptor before each absent query. Bind it to the exact initially absent/private socket, same UID, closed tmux executable, and a fresh before/after process observation. If an unexpected server appears, teardown must safely acquire its exact PID/start/UID/PGID from the private socket/process evidence, reap it, prove its group absent, and only then unlink the unchanged owned socket. If that cannot be done inside the host-only envelope, the probe remains blocked from execution.

### 4. The required clean worktree is not a machine precondition

The repaired Git observer is read-only and records strong metadata continuity, but `worktreeSnapshot` at lines 466-485 asserts only the required HEAD. It never asserts that initial `status`, `diff`, and `cached_diff` stdout are empty. Before/after hashes therefore accept any dirty baseline as long as it remains unchanged.

The worktree was clean during this exact static review, but the execution command can run later after uncommitted drift and still machine-PASS. The supplied execution boundary says the exact worktree must remain clean at the required HEAD; current reviewer observation is not a durable machine gate.

Minimum repair: before `mandatoryStarted`, require empty porcelain status, worktree diff, and cached diff on the read-only observer receipts, and include their expected empty digests in the manifest. Recheck the same clean predicate in H5 and terminal teardown, in addition to byte-for-byte before/after continuity.

## R1 attacks that now survive

- **Expected fixture partial creation:** pane, marked child, and fixture-client descriptors are installed before dispatch (lines 383-395). The child self-records and waits for a controller acknowledgment; teardown harvests create-only records and can use a marker/mode-bound process audit.
- **Node-to-tmux transition:** each gate is registered before spawn/release, allowed commands are closed, stable PID/start/UID/PGID fields survive the comm transition, and `adoptCurrent` updates the identity both in the live sample and teardown paths.
- **Group/client/handle cleanup:** resources are ordered child → pane → fixture client/requester/control → server; `inspectResource` reads both PID and group even when the leader is absent; TERM, conditional KILL, exact absence, and gate-handle close are retained; sockets require every associated planned resource resolved.
- **Git nonmutation:** `GIT_OPTIONAL_LOCKS=0`, `--no-optional-locks`, disabled fsmonitor/untracked-cache/preload-index/submodule recursion/external diff, `--no-textconv`, and before/after gitdir metadata digests close the R1 mutation path.
- **H3 simultaneity:** both requester PID/group observations and both still-open handles are captured in one concurrent evidence object before designation; former-owner absence precedes successor release.
- **Strict receipts and terminal gates:** closed actions require exact code/signal/stdout/stderr/EOF/absence; both input digests are required; manifest, H5 and terminal snapshots, teardown receipt, event index, bounded evidence, and summary are create-only/read back; teardown or original failure cannot be upgraded to PASS.
- **Scope and nonclaims:** the action vocabulary remains closed, no auth/network/Claude fallback exists, primary/controller provenance stays distinct, and the source makes no lease/CAS/reconciliation/arbitrary-descendant/live-compaction claim.

These survived attacks are material progress and should be preserved. They cannot cure the false observer-isolation receipt, source-root drift acceptance, unplanned negative-branch server survivor, or clean-baseline gap.

## Decision

**FAIL. Execution eligibility: NO.** Do not substitute the reviewed contract digest into the execution template and do not run the exact command for source `sha256:757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c` / contract `sha256:784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a`.

Freeze repaired bytes only after all four blockers are closed, then repeat independent acceptance and skeptic static review. Confidence: **0.99**.

[tracked by](../tasks/pre-compact-multi-session.md)
