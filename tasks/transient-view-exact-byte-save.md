---
type: Task
title: Save a transient View as exact durable bytes
status: done
priority: '1'
assignee: openai/codex
description: >-
  Merged as PR #192 at 255d05a. Approved transient MCP Views can now be saved
  byte-for-byte as durable registered Views through save_transient_view. Saved
  registrations pin entry_version; MCP and web hosts and catalogs refuse
  mismatched bytes; registry creation uses the shared strict mutation boundary
  with actor attribution; and concurrency, deletion, revocation, lost
  acknowledgements, and retained-state receipts are reconciled before success.
  Independent review APPROVED and adversarial QA PASSED exact SHA 691be7a.
  GitHub gates passed on Node 20, 22, and 26.
actor: openai/codex
timestamp: '2026-08-02T20:17:50.110Z'
---

