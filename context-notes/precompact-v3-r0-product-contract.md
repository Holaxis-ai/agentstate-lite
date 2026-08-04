---
type: Context Note
title: Revision 3 inert host proof rail product acceptance contract
actor: codex-r0-product-owner
timestamp: '2026-08-04T17:39:00.453Z'
---
# Summary

**Decision: RETIRE-DUPLICATE, then proceed.** The staged `scripts/r0-*`, `packages/cli/test/r0-*`, `packages/cli/test/fixtures/r0/`, ignored `docs/r0-live-rail-runbook.md`, and generated `.r0-live/` do not own a load-bearing product stage. Revision 3 already has (a) accepted installed-host evidence for the two positive Claude 2.1.220 compaction journeys and (b) one tracked T0 isolation/live-harness authority. The staged rail duplicates that authority, while its negative cases belong to the later manifest-pinned L0 candidate gate.

Ultimate goal: make agentstate-lite durable, versioned, conflict-safe memory for concurrent agent fleets in plain text owned by the user.

Proximate goal: remove the duplicate prerequisite rail and leave one closed, observable host-evidence boundary, so lifecycle work proceeds from accepted evidence without creating a second path/config/evidence authority.

This resolves the four-versus-five inconsistency: the prerequisite host premise has **two positive atomic cases**, already evidenced. The later candidate L0 gate has **six negative/fault atomic cases**, including separate manual and automatic PreCompact blocks and compact SessionStart halt. A five-case matrix arises only by incorrectly combining the two prerequisite positives with three later lifecycle negatives. If a human nevertheless orders a standalone combined replay, it must contain five atomic cases, not four, because manual and automatic PreCompact blocks are different host journeys; that combined replay is not the recommended product stage.

# Scope and non-goals

## In scope

- Treat `context-notes/precompact-v3-live-rail-probe@sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250` as the accepted pre-implementation host premise already consumed by the approved design and plan.
- Keep `packages/cli/test/fixtures/handoff/live-harness.mjs` plus `packages/cli/test/handoff-harness.test.ts` as the single T0 owner of opt-in, isolated launch preparation, exact environment bytes, protected outside-path inventory, host preflight, and later acceptance fault vocabulary.
- Retire the staged parallel preparer, settings fixture, inert hook, static runner/collector, tests, runbook, and repository-local evidence directory.
- Preserve an optional, explicitly authorized two-positive-case host replay contract for auditability; implement it only as an extension of the existing T0 harness, never as a second authority.
- Pin any replay to the explicit accepted artifact `/Users/brian/.local/share/claude/versions/2.1.220`, SHA-256 `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`, reported version `2.1.220 (Claude Code)`, Darwin/arm64. The moving `/Users/brian/.local/bin/claude` symlink, now resolving to 2.1.221, is not an authority.

## Non-goals

- No lifecycle authority, journal, handoff generation, candidate package, production hook, tmux, detached process, daemon, network service, board mutation, or real-user settings/auth/config inspection.
- No claim that STATIC simulations prove a LIVE predicate.
- No compatibility claim for Claude 2.1.221 or any host tuple other than the exact pinned 2.1.220 artifact.
- No replacement or weakening of the later `G0 -> R0 Exact-artifact Review -> Q0 -> L0 -> L1 -> L2 -> L3` chain.
- No pre-implementation execution of the later L0 failure cases.

# Closed case table

| Atomic case | Stage owner | Required observable oracle | Product disposition |
|---|---|---|---|
| `H0_MANUAL_POSITIVE` | Pre-implementation host premise | On explicit pinned 2.1.220 in a fresh isolated configuration, the accepted record shows one real full session emitted `PreCompact(trigger=manual) -> SessionStart(source=compact) -> PostCompact(trigger=manual)` in order, and event-valid SessionStart `additionalContext` was accepted without schema error. A declined `Not enough messages to compact` attempt is not PASS. | Already sufficient as an architectural premise in the accepted live-probe note. An optional replay adds exact positive-PreCompact stdout and sentinel absence/first-turn effect oracles because the persisted note does not expose those raw receipts. |
| `H0_AUTO_POSITIVE` | Pre-implementation host premise | On the same exact host tuple with bounded accepted pressure controls and no manual `/compact`, the accepted record shows one real full session emitted `PreCompact(trigger=auto) -> SessionStart(source=compact) -> PostCompact(trigger=auto)` in order, followed by Stop after the first post-compaction response; SessionStart `additionalContext` was accepted without schema error. | Already sufficient as an architectural premise in the accepted live-probe note. An optional replay adds raw response/sentinel/effect oracles. |
| `L0_PRECOMPACT_MANUAL_BLOCK` | Later exact-candidate L0 | Exact manifest-pinned candidate handles a real manual PreCompact failure and host-observed compaction cancellation. | Excluded from prerequisite rail. Must remain a distinct later L0 case. |
| `L0_PRECOMPACT_AUTO_BLOCK` | Later exact-candidate L0 | Exact manifest-pinned candidate handles a real automatic PreCompact failure and host-observed compaction cancellation under bounded pressure. | Excluded from prerequisite rail. Must remain distinct from manual. |
| `L0_SESSIONSTART_CONTINUE_FALSE` | Later exact-candidate L0 | Exact candidate returns the event-valid top-level halt and the host produces no first post-compaction model response within the accepted bound. | Excluded from prerequisite rail. |
| `L0_MISSING_HELPER` | Later exact-candidate L0 | Candidate readiness/launch evidence truthfully reports the missing boundary; it is not called fail-closed hook success. | Excluded from prerequisite rail. |
| `L0_NONEXECUTABLE_HELPER` | Later exact-candidate L0 | Candidate readiness/launch evidence truthfully reports the non-executable boundary. | Excluded from prerequisite rail. |
| `L0_HELPER_TIMEOUT` | Later exact-candidate L0 | Candidate readiness/launch evidence truthfully reports bounded timeout behavior. | Excluded from prerequisite rail. |
| `L1_MANUAL_MAIN` / `L2_AUTOMATIC_MAIN` | Later exact-candidate positive acceptance | First-response decision-card recovery, exact next action, generation/identity/CAS/privacy predicates on the one frozen candidate manifest. | Not a host-premise replay; excluded. |

