---
type: Context Note
title: 'Targeted adversarial QA: P5A release receipt gate fix delta at 25a33930'
actor: openai/codex-qa-receipt-gate
timestamp: '2026-08-08T17:25:30.570Z'
---
# Summary

Status: completed. Verdict: **PASS WITH FINDINGS** for the targeted adversarial-QA gate. Confidence: high, 0.94.

Ultimate goal: make agentstate-lite dependable shared agent memory while enabling safe protected npm distribution with human-controlled publication.

Proximate goal: adversarially validate the changed P5A security and retry boundaries on exact SHA `25a33930ca978e400cc19f6bc53cccb3de436e91`, so the independently approved candidate can safely advance to the repository gate. Progress: complete. The affected matrix passed and no high or medium issue remains. One low defense-in-depth observation is recorded below.

# Exact SHA and isolation

- QA checkout: `/private/tmp/aslite-receipt-qa.SGO1FA`.
- HEAD before setup, after testing, and at close: `25a33930ca978e400cc19f6bc53cccb3de436e91`.
- Exact reviewed parent/baseline: `f239bb18016eaa384f846a5158cb9c0b1a7e68af`.
- `npm ci` was run in this fresh isolated worktree before test execution.
- The checkout remained clean. QA made no code edit, commit, branch operation, push, PR, release/network mutation, or plan/task/domain/roadmap mutation.
- Fixtures used only throwaway local files, injected command runners, stub `gh`/`npm`, and throwaway `ssh-keygen` keys. No real GitHub/npm mutation was attempted.

# Targeted matrix and results

- **Split identities and tiers:** Brian-inspect/Mike-approve and Mike-inspect/Brian-approve both passed for prerelease and stable. Proof retained separate `actors.inspected` and `actors.approved`; the ledger retained namespaced identities.
- **Per-receipt negatives:** tampered payload, wrong namespace, unlisted key/principal, signed-actor/uploader mismatch, upload after finalize dispatch, approval before inspection, wrong candidate tuple, downloaded-byte/GitHub-digest mismatch, and forged observed SHA all remained red. Real throwaway SSH signatures exercised the adapter path.
- **Tier policy:** prerelease approval-only passed with `verified: [approved]`, `missing: [inspected]`, ledger `staged`, and a required generated status; stable missing either receipt rejected.
- **Current status:** a forged/pre-planted current status was cleanup input, not evidence. Full receipts required removal; missing inspection required generated-byte digest verification and retry-safe `--clobber` replacement.
- **Final binding:** same-name receipt ID-only swap, digest-only swap, combined swap, wrong generated-status digest, and valid sibling residue all rejected in final inventory. Only exact receipt triples plus generated status bytes passed.
- **Sibling/malformed extras:** arbitrary bytes under a syntactically valid sibling auxiliary were planned for exact-ID deletion and rejected if still present at final proof. `receipt-status-0000.json`, `receipt-forged-<stage>.json`, synthetic `receipt-*-dry-run-stage.json`, and ordinary `evil.tgz` remained unexpected/red.
- **Body convergence:** required-to-required replaced the one owned block without duplication; required-to-full-receipts removed it; unrelated human notes survived. Altered block content, duplicate markers, missing markers, and reversed markers rejected at final proof.
- **Inspection mismatch:** the batch subprocess exited nonzero, printed the exact reject guidance, emitted/uploaded no receipt, and left no `aslite-release-inspect-*` directory or suspect tarball in a controlled temp root.
- **Dry-run:** the real classifier/planner path produced its cleanup plan while an injected runner and stub publication command recorded zero DELETE, upload, PATCH, or publish calls.
- **Plan-consumer tamper probes:** invalid category and unsorted delete order rejected before command execution. Post-plan status-file byte tampering rejected before upload/PATCH/publication. A separate shape-valid local-plan retargeting observation is the low finding below.

# Finding

## Low — shape-valid local publication-plan retargeting is not independently bound at apply time

Basis: empirical plus threat-model audit.

Reproduction: generate a valid no-status plan for draft `300` with sibling asset ID `700`; change the local JSON to `draft_release_id: 301`, delete ID `999999`, and another allowed diagnostic category; invoke `applyPublicationPlan` in live mode with an injected no-network runner. The adapter accepts the shape and emits `DELETE .../releases/assets/999999` followed by `PATCH .../releases/301`. Invalid categories and unsorted/duplicate IDs do reject.

