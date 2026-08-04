---
type: Context Note
title: Revision 3 T3.5 R6 final host-probe repair-contract acceptance
actor: codex-precompact-v3-r6-repair-contract-acceptance
timestamp: '2026-08-04T01:57:16.946Z'
---
# Summary

Status: complete.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**. The final host-probe builder must not edit or freeze candidate bytes from this model yet.

The exact R3 system model closes three of the four R2 defects at the architectural level: H2 is structurally pure, the canonical root and exact files are fully bound, and a clean worktree is an initial and terminal machine precondition. It recognizes the fourth defect, absent-query autostart, but does not close it mechanically. Its negative-server anchoring, creator quiescence, fixed-point, abort, and persistent-parser-failure clauses leave the safety policy to the builder. That is precisely the type of ambiguity this pre-build acceptance gate is meant to reject.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether the exact R3 host-probe repair model closes the R2 blockers with mechanical, bounded controller rules and no production-policy expansion; this serves the ultimate goal by preventing the final probe builder from inventing safety policy inside code.

## Exact reviewed inputs and isolation

I read in full and verified the single-version histories of:

- system model `context-notes/precompact-v3-t35-r6-host-probe-r2-system-model@sha256:0280930c3670a2a62dd8bf262cb4fdbce524a41e88f832718ec8c1d542c05579`; and
- authoritative R2 acceptance `context-notes/precompact-v3-t35-r6-host-probe-script-acceptance-r2@sha256:aeb48a911249d9342ea7043c8900fcadb7f3fc1b4562e59e97e55e29790a56ec`.

I did not inspect or communicate with the skeptic. I did not inspect or edit candidate/source bytes, run a candidate or test, invoke tmux or Claude, use auth or candidate-facing network, or touch the Plan, task, or repository. The required bundle write and sync are the only mutations.

## R2 blockers tested

### Closed: pure H2

The model requires exactly `H2(deepFrozenFacts)`, a recursively frozen fresh-facts value, a plain return value, and controller persistence only after return. It explicitly excludes controller, writer, path, index, filesystem, callback, closure, and action-receipt capabilities. This completely repairs the EventWriter reachability defect without adding an acceptance authority.

### Closed: full root and file binding

The model requires canonical non-symlink identity, exact directory/regular-file types, root/file modes, current UID, link count, exact paths, digests, manifest capture, and terminal recheck. This completely repairs the missing root mode/type/owner gate and coherently binds both reviewed inputs.

### Closed: initial and terminal clean worktree

The model makes empty porcelain status, worktree diff, and cached diff mandatory before H1, binds their stable empty digests, and rechecks clean state and continuity in H5 and terminal teardown. This completely repairs the dirty-but-unchanged worktree path.

### Not closed: bounded no-autostart recovery

The model says a unique before/after audit plus the private socket, UID, and pinned vector **may** anchor an unexpected server, then says to stop it through the private socket. That is not an executable binding or recovery contract. It does not state:

- the exact before/after matching predicate or what observation causally binds a new process row to the socket;
- the exact preplanned control that obtains the server PID from that socket and the receipt that makes the binding valid;
- the exact stop control and evidence order for PID, PGID, socket, and handle absence;
- what happens when the socket exists but the process row omits the run root/vector, or multiple candidate rows appear; or
- how recovery controls remain inside the preserved closed action vocabulary.

Counterexample: an absent query starts a server on the exact private socket; the process audit returns a same-UID tmux row whose command has no run-root/socket token. The present wording permits a reviewer to call the row “unique” and signal it, or to refuse adoption and leave it alive. Neither result is determined by the model. “Private socket owner” is also used by the fixed-point definition without naming an observable that proves ownership using the pinned tools.

Minimum wording repair: require, before each absent query, pre-created descriptors for a closed no-start server-PID query and a closed kill-server control on that exact socket. A negative server is anchored only when the previously absent owned socket appears and the preplanned no-start query returns exactly one numeric PID whose fresh UID/start/PGID/command sample satisfies the closed tmux identity predicate; before/after audit alone never anchors it. Then run the preplanned kill-server control, prove the returned PID and PGID absent, prove a no-start query rejects the socket, and only then allow unchanged-owned-socket unlink. Any missing/multiple/contradictory association forbids PID/group signaling and terminal PASS. Name and count these recovery controls in the closed action vocabulary.

