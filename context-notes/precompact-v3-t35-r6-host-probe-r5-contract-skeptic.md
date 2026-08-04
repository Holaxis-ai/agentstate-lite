---
type: Context Note
title: R6 R3 final host-probe build-authorization skeptic
actor: codex-precompact-v3-r6-repair-contract-skeptic-r5
timestamp: '2026-08-04T02:20:05.429Z'
---
# Summary

Status: complete; final independent static build-authorization review.

Verdict: **FAIL**. Confidence: **0.97**.

Build authorization: **NO**. Execution remains closed.

The exact model closes the R4 review's stated defects. Its principal classes are finite and disjoint; the action-control trace remains below ten after fixture/server gates are classified separately; `ps`/Git helpers are synchronous, SIGKILL-bounded, sequential, and reaped; direct gates have parser-independent termination through their original live child handles; unseen roles are bounded from last creator close; rounds and deadlines are cumulative; and socket generations are owned only inside exact registered action intervals. Those are mechanically implementable controller rules.

One final contract-level counterexample remains. A negative query can anomalously create a detached server without producing a usable decimal PID. The sole recovery `kill-server` control can then time out or fail before killing that server. The recovery control itself is safely killed through its direct handle, but the detached server is not: the model prohibits a second tmux action, prohibits audit-only PID adoption, and persistent observation failure supplies no exact signal anchor. Nevertheless the bound-exhaustion path calls the result “contained TERMINAL FAIL.” That containment claim is false for this reachable failure trace.

The required repair is architectural, not cosmetic: before releasing a negative query, the controller must hold a second, observer-independent capability that contains any server the query could create even if the socket recovery client fails. The simplest shape is a query envelope that prevents an anomalous server from daemonizing outside the query's already anchored direct handle/process group. Otherwise a separately anchored, already-present supervisor must own that exact server and have a non-tmux, non-`ps` termination capability. Another recovery retry or a looser audit adoption rule is insufficient.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: perform the final adversarial authorization review of the exact R3 host-probe repair contract; this serves the ultimate goal by preventing a premise-gathering probe with a failure-created orphan from entering implementation.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.97
  build_authorization: false
  execution_eligibility: CLOSED
  static_only: true
  artifact: context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c
  prior_fail: context-notes/precompact-v3-t35-r6-host-probe-r4-contract-skeptic@sha256:f73c4f6b7266f69aa8107aa78e8273338dd4c1120f0093a4e8c9e3acffbc8ee9
  blocker:
    id: UNANCHORED_NEGATIVE_SERVER_SURVIVES_FAILED_RECOVERY_CONTROL
    severity: critical
  note: context-notes/precompact-v3-t35-r6-host-probe-r5-contract-skeptic
