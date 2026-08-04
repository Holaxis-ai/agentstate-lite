---
type: Context Note
title: Revision 3 T3.5 R6 final host-probe repair-contract acceptance
actor: codex-precompact-v3-r6-repair-contract-acceptance-r5
timestamp: '2026-08-04T02:21:25.314Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**.

The final contract closes both R4 blockers and almost all cross-interaction ambiguity. One load-bearing protocol remains impossible as written: a marked child that starts after FENCE must check abort before self-record, avoid waiting for controller acknowledgement, and nevertheless write an abort ack containing its anchored PID/start/UID/PGID. At that point the child has neither a creation record nor controller-supplied identity, and exact start/PGID require the `/bin/ps` observation that the contract reserves to one controller-owned synchronous helper. Implementing the ack therefore requires the builder to invent a second observer/serialization protocol or violate the abort-order and helper rules.

This is the smallest counterexample and is sufficient to reject build authorization. Per the final-review instruction, the circuit breaker should trip rather than silently authorize or iterate the same contract.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether the final exact R3 host-probe repair contract is implementable and mechanically reviewable without unresolved controller safety policy; this serves the ultimate goal by allowing one bounded builder attempt only after the premise-gathering rail is structurally safe.

## Exact reviewed inputs and isolation

I read in full and verified the single-version histories of:

- final system model `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c`; and
- prior FAIL `context-notes/precompact-v3-t35-r6-host-probe-r4-contract-acceptance@sha256:16f78f9104432ee89b13a5b07483321114f0d6f80f14d5fcb4512d2446a09930`.

I did not inspect or communicate with the skeptic. I did not inspect or edit candidate/source bytes, run a candidate or test, invoke host/tmux/Claude/auth actions, or touch the Plan, task, code, or repository. The distinct acceptance note and required board sync are the only mutations.

## Blocking counterexample

Consider a pane parent that passed its pre-spawn abort check just before FENCE created `abort.json`, then spawned its marked child after the abort became visible.

The contract requires all of the following:

1. the marked child checks abort **before self-record**;
2. a child starting after fencing terminates without waiting for a late controller acknowledgement;
3. a role that sees abort writes a create-only ack containing `role`, `nonce`, anchored `PID/start/UID/PGID`, and `phase`; and
4. every `/bin/ps` observation uses the single controller-owned synchronous helper primitive, with at most one helper live and one global invocation counter.

The child knows its PID, UID, nonce, and phase. Standard Node process state does not supply the exact kernel process start and PGID used by the controller's fresh `/bin/ps` identity checks. Because it has not self-recorded, the controller has not observed or acknowledged an anchor. Because it must not wait for acknowledgement, the controller cannot attach the missing fields before exit. If the child spawns its own `/bin/ps`, it is no longer using the controller-owned primitive and cannot participate in the global one-live-helper/counter invariant. If it first runs the existing self-record/ack protocol, it violates the required pre-self-record abort branch and late-ack independence.

Thus the fully anchored abort ack cannot be produced by a conforming implementation on the exact late-child path the abort protocol exists to contain. Treating the ack as merely self-asserted would also weaken the anchored-only rule.

## Minimum architecture change

Make the indirect-role creation record precede abort acknowledgement, while preserving immediate fail-closed exit:

- On process entry, the marked child first create-only writes an identity record containing the self-knowable tuple `{version, role, nonce, pid, uid, phase}`.
- It then immediately checks abort before any normal acknowledgement wait or other action. If abort exists, it create-only writes an abort ack referencing the identity-record digest and exits without waiting for the controller.
- The controller may attach exact start/PGID only from its fresh synchronous helper when the role is still observable. If the child has already exited, the create-only record plus matching abort ack, closed upstream creators, elapsed creator-relative lifetime, and two clean audits prove contained termination but never authorize a signal.
- CHECK_1's abort terminal cause must accept that record/ack pair without pretending that an unobserved fast-exit role supplied start/PGID. Any role that is signaled still requires the existing controller-validated full anchor.

Equivalently, the ack schema could contain only self-knowable identity plus a record digest, with controller validation stored separately. What is not acceptable is adding a role-owned ps helper or a second shared-helper coordination mechanism; either expands the principal/helper model and requires another full architecture review.

## Attacks that survive

### Prior R4 blockers

Recorded roles now have exactly one terminal cause: matching abort ack or same-anchor normal-teardown receipt with exact signal/server-kill cause and terminal absence. H4's normally reaped descendants and H1's server-caused pane exit can therefore reach CHECK_1 without fabricated abort acknowledgements. The DRAIN/CHECK budget is now one monotonic deadline and 40-round counter created at FENCE seal; re-entry and the 100 ms gap consume but never reset it. Both R4 blockers are closed.

### Exhaustive principals and control trace

The table distinguishes two server gates, two fixture-client gates, four indirect roles, at most ten action controls, and one synchronous helper. Server/fixture gates are not hidden action controls. The explicit failure-point enumeration proves eight ordered PRIMARY controls plus at most two FENCE recoveries, with the first primary exception suppressing later actions. H4 uses anchored group signaling rather than an extra client. The control-count rule is mechanically reviewable and no post-FENCE tmux recursion is permitted.

### Negative servers and socket generations

The exact before tuple, 96-bit nonce path, decimal PID response, single fresh row, release interval, UID, comm, `PGID=PID`, nonce/socket token, known-control exclusion, and owned socket generation form a closed negative-server signal anchor. Missing, multiple, stale, contradictory, rebound, post-FENCE, or wrong-owner generations forbid signal/unlink/clean pass. One preregistered socket recovery is the last tmux action. The append-only interval ledger makes original, query, recovery-created stale, and already-absent socket dispositions distinguishable and fail-closed.

### Direct and observer containment

Timed-out direct gates are terminated only through their still-live anchored ChildProcess handles, TERM then KILL, and must close with both EOFs; no PID row is adopted. Controller ps/git observations use one synchronous, capped, SIGKILL-reaped helper with sequential retries and a retained 2048-invocation bound, so retries cannot strand or overlap helpers. Three attempts/500 ms, persistent-error FAIL, socket retention, hard role lifetimes, and no error-as-clean rules remain coherent. The blocker is specifically the impossible indirect-role pre-record ack, not the controller helper primitive itself.

### Creator-relative quiescence and fixed point

FENCE records the last creator close and seals creator epoch. Unseen roles extend the one deadline to last creator close plus 15 seconds and 250 ms; all waits, polls, checks, and re-entry share it. Normalized inventories include all descriptors, record/ack digests, handles/EOFs, identities, groups, socket ledgers, audit sets, errors, and creator epoch. Every mutation/error invalidates cleanliness; two fresh equal checks are separated by a no-action gap. These rules are bounded and reviewable once the abort record/ack protocol is implementable.

### H2, frozen input, worktree, scope, and line cap

Pure one-argument H2, the no-capability boundary, canonical root/exact file facts, initial and terminal clean-worktree gates, provenance separation, no verdict promotion, exact H1-H5 scope, strict receipts/readback, host-only exclusions, and nonclaims remain intact. The table-driven model is not inherently impossible within 800 effective lines; inability to fit remains an unfrozen builder FAIL, never permission to weaken a rule.

## Decision

**FAIL. Build authorization: NO.** Do not start the builder from `sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c`. The circuit breaker should preserve the repaired model and this counterexample for any future architecture reset; it should not silently initiate a fourth wording iteration.

[tracked by](../tasks/pre-compact-multi-session.md)
