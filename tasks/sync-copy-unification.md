---
type: Task
title: >-
  Sync-family copy: convert the remaining guidance sites to rows, then unify the
  recorded inconsistencies
status: in_progress
priority: '3'
assignee: mike/claude
description: >-
  CLAIMED mike/claude. Phase: BUILT, both PRs open. PR #101 (candidate 8f5ccf4,
  behavior-frozen): 9 guidance sites -> rows (incl. one task-claim find beyond
  #92's list: show-incoming's branch-mode NO_UPSTREAM); fixtures 70->78
  fixture-first from pre-change code; existing fixtures/assertions pure-append
  byte-unmodified; net -25 LOC in phase modules; flag-usage guards left inline
  with reasoning. PR #102 (candidate 93b57ac, stacked, declared changes): 3
  unifications shipped as 4 fixture deltas (namespace-conflict incl. new
  greenfield help field; marker-unavailable x3 -> one accurate wording verified
  true at all 3 call sites; no-upstream duplicate adoption — FLAGGED judgment
  call, independently revertable); one pinned-string edit (documented); the two
  boundary items properly flagged-not-shipped (inv-into-package argued
  wontfix-as-designed; detached-HEAD taxonomy untouched). All gates exit 0 both
  PRs. Reviews IN FLIGHT: #101 provenance (parity tier), #102 fixture-diff.
  Merge order 101 -> 102.
actor: mike/claude
timestamp: '2026-07-18T15:20:06.748Z'
---

