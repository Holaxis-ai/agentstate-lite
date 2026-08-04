---
type: Context Note
title: Revision 3 T3.5 D+E Plan skeptic review
actor: codex-precompact-v3-t35-plan-dplus-e-skeptic
timestamp: '2026-08-04T02:47:19.105Z'
---
# Summary

Status: complete; independent static review of the exact scratch Plan.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**. The draft is not safe to promote to the canonical Plan or use as an implementation contract.

The D+E frame is directionally correct: it explicitly chooses cognitive durability, excludes detached production authority, centralizes policy in one invocation-scoped executable authority, layers fake/filesystem/host/real-Claude evidence, keeps full identity and CAS, names a GC owner, and places independent Review before final QA. It genuinely removes tmux from production.

Four load-bearing defects remain:

1. The real installed-Claude rail is the last gate after the authority/filesystem/host build, repeating the calibration error that triggered Revision 3. Rail proof must be a separate inert prerequisite before lifecycle implementation.
2. `SessionStart` CAS-marks a generation delivered before Claude can acknowledge accepting the hook output. A rejected/malformed response or hook termination can consume the only handoff. Exactly-once delivery is unprovable without a later supported acknowledgment.
3. Evidence provenance is not causal: “pre-only canaries” and an exact next action may survive Claude's native compact summary. They do not prove SessionStart injection. The Plan also places installed-Claude schema/order claims in the host-fixture layer and makes unsupported/non-load-bearing PostCompact and tmux facts acceptance dependencies.
4. The dependency graph assigns QA to fake/filesystem implementation before independent Review, contrary to the repository's required Build → Review → QA gate, despite later prose saying no QA before Review.

Additional ambiguity in observer mutation, interprocess CAS, logical expiry, and negative missing-state behavior would force the builder to invent policy.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: approve only a Revision 3 Plan whose supported Claude rail is proven before the lifecycle build and whose CAS semantics cannot lose a handoff between state commit and context injection; this serves the ultimate goal by making compaction memory durable in operation rather than only in isolated components.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  build_authorization: false
  canonical_plan_promotion: false
  reviewed_artifact:
    path: /private/tmp/precompact-v3-t35-plan-dplus-e-draft.md
    sha256: a4b816f0d69c5b8f45261eed92a3816a484d3b6ef534070a3f692c672c9e4314
  inputs:
    synthesis: context-notes/precompact-v3-alternatives-synthesis@sha256:6b93a5a7b96577e986123d20bc629513dc60be69ffc3bdabf3c0a5ad67b6ad1b
    circuit_breaker: context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker@sha256:2e450eec67f062100164259a34a575412031f45b31ecac14addacc42e4e7cd6e
  blockers:
    - id: LIVE_RAIL_GATE_OCCURS_AFTER_BUILD
      severity: critical
    - id: DELIVERY_CAS_COMMITS_BEFORE_UNACKNOWLEDGED_EFFECT
      severity: critical
    - id: RAIL_CANARIES_DO_NOT_PROVE_CAUSATION
      severity: critical
    - id: REVIEW_QA_DEPENDENCY_CONTRADICTION
      severity: high
    - id: NON_LOAD_BEARING_TMUX_AND_POSTCOMPACT_GATES
      severity: high
    - id: OBSERVER_AND_GC_MUTATION_CONTRADICTION
      severity: high
    - id: CAS_CLOCK_AND_MISSING_STATE_POLICY_UNFROZEN
      severity: high
  note: context-notes/precompact-v3-t35-plan-dplus-e-skeptic
```

## Exact review boundary

I recomputed the scratch Plan SHA-256 as `a4b816f0d69c5b8f45261eed92a3816a484d3b6ef534070a3f692c672c9e4314` and read it in full. I also read:

- `context-notes/precompact-v3-alternatives-synthesis@sha256:6b93a5a7b96577e986123d20bc629513dc60be69ffc3bdabf3c0a5ad67b6ad1b`; and
- `context-notes/precompact-v3-t35-r6-host-probe-circuit-breaker@sha256:2e450eec67f062100164259a34a575412031f45b31ecac14addacc42e4e7cd6e`.

I did not edit the scratch or canonical Plan, source, repository, or tasks; run tests/probes/child modes; invoke tmux or Claude; use auth/network; or inspect a product-reviewer output.

## Critical blocker 1 — rail-first is asserted but not encoded in dependencies

The Plan's implementation graph builds contract/schema, authority, fake adapters, filesystem adapter, and host adapter; then performs Review, QA, and finally real manual/automatic compaction. Thus the load-bearing supported surface is verified only after nearly all implementation cost is sunk.

Calling the host-adapter step an “exact installed-Claude” check does not repair this. A handler fed documented/captured JSON can prove conformance to a fixture. It cannot prove the installed Claude version invokes `SessionStart(source=compact)`, supplies the assumed identities/order, accepts the output, or injects it into the resumed context. The Plan's evidence layers and traceability table blur this distinction by assigning installed-Claude schema/order both to “Exact host” fixtures and to real Claude.

This is the exact prior calibration error: prove every piece, then discover the invocation rail rejects it.

Minimum repair: split the Plan into two separately frozen authorization units.

```text
R0 inert rail fixture build
  -> exact-byte independent Review
  -> isolated QA
  -> installed Claude manual compaction acceptance
  -> installed Claude automatic compaction acceptance
  -> RAIL PASS / STOP

