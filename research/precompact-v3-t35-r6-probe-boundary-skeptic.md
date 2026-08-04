---
type: Research
title: Revision 3 T3.5 R6 host-probe boundary skeptic adjudication
actor: codex-precompact-v3-t35-r6-probe-boundary-skeptic
timestamp: '2026-08-04T00:34:04.091Z'
---
# Summary

Status: complete.

Verdict: **PASS_FOR_STRICT_HOST_BOUNDARY**. Confidence: **0.97**.

A strictly host-only five-question no-auth probe is sufficient to close the newly load-bearing external facts before the next Plan is drafted, provided its PASS is explicitly limited to those facts. The complete CAS/lease/replay/scheduler/evidence-authority contract remains a later red-first gate against the one real lifecycle implementation. The scratch probe must not implement or appear to validate that software policy.

This verdict does not approve a Plan, implementation, candidate, Claude/auth execution, G0, or live acceptance. I did not inspect or execute the failed 1,566-line draft. The retained failed-draft result is the exact diagnostic `context-notes/precompact-v3-t35-r6-probe-boundary-diagnostic@sha256:1474f62d476371dde2f6fcda0dedeca33059a42dfa905dc920283fe698f7f902`, which records **FAIL / NOT RUN**, script digest `sha256:7399f09b59294477b5104def9c5c568a2b94b190b34fc52055565718efa5a40b`, and no empirical evidence.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: decide whether a minimal host oracle can support the next exact Plan without becoming a second implementation of the lifecycle authority; this serves the ultimate goal by separating observed platform facts from software guarantees that only the shipping authority and its tests can establish.

## Exact inputs and independence

I read in full through `./aslite` and adjudicated from these exact versions:

- boundary diagnostic / failed-draft result: `context-notes/precompact-v3-t35-r6-probe-boundary-diagnostic@sha256:1474f62d476371dde2f6fcda0dedeca33059a42dfa905dc920283fe698f7f902`;
- prior R6 skeptic repair contract: `research/precompact-v3-t35-r6-skeptic@sha256:9efad190991436412c1d516180c1c831b15ca0e808a47a8dd3d7ffa744a1edb1`;
- prior overbroad skeptic probe rubric: `research/precompact-v3-t35-r6-probe-skeptic-contract@sha256:da176723d0faae6d3ed67a0eeb16937f3f64a4fdf5be46870a1c6071d3a1a526`;
- R6 architecture adjudication: `research/precompact-v3-t35-r6-architecture@sha256:0ef1692cf858fada1473bb812cec6e35f65c0138ae53590b2781cf7f6b0218e4`; and
- R6 product/acceptance adjudication: `research/precompact-v3-t35-r6-acceptance@sha256:715a50b89616bb4e2ab784db81ca735f9497171189467671b7efae03217116bc`.

I did not inspect parallel boundary-role bodies, the failed draft's source, any replacement probe source, processes, tmux state, Claude/auth state, Plan/task/code, or the worktree beyond repository instructions. Listing bundle metadata to locate the requested retained inputs revealed no parallel boundary Research body and did not enter this adjudication.

## Why the smaller boundary is valid

The next Plan needs two different kinds of premises:

1. **External host facts:** exact Darwin/Node/tmux process, group, socket, exec, detach, termination, and observation behavior. These can only be learned by exercising the pinned host.
2. **Software policy:** which actor may act; when reservation, release, takeover, replay, quarantine, or CLEAN is legal; how CAS revisions and evidence schemas are validated; and how interleavings are scheduled. These facts do not exist before the lifecycle authority is implemented. A scratch analogue can at most prove itself.

The failed draft crossed that boundary. Its 1,566 unfinished lines attempted to implement the future authority's state machine, lease, fault scheduler, evidence registry, and terminal cleanup. Even a completed PASS would have established the behavior of a disposable duplicate, not the behavior of `scripts/handoff-candidate.mjs`. The proportional response is not a smaller duplicate; it is a construction-independent host experiment plus a later exact-implementation gate.

The five-question host probe is therefore sufficient **for Plan input** because each surviving question asks whether an external mechanism the Plan will rely on exists on the pinned tuple. None asks whether the future authority applies policy correctly.

## Frozen five-question host oracle

Each question has one closed YES/NO result derived from raw observations. Any NO, missing mandatory row, protected-state drift, or unclean test-owned survivor is FAIL/BLOCKED for Plan input. A controller's choice of sequencing is not evidence of product authorization policy.

### H1 — closed cleanup argv and short-client causation

Can one exact no-auth gate-closed pinned-Node principal, after a controller release, explicit-`argv[0]` exec each closed `tmux -N -S <private-socket>` action—server PID query, session query, pane query, and `kill-server`—with strict action output/effect, and can the final read-only server-PID query against the absent socket exit without starting a server, session, or socket?

