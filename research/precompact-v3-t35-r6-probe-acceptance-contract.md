---
type: Research
title: Revision 3 T3.5 R6 private probe product/acceptance contract
actor: codex-precompact-v3-t35-r6-probe-acceptance-contract
timestamp: '2026-08-04T00:23:35.636Z'
---
# Summary

This is the **precommitted independent product/acceptance rubric** for the future exact R6 private no-auth repair probe. I did not inspect the in-progress probe root, script, evidence, or the skeptic's new probe rubric before making this contract immutable.

The future probe earns whole-probe **PASS** only by freshly proving the newly load-bearing cleanup-control, missing-receipt reconciliation, exclusive-lease/takeover, marked-detachment, descendant-before-server, and final-continuity mechanics on the pinned host with strict recomputable evidence. The generic Claude Code 2.1.220 synchronous all-handler join primitive may bind the exact prior retained host evidence. Candidate-specific helper effect/output and the new cleanup mechanics may not. A fresh no-auth Claude mapping repetition is optional: inability to execute it safely is component **BLOCKED**, with no global/normal-auth fallback and no fresh-mapping claim.

Confidence in this closed rubric: **0.97**.

## Purpose and exact inputs

- Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.
- Proximate goal: fix the review oracle before seeing the repair implementation, so a convenient summary, cleanup success, or prior host result cannot manufacture PASS for an unproven new mechanic.
- Exact R6 repair synthesis: `context-notes/precompact-v3-t35-r6-repair-panel-synthesis@sha256:843c7ba75e26e302625e29ea3188b37cc433d6b6b2618ad35e24f526fcb8418d`.
- Product/acceptance boundary: `research/precompact-v3-t35-r6-acceptance@sha256:715a50b89616bb4e2ab784db81ca735f9497171189467671b7efae03217116bc`.
- Architecture: `research/precompact-v3-t35-r6-architecture@sha256:0ef1692cf858fada1473bb812cec6e35f65c0138ae53590b2781cf7f6b0218e4`.
- Adversarial minimum repair: `research/precompact-v3-t35-r6-skeptic@sha256:9efad190991436412c1d516180c1c831b15ca0e808a47a8dd3d7ffa744a1edb1`.
- Prior selected no-auth launch/reap evidence: `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`.
- Prior evidence audit: `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`.
- Prior hook-join evidence: `context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb`, sanitized fixture `sha256:dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036`.

All exact inputs were read in full and their complete exported bytes matched the listed digests.

## Verdict algebra

Verdicts are exactly `PASS`, `FAIL`, or `BLOCKED_PENDING_VERIFICATION`. There is no pass-with-caveats.

### Script review

- **PASS:** the exact immutable script/schema bytes structurally implement every mandatory case, causal field, red oracle, protected check, cleanup path, bound, and command restriction below; every spawned or signaled target is resolved from a durable exact record; no TODO, convention-only step, unsafe path, shell interpolation, arbitrary tmux command, normal/global auth, network action, or hidden fallback exists.
- **FAIL:** any mandatory case or evidence field is absent/ambiguous; a summary substitutes for raw evidence; a prohibited action is reachable; a negative case can publish the tested attempt's PASS/CLEAN incorrectly; or cleanup safety depends on the reviewer/operator knowing an unrecorded PID.
- **BLOCKED_PENDING_VERIFICATION:** exact script bytes, pinned host/toolchain identity, or a required external contract cannot be reviewed without first performing a prohibited or unavailable action. BLOCKED is not permission to execute.

### Evidence review

- **PASS:** every mandatory fresh component below passes; every negative case produces its exact internal FAIL/rejection while the independent probe meta-case cleans safely; strict validation and recomputation succeed from retained bytes; protected/process/socket/worktree continuity passes.
- **FAIL:** any mandatory component fails, any retained record is missing/invalid/unbound, any forbidden mutation or survivor occurs, any negative oracle stays green, or an optional Claude attempt causes drift/fallback/leak.
- **BLOCKED_PENDING_VERIFICATION:** a mandatory component cannot be exercised on the exact pinned host and no prohibited mutation occurred. Mandatory BLOCKED forbids whole-probe PASS.

The optional no-auth Claude mapping component may be `BLOCKED_PENDING_VERIFICATION` without blocking whole-probe PASS **only** when the probe explicitly binds the prior join primitive, makes no fresh mapping/helper-effect claim, and all mandatory no-Claude mechanics pass. The whole verdict must then remain scoped to “R6 cleanup-control and marked-detachment repair primitives”; it may not say the probe freshly proved direct candidate hooks.

## Mandatory exact cases and their oracles