```

## Exact review boundary

I read in full and reviewed only:

- `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c`; and
- `context-notes/precompact-v3-t35-r6-host-probe-r4-contract-skeptic@sha256:f73c4f6b7266f69aa8107aa78e8273338dd4c1120f0093a4e8c9e3acffbc8ee9`.

The bundle returned both exact requested versions. I did not inspect candidate/source/contract bytes or the product reviewer; run a candidate, host test, tmux, or Claude command; use auth/network; or mutate repository code, Plan, tasks, or any shared note other than this distinct review.

## Critical counterexample — the sole negative-server recovery is not failure independent

The model deliberately supports a negative-query anomaly with no signalable PID:

- missing, multiple, stale, or contradictory rows never authorize signaling;
- the anomaly ends PRIMARY;
- FENCE runs one preregistered `[TMUX, "-S", socket, "kill-server"]` control; and
- no later tmux query or recovery is allowed.

That is finite, but finite is not the same as containing. The recovery action is another fallible process. Its direct handle contains only that control client, not a server already daemonized by the anomalous query.

Reachable failure trace:

1. The exact before tuple proves no nonce process and the original server absent.
2. The `tmux -N` query violates its premise, creates a new detached server on the exact private socket, and returns malformed/nondecimal output or rows that are missing/ambiguous. No PID anchor is authorized.
3. FENCE releases the sole recovery-kill gate.
4. That tmux client times out, exits nonzero before effect, or hangs before issuing `kill-server`.
5. The controller safely TERM/KILLs and reaps the recovery client through its original live `ChildProcess` handle. Its mandatory effect/absence receipt is false or missing.
6. The unexpected server remains live. It is not a direct child represented by the recovery handle.
7. DRAIN may see it, but the exact contract permits signaling an unexpected server only through the decimal-PID query anchor. A unique later audit row is intentionally insufficient. If `ps` also fails or remains ambiguous, no exact process signal is possible.
8. No further tmux action is legal after FENCE. The cumulative deadline expires and transitions to so-called contained TERMINAL FAIL, retaining a live server/socket.

This does not require malicious same-UID interference or PID reuse. It uses two failure modes the controller explicitly claims to contain: negative-query autostart without a usable PID and action timeout/failure. H1's earlier successful `kill-server` observation does not make a later recovery client infallible; the action runner retains timeout/error paths precisely because it is not.

The socket ledger correctly prevents unsafe unlink, but retaining the owned socket while its server remains live is evidence preservation, not zero-survivor containment.

## Minimum architecture change

Do not repair this by adding another ordinary tmux retry. That merely moves the same terminal failure one slot later. Do not authorize a current PID from a private path alone; that weakens the exact-identity invariant.

Before any absent-server query is released, establish one bounded observer-independent containment envelope for a server that query could create. Acceptable architecture shapes are:

1. **Non-daemonizing query envelope:** execute the query so any anomalously created server is structurally retained within the query gate's already anchored direct process handle/group. FENCE can then terminate and reap the whole envelope without `ps` or another tmux client. Static review must verify that the exact pinned vector really enforces this relationship on the tested host.
2. **Pre-existing exact supervisor:** preregister and start a supervisor before the query. It must causally own the exact nonce socket/server, survive the query client, and possess a non-tmux, non-`ps`, PID-reuse-safe termination capability. Its own process/handle/EOF/lifetime must join the principal table and cumulative bound.

If neither is feasible on Darwin/tmux, the safe architecture is to reject the negative-query experiment as not self-containable rather than run it. A named external quarantine could also contain it, but that is an expanded execution architecture and must be reviewed explicitly before authorization.

Once such an envelope exists, the current socket recovery control may remain as the ordinary cleanup path; the envelope is the hard fallback when that control or observation fails.

## Invariants that survived final falsification

- The exhaustive principal model separates exactly two server gates, two fixture-client gates, four indirect roles, bounded action controls, and one synchronous helper.
- Fixture and server gates are no longer hidden in the action-control count.
- The failure-point arithmetic is conservatively below ten action controls. The H1-query-anomaly trace actually uses four primary plus two FENCE recoveries, not the prose's four-plus-one, but it still remains below the stated bound and all principals are registered.
- Node direct gates are terminated only through an original still-open child handle, then awaited through close and both EOFs; no closed/current PID is adopted.
- Synchronous absolute-vector `ps`/Git helpers use SIGKILL, capped output, sequential invocation, reaping before return, one-live-helper, and a global invocation cap.
- Terminal helpers use the same primitive, so they do not create an untracked post-CHECK process class.
- Fixture abort has exact monotonic schema; pane/child checks and a 15-second role lifetime close delayed starts.
- The unseen-role deadline is conservatively tied to `last_creator_close_ns + 15 seconds + 250 ms`; direct records may extend but cannot shorten it.
- One cumulative round/deadline budget survives re-entry; observer errors and all inventory mutations reset only the clean streak.
- CHECK_2 is a fresh, no-action, digest/epoch-identical inventory and cannot reuse CHECK_1 observations.
- Recorded normal and abort terminal alternatives are same-anchor and require exact PID/group absence.
- Socket generation ownership is append-only and tied to exact registered release-to-close intervals; rebound/coexistence/post-FENCE generations fail closed; UNLINK uses only the latest exact authorized generation or exact already-absent disposition.
- Ambiguous/current/reused PIDs never authorize signaling or unlink.
- Pure one-argument H2, frozen source/file/worktree facts, primary-versus-cleanup provenance, strict receipts/EOF, H3 concurrency, H4 ordering, Git/evidence/verdict checks, H1-H5-only scope, and the exclusions of product lifecycle/CAS/lease/scheduler/schema authority all remain intact.
- The at-most-800-effective-line rule is fail closed: inability to implement the architecture within it returns an unfrozen FAIL, never a weakened candidate.

## Final decision

**FAIL — build authorization NO; execution remains CLOSED.**

Confidence: **0.97**.
