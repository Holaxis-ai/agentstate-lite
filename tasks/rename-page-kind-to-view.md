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
timestamp: '2026-07-16T16:56:52.154Z'
---
[informed by](joint-ontology-session.md)

- U2 APPROVED (909a9dc, feat/view-legacy-audit, pushed): predicate + nudge + audit;
  both adjudications ruled — no-op-update nudge ACCEPTABLE (authoring-moment rule,
  one-line filter available if fatigue observed); frozen prefix constants SURVIVE
  integration by design (the sizing meter must outlive the live grammar's legacy
  acceptance) with a TRIPWIRE TEST to add at U1+U2 integration: assert the frozen
  constants equal core's legacy values while dual-read exists — no import coupling.
  Bonus verified: the audit works over --remote.