Each row is mandatory and fresh unless explicitly labeled optional. “Meta-PASS” means the probe is correct only when the attempt under test records the specified FAIL/rejection and still reaches safe process cleanup; the attempt verdict itself never becomes PASS.

| Case | Required real action | Required oracle | Component result |
|---|---|---|---|
| `C00_PREFLIGHT_PROTECTED_BASELINE` | Resolve exact host/toolchain/real HOME/worktree; create an absent 0700 private root; no process spawn yet | Immutable script/schema digest, exact invocation/env-name digest, before snapshots, clean exact worktree, no auth values, root ownership/modes | PASS only on complete bounded baseline; otherwise FAIL/BLOCKED before mutation |
| `C10_CONTROL_OBSERVE` | Start harmless no-auth foreground server and pane; execute lease-owned gated `OBSERVE_SERVER_PID`, `OBSERVE_SESSIONS`, and `OBSERVE_PANES` | One create-only control epoch per action, explicit argv0/`-N`, exact parsed output, action principal/group absent, target facts reconciled | PASS |
| `C11_CONTROL_KILL_SERVER` | After known descendant absence, execute gated lease-owned `KILL_SERVER` | Release makes action possible; exact result if captured; client/group absent; original server/group absent; stale socket handled only afterward | PASS |
| `C12_MISSING_RESULT_SERVER_LIVE` | Release a control, suppress/crash before result retention while the exact server remains live | Never infer “action did not happen”; first prove client/group absent, freshly prove exact unchanged server/group/socket, reconcile current state, then permit only a new ordinal under the lease | PASS only if reconciliation is current-state-only |
| `C13_MISSING_RESULT_SERVER_ABSENT` | Release `KILL_SERVER`, let it take effect, suppress/crash before result retention | Never synthesize a result; first prove client/group absent, then exact original server/group absence and socket facts; advance without replaying an already-possible action | PASS only if original action remains labeled `may_have_occurred` |
| `C14_FINAL_NO_AUTOSTART` | After server and socket absence, run final lease-owned `OBSERVE_SERVER_PID` against the absent socket | Strict expected absent-server result, no server/socket creation, final control PID/group absent; only now `all_tmux_clients_absent` | PASS |
| `C20_TWO_REQUESTERS_NONHOLDER_RED` | Second cleaner requests cleanup and attempts control, raw signal, and unlink while another lease is current | Every side effect rejects before spawn/signal/unlink; passive request/observations only; current holder proceeds | Meta-PASS on exact rejection |
| `C21_LEASE_TAKEOVER_GATE_CLOSED` | Kill former lease owner with an identified gate-closed control broker | Exact former-owner absence + fresh CAS; successor revokes/reaps old broker/group, re-observes target, then may reserve a new epoch | PASS |
| `C22_LEASE_TAKEOVER_RELEASED` | Kill former owner after control release but before result/absence/reconciliation | Successor treats action as possible, proves old client/group absent, freshly reconciles target, never trusts stale `signal_sent`/receipt | PASS |
| `C23_CONTROL_SIGNAL_SERIALIZATION_RED` | Attempt a raw signal while one control epoch is nonterminal, and control while a raw signal authorization is in flight | Same transition authority rejects the second side effect; at most one destructive action is active | Meta-PASS on rejection |
| `C30_MARKED_DETACHER` | Harmless pane launches a declared public-marker, create-only-self-recorded `detached:true`/new-PGID child that outlives its parent/pane assumption | Exact child PID/start/uid/PGID/comm/binary record before parent return; child classified known; attempt latches `KNOWN_PRINCIPAL_ESCAPED`/equivalent FAIL; child/group reaped before server | Meta-PASS; internal FAIL remains after process CLEAN |
| `C31_DETACHER_RECORD_MISSING` | Same declared detacher with authority identity record suppressed; independent safety controller retains cleanup identity only | Required declaration+missing record forces FAIL and forbids CLEAN/PASS; safety receipt is namespaced non-authoritative and cannot satisfy product identity | Meta-PASS on FAIL plus safe residual cleanup |
| `C32_DETACHER_RECORD_LATE_OR_CONFLICT` | Record arrives after parent return, duplicates, conflicts, has wrong PID/start/uid/PGID/comm/binary, or count differs | Every variant fails closed; no version is selected heuristically; all safety-known residual children are removed | Meta-PASS on exact FAIL variants |
| `C40_DESCENDANT_BEFORE_SERVER` | With server alive, fence/stop and reap pane/known marked groups first, then issue server cleanup | Raw ordering proves joined/quiescent boundary, descendant group absence, live original server observation, then later server-release/control action | PASS |
| `C41_SERVER_FIRST_REORDER_RED` | While a known descendant remains, request `KILL_SERVER` or server raw signal | Transition rejects before control spawn/signal; original server remains exact-live; correct order can then finish cleanup | Meta-PASS on rejection |
| `C50_STOPPED_OR_STALE_ACTOR_RESUME` | Resume broker/control/reaper/requester actors paused at every reservation/release/action/reconciliation/proposed-CLEAN boundary | Current revision/lease/closed FD/terminal fence prevents late connect/action/write/spawn; no new socket/principal | PASS |
| `C60_FINAL_CONTINUITY` | Finish every case, socket removal, final client, and audit | All mandatory control epochs reconciled, all exact known PIDs/groups absent, no marker/root/socket/server rows, protected/worktree unchanged, raw final audit retained | PASS |
| `C70_OPTIONAL_NOAUTH_CLAUDE_MAP` | Optional exact pinned Claude, fully relocated no-auth, direct short-shell-handler effect boundary; never API key/model fallback | Fresh settings/handler-set/start-response/effect/output/advance evidence and protected continuity | PASS if safely exercised; BLOCKED if not; any drift/fallback is whole-probe FAIL |

