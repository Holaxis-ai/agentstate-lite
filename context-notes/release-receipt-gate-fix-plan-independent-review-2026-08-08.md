---
type: Context Note
title: 'Independent review: P5A release-receipt-gate fix plan'
actor: openai/codex-review-receipt-plan
timestamp: '2026-08-08T16:47:41.201Z'
---
# Summary

Verdict: **CHANGES-REQUIRED before Build**. The P5A fix-delta architecture is viable and the dependency chain is compliant, but the plan leaves four security/retry contracts under-specified. The most consequential omission is that it normalizes the status asset while leaving the workflow-owned release-body status annotation append-only. A failed run followed by a retry can therefore publish duplicate or stale receipt-status claims even when the final asset inventory is correct.

The corrections are bounded: specify one byte-bound publication proof, one ID-addressed cleanup manifest with a dry-run planner/executor split, one internal per-state actor-key mapping that preserves the reconciler receipt API, and one replaceable workflow-owned status annotation block. No new receipt schema, approval mechanism, release-ID upload migration, or full QA rerun is required.

## Goals and review scope

- Ultimate goal: provide durable, conflict-safe shared memory for agent/human work in plain OKF bundles.
- Proximate goal: make the P5A security-fix plan implementation-safe so the npm release gate can advance without propagating an unverified invariant.
- Link upward: trustworthy npm distribution is required for agents to consume the shared-memory substrate reliably.
- Reviewed: `CLAUDE.md`, `docs/core`, the P5A task and handoff, the fix-delta domain model and plan, the release program/roadmap, the normative version-update protocol, and feature worktree `feat/release-receipt-gate` at `4b905b3f`.
- Main integration fact: `4b905b3f` and current main `56b5693d` share base `730a2d85`; main's only feature-side delta is `packages/core/test/import-direction.test.ts`, so the plan's integration assumption is accurate.

## Verdict

**CHANGES-REQUIRED.** Builder may start only after the plan explicitly incorporates Required Corrections 1-4 below. Correction 5 is a low-severity implementability clarification and should be made in the same plan edit.

## Findings

### 1. MEDIUM — workflow-owned public status annotation is not normalized or final-verified

- Basis: **reasoned from inspected code**.
- Location: plan acceptance criteria 8-14 and workflow target; current `scripts/release-verify-ordering.mjs` lines 148-164; current `.github/workflows/release-finalize.yml` lines 322-340.
- Evidence: `stampCommand` appends a new status annotation to the existing draft body, then the workflow patches that body before publish. The plan makes the status asset retry-safe with `--clobber` and exact digest verification, but says nothing about the body. If run A uploads/patches a missing-inspection status and fails before publication, run B appends a second annotation. More seriously, if inspection is supplied before run B, run B removes the no-longer-required status asset but can publish run A's stale body claim that inspection was missing.
- Consequence: the machine-readable asset can be correct while the human-visible public receipt-status claim is duplicate or false. This violates the unit's trustworthy-public-record purpose without bypassing publication approval.
- Required correction: define a workflow-owned, clearly delimited receipt-status annotation block. Finalization must replace that block with exactly one annotation when a stamp is required and remove it when no stamp is required, while preserving unrelated release notes. Re-query the draft and verify the owned block agrees with the final ordering result before publish. Add retry tests for (a) required-stamp -> required-stamp and (b) required-stamp -> full-receipts/no-stamp.

### 2. MEDIUM — byte-to-asset binding is directionally stated but not operationally exact

