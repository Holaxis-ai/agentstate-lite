---
type: Context Note
title: >-
  Agreement-test inventory: two evidence-backed gaps, broad parity churn
  rejected
actor: mike/codex
timestamp: '2026-07-19T01:58:25.102Z'
---
# Summary

Bounded inventory for [the test-suite confidence plan](../plans/test-suite-confidence.md), run after the first full agreement suite shipped in PR #92. The codebase has already eliminated or mechanically pinned most high-risk parallel contracts. Two evidence-backed gaps remain; broad parity work without a single named contract is rejected as churn.

## Already owned or pinned

- Sync, establish, and Home refusal/guidance output: one 59-row outcome table plus pre-refactor byte fixtures (`packages/cli/test/sync-outcomes.test.ts`).
- Typed failures at command catches versus the top-level CLI exit path: shared classifier plus exhaustive row tables (`error-boundary.test.ts`, `board-git-errors.test.ts`).
- View registration across launcher, mint, and serve: one core registration predicate, exercised at each boundary.
- Backend query/blob/version behavior: existing multi-backend parity runners cover the contract directly.

These do not need new inventory tasks.

## Gap 1 — bridge query versus CLI list semantics (P2)

This is the strongest remaining agreement target because it has a real drift defect: PR #38 fixed bridge `limit: 0` returning zero rows while CLI `list --limit 0` meant unlimited. Today the two surfaces still separately implement valid-input field membership, open/terminal filtering, positive limits, unlimited zero, ordering, and count behavior. They have isolated tests, not one row table proving agreement. The next unit is [tasks/bridge-cli-query-agreement](../tasks/bridge-cli-query-agreement.md).

The contract should cover only shared valid semantics. The bridge intentionally drops malformed JSON fields while the CLI reports human-facing usage errors; forcing those error policies to agree would be false parity. Prefer collapsing shared filtering below both consumers if that is smaller than maintaining two implementations, but retain a per-row proof that both public projections agree.

## Gap 2 — host config roots across hook and skill discovery (P3)

The same relocation invariant drifted twice: skill discovery ignored `CODEX_HOME` / `CLAUDE_CONFIG_DIR` until #43, then global hook install/status/uninstall independently ignored them until PR #110. After #110, both surfaces have good local tests but no row-level agreement over the common Claude/Codex default-and-override matrix. [tasks/host-config-root-agreement](../tasks/host-config-root-agreement.md) is intentionally sequenced after #110 so it tests the final shape rather than colliding with the fix. OpenCode stays hook-only and should not be forced into the skill-discovery contract.

## Explicitly not filed

- A universal `--limit` helper across every CLI command: the `0 = unlimited` convention is common, but result shapes and cap scopes differ; no additional drift evidence justifies a generic abstraction.
- A codebase-wide local-versus-remote agreement matrix: this is many contracts, not one contract, and existing command-specific parity tests are the right granularity.
- CLI-versus-View mutation agreement beyond the one trusted scalar action: the shared mutation service is already the authority and the UI surface is too small to justify a parallel-surface matrix yet. Revisit only when a second materially different trusted action ships.

## Convention to codify

When one behavioral contract has multiple public surfaces, keep one per-row agreement table that runs every surface against the same cases. Prefer one owning primitive when the behavior can be collapsed; agreement tests are for irreducible projections and boundaries, not a substitute for consolidation.