The mandatory matrix must also cover malformed/oversize/multirow tmux and `ps` output, PID/start/uid/PGID/comm/binary drift, server/socket dev-inode substitution, stale/rebound socket, partial/duplicate/late frame, inherited writer, EPIPE, timeout, stopped client, and exact absent PID/group success semantics. These may be distinct subcases or schema-bound variants, but omission is script FAIL.

## Required causal record fields

Every record is canonical UTF-8 JSON with a named schema version, strict unknown/missing-key rejection, bounded strings/arrays/row counts, LF termination, validator digest, and validation receipt. A root manifest written before execution binds the immutable script and schema digests. Every case must retain the raw bytes needed to recompute its derived facts.

### Common binding

- `probe_id`, `case_id`, `case_kind`, `expected_oracle`, `observed_oracle`, monotonically increasing `sequence`, wall and monotonic timestamps;
- exact script/schema/manifest digests, invocation argv digest, environment-name digest, private root, working directory, exact feature HEAD/tree/status baseline;
- pinned Darwin architecture, Claude version/digest when applicable, Node/tmux/`/bin/ps` realpaths/digests/versions;
- predecessor record digest, ledger revision, cleanup phase before/after, pending attempt verdict, and whether the row is authoritative or safety-only;
- raw evidence path/digest list and the exact validator identity/receipt.

### Lease and principal identity

- lease id/epoch/revision, owner PID/start/uid/PGID/comm/binary, acquisition/takeover CAS, former-owner absence evidence;
- reservation/control id, ordinal, one-shot nonce digest, role, exact expected state, PID/start/uid/PPID observation/PGID, Node-or-tmux state comm, binary digest, private-group identity;
- create-only self-record path/digest, fsync/readback/READY ordering, control endpoint/writer identity, frame digest/EOF/FD-close facts;
- exact raw `/bin/ps -p` and `-g` command vectors, exit/stdout/stderr bytes, parsed rows, and terminal PID/group absence.

`sess`/SID is never an identity field. PPID is observation only after parent death. Exact absent PID/group is a successful absence predicate; mismatch or a nonempty reused group is conflict/FAIL, not absence.

### Cleanup-control action

- enum limited to `OBSERVE_SERVER_PID`, `OBSERVE_SESSIONS`, `OBSERVE_PANES`, or `KILL_SERVER`; exact authority-owned target/format constants and vector `[tmuxRealpath,"-N","-S",socket,...tail]` with explicit argv0;
- exact no-auth environment names and negative auth/canary scan receipt;
- `CONTROL_RESERVED -> CONTROL_IDENTIFIED_GATE_CLOSED -> CONTROL_RELEASED_ACTION_POSSIBLE -> CONTROL_RESULT_CAPTURED? -> CONTROL_PRINCIPAL_ABSENT -> CONTROL_RECONCILED` state history;
- exact expected server PID/start/uid/PGID/comm and socket dev/inode/path/type/uid/mode premise at reserve/release;
- optional bounded stdout/stderr/exit/close/both-EOF result; `result_missing` is explicit;
- reconciliation facts recorded only after client/group absence: fresh original server PID/group, socket, pane/known-group observations; `action_may_have_occurred:true` remains immutable when result is missing;
- no subsequent ordinal until prior control is reconciled. No caller command/target/format, shell, `new-session`, `send-keys`, `kill-pane`, attach, run-shell, environment display, or arbitrary tmux action.

