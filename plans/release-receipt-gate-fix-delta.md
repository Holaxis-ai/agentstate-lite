---
type: Plan
title: P5A release receipt gate fix delta
actor: openai/codex-plan-receipt-gate
timestamp: '2026-08-08T16:39:58.407Z'
---
# Summary

Implement one P5A fix delta on `feat/release-receipt-gate`: integrate current main `56b5693d`, permit split inspector/approver identities without weakening each receipt's signer/uploader checks, make final publication an exact verified asset inventory, clean the inspection mismatch scratch path, and make status upload retry-safe. This serves the ultimate goal of safe protected npm distribution with human-controlled publication and clears the P5A -> P5B -> P5S -> continuous-staging critical path.

Status at plan time: feature commit `4b905b3f` is built, independently reviewed, and adversarially tested pass-with-findings. Brian has resolved all policy questions. Main adds only the core import-direction gate relative to the feature base, so no release-file overlap is expected, but the final reviewed SHA must include current main.

# Acceptance criteria

## Rulings encoded

1. A valid Brian-inspected/Mike-approved pair and the inverse both pass in prerelease and stable tiers; same-operator pairs continue to pass.
2. Each receipt still independently requires an allowed signer, signed actor equal to uploader, candidate tuple equality, upload before finalize dispatch, and legal inspection-before-approval ordering.
3. The reconciled ledger retains distinct per-state actor identities and rejects a conflicting replay of the same state's actor. Ordering proof output exposes both actors without a misleading singular actor.
4. Signed canonical receipt bytes continue to bind `stage_id + version + tarball_sha256 + draft_release_id` and do not bind `run_id`.
5. Prerelease approval-without-inspection passes with `verified: [approved]`, `missing: [inspected]`, ledger `state: staged`, and a required public missing-inspection stamp. Stable approval-without-inspection remains red.

## M1 asset authority

6. Asset classification is relative to the chain-verified current stage and distinguishes core assets, verified current decision receipts, current status, valid sibling-stage residue, malformed receipt lookalikes, and ordinary extras.
7. Recognized sibling-stage residue may be tolerated during read-only draft verification but is never treated as current evidence and cannot survive into the published inventory.
8. A pre-existing `receipt-status-<currentStageId>.json` is never trusted by name. If no stamp is required it is removed/rejected before publication; if a stamp is required it is replaced by the just-generated status bytes.
9. The write-capable finalize job re-queries the draft after cleanup/clobber and immediately before `immutable-release`. The exact final allowlist is: retained core two + current decision assets that were actually verified + generated current status iff required. IDs/digests agree with the proofs/files; no sibling, malformed, arbitrary, duplicate, or unverified auxiliary asset remains.
10. A forged current status, arbitrary binary under a receipt-like sibling name, and stale sibling status all fail to ride to publication. A normal unexpected asset remains red.

## L1/L2 and workflow safety

11. An inspection checksum mismatch exits nonzero, emits no receipt/upload, prints the reject guidance, and removes its `aslite-release-inspect-*` scratch directory and downloaded suspect tarball before process exit, including batch mode unwinding.
12. The live status upload is explicitly retry-safe with `--clobber`. A prior same-name status asset cannot block a legitimate rerun and cannot survive unchanged.
13. Dry-run stays read-only: no asset deletion, clobber upload, body patch, or release publication.
14. Workflow ordering is mechanically pinned as verify current evidence -> materialize/normalize final assets -> re-query and verify final inventory -> publish.

## Gates and handoff

15. Focused affected suites pass, the exact-SHA independent review approves, targeted adversarial QA passes, and then `npm run check` exits 0 on the same SHA.
16. No plugin version/bundle artifact is hand-bumped or rebuilt. No PR is created or merged by an agent. The pushed feature branch is handed to Brian with a paste-ready PR title/body.
17. The PR handoff explicitly asks Brian to verify the three committed allowed-signers key lines as the intended current Brian/Mike GitHub SSH keys. This remains human-owned evidence.

# Implementation targets

- `scripts/release-state.mjs`: replace global actor identity collision with explicit per-state actor keys/mapping while preserving immutable replay semantics.
- `scripts/release-ordering.mjs`: remove cross-receipt same-actor rejection; map signed actors to per-state ledger identity; expose per-decision actors; add/own current-versus-sibling auxiliary classification and final publication allowlist rules.
- `scripts/release-verify-ordering.mjs`: carry selected receipt asset identities/digests into the ordering proof; expose the residual/current-status cleanup plan; materialize the expected status; add a pure/adapter final-inventory verification path suitable for a post-mutation draft re-query.
- `scripts/release-receipts.mjs` and `scripts/release-verify-chain.mjs`: consume the one asset classifier. Preserve exact core-two verification while treating only exact, valid auxiliary grammar as draft-phase residue; malformed lookalikes remain unexpected extras.
- `.github/workflows/release-finalize.yml`: in the write-capable finalize job, normalize auxiliary assets, upload a required current status with `--clobber`, re-query draft metadata, run the exact final-inventory gate, then publish. Dry-run prints only.
- `scripts/release-inspect.mjs`: replace the in-try hard `process.exit(1)` mismatch path with unwinding that reaches `finally`; retain nonzero CLI result and reject guidance.
- `scripts/release-state.test.mjs`: prove split per-state actors reconcile and remain immutable within each state.
- `scripts/release-ordering.test.mjs`: replace the old cross-operator-red row with split-role green rows; pin prerelease approval-only; test current/sibling/malformed classification; prove forged current status and arbitrary sibling bytes are absent from the final allowlist; test generated-status digest acceptance and wrong/pre-existing bytes rejection; add the mismatch scratch cleanup subprocess fixture (or a dedicated `release-inspect.test.mjs` registered in `test:scripts` if that keeps responsibilities clearer).
- `scripts/release-receipts.test.mjs`: replace blanket receipt-name tolerance with draft-phase category tests and malformed-name rejection.
- `scripts/release-workflow.test.mjs`: require literal `--clobber`, final metadata re-query/gate after normalization and before publication, dry-run non-mutation, and no publish before the exact-inventory proof.
- `package.json`: change only if a dedicated new test file is introduced; otherwise no additional script registration is needed.

