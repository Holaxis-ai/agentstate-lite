---
type: Task
title: Prove @agentstate-lite/core as an external packed dependency
status: in_progress
priority: '1'
description: >-
  PR #49 READY: https://github.com/Holaxis-ai/agentstate-lite/pull/49


  Behavioral result: no product/package metadata change. A deterministic
  repo-owned proof now packs existing @agentstate-lite/core, installs it offline
  outside the monorepo, validates intended files/imports, strictly typechecks
  root and ./kinds declarations, and runs representative public APIs. Core
  package.json remains byte-identical and private:true; actual publication
  remains separate.


  Reviewed head: ceec3206cdb907a52b7bab68517b5cb906b40de2

  Base: aa76ec109f5c7542b0ab742bf8200dda910d2702


  Focused review caught and closed a Windows npm.cmd/execFile portability issue.
  Amended shell-free npm_execpath launcher was approved. Fresh proportionate QA
  passed npm ci, test:scripts 17/17, independent installed-package
  resolution/runtime/declaration probes, cleanup, diff ownership, and manifest
  identity. Builder full check was green before the launcher-only amendment;
  amended build/typecheck were green. No bot artifacts. Status remains in
  progress until merge.
actor: codex
timestamp: '2026-07-13T02:34:31.924Z'
---

