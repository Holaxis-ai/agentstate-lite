---
type: Context Note
title: Precompact v3 T2 review
actor: codex-precompact-v3-t2-reviewer
timestamp: '2026-08-03T19:51:52.809Z'
---
# Summary

Revision 3 T2 exact-commit review.

**Verdict: FAIL**  
**Confidence: 0.99**

Exact commit reviewed: `5e02a8eeb39753f53f71d2cb0a2b35f811c74862`  
Parent/frozen T0 commit: `ebfd190a8fb01525eb9a9cd2bcca6570bb3d2c61`  
Accepted design: `designs/pre-compact-multi-session@sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`  
Accepted plan: `plans/pre-compact-multi-session-v3@sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`  
Accepted repaired T0 review: `context-notes/precompact-v3-t0-review-r2@sha256:ee034c56999f56caa4e27dbc5e1f17fa128d838099af77ee358d64d8f2017f4e`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently determine whether the frozen T2 Claude lifecycle/install/readiness boundary is safe to integrate; this serves the ultimate goal by preventing context loss, content disclosure, or a false readiness claim at the compaction boundary.

The checkout was clean and exactly at the requested SHA before and after review. I inspected all seven changed files and ran the normal focused lane, repaired T0 process lane, typecheck, exact global-file before/after hashes, and direct adversarial probes. No code, task, or sync write was made.

## Blocking findings

1. **An eligible fresh-resume decision can start board/network/render work.** `packages/cli/src/commands/hook-lifecycle.ts:180-185` treats an authority `context` result whose rendered context is empty or at least 8,000 characters as a board fallback for every non-compact SessionStart. A `context` decision is precisely the eligible fresh-resume branch; the accepted design requires that branch to return only the bounded handoff result and never start board, network, or home-render work. Direct probe with `source:"resume"` and 8,000 characters returned board context and recorded `boardCalls:1`. The committed test covers only valid-length resume (`packages/cli/test/hook-lifecycle.test.ts:94-127`), so it misses the branch.

2. **Malformed raw hook input is acknowledged successfully instead of refused.** `packages/cli/src/commands/hook.ts:1032-1044` catches JSON parsing failure, substitutes `null`, projects it to `{}`, writes `{}\n`, and returns normally. Direct `hook run` with truncated JSON produced exactly `{}`. Because the same command serves PreCompact, this is a silent successfully-invoked fail-open path with no prepare/block result, contrary to the malformed-refusal and fail-closed contract. Known-event malformed objects are mapped correctly at `hook-lifecycle.ts:106-133`; raw parse failure is not.

3. **Diagnosis/recovery are neither exact-target nor exact-version gates, and the output guard is not content-free.** The CLI usage declares diagnosis `--session-id` and recovery session/head/generation versions, but `packages/cli/src/commands/hook.ts:1060-1075` validates only runtime and conditionally forwards whatever fields happen to be present. Direct `hook recover --json` reached the authority with only `{runtime:"claude-code"}`. The same boundary's `assertContentFree` is a forbidden-key blacklist (`hook.ts:938-955`), while the authority receipt type admits arbitrary keys (`hook-lifecycle.ts:25-37`); direct diagnosis returned `note:"SECRET-CONTENT"`, which was printed unchanged. This violates exact-version recovery and the design's closed set of content-free receipt fields/reason codes.

4. **Readiness can overclaim the verified host and contradict itself.** The accepted host identity includes the resolved executable realpath, but `VERIFIED_CLAUDE_HOST` and `classifyClaudeHost` omit path comparison (`packages/cli/src/commands/hook-lifecycle.ts:197-223`). A direct probe using `/attacker/claude` plus the pinned digest/version/platform/architecture classified `verified_host`. Separately, status computes a false rail on an unverified host but reports the healthy helper reason (`packages/cli/src/commands/hook.ts:1112-1134`); the direct receipt was `support_state:"installed_unverified", rail_ready:false, reason:"OK"`. Install's corresponding reason is truthful (`hook.ts:1249-1255`), so the two commands disagree.

5. **The helper health/schema probe accepts schema-invalid, content-bearing success.** `packages/cli/src/commands/hook.ts:893-899` checks only action, schema label, and `ready:true`; it accepts arbitrary extra fields and any string as `reason`. A temporary exact helper returning the correct label plus `reason:"NOT_A_REASON secret material"` and `payload:"secret"` was classified `healthy:true`. That defeats the required schema-invalid-output rejection and can feed a non-content-free reason into status.

## Verified surfaces

- All five installed-host event fixtures are present, including the provenance-pinned 13-field live SubagentStop payload (`packages/cli/test/fixtures/handoff/events.json:109-126`). Normal PreCompact, compact SessionStart, PostCompact, Stop, and SubagentStop projections are event-shaped; the unavailable authority blocks normal PreCompact and compact SessionStart through `HOOK_HELPER_UNHEALTHY` (`hook-lifecycle.ts:63-76,162-193`).
- `HandoffAuthorityPort` is narrow and contains no adapter-side identity construction, selection, CAS, transition, recovery, or GC implementation (`hook-lifecycle.ts:46-61`).
- The new ownership marker is start-anchored and legacy recognition is enumerated/anchored (`packages/cli/src/commands/hook.ts:115-149`). Pure and on-disk install/reinstall/uninstall tests preserve the exact installed foreign SessionStart `printf` and legacy Pre/Post groups; five managed Claude events converge idempotently (`hook.ts:289-359,414-455`; `hook-lifecycle.test.ts:147-258`). Malformed settings installation is refused by the preflight validator (`hook.ts:542-614`).
- Claude receives five events while Codex and OpenCode retain board-only SessionStart behavior (`hook.ts:1180-1215`). Status reports Codex/OpenCode compaction as `unsupported_runtime` (`hook.ts:1136-1137`).
- The configured helper is resolved, permission-checked, digested, launched without a shell under the minimal environment, and killed on timeout (`hook.ts:825-907`). Direct missing/non-executable/timeout probes behaved as unhealthy; the 40 ms timeout returned in 44 ms. These mechanics do not close blockers 4-5.

## Verification

- Normal focused lane (`hook-lifecycle`, `session-start`, `handoff-harness`, `handoff-rejected-contracts`): exit `0`; 91 tests, 77 passed, 14 intentionally skipped T1/red contracts.
- Repaired T0 process lane: exit `0`; 8 passed.
- `npm run typecheck -w @holaxis/aslite`: exit `0`.
- `git diff --check`: passed.
- User-global guard: SHA-256 of `~/.claude/settings.json` and `~/.codex/config.toml` was identical before/after; absent `~/.codex/hooks.json` and OpenCode managed plugin remained absent.
- Adversarial probes reproduced every blocker above in temporary roots only. The helper timeout probe cleaned its temporary root.

## Nonblocking observations

- The default unavailable authority also halts startup/clear SessionStart because the adapter calls authority before source branching. T3 may make the integrated authority return `no_handoff`, but an explicit compatibility test should pin ordinary startup/clear behavior after integration.
- The focused health test proves digest/missing/non-executable/timeout behavior but does not itself assert the child environment; the implementation visibly constructs a minimal environment at `hook.ts:835-845`.

T2 must be repaired and independently re-reviewed at a new exact SHA before T3 integration.
