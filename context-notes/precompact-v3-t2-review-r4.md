---
type: Context Note
title: Precompact v3 T2 final R4 review
actor: codex-precompact-v3-t2-reviewer-r4
timestamp: '2026-08-03T20:22:07.490Z'
---
# Summary

Status: complete — **PASS** with confidence **0.99**.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: verify exact SHA `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` centralizes exhaustive install/status readiness reasons and preserves every accepted T2 regression; this serves the ultimate goal by closing the last truthful-readiness drift before T3.

Inputs: R3 review `context-notes/precompact-v3-t2-review-r3@sha256:50b14406da0a6565c85a50a57a63db996581d09ddb877ca8ab2efca19dd2df49`; builder repair `context-notes/precompact-v3-t2-builder@sha256:f216519f567c3dc4b1889edccf7ebbc60c1d415c9780512a93ccb49b280bcfe2`.

Narrow attacks: both CLI surfaces across helper unhealthy and every Claude host state, then nullable main/missing-generation recovery and the six prior lifecycle/content/host/helper regressions.

## Exact input and scope

- Reviewed checkout: `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` exactly.
- Parent: `04dd17a4759e125f94dd143dccdc5ca012c68770`.
- Repair diff: `packages/cli/src/commands/hook.ts` and `packages/cli/test/hook-lifecycle.test.ts` only (54 insertions, 10 deletions); `git diff --check` passes.
- Final checkout is clean. No code, task, or sync edit was made by this review.

## Findings

No blocking finding remains. The repair introduces one `claudeRailReason(hostState, helper)` projector and both `hook install` and `hook status` call it. Its switch names every `ClaudeHostState`, while unhealthy-helper failure takes precedence consistently.

The public CLI 4 host states × 2 helper states matrix passed for both install and status, with exact equality between the surfaces:

| Host state | Healthy helper | Unhealthy helper |
| --- | --- | --- |
| `verified_host` | `true / OK` | `false / HOOK_HELPER_UNHEALTHY` |
| `installed_unverified` | `false / INSTALLED_HOST_UNVERIFIED` | `false / HOOK_HELPER_UNHEALTHY` |
| `not_installed` | `false / HOST_NOT_INSTALLED` | `false / HOOK_HELPER_UNHEALTHY` |
| `unsupported_runtime` | `false / UNSUPPORTED_RUNTIME` | `false / HOOK_HELPER_UNHEALTHY` |

Each row also retained its exact `support_state`. The previously failing case is closed: healthy-helper install and status both emit `not_installed / false / HOST_NOT_INSTALLED`.

The nullable/operator regression passed: `--main-agent` forwards `agentId: null`; `--generation-absent` forwards `expectedGenerationVersion: null`; diagnose preserves `headVersion` and nullable `generationVersion`; agent/main and generation-version/absent pairs remain mutually exclusive.

The prior exploit boundaries passed: empty/8,000-character eligible-resume context fails closed without board fallback; malformed raw stdin returns the universal fail-closed response; managed command recognition remains start-anchored and writer-owned; authority diagnostics/recovery remain content-free with strict receipt allowlists; Claude host verification remains exact-tuple-bound; helper health remains exact-path/digest, bounded, and strict-schema validated.

## Verification evidence

- Focused lifecycle/session/handoff/process suite: **105 tests; 91 pass, 0 fail, 14 intentional skips**.
- Explicit exploit/operator slice: **7 pass, 0 fail**.
- Opt-in frozen red-contract slice (`unsupported-pre-post-context`, `substring-hook-ownership`, `content-bearing-diagnostics`, `foreign-settings-preservation`): **4 pass, 0 fail**.
- `npm run typecheck -w @holaxis/aslite`: pass.
- Post-test user-global guards unchanged: `~/.claude/settings.json` = `1d0b7b85ee477312a1bfcc2999ded9678f02e5b00df1d7b1c96edf6f388459e5`; `~/.codex/config.toml` = `9eceda823acad96291f7e1cf45af59a236f0ac586970469d9160885be5875063`; `~/.codex/hooks.json` and `~/.config/opencode/plugins/axi-agentstate-lite.js` remain absent.

## Verdict

**PASS, confidence 0.99, exact SHA `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854`.** T2's final install/status truthfulness drift is closed and the accepted nullable, fail-closed, content-free, host-verification, helper-health, ownership, and preservation contracts remain intact.
