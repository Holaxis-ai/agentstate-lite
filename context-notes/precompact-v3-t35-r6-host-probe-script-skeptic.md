---
type: Context Note
title: Revision 3 T3.5 R6 strict host-probe skeptic static review
actor: codex-precompact-v3-t35-r6-host-probe-script-skeptic
timestamp: '2026-08-04T01:05:31.169Z'
---
# Summary

Status: complete static review; probe not executed.

Verdict: **FAIL**. Confidence: **0.99**.

The frozen probe is syntax-valid, stays inside the corrected five-question policy boundary on its intended happy path, and contains strong raw causal checks. It is nevertheless unsafe to execute because reachable assertion/timeout windows can strand test-owned processes that its controller never learns or later refuses to signal. The two decisive classes are:

1. a pane may create the detached/new-PGID marked child before `fixtureClient` has registered any fixture identity or assigned `server.fixture`; a timeout, parse error, or assertion in that interval leaves teardown with neither the child identity nor its marker plan; and
2. a gate may have successfully exec-replaced pinned Node with tmux when a `ps`, close, or event assertion fails, but teardown compares only the stale pre-exec Node `comm`, refuses the now-tmux PID/group, and can then unlink the socket without proving that unresolved control absent.

A test-owned detached child, foreground tmux server, or control client can therefore survive a failed run. Under the frozen script-review rule this is FAIL even though the complete happy path may clean correctly. No execution is authorized.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: determine whether the exact frozen host probe is safe and causally complete enough to execute without widening the five-question boundary; this serves the ultimate goal by refusing empirical evidence whose own failure paths can leak capabilities or misstate information isolation.

## Exact reviewed inputs and static receipts

Read in full through `./aslite`:

- boundary synthesis `context-notes/precompact-v3-t35-r6-host-probe-boundary-synthesis@sha256:61ccbe83a2ce74e859ee18e714d04edf8297edf1db9f7cc9e2947897b1e24c5e`;
- skeptic boundary `research/precompact-v3-t35-r6-probe-boundary-skeptic@sha256:20efac219da29eef5623aab82a75fab91be62913a6ddd3ec35f48b0d9162066a`;
- architecture boundary `research/precompact-v3-t35-r6-probe-boundary-architect@sha256:046428073ac749e3c9e76db066d44195c07efac0c8acc4013f54be99c45e2420`; and
- acceptance boundary `research/precompact-v3-t35-r6-probe-boundary-acceptance@sha256:a61a3e5a73e1207e86a0c884973e4cb0aff2a4d1f71593b0101a5d9b83747816`.

Reviewed frozen files in full, without executing them:

- `/private/tmp/aslite-t35-r6-host-probe.v2/host-probe.mjs@sha256:6108e6102f1257274bcc4cd9dd82c38b9490806fed55de8f1a7f71f716bf823e`, regular file, mode `0500`, one hard link, 47,364 bytes, 796 physical lines, 747 nonblank/non-comment lines;
- `/private/tmp/aslite-t35-r6-host-probe.v2/contract.md@sha256:2f83246e7730b5a2fb153e65ab8776418624a0a3d9ab6b4758a028cb3aed00be`, regular file, mode `0400`, one hard link, 6,704 bytes, 58 physical lines; and
- source root `/private/tmp/aslite-t35-r6-host-probe.v2`, directory, mode `0700`, owner uid 501.

`node --check` exited 0. The script satisfies the frozen construction size guard: exactly H1-H5, 796 physical / 747 effective script lines, 58 contract lines, two servers/panes/children, two requesters, and exactly ten maximum controls. I did not read the parallel acceptance script-review note, edit either file, execute the probe, invoke tmux or Claude, inspect auth, or use network.

## Blocking finding 1 — detached child is not failure-atomically registered

### Static path

`fixtureClient` launches the real pane at lines 392-399. The pane parent spawns the marked child with `detached:true` and immediately `unref()`s it at lines 276-281. The child can successfully create and fsync its own record at lines 286-289 while the parent has not yet created its record.

The controller does not add the pane/child to `ctx.identities` until line 409 and does not set `server.fixture` until line 414. Before then, all of these failures are reachable after a test-owned detached child may exist:

- fixture-client timeout/output failure or a successful session followed by the records wait timing out at lines 398-400;
- missing, partial, malformed, or unreadable child/parent JSON at lines 401-402;
- marker, spawned-PID, record-order, current-identity, or distinct-group assertion failure at lines 403-408.

