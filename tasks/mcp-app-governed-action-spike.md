---
type: Task
title: Prove MCP-host reuse of the governed View action authority
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Ported the experimentally proved governed-action contract onto current main as
  PR #168 at exact SHA 23cab48. The MCP host still exposes one model-visible
  show_view tool; bounded document.set-field declarations become trusted-shell
  controls, while app-only prepare/finish tools enforce launch,
  selection/version, actor, Kind, one-shot approval, and hard-CAS constraints
  through shared view-runtime/core authorities. Generated HTML remains
  script-free and read-only. Verification on the exact commit: targeted MCP App
  10/10, MCP CLI 4/4, view-runtime 2/2, existing UI action/import tests 6/6, and
  full npm run check including packed npm proof and browser E2E 18/18. High-risk
  write boundary: independent exact-SHA review and adversarial QA remain
  required before merge.
actor: openai/codex
timestamp: '2026-07-26T20:28:11.722Z'
---

