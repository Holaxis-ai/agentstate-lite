---
type: Plan
title: Retire duplicate R0 rail and restore T3.5 phase boundary
actor: codex-takeover-main
timestamp: '2026-08-04T17:42:16.590Z'
---
# Goal

Retire the staged duplicate R0 rail and restore the revision-3 worktree and durable records to the accepted T0–T4 / T3.5 phase boundary. This serves the ultimate goal by keeping one authority for isolation and preventing stale prerequisite work from displacing the real candidate-acceptance decision.

# Acceptance criteria

- Every staged/ignored/generated R0 path named by the product contract and skeptic review is absent.
- The tracked T0 `live-harness.mjs`, its tests, and all accepted T0–T4 bytes are unchanged.
- The feature worktree is clean at `36c741a8173832d75d61a7ab138b5219c4415c66`.
- The existing T0 harness tests pass from the package test path; no Claude, network, auth, real settings, or live host run occurs.
- An independent reviewer verifies the exact absence/preservation boundary before the parent phase record is advanced.
- The rejected R0 model and `precompact-main` handoff are marked with their disposition; the parent task returns to its true T3.5 architecture dependency.

# Work graph

| ID | Role | Depends on | Deliverable |
|---|---|---|---|
| C0 | orchestrator | product contract + test architecture + skeptic verdict | exact deletion and preservation inventory |
| C1 | orchestrator | C0 | remove only untracked/ignored duplicate R0 artifacts |
| C2 | verifier | C1 | targeted existing T0 harness test receipt and clean-worktree receipt |
| C3 | independent reviewer | C2 | exact retirement PASS/FAIL; reviewer changes no files |
| C4 | orchestrator | C3 PASS | reconcile bundle phase/task/handoff records and sync board |

Review is a dependency before record close. No separate adversarial QA stage is required because C1 changes no tracked source or runtime behavior; the existing tracked authority is byte-preserved and its standing deterministic tests are the executable oracle.

# Exact deletion inventory

- `.r0-live/`
- `packages/cli/test/fixtures/r0/`
- `packages/cli/test/r0-collector.test.ts`
- `packages/cli/test/r0-live-rail.test.ts`
- `packages/cli/test/support/r0-live-rail.ts`
- `scripts/r0-inert-hook.mjs`
- `scripts/r0-prepare.mjs`
- `scripts/r0-rail-collector.mjs`
- `scripts/r0-run-case.mjs`
- `docs/r0-live-rail-runbook.md`

# Preservation boundary

- `packages/cli/test/fixtures/handoff/live-harness.mjs`
- `packages/cli/test/handoff-harness.test.ts`
- accepted branch SHA `36c741a8173832d75d61a7ab138b5219c4415c66`
- exact 2.1.220 host-identity and prior live-probe bundle records
- later G0/R0/Q0/L0/L1/L2/L3 gate semantics

# Next dependency after close

Return to the T3.5 architecture decision. The recorded recommendation is to reuse audited v5 no-autostart evidence and freshly probe only remaining H2–H5 physical/controller facts before dual exact review. A different no-tmux/direct-host replacement architecture must be made explicit as a new plan decision rather than emerging from fixture repair.

[plans](../tasks/precompact-v3-r0-retire-duplicate.md)