This is not hypothetical control flow. A particularly direct interval is: child self-record succeeds; pane-parent `roleRecord` fails or is delayed; controller waits for both records and throws. The separate child is live and has escaped the ordinary pane group.

### Why teardown does not close it

Teardown knows only direct `ctx.handles`, registered `ctx.identities`, and `server.fixture?.pane/child` at lines 660-710. The pane parent and detached child are not direct controller handles. Before line 409 they are absent from `ctx.identities`; before line 414 they are absent from `server.fixture`. The controller also did not retain the unique marker or record paths in a pending fixture plan before launch. It never performs a failure-path process-table marker/root recovery audit.

Killing the known tmux server may remove the ordinary pane, but H4 exists precisely because server death does not remove the detached child. Teardown can then verify only the server, unlink its socket, write a clean-looking teardown receipt, and leave the child running. This violates the contract's strongest execution prerequisite: every reachable failure after test process creation must retain and reap the exact test-owned principal.

### Minimum repair

Before the fixture client can create a session, durably register a controller-owned pending fixture plan containing the unique marker, exact server/session, pane/child record paths, and teardown authority. Track the fixture client immediately at spawn rather than only after `runRaw` returns. Failure cleanup must recover any partially created pane/child from the create-only records **and** an exact bounded process-table scan for that unique marker/root, validate the closed pinned command/uid/PID/group identity, reap it, and repeat the marker/group audit to exact absence.

The marked child must also fail closed if controller registration never completes—for example a bounded gate/watchdog whose release occurs only after the controller has ingested the self-record. That closes the last interval in which a detached child could exist but neither record nor marker recovery has completed. This is test-controller safety, not product declaration policy.

## Blocking finding 2 — expected Node-to-tmux exec can defeat teardown

### Static path

Every server/action/requester gate initially records a Node identity and is placed in `ctx.handles`/`ctx.identities` at lines 301-316. After release, the same PID/start/uid/PGID intentionally changes `comm` from pinned Node to pinned tmux.

For a short action, `releaseGate` does not replace the stored identity with the tmux identity until lines 350-355—after the sample loop, close, stream checks, and exact absence wait. A `ps` exception, output/close timeout, or assertion after exec but before that update leaves a potentially live tmux control client stored as Node. For a foreground server, `releaseGate(..., expectClose=false)` can time out while the execed server is live, and `startServer` does not update the identity or add the server to `ctx.servers` until lines 368-376.

### Why teardown does not close it

The handle pass at lines 665-678 and group passes at lines 681-692 require `exactIdentity`, which includes exact `comm`. A real same-PID tmux replacement therefore fails comparison against the stale Node record. Teardown deliberately skips signaling it. It does not model the one expected exact exec transition for safety cleanup.

The later server loop verifies only server and optional fixture identities at lines 694-710; it does not verify every action/requester handle. It may unlink the exact socket while a skipped unresolved control client still exists. A final all-process/root/marker audit exists only on the H5 happy path at lines 624-627, not in teardown after an earlier failure.

### Minimum repair

Every direct gate handle must retain a controller-safety identity envelope: exact PID/start/uid/PGID plus the closed allowed `comm` set `{pinned Node, pinned tmux}` and exact intended exec vector. Failure cleanup may accept only that exact same-process exec transition, signal the PID/private group, and prove both absent. It must verify every direct handle and every registered/recovered fixture, not only `ctx.servers` members, before any socket unlink.

Controller teardown must always retain a bounded final process/root/marker audit on success and failure. Any exact known handle, group, marker, or root row makes teardown fail/quarantine and forbids execution PASS; a mismatched identity remains unsignaled and is reported unsafe, never treated as absent.

## Blocking finding 3 — H2's “observer receives no result” boundary is not structural

At line 502 the controller stores both hidden action receipts and fresh observer facts in the same `ctx.h2` object. `H2(ctx)` at lines 508-519 therefore receives an object containing the supposedly discarded results. The current statements happen to read only `.live_fresh` and `.absent_fresh`, but the contract claims the observer **receives no action result**, not merely that the present implementation does not reference two sibling properties. The actual action receipts are also already retained as H1 `primary` events; the later `controller_hidden` row records only string references to them.

This is an information-boundary overclaim. It can be fixed without creating a policy engine: keep hidden fault-proof receipts in a controller-only object; serialize a separate immutable H2 observer-input object containing only fresh post-client-absence PID/group/socket receipts; and make a small pure observer function accept only that object. Retain both digests and prove the observer input contains no result/exit/output fields. A separate process is optional; structural argument isolation is sufficient for this host question.

## Blocking finding 4 — H3 does not retain a concurrent two-principal observation