The current official documentation constrains candidate response shapes, but may postdate 2.1.220. For any optional replay, unsupported fields or flags are FAIL/BLOCKED on the pinned host; documentation is not substituted for installed-host observation.

# Acceptance criteria

## Required consolidation PASS

1. **One authority:** the worktree has no staged `scripts/r0-prepare.mjs`, `scripts/r0-inert-hook.mjs`, `scripts/r0-run-case.mjs`, `scripts/r0-rail-collector.mjs`, `packages/cli/test/r0-collector.test.ts`, `packages/cli/test/r0-live-rail.test.ts`, `packages/cli/test/support/r0-live-rail.ts`, `packages/cli/test/fixtures/r0/`, ignored `docs/r0-live-rail-runbook.md`, or `.r0-live/` artifact. A file inventory is the oracle.
2. **Existing owner preserved:** the tracked T0 live harness remains the sole preparation/isolation authority, and its deterministic isolation/drift/foreign-path tests pass from the repository gate. No parallel settings codec, path layout, manifest namespace, or verdict implementation exists.
3. **Stage names are unambiguous:** prerequisite evidence is called `H0 host premise` or `host-contract replay`; `R0` continues to mean only the later independent exact-artifact review after G0.
4. **Accepted evidence is discoverable:** the plan/design references the exact persisted 2.1.220 live-probe evidence and the explicit host tuple. No command resolves the moving symlink as proof of that tuple.
5. **Later gates are unchanged:** the six L0 cases remain distinct and manifest-pinned after Q0; L1/L2 retain their candidate-specific positive oracles.
6. **Safety:** no cleanup or test mutates real Claude/Codex configuration, auth, HOME, project bundle, production journal, or outside-path canaries. Generated evidence never lives in the repository.
7. **Reviewability:** an independent reviewer can prove items 1-6 using exact tree bytes, one bounded file inventory, the existing deterministic tests, and the accepted bundle records. No live Claude run is required for consolidation PASS.

Consolidation PASS is the definition of done for this product-contract unit. It is sufficient to proceed to the accepted lifecycle implementation plan because the positive installed-host premise is already recorded and all unresolved negative behavior is deliberately a later candidate gate.

## Optional audit replay PASS

Only if a human explicitly requires stronger provenance for the prior probe, extend the existing T0 harness and run exactly `H0_MANUAL_POSITIVE` and `H0_AUTO_POSITIVE`. A single create-only campaign manifest must bind the explicit 2.1.220 realpath/digest/version/platform/architecture, source and harness digests, isolated settings bytes, exact command vectors, cwd/environment, case-specific high-entropy sentinels, time bounds, and protected before-state. Each case retains bounded raw hook stdin/protocol stdout/stderr/exit/timing receipts plus host lifecycle/event evidence and first-turn effect evidence. A read-only adjudicator must reject missing, duplicate, reordered, cross-session, stale, STATIC, hardcoded, or digest-mismatched evidence. Restoration and process/outside-path inventories are mandatory. One deliberately corrupted oracle must turn the verdict red before LIVE authorization.

Overall optional replay PASS requires both cases PASS plus restoration PASS on one immutable campaign. One case PASS is not partial acceptance.

# Failure classifications

