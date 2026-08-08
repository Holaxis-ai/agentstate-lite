---
type: Task
title: Implement continuous per-merge npm staging
status: todo
priority: '1'
description: >-
  Implement and dry-run the ratified continuous staging lane after P5A, P5B, and
  P5S; live publication remains human-controlled.
actor: openai/codex-plan-receipt-gate
timestamp: '2026-08-08T16:52:14.371Z'
---
# Goal

Implement the ratified continuous per-merge staging lane after P5A, P5B, and P5S are complete: every merge to `main` produces a serialized, retained, inspectable npm stage candidate while publication remains an explicitly human npm-2FA act. The implementation authority is `plans/continuous-staging-implementation`; this Task makes that planned unit claimable and visible on the distribution roadmap.

# Acceptance

- The lane runs only after the main CI/version-bundle convergence point, serializes racing merges, and records the exact merge SHA.
- It mints the next prerelease version from validated registry state into the packed candidate manifest only; it does not create a second bot commit/version channel on `main`.
- Rejected never-public candidates follow the ratified number-reuse rule, with concurrency and registry-unavailability cases tested.
- The phase/audit model explicitly represents candidates staged for later batch approval without weakening public dist-tag invariants.
- Every candidate retains the same tarball SHA/integrity, source/run/artifact identity, draft, signed-receipt, and finalization gates as the deliberate lane.
- Batch operator guidance covers approve newest, reject/skip superseded candidates, and exact per-candidate finalization.
- A dry-run proves trigger, minting, serialization, retained-manifest agreement, rejection reuse, and fail-closed registry behavior before any live enablement.
- Live enablement is a separate explicit human decision after P5S and the dry-run evidence; no merge-triggered path may publish.

# Gate

High-risk release machinery: Builder -> independent exact-SHA Review -> adversarial QA for racing merges, rejected-number reuse, minted-manifest agreement, and registry failure -> repository gate -> Brian-owned PR/merge. External-team review is invited under the release-program convention. Any code change after Review loops back through Review before QA.

# Human boundary

P5S external repository/npm protection and trusted-publisher configuration remains Brian/Mike-owned. Continuous staging may prepare and stage; only Brian or Mike performs npm stage approval/finalization with 2FA. Enabling the live lane is not implied by merging implementation or passing dry-run evidence.

[depends on](release-protection-setup.md)

[ratified cadence decision](../decisions/release-cadence-continuous-staging.md)

[implementation plan](../plans/continuous-staging-implementation.md)
