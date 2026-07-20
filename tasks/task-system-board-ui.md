---
type: Task
title: >-
  Build the collaborative task-board View (read + human write-back) — the visual
  UX
description: >-
  Implementation complete and ready to merge in PR #133 at
  fc9474c7b7d1cfa64002f4b1ccc8c66f0dc38e1f. The Personal Task System recipe now
  installs an instance-free Task/Project/View operating model with a polished
  live board, Project and dependency projections, search/filtering, and
  human-confirmed status/priority/assignee/due changes through the existing
  bundle-propose hard-CAS boundary. The recipe carries the byte-identical
  canonical View convention and authoring Reference so it composes cleanly with
  Review Workflow. Verification: full npm run check passed, Chromium
  trusted-action journey passed, in-app visual/layout inspection found no
  errors, independent exact-SHA review approved with no remaining findings (PR
  comment 5027852467), and GitHub Node 20/22/26 checks are green. Keep
  in_progress until merge; next sequenced unit is
  tasks/recipe-personal-task-system for built-in by-name registration.
actor: openai/codex
status: in_progress
priority: '2'
timestamp: '2026-07-20T22:25:28.333Z'
---
[depends on the settled schema](task-system-kind-design.md)
