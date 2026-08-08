---
type: Context Note
title: 'Exact-SHA review: P5A release receipt gate fix delta at 25a33930'
actor: openai/codex-review-receipt-sha
timestamp: '2026-08-08T17:19:05.923Z'
---
# Summary

Status: completed. Verdict: **APPROVE**. Confidence: high, 0.96.

Ultimate goal: deliver agentstate-lite as dependable shared agent memory with safe protected npm distribution and human-controlled publication.

Proximate goal: independently determine whether the exact P5A fix SHA closes every approved invariant and can advance to targeted adversarial QA. Progress: complete. Exact SHA `25a33930ca978e400cc19f6bc53cccb3de436e91` meets the approved plan at heads `sha256:e6d119d55a873931b2d66791b84313ba1e31ee4c4fbe018e3aa93e7239edfdc4` and `sha256:f65e8fde04204716be49e04c15ecbf32b7f11794ef9447453fcafed52282303c`; no unresolved high or medium finding remains.

# Exact SHA

- Reviewed checkout: `25a33930ca978e400cc19f6bc53cccb3de436e91`.
- Parent fix baseline: `f239bb18016eaa384f846a5158cb9c0b1a7e68af`.
- Current main `56b5693d` is an ancestor of the reviewed SHA.
- Review worktree: `/private/tmp/aslite-receipt-review.xZFXkM`.
- `git rev-parse HEAD` matched before review and after validation.
- Worktree remained clean; `node_modules` is ignored and was installed with `npm ci`.

# Verdict

**APPROVE for targeted adversarial QA.**

The exact SHA satisfies every approved correction:

1. The public reconciler still accepts required input field `actor`; one internal state map records `inspected_by`, `approved_by`, `rejected_by`, `promoted_by`, and `rolled_back_by`. Same-state replay remains immutable while legal different-state operators no longer collide.
2. Split Brian and Mike inspection and approval pass in both directions and both tiers. Each receipt still independently retains allowed-principal signature verification, signed actor equals GitHub uploader, candidate tuple binding, upload before finalize dispatch, and inspection upload before approval upload.
3. Canonical signed bytes still bind exactly `stage_id + version + tarball_sha256 + draft_release_id`; `run_id` remains absent.
4. Prerelease approval without inspection yields verified approval evidence, missing inspection, ledger state `staged`, and a required public status stamp. Stable absence remains red in live mode.
5. `parseAuxiliaryReleaseAssetName` is the one strict live-UUID auxiliary grammar. Pre-stage mode grants only residual classification; finalize mode derives current receipt, current status, or sibling from the chain-verified stage. Malformed and synthetic dry-run names do not acquire auxiliary status. Search found no second receipt/status filename regular expression.
6. Chain proof stores sorted exact core triples. The adapter hashes every downloaded current receipt and requires equality with its GitHub asset digest before signature/order evaluation; ordering proof stores exact receipt triples.
7. Publication planning is pure, bound to numeric `draft_release_id`, and emits a sorted unique numeric-ID delete manifest. The live executor targets only release-asset ID endpoints, tolerates already-absent planned IDs subject to final proof, and uses literal `--clobber` for generated status upload.
8. Final proof accepts only unchanged core and verified receipt `{id,name,digest}` triples plus generated status iff required. It binds status name/digest and records the final observed status ID. Same-name receipt replacement, forged/pre-existing status, siblings, duplicates, malformed extras, and arbitrary extras cannot survive the final set.
9. The workflow-owned release-body normalizer replaces or removes one delimited block, rejects duplicate, unbalanced, nested, or reversed ownership markers, and preserves unrelated bytes. The post-PATCH re-query proves current block agreement or absence before publication.
10. Dry-run traverses planning and validates the plan but returns before the injected command runner. Empirical tests observed zero DELETE, upload, PATCH, or publish execution.
11. The workflow order is verify downloaded evidence and metadata digests -> plan status/body/cleanup -> live ID-only normalization -> re-query -> final exact asset/body proof -> immutable publication.
12. Inspection mismatch throws through `finally`; the batch subprocess fixture records nonzero exit, reject guidance, no upload, and an empty controlled temp root.

# Findings

No high or medium findings.

No code correction is required before QA.

# Survived attacks

