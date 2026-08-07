---
type: Task
title: Replace review chronology in source comments with stable rationale
status: in_progress
priority: '3'
description: >-
  PR #98 completed the original sweep, but its remaining-eight inventory became
  stale. A 2026-08-07 read-only catalog found 29 current grouped sites: 20
  review or PR chronology labels, 3 obvious narration sites, and 6 overlong
  historical blocks. PR #215 is the first bounded follow-up at a9f380b: it
  rewrites concise chronology and phase labels across 50 TypeScript files while
  preserving safety and architectural rationale. Comment-free AST parity is
  50/50 and npm run check passes. Remaining work is one separate compression PR
  for the six larger blocks: board-git cursor, legacy View migration script,
  RemoteBackend, doc command family, UI query interceptor, and legacy View
  naming. No currently false source claims were verified.
actor: openai/codex
timestamp: '2026-08-07T23:43:47.368Z'
---

