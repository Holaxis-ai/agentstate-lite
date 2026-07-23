---
type: Task
title: 'Phase 2: migrate the known bundles off legacy Page/pages-*/bridge forms'
status: todo
priority: '2'
assignee: ''
description: >-
  Per decisions/legacy-deprecation-path (Brian, 2026-07-23). GATED on
  feat/view-access-field merging. Scope: for each KNOWN bundle (this repo's
  board; Mike's bundles — enumerate with him): flip type Page->View; rewrite
  bridge->access; move registry ids pages-registry/->views-registry/ and blob
  keys pages/->views/ WITH inbound-link rewriting (ids are identity, so a move
  is delete+recreate — the small stock, 8 docs here, is what makes this
  tractable now). Ship as a re-runnable migration pass (script or verb —
  decide), leaving the status legacy-stock audit at ZERO for each migrated
  bundle. The audit IS the completion meter. Do not remove any code path in this
  unit.


  ALSO IN SCOPE (2026-07-23): correct the repo CLAUDE.md gate-4 line
  ('legacy-typed docs under the legacy prefixes keep working and never migrate')
  and the matching prose in legacy-page.ts / the Page-kind references — all now
  contradicted by decisions/legacy-deprecation-path. Per Brian: NOT to be folded
  into the rename PR; it rides this migration unit (or a direct edit by Brian),
  keeping each PR one claim.


  SCOPE ADDITION (Brian's two-names concern, 2026-07-23): also DROP `bridge`
  from the SHIPPED View convention (currently access required + bridge
  optional-with-enum), so fresh installs declare and teach ONE name — today
  every new bundle's `kinds` output shows both fields, delivering the legacy
  name to greenfield users who have no legacy docs. Cost: a bundle that upgrades
  its convention while still holding unmigrated bridge-only docs loses
  enum-linting for the transient mid-migration state (runtime fail-close still
  guards; migrate first, then upgrade). SEQUENCING GOAL: phases 2+3 complete
  BEFORE the next real npm release, so the dual-name window closes before
  meaningful adoption begins — the window's cost is users-who-arrive-during-it,
  currently ~0.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T23:25:08.588Z'
---

