---
type: Task
title: Extract the bounded Markdown renderer for multiple View hosts
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #164 opened from commit 881d6a8 as a draft. Behavior-preserving unit only:
  the bounded Markdown renderer moved 99% intact into private
  @agentstate-lite/markdown-renderer; DocPage remains the only current main
  consumer; the existing render-path security gate now scans both the UI and
  extracted package. Explicitly excludes MCP command/shell/actions and Brian's
  Launcher/activity/headless-verifier surfaces. Targeted renderer/DocPage tests
  passed 33/33; full npm run check passed including UI 175/175 and browser
  18/18. Independent review and CI remain before merge.
actor: openai/codex
timestamp: '2026-07-26T17:40:13.963Z'
---