- `FAIL_DUPLICATE_AUTHORITY`: staged R0 files or a second settings/manifest/verdict/path owner remains.
- `FAIL_STAGE_CONFLATION`: a prerequisite result claims later L0, L1/L2, lifecycle, exact-artifact, or shipping acceptance; or `R0` is used for both stages.
- `FAIL_HOST_DRIFT`: a run follows the 2.1.221 symlink, omits the exact host tuple, or generalizes a 2.1.220 result to another tuple.
- `FAIL_PROVENANCE`: required manifest/raw receipts/digests/order/sentinel provenance are missing, mutable, stale, mixed across cases, or synthesized.
- `FAIL_PROTOCOL`: hook output is invalid for the observed event, positive PreCompact emits SessionStart fields, stdout contains diagnostic bytes, or installed Claude rejects the response.
- `FAIL_EFFECT`: a positive replay lacks real compaction/order or first-turn sentinel visibility; a later negative claim lacks the host-visible cancellation/suppression oracle.
- `FAIL_SAFETY`: real user/global state, project bundle, auth/config contents, network scope, or protected outside paths are touched; a managed process survives; STATIC evidence enters a LIVE verdict.
- `FAIL_RESTORATION`: isolated settings/protected state are not byte-identical after the campaign or cleanup cannot prove process absence.
- `BLOCKED_PINNED_HOST`: exact 2.1.220 artifact, PTY, isolated auth, or bounded automatic compaction is unavailable before the relevant event. BLOCKED is not PASS and must not be worked around with 2.1.221 or real HOME/auth.
- `BLOCKED_HUMAN_DECISION`: applies only if someone wants 2.1.221 compatibility or an audit replay despite its non-load-bearing status. Neither blocks lifecycle implementation against the accepted 2.1.220 premise.

# Authorization boundary

This contract authorizes planning and implementing the consolidation/retirement unit only. It does **not** authorize running Claude, mutating settings, executing later L0 cases, building lifecycle authority, freezing a candidate, or making acceptance/shipping claims.

After consolidation passes independent exact review, the orchestrator may proceed with the already accepted revision-3 implementation dependency graph. That transition relies on the persisted 2.1.220 host premise; it does not claim the eventual candidate works.

An optional H0 replay requires a separate explicit human request because it uses live Claude/auth. Before that replay, the exact harness bytes must pass independent review and adversarial QA; only then may one isolated two-case campaign run against the explicit pinned 2.1.220 artifact. A replay PASS authorizes using those observations as host premises only.

The later candidate remains governed by `G0 -> R0 Exact-artifact Review -> Q0 -> six-case L0 -> L1 -> L2 -> L3`. No result from this prerequisite contract consumes, skips, or weakens any edge in that chain.

# Assumptions and confidence

- **High confidence:** the positive installed-host premise is already accepted. The design and unanimous lifecycle review explicitly cite real 2.1.220 manual/automatic order and defer the unverified negatives to candidate gates.
- **High confidence:** the staged rail is a duplicate authority. Current branch bytes show the tracked T0 live harness already owns isolation, exact launch bytes, outside-path verification, preflight, and all six L0 fault identifiers.
- **High confidence:** manual and automatic PreCompact block journeys are distinct atomic cases; combining them under one case would permit partial acceptance.
- **Medium confidence on audit sufficiency:** the persisted prior probe is an accepted architectural record, but this review did not receive its raw hook receipts. That is why an optional two-case replay is defined without making it a prerequisite.
- **Version caveat:** current official docs may be newer than 2.1.220. Their shapes are candidate hypotheses until observed on the explicit pinned artifact.
- **Remaining human choices:** (1) whether audit-grade replay of the two already-accepted positives is worth the extra live-run/review cost; and separately (2) whether to open a compatibility/support-expansion lane for 2.1.221. Default for both is no; neither is silently inferred from the moving symlink.

# Plan recommendations

1. Replace the proposed rail-repair plan with one consolidation unit: remove the staged duplicate/ignored/generated R0 paths and preserve the existing T0 harness as the only owner.
2. Have an independent reviewer verify the exact deletion inventory, single-owner boundary, stage naming, explicit 2.1.220 pin, and unchanged later L0/L1/L2 cases. Run the relevant existing T0 harness tests and repository gate according to the accepted risk tier; do not run Claude.
3. Update planning prose to call the accepted pre-implementation evidence `H0 host premise`, reserving `R0` for exact-artifact review. Do not create a new manifest schema for a retired stage.
4. If a human orders audit replay later, extend the existing T0 harness with the two closed H0 positives and one read-only adjudicator in the same reviewed unit. Do not revive the staged `scripts/r0-*` path.
5. Keep all six negative/fault cases in later L0 on the frozen candidate. This is where candidate-specific block/halt/readiness behavior becomes product acceptance.
6. Treat Claude 2.1.221 as a separate compatibility decision and campaign. Never let `/Users/brian/.local/bin/claude` select it implicitly for revision-3 proof.

[supports](../tasks/precompact-v3-r0-product-contract-review.md)
