---
type: Context Note
title: Precompact v3 T2 final narrow review
actor: codex-precompact-v3-t2-reviewer-r3
timestamp: '2026-08-03T20:15:17.047Z'
---
# Summary

Revision 3 T2 final narrow exact-commit review.

**Verdict: FAIL**  
**Confidence: 0.99**

Exact commit reviewed: `04dd17a4759e125f94dd143dccdc5ca012c68770`  
Parent: `417cf04c19f7f6505631e7baa547532f51af64ad`  
R2 FAIL: `context-notes/precompact-v3-t2-review-r2@sha256:4317bdf44625f36dcaa120f00f7bd2819c43773af7d696cd3ca61e4ad271d81d`  
Builder repair: `context-notes/precompact-v3-t2-builder@sha256:a07f50c06732928f2df0b32d5aa6a9d245a142623034b227292bbf91a0b35579`

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: verify the exact nullable operator and absent-host repairs without reopening accepted T2 lifecycle/readiness behavior; this serves the ultimate goal by keeping T3 behind a lossless, truthful adapter boundary.

The checkout was clean and exactly at the requested SHA before and after review. I inspected the entire three-file repair diff, reran the R2 attacks and prior regression lane, and made no code, task, or sync edit.

## R2 operator blocker: closed

- `HandoffOperatorTarget.agentId` is now `string | null`; `HandoffRecoveryTarget.expectedGenerationVersion` is `string | null` (`packages/cli/src/commands/hook-lifecycle.ts:47-57`).
- The CLI requires exactly one of `--agent-id`/`--main-agent` and exactly one of `--generation-version`/`--generation-absent` (`packages/cli/src/commands/hook.ts:1088-1121`). Direct probes proved `--main-agent` forwards `agentId:null`, `--generation-absent` forwards `expectedGenerationVersion:null`, and both mutually exclusive pairs reject when supplied together. The ordinary subagent/string-version path remains green.
- Strict diagnosis receipts now admit distinct validated `headVersion:string` and `generationVersion:string|null` (`hook-lifecycle.ts:25-38,106-150`). Direct valid string and null cases passed; a malformed head version failed. The exact diagnosis output was rendered unchanged and then recover forwarded the exact values.

## Blocking finding

**Absent-host readiness remains inconsistent on the install surface.** Status now correctly maps a healthy helper plus no Claude executable to `support_state:"not_installed"`, `rail_ready:false`, `reason:"HOST_NOT_INSTALLED"` (`packages/cli/src/commands/hook.ts:1160-1171`). But install independently constructs the same readiness receipt and still maps every healthy non-verified host to `INSTALLED_HOST_UNVERIFIED` (`hook.ts:1298-1312`). A direct temporary-root install reproduced:

```json
{"support_state":"not_installed","rail_ready":false,"reason":"INSTALLED_HOST_UNVERIFIED"}
```

The requested invariant was that `not_installed` carries `HOST_NOT_INSTALLED`, and the accepted T2 contract requires both install and status to report readiness truthfully. The committed regression covers only status, so the parallel install branch escaped it.

## Regression verification

- Eligible resume with empty/oversized context: `continue:false`, `boardCalls:0`.
- Malformed `{`, parsed `null`, and parsed `{}`: universal fail-closed refusal; no authority/board invocation.
- Unknown/nested receipt content and invalid health payloads: rejected without echo.
- Exact Claude realpath/digest/version/platform/architecture classification: retained.
- Anchored current/legacy ownership, exact installed foreign subtree preservation, five Claude events, and Codex/OpenCode board-only behavior: retained.
- Missing/non-executable/timed-out helper behavior and minimal helper environment: retained.

## Test evidence

- Focused lifecycle/session/harness/process lane: exit `0`; 104 tests, 90 passed, 14 intentionally skipped T1/red contracts.
- Targeted opt-in T2/shared frozen contracts: 4 passed.
- `npm run typecheck -w @holaxis/aslite`: exit `0`.
- `git diff --check`: passed.
- User-global guard: `~/.claude/settings.json` and `~/.codex/config.toml` hashes were unchanged; absent Codex hooks and OpenCode managed plugin remained absent.

A single shared readiness-reason projector (or the same complete host-state switch in both install and status) plus an install absent-host regression should close the blocker. The repair requires a new exact SHA and narrow re-review before T3.
