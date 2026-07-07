---
type: Task
title: >-
  Project-scoped bundle discovery: a committed pointer so agents find the board
  with zero prior context
status: done
priority: '1'
description: >-
  SHIPPED (commit follows 2d8f340; 2026-07-06). The committed .agentstate.json
  pointer is live: {"bundle": "<url-or-path>"}, walk-up discovery (git-style),
  precedence explicit flags > env > binding > cwd walk, relative paths resolve
  against the FILE's directory (clone-portable), malformed = loud USAGE naming
  the file. Key design call (reviewed, correct): URL-type bindings consumed by
  resolveRemoteFlag so serve/home/ui-local keep their documented
  offline/local-only invariants (they annotate, never fetch); dir-type consumed
  by openBundle's fallback (network-free for all callers). home/whoami surface
  the binding. 24 new tests (precedence matrix, walk-up, portability, malformed,
  E2E bare-command-to-served-bundle keyless). Verified independently: bare
  'list' from a nested cwd with zero flags/env/context resolves the bound
  bundle; malformed file errors with fix hint. Built by delegated Sonnet 5
  (no-spawn); orchestrator reviewed diff + reran gates (cli 375, core 221,
  server 5, ui 30, viewer 4, worker 117; drift gates green). UNBLOCKS: the
  git-first board migration (the pointer names the clone; sessions become
  memory-free). First unit closed entirely under the board-first records
  convention.
timestamp: '2026-07-06T17:04:31.242Z'
---

