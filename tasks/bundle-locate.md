---
type: Task
title: 'bundle locate: expose the exact resolved local target'
status: done
priority: '1'
description: >-
  Shipped in PR #58 (merge 55ef6e6, reviewed head 3712c3b). Added bundle locate
  with a versioned local-path receipt, canonical physical path, selection
  provenance, and binding-file provenance. Extracted one shared local resolver
  consumed by openBundle while preserving ordinary commands' lexical-root
  behavior. Full repository gate and clean npm-tarball smoke passed; exact-SHA
  independent review approved with no findings.
actor: mike/codex
timestamp: '2026-07-15T02:04:11.541Z'
---
[depends on](project-binding.md)
