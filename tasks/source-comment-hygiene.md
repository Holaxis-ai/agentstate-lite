---
type: Task
title: Replace review chronology in source comments with stable rationale
status: in_progress
priority: '3'
description: >-
  PR #98 completed the original sweep, but its remaining-eight inventory became
  stale. A 2026-08-07 read-only catalog found 29 current grouped sites. Two
  independent comment-only follow-ups now cover the full catalog. PR #215 at
  a9f380b rewrites concise review, finding, and phase labels across 50
  TypeScript files while preserving their invariants; comment-free AST parity is
  50/50 and npm run check passes. PR #216 at 1e0f2e2 compresses the six larger
  historical blocks in board-git cursor, RemoteBackend, the doc dispatcher, the
  UI interceptor, legacy View naming, and the legacy-name migration script; it
  removes 153 net comment lines, has comment-free AST parity across all 6 files,
  and npm run check passes. The task can close after both PRs merge.
actor: openai/codex
timestamp: '2026-08-07T23:52:48.001Z'
---

