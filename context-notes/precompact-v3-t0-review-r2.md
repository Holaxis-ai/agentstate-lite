---
type: Context Note
title: Revision 3 T0 repaired exact-commit review
actor: codex-precompact-v3-t0-reviewer-r2
timestamp: '2026-08-03T19:09:52.076Z'
---
# Summary

Revision 3 T0 repaired exact-commit review.

**Verdict: PASS**  
**Confidence: 0.97**

Exact commit reviewed: `ebfd190a8fb01525eb9a9cd2bcca6570bb3d2c61`  
Accepted design: `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`  
Accepted plan: `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`  
Prior T0 FAIL: `context-notes/precompact-v3-t0-review@sha256:a1feeabd16bd023aaec5385a82d36a0222a69c6d2cdcdfb4ab3ac4f271ec576d`  
Live SubagentStop evidence: `context-notes/precompact-v3-subagentstop-live-fixture@sha256:716b8835af91ab4f7312212c0e7e3a637fd654c4815fc5ecd0acc76414bf28d5`

The checkout was clean and exactly at the requested SHA. I inspected the repair commit and the complete T0 surface. Every changed file remains under `packages/cli/test/**`; no production source or task document changed.

## Five-blocker re-review

1. **Executable stale-Stop, fixed-expiry, and corruption process proofs: closed.** `packages/cli/test/handoff-process-harness.test.ts:104-161` creates a true child-process guard-read race, displaces the head, and byte-compares both old and replacement generations, including unchanged fixed expiry and absent response observation. Lines 163-228 prove exact expired-head detachment precedes generation deletion and that a fresh-head race makes stale detachment conflict without deleting the generation. Lines 230-277 fail malformed current state closed, preserve raw corrupt bytes in quarantine, kill after quarantine, and resume exact-version head detachment. These supplement the original one-winner CAS, orphan, and stale recovery tests rather than replacing them.

2. **Boundary-driven red adapter and frozen oracle: closed.** `packages/cli/test/fixtures/handoff/rejected-probes.json` now owns structured inputs, rejected outcomes, and revision-3 expected outcomes for all thirteen defects. `packages/cli/test/support/handoff-contract-adapter.ts:84-195` executes the rejected algorithms behind one typed adapter, while `handoff-rejected-contracts.test.ts:35-63` separately characterizes rejected observations and compares the opt-in lane to fixture-owned expected values. T1/T2 can replace adapter wiring with production-boundary observations without changing the expected fixture.

   I specifically attacked `unsupported-pre-post-context`. Its expected `{PreCompact:true, PostCompact:true}` represents event-valid mapping, not presence of model context: a corrected mapping with empty/side-effect-only outputs and no `hookSpecificOutput.additionalContext` produces both `true` values. Thus T2 can turn this contract green without violating design sections 141, 145, and 151-153. The boolean names are underspecified, but they do not freeze the rejected Pre/Post injection schema.

3. **Exact live SubagentStop provenance: closed.** `packages/cli/test/fixtures/handoff/events.json:109-126` uses the exact field order and JSON types from the installed Claude Code 2.1.220 live trace, pins the source note/version and sanitized payload SHA-256, and contains the two fields missing from the inferred fixture. `handoff-harness.test.ts:41-61` verifies field order, provenance, critical values/types, and recomputed sanitized-payload digest. The source note documents the pinned executable tuple, isolated launch, one real subagent, raw/sanitized hashes, and identical before/after user-global inventories.

4. **Scrubbed immutable launch environment and outside canary: closed.** `packages/cli/test/fixtures/handoff/live-harness.mjs:76-141` creates fresh isolated home/config/project/bundle/journal/manifest paths, freezes a minimal launch environment, omits parent secrets, digest-pins the 0400 launch file, and records outside-canary hashes/inventory. Lines 144-175 verify the digest/canary and actually spawn a harmless child with only the frozen environment. `handoff-harness.test.ts:201-272` checks exact path bindings, absence of inherited auth, child environment equality, successful unchanged verification, and detection of an outside mutation.

5. **Exact foreign subtree through current transforms and future seam: closed.** `settings-goldens.json:3-4` digest-pins the installed command and complete SessionStart subtree. `handoff-harness.test.ts:105-135` recomputes those digests, then drives the exact subtree through current install and uninstall behavior. `handoff-contract-adapter.ts:197-209` is the replaceable transform seam; current destructive classification is characterized in default tests and exact preservation is a named opt-in red contract.

## No new blocker

The new support code is test-only adapter/oracle infrastructure, not a second production authority. The process harness uses the existing core `FilesystemBackend` CAS rather than recreating storage semantics. The red cases now depend on structured fixture inputs and executable transformations, not assertion inversion alone. No user-global settings, real journal, shared board, production source, or task file is mutated by the test lane.

## Residual nonblocking deferrals

- Before T2 wiring, rename or expand the `unsupported-pre-post-context` booleans to explicit fields such as `event_valid` and `has_additional_context:false`; this removes semantic ambiguity without changing the accepted outcome.
- When T1/T2 replace `currentHandoffContractAdapter`, retain the rejected adapter for default characterization and wire production observations only to the revision-3 contract lane. This is adapter wiring, not an oracle change.
- Real manual/automatic compaction, real compact `continue:false`, launch/timeout behavior, and genuine subagent compaction remain correctly deferred to L0-L3 on one immutable candidate digest. Stale-resume refusal remains a T1/Review/QA requirement rather than T0 production behavior.

## Verification

- Focused default lane: exit `0`; 33 tests, 19 passed, 14 skipped.
- Opt-in red lane: exit `1`; 19 passed and exactly 14 named failures (thirteen revision-3 contracts plus foreign preservation).
- `npm run typecheck -w @holaxis/aslite`: exit `0`.
- `git diff --check`: passed. Worktree remained clean at the exact SHA.

Ultimate goal: preserve agentstate-lite as shared, versioned, conflict-safe memory. Proximate review goal: freeze falsifiable T0 interfaces before production authority work; the repaired harness now serves that goal and T1/T2 may begin against these reviewed interfaces.
