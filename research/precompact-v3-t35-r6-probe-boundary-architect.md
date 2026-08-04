---
type: Research
title: Revision 3 T3.5 R6 host-probe boundary architecture adjudication
actor: codex-precompact-v3-t35-r6-probe-boundary-architect
timestamp: '2026-08-04T00:31:46.939Z'
---
# Verdict

**PASS** — the proposed five-question host-only probe is sufficient before publishing the repaired Plan, provided the full reservation/CAS/lease/reconciliation/scheduler/schema matrix remains a closed, mandatory requirement of the future Plan, the one executable implementation authority, its fake-scheduler tests, exact-implementation smoke, exact-SHA review, and later frozen-candidate gates.

Confidence: **0.96**.

This adjudication narrows only the **pre-Plan scratch-probe boundary**. It does not weaken or supersede the R6 architecture, product/acceptance, or skeptic requirements for the future implementation. The two frozen probe rubrics correctly describe an implementation-quality authority and adversarial test matrix, but they are overbroad as a prerequisite host probe: requiring the scratch artifact to implement them creates a second lifecycle authority before the Plan has specified the real one.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: close only the exact-host premises that the repaired Plan must rely on, while leaving software policy to the future single authority; this serves the ultimate goal by avoiding both an unsupported host assumption and a convention-split duplicate implementation.

## Inputs and isolation

I read the exact boundary diagnostic `context-notes/precompact-v3-t35-r6-probe-boundary-diagnostic@sha256:1474f62d476371dde2f6fcda0dedeca33059a42dfa905dc920283fe698f7f902`, including its retained failed-draft report; R6 architecture `research/precompact-v3-t35-r6-architecture@sha256:0ef1692cf858fada1473bb812cec6e35f65c0138ae53590b2781cf7f6b0218e4`; product/acceptance `research/precompact-v3-t35-r6-acceptance@sha256:715a50b89616bb4e2ab784db81ca735f9497171189467671b7efae03217116bc`; skeptic `research/precompact-v3-t35-r6-skeptic@sha256:9efad190991436412c1d516180c1c831b15ca0e808a47a8dd3d7ffa744a1edb1`; and both frozen overbroad probe rubrics, acceptance `research/precompact-v3-t35-r6-probe-acceptance-contract@sha256:95f42ee3d0ebec164ce9ac144df0653f251e65d1e0b018f985bb116c113a4038` and skeptic `research/precompact-v3-t35-r6-probe-skeptic-contract@sha256:da176723d0faae6d3ed67a0eeb16937f3f64a4fdf5be46870a1c6071d3a1a526`.

I did not inspect parallel boundary-adjudication notes. I did not edit or execute the failed script, invoke tmux or Claude, use auth, or mutate Plan, task, code, or worktree.

The failed draft remains exactly `/private/tmp/aslite-t35-r6-repair-probe.builder/repair-probe.mjs@sha256:7399f09b59294477b5104def9c5c568a2b94b190b34fc52055565718efa5a40b`, 1,566 lines, mode 0644, syntax-valid but non-executable as a campaign because it has no dispatcher/orchestrator, manifest, validator, final audit, failure cleanup, or contract. It produced no evidence and earns no empirical credit.

## Boundary rule

The pre-Plan probe answers only questions whose truth depends on the exact Darwin/Node/tmux host. It may use a single test controller to stage actions and controller-only cleanup. It does not implement or validate the future product authority's policy.

The repaired Plan remains ineligible if it omits the full state/CAS/fault matrix already named by R6: reservation-before-spawn, create-only identity/readback/READY, irreversible release, one nonterminal epoch, lease ownership and takeover, control-versus-signal exclusion, result-loss reconciliation, stopped/stale actor fencing, PID/PGID and socket substitution handling, strict schemas, fallback separation, cleanup ordering, and terminal verdict algebra. Those are future executable-software obligations, not scratch host questions.

## Exact mandatory host questions

### H1 — closed gated cleanup actions

On the pinned no-auth host, can one gate-closed exact Node principal exec each exact closed tmux vector with explicit POSIX `argv[0]`, `-N`, and the exact private socket:

- `OBSERVE_SERVER_PID`: `display-message -p '#{pid}'`;
- `OBSERVE_SESSIONS`: `list-sessions -F <one pinned format>`;
- `OBSERVE_PANES`: `list-panes -a -F <one pinned format>`;
- `KILL_SERVER`: `kill-server`; and
- the final absent-server `OBSERVE_SERVER_PID`?

