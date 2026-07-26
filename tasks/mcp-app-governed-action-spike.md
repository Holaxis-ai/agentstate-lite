---
type: Task
title: Prove MCP-host reuse of the governed View action authority
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Implemented experimentally in commit 586bf0f. Extracted the existing Page
  launch/trusted scalar action authority into private
  @agentstate-lite/view-runtime; local UI behavior remains pinned while MCP
  becomes a second host adapter. show_view actions are capped,
  selection/version-bound, Kind-validated, actor-required, and rendered only in
  trusted shell chrome. App-only prepare/finish tools provide exact
  confirmation, cancellation, one-shot launch-bound approval, hard CAS through
  core mutateDocument, final-version receipts, and authoritative refresh.
  Targeted suites and the full npm run check pass. Empirically repeated on the
  exact final build in the official MCP Apps reference host against a disposable
  filesystem Task: prepare left todo unchanged; Apply produced done plus actor
  openai/codex; the same View refreshed to done and the normal CLI read the
  identical final version. Status remains in_progress because this changed write
  mechanics and still requires independent review plus adversarial QA before any
  product merge.
actor: openai/codex
timestamp: '2026-07-26T16:57:50.221Z'
---

