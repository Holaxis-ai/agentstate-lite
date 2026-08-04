---
type: Context Note
title: Revision 3 T3.5 R6 refined host-probe repair-contract acceptance
actor: codex-precompact-v3-r6-repair-contract-acceptance-r4
timestamp: '2026-08-04T02:10:12.192Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**.

The refined exact contract materially closes every prior R2/R3 safety-policy ambiguity except two load-bearing state rules. First, CHECK_1 makes an abort acknowledgement mandatory for every recorded fixture role, but H4's required normal descendant-first teardown can reap a recorded role during PRIMARY before FENCE creates the abort it would have to acknowledge. The success trace is therefore unable to reach CHECK_1. Second, a CHECK_2 mismatch returns to DRAIN without stating that the original 40-round/5-second budget is cumulative across re-entry; a builder can reasonably reset it and create an unbounded fixed-point loop. These are small wording repairs, not architectural reversals, but the current exact model still contains one impossible acceptance rule and one builder-selected safety policy.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether the exact refined R3 host-probe repair contract supplies a complete, bounded, third-party-checkable controller policy for one final builder cycle; this serves the ultimate goal by preventing unsafe premise-gathering code while allowing a mechanically specified final repair to proceed.

## Exact reviewed inputs and isolation

I read in full and verified the single-version histories of:

- refined system model `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8174e0a3af95129cb044fa0748a4878e0d8cf39f955596b51de67e2f6f963235`; and
- prior acceptance `context-notes/precompact-v3-t35-r6-host-probe-r3-contract-acceptance@sha256:f490438e87d98f603abb61de6191134ef279f2d6a1d3ef46326883182c687de0`.

I did not inspect or communicate with the skeptic. I did not inspect or edit candidate/source bytes, run a candidate or test, invoke tmux or Claude, use auth or candidate-facing network, or touch the Plan, task, code, or repository. The distinct acceptance note and required board sync are the only mutations.

## Blocking contradictions and minimum repairs

### 1. Normal H4 teardown cannot satisfy CHECK_1

The contract defines only abort acknowledgements: a pane parent or marked child writes its ack when it sees the FENCE abort, then exits. Both roles may instead exit by “normal teardown.” H4 explicitly must demonstrate the descendant-first happy-path order during PRIMARY, before the subsequent FENCE creates `abort.json`.

CHECK_1 nevertheless requires every created fixture to be `record+ack+absence`. A role that self-recorded and was normally reaped in H4 has a record and exact absence, but it can never observe the later abort or create its abort ack. It is not `unseen`, either. Consequently the required success trace cannot enter CHECK_1 without fabricating an ack, weakening H4, or moving abort before normal teardown.

Minimum wording repair: define a recorded role as terminal only when its anchored identity is exact absent and it has exactly one of:

- a matching create-only abort ack; or
- a controller normal-teardown receipt tied to the same anchored PID/start/UID/PGID and containing the fresh pre-signal identity check, signal/group action, and terminal PID/group absence.

Then replace CHECK_1's `record+ack+absence` predicate with `record + (abort-ack | normal-teardown receipt) + exact absence`. Keep the existing `unseen`/`not_created` rule unchanged. An abort ack must never substitute for an already claimed normal-teardown receipt, and neither receipt may promote primary evidence.

### 2. CHECK_2 invalidation can reset the numeric bound

DRAIN is limited to 40 rounds and 5 seconds, but CHECK_2 says that a difference “returns to DRAIN with streak zero.” The contract does not say whether a re-entry gets a new round counter and deadline. Repeated late records or scan differences can therefore cause unlimited DRAIN/CHECK cycles under a conforming per-entry interpretation. The fixed-point bound is load-bearing and cannot be left to the builder.

Minimum wording repair: initialize one monotonic `drain_started`, `drain_deadline = drain_started + 5 seconds`, and `drain_rounds_remaining = 40` when FENCE seals. Every DRAIN round and every CHECK_1/CHECK_2 attempt consumes that same non-resettable budget; the 100 ms gap counts against the deadline. A CHECK_2 mismatch clears the clean candidate but never resets the deadline or round count. Exhaustion at any state transitions directly to contained TERMINAL FAIL with no unlink or further control.

