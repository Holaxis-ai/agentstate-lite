---
type: Task
title: Replace universal review ceremony with risk-tiered shipping gates
status: in_progress
priority: '1'
description: >-
  Narrow policy-only PR in CLAUDE.md. Replace the universal Builder ->
  independent Reviewer -> QA requirement with proportionate gates: trivial
  metadata/docs/dependency/test-only changes use author validation plus relevant
  automation; ordinary code changes require independent review plus repository
  gate; high-risk boundaries require independent review and adversarial QA.
  Preserve exact-SHA review discipline where independent review applies,
  security disclosure rules, dangerous-boundary testing, and the full pre-ship
  repository gate. Keep the classification short and judgment-based; do not
  create a scoring framework, new files, workflow code, or product behavior
  changes. This policy PR itself follows the current rule once, proportionately.
actor: codex
timestamp: '2026-07-13T02:34:32.049Z'
---