Because the tmux phase may exit between `ps` samples, YES does not require a fabricated post-exec tmux row. It requires the real pre-exec Node identity, immutable exact exec vector, controller release, bounded stdout/stderr plus both EOFs/child close/exit when available, action-specific effect, and exact final PID/private-group absence. This closes host execution and causal-observation facts only.

### H2 — result-loss observability

After a real released `kill-server` action has its result deliberately withheld from the observer, and after the exact client PID/group is absent, can a later observer distinguish the original server exact-live from original server PID/group exact-absent using fresh raw PID/group/socket observations alone?

YES proves that conservative reconciliation has sufficient host information. It does not prove when software may retry, advance, quarantine, or publish CLEAN; those are later transition-policy tests.

### H3 — independent requester/owner identities and successor action surface

Can two independent no-auth requester OS processes be given distinct exact identities, can the controller permit only one designated process to invoke a real control action, and, only after the first designated owner is proved absent, can the other process invoke a later real action?

YES proves only that the host exposes distinguishable principals, exact owner-absence evidence, and a usable successor action surface. The controller's designation is test sequencing, not a demonstrated lease. This question makes no exclusivity, mutual-exclusion, takeover-CAS, stopped-owner, or stale-actor claim.

### H4 — declared detachment and causal cleanup order

Can a manifest-declared pinned-Node `detached:true`/new-PGID child create an exact nonce-bound self-record before its parent returns, survive ordinary pane-group and server assumptions, remain independently observable, and require separate group reaping? Can descendant-first cleanup prove the pane/declared child groups absent while the original server remains live and answerable, whereas a safe server-first demonstration leaves the declared separate child live?

YES proves the external topology and the empirical reason for descendant-before-server order. It does not prove declaration ingestion policy or any missing/late/duplicate/conflict red matrix. It expressly does not prove arbitrary unmarked escape detection.

### H5 — bounded final host cleanliness and noninterference

After the preceding cases and controller-only safe teardown, are every exact test-owned PID/group/socket absent, is the final absent-server read-only `-N` query non-autostarting, does a retained bounded raw process audit contain no exact test identity/public marker, and are the enumerated protected real-user/global/worktree snapshots byte-identical?

YES proves only that this probe left no known test-owned host capability or protected-state drift. It is not lifecycle CLEAN and cannot erase an H1-H4 failure.

Prior pinned hook-capability evidence may supply the generic synchronous all-handler join primitive, with its recorded limitations. A fresh Claude/no-auth join repetition is optional and outside these five mandatory questions. Candidate-specific direct-helper effects and manual/automatic/real-subagent compaction remain immutable-candidate gates.

## Explicit retraction of my overbroad scratch requirements

I retract the following as requirements on a pre-Plan scratch probe. They remain mandatory, where applicable, against the exact implementation before G0:

- the scratch “one real cleanup authority,” product-named `CONTROL_*`/`CCTL_*` ledger, history/current CAS, hard-link or other lease, reservation/read-back/release state machine, and one-nonterminal-epoch invariant;
- real two-cleaner mutual exclusion, nonholder rejection as product policy, control-versus-signal serialization, lease takeover, stopped-owner fencing, stale-actor resumption, and post-CLEAN replay;
- exhaustive pause/crash scheduling at reservation, record, release, frame, exec, connect, action, receipt, absence, reconciliation, and terminal publication;
- PID/PGID-reuse parser matrices, malformed/oversize/multirow frame and output matrices, socket rebind/substitution policy, retry algebra, and quarantine/verdict state transitions;
- missing/late/duplicate/conflicting declared-child policy cases and authority ingestion; only the positive host topology plus the server-first counterexample remain here;
- a full evidence-authority schema/validator registry, provenance-class transition enforcement, recomputation engine, summary-oracle mutation suite, and every assertion-failure path routed through the product reaper;
- proof that one disposable scratch implementation's CAS, lease, scheduler, evidence, or CLEAN policy is correct.

Those requirements would recreate the rejected second rail. The exact Plan must retain them as measurable obligations on the **one executable shipping authority**: red-first fake scheduler for policy/interleavings, exact no-auth implementation smoke for real boundaries, independent exact-SHA Review with an oracle mutated red, and later frozen-candidate/live gates.

Some hygiene survives without becoming product policy: the controller must use a private root, explicit no-auth environment, exact tool paths/argv, bounded observations, and a single always-run controller teardown for only the test-owned identities it created. Controller cleanup is separately labeled and cannot upgrade a failed primary question.

## Smallest sufficient adversarial raw evidence

The Plan may consume the probe only if an independent reviewer can answer H1-H5 from this compact retained set:

