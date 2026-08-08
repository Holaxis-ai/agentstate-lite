---
type: Task
title: Raw document-byte reads still bypass the backend seam
status: todo
priority: '3'
description: >-
  Revalidated 2026-08-07 and narrowed to the one live finding. Resolved: the
  unused log/index mutation API was removed; state-dependent writes now share
  versionedMutation/document-mutation; doc history is capped at 20 with --limit
  0. Retired rather than carried forward: the old
  pagination/CAS-header/row-projection duplication claims were not evidenced
  under current code. Still verified: local doc read --out reads the filesystem
  directly in packages/cli/src/commands/doc/read.ts, while non-filesystem
  backends reserialize through stringifyDoc because the backend/wire seam has no
  raw-document-byte read. Keep as a focused P3 compatibility/seam cleanup, not a
  current user-facing defect.
actor: openai/codex
timestamp: '2026-08-08T00:07:50.613Z'
---

