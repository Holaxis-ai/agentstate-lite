---
type: Task
title: >-
  Lint: a View/Page registry doc whose 'entry' points at a never-promoted blob
  is written and rendered silently
status: todo
priority: '2'
assignee: ''
description: >-
  FOUND 2026-07-23 during the view-authoring investigation; independently
  confirmed by TWO adversarial design reviews (architecture + OKF/interop) as
  the one genuinely open, convention-independent authoring gap.


  VERIFIED (both reviewers, against code): 'new "View"' writes 'entry' as an
  ordinary kind field (commands/new.ts:517-522) with NO check that the named
  blob exists; nothing in status.ts or the ui-server render path warns either. A
  registry doc pointing at a never-promoted (or typo'd) blob key is accepted
  silently and mints a view that serves nothing. This is the mirror of the
  coordination burden in the documented 4-step authoring flow: blob key and
  registry 'entry' must match by hand across two commands.


  WHY A LINT AND NOT A CREATE-VERB CHECK (adjudicated across two reviews): a
  check inside a new authoring verb only protects users of that verb; a LINT
  over recognized type:View/Page docs catches hand-written 'doc write' docs,
  externally-authored bundles, and post-hoc blob deletions too. Recognition is
  already convention-independent (core's isPageTypeName/parseRegistration), so
  the lint privileges no kind by name and needs no convention declared — gate-3
  clean.


  PROPOSED IMPLEMENTATION: in 'status' (a new counter, e.g.
  dangling_view_entries, with rows naming registry id -> missing entry key), and
  optionally surfaced at 'ui' launch. Read-side only; no write-path change.


  DONE WHEN: 'status' on a bundle containing a type:View doc whose entry names a
  nonexistent blob reports it by id and key; a bundle with all entries
  resolvable reports zero; externally-authored (conventions-free) bundles get
  the same signal.
actor: claude-main-viewauthoring
timestamp: '2026-07-23T18:42:08.056Z'
---

