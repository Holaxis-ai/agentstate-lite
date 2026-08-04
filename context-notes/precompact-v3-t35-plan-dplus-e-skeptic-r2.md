---
type: Context Note
title: Revision 3 T3.5 D+E R2 Plan skeptic review
actor: codex-precompact-v3-t35-plan-dplus-e-skeptic-r2
timestamp: '2026-08-04T02:55:03.734Z'
---
# Summary

Status: complete; independent adversarial review of exact R2 scratch Plan.

Verdict: **FAIL**. Confidence: **0.99**.

Build authorization: **NO**. Canonical Plan promotion: **NO**.

R2 closes two prior blockers: positive manual and automatic `SessionStart(source=compact)` injection are now explicit prerequisites to lifecycle Build, and the principal lifecycle dependency is unambiguously Build → independent Review → QA. It also names `claimResume`/`claimWork` and gives their basic CAS winner/loser algebra.

Three load-bearing blockers remain:

1. R0 does not test the production negative `SessionStart continue:false` rail before Build; it tests only PreCompact blocking. The implementation can still be built before discovering that its safety-block response is rejected or ignored by the installed host.
2. Observer purity is directly self-contradictory: acceptance says absolute zero-write, while failure rails still authorize informational appends.
3. The interprocess CAS, clock, missing-state, quarantine, orphan-claim, GC, and evidence contracts are not attached. The Plan says they will be frozen later, so it still asks a future Architect/Builder to choose safety policy after this review.

The named claim transition is useful but incomplete: its token issuance/invocation surface, claim-orphan recovery, GC interaction, and exact scope of “duplicate work” are deferred. R0 canary causality also needs a distinct inert fixture card because R0 is forbidden to create the production decision card into which the current criterion says every sentinel is injected.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: authorize only an exact Plan whose entire positive and negative installed rail is proven before Build and whose concurrency/recovery contracts are already frozen; this serves the ultimate goal by preventing the authority from depending on post-review policy invention.

## Result Envelope

```yaml
result:
  status: complete
  verdict: FAIL
  confidence: 0.99
  build_authorization: false
  canonical_plan_promotion: false
  reviewed_artifact:
    path: /private/tmp/precompact-v3-t35-plan-dplus-e-draft-r2.md
    sha256: 154ac4772665792aff9b792d6603861ed02f6224f946931ab46ece6985b98750
  prior_review: context-notes/precompact-v3-t35-plan-dplus-e-skeptic-r1@sha256:170283c7b01122a60526a49b95fc5a4d8f7b3605196039711e4a5e8e61462a94
  blockers:
    - id: R0_OMITS_SESSIONSTART_NEGATIVE_BLOCK_RAIL
      severity: critical
    - id: OBSERVER_ZERO_WRITE_CONTRADICTS_METADATA_APPEND
      severity: critical
    - id: REQUIRED_FREEZE_CONTRACTS_ARE_NOT_ATTACHED
      severity: critical
    - id: CLAIM_TOKEN_ORPHAN_GC_SEMANTICS_INCOMPLETE
      severity: high
    - id: R0_SENTINEL_LOCATION_CONTRADICTS_INERT_SCOPE
      severity: high
  note: context-notes/precompact-v3-t35-plan-dplus-e-skeptic-r2
```

## Exact review boundary

I recomputed and matched the scratch SHA-256 `154ac4772665792aff9b792d6603861ed02f6224f946931ab46ece6985b98750`, read the Plan in full, and reread `context-notes/precompact-v3-t35-plan-dplus-e-skeptic-r1@sha256:170283c7b01122a60526a49b95fc5a4d8f7b3605196039711e4a5e8e61462a94` in full.

I did not edit the scratch/canonical Plan, code, repository, or tasks; run tests/probes; invoke Claude/tmux; use auth/network; or inspect another reviewer.

## Critical blocker 1 — R0 proves positive injection but not the production block surface

R2 now has the required ordering:

```text
R0 Build -> R0 Review -> R0 QA
  -> positive manual SessionStart injection
  -> positive automatic SessionStart injection
  -> lifecycle Build
```

That genuinely repairs the primary rail-first blocker.

