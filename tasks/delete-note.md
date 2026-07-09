---
type: Task
title: 'Delete the note command; context-notes = default recipe, zero privilege'
status: done
priority: '1'
description: >-
  Delete note (CLI command + core note.ts:
  noteToDoc/docToNote/noteId/renderNoteBody/readNote/ContextNote), KEEP the
  generic splitSections. Relocate CONTEXT_NOTE_TYPE into the context-notes
  recipe; make core fully convention-agnostic (no 'Context Note' reference in
  the engine). Migrate/delete note tests; prove existing Context Note docs still
  read/edit via generic doc read/doc update. Context-notes ends with ZERO
  privilege — authored via new 'Context Note' + doc update/doc write. DECISION
  (human 2026-07-03): delete BEFORE parity; do NOT build a generic replacement
  speculatively. Depends on Unit A (recipe-zero).
timestamp: '2026-07-03T16:25:01.458Z'
---