## Additional blocking contract ambiguities

### Quiescence and abort are states without observable evidence

“Closed, aborted, or reaped,” “asserts abort capabilities,” and “only after creator quiescence” do not define an abort artifact/protocol, acknowledgement, race-closing order, or receipt. In particular, the model does not show how a pane parent that passes its first abort check and creates a child after failure fencing is detected, acknowledged, and reaped before dependent absence is classified.

Minimum wording repair: name one create-only, mode-bound abort artifact or already-open controller channel per fixture creator; require the creator to check it immediately before spawn and again immediately after self-record/child creation; define its acknowledgement or exit receipt; and define a quiescence receipt containing every creator descriptor, release-channel disposition, abort observation, direct-handle closure, and anchored PID/group/socket disposition. Dependent absence is terminal only after that receipt is complete.

### The fixed point is not bounded or reproducible

“Two consecutive clean passes under an explicit bound” tells the builder to choose the bound. It does not define a pass, the numeric round/time limit, the separation between passes, inventory continuity, or whether a late record resets the streak. “Repeated bounded” and “stable” are therefore not reviewable properties.

Minimum wording repair: choose numeric maximum rounds, per-round timeout, and poll interval in the model. Define one clean pass as: harvest the complete create-only-record set and its digest; inspect every resource/negative descriptor; audit exact private PID/group/socket/marker identities; close/reap eligible handles; and observe no newly resolved or created identity. Require two clean passes separated by at least one poll with identical inventory digests; any new record, live identity, handle transition, parser error, or cleanup action resets the count. Bound exhaustion is terminal FAIL, never unlink or PASS.

### Parser failure containment has no terminal rule

The model says one `ps` timeout/parser error is retried, but gives no retry count or deadline and no disposition for persistent failure. It also forbids signaling or unlinking on contradictory identity. Those are individually sound constraints, but together they do not establish zero-survivor containment or a bounded exit for detached fixtures and a negative server.

Minimum wording repair: assign a numeric observation retry count/deadline and require every descriptor, before its creator is released, to have a parser-independent containment path: controller-owned live handle for direct children, exact private-socket control for tmux servers, or the concrete acknowledged abort protocol for detached fixtures. Persistent observation failure runs those anchored paths, retains the run root/socket whenever terminal absence is unproven, and returns FAIL. If any bounded-possible resource lacks such a path, preflight refuses execution and the builder returns unfrozen FAIL.

### Audit anchoring remains a policy disjunction

The general anchor alternative “unique private root/marker/socket/closed-vector audit binding” does not specify whether all or any of those fields are required, a baseline exclusion predicate, a single-row requirement, or a fresh revalidation immediately before signal. It can therefore reintroduce the prohibited current-row adoption under a different name.

Minimum wording repair: define each allowed anchor as a closed tuple, not a prose disjunction. For an audit anchor, require a before sample with zero tuple matches, an after sample with exactly one new row matching exact current UID, expected executable/comm, PGID rule, unpredictable run nonce/marker or independently queried socket PID, and fresh unchanged start identity immediately before signal. A socket/path/vector that is not present in the sampled row is not evidence that the row owns it. Zero, multiple, missing-field, stale, or contradictory matches prohibit signaling.

## Requirements that survive and must remain unchanged

- expected-resource preregistration and create-only record/acknowledgement;
- exact stable Node-to-tmux transition and fresh identity checks before signal;
- group-, client-, and handle-aware teardown after leader exit;
- Git no-mutation observer;
- simultaneous H3 requester rows and live handles before designation;
- closed action vocabulary and strict code/signal/stdout/stderr/EOF/absence receipts;
- dual source/contract digest gates and mandatory manifest/index/teardown readback;
- primary versus controller-cleanup provenance and no verdict promotion;
- exact H1-H5 scope, no lifecycle/CAS/lease/reconciliation/production authority, and explicit nonclaims;
- at most 800 effective nonblank/non-`//` lines, with unfrozen FAIL if the safety contract cannot fit.

These repairs stay entirely inside controller/host safety and do not expand production scope.

## Decision

**FAIL. Build authorization: NO.** Repair the model wording above, then repeat this exact pre-build contract acceptance. Only a PASS authorizes a builder to produce new candidate bytes; candidate execution still requires the separately mandated exact-digest product and skeptic static PASS gates.

[tracked by](../tasks/pre-compact-multi-session.md)