R0's negative gate, however, is only “negative manual/automatic PreCompact blocking.” Production failure behavior is specified later as `SessionStart continue:false` for corrupt, expired, mismatched, or otherwise unsafe state. PreCompact and SessionStart are different hook events with different timing and potentially different accepted output schemas/effects. A successful PreCompact block does not prove Claude accepts a SessionStart block after compaction or suppresses the first resumed response.

The original calibration failure was response-schema validity on a load-bearing hook surface. Deferring the exact negative SessionStart result until post-Build live acceptance preserves half of that risk.

Minimum repair: R0 must include isolated negative cases for both events before lifecycle Build:

- PreCompact `continue:false` prevents compaction and model response;
- SessionStart `source:"compact"` `continue:false` after an otherwise allowed compaction prevents the first resumed model response;
- each case retains raw installed stdin/stdout/stderr/exit/timing and unchanged settings/foreign-state evidence; and
- schema error, ignored block, unexpected response, or ambiguous event order is R0 FAIL/STOP.

R0 must finish all positive and negative gates—not merely the positives—before Contract/schema or lifecycle Builder work.

## Critical blocker 2 — observer purity remains an exact contradiction

Lifecycle acceptance says “observers are absolute zero-write.” Failure rails still say “Observers may read/append bounded informational metadata.” Both cannot be implemented.

An append mutates storage, privacy/size budget, timestamps and potentially CAS/recovery observations. It creates a second writer class outside the sole authority and makes status/diagnosis capable of changing later behavior.

Minimum repair:

- observers return a plain bounded value and perform zero file/process/lifecycle mutation;
- remove all append permission from observers;
- if evidence must persist, a separately named `recordEvidence(expected_version, receipt)` authority mutation writes an append-only evidence namespace and is never called by status/read/observer paths;
- evidence failure cannot change head/generation/claim/expiry/GC/recovery eligibility; and
- observer-first/last race tests assert byte-identical lifecycle state and evidence namespace unless the explicit evidence mutator was invoked.

## Critical blocker 3 — the “attached freeze contracts” are absent

The final paragraph says to freeze and attach interprocess CAS, clock rollback, expected-versus-legitimate missing state, unsafe-root quarantine, loser/orphan lifecycle, schemas, adapters and fixture manifests before implementation. None of those exact contracts is present in R2 or referenced by immutable artifact ID/digest.

That is a gate promise, not an attached contract. Passing this exact Plan would authorize a future role to make materially different decisions without this review seeing them.

Minimum repair: attach or digest-link a fully specified pre-build contract containing at least:

### Interprocess CAS

- exact linearization primitive and lock/owner record schema;
- create/acquire/publish/release ordering;
- two-process same-version winner/loser behavior;
- crash at each boundary, stale owner identity, readback, and destructive-overwrite prohibition;
- explicit directory-fsync/power-loss nonclaim.

### Clock/expiry

- persisted wall/host/boot or logical epoch fields and comparison rule;
- rollback, forward jump, sleep, restart, host/boot mismatch, malformed time and equality boundary outcomes;
- exact fixed expiry and no lease-refresh by observation.

### Missing/quarantine

- matrix for legitimate no-handoff, missed/disabled PreCompact, acknowledged-prepared generation missing, displaced head and fresh install;
- exact pass-through versus visible block outcomes;
- quarantine only through version-guarded rename inside a verified private root;
- unsafe root/type/mode/owner/symlink produces nonmutation and exact repair receipt.

### Claim/GC/recovery

- token issuance/storage/invocation surface;
- claimed orphan after crash, expiry/takeover, stale completion and loser behavior;
- the sole named GC-triggering event and version guard;
- authority transitions a claim token permits, and operations it never permits.

### Evidence

- schemas, caps, privacy fields, raw-versus-derived rows, digest/readback and no summary authority;
- exact separation between observer return values and mutating evidence recording.

These artifacts require exact product+s​​keptic review before lifecycle Build authorization. The Contract/schema task may produce them, but then this review's build authorization remains NO until that reviewed freeze exists.

## High blocker 4 — claim CAS is named but not yet operationally closed

The core CAS algebra survives:

