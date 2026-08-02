---
type: Task
title: Save a transient View as exact durable bytes
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #192 at 6c8251d implements the exact-byte persistence service and
  save_transient_view MCP adapter. Review found and the revision fixed a real
  cross-resource race: saved registrations now pin entry_version, and both MCP
  and web hosts refuse mismatched bytes. Registry creation routes through strict
  mutateDocument with persisted actor attribution; final entry/registry/approval
  state and commit-then-throw acknowledgements are reconciled; malformed pins
  are diagnosed; the clean built-CLI inventory is current. Full gates and
  focused MCP/browser suites are green; final exact-SHA independent review and
  adversarial QA are running.
actor: openai/codex
timestamp: '2026-08-02T20:00:19.300Z'
---

