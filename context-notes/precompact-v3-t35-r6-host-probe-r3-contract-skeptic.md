---
type: Context Note
title: R6 R3 host-probe repair-contract skeptic
actor: codex-precompact-v3-r6-repair-contract-skeptic
timestamp: '2026-08-04T01:57:43.182Z'
---
# Summary

Status: complete; static system-model review only.

Verdict: **FAIL**. Confidence: **0.97**.

Build authorization: **NO**. The final R3 host-probe edit remains closed.

The model correctly repairs the rejected R2 architecture at the level of intent: H2 is pure, frozen inputs become machine preconditions, dependent absence follows creator fencing, current PID rows cannot become signal authority, audit failure is not silently skipped, and cleanup must converge rather than merely report a survivor. Those are real advances.

One load-bearing ambiguity remains fatal: the recovery controller is not fully inside its own creator and fixed-point accounting boundary. The model permits private-server cleanup through a tmux control after saying future creation has been fenced. Such a control is itself a test-owned process and a possible negative-server creator. The model does not give a finite phase order that proves every such control is preregistered, started, closed, and reaped before creator quiescence; nor does it say that any post-fence control/action invalidates both clean passes and returns to the fencing phase. Therefore the stated two-clean-pass result is not monotone.

The model also leaves repeated audit failure, late-child abort semantics, and socket generations underspecified. A builder would have to choose safety policy while editing the executable. Under the governing rule that load-bearing ambiguity is FAIL, that is too much unreviewed authority for the final builder cycle.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: adversarially validate the final-repair host-probe system model before any R3 executable edit; this serves the ultimate goal by ensuring premise-gathering infrastructure cannot manufacture evidence or strand a test-owned resource.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.97
  build_authorization: false
  execution_eligibility: CLOSED
  static_model_only: true
  model: context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:0280930c3670a2a62dd8bf262cb4fdbce524a41e88f832718ec8c1d542c05579
  predecessor: context-notes/precompact-v3-t35-r6-host-probe-script-skeptic-r2@sha256:bf0ef260b52a04e20a76cb59006e0fe4a184d07b2a6a2f91fe2f34921662a891
  blockers:
    - id: RECOVERY_CONTROL_REOPENS_CREATOR_SURFACE
      severity: critical
    - id: CLEAN_PASS_HAS_NO_MECHANICAL_INVALIDATION_RULE
      severity: critical
    - id: REPEATED_AUDIT_FAILURE_HAS_NO_COMPLETE_CONTAINMENT_ROUTE
      severity: critical
    - id: ABORT_CAPABILITY_SEMANTICS_AND_BOUND_UNSPECIFIED
      severity: high
    - id: SOCKET_REBOUND_HAS_NO_GENERATION_OWNERSHIP_RULE
      severity: high
  note: context-notes/precompact-v3-t35-r6-host-probe-r3-contract-skeptic
