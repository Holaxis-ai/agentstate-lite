---
type: Context Note
title: Revision 3 T3 cross-boundary review
actor: codex-precompact-v3-t3-reviewer
timestamp: '2026-08-03T20:56:23.284Z'
---
# Summary

FAIL — independent T3 cross-boundary review of exact commit `4f0f998566fd6daa9a4ea3c3f931cababdd5ec01`. Confidence: 0.99.

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for agent fleets. Proximate goal: verify that the independently accepted T1 authority and T2 host rail are joined by one truthful, private production seam; this serves the ultimate goal by preventing a nominally installed rail from failing only at the compaction boundary.

Accepted inputs: design `sha256:2d527d1f244a475a9ac872ff31303c806ea83184e8e68a39b50f8a73eb0975e0`; plan `sha256:aeb9cc2c8d0d14f951f62c2130252d71d5a80a4c7f6aced2c64700e1494e9a22`; T1 PASS `context-notes/precompact-v3-t1-review-r4`; T2 PASS `context-notes/precompact-v3-t2-review-r4`.

# Blocking finding

1. **The production health/readiness seam reports a rail ready without validating the journal that the default authority must use.** `createHandoffAuthorityPort().health()` returns `{ready:true, reason:"OK"}` unconditionally (`packages/cli/src/commands/hook-authority.ts:149-154`), and `createDefaultHandoffAuthorityPort()` catches only synchronous construction (`:181-187`). The constructor merely creates `HandoffStore` (`packages/cli/src/handoff/authority.ts:327-334`; `packages/cli/src/handoff/store.ts:71-78`); ownership, mode, symlink, and creatability checks occur only in async `HandoffStore.initialize()` (`store.ts:80-117`) on the first lifecycle mutation. T2's configured-helper probe accepts that health output and feeds it directly into `rail_ready` (`packages/cli/src/commands/hook.ts:864-928,1163-1173`).

   Empirical exact-artifact reproduction: with `HOME` pointed at a fresh root whose `~/.agentstate/handoffs` is a symlink, `node packages/cli/dist/agentstate-lite.mjs hook health --json` exited 0 with `ready:true / OK`; the first valid real `PreCompact` payload against a scratch bundle then returned `{"decision":"block","reason":"HANDOFF_STORE_UNSAFE"}`. Status/install can therefore certify a globally unusable persistence rail.

   The root-selection environment also disagrees across the probe boundary: minimal helper execution preserves `AGENTSTATE_LITE_HANDOFF_ROOT` (`hook.ts:858`), while the authority reads `AGENTSTATE_LITE_HANDOFF_TEST_ROOT` (`authority.ts:263-265`). In isolated/live operation the health subprocess can inspect a different root from the lifecycle helper.

   Required repair: expose an authority-owned async health operation that initializes/verifies the exact selected journal root without duplicating store policy; make the port delegate to it; use one root-override contract across helper probe and lifecycle execution; add external-helper health/status regressions for symlink, permissive, and uncreatable roots proving `rail_ready:false`, plus a healthy-root agreement case. Repair requires a new SHA and T3 re-review before T4.

# What survived

- The one default T1 authority is wired into `hook run`; construction exceptions retain the unavailable fail-closed port.
- All five event mappings are narrow and correct, including `agent_transcript_path` for SubagentStop; no trigger is invented for restore.
- Compact and fresh resume bypass board/network/render work; stale/no-handoff resume falls back to board; no-bundle prepare is a no-op; compact missing state fails closed.
- Main/subagent/project namespaces remain separated; nullable diagnose/recover generation versions survive the bridge; operator receipts remain content-free.
- The bridge contains no identity/CAS/selection implementation, and T1 contains no Claude event/settings policy.
- Journal bytes stayed outside the scratch bundle, and the two corrected fixture/dist paths are module-relative.

# Verification

- Exact worktree clean at `4f0f998566fd6daa9a4ea3c3f931cababdd5ec01`; `git diff --check` passed.
- Integration-specific lane: 6 pass, 0 fail.
- Frozen opt-in contract lane: 26 pass, 0 fail; all 13 named probes plus foreign-settings preservation green with unchanged expectations.
- Combined T0/T1/T2/process/session-start/integration lane: 137 pass, 0 fail.
- One initial command used a nonexistent root loader and failed before test loading; the package-declared loader reruns above passed. This was an invocation error, not product evidence.
- Independent unsafe-root health/PreCompact agreement probe reproduced the blocker above.

# Progress / next action

T3 review is complete and blocked on the single readiness disagreement. Repair the authority-owned health/root-selection seam, add the regression, commit a new exact SHA, and request focused re-review. No code, task, or sync mutation was made by this review.
