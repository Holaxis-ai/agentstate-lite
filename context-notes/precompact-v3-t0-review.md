---
type: Context Note
title: Revision 3 T0 exact-commit review
actor: codex-precompact-v3-t0-reviewer
timestamp: '2026-08-03T18:53:38.208Z'
---
# Summary

Revision 3 T0 exact-commit review.

**Verdict: FAIL**  
**Confidence: 0.99**

Exact commit reviewed: `a65142ec7a2781673ecd5fc5d41072cb321eccb2`  
Accepted design: `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`  
Accepted plan: `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`

## Scope and result

The checkout was clean and exactly at the requested commit. All 17 changed files were inspected. The commit is confined to `packages/cli/test/**`; it introduces no production authority or adapter policy. The core-backed cross-process CAS driver is a useful reusable base, and the installed foreign SessionStart `printf` literal in `settings-goldens.json` exactly matched the current installed settings when checked read-only.

The T0 gate nevertheless does not close. Passing default tests characterize tables and scaffolding, but several load-bearing accepted oracles are missing or tautological.

## Blocking findings

1. **The accepted stale-Stop/fixed-expiry process proof is absent.** The accepted plan explicitly requires a filesystem/process assertion that stale Stop observation leaves deletion time unchanged, plus executable fixed-expiry head detachment and corruption coverage. `packages/cli/test/handoff-process-harness.test.ts:32-100` executes only one-winner head CAS, kill-after-generation orphan publication, and stale exact-version recovery refusal. `packages/cli/test/handoff-harness.test.ts:151-166` merely checks that scenario names and killpoint strings occur in `store-scenarios.json`; the stale-Stop oracle at `packages/cli/test/fixtures/handoff/store-scenarios.json:9` is prose and never runs. The same is true for corrupt-current-generation and fixed-expiry detachment. This directly misses plan T0 line 55 and the final skeptic gate's named blocker.

2. **Twelve of thirteen red probes fail by construction rather than against an executable rejected boundary.** `packages/cli/test/handoff-rejected-contracts.test.ts:38-94` locally constructs values whose result is definitionally `false` (for example, checking that an object containing `hookSpecificOutput` lacks it, comparing identical eight-character prefixes, or initializing `present: true` and expecting `false`). The default lane asserts those expressions are false at lines 96-103; the opt-in lane then asserts the same expressions are true at lines 110-114. It is therefore guaranteed red independently of candidate behavior and cannot turn green when T1/T2 fixes land unless the test itself is rewritten. Only `substring-hook-ownership` reaches a production boundary. This does not meet the accepted T0 gate that probes fail for their intended executable reasons.

3. **The SubagentStop fixture is provenance-honest but does not satisfy the accepted exact-installed-payload requirement.** The accepted plan names exact installed fixtures for all events, including SubagentStop. `packages/cli/test/fixtures/handoff/events.json:109-125` explicitly says the shape is contract-derived and not live-captured. That disclosure is correct and preferable to overclaiming, but it leaves the T0 interface blocked pending capture/ratification rather than passed. The other event fixtures self-identify as sanitized installed-host traces; their field-set assertions are deterministic.

4. **The live skeleton is currently non-mutating only because it never launches Claude; it has not frozen a safe isolated launch boundary.** `packages/cli/test/fixtures/handoff/live-harness.mjs:33-67` creates a `claude-config` directory but never constructs or exports a launch environment binding `CLAUDE_CONFIG_DIR` to it. `before_inventory` is hard-coded to `[]` at line 55, and inventory is limited to the new temporary root, so it cannot detect an accidental write to user-global configuration when candidate invocation is added. The present `prepare` command wrote only under its fresh `/private/tmp/aslite-handoff-live.*` root in the focused test, but the accepted T0 interface must make that isolation structural before T2/L0 uses it.

5. **The foreign-hook golden is exact, but the claimed preservation assertion is tautological.** `packages/cli/test/handoff-harness.test.ts:95-103` clones the fixture and compares it to itself, then uses only `/printf.*agentstate-lite/`. It neither freezes the exact command/object with an explicit literal or digest nor passes the golden through any transform seam. The simplified `FOREIGN_PRINTF` used by the ownership red probe at `handoff-rejected-contracts.test.ts:31` is not the exact installed command from the golden. Thus the exact input fixture exists, but the accepted exact foreign-object/string preservation contract is not yet testable.

## Required changes before interface freeze

1. Add real process tests for stale Stop with byte-/field-exact unchanged fixed deletion eligibility, fixed-expiry final-head CAS detachment, corrupt-current failure/recovery, and the missing killpoint paths; retain the existing true cross-process tests.
2. Replace inverted toy red assertions with executable rejected implementations or real current boundaries driven by the committed fixtures, so each fails for a specific behavioral mismatch and can turn green by wiring the corrected authority/adapter without rewriting the oracle.
3. Capture the installed SubagentStop payload or explicitly rerun the exact-version plan gate to permit a deferred unverified fixture; do not freeze an inferred shape as an accepted installed contract.
4. Make the live harness produce a scrubbed, immutable launch environment with exact `CLAUDE_CONFIG_DIR`, project, journal, and manifest paths; add real before/after inventories or canary hashes that prove no outside path changed.
5. Freeze and assert the exact installed foreign object/string, use that exact fixture in the ownership probe, and expose a preservation assertion seam for install/reinstall/uninstall transforms.

Stale-resume refusal itself is a T1 production requirement in accepted plan line 83, not an additional reason to fail T0. The T0 blocker is the non-executable stale-response/stale-deletion feedback rail described above.

## Verification evidence

- Focused default lane: exit `0`; 27 tests, 14 passed, 13 skipped.
- Opt-in red lane (`AGENTSTATE_LITE_RUN_HANDOFF_RED_CONTRACTS=1`): exit `1`; all 13 named red contracts failed, but 12 failures are the constructed inversion described above.
- `npm run typecheck -w @holaxis/aslite`: exit `0`.
- `git diff --check` passed; checkout remained clean at the exact SHA.

Ultimate goal: preserve agentstate-lite as shared, versioned, conflict-safe memory. Proximate review goal: prevent production implementation from building on unfalsifiable T0 interfaces; this serves the ultimate goal by making concurrency, retention, isolation, and host-rail failures reproducible before policy code exists.