```

## Exact review boundary

I read in full and reviewed only:

- `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:0280930c3670a2a62dd8bf262cb4fdbce524a41e88f832718ec8c1d542c05579`; and
- `context-notes/precompact-v3-t35-r6-host-probe-script-skeptic-r2@sha256:bf0ef260b52a04e20a76cb59006e0fe4a184d07b2a6a2f91fe2f34921662a891`.

I did not inspect or edit candidate source or contract bytes, execute a candidate, invoke tmux or Claude, inspect or contact the product reviewer, use auth/network, or mutate repository code, Plan, or tasks.

## Critical blocker 1 — teardown controls can create after quiescence

The domain model correctly names a requester/control and a possible negative-query autostart as creator surfaces. The failure-path prose then says teardown fences pending clients/requesters/controls and stops or kills private tmux servers and negative-branch servers “through their exact socket/control envelope.” This leaves two incompatible orderings:

1. controls are quiesced before server cleanup, after which server cleanup starts a new tmux control; or
2. controls remain possible through server cleanup, so creator quiescence has not yet occurred.

A recovery `tmux -N -S ...` process is itself a test-owned PID/handle. If its command unexpectedly autostarts or rebinds the private socket, it is also a creator. The negative-branch rule preregisters a possible server “for each absent query,” but the model neither defines a finite number of recovery queries nor prevents a query used to recover a prior query from inducing another server. That is recursive discovery, not a bounded closed resource set.

Reachable counterexample:

1. the controller asserts fixture abort, closes primary clients, and calls the creator set quiescent;
2. audit pass 1 is clean;
3. server cleanup or a negative-server confirmation launches a new tmux control on the private socket;
4. that control starts or observes a rebound server and exits after the pass snapshot;
5. the next pass can miss the short-lived server while leaving its socket, or count as clean before its control handle reaches close; and
6. the controller claims two clean passes although a creator acted between their boundaries.

Private paths and closed vectors make a target safer to identify; they do not make the phase monotone.

Minimum repair: specify a finite, preregistered **fence phase** containing every tmux control that may be used for teardown, including negative-branch recovery. Each control must have a descriptor and live handle, and must reach strict exit plus stdout/stderr EOF plus handle close. All possible servers created by those exact controls must then be harvested and stopped within that phase. No tmux control may start after the fence phase. If any control is nevertheless required later, both clean passes are invalidated and the algorithm returns to the fence phase under the same global finite action budget. Prefer raw process/socket observation—not another tmux query—inside the clean passes.

## Critical blocker 2 — “two consecutive clean passes” is not yet an executable predicate

The model requires repeated harvest, audit, cleanup, and audit until two clean passes, but it does not define what invalidates a clean pass or where a pass begins and ends. Without that, an implementation may reuse a pre-cleanup snapshot, preserve one clean count across a cleanup action, or call a pass clean while a controller-owned child has exited but its streams/handle have not closed.

Minimum repair: define one mechanical pass predicate. A pass is clean only when all of the following are true in the same iteration:

- it begins after the fence phase and after all prior action/control handles are closed;
- record harvesting adds no record and changes no descriptor;
- a fresh strict process audit succeeds and finds no known PID/group, exact private-root command, public marker, or private-socket owner;
- no signal, unlink, tmux control, abort transition, or cleanup action is performed;
- every preregistered descriptor is terminal and mutually consistent;
- every direct child has an exit/close disposition and stdout/stderr EOF where applicable; and
- a fresh socket lstat is consistent with the descriptor state.

Any new record, descriptor change, action, observer failure, late handle close, socket generation, or contradictory fact resets the consecutive-clean counter to zero. Pass 2 must use a new audit and harvest after pass 1, not reuse either snapshot. Put one explicit global iteration/action bound in the contract. Exhausting it is FAIL and never PASS.

The final order must also say that no resource-creating operation occurs after pass 2. If terminal Git/process checks spawn ordinary observer children, they must be awaited through exit, EOF, and handle close and must be structurally incapable of touching either private tmux socket; otherwise they belong before the last pass.

## Critical blocker 3 — repeated observer failure still lacks a complete no-survivor route

The model repairs R2's one-error skip by requiring bounded audit retries and alternate anchored mechanisms. It still does not say what happens when every `ps` attempt fails. A direct Node/tmux child can be awaited through its controller handle, and a private server can be commanded through its socket, but the detached marked child is neither a direct child nor guaranteed to die merely because the controller wrote an abort indication. “Detached fixtures self-terminate through the abort capability” is a desired property, not yet a termination protocol.

This matters because the same model requires a fresh PID/start/UID/PGID sample immediately before a signal and prohibits signaling contradictory identity. When audit is unavailable, the controller cannot both honor that rule and signal a detached PID. It needs a non-`ps`, pre-created containment route with a stated time bound.

Minimum repair:

- Define the abort capability as a monotonic, pre-created object whose aborted state is observable by a child that starts after the transition (for example, inherited EOF plus a private-root abort sentinel checked before fork/block and during wait). A one-shot message that a not-yet-started child can miss is insufficient.
- Require the pane wrapper to check abort before spawning the detached child, and the child to check it before waiting for acknowledgement and to maintain a fixed maximum self-termination deadline.
- After all pane parents and servers are reaped, wait the stated maximum child deadline plus a fixed scheduling margin before final passes if a detached child record was absent or observation failed.
- Treat any failed strict audit as non-clean and force the overall evidence verdict to FAIL. Alternate containment may make exit safe; it must not manufacture primary or terminal evidence.
- If the controller cannot establish terminal disposition by direct close/EOF, exact private-socket shutdown, self-recorded abort acknowledgement, or a later successful fresh audit within the global bound, it must not claim self-contained zero-survivor success. The model must name the already-authorized external supervisor/quarantine that retains the run until the bound completes, or reject execution as unsafe. It cannot leave this choice to the builder.

This remains host-probe containment; it adds no production lifecycle or verdict authority.

## High blocker 4 — the creation DAG and late-fork boundary need one exact order

The prose states the right invariant but not the complete creator DAG. A fixture client can submit `new-session`; the server can later create a pane; the pane wrapper can later create the child. Killing or reaping only the client does not cancel an already accepted server command. Reaping only the pane parent does not prove the child never started unless record harvest follows it. The safe partial order is:

```text
assert monotonic abort
  -> close unreleased gates and stop/reap all submitting clients/controls
  -> stop/reap every private server that can execute an accepted request
  -> reap pane parents / harvest their create-only records
  -> harvest and contain detached children
  -> begin zero-change clean passes
