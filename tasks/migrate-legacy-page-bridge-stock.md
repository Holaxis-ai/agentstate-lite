---
type: Task
title: >-
  Phase 2a: in-file migration — bridge->access and Page->View, locations
  untouched
status: todo
priority: '2'
assignee: ''
description: >-
  RESTRUCTURED 2026-07-23 around the three-dials model (Brian): the migration
  has three INDEPENDENT dials — (1) permission field name, (2) type name, (3)
  folder location. This task is dials 1+2 ONLY; dial 3 is
  tasks/migrate-legacy-prefix-locations and is a separate, genuinely open
  decision.


  GATED on PR #155 (feat/view-access-field) merging. SCOPE — one re-runnable
  engine-level script (core API, CAS writes, idempotent) that, per known bundle
  (this repo's board; Mike's — enumerate with him):

  - renames own-property  ->  on every View/Page registration doc (same value
  verbatim; invalid values copied with a warning — fail-close semantics
  identical under either name; docs already carrying access skipped);

  - flips  ->  (verified safe: the registration predicate checks type and folder
  prefix independently — a type:View doc under pages-registry/ is fully valid
  and servable);

  - migrates the bundle's View convention IN THE SAME PASS (old conventions
  declare bridge required — migrating docs without the convention breaks kind
  lint; swap to the current shipped convention or edit fields);

  - DROPS  from the SHIPPED convention so fresh installs declare and teach one
  name (today every new bundle's kinds output shows both fields);

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

  DONE WHEN: zero own-bridge fields and zero type:Page docs across all known
  bundles (the status audit is the meter), fresh installs teach access only, and
  the stale prose is corrected.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T23:48:25.560Z'
---

