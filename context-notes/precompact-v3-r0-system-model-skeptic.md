---
type: Context Note
title: Revision 3 R0 proof-rail system-model skeptic review
actor: codex-r0-system-skeptic
timestamp: '2026-08-04T17:41:03.914Z'
---
# Summary

The persisted R0 proof-rail system model is **not plan-ready**. Verdict: **FAIL** (confidence 0.99). Its central phase premise is false against the current worktree and durable project state: lifecycle T0-T4 are already implemented and accepted at `36c741a8173832d75d61a7ab138b5219c4415c66`, and an earlier isolated installed-host probe already proved manual and automatic positive compaction ordering on pinned Claude Code 2.1.220. The model would build a second prerequisite rail whose negative cases already belong to later L0, while duplicating the existing T0 live-harness authority.

This is a system-state failure, not a narrow r6 code defect. Do not turn this model into an implementation plan and do not authorize live Claude execution from it.

# Exact reviewed model and evidence

- Model: `designs/precompact-v3-r0-proof-rail-system-model@sha256:a2876766102f6db0f041c7caff1b526a6ad0be0353286f6c4615d1c5867cd4cb`. The orchestrator reported that the change from the earlier `57b3...` pin was only an appended parent-task cross-link; this review used the current exact head.
- Prior r7 fixture review: `context-notes/precompact-v3-r0-live-rail-skeptic-r7@sha256:3f6b6fb48ebd74e0f98b519cf20d44890083e268efd00ed03e74ede21f62ad43`.
- Official-hook contract note: `context-notes/precompact-v3-r0-official-hook-contract-2026-08-04@sha256:610f93e8c6b1389ff83e0dec44f02eef49902eb183e82d40a1753499a240e6b8`.
- Existing positive live evidence: `context-notes/precompact-v3-live-rail-probe@sha256:2adc5d05aa93c228711b35b5ee9fe434573987266cfe809b42b2f1466ef5d250`.
- Exact supported host: `context-notes/precompact-v3-host-identity@sha256:ad45e3ceaf0cf8a89235aa8d052e090a5f524de97009cc97254bca7fc8fda468` (real executable `/Users/brian/.local/share/claude/versions/2.1.220`, SHA-256 `8addc857f3fe64d5a0368af9ee50321b50afb4a6918ba3ef018ab84f5dbbe081`).
- Current phase model: `context-notes/precompact-v3-orientation@sha256:af10abacc8f43aa7d237d4dffafd21b1dd1b6a0b717e4191ffdff1f3212a4928`.
- Current parent task: `tasks/pre-compact-multi-session@sha256:01a927bebe91c855832e98a5ed530a1f3a14608cb040eedaed5976394a6e4ba0`.
- Current worktree: `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, feature SHA `36c741a8173832d75d61a7ab138b5219c4415c66`.
- Existing T0 authority: `packages/cli/test/fixtures/handoff/live-harness.mjs`, SHA-256 `7cc496d2ebeee7ffaf8e659494d9220d5cdc33b46408ba5ae440f2153bfe7e7d`, with its isolation/drift contract in `packages/cli/test/handoff-harness.test.ts`, SHA-256 `c3ea9e1b721d732083d6378ed76c7238e509811bdd625671a1cc1d5b04a82df9`.

No code was edited, no tests or Claude commands were run, no real configuration/auth was inspected or changed, and no bundle sync was performed.

# Blocking findings

## 1. The model reconstructs a stale prerequisite after the product has passed that phase

The model says it is “before lifecycle-authority implementation.” The exact worktree instead contains `packages/cli/src/handoff/{identity,schema,transcript,store,authority}.ts` and `packages/cli/src/commands/hook-lifecycle.ts`; git history records T1-T4 implementation and repairs through `36c741a`. The current orientation and parent-task body record T0-T4 as independently accepted.

The earlier installed-host probe already proved on the pinned 2.1.220 executable that real manual and automatic journeys produce `PreCompact -> SessionStart(source=compact) -> PostCompact`, that SessionStart is sequential and load-bearing, and that PostCompact is audit-only. The accepted later gate sequence assigns negative host behavior to L0 after exact-artifact Review and QA. The proposed inert prerequisite therefore has no stated remaining epistemic claim that is both unproved and load-bearing.

The current parent task exposes the session-boundary corruption directly: its frontmatter description says to repair r7 R0 blockers, while its body says T0-T4 are complete and the actual blocker is a T3.5 launch/reap architecture choice. Planning from the frontmatter/handoff summary would regress the project.

## 2. The model creates a second live-rail authority

`packages/cli/test/fixtures/handoff/live-harness.mjs` already owns opt-in live gating, fresh private `/private/tmp` roots, isolated HOME/config/project/bundle/journal/manifest layout, immutable launch bytes, secret-name handling, outside-path canaries, PTY/auth/absolute-executable preflight, and the L0 fault-id vocabulary. Its tests already pin these contracts.

The model separately assigns the same responsibilities to a new campaign preparer, settings installer/restorer, live orchestrator, recorder, and adjudicator, while the staged r6 scripts introduce another root/settings/command vocabulary. Repairing both would create two path authorities, two settings authorities, two launch authorities, and an agreement burden with no product benefit. “One executable authority” cannot coexist with this split unless the existing harness is the owner and the staged rail is retired.

## 3. The safety contract is internally impossible and leaves authentication external state undefined

The purpose forbids network contact while requiring real manual/automatic Claude sessions and host-effect evidence. Those live journeys require an authenticated Claude invocation and may require model/network work; a no-network synthetic invocation cannot prove the claimed installed-host effects. The model must either obtain explicit authorization for bounded Anthropic network use or stop calling the result live host evidence.

It also promises not to touch auth material but never defines how a fresh isolated `CLAUDE_CONFIG_DIR` authenticates. The existing harness deliberately does not serialize secrets into immutable launch bytes. A future live authority needs an explicit in-memory allowlisted auth injection or another reviewed isolated mechanism, redaction rules, and a proof that no global HOME/config fallback occurred. Auth/keychain availability cannot remain an invisible host dependency.

Host identity is also drifting. The supported tuple pins the versioned 2.1.220 realpath and `8add...` digest; the runbook names the moving `/Users/brian/.local/bin/claude` launcher, which the orchestrator reports now resolves to 2.1.221. Any new host claim must either invoke the exact versioned 2.1.220 path or explicitly reopen the support boundary for 2.1.221. Resolving a moving launcher at run time is not a pin.

## 4. The evidence semantics overclaim what self-recorded bytes and absence can prove

A hook-side receipt can prove bytes read and bytes intended/written; it cannot alone prove that Claude received or accepted stdout. A wrapper that buffers, records, then forwards can itself fail between receipt and delivery. The adjudicator is not independent merely because it is a separate executable if every input was produced by the same hook/orchestrator. Host-owned lifecycle/effect observations must remain a separate evidence channel, and the report must distinguish “hook-observed/attempted response bytes” from “host accepted/effect observed.” Current `stream-json --include-hook-events` documentation is only a hypothesis until the exact 2.1.220 executable is feature-probed; the official note explicitly warns that current docs may be newer than the installed binary and may not expose raw hook stdin/stdout.

Likewise, “compaction did not proceed,” “no first response,” and “sentinel present only through injection” are unbounded negative claims as written. The rail can prove only bounded, enumerated observations: an affirmative PreCompact attempt; no correlated compact SessionStart or model response before a named terminal event/process exit and deadline; sentinel absence from named pre-injection artifacts; exact response bytes; and a correlated later host effect. Timeout/quiescence without a terminal oracle is inconclusive, not PASS.

STATIC/LIVE roots and schema labels are useful accidental-mixing defenses, but they do not authenticate evidence against another same-user process that can write the same files. The threat model must say this explicitly; live provenance rests on pinned launch identity plus independent host effects, not on a writable `mode: LIVE` label or the claim that “only” one local executable can create a namespace.

## 5. The proof surface is not closed

The model itself leaves four versus five cases for “product confirmation.” The existing fault table additionally names missing helper, non-executable helper, and helper timeout lanes; the accepted plan places those and both manual/automatic PreCompact blocks in later L0. The official contract note requires an explicit PostCompact evidence-only/out-of-scope decision. The model also reuses `R0`, which the accepted plan already assigns to exact-artifact Review.

A planner cannot assign dependencies or acceptance criteria until one unique stage name and one row-per-case table identify: purpose, trigger/source, exact installed response, affirmative host oracle, bounded negative oracle, evidence channels, and whether the case belongs here or later L0. The default proportional answer is to keep negatives in L0 and not create this extra stage.

## 6. Restoration and evidence retention are underspecified relative to the existing authority

The model requires restoration before adjudication, byte identity for “every protected external path,” retained immutable evidence, and proof that no managed process remains, but it does not define which root is retained versus restored or the process identity/reap oracle. A fresh isolated config does not need a second production-like backup authority merely to test foreign-hook preservation; the existing settings golden and T0 outside-canary mechanism already own that proof shape. Cleanup failure should remain a FAIL, but its exact owned paths/processes must be inherited from the one existing harness rather than recreated in prose.

# Survived attacks

- The model correctly rejects the r6 positive PreCompact SessionStart-shaped response. Positive PreCompact must be an installed-host-verified empty/omit-decision success; compact SessionStart context and `continue:false` suppression are separate schemas.
- It correctly reserves hook stdout for protocol JSON and recognizes that diagnostics/evidence must not add tee/debug bytes to that channel.
- Fresh per-case sentinels, create-only receipts, exact event/campaign/session/cwd correlation, event ordering, stale/duplicate/cross-case rejection, and pre-injection absence checks are sound accidental-error defenses once their evidence scope is bounded.
- Private temporary roots, restrictive modes, symlink/existing-root refusal, absolute commands, no repository `.r0-live`, isolated settings, and restoration-failure-is-FAIL are appropriate safety invariants.
- Separating recording from read-only adjudication is useful for policy ownership, even though it does not by itself create independent provenance.
- The model correctly refuses to treat an inert rail as lifecycle acceptance and excludes production authority, handoff generations, tmux, daemons, and detached execution from this fixture.
- The prior installed-host positive probe remains valid as bounded design evidence for 2.1.220; it is not final candidate acceptance. The existing T0 harness remains the valid isolation/preflight authority; it is intentionally not yet a full candidate live orchestrator.

# Required repairs

## Preferred resolution: retire this prerequisite rather than implement it

1. Reject the model and do not create an implementation plan from it.
2. Retire the staged duplicate artifacts from the feature worktree in one explicit cleanup unit: `.r0-live/`; `packages/cli/test/fixtures/r0/`; `packages/cli/test/r0-collector.test.ts`; `packages/cli/test/r0-live-rail.test.ts`; `packages/cli/test/support/r0-live-rail.ts`; `scripts/r0-inert-hook.mjs`; `scripts/r0-prepare.mjs`; `scripts/r0-rail-collector.mjs`; `scripts/r0-run-case.mjs`; and ignored `docs/r0-live-rail-runbook.md`. This review did not delete them.
3. Preserve as authorities/evidence: the 2.1.220 live-rail probe and host-identity notes; the accepted T0-T4 implementation at `36c741a`; the existing `fixtures/handoff/live-harness.mjs` plus its tests/settings goldens/fault table; and later R0/Q0/L0-L3 gates for exact candidate evidence.
4. Repair the durable phase record immediately: replace the stale `context-notes/precompact-main` handoff and reconcile the parent task's frontmatter with its body before dispatching more work.
5. Resume the actual next dependency recorded by the parent-task body: a human architecture choice at T3.5. Recommended option: reuse the already audited v5 no-autostart evidence, freshly probe only the remaining H2-H5 physical/controller facts, then require exact acceptance and skeptic review before any builder resumes. Alternative supervisor research is a materially different architecture and requires explicit authorization. No R0 duplicate repair, Claude/API run, candidate freeze, or G0 acceptance should intervene.

## Only if a human explicitly requires a reproducible inert replay rail

Rename it so it cannot collide with exact-artifact R0; extend the existing live harness instead of creating another authority; close one non-duplicative case table; pin the versioned 2.1.220 executable/digest and installed feature probes; explicitly authorize and bound network/auth handling; distinguish hook-observed from host-observed evidence; define bounded negative oracles; and make PostCompact's evidence-only role explicit. Then exact-review the revised model again before planning.

# Plan-gate recommendation

**FAIL — reject model, retire duplicate rail, reorient to the current T3.5 decision.** The model must not advance to planning. The highest-leverage next action is correcting the persistent phase record and surfacing the already-recorded human architecture choice, not repairing r6 or running another inert/live matrix.

[reviews](../tasks/precompact-v3-r0-system-skeptic.md)
