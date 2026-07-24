---
type: Task
title: >-
  Phase 2a: in-file migration — bridge->access and Page->View, locations
  untouched
status: done
priority: '2'
assignee: claude-builder-migrate
description: >-
  RESTRUCTURED 2026-07-23 around the three-dials model (Brian): the migration
  has three INDEPENDENT dials — (1) permission field name, (2) type name, (3)
  folder location. This task is dials 1+2 ONLY; dial 3 is
  tasks/migrate-legacy-prefix-locations and is a separate, genuinely open
  decision.


  GATED on PR #155 (feat/view-access-field) merging. SCOPE — one re-runnable
  engine-level script (core API, CAS writes, idempotent) that, per known bundle
  (this repo's board; Mike's — enumerate with him):

  - renames own-property 'bridge' -> 'access' on every View/Page registration
  doc (same value verbatim; invalid values copied with a warning — fail-close
  semantics identical under either name; docs already carrying access skipped);

  - flips type Page -> type View (verified safe: the registration predicate
  checks type and folder prefix independently — a View-typed doc under
  pages-registry/ is fully valid and servable);

  - migrates the bundle's View convention IN THE SAME PASS (old conventions
  declare bridge required — migrating docs without the convention breaks kind
  lint; swap to the current shipped convention or edit fields);

  - DROPS bridge from the SHIPPED convention so fresh installs declare and teach
  one name (today every new bundle's kinds output shows both fields);

  - corrects the repo CLAUDE.md gate-4 'never migrate' line and the
  legacy-page.ts / Page-kind prose (per Brian: not in the rename PR — rides this
  unit);

  - receipt notes the canonical-rewrite side effect (engine writes re-serialize
  whole docs; engine-written docs diff only on the renamed keys).

  EXPLICITLY NOT HERE: any id/blob move, any link rewriting — locations stay.
  Old folder names remain recognized indefinitely (cheap: two grammar
  constants).

  HIGH-RISK tier (bulk rewrite of shared state): builder -> independent review
  -> adversarial QA; tests for idempotence, CAS conflict, both-fields, invalid
  values, convention co-update.

  SEQUENCING GOAL: complete (with phase 3) BEFORE the next real npm release —
  the dual-NAME window closes before meaningful adoption; the window's cost is
  users-who-arrive-during-it, currently ~0.

  DONE WHEN: zero own-bridge fields and zero Page-typed docs across all known
  bundles (the status audit is the meter), fresh installs teach access only, and
  the stale prose is corrected.


  DONE 2026-07-24 — merged via PR #157 (merge b884bae; 5 commits
  2901497/6334830/2c2094b/bf4d0f7/4400ec3). Review: 6 rounds across TWO
  independent Codex teams, findings 6->1->1->0->1(external)->0; record
  context-notes/review-phase2a-migration-rounds. LIVE BOARD MIGRATED same day:
  dry-run first (correctly stopped on the customized-classified convention — an
  old shipped shape + one hand-edited link line), then real run with
  --overwrite-custom-conventions: 8 types flipped, 8 bridge fields renamed,
  convention swapped (old bytes exported + preserved in board git history),
  conventions/page deleted, second run all zeros, synced (13 board commits).
  AFTER-AUDIT: 0 Page-typed docs, 0 own-bridge fields, dangling/invalid view
  counters 0; the 2 residual grep hits are PROSE in historical docs (correct
  negative scope). REMAINING for Mike: run the script on his bundles (dry-run
  first). Phase 3 (remove legacy names from code) is now unblocked pending
  Mike's bundles reading zero.
actor: claude-main-migrate
timestamp: '2026-07-24T14:33:04.739Z'
---
[context-notes/review-phase2a-migration-rounds](../context-notes/review-phase2a-migration-rounds.md)