- Basis: **reasoned from inspected code and plan language**.
- Location: acceptance criterion 9; implementation target for `release-verify-ordering.mjs`; targeted QA rows; current adapter lines 83-140.
- Evidence: current receipt selection captures ID/name/uploader/time but not GitHub digest, and signature verification reads the downloaded file without comparing its local SHA-256 to the selected asset metadata digest. The plan says to carry IDs/digests and that they must agree with proofs/files, but does not state the exact comparison/proof schema. That leaves room for a name-only or metadata-only implementation while still appearing to satisfy the prose.
- Consequence: the central M1 claim — that the bytes verified before mutation are the bytes retained after mutation — would depend on an implicit GitHub endpoint-consistency assumption rather than an executable equality.
- Required correction: for each current decision receipt, compute the downloaded file's SHA-256, require it to equal the selected GitHub asset `digest`, and persist the exact `{id,name,digest}` in the ordering proof. For a generated status, compute its local digest before upload; after re-query require a unique `{id,name,digest}` whose digest equals that generated digest and include the resulting ID in the final-inventory proof. The final gate must require exact core triples from the chain proof, exact receipt triples from the ordering proof, and the generated status name/digest plus newly observed ID when required. Same name with changed ID or digest must reject.

### 3. MEDIUM — cleanup actuation and dry-run separation need an exact destructive-write contract

- Basis: **reasoned from the destructive boundary**.
- Location: asset-inventory state machine, acceptance criteria 7-10 and 13-14, workflow implementation target.
- Evidence: the plan says to remove/exclude residue, but does not specify whether mutation targets names, tags, or exact asset IDs, nor the handoff shape between the pure classifier and workflow shell. It also relies mainly on static workflow assertions for dry-run non-mutation.
- Consequence: a builder could implement cleanup with name/tag lookup, reintroducing the filename authority the domain model rejects, or accidentally share a mutation path with dry-run. Sibling cleanup is deterministic only if selection and actuation are bound to the same observed IDs and a final re-query proves convergence.
- Required correction: have the pure planner emit a machine-readable manifest bound to `draft_release_id`, containing a sorted, unique list of exact numeric asset IDs plus diagnostic name/category and the exact keep proof. The live executor deletes only those IDs through the release-asset ID endpoint; absence on retry is tolerated only because the final re-query remains authoritative. Dry-run invokes the planner/report path but never the executor, upload, body patch, or publish path. Test with an injected command runner or stubbed `gh` transcript so zero mutation calls in dry-run is empirical, not only a substring check.

### 4. MEDIUM — per-state actor keys can preserve replay semantics, but the plan is ambiguous about the reconciler receipt contract

- Basis: **reasoned from inspected code**.
- Location: domain model `Release-state identity model`; plan acceptance criterion 3 and `release-state.mjs` target; current `release-state.mjs` lines 26-37 and 91-166; `release-reconcile.mjs` lines 42-55.
- Evidence: the domain model suggests mapping external receipt `actor` into `inspected_by` / `approved_by` fields in the ordering adapter. But `release-reconcile.mjs` is another consumer and passes raw operator receipt JSON directly to `reconcile`; the normative protocol names the required field `actor`. Changing `STATE_RECEIPT_FIELDS` to require state-specific input names would silently break that manual reconciler contract. Fixing only inspection/approval would also leave the same global collision across rejected/promoted/rolled-back actors.
- Consequence: split-role support could be obtained by weakening or forking the reconciler contract rather than preserving its one-authority semantics.
- Required correction: keep `actor` as the receipt input field for every actor-bearing state and namespace it internally during merge through one explicit map (`inspected -> inspected_by`, `approved_public -> approved_by`, `rejected -> rejected_by`, `promoted -> promoted_by`, `rolled_back -> rolled_back_by`). Required-field validation remains on `actor`; ledger identity becomes state-specific. Tests must cover same-state identical replay, same-state different-actor rejection, and different actors across all reachable actor-bearing states. If the team instead changes receipt input fields, the normative protocol, manual CLI, help, and fixtures must change in this unit; the internal-map option is the bounded choice.

### 5. LOW — the one-classifier requirement needs a pre-stage mode

- Basis: **empirical code-path observation**.
- Location: plan implementation targets for `release-receipts.mjs` / `release-verify-chain.mjs`; current `.github/workflows/release-staged.yml` lines 148-173 and 220-233.
- Evidence: `capture-draft` verifies the reused draft before npm has produced the new stage ID. It therefore cannot classify current versus sibling residue relative to a chain-verified current stage. The finalizer can.
- Consequence: without an explicit phase distinction, the builder may duplicate grammar logic or incorrectly require a current stage where none exists.
- Required correction: define one pure asset-name parser/grammar authority with two consumers: pre-stage capture classifies every valid auxiliary as residual (only to isolate the core-two check), while finalize classification receives the verified current stage and divides current versus sibling. Only live UUID-shaped stage IDs receive auxiliary status; malformed lookalikes remain ordinary unexpected extras.

