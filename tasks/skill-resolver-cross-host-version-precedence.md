---
type: Task
title: >-
  Skill resolver: cross-host CLI version selection (sort -V shadows by host
  prefix, not version)
status: todo
priority: '3'
description: >-
  [VERIFIED 2026-07-19, KEEP — still accurate]
  packages/cli/src/skill-render.ts:88 still ends the generated resolver with
  'done | sort -V | tail -1' over full discovered paths (unchanged); the
  module's own doc comment (lines 799-808) now explicitly documents the exact
  limitation this task names: 'sort -V | tail -1 picks whichever matched path
  sorts last — a true highest version pick only among matches sharing the same
  root... across DIFFERENT roots (direct vs cache, Claude vs Codex) it is a
  best-effort, path-ordered pick, not a true cross-host version comparison.' The
  related-but-different tasks/hook-install-relocatable-home (env-var-aware host
  homes) is done and separate from this task's precedence decision, which has
  not been made or implemented. From the cross-host resolver PR review (Finding
  2, LOW). The generated skill resolver picks the CLI via 'ls -d <host globs> |
  sort -V | tail -1', which sorts WHOLE paths — so the host/prefix dominates the
  version, not the version itself. FIX NEEDS A PRECEDENCE DECISION FIRST: when a
  machine has several installs, which wins — the current host, the
  globally-highest version, or PATH-then-newest? Then implement version-correct
  selection (extract the version segment before sorting) or codify the chosen
  rule in the resolver.
actor: mike/claude
timestamp: '2026-07-19T13:11:02.196Z'
---

