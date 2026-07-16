---
type: Task
title: Audit mutation coverage and close only demonstrated invariant gaps
status: todo
priority: '1'
description: >-
  Inventory every state-changing surface by mutation posture, verify
  CAS/no-op/final-version/actor/post-success behavior, and create small defect
  tasks for real gaps.
actor: mike/codex
timestamp: '2026-07-16T00:38:03.611Z'
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
