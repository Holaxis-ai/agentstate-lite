---
type: Task
title: >-
  Consume the first core mutation report: triage 852 survivors, pin the
  consequential clusters
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude 2026-07-18 — ACTIVE (plans/test-suite-confidence item 2's
  output finally consumed). Input: run 29628092134's core report — score 67.40,
  852 survived + 192 no-coverage of 3,202 mutants. Per-file: kinds 245 (expect
  mostly message-string mutants), bundle 181, filesystem-lock 154 (HEADLINE: the
  newest safety-critical module is the least-watched — though
  child-process-based tests may defeat perTest attribution, so sanity-check
  before mass-pinning), remote-backend 99, document-mutation 81, backend 52,
  content-type 50, versioning 34, paths 32, links 29, frontmatter 24,
  memory-backend 23. Unit shape: (1) TRIAGE all survivors by consequence class
  (invariant-logic vs message-string vs dead-code-candidate vs
  attribution-artifact); (2) PIN the worst consequential cluster (~25-35 tests,
  red-proven each: mutant applied -> test fails; real code -> passes) across
  filesystem-lock/backend-CAS/versioning/paths/document-mutation/frontmatter;
  (3) FILE dead-code candidates and the remaining ranked backlog — never delete
  code (survival is not removability proof). Zero production changes; test-only
  PR = trivial tier (author validation + CI).
actor: mike/claude
timestamp: '2026-07-18T13:45:29.895Z'
---

