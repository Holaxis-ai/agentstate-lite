---
type: Task
title: >-
  Build 'recipe export': data-free recipe extraction (the portability
  capability)
description: >-
  DEFERRED (2026-07-20, Mike): decided to HAND-AUTHOR the first recipe instead
  of building automated export now. Reasons: (1) the first recipe needs
  generalization/simplification by hand anyway, so automated export wouldn't
  produce the final artifact; (2) the design review surfaced that export is
  PREMATURE — a clean exporter needs first-class RECIPE OWNERSHIP that doesn't
  exist yet. THE REAL MISSING SEAM: a bundle records definition-vs-instance
  cleanly, but NOT which definitions belong to which recipe (recipe-A vs
  recipe-B), and 'safe-to-publish vs private' can't be inferred structurally
  (convention prose / View HTML can carry private info — so it's
  'instance-free', NOT 'data-free'). EVENTUAL CLEAN MODEL (when built): a bundle
  MAY carry an optional 'Recipe Definition' manifest declaring which
  conventions/views/refs form a named, versioned, portable recipe (NOT required
  per-bundle — packaging metadata, needed only by recipe authors); export
  follows that declared membership rather than scanning-and-guessing. REVISIT
  TRIGGER: build export once recipe ownership is first-class, OR when
  whole-bundle export stops being accurate (a bundle needs multiple
  independently-exportable subsets). Design (with the review corrections) in
  designs/recipe-export.
actor: mike/claude
status: todo
priority: '4'
timestamp: '2026-07-20T21:19:07.266Z'
---
[build this design](../designs/recipe-export.md)

[the portability capability this proves](prove-recipe-plugin-sharing.md)