### Declared detacher

- declaration id, expected child count, public nonsecret marker/commitment, parent/pane identity, record deadline `before_parent_return`, allowed child binary, and expected new-PGID relation;
- authority child record with exact PID/start/uid/PGID/PPID observation/comm/binary and create/fsync/readback timing;
- independently namespaced safety-controller identity/cleanup receipt for negative missing-record cases. The schema and verdict engine must reject safety-only rows as product identity evidence;
- raw proof that pane/ordinary group cleanup did not imply the detached group absent, plus exact separate-group reap/absence.

### Ordering and terminal proof

- phase rows for `REAPING_FENCED`, `APPLICATION_CLIENTS_ABSENT`, `ATTRIBUTION_REFRESHED`, `DESCENDANT_LAUNCH_QUIESCENT`, `KNOWN_DESCENDANTS_ABSENT`, `SERVER_ABSENT`, `SOCKET_ABSENT`, `LAST_CONTROL_ABSENT`, and `FINAL_AUDIT`;
- exact sequence/digests showing known descendant absence while the original server remained exact-live; server cleanup release/signal strictly later;
- final socket lstat/unlink/fsync receipts, final absent-server no-autostart client lifecycle/absence, resumed-actor outcomes, and retained bounded all-process audit.

## Protected scope, isolation, and allowed mutation

Before any spawn, after every case, after any optional Claude attempt, and at finalization, retain bounded before/after metadata+byte digests for:

- resolved real `~/.claude.json`, Claude `settings.json`, `settings.local.json`, and global hook directory;
- real Codex and OpenCode hook/config files and directories named by the prior protected contract;
- real `~/.agentstate` credential files and `~/.agentstate/handoffs/v1`;
- real user npmrc and the existing closed npm-cache sentinel inventory;
- exact feature worktree HEAD/tree, tracked modes/content, porcelain status including untracked files, and bounded raw diff/status bytes;
- explicit outside-canary roots and the exact real-HOME binding used solely for exclusions/snapshots.

Unavailable, unreadable, symlinked, wrong-owner, over-limit, or structurally unexpected protected scope is BLOCKED before spawn. Any protected byte/metadata drift after a spawn is FAIL. The probe records the drift and cleans its own known principals; it never restores or mutates protected state to recover PASS.

The only permitted mutations are under one newly absent `/private/tmp` probe leaf: 0700 directories, 0600 evidence/config/records, exact private tmux socket, and the named temporary processes/groups. The probe may signal only exact lease/known identities and may unlink only the exact validated owned socket after creator/group absence. The later bundle Research write is outside the probe script.

Forbidden: repository/Plan/task/bundle/code writes; real-HOME/global config/auth/keychain mutation; normal/global auth fallback; API keys or OAuth tokens; network use; host npm cache; arbitrary shell; non-pinned executables; deleting failed evidence roots; or cleanup of an identity known only to a human reviewer.

All spawned environments are minimal and relocate HOME, USERPROFILE, XDG, Claude/Codex/OpenCode roots, TMPDIR, and any caches. Auth variables and alternate credential variables must be absent by construction and by retained environment-name/argv/file/process scans. No real secret is used or retained. Public nonsecret markers remain in evidence so negative scans are recomputable.

## Prior-evidence binding versus mandatory fresh proof

### May bind prior evidence

The probe may bind only these previously audited component facts, with exact source/fixture digests and their limitations carried forward:

- Claude Code 2.1.220 starts matching synchronous handlers in parallel, provides one opaque start/response correlation per handler, and does not advance past the event until all configured handler responses complete.
- The prior evidence does **not** identify a silent handler's command/args from its opaque response, did not produce a real model response, and had overall FAIL because normal-auth use changed `~/.claude.json`. Those limitations are mandatory fields, not footnotes.
- Prior launch/reap evidence may be baseline provenance for explicit `argv[0]`, commandless foreground `-D`, `-N` no-autostart behavior, distinct server/pane groups, Darwin parser facts, and stale-socket behavior. It is not proof of the new lease/state/reconciliation/detacher mechanics.

### Must be fresh in this probe

- every cleanup-control reservation, identity-before-release, closed action, client/group absence, reconciliation, and final no-autostart control;
- missing-result server-live and server-absent branches;
- two-requester exclusion, control-versus-signal serialization, takeover with gate-closed and released controls, stopped/stale resumes;
- marked detached/new-PGID identity and persistence, missing/late/conflicting record negatives, safety-only separation, and exact reap;
- descendant-before-server positive order and server-first rejection;
- current protected snapshots, no-auth isolation, exact socket cleanup, retained final process audit, and feature-worktree continuity;
- strict schema/validator/receipt behavior and recomputability of every derived verdict.

