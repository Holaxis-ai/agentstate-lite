---
type: Context Note
title: 'Pre-compact handoff: revision 3 T3.5 architecture decision'
description: >-
  R0 duplicate retired and reviewed PASS; sole blocker is the explicit T3.5
  architecture choice.
actor: codex-takeover-main
timestamp: '2026-08-04T17:47:29.381Z'
---
# Summary

Takeover completed the first unprocessed event and corrected the stale phase model. Skeptic r7 was a valid FAIL, but the staged R0 repair itself was a duplicate of already accepted host evidence and the existing T0 live-harness authority. The duplicate was retired, the preserved T0 harness test passed, and independent retirement review returned PASS at 0.98 confidence. Live Claude execution remains unauthorized.

# Goals

Ultimate goal: agentstate-lite is durable, versioned, conflict-safe memory for concurrent agent fleets, in plain text and owned by the user.

Proximate goal: resolve the T3.5 candidate/live-acceptance architecture choice before any further builder work; this serves the ultimate goal by preventing an unowned launch/reap or late-process premise from entering the compaction-memory acceptance rail.

# Current phase

- Feature branch/worktree: `feat/precompact-handoff-v3` at clean SHA `36c741a8173832d75d61a7ab138b5219c4415c66` in `/private/tmp/aslite-precompact-v3.RLDTIZ/repo`.
- T0-T4 lifecycle authority, adapter, integration, and documentation are already implemented and independently accepted. The earlier statement that lifecycle work had not started was false.
- The exact 2.1.220 positive installed-host premise remains `context-notes/precompact-v3-live-rail-probe`; the tracked T0 isolation owner remains `packages/cli/test/fixtures/handoff/live-harness.mjs`.
- The staged `scripts/r0-*`, parallel R0 tests/settings/runbook, and repository `.r0-live` evidence namespace are absent. They were untracked/ignored, so retirement changed no tracked source and required no code commit.
- Preserved T0 owner/test digests remain `7cc496d2...7e7d` and `c3ea9e1b...df9`; the exact package-cwd harness suite reports 9 pass, 0 fail, 1 intentional skipped red contract.
- Independent retirement review: `context-notes/precompact-v3-r0-retirement-review@sha256:39a74001748cf9edfa2fc7f883c999eadccdaccee3c568aaebd60352062a8660` — PASS, confidence 0.98.
- `R0` again means only the later exact-artifact Review after G0. The six negative/fault journeys remain later L0 cases.

# Material decision now required

The parent task's real next dependency is the T3.5 architecture choice:

1. **Recommended recorded option:** reuse the already audited v5 no-autostart evidence, freshly probe only the remaining H2-H5 physical/controller facts, then require exact product/acceptance and skeptic review before implementation resumes.
2. **Alternative:** reject that tmux-derived acceptance mechanism and authorize a separately designed no-tmux/supervisor or foreground-control architecture. This is a materially different plan and must be designed and reviewed before code.

The superseded handoff also said tmux, detached execution, daemons, and launchd were out of scope, while the durable parent task still presents v5 reuse versus supervisor architecture as the open choice. That conflict is not safe to resolve by inference. It is the sole human decision blocker.

# Prohibited until the decision

No T3.5 builder, new host probe, Claude/API/auth use, candidate freeze, R0/Q0/L0-L3 advance, or revival of the duplicate R0 fixture is authorized.

# Durable records

- Product contract: `context-notes/precompact-v3-r0-product-contract`
- Test architecture (retained only as an optional future replay design): `context-notes/precompact-v3-r0-test-architecture`
- System-model rejection: `context-notes/precompact-v3-r0-system-model-skeptic`
- Retirement plan/builder/review: `plans/precompact-v3-r0-retirement`, `context-notes/precompact-v3-r0-retirement-builder`, `context-notes/precompact-v3-r0-retirement-review`
- Parent phase model: `context-notes/precompact-v3-orientation`

# Operating rule

Every completed artifact or review is processed immediately: classify it, update the task, select the next dependency, and execute or dispatch it in the same turn. Pause only for an external capability, safety boundary, or materially different human decision such as the architecture choice above.

# Loaded skills

`holaxis-self-awareness`, `holaxis-cognitive-ecosystem`, `agentstate-lite`, and `holaxis-orchestrator`.
