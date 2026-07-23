---
type: Task
title: >-
  No 'view' recipe: the View kind — which the whole generate-a-view strategy
  depends on — has no first-class install path
status: todo
priority: '1'
assignee: ''
description: >-
  FOUND 2026-07-23 during a live view-authoring test, VERIFIED against the code.


  THE GAP: every kind but one installs with 'aslite recipe add <name>' —
  work-tracking -> Task, roadmap -> Roadmap/Roadmap Item. There is NO built-in
  'view' recipe. 'aslite recipe add view' errors 'unknown recipe view
  (built-ins: context-notes, work-tracking, roadmap)'. 'init' installs only
  context-notes. So a new bundle cannot declare the View kind through any
  first-class command.


  The View convention exists only as a shipped REFERENCE file
  (packages/cli/references/views/conventions/view.md), and the sole way to
  install it is a manual 'aslite promote conventions/view.md --doc-key
  conventions/view.md' pointing at a file inside the skill's reference folder
  that the user has to know is there. The authoring doc
  (view-authoring-v0.md:192) even instructs 'install its View-bearing recipe or
  promote the supplied conventions/view.md' — but NO View-bearing recipe exists,
  so half that sentence names a fix that isn't there.


  WHY P1: the agreed product direction (2026-07-23) is to guide users to
  GENERATE views on demand rather than ship canned ones. The View kind is the
  entry point to that entire strategy, and its first step — declare the kind —
  has no supported command. A test agent recovered only by reverse-engineering
  that a reference file existed and promoting it by hand.


  PROPOSED FIX: add a built-in 'view' recipe (a content-free RecipeSource entry
  in recipe-source-builtin.ts, exactly like work-tracking/roadmap) wrapping the
  convention that already ships as a reference. Then 'aslite recipe add view'
  works like every other kind, and view-authoring-v0.md:192's own instruction
  becomes true. Consider whether the shipped-reference convention and the
  recipe's convention should be ONE source to avoid drift.


  DONE WHEN: 'aslite recipe add view' declares the View kind in a fresh bundle;
  'aslite recipes' lists it; and the authoring reference points at that command
  instead of a manual promote of a reference file.


  SUPERSEDES-IN-PART: tasks/new-kind-missing-convention-hint — once this lands,
  that error can say 'run aslite recipe add view' instead of naming a promote of
  a hidden file. Do this one FIRST (Brian, 2026-07-23).
actor: claude-main-viewauthoring
timestamp: '2026-07-23T18:00:55.514Z'
---
[tasks/ui-view-headless-verify](ui-view-headless-verify.md)
