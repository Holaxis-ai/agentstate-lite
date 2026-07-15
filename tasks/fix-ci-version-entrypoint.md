---
type: Task
title: Fix CI version automation entrypoint
status: in_progress
priority: '1'
description: >-
  Correct the post-merge regression from PR #71: the bot invokes
  scripts/ci-version-bundle.mjs directly, but the shell-free UI build now
  requires npm_execpath. Add one npm-owned bot entrypoint, make the workflow
  call it, and regression-pin that exact command. Reproduce the bot path, run
  the full repository gate, and independently review the exact SHA.
actor: mike/codex
timestamp: '2026-07-15T22:10:55.136Z'
---
[fixes](verify-npm-package.md)
