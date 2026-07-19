---
type: Task
title: 'Agreement test: bridge query and CLI list share valid filtering semantics'
status: in_progress
priority: '2'
description: >-
  PR #38 proved these parallel surfaces can drift: bridge limit:0 returned no
  rows while CLI list defined zero as unlimited. Add one per-row agreement table
  over their shared valid contract: field membership, open/terminal filtering,
  positive cap, zero/unlimited, order, and count. Do not force malformed-input
  behavior to agree; bridge JSON normalization and CLI usage errors
  intentionally differ. Prefer one core-owned filtering primitive if that is
  simpler, while retaining a public-projection agreement proof.
actor: mike/codex
timestamp: '2026-07-19T02:16:33.205Z'
---

