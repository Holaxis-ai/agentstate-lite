---
type: Task
title: Rename the Page kind to View (code + reusable bundle migration)
status: in_progress
priority: '2'
description: >-
  FOUNDERS-DECIDED (Brian + Mike, direct conversation 2026-07-16, pre-empting
  the ontology-session agenda line): the Page kind renames to View — 'page'
  collided with the ordinary sense of a bundle's documents, an interface defect
  for agent instructions. TWO DELIVERABLES: (1) CODE — shell registry parser
  type match, pages-registry/ and pages/ prefix grammar, launcher strings,
  skill/reference teaching + shipped example pages; ADJUDICATE the bridge
  'open-page' message (embedded clients live inside existing dashboard blobs
  everywhere — keep the wire name or dual-accept; do not silently break synced
  dashboards). (2) REUSABLE MIGRATION TOOL — retypes registry docs AND moves ids
  to the new prefix (doc-id moves are delete+create: rewrite inbound links),
  moves blobs, updates entry fields, rewrites the convention doc; CAS-safe via
  existing verbs; tested against this repo's own board as the first migration.
  DESIGN CHOICE carried: clean break (code recognizes only View; recommended at
  today's ecosystem size) vs deprecation window (dual-read + status lint nag) —
  builder proposes, founders' decision stands unless implementation reveals a
  blocker. Note the system-kind asymmetry this exposes: Page/View is nominally
  consumed by product code, unlike generically-consumed kinds — recorded in
  docs/how-it-works.
actor: brian-claude
assignee: brian-claude
timestamp: '2026-07-16T15:23:47.998Z'
---
[informed by](joint-ontology-session.md)
