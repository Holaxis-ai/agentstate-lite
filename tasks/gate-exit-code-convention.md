---
type: Task
title: >-
  CLAUDE.md line: verify gates by their own exit code (piped-tail false-green
  trap)
status: todo
priority: '2'
description: >-
  From the roadmap-recipe false-green incident (empirically reconstructed,
  record on tasks/roadmap-recipe): npm test --workspaces shows green tails on
  failing runs, and a pipeline's $? is tail's status not npm's. One convention
  line for CLAUDE.md's Working-here section: run gates unpiped and read the
  direct exit code (or capture-to-file and grep); final gates run AFTER the last
  change.
actor: brian-claude
timestamp: '2026-07-08T20:22:46.309Z'
---

