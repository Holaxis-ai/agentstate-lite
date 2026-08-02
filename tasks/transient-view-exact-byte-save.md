---
type: Task
title: Save a transient View as exact durable bytes
status: in_progress
priority: '1'
assignee: openai/codex
description: >-
  PR #192 at exact SHA 691be7a implements the exact-byte persistence service and
  save_transient_view MCP adapter. Review found and the revision fixed
  cross-resource races: saved registrations pin entry_version; MCP and web hosts
  refuse mismatched bytes; catalogs admit and cache by the pin; registry
  creation routes through strict mutateDocument with persisted actor
  attribution; and final entry, registry, approval, deletion-race, and
  lost-write-acknowledgement state is reconciled before any success receipt.
  Independent review APPROVED and adversarial QA PASSED the exact SHA. Focused
  suites are green (View runtime 23/23, MCP 59/59, UI server 43/43, recipes
  51/51); GitHub full gates are the only remaining merge condition.
actor: openai/codex
timestamp: '2026-08-02T20:16:17.863Z'
---