1. One manifest containing exact script digest, invocation argv/environment **names**, host tuple, pinned Node/tmux/`/bin/ps` realpaths and byte digests, private root/socket, protected target list, five question ids, and prior hook-evidence digest if cited.
2. For every spawned test principal: parent-observed spawn/close facts and exact raw `/bin/ps -p` and `/bin/ps -g` argv, stdout, stderr, and exit receipts when the process is expected live or absent. A too-short tmux phase is labeled unsampled; it is never invented.
3. For every H1/H2 action: the immutable exact exec vector, controller-release event, bounded raw stdout/stderr, EOF/close/exit facts available to the parent, and raw before/after server PID/group/socket observations. H2 must retain the fact that the action result was withheld separately from the later observer's inputs.
4. For H3: two distinct requester identity rows, the first owner's exact absence row before the successor action, and each actual action's raw receipt. No lease/exclusivity conclusion appears in the evidence.
5. For H4: the declared-child raw self-record bytes, parent-return ordering, independent live PID/group rows, pane/server and separate-child before/after rows, one descendant-first trace showing server still answerable after descendant absence, and one safely controlled server-first trace showing the child still live before teardown.
6. Exact socket `lstat` facts needed to show live, stale/absent, and non-autostart outcomes; no socket fact is used as process proof.
7. One ordered raw event stream with monotonic timestamps/step ids sufficient to reconstruct the five causal sequences, plus separately labeled fallback/controller teardown events.
8. Before/after byte digests for the enumerated protected real-user/global/worktree targets and one final bounded raw process/group/socket/public-marker audit.

A generated summary may point to those rows and hashes but is non-authoritative. No general schema language, lifecycle ledger, reusable validator registry, or product verdict engine is needed. Independent review checks the five question-specific predicates directly from the raw receipts and frozen script.

## Mandatory nonclaims

A PASS report must state all of these prominently:

- not proof of CAS, reservation/release atomicity, lease exclusivity, takeover safety, replay fencing, retry legality, scheduler coverage, evidence-schema authority, verdict algebra, quarantine, or lifecycle CLEAN;
- not proof of the future exact implementation, and not permission to omit its red-first fake-scheduler and exact-host implementation tests;
- not proof of live Claude/API-key manual, automatic, or subagent compaction; not proof of candidate-specific direct-helper effects or first response/action;
- not proof that a post-exec tmux PID was sampled when it was not;
- not proof of atomic PID-safe signaling or portability beyond the pinned tuple;
- not proof of arbitrary unmarked same-uid escape discovery, malicious-same-uid containment, or universal descendant completeness;
- not a Plan PASS, candidate freeze, G0 authorization, or acceptance substitute; and
- not permission for a summary or controller cleanup to upgrade missing/failed raw host evidence.

## Hard scope and complexity guard

The replacement probe is rejected before execution if any of these bounds is crossed:

- exactly five mandatory question functions H1-H5, one single-process controller, one bounded raw event writer, and one controller-only teardown path;
- at most 800 nonblank/noncomment source lines and no generated or imported private lifecycle framework;
- no product-named lifecycle/control states, persistent current/history ledger, CAS primitive, lease implementation, simulated clock, scheduler/fault-interleaving engine, replay/retry engine, evidence-schema registry, general verdict algebra, or second cleanup authority;
- no negative matrix beyond the one host counterexample in H4 and deliberate result withholding in H2; policy mutations belong to implementation tests;
- no Claude/API-key/global-auth invocation and no source/worktree/Plan/task mutation; and
- no PASS claim beyond the five exact host questions and final noninterference.

Safe lab teardown is mandatory but may use only parent handles and exact test identities created by the controller; it is always reported separately from primary evidence. If a proposed host question cannot be answered safely within this envelope, the boundary result becomes `BLOCKED_PENDING_VERIFICATION` and the missing external primitive must be named. The response is not to enlarge the scratch probe into another authority.

## Missing host behavior that would still block the next Plan

The next Plan remains unsupported if the reviewed probe fails to establish any of these exact external facts:

1. the pinned gated Node-to-explicit-`argv[0]` `tmux -N` path can execute every closed cleanup query/action and leave its real PID/group absent even when the tmux exec phase is too short to sample;
2. the absent-socket final read-only query has a pinned strict outcome and creates no server, session, or socket;
3. after a deliberately lost destructive-action result and control-client absence, fresh PID/group/socket facts distinguish the original server exact-live from exact-absent without consuming the hidden result;
4. two requester principals and exact former-owner absence are externally observable, and a later successor action is possible after that absence;
5. a declared new-PGID/detached child really survives pane/server assumptions, is independently observable/reapable, and descendant-first cleanup can complete while server observation remains available; and
6. the bounded no-auth experiment can finish with exact test-owned absence and byte-identical protected state.

A missing policy behavior is not added to this list. CAS legality, one-lease arbitration, scheduling, evidence authority, and terminal verdict correctness remain unsupported until the real implementation and its exact tests exist; the Plan must express those as future gates rather than current facts.

## Final adjudication

**PASS_FOR_STRICT_HOST_BOUNDARY.** The five-question probe is the smallest useful pre-Plan oracle: it turns genuinely external assumptions into pinned observations while refusing to build a disposable model of the software policy. Its PASS may unlock drafting of the next exact Plan only. Exact Plan review must verify that every retracted software obligation is assigned to the one executable authority and its red-first scheduler/exact-host gates before G0.

Confidence: **0.97**.
