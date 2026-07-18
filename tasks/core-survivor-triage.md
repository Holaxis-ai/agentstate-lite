---
type: Task
title: >-
  Consume the first core mutation report: triage 852 survivors, pin the
  consequential clusters
status: in_progress
priority: '2'
assignee: mike/claude
description: >-
  CLAIMED mike/claude. Phase: BUILT — PR #99 (test/core-survivor-pins, candidate
  72ca662), test-only, merges on green lanes (trivial tier). RESULTS: all 1,044
  rows classified — 201 A-pinned (29 tests, EVERY kill red-proven by an
  automated harness; 1 claim correctly reclassified equivalent), 599 A-backlog
  (ranked; led by filesystem-lock parseOwner leniency + unsafe-lock-root
  cluster, bundle appendLog/regenerateIndex ~99, kinds convention-parsing
  leniency, remote-backend retry/actor), 121 B message-strings, 101 C dead-code
  candidates (filed with per-mutant reasons — notable: blob-key '..' guard
  subsumed by the dot-prefix rule), 22 D artifacts (env-conditional, NOT
  child-process attribution — the instrument is sound). CALIBRATION:
  filesystem-lock's 154 survivors are REAL (4/5 hand-check genuine); 32 worst
  pinned, 80 backlog. Full per-mutant classification: board blob
  artifacts/core-mutation-triage-2026-07-18.jsonl (pull with: aslite pull
  --doc-key artifacts/core-mutation-triage-2026-07-18.jsonl --out <f>). FILED
  QUESTIONS: relativeHref('dir/doc','dir.md')==='dir.md' latent-behavior
  question (deliberately NOT pinned — do not freeze dubious behavior);
  API-design finding spun out as tasks/filesystem-lock-testability-seam. Flip
  done at merge.
actor: mike/claude
timestamp: '2026-07-18T14:26:06.715Z'
---

