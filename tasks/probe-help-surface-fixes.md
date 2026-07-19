---
type: Task
title: Help-surface truth fixes from the cold-start probe (findings 2-4)
description: >-
  Shipped in PR #125 (merge da16b3dcf063899851df811f5a9d0d1ebc4b69a1). The safe
  body-edit help cycle now uses an explicit path-outside-bundle placeholder; its
  executable test substitutes a unique scratch path and cannot overwrite or
  delete a shared temp file. Doc history help names backend dependence, and link
  help is sliced into focused verb surfaces. The branch incorporated PR #124
  without losing its target-absence guidance. Focused tests and full npm run
  check passed locally; CI passed on Node 20, 22, and 26.
actor: mike/codex
status: done
timestamp: '2026-07-19T16:43:41.620Z'
---