Impact: accidental/corrupt modification of the trusted local plan between adjacent workflow steps could delete the wrong repository release asset or patch the wrong draft before the final exact proof stops publication. This does not let a receipt/release-asset attacker bypass the gate: the plan is generated and consumed in adjacent trusted steps, no untrusted step can write it, and anyone able to alter the runner filesystem/job code already controls the job's `contents:write` token and can invoke the same GitHub APIs directly. Final publication still fails closed after a retargeted mutation. Therefore severity is low, defense-in-depth, not a P5A gate rejection.

Recommendation: in a follow-up, consider passing the immutable dispatch draft ID separately into `apply` and checking it against the plan, and/or re-querying expected-draft asset membership before destructive calls. This would improve accidental-corruption containment; it is not required to advance this exact SHA.

# Survived attacks

- Cross-operator pairs in both directions and tiers.
- Unlisted signer, wrong namespace, altered signed bytes, actor/uploader mismatch, wrong tuple, late upload, and reversed inspection/approval order.
- Downloaded receipt bytes disagreeing with selected GitHub digest.
- Forged current status with full receipts; pre-planted status with missing inspection.
- Current receipt replacement by changed ID, changed digest, or both; generated status replacement by changed digest.
- Arbitrary valid sibling receipt/status bytes before normalization and sibling residue after normalization.
- Malformed receipt lookalikes, ordinary extras, and synthetic dry-run-stage names.
- Required-body content/marker tampering and both retry convergence transitions.
- Post-plan generated-status byte tampering.
- Invalid category and unsorted plan mutations.
- Inspection mismatch scratch leakage attempt.
- Dry-run mutation/publish transcript.

# Validation receipt

- `npm ci`: exit `0`; 438 packages installed. Log: `/private/tmp/receipt-qa-npm-ci.log`.
- Affected release suites: `node --test --test-concurrency=1 scripts/release-state.test.mjs scripts/release-receipts.test.mjs scripts/release-ordering.test.mjs scripts/release-workflow.test.mjs`: exit `0`; 61 tests, 61 pass, 0 fail. Log: `/private/tmp/receipt-qa-focused.log`.
- Independent throwaway adversarial harness: `node --test --test-concurrency=1 /private/tmp/receipt-qa-adversarial.mjs`: exit `0`; 10 tests, 10 pass, 0 fail. Log: `/private/tmp/receipt-qa-adversarial.log`. The harness itself is outside the checkout at `/private/tmp/receipt-qa-adversarial.mjs`.
- `git diff --check f239bb18016eaa384f846a5158cb9c0b1a7e68af..HEAD`: exit `0`; log `/private/tmp/receipt-qa-diff-check.log` (empty on success).
- Builder load-bearing red probe audited, not repeated: `/private/tmp/receipt-builder-m1-red.log` shows the deliberate name-only comparator weakening made the highest-risk M1 test fail (23 tests, 22 pass, 1 fail). Reviewer evidence independently reproduced the same mechanism in memory.
- The full repository gate was deliberately not rerun in QA. Per the approved serial dependency, `npm run check` is the next gate on this unchanged SHA.

# Residual risks

- Brian must personally verify the three committed allowed-signers key lines as the intended current Brian/Mike GitHub SSH keys.
- GitHub final release metadata must expose SHA-256 digests; absence fails closed.
- Status upload remains tag-addressed while cleanup, body PATCH, final query, and publication are ID-addressed. Diversion fails the exact final proof; the lower-priority upload-by-ID migration remains outside this delta.
- Another concurrently authorized `contents:write` principal can still mutate after the final query. The exact proof narrows but cannot abolish that race; environment and branch/release protection remain P5S's boundary.

# Verdict and next action

**PASS WITH FINDINGS.** No high or medium issue remains, so exact SHA `25a33930ca978e400cc19f6bc53cccb3de436e91` may advance to the repository gate. Any code change invalidates this QA receipt and the prior exact-SHA review.

[tracks task](../tasks/p5a-pre-live-hardening.md)

[tests plan](../plans/release-receipt-gate-fix-delta.md)

[uses domain model](release-receipt-gate-domain-model-2026-08-08.md)

[audits build](release-receipt-gate-fix-delta-build-2026-08-08.md)

[follows exact-SHA review](release-receipt-gate-fix-delta-exact-sha-review-25a33930.md)

[derives from handoff](receipt-gate-codex-handoff.md)
