---
type: Task
title: >-
  CLAUDE.md line: verify gates by their own exit code (piped-tail false-green
  trap)
status: done
priority: '2'
description: >-
  CLOSED WITHOUT BUILD — already satisfied: CLAUDE.md line 207 carries the full
  convention ('Verify a gate by its own exit code, never through a pipe', with
  the piped-tail false-green mechanics and the check-the-LAST-change rule).
  Landed via the U6-era conventions work; this task record lagged the tree (the
  exact staleness class the records discipline warns about — caught by
  grep-before-building, 2026-07-15). The lesson it encodes has since been
  re-validated three times in the field (builder false-green 07-08, orchestrator
  masked pull 07-11, orchestrator masked rebase 07-13).
actor: brian-claude
timestamp: '2026-07-15T17:27:58.124Z'
---

