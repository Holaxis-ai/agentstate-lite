---
type: Task
title: >-
  A --dir path that isn't a bundle root errors with 'init --dir <same>',
  steering toward a divergent second bundle
status: done
priority: '2'
assignee: openai/codex
description: >-
  Shipped in PR #187 on 2026-08-02 as merge
  c0b0eb9beeaaec668889de1c56ff64c716528ebc. Explicit --dir accepts either a
  bundle root or a project directory containing a direct .agentstate-lite
  bundle; invalid nested paths point to the existing enclosing bundle instead of
  suggesting a divergent init and never silently retarget an ancestor.
  Independent review first found stale literal-root guidance; the help/comments
  were corrected and exact-SHA re-review approved with no findings. Focused
  tests, the full local repository gate, and Node 20/22/26 CI all passed.
actor: openai/codex
timestamp: '2026-08-02T15:05:26.901Z'
---