## Prior attacks that now survive

### Negative-server binding and recovery

The before tuple, random 96-bit socket nonce, exact code-0 decimal PID, single fresh row, release time, UID, pinned comm, `PGID=PID`, nonce/socket command token, known-control exclusion, and new owned socket generation form a closed signal anchor. Missing, multiple, stale, or contradictory matches prohibit PID signaling. Any negative-query anomaly executes exactly one preregistered closed socket kill-server vector and permits no recursive PID query or later tmux recovery. Recovery receipts, audit, PID/group absence, and socket disposition remain mandatory. This closes the prior “socket exists but row is not causally bound” counterexample.

### Closed control budget and post-fence monotonicity

The model names eight ordered PRIMARY controls, suppresses all later primary controls on the first exception, permits at most one absent-query contingency, and bounds all original-server recovery controls so every trace is at most ten. Combined inventory and direct anchored H4 signaling remove the otherwise additional clients. Every fixture/recovery control is an anchored Node gate in the same ledger. FENCE seals `creator_epoch`; after that, any spawn, release, or tmux invocation is an internal FAIL and DRAIN/CHECK cannot recurse into recovery. This is a third-party-checkable build rule; candidate static review must still verify its actual control ledger and trace enumeration.

### Monotonic abort and creator quiescence, apart from blocker 1

Abort paths, mode, schema, nonce, creator epoch, per-role ack paths, pre-spawn/pre-record/wait/lifetime checks, and 15-second hard role lifetime are concrete. The creator DAG is fenced before dependent absence. Unseen roles remain provisional until upstream client/server surfaces are closed, abort spans two fresh checks, audits are clean, and inventories agree. This closes the late-child path. Only the normal-teardown terminal alternative is missing.

### Fixed-point observations, apart from blocker 2

FENCE, DRAIN, ps retry, poll, gap, and role-lifetime numbers are stated. The normalized inventory includes every descriptor, record/ack digest, handle/EOF state, PID/group absence, socket generation, exact audit-hit set, errors, and creator epoch. New evidence, actions, transitions, socket/audit changes, or observation errors invalidate cleanliness. CHECK_2 is independently fresh and digest-equal. This is reproducible once its budget is explicitly cumulative.

### Persistent observer failure and anchored-only signaling

Three ps attempts inside 500 ms, direct anchored handles, finite socket recovery, monotonic abort, hard role lifetimes, and final containment waits operate independently of clean observation. Persistent failure retains sockets and returns FAIL; it never authorizes unlink or PASS. Direct resources require create-only/live-handle anchors and fresh PID/start/UID/PGID/command/group equality; indirect pid-null roles rely only on abort/quiescence/lifetime; negative servers require the exact decimal-PID anchor. Current audit rows, exited handles, missing identities, and contradictions cannot be adopted.

### H2, frozen input, worktree, scope, and evidence

H2 remains a pure one-argument computation over recursively frozen facts with no writer/path/index/filesystem/callback/closure/action-receipt capability. Canonical non-symlink root identity, exact types/modes/current UID/link counts/paths/digests, manifest binding, and terminal checks remain complete. Empty status/diff/cached-diff receipts are initial and terminal preconditions. Primary versus cleanup provenance, no verdict promotion, strict receipts/readback, exact H1-H5 scope, host-only constraints, and the explicit nonclaims remain coherent.

## Effective-line feasibility

The refined rules do not make an at-most-800-effective-line implementation inherently impossible. A single table-driven descriptor model, one generic anchored Node gate, one normalized inventory function, and one finite teardown loop can express them without production-policy additions. The bound is itself fail-closed: if the builder cannot implement every rule within it, it must return unfrozen FAIL. This is not a blocker to a future cycle, but it does not excuse weakening either repair above or any survived invariant.

## Decision

**FAIL. Build authorization: NO.** Apply only the two minimum wording repairs above and repeat exact contract acceptance. No candidate edit or freeze is authorized from `sha256:8174e0a3af95129cb044fa0748a4878e0d8cf39f955596b51de67e2f6f963235`.

[tracked by](../tasks/pre-compact-multi-session.md)