Lines 530-532 spawn and individually validate the owner and successor, then infer independence from unequal recorded PIDs/PGIDs. There is no fresh observation after the successor is ready that proves **both** requester identities and groups are simultaneously live before designation. The owner is expected to be blocked on its release pipe, but H3 is an empirical physical-identity question, so source reasoning is not the required raw host fact.

Minimum repair: after both READY/self-records, obtain and retain fresh exact `/bin/ps -p` and `/bin/ps -g` rows for both requesters in one bounded observation window; assert both child handles are still open and both exact identities/groups are live before recording designation. Then preserve the existing exact former-owner absence before successor release. This remains physical feasibility only and makes no lease/CAS claim.

## Blocking finding 5 — terminal evidence can be missing while machine PASS remains possible

The action receipt retains stdout/stderr EOF booleans at line 356, but H1 checks action code/output/effect and never asserts both EOFs. More decisively, teardown writes `controller-teardown.json` with `.catch(() => {})` at line 716. If that required create-only evidence write fails on an otherwise successful journey, no error is added to `teardownErrors`; the pass calculation at line 769 can still return true even though the contract says a missing failure-path file cannot PASS.

The script also records the current contract digest in the manifest at line 738 but preflight pins only the expected source digest and file modes at lines 640-645. A changed same-mode contract can therefore pass preflight; the exact reviewed contract digest is not an execution condition. The exact external reviewer could detect this later, but the frozen command claims to bind both reviewed artifacts before run.

Minimum repair:

- assert both action stream EOFs anywhere the contract requires close/EOF causation;
- treat failure to write/read back `controller-teardown.json`, the event index, protected/worktree receipts, or other mandatory terminal files as a teardown error that forces FAIL;
- pin `2f83246e7730b5a2fb153e65ab8776418624a0a3d9ab6b4758a028cb3aed00be` in preflight/manifest as the expected contract digest, not merely the observed digest; and
- make the final summary cite the event-index and mandatory terminal-file digests while remaining explicitly non-authoritative.

## Attacks that survived static review

The FAIL is narrow; the following corrected-boundary mechanics are well constructed and should be preserved in the replacement bytes:

- exact five-question scope and size limits are satisfied; there is no lifecycle ledger, CAS/lease implementation, scheduler, replay engine, schema registry, Claude/API-key/network path, or stronger product claim;
- the closed cleanup vectors at lines 47-53 and 263-274 use pinned tmux, explicit argv0, `-N -S`, and only the server/session/pane/kill/final-query tails;
- real gate self-records include raw `ps`, create-only/fsynced bytes, auth-name absence, exact pre-release identity, release frame+EOF, captured close/output, honest sampled/unsampled tmux phase, and PID/group absence;
- H1 uses strict query results and verifies the final absent query's pinned stderr, unchanged socket fact, and original server absence;
- H2's fresh facts are captured after each exact control absence, and its computation currently does not read the hidden receipts—the problem is structural reachability, not observed contamination;
- H4 causally orders the child's create-only self-record before the parent record, revalidates separate exact groups, retains the server-first child survivor, and proves descendant-first child/pane absence while the server remains exact-live and answerable;
- happy-path signaling uses exact PID/start/uid/PGID/comm and group membership before negative-PGID signals; exact absence treats reuse/nonempty groups as failure rather than signaling a mismatch;
- stale-socket removal validates exact dev/inode/type/uid/mode against the initial socket and separates controller cleanup provenance;
- H5 retains per-identity absence, fixture-client absence, final read-only no-autostart facts, a historical raw bounded process audit, protected snapshots, and exact worktree HEAD/tree/status/diff receipts; and
- generated question results cannot override an earlier thrown assertion because whole-run PASS also requires `original === null`, all five booleans, clean teardown, and the evidence bound.

These survived facts do not outweigh a reachable test-owned process leak.

## Verdict and next gate

**FAIL.** Do not execute `host-probe.mjs@sha256:6108e6102f1257274bcc4cd9dd82c38b9490806fed55de8f1a7f71f716bf823e`.

The minimum repair is controller-safety only: pre-register and recover partial fixtures/markers; gate or watchdog the detached child until controller ingestion; make teardown exec-transition-aware and verify every handle/group before unlink; structurally isolate H2 observer inputs; retain simultaneous H3 requester rows; and make mandatory teardown/index/contract bindings fail closed. It must not add lifecycle states, CAS, lease, scheduler, replay, policy mutation matrices, or a second authority. Freeze new source/contract digests and repeat independent exact static review before any execution.

Confidence: **0.99**.