# Dependency sequence and roles

1. **Orchestrator/integrator — current-main baseline.** Integrate `56b5693d` into the feature branch before freezing a review candidate; confirm the only main-side delta is the core import-direction test and re-read any resolved overlap. This must precede exact-SHA review.
2. **Builder — one coherent code+test unit.** Implement actor identity, M1 final inventory, L1 cleanup, and L2 clobber together with their tests. Run the focused release suites. M1 mechanics and the tests that guard them must be in the same commit.
3. **Independent reviewer — exact SHA.** Depends on Build. Audit the classifier/allowlist authority, mutation ordering, proof-to-final-asset ID/digest binding, split actor mapping, and cleanup/retry behavior. Sample the focused tests and probe at least one dangerous assertion red. Any code change after review invalidates approval and loops back to this stage.
4. **Targeted adversarial QA — exact reviewed SHA.** Depends on independent Review. Re-run only the previously affected rows plus the new boundary rows listed below; do not repeat the full 203-row matrix. Any fix loops back through Review before QA repeats.
5. **Repository gate — exact QA-approved SHA.** Depends on QA. Run `npm run check` from the repo root (after `npm ci` if this worktree lacks its own dependencies), with output redirected to a temporary log and the command's own exit code preserved.
6. **Orchestrator — branch/records/handoff.** Push the descriptively named feature branch, update P5A outcome and proximate-goal progress in the bundle, sync the board, and give Brian a paste-ready ASCII PR title/body. Brian opens the PR, verifies allowed signers, invites external-team review, and owns merge.

Parallelism is bounded by the security dependency chain. Within Build, the L1 subprocess fixture and L2 workflow assertion can be developed independently of the M1 classifier/final-inventory primitive, then integrated by the owning builder; the actor-state change and M1 proof schema must converge before shared ordering tests are finalized. Review, QA, repository gate, and PR handoff are deliberately serial because each consumes the exact prior SHA/evidence.

# Focused builder verification

Run from the feature worktree root:

```sh
node --test --test-concurrency=1 \
  scripts/release-state.test.mjs \
  scripts/release-receipts.test.mjs \
  scripts/release-ordering.test.mjs \
  scripts/release-workflow.test.mjs
```

If L1 receives a dedicated test file, include it literally in this command and in `test:scripts`.

# Targeted adversarial QA rows

- Brian inspect -> Mike approve and Mike inspect -> Brian approve: both accepted; proof and ledger retain both identities.
- Signed actor/uploader mismatch remains red; unlisted signer remains red; approval upload before inspection remains red.
- Prerelease approval-only yields approval receipt + newly generated missing-inspection stamp; stable equivalent rejects.
- Both valid receipts + forged current status: forged status cannot survive and final inventory contains no status.
- Missing inspection + pre-planted current status: generated expected status replaces it; final digest matches generated bytes; rerun is not name-collision blocked.
- Arbitrary binary under a syntactically valid sibling receipt/status name: tolerated only before normalization, removed/excluded before final proof, never published.
- Malformed receipt-like name and ordinary `evil.tgz`: fail closed as unexpected assets.
- Sibling valid signed/unsigned residue does not affect current receipt selection and cannot appear in final inventory.
- Inspection mismatch: nonzero, no upload/receipt, reject command printed, controlled TMPDIR contains no leaked `aslite-release-inspect-*` directory or tarball.
- Dry-run over the same residue reports policy but performs no cleanup/upload/body patch/publish.

# Risks and non-goals

- The final re-query narrows but cannot abolish all races by another simultaneously authorized `contents:write` principal; environment/concurrency/protection in P5S remains part of the trust boundary. This delta ensures no asset observed at the final gate is accepted by name alone.
- The lower-priority tag-versus-release-ID upload observation is not expanded into a new API migration unless required to implement exact retry-safe normalization. Keep the delta coherent.
- Do not change the receipt schema to add `run_id`, do not add a second human approval mechanism, and do not make prerelease inspection mandatory.
- Do not re-run the full prior adversarial matrix unless focused evidence reveals drift outside the affected boundaries.

# Completion evidence

Record: integrated base SHA, fix commit SHA, focused-test receipt, exact-SHA review verdict, targeted-QA verdict, repository-gate exit, pushed branch, and the still-pending Brian allowed-signers verification. P5A closes only after the PR merges; then the program proceeds P5B -> P5S -> continuous staging.

[plans task](../tasks/p5a-pre-live-hardening.md)

[derives from handoff](../context-notes/receipt-gate-codex-handoff.md)

[uses domain model](../context-notes/release-receipt-gate-domain-model-2026-08-08.md)
