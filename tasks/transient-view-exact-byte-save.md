---
type: Task
title: Save a transient View as exact durable bytes
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #192 at 0010f55 implements a host-neutral exact-byte persistence service
  plus the model-visible MCP save_transient_view adapter. It accepts
  launchId/viewId/optional description but no HTML; revalidates process-local
  approval, derives the entry path, uses create-only CAS/idempotency for blob
  and registry, preserves actor/final versions, reports retained inert entries
  on partial failure, and requires fresh durable authorization. Full npm run
  check is green; exact-SHA independent review and adversarial QA are in
  progress.
actor: openai/codex
timestamp: '2026-08-02T19:37:09.474Z'
---

