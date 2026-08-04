---
type: Context Note
title: R6 R3 refined host-probe repair-contract skeptic
actor: codex-precompact-v3-r6-repair-contract-skeptic-r4
timestamp: '2026-08-04T02:11:12.280Z'
---
# Summary

Status: complete; independent static repair-contract review only.

Verdict: **FAIL**. Confidence: **0.98**.

Build authorization: **NO**. Execution remains closed.

The refined model closes the prior review's principal architectural holes. Its phase order is monotonic with respect to tmux creation; the negative-query anomaly has a finite recovery action; creator epochs and normalized clean inventories invalidate stale checks; fixture abort is persistent and visible to late roles; indirect roles have hard lifetimes; and ambiguous/current PID rows do not become signal authority. Those repairs survive adversarial review.

Two critical finite-closure defects remain. First, the stated eight-primary/ten-total control budget omits fixture `new-session` controls that the model itself classifies as controls. Second, persistent observation failure plus a hung direct control/helper has no independent termination route: a deadline is only a time limit, and signaling still requires the unavailable fresh process observation. The latter is recursive for a timed-out `/bin/ps` helper itself. The post-CHECK terminal observers share the same hole. A recovery socket generation also lacks the exact before/after ownership transition required by UNLINK.

Under the rule that any recursive, non-mechanical, or ambiguity-unsafe rule is FAIL, the final builder may not choose these policies while editing.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: re-review the refined exact R3 repair contract before authorizing its final code attempt; this serves the ultimate goal by ensuring a premise-gathering probe has a finite, mechanically reviewable containment boundary.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.98
  build_authorization: false
  execution_eligibility: CLOSED
  static_only: true
  artifact: context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8174e0a3af95129cb044fa0748a4878e0d8cf39f955596b51de67e2f6f963235
  prior_review: context-notes/precompact-v3-t35-r6-host-probe-r3-contract-skeptic@sha256:27ad5d52c9781a09fc848fdf363fab76dd64173856945c9233f48ba2a1f0f3d6
  blockers:
    - id: CONTROL_LEDGER_OMITS_FIXTURE_CREATORS
      severity: critical
    - id: OBSERVER_FAILURE_DIRECT_HANDLE_DEADLINE_IS_NOT_CONTAINMENT
      severity: critical
    - id: TERMINAL_OBSERVERS_OUTSIDE_FIXED_POINT
      severity: high
    - id: UNKNOWN_ROLE_START_HAS_NO_CREATOR_RELATIVE_WAIT_BOUND
      severity: high
    - id: RECOVERY_SOCKET_GENERATION_NOT_EXACTLY_ADOPTED
      severity: high
  note: context-notes/precompact-v3-t35-r6-host-probe-r4-contract-skeptic
