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


  BUILD COMPLETE 2026-07-24 — branch feat/phase3-remove-legacy-names at e271d20
  (4 commits: 8192269 removal + loudness; 132ad95 review round: teaching pin,
  reference retirement, stale-convention diagnostics+refusal, migration_required
  recipe outcome; 74a7610 mid-vintage reference refresh, 7 provenance-frozen
  forms; e271d20 guard split destructive-vs-refresh). 4 review rounds, findings
  4->1->1->0; record context-notes/review-phase3-removal-rounds; final gates
  re-verified on host at exact SHA. MERGE REMAINS GATED: Mike's bundles at zero
  + Brian's explicit coordinated go (plugin channel tracks main). Policy adopted
  pending Brian's overrule window: recipe reapply on unmigrated legacy reports
  migration_required, never a satisfied-looking skip.


  UPDATE 2026-07-25: rebased onto main (receipt-unit conflict; reconciliation
  commit c37a8c3), e2e suite converted to the post-removal contract (CI-caught
  gap), delta rounds 5-6 closed with APPROVE/zero findings. Branch head 4d77e31,
  CI green including the Playwright gate. Build FULLY complete; merge gate
  unchanged (Mike zeros + Brian's go).
actor: claude-main
timestamp: '2026-07-25T17:53:49.355Z'
---
[depends on](migrate-legacy-page-bridge-stock.md)

[context-notes/review-phase3-removal-rounds](../context-notes/review-phase3-removal-rounds.md)