R1 lifecycle contract + implementation
  -> exact-byte independent Review
  -> adversarial QA
  -> real end-to-end manual acceptance
  -> real end-to-end automatic acceptance
```

R0 must not create/refresh/consume a handoff, spawn a helper, run GC, or mutate production state. It reads one precreated immutable private sentinel and returns only the supported SessionStart field. Preserve raw stdin/stdout/stderr/exit/timing/settings plus resumed-context evidence. Failure stops Revision 3; it does not trigger implementation or another process architecture.

## Critical blocker 2 — delivery is committed before its effect can be acknowledged

The lifecycle criteria say compact delivery CAS-marks the current generation and duplicate handoff is forbidden. The hook must mutate the journal before or while returning output. Claude provides no causal acknowledgment that it accepted and injected that output; PostCompact acknowledgment is explicitly a nonclaim.

Reachable loss trace:

1. `SessionStart(source=compact)` reads generation `g`.
2. Authority CAS-marks `g` delivered.
3. Hook emits output.
4. Claude rejects an output field/schema, the pipe closes late, the hook is terminated, or the host discards the response.
5. A retry observes delivered `g` and injects nothing to avoid duplication.
6. No later session receives the handoff, although durable state claims delivery.

Reversing write/output order only changes the crash window: output can be accepted and the process can die before marking, causing redelivery. Exactly-once external effect cannot be obtained from a journal CAS without a receiver acknowledgment.

Minimum repair: define **at-least-once context delivery, exactly-once work claim**.

- `SessionStart` creates or reuses an append-only `delivery_attempt` bound to exact invocation/event identity and returns a deterministic payload digest.
- Emitting context does not make the generation unavailable.
- Duplicate delivery of the same immutable card is permitted and evidence-visible.
- The resumed agent/first exact lifecycle action performs the CAS `resume_ack` or work claim; only that acknowledgment makes the generation consumed.
- Concurrent/duplicate SessionStart invocations may render the same payload, but CAS ensures only one attempt can advance or promote work.
- If the installed rail exposes no safe later acknowledgment identity, the Plan must explicitly claim at-least-once delivery and idempotent resume—not “no duplicate handoff.”

`continue:false` remains appropriate for unsafe ambiguity, but it cannot compensate for a generation prematurely marked delivered.

## Critical blocker 3 — the live evidence does not isolate SessionStart causation

The first-response test requires “pre-only canaries and exact next action.” Those facts can survive Claude's native compaction summary. Their appearance after compaction therefore does not prove the hook injected them. The evidence can PASS while the load-bearing hook output is ignored.

Minimum repair: R0 and end-to-end acceptance need two distinct canary classes:

1. an **injection-only random sentinel** created outside the conversation/transcript after the pre-rail baseline, present only in the immutable hook fixture/output, and required verbatim in the resumed model's first response; and
2. a **handoff-content canary** proving the authority selected the correct exact generation/card.

Retain the raw hook input/output digest and show the injection-only sentinel was absent from the pre-compaction transcript and any native compaction summary evidence. The first response must bind the sentinel, exact handoff generation, and expected next action. A content canary alone is not causal proof.

Manual and automatic cases require separate fresh sentinels and exact `source:"compact"` receipts. Fixture-handler tests must be labeled static conformance only; installed hook invocation and context presence belong exclusively to the real-Claude evidence layer.

## High blocker 4 — QA appears before Review in implementation steps

Steps 3 and 4 assign fake/filesystem tests to “Builder + QA,” while independent Review is step 6. Step 7 later says QA depends on Reviewer approval. Those are contradictory dependencies.

Minimum repair: before Review, Builder implements and runs developer tests. QA may contribute a pre-build test matrix as a read-only design artifact, but does not validate candidate bytes. After the Builder freezes an exact SHA, independent Reviewer approves it; only then does QA execute adversarial suites on the same SHA. Any repair creates a new SHA and repeats Review before QA. Live acceptance depends on both exact-SHA Review PASS and QA PASS.

Apply this sequence independently to R0 and R1.

## High blocker 5 — tmux and PostCompact remain acceptance baggage

D+E correctly excludes tmux from production, yet Scope, acceptance, evidence layers, and traceability still require v5 explicit argv/no-autostart, process-group, and stale-socket facts. None is used by a synchronous invocation-scoped journal authority. Historical correctness does not make those facts load-bearing. Keeping them in the acceptance graph preserves the narrow tmux frame and risks version-tuple churn for a dependency the design does not have.

Remove tmux from R3 acceptance and host-adapter obligations. Preserve v5 only as a historical appendix explaining why no new tmux probe runs. If a synchronous helper uses Node process APIs, prove those exact helper/EOF/exit facts directly without describing them as tmux evidence.

The live sequence also requires `PreCompact -> SessionStart -> PostCompact`, while the design explicitly disclaims PostCompact causal acknowledgment and the supported restoration surface is SessionStart. Make only `PreCompact` durable preparation and `SessionStart(source=compact)` injection load-bearing. Observe PostCompact if the installed host emits it, but do not fail or claim acknowledgment from it unless R0 independently proves a required supported contract.

## High blocker 6 — observer nonmutation contradicts informational appends and GC

Lifecycle criteria say observation never changes head, delivery, replacement, deletion, or GC eligibility. Failure rails then allow observers to “read/append bounded informational metadata.” An append is a mutation, can change storage versions/privacy/space, and creates a second writer path outside the sole authority. It also makes observation failure affect later CAS state.

Make observers strictly read-only. If informational evidence must be written, the invocation-scoped authority writes it as an explicit event transition through the same CAS journal, and that call is not classified as observation. Name the sole GC trigger—such as successful PreCompact preparation or an explicit maintenance command—and ensure status/read/SessionStart diagnostic paths cannot make unrelated generations eligible or delete them.

## High blocker 7 — CAS, expiry, and missing-state policy are not frozen enough

These can be resolved in the required pre-build contract, but the current Plan lets implementation choose load-bearing semantics:

- Atomic temp/rename is not compare-and-swap. Require a real two-process linearizability test for the chosen lock/version primitive, including crash while locked, stale lock identity, displaced writer, directory fsync nonclaim, and readback.
- Invocation-scoped logical expiry cannot rely on a monotonic process clock across restarts. Freeze the persisted clock/epoch rule and test wall-clock rollback/forward, sleep, reboot/host mismatch, and boundary equality. Clock ambiguity must quarantine/block, not silently expire or revive.
- “Missing state returns `continue:false`” conflates expected absence with lost prepared state. Freeze how SessionStart distinguishes a legitimate no-handoff compaction from a PreCompact-acknowledged generation that disappeared. Otherwise a fresh install or unaffected session can be blocked, or a lost handoff can pass through.
- Quarantine under an unsafe root cannot safely mutate that root. Specify exact version-guarded rename only inside a verified private journal; unsafe root/type/owner/mode produces visible nonmutation and external repair instructions.

These semantics belong in the frozen schema/adapter contract and acceptance table before any Builder action.

## D+E invariants that survived review

- The production claim is explicitly cognitive durability, not execution durability.
- There is no detached worker, daemon, launchd service, or tmux production authority.
- `CompactionHandoffAuthority` is the one lifecycle writer; adapters supply effects rather than reimplement policy.
- Full project/execution identity, no shortened/singleton/cwd/recency fallback, strict schema, bounded cards, and privacy limits are correct directions.
- Create-only generations plus an exact mutable head and expected-version mutation are appropriate.
- Fixed expiry, a named single GC owner, exact recovery/quarantine, and readback are required.
- Fake policy tests and filesystem integration are correctly separated from host and real-Claude claims.
- Private 0700/0600 boundaries, symlink/ownership/type checks, corruption handling, and power-loss nonclaim are appropriate.
- Manual and automatic installed-Claude compaction are correctly separate final end-to-end gates.
- Negative rails cover stale CAS, races, transcript advance, corrupt/mismatched records, permissions, partial writes, helper failures, malformed output, and safe blocking.
- Every evidence row carries authority/adapter/host/input/output identity and retained strict receipts; summary booleans are non-authoritative.
- Product Review before QA before live acceptance is the correct dependency once the earlier QA assignments and missing R0 gate are repaired.
- Fresh tmux negative-query execution remains removed; the circuit breaker stands.

## Minimum revision required for PASS

1. Add an independently frozen R0 inert rail gate before lifecycle implementation, with Build → Review → QA → manual live → automatic live.
2. Replace delivery-marked/exactly-once semantics with at-least-once immutable context delivery plus CAS-guarded resume/work acknowledgment.
3. Add injection-only causal sentinels and separate fixture conformance from installed-host evidence.
4. Make Build → Review → QA ordering unambiguous for every exact SHA.
5. Remove tmux and PostCompact from load-bearing D+E acceptance.
6. Make observation strictly nonmutating and name the sole GC-triggering transition.
7. Freeze real interprocess CAS, restart-safe expiry, expected-vs-lost missing-state, and unsafe-root quarantine semantics before build.

These changes preserve the selected D+E architecture. They do not require a supervisor, tmux, or broader product scope.

## Final decision

**FAIL — build authorization NO.**

Confidence: **0.99**.
