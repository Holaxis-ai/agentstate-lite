---
type: Task
title: >-
  Automated mutation testing (Stryker, core+cli): measure the suite's kill rate,
  file survivors
status: done
priority: '2'
description: >-
  SHIPPED — PR #89 merged at a0aba13d12eab991dcc4b31799f3aa46b9b10c7c from
  independently reviewed exact head 69cabee01ba8bf36ed761ffc29af04853a722e41.
  Full CI passed on Node 22/26 plus Node 20 CLI smoke; an independent scoped run
  reproduced 135 mutants, 76.30% score, and byte-and-mode-exact source
  restoration. Nonblocking follow-ups remain optional: narrow the reporter's
  exit-0 wording and harden incremental-cache save semantics.
actor: mike/codex
assignee: claude-fable-5
timestamp: '2026-07-18T02:41:56.878Z'
---
Branch mutation-testing GREEN and reviewed — ready for PR. Commits: 8e58859 (the unit; independently reviewed PASS, high confidence — score math verified byte-identical to Stryker's clear-text, cwd-pin exit-ordering confirmed against the actual hook incl. the forceBail signal path, inPlace restore proven byte-and-mode clean, CI proven read-only) + 69cabee (the review's two hardenings: env-quoted mutate dispatch input — anti-injection — and a summary step that tolerates a missing report).

What shipped: Stryker 9.6.1 + tap-runner over the repo's own node --test ts-loader; per-package configs (inPlace; cli buildCommand once post-instrumentation so mutants reach the dist-spawning tests); scripts/stryker-cwd-pin.cjs (exit-handler-order fix for chdir-ing tests); scripts/mutation-survivors.mjs + tests (named-gap extractor, in test:scripts); mutation-tests.yml (weekly + dispatch, never a PR gate, incremental cache, artifacts, survivors in job summary); CLAUDE.md + gitignore.

First measurements (scoped smokes): core paths.ts score 76.30 (26 survivors + 6 no-coverage), cli actor.ts score 75.86. Real gaps already named.

Remaining: human opens+merges PR (description delivered); first scheduled/dispatch run sizes the full-suite cost; recurring survivors get filed as board tasks (manual, by design). Flip to done at merge.
