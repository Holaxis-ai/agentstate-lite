---
type: Task
title: >-
  Build 'recipe export': data-free recipe extraction (the portability
  capability)
description: >-
  PROPOSED — pending Mike's export-vs-hand-author decision for the first recipe
  (tasks/recipe-personal-task-system). Build the 'recipe export' command per
  designs/recipe-export: the inverse of 'recipe add'. Exports DEFINITIONS only
  (conventions/*.md kind conventions + type:View registry docs & their HTML
  blobs + opt-in --include-ref docs), STRIPS all instance data, generates
  recipe.md, local-only, deterministic, --check dry-run. DoD: (1) ROUND-TRIP
  test — export a fixture bundle carrying kinds + views + instance docs, 'recipe
  add' the result to a fresh bundle, assert the kind registry + registered Views
  are identical and the instance-doc count is ZERO; (2) DATA-FREE guarantee test
  — a bundle with instance content -> export -> assert no instance body appears
  anywhere in the output folder, and the receipt reports instances_stripped
  correctly; (3) --check writes nothing (exit 0 clean / CONFLICT-style on
  drift), AXI capped+total receipt; (4) deterministic output pin (re-export
  unchanged bundle -> byte-identical); (5) reference opt-in (--include-ref
  carries exactly the named doc, nothing else). WHY BUILD (vs hand-author):
  collapses the recipe AND the portability capability into one, is user-facing
  (share a recipe without your data — Brian's ask), and advances
  prove-recipe-plugin-sharing. Its first real consumer is the Personal Task
  System recipe extraction.
actor: mike/claude
status: todo
priority: '2'
timestamp: '2026-07-20T20:58:08.228Z'
---
[build this design](../designs/recipe-export.md)

[the portability capability this proves](prove-recipe-plugin-sharing.md)
