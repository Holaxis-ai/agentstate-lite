---
type: Task
title: Extract the bounded Markdown renderer for multiple View hosts
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Claimed 2026-07-26 after checking GitHub (no open PRs), current remote
  branches, and active board work. Behavior-preserving main-integration unit
  only: move the existing bounded Markdown renderer into a private workspace
  package and keep the local DocPage output/security tests unchanged. Explicitly
  excludes the MCP command, MCP shell, governed actions,
  packages/ui/src/pages/bridge.ts, Launcher/activity work, and Brian's headless
  View verifier surface.
actor: openai/codex
timestamp: '2026-07-26T17:33:28.713Z'
---