- Brian-inspected and Mike-approved, plus the inverse: accepted while both identities remain distinct in proof and ledger.
- Same-state actor substitution: rejected by the state-specific ledger key.
- Signed actor and uploader mismatch, unlisted signer, wrong namespace, tampered signed bytes, wrong candidate binding, evidence uploaded after dispatch, and approval uploaded before inspection: rejected.
- Downloaded receipt bytes with a GitHub metadata digest mismatch: rejected before signature/order policy.
- A verified receipt replaced under the same filename with a changed ID, digest, or both: rejected during plan construction or final proof.
- A forged or pre-existing current status: planned for deletion; a required replacement must match generated digest and obtains a final observed ID.
- Validly named sibling receipt/status assets, including arbitrary bytes: tolerated only during mutable-draft verification, then deleted by exact ID and forbidden in the final set.
- Malformed receipt lookalikes and ordinary extras: rejected as unexpected.
- Required-status retry: exact status upload uses `--clobber`; an already-absent planned cleanup ID is tolerated only because final re-query is authoritative.
- Required-to-required and required-to-full-receipts body retries: one current block remains or the stale block is removed; malformed ownership is rejected.
- Inspection mismatch: no receipt, upload, scratch directory, or suspect tarball survives.
- Dry-run with an injected command runner: zero mutation calls.
- Additional reviewer probe: a changed-ID but same-digest receipt was rejected before cleanup, and reversed owned-body markers were rejected.
- Additional reviewer in-memory mutation: weakening the exact asset comparator to name-only admitted the replaced receipt fixture, while the reviewed SHA rejected it. This independently confirms the ID/digest comparison is load-bearing.

# Sampled commands and results

- `git diff --check f239bb18016eaa384f846a5158cb9c0b1a7e68af..25a33930ca978e400cc19f6bc53cccb3de436e91`: exit 0.
- `npm ci`: exit 0; log `/private/tmp/receipt-review-npm-ci.log`.
- `node --test --test-concurrency=1 scripts/release-state.test.mjs scripts/release-receipts.test.mjs scripts/release-ordering.test.mjs scripts/release-workflow.test.mjs`: exit 0, 61 tests, 61 pass, 0 fail; log `/private/tmp/receipt-review-focused.log`.
- Source audit covered all 11 changed files and the inherited release operation path; no full repository gate was repeated.
- Authority heads re-read through the bundle CLI: plan `e6d119d5...`, domain model `f65e8fde...`, build note `14475ab3...`.

# Red-probe evidence

Builder log `/private/tmp/receipt-builder-m1-red.log` records 23 tests with 22 pass and the named highest-risk M1 test failing after the comparator was weakened to name-only. The failure advanced from the receipt replacement assertion to the later forged-status assertion, which shows the weakened comparator stopped rejecting the replaced receipt.

The reviewer then reproduced the mechanism without editing the checkout: the exact module rejected a same-name receipt with replacement ID `777` and changed digest, while an in-memory name-only mutation admitted that attacked final inventory. The mutation output was: `mutation_red_confirmed: name-only comparator admits replaced receipt while exact SHA rejects it`.

# Residual risk

- Brian must personally verify that the three committed allowed-signers key lines are the intended current Brian and Mike GitHub SSH keys. This is deliberately human-owned and not machine-proven here.
- GitHub final release metadata must expose SHA-256 digests. Missing digest metadata fails closed. An exact-ID download-and-hash fallback is a future reviewed change only if live evidence shows it is needed.
- Status upload remains tag-addressed while cleanup, body PATCH, final re-query, and publication are ID-addressed. Diversion or missing status fails the final intended-draft proof. This is the plan-recorded lower-priority non-goal.
- The post-mutation proof is intentionally exact over draft ID, assets, and the owned body block. Tag equality was established by the immediately preceding chain re-verification rather than repeated in the post-mutation proof. A concurrent authorized release-metadata edit, or any edit after the final re-query, remains in the plan-recorded P5S protection/concurrency boundary.
- No full repository gate was run in Review. Per the approved dependency chain, that gate follows targeted QA on the unchanged SHA.

# Next QA gate

Run targeted adversarial QA on exact SHA `25a33930ca978e400cc19f6bc53cccb3de436e91`, limited to the affected rows in the approved plan. Any code change invalidates this approval and returns the unit to exact-SHA Review. If QA passes unchanged, run `npm run check` on this same SHA, then complete the branch and PR handoff. Brian still owns allowed-signers verification and the merge gate.

[reviews plan](../plans/release-receipt-gate-fix-delta.md)

[tracks task](../tasks/p5a-pre-live-hardening.md)

[reviews build](release-receipt-gate-fix-delta-build-2026-08-08.md)

[uses domain model](release-receipt-gate-domain-model-2026-08-08.md)

[derives from handoff](receipt-gate-codex-handoff.md)
