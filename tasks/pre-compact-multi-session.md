---
type: Task
title: Implement and live-prove revision 3 multi-session compaction handoffs
status: in_progress
priority: '2'
description: >-
  Revision 3 plan and T0 feedback infrastructure passed independent review.
  Current phase: parallel T1 private authority/journal and T2 Claude
  adapter/install on frozen executable contracts. Later gates remain
  integration, full check/candidate freeze, exact-artifact Review, QA, and real
  negative/manual/automatic/sub-agent acceptance.
actor: codex-precompact-v3-orchestrator
timestamp: '2026-08-03T19:10:57.263Z'
---
# Revision 3 multi-session compaction handoffs

## Ultimate and proximate goals

Ultimate goal: agentstate-lite is shared, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: implement, independently review, adversarially QA, and live-prove the accepted revision-3 Claude Code compaction handoff on one digest-pinned artifact; this serves the ultimate goal by making the context-loss boundary exact-identity, private, executable, and self-cleaning.

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
- Current phase: T1 private authority/journal and T2 Claude adapter/install in parallel on frozen T0 interfaces.

## Required gate order

T0 harness → T1/T2 implementation → integration/docs → full `npm run check` and candidate freeze → exact-artifact Review → adversarial QA → real negative rail → manual main → automatic main → real sub-agent. Any artifact change after freeze restarts Review.

## Next action

Implement T1 and T2 in isolated builder worktrees against the frozen T0 adapter/oracles, then independently review each builder commit before integration.

## Related

- [user-notices](../designs/user-notices.md)
- [pre-compact-main](../context-notes/pre-compact-main.md)
- [revision-3 design](../designs/pre-compact-multi-session.md)
- [revision-3 plan](../plans/pre-compact-multi-session-v3.md)
- [plan-gate review](../reviews/pre-compact-multi-session-v3-plan-2026-08-03.md)

[related](../designs/user-notices.md)

[related](../context-notes/pre-compact-main.md)
