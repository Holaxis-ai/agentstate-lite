---
type: Task
title: >-
  Retire the migration era: delete the script, legacy diagnostics, and
  legacy-name tests in one sweep
status: blocked
priority: '4'
assignee: ''
description: >-
  Per Brian (2026-07-24): tests that reference long-forgotten conventions are
  themselves luggage — plan their retirement rather than letting them fossilize.
  The era is over when the code that REMEMBERS it is gone.


  GATES (all must hold before unblocking): phase 3 merged AND all known bundles
  migrated (status reads zero everywhere) AND a straggler window has lapsed
  (suggested: the first npm release with real external users has been out long
  enough that no legacy sightings occur — Brian sets the horizon when
  unblocking).


  ONE SWEEP, per the consolidation rule (implementation, tests, and commentary
  go together):

  - Delete scripts/migrate-legacy-view-names.mjs + its test file +
  scripts/prior-shipped-view-conventions/ fixtures.

  - Remove the status legacy-names diagnostic and the write-time legacy hint
  (legacy-page.ts), with their tests.

  - Remove rejection pins that exist solely to name legacy vocabulary
  (Page-not-registered, bridge-not-read).

  - Remove or genericize the fresh-bundle luggage-grep test.

  - Final prose sweep for remaining historical mentions in teaching surfaces.


  EXPLICITLY KEEP (not luggage, permanent posture): the generic fail-close pins
  — unrecognized capability values resolve to none. They mention no legacy name
  and guard the security boundary itself; the sweep must not catch them by file
  proximity.


  Also at retirement time: consider whether the pages-registry//pages/ prefix
  grammars retire too — depends on the still-open address decision
  (tasks/migrate-legacy-prefix-locations); if boards keep legacy ids as accepted
  luggage, the READ grammar stays even after everything else goes.
actor: claude-main
timestamp: '2026-07-24T17:37:27.049Z'
---
[decisions/legacy-deprecation-path](../decisions/legacy-deprecation-path.md)

[depends on](remove-legacy-page-bridge-support.md)
