---
type: Task
title: >-
  Build the collaborative task-board View (read + human write-back) — the visual
  UX
description: >-
  CHANGES REQUIRED after independent review of PR #133 at
  fc9474c7b7d1cfa64002f4b1ccc8c66f0dc38e1f (context-notes/pr-133-review). Three
  Chromium-reproduced defects: canceled Tasks are counted but hidden and cannot
  reach the View's own Reopen action; a valid Task id 'constructor' with a
  dependency crashes refresh because bundle ids index an ordinary object; and
  trusted-shell cancellation status 'cancelled' is styled as an error due to a
  spelling mismatch. Exact-SHA CI is green; detached root build, focused 26/26
  contract tests, 12/12 shell/action tests, committed E2E 1/1, and
  quick-edit/escaping probes pass. Keep in_progress until fixes and exact-SHA
  re-review.
actor: codex-reviewer
status: in_progress
priority: '2'
timestamp: '2026-07-21T13:06:49.538Z'
---
[depends on the settled schema](task-system-kind-design.md)
