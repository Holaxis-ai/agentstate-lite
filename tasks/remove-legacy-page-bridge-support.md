---
type: Task
title: >-
  Phase 3: remove the legacy NAMES from code (Page type, bridge fallback) — old
  folders stay recognized
status: blocked
priority: '3'
assignee: ''
description: >-
  RESTRUCTURED 2026-07-23 (three-dials model): this removes the legacy NAMES
  once no file uses them — it does NOT touch folder-prefix recognition, which
  stays (two grammar constants, near-zero carrying cost) unless/until the
  separate address decision (tasks/migrate-legacy-prefix-locations) says
  otherwise.

  BLOCKED on Phase 2a reading zero legacy stock across all known bundles. SCOPE:
  drop 'Page' from PAGE_TYPE_NAMES; drop the bridge-field fallback from
  declaredAccessValue; replace dual-read tests with rejection pins (a legacy doc
  gets a CLEAR error naming the migration, not silence); update the one
  lint-fixture in status.test.ts that authors with --bridge (recorded on PR
  #156). KEEP: pages-registry//pages/ prefix recognition; bridge-named
  internals; the bridge:"v0" wire identifier. HIGH-RISK tier: deletes accepting
  paths on a security boundary.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T23:48:25.707Z'
---
[depends on](migrate-legacy-page-bridge-stock.md)
