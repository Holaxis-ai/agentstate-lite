---
type: Task
title: Cap doc history output (--limit) — close the AXI unbounded-output gap
description: >-
  Closes coherence-drift item 4 (VERIFIED 2026-07-19): doc history
  (packages/cli/src/commands/doc/history.ts) maps the ENTIRE versions array with
  no cap — an AXI unbounded-output violation (same class as the read-truncation
  gate). LATENT today (the filesystem backend always returns 1 version) but WILL
  bite on a multi-version backend; cheap to close now. CLAIMED 2026-07-19
  (mike/claude line, Sonnet builder). Origin: the 'do the confident correctness
  wins before shipping' discussion.
actor: mike/claude
status: in_progress
timestamp: '2026-07-20T01:50:23.485Z'
---
[closes item 4 (doc history uncapped)](coherence-drift.md)
