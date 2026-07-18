---
type: Task
title: >-
  Sync-family copy: convert the remaining guidance sites to rows, then unify the
  recorded inconsistencies
status: done
priority: '3'
assignee: mike/claude
description: >-
  SHIPPED: PR #101 + #102 merged (candidates 8f5ccf4, 93b57ac; stacked, merged
  in order). #101: nine guidance sites became rows (fixtures 70->78,
  fixture-first — reviewer regenerated ALL 8 from a base build byte-identical;
  existing artifacts pure-append; net -25 LOC; every inline construction
  deleted, no two-paths; the inTreePullHint consolidation proven by textual
  identity). #102: three declared copy unifications as exactly 4 fixture deltas
  — namespace-conflict (greenfield gains a correct no---yes help, verified
  against the real dispatch), marker-unavailable x3 -> one wording ('nothing was
  changed' verified true at all 3 call sites pre-mutation), no-upstream
  duplicate adoption (flagged judgment call adjudicated KEEP on the merits).
  Both boundary decisions preserved: zero board-git files touched — bare-'sync'
  package stance and error taxonomy intact, recorded as wontfix-as-designed in
  the PR. Reviews: both APPROVE, no findings, all verification independent. THE
  SYNC-FAMILY COPY STORY IS COMPLETE: every refusal-with-guidance is an
  enumerated row; every wording deliberate; remaining inconsistencies are
  recorded decisions, not accidents. Next unblocked per sequencing: test-file
  splits (nothing behavior-frozen in flight).
actor: mike/claude
timestamp: '2026-07-18T15:32:03.755Z'
---

