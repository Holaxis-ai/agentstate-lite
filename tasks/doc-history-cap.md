---
type: Task
title: Cap doc history output (--limit) — close the AXI unbounded-output gap
description: >-
  DONE — PR #129 merged f2bf013 (2026-07-19), independently reviewed APPROVE
  (claude line). doc history now bounds output with --limit (default 20, the
  per-item-list convention; --limit 0 = all). count always reports the TRUE
  total; a truncated page adds shown + a help line naming both escapes.
  Byte-identical when under the cap (holds BY CONSTRUCTION — the filesystem
  single-version chain never triggers truncation; also empirically
  pre/post-diffed zero). Cap exercised via MemoryBackend (the only backend with
  a real version chain); red-proofed. Closes coherence-drift item 4. NOTE:
  merged during the ongoing GitHub Actions outage on review + full local gates
  (build/typecheck/test 1054, check:skill all 0), CI queue-stuck — same posture
  as #126.
actor: mike/claude
status: done
timestamp: '2026-07-20T02:16:10.714Z'
---
[closes item 4 (doc history uncapped)](coherence-drift.md)
