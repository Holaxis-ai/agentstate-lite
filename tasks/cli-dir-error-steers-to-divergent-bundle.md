---
type: Task
title: >-
  A --dir path that isn't a bundle root errors with 'init --dir <same>',
  steering toward a divergent second bundle
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  PR #187 is ready at exact commit 2a787553a6c99f23e8e1828340315f717ce9b181.
  Explicit --dir accepts either a bundle root or a project directory containing
  a direct .agentstate-lite bundle; invalid nested paths point to the existing
  enclosing bundle instead of suggesting a divergent init and never silently
  retarget an ancestor. Independent review first found stale literal-root
  guidance; the help/comments were corrected and exact-SHA re-review approved
  with no findings. Focused tests, the full local repository gate, and Node
  20/22/26 CI all pass. Awaiting merge.
actor: openai/codex
timestamp: '2026-08-02T14:57:08.189Z'
---