Candidate-specific direct helper effect/output, normal PreCompact/SessionStart/PostCompact/Stop/SubagentStop delivery, first response/action, and real subagent behavior are **not** inherited and are not mandatory no-auth-probe claims. They must be fresh later on the immutable candidate. If optional `C70` runs, it proves only that exact no-auth direct-shell-handler mapping/effect case on the pinned host; it does not satisfy the later candidate rail.

## Evidence sufficiency and recomputability

The exact evidence review must be possible without executing the script again and without trusting `summary.json`:

1. validate every retained document with the immutable standalone schema/validator and root script/schema digest;
2. recompute state transitions, predecessor/revision/lease ownership, action allowlist/argv/env, control and detacher identity, and all case verdicts from raw records;
3. strictly parse retained raw `ps`, tmux stdout/stderr/exit, socket lstat, action frame, process/group, protected-snapshot, worktree, and final-audit bytes;
4. recompute public marker/no-auth/global-path scans from retained bounded inputs; a boolean alone is insufficient;
5. distinguish primary observations, fallbacks, safety-only records, expected negative internal FAIL, cleanup state, and meta-case verdict;
6. retain every failed/blocked case and root; no deletion, overwriting, or summary-only replacement;
7. retain a final exact invocation/real-HOME/probe-root/worktree/toolchain binding and raw all-process transcript. A later external scan may corroborate but cannot replace the retained final audit.

Malformed, duplicate, reordered, unbounded, unknown-key, missing-validator, missing-raw, digest-drifted, or summary/raw-conflicting evidence is FAIL.

## Conditions that categorically forbid whole-probe PASS

Whole-probe PASS is forbidden by any of the following:

- any mandatory case is absent, FAIL, or BLOCKED;
- the exact script was not dual-reviewed before execution or evidence came from different script/schema bytes;
- any cleanup tmux/raw-signal/socket side effect came from a non-lease holder, overlapped another destructive action, used an unmodeled client, or lacked durable identity/terminal absence;
- missing action result was interpreted as “did not happen,” replayed before client absence/reconciliation, or converted into a fabricated result;
- a known/marked/declaration-required child remained live, lacked a timely exact record, was satisfied by safety-only evidence, or server destruction preceded its absence;
- server-first transition was not proven red, final no-autostart client was not modeled/absent, or `all_tmux_clients_absent` appeared before it;
- exact socket, known PID/group, probe marker/root, stopped actor, or late binder survived; final audit was external or omitted;
- protected/global/worktree bytes changed, auth/global fallback occurred, any real secret/network path was used, or an optional Claude run drifted protected state;
- prior hook evidence was inflated into silent command mapping, helper effect, first-model-response, candidate rail, or fresh protected-state proof;
- arbitrary unmarked-escape detection, universal containment, atomic PID-safe signaling, or portability beyond the pinned tuple was claimed;
- raw evidence cannot independently recompute the asserted result.

## Precommitted result envelope

The future review must return:

```yaml
status: complete | blocked
script_review: PASS | FAIL | BLOCKED_PENDING_VERIFICATION
evidence_review: PASS | FAIL | BLOCKED_PENDING_VERIFICATION | NOT_RUN
whole_probe_verdict: PASS | FAIL | BLOCKED_PENDING_VERIFICATION
scope: R6_cleanup_control_and_marked_detachment_repair_primitives_only
optional_claude_mapping: PASS | FAIL | BLOCKED_PENDING_VERIFICATION | NOT_RUN
prior_join_binding:
  source: context-notes/precompact-v3-t35-host-hook-capabilities@sha256:939da1cdb7001900f9ef0dcb2d984a86c7c305a525c54199db570494e3a5cfcb
  fixture: sha256:dfd554779fdebb0b367c84eed7e9774419644be3e5bce4e2bcf5d3ae7c08c036
  claim: aggregate_configured_handler_start_response_join_only
mandatory_cases: <case -> verdict/evidence digest map>
protected_continuity: PASS | FAIL | BLOCKED_PENDING_VERIFICATION
final_process_socket_worktree_continuity: PASS | FAIL | BLOCKED_PENDING_VERIFICATION
issues: []
confidence: <0..1>
exact_script_sha256: <digest>
exact_schema_sha256: <digest>
exact_evidence_manifest_sha256: <digest or null>
```

This contract authorizes only future exact script/evidence review. It does not authorize probe execution, Plan mutation, implementation, Claude/auth use, G0, or live acceptance.
