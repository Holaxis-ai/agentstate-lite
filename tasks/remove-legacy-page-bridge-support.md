---
type: Task
title: >-
  Phase 3: remove the legacy NAMES from code (Page type, bridge fallback) — old
  folders stay recognized
status: in_progress
priority: '3'
assignee: claude-builder-phase3
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


  REQUIRED PIN (2026-07-24, from Brian's merge-first question): the migration
  script IS the recovery path for any bundle that meets phase 3 unmigrated, so
  phase 3 MUST NOT break it. Verified today: the script imports only generic
  engine primitives
  (query/read/write/delete/versionedMutation/parseMarkdown/stringifyDoc/isUsableTimestamp)
  and matches legacy names via its own literals — none of the removed acceptance
  surface. Pin it: a phase-3 test runs the script against a legacy fixture
  (Page-typed doc + bridge field + old convention) AFTER the removals and
  asserts full migration succeeds. Also confirms the ordering story:
  post-phase-3 breakage is loud-error-plus-one-command recovery, never stranding
  — but merge timing still coordinates with Mike (his plugin updates on merge;
  migrate-first remains the courteous default).
actor: claude-builder-phase3
timestamp: '2026-07-24T17:03:57.812Z'
---
[depends on](migrate-legacy-page-bridge-stock.md)