```

The controller may interleave harvest and cleanup earlier, but it may not terminally classify pane/child absence until every upstream creator in that DAG is terminal. Any late record restarts descendant resolution and resets the pass counter.

## High blocker 5 — socket rebound needs a finite generation rule

The model permits negative-server recovery and requires unlink only for “exact unchanged owned-socket identity.” It does not define which identity is authoritative if a test-owned control removes/recreates or rebinds the socket. Retaining only the original dev/inode can strand a later test-owned socket; adopting any current socket can unlink a same-UID unrelated rebound.

Minimum repair: make socket ownership a finite sequence of preregistered generations tied to exact creator actions. For each permitted server-creating action, capture absence or the prior exact lstat before release, then capture the new socket's type/UID/mode/dev/inode while the anchored server/control is live. A later inode is adoptable only when it is the unique before/after effect of an exact preregistered creator and no untracked creator was open. After creator fencing, no new generation is allowed. Final unlink compares the latest anchored generation immediately before unlink and occurs only after its server, group, controls, and owners are terminal. An unanchored rebound is contradictory external state: do not unlink it, do not signal a PID adopted from it, and do not PASS.

This makes socket rebound fail closed without turning same-UID pathname ownership into arbitrary cleanup authority.

## Anchor/PID-reuse attacks

The model's explicit prohibition on current-row adoption is sound and survives. The builder contract should make the accepted anchors mechanical:

- a direct child is anchored only while its original controller handle has not emitted exit/close and an immediate stable sample matches its spawned PID;
- a create-only record binds PID/start/UID/PGID and the exact marker/command before acknowledgement;
- a before/after audit anchor requires a full pre-action baseline, exactly one new matching stable identity, and a confirming second sample; and
- once an original handle/identity is terminal, a current row with the same numeric PID can establish only absence/contradiction, never ownership.

Every signal rechecks the anchored start/UID/PGID/allowed transition in a fresh sample. On an audit failure the controller uses only a pre-created non-PID containment capability; it does not weaken the anchor. This preserves the stated same-UID, non-malicious-host, sampled-TOCTOU nonclaim.

## Invariants that survived adversarial review

The following model decisions are suitable for the final contract and should be preserved:

- one-argument pure H2 over recursively frozen fresh facts, with controller persistence only after return;
- no writer, path, event index, filesystem, callback, closure, or receipt capability crossing the H2 boundary;
- canonical root and exact regular source/contract digests, mode, UID, link-count, type, and clean feature-worktree/HEAD preconditions, repeated terminally;
- strict primary-versus-cleanup evidence separation; cleanup cannot promote a failed assertion;
- exact full process identity, allowed Node-to-tmux transition, group-aware cleanup, and no current-PID adoption;
- pre-registration of ordinary resources and bounded possible negative resources before release;
- create-only fixture records and acknowledgement ordering;
- simultaneous H3 requester observations and handles;
- H4 server-first survival and descendant-first order;
- guarded unlink and exact private-root/socket scope;
- strict code/signal/stdout/stderr/EOF/absence receipts, retained raw evidence, Git continuity, evidence cap, and fail-closed verdict algebra;
- explicit exclusion of Claude, auth, network, product lifecycle/CAS/lease/scheduler/schema/reconciliation/verdict authority; and
- the exactly H1-H5, at-most-800-effective-line boundary.

## Bounded contract for one final builder cycle

This review does not prescribe a generic fixed-point engine. The smallest acceptable controller is a finite phase machine local to the host probe:

```text
PRIMARY (H1-H5, preregistered actions only)
  -> FENCE (monotonic abort; execute/reap the finite teardown-control set;
            stop/reap all server creators and private servers)
  -> DRAIN (harvest; clean anchored descendants; wait close/EOF/deadline)
  -> CHECK_1 (fresh strict zero-change pass)
  -> CHECK_2 (fresh strict zero-change pass)
  -> TERMINAL WRITE/READBACK
```

Any creation-capable action in DRAIN/CHECK returns to FENCE and consumes the same explicit global budget. Any cleanup action or new fact in a check returns to DRAIN and resets the clean count. No tmux control occurs in CHECK. Any audit failure prevents a clean count and forces the evidence verdict FAIL even if containment later succeeds. The controller remains the only writer and teardown owner, but it is not a second product acceptance authority.

This contract is bounded and mechanically reviewable. The present model does not yet state it, so the builder is not authorized to infer it while editing. Amend/freeze the system model or issue these exact repairs as the builder's immutable contract, then obtain a fresh skeptic authorization before source changes.

## Final decision

**FAIL — build authorization NO; execution remains CLOSED.**

Confidence: **0.97**.
