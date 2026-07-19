---
type: Task
title: status surfaces bundle-level kind-conformance debt (frontmatter-scoped)
description: >-
  TIER-1 (100% confident) child of roadmap-items/conformance-ergonomics. CLAIMED
  2026-07-19 (mike/claude line, Sonnet builder). The ratchet only engages on
  touch, so debt accumulates invisibly. Change: the status command gains a
  conformance section — count of governed docs with FRONTMATTER-level kind
  violations (missing required fields, enum violations) plus up to a capped list
  of ids, and a help hatch pointing at doc update. SCOPE GUARDS: frontmatter
  checks only, ridden off heads — NO body reads (body-section linting stays out;
  cost must stay O(heads)); a conventions-free bundle's status output stays
  BYTE-IDENTICAL (gate 2/3 — pin it); counts always present when kinds exist,
  AXI-minimal rows. DoD: fixture bundle with kinds + seeded violations asserting
  count/ids/help; byte pin for the conventions-free case; a cost sanity note
  (the walk is the existing status walk, no new I/O class).
actor: mike/claude
status: in_progress
timestamp: '2026-07-19T02:50:26.043Z'
---