## Acceptance criteria that need tightening

1. Criterion 3: explicitly preserve `actor` as reconciler receipt input and namespace only the ledger key, for every actor-bearing state.
2. Criterion 9: define local-file SHA-256 equals GitHub metadata digest, exact proof triples, uniqueness, and final proof output.
3. Criteria 8/12: extend retry convergence from the status asset to the workflow-owned release-body annotation.
4. Criteria 7/13/14: define the cleanup manifest and ID-only live executor; make dry-run zero-mutation empirical.
5. Criterion 6: distinguish the pre-stage grammar-only use from current-stage finalize classification.

No contradiction remains in Brian's rulings: split operators, omission of `run_id`, and prerelease approval-only publication with a missing-inspection stamp compose correctly once the actor and publication-proof contracts above are explicit.

## Highest-risk M1 red probe

Construct an approval-only prerelease fixture after signature verification:

1. Ordering proof binds approval asset `{id: 501, name: receipt-approved-<stage>.json, digest: sha256:A}` and requires generated status digest `sha256:S`.
2. A final draft containing the correct core assets, an approval asset with the same name but `{id: 777, digest: sha256:B}`, and a current status with the right name but digest `sha256:F` must be rejected.
3. Holding all names constant, independently restore the exact approval triple and generated status digest; only the fully restored fixture may pass.
4. Add one syntactically valid sibling auxiliary asset to the passing fixture; final verification must reject until normalization removes its exact ID.

Load-bearing check: temporarily reduce the final verifier to name-only comparison. Steps 2 or 4 will stop throwing, so the test itself fails red. This probes the precise M1 failure class rather than merely asserting the happy-path allowlist.

## Survived attacks / plan strengths

- Final-inventory normalization is implementable without trusting asset names as authority: names classify; exact IDs/digests authorize retention and deletion; the post-mutation exact-set proof authorizes publish.
- `run_id` omission remains sound for candidate binding because stage ID + version + tarball digest + draft release ID is the signed candidate identity, while finalize run ID belongs only in the generated status record.
- Split inspectors/approvers are compatible with immutable replay when actor identity is namespaced per state; signer allowlist, signer/uploader equality, receipt ordering, and same-state replay conflict checks remain intact.
- Approval-only prerelease correctly leaves the lifecycle ledger at `staged` while the ordering proof records verified approval and missing inspection; stable remains fail-closed.
- The plan's Build -> independent exact-SHA Review -> targeted adversarial QA -> repository gate order satisfies the required review-before-QA dependency and properly invalidates review after any code change.
- Current-main integration is low-conflict and correctly required before exact-SHA review.
- The human verification of `.github/release-allowed-signers` is honestly left human-owned.

## Bundle takeover observation

The task, handoff, domain model, plan, and this independent review together are sufficient for another session to resume without conversation history. However, `aslite status` currently reports `tasks/p5a-pre-live-hardening` missing its expected inbound `contains` link, and the consolidated `roadmap` doc does not yet encode the P5A -> P5B -> P5S -> continuous-staging spine. The release-program plan states the path in prose, so takeover is possible, but roadmap traversal is incomplete. The orchestrator should repair that bundle linkage when updating records; this review did not mutate the task, plan, or roadmap.

## Confidence

High (0.91). The verdict is grounded in the exact feature implementation, workflow ordering, normative state protocol, and the existing handoff/QA evidence. No network or external release mutation was performed.

[reviews plan](../plans/release-receipt-gate-fix-delta.md)

[reviews task](../tasks/p5a-pre-live-hardening.md)

[uses domain model](release-receipt-gate-domain-model-2026-08-08.md)

[continues handoff](receipt-gate-codex-handoff.md)
