---
type: Context Note
title: Revision 3 T3.5 D+E R1 Plan skeptic review
actor: codex-precompact-v3-t35-plan-dplus-e-skeptic-r1
timestamp: '2026-08-04T02:51:09.020Z'
---
# Summary

Status: complete; independent adversarial review of exact R1 scratch Plan.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**. Canonical Plan promotion: **NO**.

R1 materially improves the design. It declares at-least-once immutable context delivery, separates resume/work acknowledgment from delivery evidence, removes PostCompact as a load-bearing dependency, adds injection-only sentinel requirements, moves interprocess CAS/clock/missing/quarantine topics into the pre-build freeze, and states a rail prerequisite.

The repairs are incomplete at executable-plan level:

1. R0 does not require a successful compaction followed by positive SessionStart context injection before lifecycle Build. Its only explicit causal outcome is PreCompact blocking, which prevents the load-bearing SessionStart rail from occurring.
2. The resume/work acknowledgment remains an unnamed “subsequent accepted event/receipt.” No supported event, command, ownership token, or loser behavior is specified, so duplicate rendering is safe but duplicate work prevention is still aspirational.
3. Observers are “pure zero-write by default” while failure rails still permit observers to append metadata. That is the same second-writer contradiction.
4. Steps 3–4 still assign QA before independent Review, contradicting the final dependency sentence.
5. CAS, expiry, missing-state, and unsafe-root quarantine are listed for future freeze but have no exact policy or mandatory tests in the Plan. Build authorization cannot precede the exact reviewed freeze.

Canary causality is now suitable for the final live cases, but it must be pulled into R0. Historical tmux facts remain non-load-bearing acceptance baggage despite the synchronous no-tmux architecture.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: authorize only a Plan whose rail-first gate proves successful SessionStart injection and whose at-least-once policy mechanically constrains duplicate workers; this serves the ultimate goal by making compaction continuity operationally enforced rather than convention-dependent.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  build_authorization: false
  canonical_plan_promotion: false
  reviewed_artifact:
    path: /private/tmp/precompact-v3-t35-plan-dplus-e-draft-r1.md
    sha256: 6d241de208b010c703716ed967af1a502c6050fb260c57fea7941f9b29e19de5
  prior_review: context-notes/precompact-v3-t35-plan-dplus-e-skeptic@sha256:ded420ef3b76e8b5d45b45f0d62fd94a64cd942839ead5fdc072dd4554756138
  blockers:
    - id: R0_BLOCK_TEST_DOES_NOT_PROVE_SESSIONSTART_INJECTION
      severity: critical
    - id: RESUME_ACK_AND_DUPLICATE_WORK_AUTHORITY_UNNAMED
      severity: critical
    - id: OBSERVER_APPEND_REMAINS_SECOND_WRITER
      severity: high
    - id: QA_STILL_ASSIGNED_BEFORE_REVIEW
      severity: high
    - id: CAS_CLOCK_MISSING_QUARANTINE_ONLY_DEFERRED
      severity: high
    - id: TMUX_FACTS_REMAIN_NON_LOAD_BEARING_GATES
      severity: medium
  note: context-notes/precompact-v3-t35-plan-dplus-e-skeptic-r1
```

## Exact review boundary

I recomputed the scratch SHA-256 as `6d241de208b010c703716ed967af1a502c6050fb260c57fea7941f9b29e19de5` and read the Plan in full. I reread the exact prior review `context-notes/precompact-v3-t35-plan-dplus-e-skeptic@sha256:ded420ef3b76e8b5d45b45f0d62fd94a64cd942839ead5fdc072dd4554756138` in full.

I did not edit scratch/canonical Plan, source, repository, or tasks; run code/tests/probes; invoke tmux or Claude; use auth/network; or inspect a product-reviewer output.

## Critical blocker 1 — R0 proves a block path, not the positive restoration rail

The new R0 paragraph says it must prove exact hook invocation for manual and automatic compaction, “including a real PreCompact block path.” The only explicit R0 effect is that PreCompact blocking prevents compaction/model response. If PreCompact blocks, Claude never compacts and `SessionStart(source=compact)` never has an opportunity to inject context. That proves a negative PreCompact control, not the load-bearing restoration rail.

The later full live-acceptance criteria contain the correct injection-only sentinel design, but those cases still occur after lifecycle Build/Review/QA. Thus R1 can still spend the lifecycle implementation cost before proving that the installed SessionStart output reaches model context.

Minimum repair: define R0 as its own exact dependency graph and require both positive and negative cases before lifecycle Builder work:

```text
R0 fixture/spec freeze
  -> R0 Builder creates inert exact bytes/config under a test root
  -> independent exact-byte Review PASS
  -> isolated QA PASS
  -> manual positive: PreCompact pass-through -> SessionStart(source=compact) sentinel injection
  -> automatic positive: PreCompact pass-through -> SessionStart(source=compact) sentinel injection
  -> isolated PreCompact continue:false negative
  -> isolated SessionStart continue:false negative
  -> retained-evidence adjudication -> RAIL PASS / STOP
  -> only then lifecycle Contract/Build
