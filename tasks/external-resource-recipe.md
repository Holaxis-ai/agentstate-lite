---
type: Task
title: >-
  External-resource recipe: field-trial a Resource kind elsewhere, then
  productize
status: todo
description: >-
  Gated on real-world lessons from a trial convention running in a private
  project's bundle
actor: brian/claude
timestamp: '2026-07-20T19:41:44.783Z'
---
# Summary

Goal: let a bundle index knowledge that lives OUTSIDE it (e.g. Google Drive folders) as
first-class docs, so "what does this project know?" (bare `list`, links, orientation)
surfaces external resources alongside internal ones — pointers and coarse summaries only,
never copies, never credentials.

Approach (decided 2026-07-20): discovery through use, no code changes yet.
1. A hand-authored `Resource` kind convention (fields: title, url, system enum, owner,
   timestamp; sections: Contents, When to use; instances under `resources/`) is being
   trialed in another team's PRIVATE bundle via the existing convention mechanism.
2. Lessons to collect from the trial: which fields actually get used; per-folder vs
   per-file granularity; whether agents discover entries via list/links unprompted;
   pointer staleness; auth-failure legibility (does `system` + `owner` make 403s
   actionable); summary-leak discipline on shared boards.
3. Then implement here as a built-in kind and/or recipe (fits roadmap-items/recipe-plugins).

Relationship to existing mechanics: complements (does not replace) ad-hoc provenance
fields added to other kinds via `kind field add` — those annotate a doc; a Resource doc
IS the discoverable item. No engine change required; this is convention + recipe packaging.

Convention draft validated end to end on 2026-07-20 (promote → new → list) against the
built CLI. Do not build the recipe before the trial reports back.

[roadmap-items/recipe-plugins](../roadmap-items/recipe-plugins.md)
