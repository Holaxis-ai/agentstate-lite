---
type: Task
title: Implement and live-prove revision 3 multi-session compaction handoffs
status: in_progress
priority: '2'
description: >-
  T0-T4 passed exact-SHA review. The second T3.5 Plan failed exact review on a
  parallel-hook synchronization race and attestation/replay/auth-cleanup
  enforceability; an isolated exact-2.1.220 primitive probe now determines the
  next reviewed design.
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T21:41:19.984Z'
---
# Revision 3 multi-session compaction handoffs

## Ultimate and proximate goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: close the T3.5 executable candidate-and-live-acceptance gap, review the complete rail, then freeze and carry one immutable packed candidate through Review, QA, and real-host acceptance; this serves the ultimate goal by making the context-loss boundary exact-identity, private, executable, and empirically trustworthy.

## Problem

The old fixed `context-notes/pre-compact-main` convention collides across concurrent main sessions. Revision 2 was correctly rejected because its PreCompact/PostCompact model-context rail was unsupported, ids were shortened, repeated promotion failed, consume was generation-unsafe, schema was unvalidated, and expiry had no real owner.

## Accepted revision-3 direction

Revision 3 is a Claude-only exact-host pilot with:

- canonical project identity plus full `(runtime, session_id, agent_id|null)` execution identity;
- one private executable authority and host-local 0700 journal outside bundle/board/sync;
- a CAS head plus generation-addressed records, strict schema, deterministic bounded evidence card, fixed logical expiry, event-driven GC, and content-free exact-version recovery;
- PreCompact preparation, compact SessionStart-only restoration, PostCompact audit, and informational Stop/SubagentStop observation;
- structural managed-hook ownership that preserves foreign hooks exactly;
- one artifact manifest pinned through full checks, independent Review, QA, negative rail, manual main, automatic main, and real sub-agent acceptance.

The exact accepted design/plan and unanimous independent gate are recorded in `reviews/pre-compact-multi-session-v3-plan-2026-08-03`.

## Progress

- Revision 2 rejection retained as historical evidence; none of its proposed global changes are authorized.
- Installed Claude lifecycle and automatic compaction rail probed successfully in isolated configuration.
- Revision-3 design/plan passed final lifecycle, product/acceptance, and adversarial-skeptic review.
- Feature branch/worktree: `feat/precompact-handoff-v3` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`, based on `origin/main` `138a3c7c756e5fdb883a84b3c10611f92253033e`.
- T0 feedback infrastructure was committed at `ebfd190a8fb01525eb9a9cd2bcca6570bb3d2c61` after an independent FAIL-and-repair cycle. Its final review `context-notes/precompact-v3-t0-review-r2` passed at 0.97 confidence with 19 executable checks and 14 boundary-driven red contracts.
- A real isolated Claude subagent supplied the exact installed SubagentStop fixture; global configuration was byte-identical before/after.
- T1 private authority/journal passed independent exact-SHA review at `a77ef92fa009ee424497317c129c6a6f88f122ef` (`context-notes/precompact-v3-t1-review-r4`, confidence 0.98) after three FAIL-and-repair rounds.
- T2 Claude adapter/install passed independent exact-SHA review at `e0aa63335dc4d4f1c5c21c74eb3fec8bdacad854` (`context-notes/precompact-v3-t2-review-r4`, confidence 0.99) after three FAIL-and-repair rounds.
- T3 integration passed independent exact-SHA re-review at `579de4df5076f042282d0292db6ead0839f97ef3` (`context-notes/precompact-v3-t3-review-r2`, confidence 0.99). The authority owns health/readiness, install/status and live execution agree on journal-root failures, and only `AGENTSTATE_LITE_HANDOFF_ROOT` remains as the test/host seam.
- T4 source-owned help/reference/skill documentation passed independent exact-SHA re-review at repaired, rebased integration SHA `36c741a8173832d75d61a7ab138b5219c4415c66` (`context-notes/precompact-v3-t4-review-r2`, confidence 0.99).
- The branch now contains current `origin/main` and package identity `0.1.0-pre.3`.
- A pre-G0 readiness audit blocked freeze because the live harness is still T0-isolation-only and the existing package verifier always rebuilds/deletes a scratch artifact. Its first T3.5 prescription retained a sound `freeze`/`verify-existing` split but failed independent acceptance and skeptic review: it did not yet own real-Claude PTY invocation, deterministic L0-L3 oracles/event evidence, exact reviewed-SHA transactional freeze, immutable filesystem/postflight checks, R0/Q0 continuity/replay resistance, or explicit auth/global privacy snapshots.
- Revised T3.5 plan `plans/precompact-v3-t35-candidate-acceptance@sha256:191e2ae88887246a65a6d8682f468acaa1eb47e1facfd5828043d5c762a44fc0` now names one executable authority, transactional freeze, factored existing-tarball verification, immutable/pre-post checks, replay-resistant attestations, repo-owned tmux/event/fault/canary oracles, and protected-state privacy scans.
- The revised Plan failed its second exact acceptance/skeptic review. Static candidate integrity largely survived, but the load-bearing SessionStart corruption lane races the managed PreCompact final read-back; R0/Q0 findings and campaign replay state are under-bound; tmux auth/crash cleanup is contradictory; and real-npm/root-newness claims need enforceable boundaries.
- Current phase: an isolated exact-host capability probe is testing exec-form hooks, independent stdin, synchronous parallel-wait behavior, and whether a flushed managed-handler completion record is visible before the sibling join. Its result determines the next exact Plan revision and whether T3 production mechanics must reopen. No T3.5 code or G0 freeze is authorized.

## Required gate order

T0 harness → T1/T2 implementation → T3 integration review → T4 docs/rebase review → T3.5 candidate/live-rail plan review → T3.5 test-first implementation/exact review → full `npm run check` and candidate freeze → exact-artifact Review → adversarial QA → real negative rail → manual main → automatic main → real sub-agent. Any artifact change after freeze restarts Review.

## Next action

Finish the exact-host primitive probe, revise T3.5 around only observed synchronization/evidence, bind structured human assertions and campaign replay state, choose an honest tmux auth/cleanup contract, and repeat both exact plan reviews. Do not implement or freeze from either rejected plan or the current isolation-only harness.

## Related

- [user-notices](../designs/user-notices.md)
- [pre-compact-main](../context-notes/pre-compact-main.md)
- [revision-3 design](../designs/pre-compact-multi-session.md)
- [revision-3 plan](../plans/pre-compact-multi-session-v3.md)
- [plan-gate review](../reviews/pre-compact-multi-session-v3-plan-2026-08-03.md)

[related](../designs/user-notices.md)

[related](../context-notes/pre-compact-main.md)
