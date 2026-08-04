---
type: Research
title: Revision 3 T3.5 R6 no-auth repair probe adversarial precommit rubric
actor: codex-precompact-v3-t35-r6-probe-skeptic-contract
timestamp: '2026-08-04T00:22:54.243Z'
---
# Summary

Status: complete and precommitted before script/probe inspection.

Purpose: independent adversarial review rubric for the R6 private no-auth repair probe.

Confidence: **0.97** that this rubric distinguishes a real, causally cleaned host probe from a durable-state simulation or summary-only claim.

This document fixes the skeptic's script and evidence oracles before the in-progress probe root, script, or output is inspected. It does not approve any script or evidence, mutate the Plan/task/code, authorize execution, or permit API-key/global-auth work.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: precommit exact attacks and closed verdict rules for the no-auth R6 cleanup-control/declared-detachment proof; this serves the ultimate goal by preventing a probe author from selecting convenient evidence after observing a result.

## Exact inputs and isolation

Read in full and verified by `./aslite` receipt:

- R6 repair panel synthesis `context-notes/precompact-v3-t35-r6-repair-panel-synthesis@sha256:843c7ba75e26e302625e29ea3188b37cc433d6b6b2618ad35e24f526fcb8418d`;
- R6 skeptic contract `research/precompact-v3-t35-r6-skeptic@sha256:9efad190991436412c1d516180c1c831b15ca0e808a47a8dd3d7ffa744a1edb1`;
- R6 architecture `research/precompact-v3-t35-r6-architecture@sha256:0ef1692cf858fada1473bb812cec6e35f65c0138ae53590b2781cf7f6b0218e4`;
- R6 product/acceptance `research/precompact-v3-t35-r6-acceptance@sha256:715a50b89616bb4e2ab784db81ca735f9497171189467671b7efae03217116bc`; and
- prior exact no-auth host evidence `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.

I did not inspect any path, script, manifest, process, tmux server, or evidence belonging to the in-progress R6 probe. I did not inspect the parallel acceptance probe rubric. I did not mutate Plan, task, orientation, code, worktree, Claude, auth, tmux, or global configuration.

## Evidence trust model

The probe must keep four provenance classes distinct:

1. `raw_host_observation`: exact process/group/socket/filesystem/child-close bytes obtained from the pinned host;
2. `authority_input`: facts the cleanup authority is allowed to consume;
3. `authority_record`: create-only durable transition/action/verdict records emitted from those inputs; and
4. `test_controller_observation`: hidden fault-injection or safe-teardown knowledge used only to prove the test happened and to leave the host clean.

The authority verdict must be independently recomputable using only `authority_input`, strict raw host rows included there, and prior authority history. A controller-only child PID, dropped action result, injected expected value, fallback action, or cleanup fact cannot silently enter the authority oracle. Every retained row has a strict schema/version, bounded fields, exact writer/provenance, and digest. Unknown/missing/duplicate/noncanonical rows reject.

Durable JSON is never proof that an OS principal existed. Every claimed broker, cleaner, control client, server, pane, and declared child must be tied to real host evidence appropriate to its lifetime: exact pre-release `/bin/ps` identity, parent-observed child handle/close, action-specific stdout/stderr/effect, strict PID/group absence, or a declared self-record independently revalidated by `/bin/ps`. The script review must reject a path that only writes the expected state sequence.

## Exact script-review rubric

A script earns pre-execution **PASS** only if all mandatory attacks below are reachable, assertion failures flow through terminal cleanup, raw evidence is retained, and summary generation cannot upgrade a failed primitive. Omission or ambiguity is **FAIL**; reviewers do not fill gaps from prose.

### 1. Private root, immutable inputs, and invocation

- Authority creates an absent unpredictable `/private/tmp` leaf atomically, 0700; case directories are 0700 and retained records 0600. Ancestors, uid, modes, symlinks, hard links, FIFOs/devices, and escapes are validated.
- Script bytes are made immutable/read-only before execution and hashed; manifest pins script, host tuple, exact Node/tmux/`/bin/ps` bytes, prior evidence/panel inputs, invocation argv/environment names, resolved real HOME used only for exclusion/snapshot, and every case id.
- Environments are explicit allowlists. Mandatory non-Claude cases contain neither supported Claude credential nor canary inherited from a server and make no network call. No PATH lookup, shell command string, normal HOME, global configuration, login, keychain, or fallback auth path is allowed. An optional pinned-Claude startup case is governed separately below and may not be used to make a no-network claim.
- Script does not delete failed roots or overwrite create-only records. A failing case remains inspectable.

### 2. One real cleanup authority

- One transition implementation owns reaper lease, `CONTROL_*` state, reservation, release, control argv, raw signal authorization, socket unlink, declared-child ingestion, cleanup order, evidence, and verdict.
- Fault/controller code may pause, kill, hide receipts, or safely clean a deliberately unknown test child, but cannot directly write authority success states.
- All cleanup side effects—tmux control, raw signal, and stale-socket unlink—require the same exact current destructive lease. Nonholders can request/observe only.

### 3. Closed cleanup-control action surface

The only allowed vectors are exact pinned tmux with explicit POSIX `argv[0]`, `-N`, exact private `-S` socket, and authority constants:

- `OBSERVE_SERVER_PID`: `display-message -p '#{pid}'`;
- `OBSERVE_SESSIONS`: `list-sessions -F <exact-pinned-format>`;
- `OBSERVE_PANES`: `list-panes -a -F <exact-pinned-format>`; and
- `KILL_SERVER`: `kill-server`.

The final absent-server/no-autostart action is `OBSERVE_SERVER_PID`; `new-session`, `kill-pane`, `send-keys`, `run-shell`, attach, environment display, arbitrary target/format, caller args, and shell are forbidden after `REAPING`.

Each action uses a no-auth gated broker and monotone create-only states equivalent to:

`CONTROL_RESERVED -> CONTROL_IDENTIFIED_GATE_CLOSED -> CONTROL_RELEASED_ACTION_POSSIBLE -> optional CONTROL_RESULT_CAPTURED -> CONTROL_PRINCIPAL_ABSENT -> CONTROL_RECONCILED`.

There is at most one nonterminal epoch. Reservation and OS spawn are inside the current campaign mutation/reaper lease boundary; release is one CAS/read-back before one bounded frame+EOF; the broker independently verifies current lease/revision/action/nonce/identity, closes the FD, then exact-execs. Every epoch proves its PID/private group absent before reconciliation/next action.

## Mandatory script/evidence attacks

### A. Fake durable state versus real OS principal

**Attack:** Attempt to satisfy every `CONTROL_*`, lease, detacher, and cleanup row without creating the corresponding process/action.

**Required rejection/proof:** Positive control cases include real gate broker PID/start/uid/PGID/comm rows before release, real child handles, exact action outputs/effects, and exact terminal PID/group absence. A state-only fixture is labeled simulated and cannot satisfy the host primitive. The reviewer recomputes same reservation/nonce/lease/action identity across ledger, broker self-record, raw ps, frame, child close, target observation, and final audit.

### B. Reservation, self-record, and release ordering

**Attack matrix:** pause/kill before and after reservation history/current publication; OS spawn before self-record; self-record before fsync/read-back/READY; lease/revision loss before release; release CAS before read-back; frame byte/EOF; duplicate/partial/late frame; inherited writer; exec.

**Closed rule:** no OS spawn before durable reservation; no READY/release before create-only/fsynced/read-back exact broker identity; no connect/action before irreversible release. Unknown possibly spawned cleanup principal is post-server-release FAIL/`FAILED_QUARANTINED`; timeout/no record/no socket is never CLEAN. A live stopped mutation/lease owner may block indefinitely, but no takeover/CLEAN occurs until exact absence or safe resume.

### C. Unobservably short tmux clients

**Attack:** Let the released broker exec a read-only or `kill-server` client that exits between `/bin/ps` samples; attempt to invent a tmux comm row or treat absence as proof no client/action occurred.

**Closed rule:** an exact post-exec tmux ps row is retained only if actually observed. When the client is too short, evidence must state `tmux_phase_sampled:false`. The acceptable causal proof is: real durable Node gate identity + immutable reviewed explicit exec vector + one-shot release + both pipe EOFs/child close/exit when available + action-specific strict output/effect or explicit result loss + exact PID/private-group absence. The PID is not reclassified as “never existed.” A missing sampled tmux row is not a blocker if this causal chain passes; a fabricated row or missing broker/close/absence chain is FAIL.

### D. Missing result and target reconciliation

**Attack:** Actually release an action, suppress its authority result after connect/action, and let the controller retain the hidden result separately.

**Closed rule:** `CONTROL_RELEASED_ACTION_POSSIBLE` means action may have happened. The authority first proves the control PID/group absent, then freshly observes exact server PID/group/socket state. It may reconcile server exact-live and reserve a later epoch, or reconcile original server+group exact-absent and advance. It cannot use controller-only result, missing receipt, action exit, socket absence, or a summary boolean. Contradiction/malformed/rebound target is FAIL quarantine. The hidden controller fact remains retained solely to verify the fault was genuine.

### E. Nonholder, two-cleaner, and control-versus-signal

**Attack:** Use two real cleanup-requester OS principals. Race lease acquisition; have the loser attempt control, raw signal, and unlink. Race current holder's control release against raw-signal authorization and a second control epoch.

**Closed rule:** one exact owner-file/lease winner; loser actions reject before OS spawn/signal/unlink. Control and raw signal are mutually exclusive branches of one current transition. No “idempotent second-cleaner `kill-server`” exception. Raw before/after server/socket facts must show the losing attempt caused no target effect. State-only fake cleaners cannot satisfy the real two-principal case.

### F. Lease takeover

**Attack:** Kill/stop the real owner while (1) no control is reserved, (2) broker is identified gate-closed, (3) action is released with result present, and (4) action is released with result missing. Try takeover on timeout, mismatched identity, and live stopped owner.

**Closed rule:** successor needs exact former-owner PID/start/uid/PGID/comm absence plus fresh CAS. Timeout or stopped-live owner cannot be stolen. Successor disposes the prior control principal/group and reconciles target facts before a new control/signal. It never trusts `signal_sent` or controller-only results. Missing possibly spawned identity is FAIL quarantine.

### G. PID/PGID reuse and identity drift

**Attack:** Mutate start/uid/PGID/comm/binary, provide a live unrelated row at a numeric PID/group, and inject malformed/multirow/stderr/digest-drift ps receipts. Where actual PID reuse cannot be forced, label parser/transition cases simulated rather than empirical reuse.

**Closed rule:** exact absent original PID plus empty original PGID is successful absence and prevents an unnecessary signal. Any live mismatch, nonempty reused group, malformed row, or tool digest drift forbids signal/control target claims and quarantines. The report retains the accepted sampled ps-to-signal TOCTOU; it cannot claim atomic no-mistarget behavior.

### H. Stale and rebound socket

**Attack:** Use the known `kill-server` stale-socket behavior; substitute symlink/non-socket/wrong uid/mode/dev/inode; and, in a safe no-auth case, replace/rebind the path between premise and action/unlink.

**Closed rule:** socket absence/removal is never process proof. Unlink occurs only under the lease after every creator/known group is absent and immediate dev/inode/path/type/uid/mode revalidation. Rebound/substituted socket is FAIL and is not controlled or unlinked as the original. Test-controller teardown of a rebound test server is separately attributed.

### I. Exact query, kill, and final no-autostart argv

**Attack:** omit executable `argv[0]`; reorder/remove `-N/-S`; use PATH/shell; change format/target; use `new-session`; leak canary/auth; or let final query run outside the modeled lifecycle.

**Closed rule:** byte-exact allowlisted argv only. Query outputs parse under strict exact grammars. `KILL_SERVER` effect is re-established from process/group/socket observations. Final `OBSERVE_SERVER_PID` runs as the last lease-owned control epoch against the absent socket, exits under its pinned absent-server result, creates no socket/server/session, and its own PID/group is absent before “all tmux clients absent.”

### J. Declared detached/new-PGID child

Positive case: a manifest/lane-declared immutable parent uses exact pinned Node `detached:true`/new PGID, and the child create-only self-records nonce-bound PID/start/uid/PGID/PPID/comm/binary before the parent returns. Prove pane-group termination does not prove the separate child absent; authority ingests the declaration, blocks CLEAN, reaps the exact separate group before server destruction, and retains absence.

Required red cases:

- declaration present, child record suppressed;
- record written only after parent return/join boundary;
- duplicate children/records for one reservation;
- conflicting PID/start/uid/PGID/comm/binary/nonce/parent;
- declared child stops/resumes after proposed CLEAN;
- marked attributable child appears without a declaration; and
- declaration/record claims a child but controller proves no real OS child existed.

Missing/late/duplicate/conflicting/unverifiable expected record or unexpected marked child is FAIL and forbids CLEAN. The controller may retain a hidden child identity for safe teardown in the missing-record case, but it cannot promote that identity into the authority proof or turn rejection into cleanup success. This demonstrates the declared boundary only; it does not claim arbitrary unmarked escape detection.

### K. Descendant-before-server order

**Attack:** attempt server `KILL_SERVER`/raw TERM/KILL before pane/declared separate launcher groups are fenced, joined-handler barriers completed where applicable, and known descendant groups absent. Attempt new child launch after final inventory.

**Closed rule:** order is application clients absent -> server-alive inventory -> launcher quiescence -> known descendant groups absent -> server control/signal -> server group absent -> stale socket -> final no-autostart client absent -> final audit -> CLEAN. The red reordered trace must be rejected by the authority before the prohibited OS action; if a separate destructive demonstration is run, controller cleanup and explicit red verdict are mandatory. Raw revisions/timestamps/action ids make ordering recomputable.

### L. Fallback hiding primitive failure

**Attack:** Let fallback raw TERM/KILL or controller cleanup produce a clean host after a query, `kill-server`, pane/child reap, socket, or lease assertion failed.

**Closed rule:** raw pre-fallback observations, primary result, fallback authorization/action, controller teardown, and final state are distinct. Fallback cleanup cannot change a failed primitive/test into PASS. Every reported primitive PASS is recomputed from the pre-fallback facts; final cleanliness is a separate requirement.

### M. Cleanup on probe assertion failure

**Attack:** Trigger a mandatory positive assertion failure and every expected negative rejection while live brokers/servers/panes/detached children/sockets/writers exist; trigger output/parser exceptions and timeouts.

**Closed rule:** all cases enter a bounded top-level cleanup path that closes writers, preserves the original assertion, acquires/recovers the lease where possible, reaps every known authority principal/group, uses controller-only knowledge solely for safe teardown of deliberately hidden test objects, validates/removes exact test sockets, and retains final raw audit. No early `process.exit`, thrown assertion, or summary generator may bypass cleanup. Cleanup success never clears the original FAIL. Cleanup uncertainty is overall FAIL/`FAILED_QUARANTINED`, leaves the private root intact, and prohibits probe PASS.

### N. Final audit and protected-state provenance

**Attack:** provide only a current/reviewer ps check, omit the historical final transcript, scan only summary paths, bind snapshots to an unproved HOME, or let fallback/global paths escape the protected set.

**Closed rule:** each case and the total campaign retain exact bounded historical final `/bin/ps` bytes/argv/digest, known PID/group absence rows, root/socket/public-marker/tmux predicates, every cleanup client, and exact scan scope. Invocation binds actual resolved real HOME, isolated roots, script/manifest/host tuple, and protected target list. Before/after snapshots are byte-identical for enumerated Claude/Codex/OpenCode/AgentState/npm/hook/handoff/global-auth sentinels and worktree status. A later clean check cannot replace a missing historical audit.

### O. Optional no-auth Claude and join claims

The mandatory probe can PASS without invoking Claude by binding the exact accepted hook-join evidence. If a fresh Claude startup-hook case is included:

- use exact pinned Claude with fresh relocated HOME/config/cache and no supported auth variables;
- no real HOME, normal/global auth, keychain/login, retry, or fallback;
- snapshot protected state before launch and after cleanup; any drift, including real `~/.claude.json`, is FAIL and must not be silently reverted;
- retain exact settings handler set, raw start/response correlation, effect bytes, and host milestone; never map an opaque/silent response to command/args via settings order, output length, or guessed id;
- auth/billing/model-response absence is not evidence against the pre-auth hook primitive, but the script may not claim a first model response; and
- if safe isolated exercise is unavailable, record `CLAUDE_JOIN_NOT_EXERCISED` and cite the exact prior evidence—never fall back.

Optional omission is not a probe blocker. An attempted case with global drift, auth fallback, false join identity, or unexplained process is overall FAIL.

### P. Summary-only versus recomputed evidence

**Attack:** make generated summary booleans/substrings pass while raw identity, ordering, fallback, result-loss, child declaration, cleanup, or protected rows fail/miss.

**Closed rule:** summary is non-authoritative and contains source raw-evidence digests. Independent review parses strict raw rows and recomputes every verdict, identity equality, order, lease exclusivity, primary-versus-fallback result, child disposition, cleanup state, and protected equality. Script/evidence/summary hashes are independently recomputed. A summary-only claim, missing schema/validator identity, unbounded capture, unrecomputable negative, or raw/summary disagreement is FAIL.

## Closed case and campaign verdict rules

### Script review

- **PASS:** all mandatory attacks A-P except optional Claude execution are explicitly implemented with strict schemas, real-host/controller provenance separation, bounded cleanup on every exit, and no stronger claim than the R6 panel.
- **FAIL:** any mandatory attack is missing/ambiguous; state-only rows can satisfy a host case; action surface is open; nonholder can control/signal; result-loss uses hidden facts; detached red cases or cleanup order are absent; failure can skip cleanup; evidence cannot be recomputed; or script contains auth/global fallback.

There is no caveated script PASS. The script is reviewed at an exact digest before execution; any byte change repeats review.

### Evidence review

Expected negative cases count as case PASS only when the exact prohibited transition is rejected, the red reason is correct, no forbidden effect occurs, and cleanup/final audit pass. An unexpected positive-case assertion failure remains campaign FAIL even if cleanup succeeds.

- **PASS:** exact reviewed script ran on the pinned tuple; every mandatory positive and expected-negative case meets its raw oracle; all primary/fallback distinctions recompute; every real principal/group/socket/writer is terminally accounted for; final and protected audits pass; no raw/summary disagreement exists.
- **BLOCKED_PENDING_VERIFICATION:** mandatory pinned host/tool is unavailable or the probe cannot begin a required primitive before creating/releasing any principal. No Plan may advance. Optional Claude non-exercise alone is not BLOCKED.
- **FAIL:** any mandatory case starts and produces unexpected/missing/malformed evidence; any post-release uncertainty, fake principal, unauthorized action, missing result reconciliation, lease race, identity/socket conflict, cleanup/order breach, attributable survivor, protected/global drift, auth fallback, or false claim occurs. Later CLEAN cannot erase FAIL.
- **FAILED_QUARANTINED:** cleanup cannot prove all known/test-controlled principals/groups/sockets absent. This is an evidence FAIL with an external host-cleanup blocker, never a fourth success verdict.

PASS is exact-scope evidence only: gated lease-owned cleanup controls, declared/marked detachment rejection, descendant-before-server cleanup, final/protected absence on the pinned no-auth host. It is not proof of the CAS implementation, live API-key compaction, real sub-agent delivery, arbitrary unmarked escape detection, malicious-same-uid containment, portability, or Plan correctness.

## Result envelope required from future reviews

```yaml
result:
  reviewed_script_digest: sha256:<exact>
  reviewed_evidence_digest: sha256:<exact-or-null>
  verdict: PASS | FAIL | BLOCKED_PENDING_VERIFICATION
  cleanup_state: CLEAN | FAILED_QUARANTINED | NOT_STARTED
  optional_claude: NOT_ATTEMPTED | PASS | FAIL
  mandatory_cases_passed: <count>/<count>
  expected_negative_cases_passed: <count>/<count>
  raw_recomputed: true | false
  protected_state_equal: true | false
  blockers: [<exact closed reasons>]
  confidence: <0..1>
```

## Proximate-goal linkage

This rubric makes the repair probe falsifiable before its implementation can influence the oracle. It forces real principals, one lease, exact closed argv, conservative missing-result reconciliation, declared-detachment red cases, descendant-before-server order, cleanup after every assertion, and raw evidence recomputation. That prevents a clean-looking host or generated summary from becoming false proof for the compaction-memory rail.
