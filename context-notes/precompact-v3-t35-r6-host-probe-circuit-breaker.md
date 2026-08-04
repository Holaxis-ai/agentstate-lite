---
type: Context Note
title: Revision 3 R6 host-probe circuit breaker — architectural fork
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-04T02:25:24.329Z'
---
# Summary

The revision-3 R6 host-probe branch is **blocked before build and execution**. The frozen R2 script was never run and received dual exact static FAIL. Three subsequent exact build-contract review cycles materially improved the controller model but ended with product FAIL (0.99) and skeptic FAIL (0.97), both explicitly requiring the orchestration circuit breaker. No production Plan or implementation is authorized.

The durable result is not “the probe failed.” The team established which host and controller invariants are implementable, and isolated one proof obligation that is not self-containable under the current architecture: freshly testing an absent `tmux -N` query while also guaranteeing that an anomalously daemonized server is reaped when both the query's PID receipt and the sole tmux/ps recovery paths fail.

# Goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal at stop: choose whether revision 3 reuses the already audited v5 no-autostart evidence or expands into a separately reviewed Darwin supervisor architecture; this serves the ultimate goal by keeping unsafe premise-gathering machinery out of the compaction-memory rail.

# Partial Result Report

```yaml
original_goal: produce, dual-review, execute, and independently audit a bounded exact-host H1-H5 probe, then draft and dual-review the repaired revision-3 Plan
decomposition_still_valid: partially
recovery_recommendation: escalate

completed_tasks:
  - task_id: accepted-host-evidence-v5
    deliverable_summary: exact explicit-argv0 Node-to-tmux, commandless server, -N client, FD close, process-group cleanup, stale-socket, and protected-state evidence
    still_valid: yes
  - task_id: r6-boundary
    deliverable_summary: strict separation between host facts and future lifecycle/CAS/lease/scheduler policy
    still_valid: yes
  - task_id: r6-script-r1-r2-static
    deliverable_summary: preregistration, stable Node-to-tmux transition, group/client/handle teardown, Git nonmutation, simultaneous H3, strict receipt, digest, terminal, provenance, scope, and line-cap repairs survived exact review
    still_valid: yes
  - task_id: r6-controller-model
    deliverable_summary: pure H2 observer; exhaustive principal taxonomy; monotonic abort; finite PRIMARY/FENCE/DRAIN/CHECK state machine; cumulative budgets; synchronous reaped helpers; anchored-only signaling; creator-relative deadlines; socket-generation ledger
    still_valid: yes_except_final_blockers

in_flight_tasks: []

failed_tasks:
  - task_id: r2-script-execution-authorization
    failure_type: cognitive
    failure_reason: exact static reviewers found receipt reachability, root/worktree drift gaps, late creators, parser-dependent cleanup, and unanchored adoption before execution
  - task_id: r5-final-build-authorization
    failure_type: specification
    failure_reason: one indirect-role ack contradiction and one structural negative-query containment impossibility remained after three exact contract cycles

failure_analysis:
  root_cause: the model tried to prove an adversarial negative host property with a bounded self-contained controller even when the property failure can create a daemon outside every remaining exact termination capability
  first_failure_point: treating a fresh absent-query/no-autostart regression as an ordinary test action rather than a potentially capability-creating experiment requiring an external containment envelope
```

# Accepted findings to preserve

- `SessionStart(source=compact)` is the load-bearing supported restore rail; PreCompact/PostCompact cannot inject model context on the installed Claude Code version.
- Revision 3's production direction remains exact full session identity, corrected jq, promote-collision handling, one executable lifecycle authority, CAS-guarded consume, named GC owner, validated schema, and live manual/automatic compaction acceptance.
- Host policy remains split: ephemeral direct hooks use synchronous host join plus exact effect/output; long-lived and cleanup-capable principals require identity/absence contracts; arbitrary unmarked same-UID escape and atomic PID-safe signaling are nonclaims.
- R2's expected-resource preregistration, same-stable Node-to-tmux transition, group-aware teardown, nonmutating Git observer, H3 concurrent requester evidence, closed actions, strict close/signal/EOF/output, dual digests, mandatory terminal/index/teardown readback, evidence bounds, provenance separation, verdict algebra, exact H1-H5 scope, and <=800 fail-closed rule survived.
- The refined model's pure one-argument H2, canonical root/file and clean-worktree gates, finite principal/control taxonomy, monotonic fixture abort, cumulative clean-pass budget, synchronous SIGKILL-reaped observers, creator-relative unseen wait, and action-interval socket ledger survived the final reviews.

