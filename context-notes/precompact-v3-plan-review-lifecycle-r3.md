---
type: Context Note
title: 'P0 installed-host lifecycle review — revision 3, pass 3'
actor: codex-precompact-v3-plan-lifecycle-r3
timestamp: '2026-08-03T18:27:25.730Z'
---
# Summary

status: PASS

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: independently determine whether the exact revised revision-3 lifecycle plan is implementable and can prove its rail on the installed host; this serves the ultimate goal by preventing implementation against an untestable runtime or safety contract.

## Exact review inputs

- `designs/pre-compact-multi-session`: `sha256:4237f82372b997763cf2f3e6ce800f89a7399b1f3142dd2deca44b043dbe3e13`
- `plans/pre-compact-multi-session-v3`: `sha256:ac38b886e76259d81218c551e7fde6d1e469cea674dd161986788500ffe4ef8a`
- `context-notes/precompact-v3-orientation`: `sha256:96ca75739f6b3d330841dbebbb503c652081b4885c74764de9a59bbb6d30b78d`
- `context-notes/precompact-v3-host-identity`: `sha256:ad45e3ceaf0cf8a89235aa8d052e090a5f524de97009cc97254bca7fc8fda468`
- prior lifecycle R2 review: `context-notes/precompact-v3-plan-review-lifecycle-r2` at `sha256:b87b9b3f3121d95d3277360f73ecd79fa38d0b5f3969a113fad894d67dce2b59`
- installed lifecycle evidence retained from `context-notes/precompact-v3-live-rail-probe` at `sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`

## Gate findings

No blocking lifecycle or installed-host feasibility defect remains in these exact revisions.

1. **Exact host readiness is now mechanically verifiable.** The design, plan, host-identity note, T2 readiness contract, and immutable candidate manifest all key verified support on resolved executable realpath, SHA-256, reported version, platform, and architecture—not on an inaccessible source commit. Read-only revalidation matched the pinned tuple exactly: `/Users/brian/.local/share/claude/versions/2.1.220`, SHA-256 `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`, `2.1.220 (Claude Code)`, Darwin/arm64, Mach-O arm64, 256908272 bytes, executable mode. Any drift becomes `installed_unverified` and prevents `rail_ready:true`.
2. **Both PreCompact failure modes are mandatory exact-host gates.** T0 fixtures and L0 now require real candidate failures for `trigger:manual` and bounded context-pressure `trigger:auto`, proving each prevents compaction before the corresponding happy-path L1/L2 journeys.
3. **The observed event rail remains coherent.** The plan implements the installed `PreCompact -> SessionStart(compact) -> PostCompact -> first response -> Stop` order, keeps PostCompact audit-only, refreshes prepared state after declined compaction, and gives SessionStart an exact head/generation recheck before emitting context.
4. **Load-bearing SessionStart no longer shares a board/network critical path.** Compact and eligible-resume branches return only bounded handoff output. Startup, clear, and resume with no eligible fresh handoff retain ordinary board orientation. This removes the prior timeout/overflow coupling rather than merely ordering two operations inside one command.
5. **Managed-hook ownership is safe and falsifiable.** Structural anchored recognition, shared writer/recognizer grammar, explicit legacy forms, exact preservation of the installed foreign `printf`, legacy Pre/Post coexistence warnings, malformed-settings refusal, and install/status/uninstall golden/on-disk tests are all required.
6. **Failure boundaries are truthful.** The guarantee begins only after successful helper invocation; helper health/readiness and L0 separately characterize missing, non-executable, killed, and timed-out commands. Real SessionStart `continue:false` is a required live negative gate, not inferred from fixtures.
7. **Sub-agent support cannot pass on fixtures.** L3 requires genuine bounded sub-agent compaction with stable non-null `agent_id` across PreCompact, SessionStart, PostCompact, first-response oracle, and SubagentStop. Failure to exercise it is `BLOCKED-PENDING-VERIFICATION` and blocks shipping.
8. **Durability and retention claims match the mechanism.** Writes claim process-level CAS/read-back only, not fsync/power-loss durability. Fixed logical expiry prevents stale restore; exact-CAS event-driven head detachment/GC is explicit, including the absence of a wall-clock deletion daemon claim. Stop observation remains informational and cannot change delivery/redelivery or authorize deletion.
9. **The proof chain is artifact-locked.** Full `npm run check`, package/helper/harness/host tuple manifesting, exact-artifact Review, QA, negative rail, manual, automatic, and sub-agent gates all use one digest; any drift restarts the chain.

## Verdict

PASS. T0 may begin only after all independent plan reviewers pass these exact revisions. The remaining unknown runtime outcomes are correctly expressed as later falsifiable live gates and shipping stop conditions, not assumed implementation facts.

blockers: none

confidence: high
