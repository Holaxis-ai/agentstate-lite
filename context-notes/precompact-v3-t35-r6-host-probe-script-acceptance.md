---
type: Context Note
title: Revision 3 T3.5 R6 frozen host-probe static acceptance
actor: codex-precompact-v3-t35-r6-host-probe-script-acceptance
timestamp: '2026-08-04T01:05:49.015Z'
---
# Summary

Status: complete.

Verdict: **FAIL — DO NOT EXECUTE**. Confidence: **0.99**.

The frozen strict host-only probe is within the corrected five-question scope and its ordinary-path H1-H5 construction is substantially aligned with the contract. It nevertheless fails the static safety gate. A real tmux server, pane, detached child, or released control can exist before the controller has registered enough identity and socket state for top-level teardown to discover and reap it. The teardown then also skips live groups whose recorded leader is absent or whose same-PID Node principal has execed tmux but has not yet had its stored `comm` upgraded. These are load-bearing survivor paths, not caveats. The source must not be executed.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: accept only a frozen five-question host probe whose failures are as safe and auditable as its success path; this serves the ultimate goal by preventing a premise-gathering experiment from leaving hidden host capabilities or mutating the repository it is meant only to observe.

## Exact review boundary and static facts

I read in full and verified the single-version histories of:

- boundary synthesis `context-notes/precompact-v3-t35-r6-host-probe-boundary-synthesis@sha256:61ccbe83a2ce74e859ee18e714d04edf8297edf1db9f7cc9e2947897b1e24c5e`;
- boundary acceptance `research/precompact-v3-t35-r6-probe-boundary-acceptance@sha256:a61a3e5a73e1207e86a0c884973e4cb0aff2a4d1f71593b0101a5d9b83747816`;
- boundary architect `research/precompact-v3-t35-r6-probe-boundary-architect@sha256:046428073ac749e3c9e76db066d44195c07efac0c8acc4013f54be99c45e2420`; and
- boundary skeptic `research/precompact-v3-t35-r6-probe-boundary-skeptic@sha256:20efac219da29eef5623aab82a75fab91be62913a6ddd3ec35f48b0d9162066a`.

I did not read the skeptic's new script-review note. I did not execute the probe or invoke tmux, Claude, auth, or network. I made no script or contract edit.

Frozen bytes checked:

- `/private/tmp/aslite-t35-r6-host-probe.v2/host-probe.mjs` = `sha256:6108e6102f1257274bcc4cd9dd82c38b9490806fed55de8f1a7f71f716bf823e`, mode `0500`, 47,364 bytes, 796 physical lines, 747 nonblank/non-`//`-comment lines;
- `/private/tmp/aslite-t35-r6-host-probe.v2/contract.md` = `sha256:2f83246e7730b5a2fb153e65ab8776418624a0a3d9ab6b4758a028cb3aed00be`, mode `0400`, 6,704 bytes, 58 physical lines;
- source root mode `0700`; and
- `node --check` exits 0.

The source has exactly five named `H1`-`H5` functions and stays below the synthesis limit of 800 nonblank/noncomment lines. It contains no network or Claude invocation and constructs child environments from a no-auth allowlist.

## Load-bearing blockers

### 1. Detached-child and pane creation precedes cleanup registration

`fixtureClient` dispatches the real `tmux new-session` at lines 392-398. That action can create the pane parent and its detached/new-PGID child. The controller does not register the pane and child identities until line 409, does not register the public marker until line 410, and does not attach the fixture to the server until line 414. Every failure at lines 399-408 — nonzero/timeout receipt, missing-record timeout, JSON read/parse error, marker/order assertion, `ps` failure, identity mismatch, or PGID assertion — therefore enters top-level teardown without those principals.

The deeper edge is explicit at lines 276-283: the pane parent spawns and unreferences the detached child before it waits for the child record and before it writes its own pane record. If the pane-parent path fails after the child record exists but before the pane record/controller registration, server teardown kills the pane/server but cannot discover the detached child. This is exactly the topology H4 is intended to demonstrate: server death is not child absence.

Top-level teardown confirms the gap. Its per-server fallback list at line 696 contains only `server.fixture?.pane` and `server.fixture?.child`. An incompletely registered fixture supplies neither. It never harvests the controller-known create-only record paths or marker from the private root. A detached marked child can survive while the run reports ordinary `FAIL` with no teardown error.

Minimum repair: install a controller cleanup descriptor before dispatching the fixture, containing the exact server, socket, session, marker, pane-record path, and child-record path. Teardown must harvest and strictly validate any create-only record that exists even if ordinary registration never completed, add its exact PID/PGID identity to the cleanup set, reap descendants before pane/server, and retain raw discovery/signal/absence evidence. A missing child record is safe only if the child role is guaranteed to exit on self-record failure; that guarantee and outcome must be made explicit and auditable.

### 2. Released Node-to-tmux principals can escape the recorded identity

`releaseGate` writes `RELEASE` at lines 319-324. After `process.execve`, the same PID/start/uid/PGID has `comm=tmux`, but the stored identity still says Node until lines 350-355. For a server, the update is even later in `startServer` at lines 368-371. A release-pipe partial/error, `ps` failure, exec-observation timeout, close timeout, or other assertion after release can therefore reach teardown during the allowed exec transition with the old identity.

Teardown signals a handled process only when `exactIdentity` including `comm` matches the stored row (lines 665-678), and applies the same test before group TERM/KILL (lines 681-692). It consequently refuses to signal the real same-PID tmux process in this failure window. `startServer` also does not append `ctx.servers` until line 376, after exec and socket validation, so its socket path/initial identity may be unavailable to socket teardown. A server/control and socket can survive.

