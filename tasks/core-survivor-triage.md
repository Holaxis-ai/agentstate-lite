---
type: Task
title: >-
  Consume the first core mutation report: triage 852 survivors, pin the
  consequential clusters
status: done
priority: '2'
assignee: mike/claude
description: >-
  SHIPPED: PR #99 merged. 29 tests / 201 red-proven mutant kills across core's
  consequential clusters (filesystem-lock 32, content-type 47-kill table test,
  document-mutation 22, backend 17, versioning/paths/links/frontmatter/memory
  77, kinds-logic 6); every kill proven by an automated apply-fail-restore-green
  harness. All 1,044 survivor rows classified; full per-mutant JSONL on the
  board: artifacts/core-mutation-triage-2026-07-18.jsonl. Key findings on
  record: filesystem-lock's survivors are REAL (calibrated 4/5 genuine — the
  instrument's attribution is sound); API-design finding spun out as
  tasks/filesystem-lock-testability-seam (codex handoff); relativeHref
  latent-behavior question deliberately NOT pinned; blob-key '..' guard noted
  subsumed (class C, no deletion). Next weekly core run measures the score delta
  from these 201 kills. Backlog (599 ranked A-class) lives in the blob + PR body
  — future surplus-capacity evenings start there.
actor: mike/claude
timestamp: '2026-07-18T14:33:19.960Z'
---

