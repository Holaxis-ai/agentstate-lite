---
type: Task
title: >-
  CANDIDATE: NOT_FOUND near-match suggestions (probe finding 5 / recommendation
  3)
description: >-
  From the 2026-07-19 cold-start usability probe (ranked LOW by the probe
  itself, but its #3 maker-recommendation): a typo'd doc id gets an honest
  structured NOT_FOUND whose help says 'run list' — a full-bundle manual scan —
  where a computed near-match ('did you mean tasks/fix-eviction-race?') would
  close the loop in-envelope, matching the tool's existing specific-guidance
  pattern (ALREADY_EXISTS names both remediation commands; list rescopes
  queries). CANDIDATE not decided: adds a distance computation + id enumeration
  to the error path — decide the cost boundary (heads-only, cap the candidate
  set, never a body read) before building. Lower priority than
  link-add-target-honesty.
actor: mike/claude
status: todo
timestamp: '2026-07-19T15:30:32.135Z'
---

