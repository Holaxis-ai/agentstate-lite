---
type: Task
title: Make transient View approval provenance honest
status: in_progress
priority: '1'
assignee: delegated/codex
description: >-
  Follow up the post-merge PR #191 review at
  context-notes/transient-view-pr191-implementation-review. Make the MCP
  active-View approval dialog source-aware: registered Views retain
  registered-source trust copy; transient Views explicitly say the HTML is
  agent-authored and process-local. The human trust prompt must not misstate
  provenance. Add a UI-level regression test covering both source kinds. Keep
  this PR limited to copy selection and its executable proof; do not include
  authorization-store construction or launch immutability.
actor: openai/codex
timestamp: '2026-08-02T20:22:33.556Z'
---