- exact identity, generation, expected version and strong token;
- one `prepared|delivered -> claimed` winner;
- same-token idempotency;
- different-token `ALREADY_CLAIMED`;
- stale concurrent loser zero-write; and
- delivery remains at-least-once.

Remaining ambiguities:

- who creates the token, where it is durably bound before delivery, and how a retry obtains the correct lineage;
- which supported hook/CLI/authority call is the mandatory invocation surface;
- whether `delivered` is an actual durable state despite the rule that delivery never marks a generation;
- how crash-after-claim/before-work becomes an orphan and can be recovered without stealing;
- how expiry/GC interacts with a current claim;
- whether “duplicate-work prevention” means only authority/journal transitions or arbitrary external agent actions.

Freeze `claimResume` as the ownership linearization point before any authority work. Every subsequent authority mutation must carry the winning token and expected version. Tests must show two redelivered cards, two claim attempts, one winner, a deterministic no-work loser, stale completion rejection, and version-guarded orphan recovery.

If arbitrary code/file edits are outside the authority, narrow the nonclaim: the system prevents duplicate lifecycle advancement, not every external action an agent might take before claiming.

## High blocker 5 — R0 canary location conflicts with inertness

R2's positive live ordering and canary causality are otherwise sound. But R0 is forbidden to create a production generation/decision card, while the live criterion says each sentinel is injected “only into the handoff decision card.” R0 therefore cannot meet both requirements literally.

Define two exact fixture types:

- R0 uses a precreated immutable **inert rail card** under the temporary 0700 test root; it contains the fresh sentinel and no lifecycle schema/state.
- End-to-end acceptance uses the immutable production decision card selected by the authority.

For both, the sentinel must be absent from the exact pre-compaction transcript/native summary snapshot, present in raw SessionStart output, and echoed in the first response. Static captured fixtures prove parser conformance only; raw installed event receipts prove invocation/schema/order.

## Review of requested gates

| Gate | R2 result |
|---|---|
| Positive manual rail before Build | **PASS** |
| Positive automatic rail before Build | **PASS** |
| `claimResume`/`claimWork` CAS shape | **Partial** — winner algebra present; invocation/orphan/GC absent |
| At-least-once prevents handoff loss | **PASS** |
| Duplicate authority work prevention | **Partial** — mandatory claim stated, not fully enforceable without attached contract |
| Observer zero-write | **FAIL** — append permission remains |
| Build → Review → QA | **PASS** for lifecycle and declared R0 sequence |
| Attached freeze contracts | **FAIL** — future attachment only |
| Canary causal provenance | **PASS** for end-to-end; R0 fixture location contradictory |
| PostCompact non-authority | **PASS** |
| tmux separation | **PASS with historical clutter** — explicitly non-gating/runtime |

## Invariants that survived R2 review

- Cognitive durability only; no detached worker, supervisor, launchd, or tmux production authority.
- Positive manual and automatic SessionStart injection precede lifecycle Build.
- R0 and lifecycle both declare Build → independent Review → QA.
- At-least-once immutable context remains deliverable until a distinct work claim.
- Full project/execution identity and strict no-fallback schema rules remain.
- One synchronous authority owns lifecycle mutations and adapter policy.
- PostCompact is observational and non-gating.
- Private journal, create-only generations, exact head, expected-version mutation, readback, privacy and power-loss nonclaim remain appropriate directions.
- Manual/automatic and positive/negative real-Claude evidence remain distinct.
- Historical v5 is now explicitly non-authoritative and non-runtime; no new tmux probe is permitted.
- Strict raw evidence/digest/non-authoritative-summary direction remains.

## Minimum revision required for PASS

1. Add positive and both PreCompact/SessionStart negative R0 rails, with R0 complete before Contract/Build.
2. Remove observer append permission and define a separate explicit evidence mutator if needed.
3. Attach or digest-link the exact CAS/clock/missing/quarantine/claim-GC/evidence contracts and test matrices; repeat exact review.
4. Complete claim token issuance, invocation, orphan recovery, GC interaction and nonclaim scope.
5. Define the inert R0 card separately from the production decision card.

## Final decision

**FAIL — build authorization NO; canonical promotion NO.**

Confidence: **0.99**.
