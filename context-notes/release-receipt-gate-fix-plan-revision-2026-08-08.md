---
type: Context Note
title: P5A receipt-gate fix-plan revision complete
actor: openai/codex-plan-receipt-gate
timestamp: '2026-08-08T16:52:38.635Z'
---
# Summary

Revised the P5A receipt-gate domain model and fix-delta plan to close every required correction from the independent CHANGES-REQUIRED review. The plan is now Build-ready at the documentation level. No code, git, network, release, test, or sync action occurred.

Ultimate goal: safe protected npm distribution with human-controlled publication. Proximate goal progress: the implementation contract now binds public body claims and every retained asset to executable proof, and the durable roadmap exposes the full P5A -> P5B -> P5S -> continuous-staging takeover path.

# Plan/domain corrections

- Added one replaceable/removable workflow-owned release-body annotation block, duplicate/malformed-marker refusal, retry convergence for required->required and required->no-status, unrelated-note preservation, and final re-query verification.
- Required local SHA-256 equality for downloaded decision-receipt bytes versus GitHub metadata digest; ordering proof persists exact `{id,name,digest}` triples.
- Required generated status local digest, unique final matching asset, and recorded final observed ID; same-name replacement of a verified decision receipt rejects on changed ID or digest.
- Defined a `draft_release_id`-bound cleanup manifest with a sorted unique numeric-ID delete list plus exact keep proof; the live executor deletes only those IDs. Dry-run uses the planner/report path and must empirically produce zero mutation calls under a stubbed runner/transcript.
- Preserved public reconciler receipt field `actor`; one internal state map namespaces actor ledger identity for inspected, approved, rejected, promoted, and rolled-back states.
- Defined one strict live-stage UUID auxiliary-name parser with explicit pre-stage residual-only and finalize current/sibling modes.
- Added the independent review's highest-risk M1 red probe and its load-bearing name-only weakening check.

# Durable takeover repairs

- Added the missing distribution-roadmap `contains` edge to `tasks/p5a-pre-live-hardening`.
- Added P5B's explicit `depends on` edge to P5A.
- Created claimable `tasks/continuous-staging-implementation` (`todo`, priority `1`) with acceptance criteria, high-risk gate, and Brian/Mike/npm-2FA human boundary; it depends on P5S and links its ratified cadence decision and implementation plan.
- Added the distribution-roadmap `contains` edge to continuous staging.
- Updated the distribution roadmap item's sequence/body and consolidated roadmap current-focus section to expose P5A -> P5B -> P5S -> continuous staging.

# Outstanding implementation assumptions

1. GitHub release-asset metadata is expected to expose the `sha256:` digest shape already consumed for retained assets. If the post-upload status response omits it, the builder must download the exact final asset ID and hash those bytes; name-only proof is forbidden.
2. Stable owned-body marker strings may use the proposed `aslite-receipt-status:start/end` form, but the implementation must pin one exact format and reject duplicate, nested, or unbalanced markers.
3. Already-absent cleanup IDs may be tolerated on retry only because a fresh final exact-set proof still gates publication.
4. The final re-query narrows but does not eliminate a race by another concurrently authorized `contents:write` principal; version-scoped workflow concurrency and P5S protection remain trust-boundary prerequisites.
5. Brian's verification of the committed Brian/Mike allowed-signers keys remains the sole human-only P5A input gate.

# Status

Revision status: complete; confidence high. No bundle-kind or typed-link convention conflict occurred. Bundle sync remains the orchestrator's responsibility.

[addresses review](release-receipt-gate-fix-plan-independent-review-2026-08-08.md)

[revises plan](../plans/release-receipt-gate-fix-delta.md)

[updates task](../tasks/p5a-pre-live-hardening.md)
