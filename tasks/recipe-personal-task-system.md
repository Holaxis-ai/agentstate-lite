---
type: Task
title: 'First shipped recipe: Personal Task System (agent-first, UI-writable)'
description: >-
  THE first minimally-usable shipped recipe (release-push non-negotiable #3).
  DECIDED 2026-07-20: HAND-AUTHOR it, using the founder's real, private,
  battle-tested task bundle as a REFERENCE IMPLEMENTATION — generalize /
  simplify / change for a general user, NOT a verbatim extraction (automated
  recipe-export is deferred; see tasks/recipe-export). Instance-free by
  hand-authoring: carry structure only (Task kind + conventions + Views), zero
  private data. CENTERPIECE (Mike's emphasis): a VERY GOOD visual UX/UI for a
  HUMAN-AGENT COLLABORATIVE task system — a well-designed task board/dashboard
  View where the human marks done / edits and the agent and human work the SAME
  data live. That collaboration loop is the product's differentiator and the
  demo; the visual quality is the point, not a checklist. BUILD NOTE: the UI
  write-back UX is NOT yet implemented — #109 shipped the trusted-View-action
  MECHANISM (a View proposes a Kind-declared scalar change, human-confirmed in
  shell chrome, CAS-committed), but no bundle authors a good task-board View
  that USES it. So the real work is authoring that write-back experience well,
  on top of #109's plumbing — not merely testing #109. Deliverable: a
  hand-authored recipe folder (recipe.md + conventions/*.md + views/)
  installable via recipe add, whose task-board View supports human write-back
  with excellent UX. Parent: roadmap-items/recipe-plugins.
actor: mike/claude
status: todo
priority: '1'
timestamp: '2026-07-20T21:19:07.146Z'
---
[the first shipped recipe](../roadmap-items/recipe-plugins.md)

[doubles as the portability proof (bundle -> data-free recipe)](prove-recipe-plugin-sharing.md)

[working-memory layer is the next increment on top](../research/ai-power-user-patterns.md)

[export is the portable way to extract this recipe (vs hand-author)](recipe-export.md)
