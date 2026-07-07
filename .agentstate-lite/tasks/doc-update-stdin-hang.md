---
type: Task
title: >-
  Bug: doc update without --body/--body-file blocks forever reading stdin
  (non-TTY)
status: done
priority: '1'
description: >-
  FIXED 2026-07-06, commit 4ee28ba (STATUS item 45). Root cause: doc update's
  body-resolution read stdin to EOF unconditionally when both body flags were
  absent; a held-open never-written pipe (the agent-harness default fd 0)
  blocked forever before any request was sent. Fix: stdin fallback now gated on
  NO other patch field being given — field-only patches never touch stdin; 'cat
  body.md | doc update <id>' (no other flags) preserved. doc write deliberately
  unchanged (stdin is its primary documented body channel; rationale in doc.ts
  header). 2 subprocess regression tests. Fixed by a delegated Sonnet 5 agent,
  reviewed + independently re-verified (~0.1s on the incident shape). THIS
  status flip was itself run without any stdin redirect as the live production
  verification.
timestamp: '2026-07-06T14:27:10.677Z'
---

