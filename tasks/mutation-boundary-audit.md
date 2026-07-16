---
type: Task
title: Audit mutation coverage and close only demonstrated invariant gaps
status: done
priority: '1'
description: >-
  Inventory every state-changing surface by mutation posture, verify
  CAS/no-op/final-version/actor/post-success behavior, and create small defect
  tasks for real gaps.
actor: mike/codex
assignee: mike/codex
timestamp: '2026-07-16T02:52:35.182Z'
---
# Scope

Audit every state-changing CLI/core surface against [the mutation integrity design](../designs/mutation-boundary-audit.md). Produce the posture/authority/evidence matrix first; do not begin with a broad refactor.

# Deliverable

- A complete inventory of read-dependent, hard-CAS, expect-absent, and explicit-replacement mutations.
- Evidence for CAS retry, no-op behavior, final-version receipts, actor behavior, and post-success effects.
- Small linked defect tasks for each real gap.

# Coordination

The inventory is parallel-safe with `board-git` A0/A1. Do not implement cursor/self-actor storage, Git discovery, `BoardChannel`, or the Git-aware post-persist subscriber concurrently. Recheck affected command seams after A0 merges.

[guided by](../designs/mutation-boundary-audit.md)

[coordinates with](../tasks/board-git-a0-seam-prep.md)

# Outcome

Completed 2026-07-16. The full matrix and decisions are recorded in the linked design's **Audit result — 2026-07-16** section.

- Confirmed that semantic document mutations already converge on core `versionedMutation` plus the CLI document-policy adapter; a second generic helper is not warranted.
- Ran targeted evidence: 94 core mutation/backend tests and 302 CLI authoring/import/delete/recipe/catalog/state tests passed.
- Identified the default filesystem adapter's cross-process CAS limitation as the only broad silent lost-update risk in the flagship local workflow.
- Identified one isolated missing adversarial proof for `regenerateIndex`; its documented one-scan/self-healing policy remains unchanged.
- Classified auxiliary catalog, cursor, credential, hook, UI pointer, output-file, and Git-channel mutations instead of forcing them through a semantic document funnel.

[produced](../tasks/filesystem-cross-process-cas.md)

[produced](../tasks/regenerate-index-cas-proof.md)