```

For each positive case, use a fresh injection-only random sentinel absent from the pre-compaction transcript/native summary, present only in the inert R0 fixture/output, and required verbatim in the first model response. R0 may write raw evidence only under the exact temporary root; it must not create/refresh/consume production state, run GC, or call `CompactionHandoffAuthority` lifecycle transitions.

R0 raw receipts must distinguish actual installed event stdin/stdout from static captured fixtures. “Exact hook schema synchronously” is not enough unless the resumed model demonstrates the sentinel.

## Critical blocker 2 — duplicate-work prevention has no named operational surface

R1 correctly stops marking a generation delivered before output acceptance and explicitly allows redelivery. That closes the handoff-loss window.

It then says a resume/work acknowledgment may occur after a “subsequent accepted event/receipt.” No event or command is named. PostCompact is a nonclaim, the first model response does not automatically call the authority, and an agent instruction to remember to claim is not operational scaffolding. Two concurrent SessionStart invocations can both receive the immutable card and begin the same external work before either calls an unspecified CAS transition.

At-least-once delivery guarantees duplicate context is possible. Exactly-once work needs a concrete gate before side effects, not merely a journal mutation that might happen later.

Minimum repair: freeze a named `claimResume(generation, expected_head_version, delivery_nonce, execution_identity)` authority transition and its invocation surface. Acceptance must establish:

- every work-advancing authority operation requires the winning claim token/version;
- two duplicate/concurrent SessionStart deliveries may render the same card;
- exactly one `claimResume` succeeds by CAS;
- the loser receives a deterministic no-work receipt and cannot promote, replace, complete, recover, or GC the winner;
- crash before claim leaves the generation deliverable;
- crash after claim but before work has an exact expiry/recovery rule and cannot be silently stolen;
- stale/foreign execution identity and delivery nonce cannot claim;
- the card/first action points to the actual enforced claim command, not prose convention.

If the system cannot prevent arbitrary external work before that command, narrow the claim honestly to “exactly one authority/journal advancement,” not duplicate-work prevention in general.

The acknowledgment is not evidence that Claude accepted a prior injection. It is only the linearization point for work ownership.

## High blocker 3 — observer purity remains contradictory

Lifecycle criteria now say observers are pure zero-write “by default.” Failure rails still state observers may “read/append bounded informational metadata.” Appending is a write, consumes space/privacy budget, can alter versions or failure behavior, and creates a writer path outside the sole authority.

Remove both “by default” and the append permission. An observer returns a plain bounded value and performs zero filesystem/process/lifecycle mutation. If an invocation records evidence, `CompactionHandoffAuthority` performs a separately named append-only evidence transition with expected version; that invocation is a mutator and cannot be used by status/read/diagnosis to trigger delivery, replacement, recovery, GC eligibility, or deletion.

## High blocker 4 — the step table still violates Review → QA

Steps 3 and 4 remain assigned to “Builder + QA” before step 6 Review, while step 7 and the freeze paragraph prohibit pre-Review QA. A dependency graph with two opposite orders is not repaired by the final sentence.

Change steps 3–4 to Builder-owned developer tests. QA may write an immutable pre-build adversarial test matrix, but candidate validation begins only after exact-SHA independent Review PASS. Any source repair produces a new SHA that returns to Review before QA. Apply the same ordering to R0.

## High blocker 5 — the safety definitions are deferred, not specified

The freeze paragraph newly names interprocess CAS, clock rollback, expected-versus-legitimate missing state, and unsafe-root quarantine. That is progress, but the exact Plan still supplies neither decisions nor required falsification cases. A future Architect can choose materially different safety policy after this review.

Minimum pre-build reviewed contract:

### Interprocess CAS

- Name the actual linearization primitive; temp-write/rename alone is not CAS.
- Test two independent processes from the same expected version, crash during ownership, stale-lock handling, displaced writer, exact readback, and no destructive overwrite.
- State directory-fsync/power-loss limits without converting them into process-atomicity caveats.

### Expiry clock

- Name persisted clock fields/epoch and the rule across invocation restart.
- Test wall-clock rollback/forward, sleep, reboot/host-epoch mismatch, malformed time, and equality at the expiry boundary.
- Ambiguity blocks/quarantines; it never revives or retires by guess.

### Missing state

- Distinguish legitimate no-handoff compaction from a PreCompact receipt whose exact prepared generation disappeared.
- The former passes through with no injection unless product explicitly chooses universal blocking; the latter blocks visibly.
- Freeze behavior for fresh install, disabled/missed PreCompact, duplicate SessionStart, and displaced head.

### Quarantine

- Version-guarded atomic rename is allowed only inside a verified private journal.
- Unsafe root/type/owner/mode/symlink state is not mutated; return a visible exact repair receipt.
- Quarantine cannot replace head, make corrupt content reusable, or run from observation.

Attach these exact schemas/matrices to the Plan freeze and repeat product/skeptic review before any lifecycle Builder authorization. Merely promising a future freeze is not current build authorization.

## Medium blocker 6 — historical tmux is still in the acceptance graph

R1 removes PostCompact as a dependency, which survives review. It retains v5 no-autostart/group/stale-socket/protected-state facts in Scope, acceptance, evidence layers, traceability, and the mandatory freeze. The synchronous D+E authority uses none of them.

Move v5 to a non-gating historical appendix cited only to explain why the rejected probe is not resumed. Do not require its tuple/digests for D+E PASS. Prove any Node synchronous helper EOF/exit behavior with the exact R0/R1 helper bytes actually used.

## Evidence and canary review

The revised final-live canary rule survives with one move: it belongs in R0 as well as end-to-end acceptance.

- Fresh random sentinel only in decision card/hook output: good.
- Prove absent from transcript/native summary: good, provided retained raw evidence identifies the exact pre-injection snapshot.
- Raw hook receipts plus first-response echo: good causal pair.
- Separate manual/automatic cases: required and preserved.
- SessionStart is load-bearing; PostCompact observational only: repaired.

Change “captured documented event fixtures” in traceability to raw installed-host event receipts for live schema/order claims. Static fixtures prove handler compatibility only and remain in the host-adapter test layer.

## Prior blockers disposition

| Prior blocker | R1 disposition |
|---|---|
| Rail gate after build | **Partially repaired** — R0 declared, but no positive SessionStart injection prerequisite |
| Delivery commit before effect | **Repaired** — generation remains deliverable; duplicates allowed |
| Canary causality | **Repaired for final live cases** — injection-only sentinel; missing from R0 |
| Review/QA order | **Not repaired** — Builder+QA remains before Review |
| tmux/PostCompact baggage | **PostCompact repaired; tmux not repaired** |
| Observer mutation | **Not repaired** — “by default” plus informational append |
| CAS/clock/missing/quarantine | **Acknowledged but deferred** — exact reviewed semantics absent |

## Invariants that survived R1 review

- Cognitive durability is the only production claim; no detached work/supervisor/launchd/tmux authority.
- One synchronous invocation-scoped lifecycle authority owns policy and mutations.
- Full project/execution identity and strict no-fallback rules remain.
- Create-only generations, exact mutable head, expected-version mutation, readback, bounded cards, and privacy constraints remain sound directions.
- At-least-once immutable context redelivery avoids false delivery commitment.
- Resume/work advancement is correctly separated conceptually from delivery proof.
- PostCompact is non-authoritative and non-gating.
- Manual and automatic installed-Claude cases remain distinct.
- Evidence layers, strict receipts, adapter/host/input/output digests, and non-authoritative summaries remain appropriate once live/static provenance is separated.
- Fresh tmux negative-query execution remains prohibited; the circuit breaker stands.
- Failure rails remain broad and fail closed in intent.

## Minimum revision required for PASS

1. Make R0 a concrete Build → Review → QA → positive manual → positive automatic → negative-rail gate that proves actual SessionStart sentinel injection before lifecycle Build.
2. Name and freeze the enforced `claimResume` surface/token/loser/recovery semantics; test duplicate delivery with one CAS winner before authority work advances.
3. Make observers absolutely zero-write and route evidence writes through a named mutating authority transition.
4. Remove QA from pre-Review implementation steps.
5. Attach exact reviewed CAS/clock/missing/quarantine schemas and falsification matrices before build authorization.
6. Move v5 tmux evidence out of D+E acceptance.

## Final decision

**FAIL — build authorization NO; canonical promotion NO.**

Confidence: **0.99**.
