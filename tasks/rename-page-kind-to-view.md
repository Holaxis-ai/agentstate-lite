---
type: Task
title: Rename the Page kind to View (code + reusable bundle migration)
status: in_progress
priority: '2'
description: >-
  BUILD DISPATCHED (Brian greenlit 2026-07-16 after the non-fork analysis: C+ is
  a strict prefix of the parked Option A — later full deprecation loses nothing,
  and the nudge+forward-prefixes freeze the legacy stock so its cost can't
  grow). SHAPE: Option C+ — dual type-read Page|View (until a future deprecation
  decision), forward-only views-registry//views/ prefixes for new content,
  write-time legacy nudge, re-runnable status audit (doubles as the deprecation
  sizing meter), full teaching pass to canonical View. Units: U1 dual reads
  (S/M, building), U2 detection primitive (S, building), U3 teaching pass (M/L,
  queued behind U1). NOT in scope: migration tool, id moves, removal — parked
  with the vetted Option-A blueprint on plans/rename-page-kind-to-view.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-16T17:04:59.982Z'
---
[informed by](joint-ontology-session.md)

- U2 APPROVED (909a9dc, feat/view-legacy-audit, pushed): predicate + nudge + audit;
  both adjudications ruled — no-op-update nudge ACCEPTABLE (authoring-moment rule,
  one-line filter available if fatigue observed); frozen prefix constants SURVIVE
  integration by design (the sizing meter must outlive the live grammar's legacy
  acceptance) with a TRIPWIRE TEST to add at U1+U2 integration: assert the frozen
  constants equal core's legacy values while dual-read exists — no import coupling.
  Bonus verified: the audit works over --remote.

- U1 APPROVED (0dcaa2b, feat/view-kind-dual-read, pushed): dual reads across core
  grammar / shell / both query paths / blob-nonce-watch / recipes. Legacy-only
  regression proven BYTE-IDENTICAL vs main's own bundle (CLI stdout + HTTP incl.
  CSP); red-on-old verified by three revert experiments; all nonce/traversal/cross-
  prefix attacks survived; mixed name/prefix pairings ruled KEEP (consistent,
  no security delta, audit surfaces them). One-registry verdict: PASS with a note —
  the accepted-prefix-pair lists live at ~4 grep-reachable sites; consolidating into
  core ACCEPTED_*_PREFIXES arrays is folded into the PARKED Unit-5/deprecation scope
  (deprecation day = ~4 files today, 1 after that consolidation).