# Final blockers

## 1. Negative-query containment architecture

Reachable trace: the absent `tmux -N` query anomalously daemonizes a server but returns no usable decimal PID; its sole finite recovery `kill-server` client then fails before effect. The recovery client's direct handle does not own the detached server. The controller correctly forbids another tmux retry, audit-only PID adoption, and unsafe unlink. With persistent/ambiguous process observation, it has no exact remaining termination capability, so “contained FAIL” would be false.

This cannot be repaired by another assertion, retry, looser PID matching, or prose. Before query release, the architecture needs either:

- a proven non-daemonizing envelope that keeps any anomalous server inside the query gate's anchored handle/group; or
- a pre-existing exact supervisor with non-tmux, non-ps, PID-reuse-safe termination authority over the nonce socket/server.

No such Darwin/tmux mechanism has been established. Introducing one expands the execution architecture and requires a fresh boundary and review.

## 2. Late-child abort record protocol

A child that starts just after FENCE must exit immediately on the existing abort. The rejected model asked it to do so before self-record while also writing an ack containing controller-validated start/PGID, which it cannot know without a second ps/helper protocol.

This blocker is locally repairable if the branch resumes: child first writes a create-only self-knowable `{role, nonce, pid, uid, phase}` record; then checks abort; on abort it writes an ack referencing that record digest and exits. Controller validation is separate; fast-exit record+ack plus closed creators, elapsed lifetime, and two clean audits prove containment but never authorize signaling.

# Architectural fork

## Recommended — reuse audited v5 negative evidence

Remove the fresh absent-query/no-autostart action from the R6 execution obligation and cite the already audited v5 exact evidence for that host fact. Retain a smaller fresh R6 probe for the remaining physical H2-H5 facts and controller-safety mechanisms. This changes the proof obligation, so the strict boundary and acceptance rubric must be explicitly revised and dual-reviewed before any builder resumes. It avoids building a new supervisor solely to re-prove an already observed property.

## Alternative — design an external containment envelope

Pause R6 and research a Darwin-native, pre-existing supervisor that causally owns any server created by the query and can terminate it without tmux recovery or ps-derived PID adoption. The supervisor, its principal/helper/resource bounds, permissions, external state, and cleanup evidence become a new architecture surface. The current <=800-line scratch boundary should be reconsidered rather than silently exceeded.

Relaxing zero-survivor containment or running under manual-cleanup risk is not recommended; it repeats the original calibration error by treating the load-bearing unverified rail as a caveat.

# Exact evidence

- Rejected R2 source: `host-probe.mjs@sha256:757aec7c2068670d7d9ea477105c280ebdff0fae56d3a7ba38406faa3161275c`; never executed.
- Rejected R2 contract: `contract.md@sha256:784a6578a2d6b2558052b060fb5dec20c99271286a1ed9c89c72f732567cd91a`.
- Final reviewed controller model: `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:8294369c4e9e1556806563158a49fa5cd91022e694d6c656c46337912a5c4c1c`.
- Final product FAIL: `context-notes/precompact-v3-t35-r6-host-probe-r5-contract-acceptance@sha256:3bb5d912082b8a61a350f0d05ecbf777e59b211854fbcb3460c827211343e882`.
- Final skeptic FAIL: `context-notes/precompact-v3-t35-r6-host-probe-r5-contract-skeptic@sha256:47e02c2092d78dcf945659891fd1c6bfeb747e45a985a6163411b5dd3e435c33`.

No probe run root was created, no candidate/source/repository/Plan/implementation was changed, and the accepted feature worktree remains clean at `36c741a8173832d75d61a7ab138b5219c4415c66`.