Minimum repair: pre-register every gate and server socket before release, model only the reviewed Node-to-tmux exec transition in that test descriptor, and update the retained current identity immediately when a matching tmux sample is seen rather than after close/absence. Failure cleanup must safely recognize the same PID/start/uid/PGID with either the predeclared Node or exact tmux `comm` during that one transition; ambiguity must be a teardown failure with no unsafe unlink, never a silent skip.

### 3. Teardown does not reap or even audit every registered group before unlink

Even for normally registered identities, group TERM/KILL is conditional on the recorded leader PID still being exact-live (lines 681-692). If the leader is absent but another test-owned process remains in its PGID, teardown skips the group instead of inspecting it. It performs no final exact-absence pass over all `ctx.identities` and handles. The later wait at lines 694-703 covers only each server plus its optional pane/child, not action controls, requester groups, or fixture-client groups.

The socket can then be unlinked at lines 704-708 without proving all known clients/requesters/groups for that server absent. The normal H5 helper has the same narrow creator list at lines 579-580. This violates descendant/client absence before socket removal and can leave a group survivor that is neither reaped nor reported.

Minimum repair: teardown must inventory every registered principal and every exact group, inspect `ps -g` even when the leader has exited, and use a bounded descendant/client-first sequence. It must await and record exact PID plus full-group absence for every server-associated pane, detached child, requester, action control, fixture client, and server before unlinking the exact unchanged socket. If safe identity proof is unavailable, it must retain the socket and report teardown failure.

### 4. The claimed read-only worktree observation can mutate Git metadata

`worktreeSnapshot` runs exact `git status`/`diff` commands at lines 454-468, but `cleanEnv` does not set `GIT_OPTIONAL_LOCKS=0` and the command does not use `--no-optional-locks`. `git status` is allowed to refresh and write index metadata. The before snapshot itself can therefore mutate the linked repository outside the run root, and the later comparison checks only HEAD/tree/status/diff output, not Git index/config bytes. The script can emit `PASS` after a forbidden repository metadata mutation.

The environment also does not disable a repository-configured fsmonitor, and the diff commands omit `--no-textconv`; those configuration-driven subprocess surfaces undermine the contract's unconditional no-shell/no-network statement even though the source has no direct network call.

Minimum repair: run all Git observations with optional locks disabled (`GIT_OPTIONAL_LOCKS=0` or exact equivalent), disable configured fsmonitor/external execution for this read-only observation, add `--no-textconv` alongside `--no-ext-diff`, and bind/audit the relevant gitdir/index/config bytes if the contract continues to claim repository nonmutation.

### 5. H2 does not structurally withhold the discarded results

H1 stores both supposedly hidden action receipts in `ctx.h2` at line 502. `H2(ctx)` at line 508 receives that same object, so the observer has direct access to `server_receipt_hidden` and `kill_receipt_hidden` while its event at line 517 states `action_results_supplied:false`. The current function happens to read only the fresh fields, but the contract says the H2 observer receives no result; source-level nonuse is not the requested discarded-result separation.

Minimum repair: retain the hidden receipts only in a controller-side proof record and call a separate observer with a newly constructed/deep-frozen input containing only post-client-absence PID/group/socket facts. The H2 predicate and evidence must be computed from that narrowed object.

### 6. Machine PASS can omit mandatory teardown evidence or accept non-strict action receipts

The controller swallows failure to create `evidence/controller-teardown.json` at line 716 without appending a teardown error. Thus all H booleans can be true and machine `PASS` can be computed at line 769 despite a missing mandatory teardown record.

Successful server/session/pane actions generally assert exit code and expected stdout but do not require empty stderr, both EOF flags, null signal, or the other strict receipt fields promised by H1. `kill-server` checks only exit code. A raw receipt inconsistent with the contract can therefore still set H1 true; a later human might reject it, but the machine summary would already be a false PASS.

Minimum repair: make teardown-record creation mandatory and fail closed on its write error; retain raw controller discovery/signal/wait/unlink receipts rather than only an `errors` string array. Centralize strict action validation so a PASS requires the expected exit/signal/stdout/stderr/EOF/effect tuple for every closed action and rejects `timed_out:true` anywhere relevant.

## What survives static review

The corrected host-only scope is honored: there is no scratch CAS/lease/scheduler authority, the action vocabulary is closed, cleanup controls use explicit tmux `argv[0]` and `-N`, H3's ordinary path uses two real gated requester processes without a lease claim, H4's ordinary path has both server-first and descendant-first branches, H5 distinguishes primary from controller cleanup, the nonclaims are appropriately narrow, and a primary failure cannot be upgraded merely because the summary's final cleanup is clean.

Those properties should be preserved in the repair. They do not offset the survivor, mutation, observer-separation, and false-PASS paths above.

## Verdict

**FAIL — DO NOT EXECUTE** the exact script `sha256:6108e6102f1257274bcc4cd9dd82c38b9490806fed55de8f1a7f71f716bf823e` under contract `sha256:2f83246e7730b5a2fb153e65ab8776418624a0a3d9ab6b4758a028cb3aed00be`.

The minimum repair is not a policy expansion: it is a test-controller safety registry installed before every creation/release, failure-path record harvesting, exact transition-aware and group-complete descendant-first teardown with raw receipts, truly read-only Git observation, structural H2 input separation, and fail-closed strict evidence validation. Freeze new bytes and repeat independent acceptance plus skeptic static review before any execution.

Confidence: **0.99**.

[tracked by](../tasks/pre-compact-multi-session.md)
