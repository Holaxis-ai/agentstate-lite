---
type: Task
title: Verify the npm CLI artifact before publication
status: done
priority: '1'
description: >-
  Add one reproducible npm package verification command that builds and packs
  the CLI, enforces the publish allowlist and zero-runtime-dependency boundary,
  installs the tarball into an isolated user prefix, resolves both short bins
  from PATH, exercises a representative offline bundle workflow, and proves
  packaging leaves plugin artifacts untouched. Wire the proof into the
  repository check and the publish lifecycle. No publication, release workflow,
  plugin thinning, or core/server publication in this unit.
actor: mike/codex
timestamp: '2026-07-15T21:54:10.035Z'
---

