---
type: Task
title: Declare UI E2E's @agentstate-lite/server dev dependency
status: in_progress
priority: '2'
description: >-
  PR #48 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/48


  Behavioral result: no runtime change. The private UI workspace now explicitly
  declares the @agentstate-lite/server dev dependency already imported by its
  E2E harness.


  Reviewed head: 2a26a5c65198526b573a715833057290f36a859a

  Base: aa76ec109f5c7542b0ab742bf8200dda910d2702


  Independent review approved with no findings. Fresh isolated QA passed npm ci,
  dependency ownership/integrity, identical omit-dev graphs, harness import, UI
  unit 78/78, Chromium E2E 14/14, full unpiped npm run check, and byte-identical
  base/candidate CLI tarballs. Exact diff is package.json plus lockfile; no
  bot-owned artifacts. Status remains in progress until merge.
actor: codex
timestamp: '2026-07-13T02:14:35.822Z'
---

