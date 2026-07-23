---
type: Task
title: >-
  No 'view' recipe: the View kind — which the whole generate-a-view strategy
  depends on — has no first-class install path
status: todo
priority: '3'
assignee: ''
description: >-
  FOUND 2026-07-23; SEVERITY CORRECTED DOWN same day after Brian challenged the
  framing.


  CORRECTION (the honest version): the View kind is NOT a blocked entry point.
  The shipped skill documents the exact install command — SKILL.md:348, 'aslite
  promote "$REFS/views/conventions/view.md" --doc-key conventions/view.md', as
  step 4 of the view-authoring flow — and the convention file ships WITH the
  skill under references/views/conventions/view.md. A skill-following agent has
  this in front of it; the live test agent found and used it without
  reverse-engineering. The original 'no first-class path / user has to know'
  framing was WRONG — promote-a-shipped-reference IS the path, it is documented,
  and it works agent-first.


  WHAT ACTUALLY REMAINS (minor, hence P3):

  1. INCONSISTENCY: View installs via 'promote a reference convention', every
  other kind via 'recipe add <name>'. Not a blocker, but a discoverability
  wrinkle — an agent reasoning by analogy from work-tracking/roadmap would reach
  for a 'view' recipe that doesn't exist.

  2. DANGLING DOC REFERENCE: view-authoring-v0.md:192 says 'install its
  View-bearing recipe or promote the supplied conventions/view.md' — but NO
  View-bearing recipe exists. Half that sentence names a fix that isn't there.
  This is a real doc bug regardless of whether we add the recipe.


  PROPOSED FIX (either is fine; pick one):
    (a) Add a built-in 'view' recipe wrapping the already-shipped convention, so 'recipe add view' works by analogy with every other kind — then fix view-authoring-v0.md:192 to name it.
    (b) Leave the promote path as the one true way and just FIX view-authoring-v0.md:192 to stop referencing a nonexistent recipe.
  Consider single-sourcing the convention so the reference copy and any recipe
  copy cannot drift.


  DONE WHEN: the authoring reference no longer names a nonexistent recipe, and
  (if 'a' is chosen) 'recipe add view' declares the View kind and 'recipes'
  lists it.


  NOTE: this does NOT gate the generate-a-view strategy — that entry point
  already works. tasks/ui-view-headless-verify (agents cannot verify a view
  RENDERS) remains the real P1; the test agent genuinely could not do that and
  had to grep minified JS.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T18:05:15.442Z'
---
[tasks/ui-view-headless-verify](ui-view-headless-verify.md)
