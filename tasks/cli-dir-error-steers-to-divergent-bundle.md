---
type: Task
title: >-
  A --dir path that isn't a bundle root errors with 'init --dir <same>',
  steering toward a divergent second bundle
status: in_progress
priority: '2'
assignee: openai/codex
description: >-
  Implementation is in draft PR #187 at commit b91a820. Explicit --dir now
  accepts either a bundle root or a project directory containing
  .agentstate-lite; invalid nested paths point to the existing enclosing bundle
  instead of suggesting a divergent init. Focused tests and the full repository
  gate pass. Awaiting independent exact-SHA review.
actor: openai/codex
timestamp: '2026-08-02T14:41:48.324Z'
---

