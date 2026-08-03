---
type: Context Note
title: Precompact v3 T2 repair review
actor: codex-precompact-v3-t2-reviewer-r2
timestamp: '2026-08-03T20:07:12.766Z'
---
# Summary

Revision 3 T2 repaired exact-commit re-review.

**Verdict: FAIL**  
**Confidence: 0.99**

Exact commit reviewed: `417cf04c19f7f6505631e7baa547532f51af64ad`  
Rejected parent: `5e02a8eeb39753f53f71d2cb0a2b35f811c74862`  
Prior FAIL: `context-notes/precompact-v3-t2-review@sha256:7e97372ceeb42ccb8209e0e579ebf076be4f1e1f8bf74f3487269e4e7934ae31`  
Builder repair: `context-notes/precompact-v3-t2-builder@sha256:bb3df6d0493c5a501c77e4e066a6a5dc3eb3486c11aab039a41905033c8487cc`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently verify that the repaired T2 adapter closes every prior lifecycle/readiness blocker without regressing exact operator recovery or truthful status; this serves the ultimate goal by keeping T3 integration behind a fail-closed and complete boundary.

The checkout was clean and exactly at the requested SHA before and after review. I inspected the complete repair diff, reran every prior exploit, ran the focused/process suites, the T2/shared frozen red contracts, typecheck, global-file hash guards, and additional main/missing-generation/not-installed boundary probes. No code, task, or sync edit was made.

## Prior blockers re-tested

1. **Eligible-resume board isolation: closed.** `packages/cli/src/commands/hook-lifecycle.ts:240-245` now maps empty or at-least-8,000-character authority context to `continue:false`. Direct probes returned `HANDOFF_SCHEMA_INVALID` twice with `boardCalls:0`; committed regression is at `packages/cli/test/hook-lifecycle.test.ts:129-147`.
2. **Malformed raw JSON: closed.** `packages/cli/src/commands/hook.ts:1043-1056` returns the universal `continue:false` refusal on parse failure, while unknown parsed values take the same path through `hook-lifecycle.ts:166-195`. Direct `{`, `null`, and `{}` probes all refused without invoking authority or board.
3. **Unknown/nested receipt content: closed for the tested attack.** The open receipt index was removed and the validator accepts only declared primitive fields with constrained types (`hook-lifecycle.ts:25-36,103-153`). Direct unknown and nested fields were rejected; health/diagnose/recover refuse invalid schemas without echoing values (`hook.ts:956-965,1059-1099`).
4. **Exact host tuple and unverified reason: closed.** Host classification now compares realpath, digest, reported version, platform, and architecture (`hook-lifecycle.ts:256-284`). Direct mutation of each field classified `installed_unverified`; the exact tuple classified `verified_host`. A healthy helper plus path-spoofed host reports `INSTALLED_HOST_UNVERIFIED`.
5. **Strict helper health parsing: closed.** The configured helper parser rejects unknown outer/hook keys, wrong types/reasons, and invalid nested receipts (`hook.ts:895-924`). The committed real-process table and this review rejected all prior schema/content payloads. Missing, non-executable, digest, minimal-environment, and timeout behavior remain intact.

## Blocking findings

1. **The repaired operator seam cannot express two required exact identities and cannot return the versions recovery needs.** The accepted execution identity uses exact `agent_id` **or null**, with null mechanically denoting a main execution; recovery must also handle a valid head selecting an absent generation by comparing an explicit null generation version. T2 instead requires `agentId:string` and `expectedGenerationVersion:string` (`packages/cli/src/commands/hook-lifecycle.ts:45-55`) and the CLI requires non-empty `--agent-id` and `--generation-version` (`packages/cli/src/commands/hook.ts:1077-1096`). Direct main diagnosis without an agent id fails before authority invocation, and there is no representation for an exact null missing-generation version. This makes main operator diagnosis/recovery and the reviewed missing-generation recovery case unreachable without inventing identity/version sentinel policy in T2.

   Diagnosis is also unable to supply its own exact recovery inputs: the strict receipt permits one generic `storageVersion` but not distinct `headVersion` and `generationVersion` (`hook-lifecycle.ts:25-36,103-145`), while the accepted design requires diagnosis to report both raw versions. A direct content-free diagnosis carrying both versions was rejected. T3 cannot losslessly adapt that result through the frozen port.

2. **`not_installed` status still receives an incompatible reason.** For a complete five-event registration and healthy exact helper with no Claude executable, status correctly computes `support_state:"not_installed"` and `rail_ready:false`, but the catch-all branch at `packages/cli/src/commands/hook.ts:1138-1144` reports `reason:"INSTALLED_HOST_UNVERIFIED"`. This was reproduced directly. The repair covers `installed_unverified` and `unsupported_runtime`, but not reason agreement for the fourth required state.

## Unchanged verified surfaces

- The start-anchored new grammar and enumerated anchored legacy forms remain unchanged. Exact installed foreign SessionStart `printf` and legacy Pre/Post groups survive pure and on-disk install, byte-idempotent reinstall, and uninstall.
- Claude still receives exactly one managed entry for PreCompact, SessionStart, PostCompact, Stop, and SubagentStop. Codex/OpenCode retain board-only SessionStart and report compaction unsupported.
- The provenance-pinned 13-field live SubagentStop fixture remains unchanged.
- The authority port still contains no identity construction, CAS, selection, transition, recovery, or GC implementation.

## Verification

- Focused lifecycle/session/harness/process lane: exit `0`; 102 tests, 88 passed, 14 intentionally skipped T1/red contracts.
- Targeted opt-in T2/shared frozen contracts (`foreign-settings-preservation`, `unsupported-pre-post-context`, `substring-hook-ownership`, `content-bearing-diagnostics`): 4 passed.
- `npm run typecheck -w @holaxis/aslite`: exit `0`.
- `git diff --check`: passed.
- User-global guard: SHA-256 of `~/.claude/settings.json` and `~/.codex/config.toml` was identical before/after; absent `~/.codex/hooks.json` and OpenCode managed plugin remained absent.
- Direct adversarial probes were confined to temporary roots and cleaned them.

## Nonblocking hardening

- The receipt field allowlist is strict, but `stage` and `outcome` accept any matching lowercase token rather than enumerated lifecycle values. This did not reproduce the prior arbitrary-field disclosure, but enumerating the frozen operational values would make the content-free claim stronger.

The two blockers require a new source SHA and independent T2 re-review before T3 integration.