```

## Exact review boundary

I read in full and reviewed only:

- `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8174e0a3af95129cb044fa0748a4878e0d8cf39f955596b51de67e2f6f963235`; and
- `context-notes/precompact-v3-t35-r6-host-probe-r3-contract-skeptic@sha256:27ad5d52c9781a09fc848fdf363fab76dd64173856945c9233f48ba2a1f0f3d6`.

The bundle returned both exact requested versions. I did not inspect candidate/source/contract bytes or the product reviewer; execute a candidate, test, tmux, or Claude command; use auth/network; or mutate repository code, Plan, tasks, or any shared note other than this distinct review.

## Critical blocker 1 — the finite control count is internally inconsistent

The model says PRIMARY has **exactly eight** possible executed controls and enumerates:

1. server PID observation;
2. combined sessions-plus-panes inventory;
3. H1 kill-server;
4. H1 absent-server query;
5. H3 owner action;
6. H3 successor action;
7. H4 server-after-descendants action; and
8. H5 absent-server query.

It later expressly says “Every control, including fixture `new-session` and recovery kill, is a Node self-record/release gate.” No fixture `new-session` appears in the eight slots. H4's server-first and descendant-first fixture branches necessarily submit fixture creation; the named “server-after-descendants action” is at most one of those controls and cannot also be both branch-creation clients in the declared closed order. Original server-start gates and any remaining inventory controls likewise need an explicit classification even if the budget deliberately counts only clients rather than servers.

Therefore the proof “eight primary plus at most two FENCE recovery controls, hence no trace above ten” does not follow from the ledger. At minimum, adding the two fixture clients makes the advertised trace twelve; if only one fixture client is actually intended, the model must say which branch reuses it and how that remains possible after the server-first branch kills its server.

This is not bookkeeping. Every omitted gate is a creator handle that can be live at each primary failure boundary and must be closed in FENCE. An omitted slot defeats pre-registration, `creator_epoch`, unused=`not_created`, handle/EOF inventory, and the global action bound simultaneously.

Minimum repair: replace the prose count with one finite slot table. For every possible tmux invocation, name `slot_id`, phase, socket, exact vector, maximum executions (normally 0/1), creator/server effect, prerequisite, handle/EOF descriptor, and failure recovery. Include server-start gates, every fixture `new-session`, every inventory/answerability/query/kill client, and both possible FENCE recovery kills. Derive the numeric maximum by summing executable slots subject to the stated first-failure suppression. The final number may exceed ten; bounded exactness matters more than preserving ten.

## Critical blocker 2 — a deadline does not contain a hung direct process

The refined model correctly says persistent `ps` failure cannot PASS and requires aborts/recovery actions plus waiting until all direct-handle deadlines. It does not give every direct process an observer-independent termination mechanism.

Reachable combined failure:

1. a self-recorded Node gate is released and execs a tmux control, or a `/bin/ps` observation helper is spawned;
2. the control/helper fails to close by the FENCE or observation deadline;
3. all three fresh `/bin/ps` attempts time out or are parser-ambiguous;
4. signaling is prohibited because the contract requires a fresh exact PID/start/UID/PGID/command/group match immediately before every signal; and
5. the controller reaches the direct-handle deadline with a still-live anchored process.

The contract then has no legal next transition. Returning FAIL strands the process. Waiting violates the numeric bounded-return claim. Retrying `ps` creates more observer processes and is recursive; if the timed-out process is the `ps` helper itself, cleaning it by first launching another `ps` is exactly the unbounded principal-creation pattern the state machine was meant to remove. A live `ChildProcess` object and an expired deadline are anchors/evidence, but neither causes termination under the current signal rule.

The same issue can occur before FENCE seals. FENCE is required to finish within five seconds and prove every released control handle closed. If one does not close, the model gives neither a legal sealed DRAIN entry nor a bounded unsealed containment state.

Minimum repair: add every spawned observer/helper and direct gate to the finite descriptor table and give each one an exact containment route that does **not** require launching the same failed observer. The contract must explicitly choose one safe mechanism, for example:

- a controller-owned direct-handle rule that permits one TERM/KILL sequence only while the original handle has not emitted exit/close and the pre-release birth identity/PGID still matches a non-`ps` pinned observer; or
- an independently supervised wrapper with a hard monotonic self-termination deadline that remains present after launching the subject process and whose own PID/group/close are preregistered and audited.

Whichever mechanism is chosen must address PID reuse, the wrapper/helper itself, EOF/close lag, and bound exhaustion without adding an untracked watchdog. Merely saying “hard deadline” or “wait deadline” is insufficient. If exact containment cannot be established, the script must remain running under a named already-present external supervisor; it may not return and claim no survivor.

## High blocker 3 — TERMINAL creates observer principals after the fixed point

`CHECK_2` requires all controller handles closed. `UNLINK` then mutates socket disposition, and TERMINAL performs another process/protected/worktree audit. Those audits necessarily create at least `ps`/Git helper processes unless the implementation has a pinned in-process observer, so they are new test-owned handles created after the fixed point. The model says a terminal anomaly records FAIL and leaves evidence, but it supplies no transition back to containment and no independent rule for a terminal helper that times out.

Minimum repair: classify all TERMINAL helpers in the finite slot table, await strict exit/EOF/close, and apply the observer-independent containment rule above. Define the authorized socket transition `owned_generation -> unlinked` so terminal absence is expected rather than a generation anomaly. After the last terminal helper closes, only in-process bounded file hashing/readback may occur; no further subprocess can be needed to prove the previous subprocess absent.

This does not require another tmux action or another generic fixed-point loop.

## High blocker 4 — an unseen role's lifetime must be measured from last possible creation

The pane and child have a useful 15-second lifetime “from process start.” When audit and record parsing both fail, the controller does not know that start time. The phrase “waits until the later of the 15-second role lifetime” is therefore not mechanically computable for a provisional-unseen role.

Minimum repair: record `last_fixture_creator_closed_monotonic` only after the fixture client, private server, and any already-recorded pane creator are terminal. On an unproven/FAIL path, do not return before `last_fixture_creator_closed_monotonic + 15 seconds + fixed scheduling margin`. A role that could have started at the final creator transition is then past its controlled hard lifetime. Directly recorded role start times may extend, but never shorten, this conservative bound. Any terminal late role hit restarts this wait before return FAIL; it cannot merely be reported.

## High blocker 5 — recovery-created socket generations need exact ownership adoption

The negative query has an exact before tuple and a strict rule for adopting a new generation attributable to a decimal-PID anomaly. The FENCE recovery vector intentionally may create-and-kill a zero-session server even when no server existed. That action can create a different socket dev/inode. The model later requires CHECK inventories to contain an exact owned generation and UNLINK to remove only an unchanged owned socket, but it does not state how the recovery-created generation becomes owned when no decimal unexpected-server PID was anchorable.

Minimum repair: each recovery-control slot records exact pre-release lstat absence/prior generation and exact post-close lstat. A new socket generation is adoptable only as the unique private-root/96-bit-nonce effect between those observations while no other creator slot was open; store its dev/inode/type/mode/UID and originating slot. After FENCE seals no generation may be adopted. UNLINK compares the latest anchored generation immediately before removal. Missing, multiple, or contradictory generations retain the socket and FAIL. TERMINAL treats exact absence after authorized unlink as its expected disposition.

## Attacks the refined model survived

The following prior blockers are genuinely closed and should be preserved:

- `PRIMARY -> FENCE -> DRAIN -> CHECK_1 -> CHECK_2 -> UNLINK -> TERMINAL` is a finite local controller model, not product lifecycle authority.
- A primary failure suppresses later primary actions; no tmux action is permitted after FENCE seals.
- Each absent query has one preregistered recovery descriptor; the first anomaly stops PRIMARY, and no recovery query recursively follows recovery.
- A query anomaly with a unique decimal PID uses exact release time, UID, start, PGID, command, socket nonce, control exclusion, and new owned generation before signal.
- A query anomaly without a unique decimal PID authorizes no PID signal; private-socket recovery runs, clean proof remains required, and ambiguity cannot PASS.
- Abort is a monotonic private file with exact schema/nonce/epoch; pane and child check before creation/wait and acknowledge create-only before exit.
- The fixture client -> server -> pane -> child creator DAG is explicit; provisional unseen cannot become terminal before upstream creator closure plus two fresh checks.
- DRAIN has numeric rounds/time/retry/poll bounds; exhaustion and every observation error prevent a clean pass.
- Normalized inventory includes descriptor, records/acks, handle/EOF, exact identity/group absence, socket generation, audit-hit set, observer errors, and creator epoch.
- Any record, ack, handle transition, signal/action, socket change, audit-hit change, or observer error resets the clean streak.
- CHECK_2 is an independently fresh observation after a no-action gap; digest and creator epoch must match CHECK_1.
- Same-UID numeric PID reuse cannot become ownership: current rows, exited handles, pid-null roles, ambiguous rows, and stale negative-query rows never authorize signaling.
- Persistent observer failure cannot manufacture PASS or authorize unlink; primary and cleanup evidence remain separate.
- H2 is a pure one-argument frozen-facts computation with no writer/path/receipt reachability.
- Frozen source/root/file/worktree and terminal provenance rules, H3 concurrency, H4 ordering, strict receipts/EOF, Git observer, evidence cap, H1-H5-only scope, and exclusions of Claude/auth/network/CAS/lease/scheduler/schema/verdict authority remain intact.

## Exact minimum next step

Amend the repair contract once more with:

1. the exhaustive control/helper slot table and derived global count;
2. an observer-independent hard containment rule for each direct gate/helper, including FENCE and TERMINAL timeout paths;
3. creator-relative unseen-role return deadlines; and
4. recovery socket-generation adoption plus authorized unlink disposition.

These are finite controller-safety rules, not product scope expansion. Freeze the new model digest and repeat this independent authorization check. Do not edit candidate source until PASS on the exact model. A later model PASS would authorize building only; exact-byte product and skeptic source reviews would still be required before execution.

## Final decision

**FAIL — build authorization NO; execution remains CLOSED.**

Confidence: **0.98**.
