---
type: Context Note
title: P5A receipt-gate fix delta build
actor: openai/codex-build-receipt-gate
timestamp: '2026-08-08T17:11:13.955Z'
---
# Summary

Status: Build completed. Confidence: high.

Ultimate goal: make agentstate-lite a dependable shared knowledge substrate while enabling safe protected npm distribution with human-controlled publication.

Proximate goal: implement and verify the approved P5A fix delta as one coherent commit on the current-main-integrated feature branch, clearing the exact-SHA Review gate on the P5A -> P5B -> P5S -> continuous-staging critical path.

Progress: the proximate Build goal is complete. The branch is clean at the exact fix SHA below. It must now pass independent exact-SHA Review, targeted adversarial QA, and the repository gate in that order; any code change invalidates the review candidate.

## Integrated baseline and commit

- Current main integrated before Build: `56b5693d`.
- Rebased feature baseline inherited by this builder: `f239bb18016eaa384f846a5158cb9c0b1a7e68af`.
- Fix-delta commit: `25a33930ca978e400cc19f6bc53cccb3de436e91` (`fix(release): bind final publication to verified receipt assets`).
- No push, PR, merge, amend, signer edit, package-manifest edit, plugin-version edit, or generated plugin-bundle rebuild was performed.

## Files changed

- `.github/workflows/release-finalize.yml`
- `scripts/release-inspect.mjs`
- `scripts/release-ordering.mjs`
- `scripts/release-ordering.test.mjs`
- `scripts/release-receipts.mjs`
- `scripts/release-receipts.test.mjs`
- `scripts/release-state.mjs`
- `scripts/release-state.test.mjs`
- `scripts/release-verify-chain.mjs`
- `scripts/release-verify-ordering.mjs`
- `scripts/release-workflow.test.mjs`

## Implemented result

- The public reconciler receipt still requires `actor`; one internal state-to-ledger-key map records `inspected_by`, `approved_by`, `rejected_by`, `promoted_by`, and `rolled_back_by`. Split Brian/Mike inspection and approval now pass without weakening per-receipt signer, uploader, binding, or timing checks.
- One strict live-UUID auxiliary parser owns pre-stage residual versus finalize current-receipt/current-status/sibling classification. Synthetic dry-run and malformed lookalikes never become auxiliaries.
- Chain and ordering proofs persist sorted exact core and downloaded-receipt `{id,name,digest}` triples; downloaded receipt SHA-256 must equal GitHub metadata before signature/order evaluation.
- A pure draft-bound planner emits a sorted unique numeric-ID cleanup manifest. The single executor is mutation-free in dry-run, deletes only exact release-asset IDs in live mode, tolerates already-absent planned IDs subject to the final proof, uploads generated status with `--clobber`, and PATCHes one normalized workflow-owned body block.
- The live workflow re-queries after cleanup/upload/PATCH, then proves the exact final core/receipt/status inventory and owned body before invoking immutable publication. Same-name receipt replacement, forged/pre-existing status, siblings, duplicates, malformed extras, and arbitrary extras cannot pass the final set proof.
- Inspection mismatch now throws through `finally`; a batch-mode subprocess fixture proves nonzero exit, reject guidance, no receipt upload, and no leaked scratch directory or suspect tarball.

## Focused verification

Command run from the feature worktree root:

```sh
node --test --test-concurrency=1 \
  scripts/release-state.test.mjs \
  scripts/release-receipts.test.mjs \
  scripts/release-ordering.test.mjs \
  scripts/release-workflow.test.mjs
```

Final result: exit 0. Complete redirected log: `/private/tmp/receipt-builder-focused.log`.

The required M1 red probe was also exercised empirically: temporarily weakening the exact comparator to name-only made `scripts/release-ordering.test.mjs` exit 1 on the named highest-risk M1 test; the exact `{id,name,digest}` comparator was then restored before the final green run. Red-probe log: `/private/tmp/receipt-builder-m1-red.log`.

## Assumptions and caveats

- The final GitHub release re-query is required to expose SHA-256 asset digests. A missing final status digest fails closed rather than degrading to name-only acceptance. If GitHub omits that metadata in a live run, the adapter will stop before publication and a future reviewed change may add exact-ID download-and-hash fallback.
- Status upload remains tag-addressed through `gh release upload`, while cleanup, body PATCH, and final re-query are release/asset-ID-addressed. This is the plan's recorded lower-priority non-goal; exact final release-ID inventory proof remains authoritative.
- This Build ran only the approved focused suites. Targeted QA and the full `npm run check` remain downstream exact-SHA gates.
- Brian's personal verification of the three committed allowed-signers key lines remains a human PR-review gate.

## Next action

Detach an independent reviewer onto exact SHA `25a33930ca978e400cc19f6bc53cccb3de436e91`. Audit classifier/allowlist ownership, proof-to-final ID/digest binding, split actor mapping, retry cleanup/status/body convergence, and workflow order. Sample the focused proof and probe one dangerous assertion red. On APPROVE, hand the unchanged SHA to targeted adversarial QA; then run the repository gate on that same SHA.

[implements plan](../plans/release-receipt-gate-fix-delta.md)

[tracks task](../tasks/p5a-pre-live-hardening.md)

[uses domain model](release-receipt-gate-domain-model-2026-08-08.md)

[authorized by plan rereview](release-receipt-gate-fix-plan-independent-rereview-2026-08-08.md)