PASS needs a real durable gate identity before release; the immutable exact exec vector; bounded stdout/stderr/close/EOF/exit evidence when available; strict action output/effect; and exact client PID/private-group absence. A short client that exits between samples is recorded honestly as `tmux_phase_sampled:false`; the gate identity, exact reviewed exec vector, child close/EOF/effect, and PID/group absence are the causal proof. No tmux identity row may be invented. The final absent-server query must have the pinned absent result and create no server, session, pane, or socket.

### H2 — observations available after a discarded result

After a real released action and exact control-client/group absence, can a new observer distinguish both host outcomes without using the discarded result:

1. server exact-live and unchanged after a discarded read-only-query result; and
2. original server PID/group exact-absent after a discarded `KILL_SERVER` result?

PASS retains the controller-only hidden result solely to prove fault injection occurred, then derives the visible outcome only from fresh exact PID/group/socket observations made after client/group absence. It must retain stale-socket facts where `kill-server` leaves them. This proves that the host supplies enough information for a future conservative reconciliation algorithm; it does not prove that algorithm or permit replay policy.

### H3 — two real requester identities and post-owner-absence feasibility

Can two independent no-auth requester principals self-record and be observed concurrently, can the designated first principal become exactly absent, and can the second principal execute a later closed action only after that absence observation?

The scratch controller may withhold action capability from the non-designated requester and sequence the later action. PASS proves real identities, exact absence, and post-absence action feasibility only. It does **not** prove lease exclusivity, CAS acquisition, nonholder rejection, race freedom, or stale-owner fencing; the future implementation and scheduler must prove those.

### H4 — declared separate-PGID survival and cleanup order

Can a harmless pane launch a public-marker, declared, create-only-self-recorded pinned-Node child with `detached:true` and a separate `PGID=PID` before the parent returns, and do the host observations show both order branches?

- Descendant-first branch: pane-group termination does not imply child-group absence; separately reaping the exact child and pane groups leaves the original server exact-live; server cleanup happens only afterward.
- Server-first demonstration: destroying the separate harmless server while the exact marked child remains live leaves that child live, empirically showing that server-first ordering is unsafe; controller cleanup then reaps it and the attempt remains the red demonstration.

PASS requires the declaration, public nonsecret marker, self-record, independent `/bin/ps` revalidation, raw group observations, exact separate-group absence, and controller-only teardown provenance. This question needs only the positive declared record and the two real ordering branches. Missing/late/conflicting/duplicate/undeclared/fake-child and stopped-resume variants are policy/schema tests for the future authority, not additional pre-Plan host primitives.

### H5 — final host and protected continuity

After every branch and any fallback cleanup, are all exact probe-created processes/groups and private sockets absent; does the final no-autostart query remain absent; does a bounded historical all-process audit contain no exact probe root/public marker/known identity; and are enumerated real-user protected targets plus exact worktree HEAD/tree/status/diff byte-identical to their pre-spawn snapshots?

PASS requires raw, bounded, digest-bound before/after evidence, exact real-HOME exclusion binding, explicit no-auth environment-name evidence, and separate primary-result versus fallback/controller-cleanup facts. A clean final host cannot upgrade a failed H1-H4 primitive. Exact stale socket dev/inode/type/uid/mode must be observed and may be removed only after creators and known groups are absent; substitution or rebound is a probe FAIL, not a new host question.

## Missing host behavior

No sixth pre-Plan host behavior is missing. Three details must be explicit inside the five questions rather than becoming new software-policy cases:

1. unobservably short post-exec tmux clients are represented by an honest unsampled phase plus gate/exec/close/effect/absence evidence in H1;
2. `kill-server` stale-socket behavior and exact socket identity/removal are retained in H2/H5; and
3. the server is re-observed exact-live after descendant-first cleanup, while the detached child is re-observed live after the server-first demonstration, in H4.

Malformed parsers, identity mutations, frame faults, EPIPE, inherited writers, lease races, stopped actors, socket rebind attacks, and schema/version/predecessor faults do not ask what the host does. They ask whether future software rejects bad inputs and interleavings. They remain mandatory later and are categorically outside the scratch probe.

## Explicit nonclaims

A host-probe PASS does not prove:

