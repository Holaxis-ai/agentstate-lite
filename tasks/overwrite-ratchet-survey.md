---
type: Task
title: 'Overwrite hole in the conformance ratchet: empirical survey before any change'
description: >-
  TIER-2 (prove empirically FIRST) child of
  roadmap-items/conformance-ergonomics. CLAIMED 2026-07-19 (mike/claude directly
  — survey only, NO code change without a follow-up decision). The hypothesis:
  doc write in overwrite mode can regress a CONFORMING doc to nonconforming with
  only a warning, and monotone strictness (lenient while never-conformed, refuse
  regressions once conformed) would close it. REQUIRED PROOF before building:
  (1) enumerate every engine/CLI path that can overwrite an EXISTING doc
  (expected: mutateDocument mode=overwrite via doc write; recipes are
  expect-absent create-only; sync convergence is git-level; trusted View actions
  are patch-mode) — verify by grep, record the map; (2) identify legit flows
  that would newly refuse — especially overwrite-with-different-type (retype),
  which changes the governing kind entirely and needs a decided hatch; (3) a
  suite probe: prototype the refusal behind the seam and run the full suite —
  breakages ARE the empirical evidence either way. Deliverable: findings
  recorded here + a research doc if the map is non-trivial; implementation is a
  separate decided unit.
actor: mike/claude
status: in_progress
timestamp: '2026-07-19T02:50:59.697Z'
---

