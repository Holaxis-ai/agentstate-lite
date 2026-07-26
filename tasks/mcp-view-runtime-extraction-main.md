---
type: Task
title: Extract the host-neutral trusted View action authority
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  Claimed 2026-07-26 after PR #164 merged, GitHub showed no other open PRs, and
  Brian's remaining claimed headless verifier was rechecked as
  bridge/verifier/CLI work. Behavior-preserving main-integration unit only: move
  the existing PageLaunchRegistry and TrustedActionService out of ui-server into
  a private host-neutral view-runtime package; ui-server remains the sole main
  consumer and its local HTTP/action behavior must remain unchanged. Explicitly
  excludes the MCP package/command, new action declarations, app-only tools, and
  generated presentation behavior.
actor: openai/codex
timestamp: '2026-07-26T18:00:26.315Z'
---