- the future CAS, lease, cleanup-control, result-reconciliation, scheduler, schema, validator, or verdict implementation;
- nonholder rejection, exclusive destructive ownership, stale-actor fencing, safe concurrent retry, or atomic PID-safe signaling;
- candidate helper effects, PreCompact/SessionStart/PostCompact/Stop/SubagentStop delivery, first response/action, API-key isolation, or real-subagent behavior;
- arbitrary unmarked same-uid escape detection, malicious-same-uid containment, universal descendant completeness, or portability;
- that a missing control result means the action did or did not occur; or
- that final cleanliness repairs an earlier failed primitive.

The probe may bind only the prior generic Claude Code 2.1.220 aggregate configured-handler start/response join evidence, including its opaque-command-mapping, no-model-response, and global-drift limitations. It should not invoke Claude. Candidate-specific hook evidence remains a later immutable-candidate gate.

## Maximum bounded artifact and evidence surface

The replacement is rejected as boundary creep unless all limits hold:

- exactly five top-level host questions, two harmless server lifecycles at most, two panes at most, two declared detached children at most, two requester principals, and ten gated cleanup-control clients at most;
- one single-process test controller plus at most five small internal child roles: server gate, cleanup-action gate, requester, pane parent, and detached child;
- one `host-probe.mjs` of at most **900 physical lines**, one standalone read-only `validate-evidence.mjs` of at most **250 physical lines**, and one `probe-contract.md` of at most **200 physical lines**; total static surface at most **1,350 lines**. Crossing any limit requires fresh boundary adjudication before review or execution;
- no generalized lease ledger, CAS emulator, product cleanup phase machine, fake scheduler, retry engine, parser mutation/fuzz matrix, or product-schema predecessor graph;
- a small closed evidence vocabulary only: manifest/binding, raw spawn/ps/group/socket/action receipts, declaration/self-record, protected/worktree snapshots, primary-versus-fallback cleanup, five factual verdicts, and final audit;
- canonical create-only retained evidence, strict unknown/missing-key validation for that vocabulary, per-record digests, immutable script/contract/validator digests, and independent recomputation of H1-H5 without trusting a summary;
- per-stream capture at most 64 KiB, bounded all-process/protected inventories, and total retained evidence at most 5 MiB unless a preflight bound itself blocks safely;
- a bounded top-level safety cleanup that retains the original failure, reaps only exact probe-known identities/controller-known deliberate fixtures, validates stale sockets before unlink, preserves the private failed root, and never turns cleanup success into primitive PASS; and
- exact immutable bytes dual-reviewed before execution. No script byte may change between review and run.

These evidence/safety mechanics make the host experiment reviewable; they are not a second acceptance authority.

## Draft disposition

**Replace; do not salvage incrementally.** Preserve the 1,566-line file and its FAIL digest as a non-executed diagnostic artifact. It already embeds partial lease/control/declaration policy and has no runnable campaign; finishing it would recreate the overbroad rubric's second authority.

The replacement may reuse the previously audited v5 gate, explicit-argv0 exec, strict raw Darwin `ps`/group, bounded child-capture, and socket-observation patterns after copying only the minimal reviewed primitives into the new artifact. It must not import the failed draft, depend on it at runtime, or inherit its ledger/state-machine vocabulary.

## Decision

The five-question host-only probe is a sufficient pre-Plan gate. A fresh dual-reviewed PASS on its exact retained evidence permits drafting—not approving—the repaired Plan. The Plan must then name every deferred policy/schema/scheduler obligation as measurable implementation and review gates before G0. If any H1-H5 host observation is unavailable or contradictory, the boundary verdict becomes `BLOCKED_PENDING_VERIFICATION` or `FAIL` on that exact host fact; the remedy is not to move the missing host premise into prose.

## Result envelope

```yaml
result:
  status: complete
  verdict: PASS
  boundary: FIVE_HOST_QUESTIONS_ONLY
  sufficient_before_plan: true
  additional_host_questions: []
  failed_draft: REPLACE_DO_NOT_SALVAGE
  maximum_static_surface:
    host_probe_lines: 900
    validator_lines: 250
    contract_lines: 200
    total_lines: 1350
  future_matrix_deferred_not_waived: true
  implementation_authorized: false
  probe_execution_authorized: false
  confidence: 0.96
```

[tracked by](../tasks/pre-compact-multi-session.md)
