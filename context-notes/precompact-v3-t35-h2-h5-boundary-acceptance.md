---
type: Context Note
title: T3.5 H2-H5 boundary acceptance — FAIL
actor: codex-t35-h2-h5-acceptance
timestamp: '2026-08-04T18:09:49.065Z'
---
# Summary

Status: **complete**.

Verdict: **FAIL**.

Confidence: **0.99**.

`builder_task_eligible: false`

The architecture-option-1 direction is product-calibrated and the exact boundary successfully removes every fresh absent/unverified-target tmux action. However, this exact design has one internally contradictory mandatory ordering rule, so no clean-room builder can implement all of it without choosing which requirement to violate. H4's descendant-first branch B requires the server-B kill control to execute only after creation of the one monotonic fence/abort marker; the construction guard separately requires that no post-fence tmux action exists. The server-B kill control is a tmux action. Boundary repair and exact re-review are required before a builder task may exist.

## Isolation and reviewed versions

I acted only as the independent product/acceptance reviewer. I did not inspect skeptic output or communicate with another reviewer. I performed a static bundle review only: no host probe, tmux process/action, Claude/API/auth/network action, repository code or Plan mutation, parent-task/shared-handoff mutation, or board sync.

Exact inputs reviewed:

- `decisions/precompact-v3-t35-reuse-v5-no-autostart@sha256:db1509fc65afdbffe09ef9e4fae936bd86e94ed7a1055a1677afd78e3218665d`
- `designs/precompact-v3-t35-h2-h5-host-probe-boundary@sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`
- `research/precompact-v3-t35-launch-reaper-host-probe@sha256:2f910d13a66e4a95f886dccf2bfbbb9be9576c17be51cb7e922bcd0a9a18d3cf`
- `context-notes/precompact-v3-t35-host-probe-evidence-audit@sha256:f03b67e1e399631d9f63bb4a0f6afd4edbbdc93bac255a35b88490c626c57a01`
- `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker@sha256:2e450eec67f062100164259a34a575412031f45b31ecac14addacc42e4e7cd6e`

The assigned task was claimed by exact CAS from `sha256:eb8be2491bca3747852beec51491e2ed1839c0c3c4435be6ebe51d01f644b74d` to in-progress version `sha256:810c66eb31f51e11b78a2eb5a8879f03d58ffe94fdd1533930be7d20a30bc7a3` before review.

## Blocking counterexample

### B1 — H4 branch B has no contract-compliant position for the server-B kill control

Mandatory H4 ordering says:

1. create the monotonic fence/abort marker;
2. close every unreleased creator;
3. terminate/reap marked child B and pane B and prove both groups absent while server B remains exact-live;
4. **only then** release the server-B kill control against exact-live server B.

The construction guard also mandates one monotonic abort/fence and says: **"No post-fence tmux action or recovery retry exists."** The server-B kill control is one of the four enumerated tmux action controls.

Minimal exhaustive trace:

- If the controller releases server-B kill after the fence, it satisfies H4 branch B but violates the no-post-fence action guard and therefore the exact-contract FAIL algebra.
- If the controller releases server-B kill before the fence, it satisfies the guard but violates H4's explicit descendant-first ordering and cannot establish the required child/pane absence under the latched late-child abort protocol before killing the server.

There is no third ordering: the action is either before or after the single monotonic fence. This is a specification contradiction, not an implementation detail or host uncertainty.

Minimal repair: define the fence transition so the preregistered server-B kill is explicitly the final authorized action within the fenced descendant-first teardown, and ban tmux actions only after that action's close/both-EOF/identity-absence receipt; alternatively rename/split the earlier abort latch from the terminal no-action fence and state their exact ordering. Either repair changes the exact boundary and requires fresh independent review.

## Acceptance findings that otherwise survived

- **No absent/unverified action:** PASS. E1 alone owns H1/no-autostart; every fresh H2-H4 action requires an exact-live server and owned socket generation, and H5 is passive.
- **Non-promotion:** PASS. The v5 evidence remains Plan input with all five audit limitations and cannot prove schema, canary/privacy recomputability, historical all-process continuity, campaign-time worktree state, or pidfd-like signaling.
- **Question usefulness:** PASS. H2 observes post-client host state without action results; H3 proves distinct physical requester/successor feasibility; H4 contrasts unsafe server-first and safe descendant-first topology; H5 proves bounded passive terminal continuity. Lease/CAS/scheduler/schema/live-Claude policy are explicit nonclaims.
- **Identity and containment model:** PASS apart from B1. Direct handles, create-only records, exact PID/start/uid/PGID/comm/binary anchors, owned socket generations, both EOFs, monotonic abort behavior, late-child record/ack ordering, primary-versus-containment provenance, and protected-state failure rules are sufficiently stated for later byte-exact static review.
- **Fallback/result leakage resistance:** PASS. H2's immutable observation-only argument excludes action results; H4 latches primary topology before fallback; containment cannot convert a failed primary oracle into PASS; H5 cannot freshly promote passive absence into no-autostart.

## Outcome

Closed **FAIL** on exact design `sha256:a4473865ce49e0fc546d8ce2da9fb4deb49c8d5ce4e98c01c581f1ffa9a7b205`. Repair B1, freeze a new design version, and send that exact version through isolated acceptance and skeptic review. No builder or host action is eligible from this verdict.
